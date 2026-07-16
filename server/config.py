"""读取 .env 文件中的所有配置项，集中管理"""
from pydantic_settings import BaseSettings


DEFAULT_JWT_SECRET = "change-me-in-production"


class Settings(BaseSettings):
    # 运行环境：development / test / production
    environment: str = "development"

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

    def is_production(self) -> bool:
        """是否以生产模式运行。"""
        return self.environment.strip().lower() in {"prod", "production"}

    def validate_runtime_security(self) -> None:
        """
        启动期安全门槛。

        本地开发允许使用默认 JWT 密钥；生产环境必须显式设置足够长的 JWT_SECRET_KEY，
        防止误用仓库里的开发默认值签发可伪造令牌。
        """
        if not self.is_production():
            return

        jwt_secret = self.jwt_secret_key.strip()
        if jwt_secret == DEFAULT_JWT_SECRET or len(jwt_secret) < 32:
            raise RuntimeError(
                "JWT_SECRET_KEY is unsafe for production: replace "
                f"{DEFAULT_JWT_SECRET!r} with a random secret of at least 32 characters."
            )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
