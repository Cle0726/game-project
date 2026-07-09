from fastapi import APIRouter, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, TeaBreakLog
from schemas import TeaBreakRequest, TeaBreakResponse
from services.ai_service import stream_chat_with_musicart

router = APIRouter()

@router.post("/dev-chat")
async def tea_break_dev_chat(req: TeaBreakRequest):
    """
    开发调试接口：不依赖登录和数据库，便于快速验证不同角色的人设回复。
    """
    return StreamingResponse(stream_chat_with_musicart(req), media_type="text/event-stream")

async def chat_generator_wrapper(req: TeaBreakRequest, user_id: int, db: Session):
    dialogue_buffer = ""
    meta_data = None
    
    async for event in stream_chat_with_musicart(req):
        yield event
        # 手动解析 event 捕获数据持久化
        if event.startswith("event: text\ndata:"):
            try:
                import json
                data_str = event.split("data: ", 1)[1].strip()
                dialogue_buffer += json.loads(data_str)
            except:
                pass
        elif event.startswith("event: meta\ndata:"):
            try:
                import json
                data_str = event.split("data: ", 1)[1].strip()
                meta_data = json.loads(data_str)
            except:
                pass

    # 存入数据库
    if meta_data:
        try:
            log = TeaBreakLog(
                user_id=user_id,
                character=req.character,
                context_type=req.context.context_type,
                player_message=req.player_message,
                ai_reply={
                    "dialogue": dialogue_buffer,
                    "effects": meta_data.get("effects", []),
                    "mood": meta_data.get("mood", "neutral"),
                    "flagEvent": meta_data.get("flagEvent"),
                },
                trust_before=req.context.trust,
                resonance_before=req.context.resonance,
                pressure_before=req.context.pressure,
            )
            db.add(log)
            db.commit()
        except Exception as e:
            print(f"[Router] 保存日志失败: {e}")

@router.post("/chat")
async def tea_break_chat(
    req: TeaBreakRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    AI 茶歇对话接口。流式响应。
    """
    return StreamingResponse(chat_generator_wrapper(req, user.id, db), media_type="text/event-stream")

@router.get("/history")
def get_tea_break_history(
    character: str,
    limit: int = 20,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取与指定律者的茶歇对话历史"""
    logs = (
        db.query(TeaBreakLog)
        .filter(TeaBreakLog.user_id == user.id, TeaBreakLog.character == character)
        .order_by(TeaBreakLog.created_at.desc())
        .limit(limit)
        .all()
    )
    # 按时间正序返回
    return {"history": [{"role": "user", "content": log.player_message, "created_at": log.created_at} for log in reversed(logs)]}
