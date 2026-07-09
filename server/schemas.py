"""Pydantic 模型 —— 精确定义前后端交互的数据格式"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


# ==================== 认证相关 ====================

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)
    display_name: Optional[str] = Field("奏者", max_length=50)


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    token: str
    display_name: str
    user_id: int


# ==================== 存档相关 ====================

class SaveUploadRequest(BaseModel):
    slot_name: str = Field(..., description="存档槽名：autosave / save_slot_1 / ...")
    chapter_label: str = Field("未知章节")
    play_time_seconds: int = Field(0, ge=0)
    game_state: dict = Field(..., description="完整的 GameState JSON 对象")


class SaveSummary(BaseModel):
    slot_name: str
    chapter_label: str
    play_time_seconds: int
    updated_at: datetime

    class Config:
        from_attributes = True


class SaveListResponse(BaseModel):
    saves: list[SaveSummary]


class SaveDownloadResponse(BaseModel):
    slot_name: str
    game_state: dict
    chapter_label: str
    play_time_seconds: int
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== AI 茶歇相关 ====================

class TeaBreakContext(BaseModel):
    context_type: str = Field("A", description="语境：A~E")
    chapter_context: str = Field("旅途中")
    trust: int = Field(0, ge=0, le=100)
    resonance: int = Field(0, ge=0, le=100)
    pressure: int = Field(0, ge=0, le=100)
    conductor_gender: str = Field("未标注")
    conductor_health_tier: str = Field("良好")
    triggered_events: list[str] = Field(default_factory=list)
    recent_behaviors: list[Any] = Field(default_factory=list)


class ConversationMessage(BaseModel):
    role: str
    content: str


class TeaBreakRequest(BaseModel):
    character: str = Field(..., description="对话角色：阿缇娅/弥洛/槐序/洛温/伊芙白/明弦")
    player_message: str = Field(..., min_length=1, max_length=500)
    context: TeaBreakContext
    conversation_history: list[ConversationMessage] = Field(default_factory=list)


class TeaBreakEffect(BaseModel):
    stat: str
    delta: int = Field(..., ge=-5, le=5)


class TeaBreakResponse(BaseModel):
    dialogue: str
    effects: list[TeaBreakEffect]
    mood: str
    flagEvent: Optional[str] = None
    fallback: bool = False


# ==================== 抽卡记录相关 ====================

class GachaRecordRequest(BaseModel):
    item_id: str
    rarity: str = Field(..., pattern=r"^(R|SR|SSR)$")


class GachaRecordResponse(BaseModel):
    id: int
    item_id: str
    rarity: str
    created_at: datetime

    class Config:
        from_attributes = True
