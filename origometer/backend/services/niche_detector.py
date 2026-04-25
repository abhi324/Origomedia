"""
Auto-detect creator niche from bio + keywords.
Returns a list of matched niches ranked by confidence.
"""
from typing import Optional
import re

NICHE_TAXONOMY: dict[str, list[str]] = {
    "beauty": [
        "beauty", "makeup", "cosmetics", "glam", "eyeshadow", "mascara",
        "lipstick", "contouring", "highlighter", "blush", "mua",
        "makeupartist", "makeuptutorial",
    ],
    "skincare": [
        "skincare", "skin care", "moisturiser", "moisturizer", "serum",
        "spf", "sunscreen", "retinol", "hyaluronic", "acne", "glow",
        "skintok", "cleansing", "toner", "essence", "derma",
    ],
    "haircare": [
        "haircare", "hair care", "hair", "curls", "natural hair",
        "hairstyle", "haircolor", "blowout", "extensions", "tresses",
    ],
    "lifestyle": [
        "lifestyle", "daily routine", "day in my life", "morning routine",
        "self care", "wellness", "balance", "mindful",
    ],
    "fashion": [
        "fashion", "ootd", "outfit", "style", "clothing", "streetwear",
        "couture", "trends", "lookbook", "styleinspo",
    ],
    "fitness": [
        "fitness", "workout", "gym", "pilates", "yoga", "bodybuilding",
        "health", "nutrition", "weightloss", "fit",
    ],
    "travel": [
        "travel", "wanderlust", "adventure", "explore", "globetrotter",
        "travelblogger", "vacation", "destination",
    ],
    "food": [
        "food", "recipe", "cooking", "baking", "foodie", "chef",
        "restaurant", "snack", "cuisine",
    ],
}


def detect_niche(
    bio: Optional[str] = None,
    profile_name: Optional[str] = None,
    username: Optional[str] = None,
) -> list[dict]:
    """Return list of {niche, score} sorted by score descending."""
    corpus = " ".join(
        filter(None, [bio, profile_name, username])
    ).lower()
    corpus = re.sub(r"[^\w\s]", " ", corpus)

    scores: dict[str, int] = {}
    for niche, keywords in NICHE_TAXONOMY.items():
        hits = sum(1 for kw in keywords if kw in corpus)
        if hits:
            scores[niche] = hits

    if not scores:
        return [{"niche": "general", "score": 1}]

    total = sum(scores.values())
    return sorted(
        [{"niche": n, "score": round(c / total, 2)} for n, c in scores.items()],
        key=lambda x: x["score"],
        reverse=True,
    )


def primary_niche(bio: Optional[str] = None, **kwargs) -> str:
    results = detect_niche(bio=bio, **kwargs)
    return results[0]["niche"] if results else "general"
