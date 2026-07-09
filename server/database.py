"""数据库连接引擎 + 会话管理"""
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from config import settings

def _custom_json_serializer(obj):
    """自定义 JSON 序列化器，关闭 ensure_ascii 以防止中文变成 \\uXXXX"""
    return json.dumps(obj, ensure_ascii=False)

# 创建数据库引擎
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    echo=False,
    json_serializer=_custom_json_serializer,
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 声明基类
class Base(DeclarativeBase):
    pass


# FastAPI 依赖注入：每个请求自动获取数据库连接，请求结束自动关闭
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
