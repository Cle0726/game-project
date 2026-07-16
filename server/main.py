"""后端入口文件 —— 组装所有模块，启动服务器"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import engine, Base
from routers import auth_router, save_router, teabreak_router, gacha_router

# 生产启动安全门槛：默认 JWT 密钥等危险配置必须在服务启动前被拦截。
settings.validate_runtime_security()

# 创建数据库表（如果不存在的话）
Base.metadata.create_all(bind=engine)

# 创建 FastAPI 应用
app = FastAPI(
    title="宿命回响：残响之途 — 后端服务",
    description="为游戏提供 AI 茶歇、云存档、账号认证等后端能力",
    version="1.0.0",
)

# 跨域配置（开发环境允许前端 Vite 访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite 默认端口
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载各模块路由
app.include_router(auth_router.router,     prefix="/api/auth",     tags=["认证系统"])
app.include_router(save_router.router,     prefix="/api/save",     tags=["云存档"])
app.include_router(teabreak_router.router, prefix="/api/teabreak", tags=["AI茶歇"])
app.include_router(gacha_router.router,    prefix="/api/gacha",    tags=["残响档案"])


@app.get("/", tags=["系统"])
def root():
    return {
        "message": "宿命回响：残响之途 — 后端系统已启动",
        "docs": "访问 /docs 查看交互式 API 文档",
    }
