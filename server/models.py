"""数据库表结构定义 —— 4 张核心表"""
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    """玩家账号表"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(128), nullable=False)
    display_name = Column(String(50), default="奏者")
    conductor_gender = Column(String(10), default="unspecified")
    created_at = Column(DateTime, default=_utcnow)
    last_login = Column(DateTime, default=_utcnow)

    saves = relationship("GameSave", back_populates="user", cascade="all, delete-orphan")
    tea_break_logs = relationship("TeaBreakLog", back_populates="user", cascade="all, delete-orphan")
    gacha_records = relationship("GachaRecord", back_populates="user", cascade="all, delete-orphan")


class GameSave(Base):
    """云存档表 —— 直接存储前端 GameState 的完整 JSON"""
    __tablename__ = "game_saves"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    slot_name = Column(String(50), nullable=False)
    game_state = Column(JSON, nullable=False)
    chapter_label = Column(String(100), default="未知章节")
    play_time_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    user = relationship("User", back_populates="saves")


class TeaBreakLog(Base):
    """茶歇对话记录表"""
    __tablename__ = "tea_break_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    character = Column(String(20), nullable=False)
    context_type = Column(String(5), default="A")
    player_message = Column(Text, nullable=False)
    ai_reply = Column(JSON, nullable=True)
    trust_before = Column(Integer, default=0)
    resonance_before = Column(Integer, default=0)
    pressure_before = Column(Integer, default=0)
    created_at = Column(DateTime, default=_utcnow)

    user = relationship("User", back_populates="tea_break_logs")


class GachaRecord(Base):
    """残响档案抽取记录"""
    __tablename__ = "gacha_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    item_id = Column(String(50), nullable=False)
    rarity = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=_utcnow)

    user = relationship("User", back_populates="gacha_records")
