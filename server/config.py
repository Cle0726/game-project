"""读取 .env 文件中的所有配置项，集中管理"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 数据库
    database_url: str = "sqlite:///./game_data.db"

    # DeepSeek AI
    deepseek_api_key: str = ""
    deepseek_base_url: str = "https://api.deepseek.com"
    deepseek_model: str = "deepseek-chat"

    # JWT 认证
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 72

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
