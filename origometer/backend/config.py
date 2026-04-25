from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # All optional — app runs in demo (in-memory) mode if Supabase not set
    supabase_url: str = ""
    supabase_key: str = ""
    redis_url: str = "redis://localhost:6379"
    serpapi_key: str = ""
    scraping_bee_key: str = ""
    environment: str = "development"
    secret_key: str = "change-me"
    admin_api_key: str = "demo-admin-key"

    # Scraping behaviour
    request_delay_min: float = 2.0
    request_delay_max: float = 6.0
    max_retries: int = 3
    cache_ttl_seconds: int = 3600

    @property
    def demo_mode(self) -> bool:
        return not (self.supabase_url and self.supabase_key)

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
