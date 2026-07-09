"""残响档案抽取记录路由"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, GachaRecord
from schemas import GachaRecordRequest, GachaRecordResponse

router = APIRouter()


@router.post("/record", response_model=GachaRecordResponse, status_code=201)
def record_gacha(
    req: GachaRecordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """记录一次残响档案抽取"""
    record = GachaRecord(
        user_id=user.id,
        item_id=req.item_id,
        rarity=req.rarity,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/history")
def gacha_history(
    limit: int = 50,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取抽取历史记录"""
    records = (
        db.query(GachaRecord)
        .filter(GachaRecord.user_id == user.id)
        .order_by(GachaRecord.created_at.desc())
        .limit(limit)
        .all()
    )
    return {
        "records": [
            {
                "id": r.id,
                "item_id": r.item_id,
                "rarity": r.rarity,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in records
        ],
        "total": len(records),
    }


@router.get("/stats")
def gacha_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取抽取统计（各稀有度数量）"""
    records = db.query(GachaRecord).filter(GachaRecord.user_id == user.id).all()
    stats = {"R": 0, "SR": 0, "SSR": 0, "total": 0}
    for r in records:
        stats[r.rarity] = stats.get(r.rarity, 0) + 1
        stats["total"] += 1
    return stats
