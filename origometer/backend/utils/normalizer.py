"""
Convert human-readable metric strings to integers.
Examples: "42.5K" → 42500 | "1.2M" → 1200000 | "3.4B" → 3400000000
"""
import re
import statistics


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


def trimmed_mean(values: list[int], trim_pct: float = 0.1) -> int:
    """
    Mean of `values` after dropping the top and bottom `trim_pct` fraction.
    This matches what industry analytics tools (HypeAuditor, Modash, Phlanx)
    use for "average likes / comments per post" — robust to one viral post
    or one dead post, without throwing away real engagement the way median does.

    For small samples (≤4) the trim degenerates to plain mean.
    Returns 0 for an empty list.
    """
    if not values:
        return 0
    sorted_vals = sorted(values)
    n = len(sorted_vals)
    k = int(n * trim_pct)
    # Don't trim away the entire sample on tiny lists.
    if n - 2 * k < 1:
        k = 0
    trimmed = sorted_vals[k : n - k] if k > 0 else sorted_vals
    return int(statistics.mean(trimmed))
