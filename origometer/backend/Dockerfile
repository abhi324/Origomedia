# Pin to Debian 12 (bookworm) — Debian 13 (trixie) breaks Playwright 1.44's
# Ubuntu-20.04 fallback dep list (ttf-unifont / ttf-ubuntu-font-family removed).
FROM python:3.12-slim-bookworm

WORKDIR /app

# System libs Chromium needs at runtime. We install these manually instead of
# letting `playwright install --with-deps` do it, because Playwright's bundled
# script targets Ubuntu package names that don't all map cleanly to Debian.
RUN apt-get update && apt-get install -y --no-install-recommends curl wget gnupg ca-certificates libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 libwayland-client0 fonts-liberation fonts-noto-color-emoji fonts-unifont && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Just the browser binary; system deps are already installed above.
RUN playwright install chromium

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
