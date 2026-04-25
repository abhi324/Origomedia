"""
Convert human-readable metric strings to integers.
Examples: "42.5K" → 42500 | "1.2M" → 1200000 | "3.4B" → 3400000000
"""
import re


def parse_metric(value: str | int | None) -> int | None:
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)

    raw = str(value).strip().replace(",", "").replace(" ", "")
    if not raw:
        return None

    multipliers = {"k": 1_000, "m": 1_000_000, "b": 1_000_000_000}
    match = re.match(r"^([\d.]+)([kmb])?$", raw.lower())
    if not match:
        # Try stripping non-numeric chars and parsing
        digits = re.sub(r"[^\d]", "", raw)
        return int(digits) if digits else None

    number = float(match.group(1))
    suffix = match.group(2)
    if suffix:
        number *= multipliers[suffix]
    return int(number)


def format_metric(value: int | None) -> str:
    if value is None:
        return "N/A"
    if value >= 1_000_000_000:
        return f"{value / 1_000_000_000:.1f}B"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.1f}M"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K"
    return str(value)


def calculate_engagement_rate(
    likes: int | None,
    comments: int | None,
    followers: int | None,
) -> float | None:
    if not followers or followers == 0:
        return None
    interactions = (likes or 0) + (comments or 0)
    return round((interactions / followers) * 100, 2)
