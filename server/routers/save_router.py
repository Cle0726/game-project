"""云存档路由 —— 列表 / 上传 / 下载 / 删除"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, GameSave
from schemas import (
    SaveUploadRequest,
    SaveListResponse,
    SaveSummary,
    SaveDownloadResponse,
)

router = APIRouter()


@router.get("/list", response_model=SaveListResponse)
def list_saves(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取当前玩家的所有存档概要"""
    saves = (
        db.query(GameSave)
        .filter(GameSave.user_id == user.id)
        .order_by(GameSave.updated_at.desc())
        .all()
    )
    return SaveListResponse(
        saves=[
            SaveSummary(
                slot_name=s.slot_name,
                chapter_label=s.chapter_label,
                play_time_seconds=s.play_time_seconds,
                updated_at=s.updated_at,
            )
            for s in saves
        ]
    )


@router.post("/upload")
def upload_save(
    req: SaveUploadRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """上传/覆盖存档（同一 slot_name 会覆盖）"""
    existing = (
        db.query(GameSave)
        .filter(GameSave.user_id == user.id, GameSave.slot_name == req.slot_name)
        .first()
    )

    now = datetime.now(timezone.utc)

    if existing:
        # 覆盖已有存档
        existing.game_state = req.game_state
        existing.chapter_label = req.chapter_label
        existing.play_time_seconds = req.play_time_seconds
        existing.updated_at = now
    else:
        # 创建新存档
        new_save = GameSave(
            user_id=user.id,
            slot_name=req.slot_name,
            game_state=req.game_state,
            chapter_label=req.chapter_label,
            play_time_seconds=req.play_time_seconds,
            created_at=now,
            updated_at=now,
        )
        db.add(new_save)

    db.commit()
    return {
        "message": "存档已保存",
        "slot_name": req.slot_name,
        "updated_at": now.isoformat(),
    }


@router.get("/download", response_model=SaveDownloadResponse)
def download_save(
    slot_name: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """下载指定槽位的存档"""
    save = (
        db.query(GameSave)
        .filter(GameSave.user_id == user.id, GameSave.slot_name == slot_name)
        .first()
    )
    if not save:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="存档不存在")

    return SaveDownloadResponse(
        slot_name=save.slot_name,
        game_state=save.game_state,
        chapter_label=save.chapter_label,
        play_time_seconds=save.play_time_seconds,
        updated_at=save.updated_at,
    )


@router.delete("/delete")
def delete_save(
    slot_name: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """删除指定槽位的存档"""
    save = (
        db.query(GameSave)
        .filter(GameSave.user_id == user.id, GameSave.slot_name == slot_name)
        .first()
    )
    if not save:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="存档不存在")

    db.delete(save)
    db.commit()
    return {"message": "存档已删除", "slot_name": slot_name}
