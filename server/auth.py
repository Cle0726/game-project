"""密码加密 + JWT 令牌生成/验证"""
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
import jwt
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import User

# 密码加密工具（bcrypt 算法）
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer 认证方案
security = HTTPBearer()


def hash_password(password: str) -> str:
    """将明文密码加密为 bcrypt 哈希"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码是否正确"""
    return pwd_context.verify(plain_password, hashed_password)


def create_token(user_id: int) -> str:
    """为玩家创建 JWT 令牌"""
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expire_hours)
    payload = {
        "sub": str(user_id),
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI 依赖注入：自动从请求头的 Bearer Token 中解析出当前用户。
    任何需要登录才能访问的接口，只需在参数里加上：
        user: User = Depends(get_current_user)
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        user_id = int(payload.get("sub"))
    except (jwt.PyJWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="令牌无效或已过期"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在"
        )
    return user
