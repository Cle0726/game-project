"""认证路由 —— 注册 / 登录"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import hash_password, verify_password, create_token
from database import get_db
from models import User
from schemas import RegisterRequest, LoginRequest, AuthResponse

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """注册新玩家账号"""
    # 检查用户名是否已存在
    existing = db.query(User).filter(User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="用户名已存在")

    # 创建新用户
    user = User(
        username=req.username,
        hashed_password=hash_password(req.password),
        display_name=req.display_name or "奏者",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 签发 JWT 令牌
    token = create_token(user.id)
    return AuthResponse(token=token, display_name=user.display_name, user_id=user.id)


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """玩家登录"""
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误"
        )

    # 更新最后登录时间
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_token(user.id)
    return AuthResponse(token=token, display_name=user.display_name, user_id=user.id)
