"""
Analytics - Detailed usage tracking for ElevenLabs and Gemini
Based on latest 2024-2025 pricing research

ElevenLabs Pricing (Creator Plan - $22/month):
- 100,000 credits/month (≈ 200,000 characters for TTS)
- Characters: 1 credit = ~1-2 characters (model dependent)
- TTS: ~$0.00022 per character
- Voice Tools (STS): $0.30/minute overage (Creator plan)
- Instant Voice Clone: FREE (included)
- Professional Voice Clone: Requires higher plans

Gemini 2.0 Flash Pricing:
- Audio Input: $0.10 per 1M tokens
- Text Output: $0.40 per 1M tokens
- Free tier: 1500 requests/day, 1M tokens/min
- Audio: ~25 tokens per second of audio (estimate)
"""

import os
import json
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
BASE_URL = "https://api.elevenlabs.io/v1"

# Pricing constants (Updated Jan 2025)
PRICING = {
    "elevenlabs": {
        "plans": {
            "free": {"monthly_cost": 0, "credits": 10000, "voice_minutes": 0},
            "starter": {"monthly_cost": 5, "credits": 30000, "voice_minutes": 30},
            "creator": {"monthly_cost": 22, "credits": 100000, "voice_minutes": 100},
            "pro": {"monthly_cost": 99, "credits": 500000, "voice_minutes": 500},
            "scale": {"monthly_cost": 330, "credits": 2000000, "voice_minutes": 2000},
            "business": {"monthly_cost": 1320, "credits": 11000000, "voice_minutes": 11000},
        },
        "tts": {
            "cost_per_credit": 0.00022,  # $22 / 100,000 credits
            "characters_per_credit": 1,  # Approximate
        },
        "voice_tools": {  # STS, Voice Changer
            "creator_overage_per_minute": 0.30,
            "scale_overage_per_minute": 0.12,
        },
        "voice_cloning": {
            "instant_clone": 0,  # FREE on all paid plans
            "professional_clone": "Pro+ only",
        }
    },
    "gemini": {
        "models": {
            "gemini-2.0-flash": {
                "audio_input_per_1m_tokens": 0.10,
                "text_input_per_1m_tokens": 0.10,
                "output_per_1m_tokens": 0.40,
            },
            "gemini-2.5-flash": {
                "audio_input_per_1m_tokens": 1.00,
                "text_input_per_1m_tokens": 0.15,
                "output_per_1m_tokens": 2.50,
            }
        },
        "audio_tokens_per_second": 25,  # Approximate conversion
        "free_tier": {
            "requests_per_day": 1500,
            "tokens_per_minute": 1000000,
        }
    }
}


# ==================== ElevenLabs Analytics ====================

def get_user_info() -> dict:
    """Get ElevenLabs user account info"""
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found")
    
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    response = requests.get(f"{BASE_URL}/user", headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    return response.json()


def get_subscription_info() -> dict:
    """Get ElevenLabs subscription details with usage"""
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found")
    
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    response = requests.get(f"{BASE_URL}/user/subscription", headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")
    
    return response.json()


def get_elevenlabs_analytics() -> dict:
    """
    Get comprehensive ElevenLabs analytics with detailed cost breakdown
    """
    user = get_user_info()
    subscription = get_subscription_info()
    
    # Extract data
    tier = subscription.get("tier", "free").lower()
    character_count = subscription.get("character_count", 0)
    character_limit = subscription.get("character_limit", 0)
    
    # Calculate usage percentage
    usage_percent = (character_count / character_limit * 100) if character_limit > 0 else 0
    
    # Get plan info
    plan_info = PRICING["elevenlabs"]["plans"].get(tier, PRICING["elevenlabs"]["plans"]["free"])
    
    # Calculate costs
    cost_per_character = plan_info["monthly_cost"] / plan_info["credits"] if plan_info["credits"] > 0 else 0
    estimated_cost = character_count * cost_per_character
    
    # Reset date
    reset_unix = subscription.get("next_character_count_reset_unix")
    if reset_unix:
        reset_date = datetime.fromtimestamp(reset_unix, tz=timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        days_until_reset = (datetime.fromtimestamp(reset_unix, tz=timezone.utc) - datetime.now(timezone.utc)).days
    else:
        reset_date = "N/A"
        days_until_reset = 0
    
    # Voice tools minutes
    voice_limit = subscription.get("voice_limit", 0)
    
    return {
        "account": {
            "user_id": user.get("user_id"),
            "email": subscription.get("email") or user.get("email", "N/A"),
            "tier": tier.capitalize()
        },
        "subscription": {
            "plan": tier.capitalize(),
            "monthly_cost": f"${plan_info['monthly_cost']}",
            "status": subscription.get("status", "active"),
            "billing_period": "Monthly",
            "next_reset": reset_date,
            "days_until_reset": days_until_reset
        },
        "credits": {
            "used": character_count,
            "limit": character_limit,
            "remaining": character_limit - character_count,
            "usage_percent": round(usage_percent, 2),
            "cost_per_credit": f"${cost_per_character:.6f}"
        },
        "voice_tools": {
            "included_minutes": plan_info.get("voice_minutes", 0),
            "overage_cost_per_minute": f"${PRICING['elevenlabs']['voice_tools']['creator_overage_per_minute']}" if tier == "creator" else "N/A",
        },
        "voices": {
            "max_voice_limit": subscription.get("max_voice_limit", 0),
            "instant_clone_cost": "FREE",
            "professional_clone": "Pro+ plans only"
        },
        "models": subscription.get("available_models", []),
        "costs": {
            "plan_monthly": f"${plan_info['monthly_cost']}",
            "cost_per_1k_chars": f"${cost_per_character * 1000:.4f}",
            "estimated_usage_cost": f"${estimated_cost:.4f}",
            "overage_rate": "N/A within limits"
        },
        "alerts": get_elevenlabs_alerts(usage_percent, days_until_reset),
        "timestamp": datetime.now().isoformat()
    }


def get_elevenlabs_alerts(usage_percent: float, days_until_reset: int) -> list:
    """Generate alerts based on usage"""
    alerts = []
    
    if usage_percent >= 95:
        alerts.append({
            "level": "critical",
            "message": f"⚠️ CRITICAL: Credits almost exhausted ({usage_percent:.1f}% used)",
            "action": "Consider upgrading plan or limiting usage"
        })
    elif usage_percent >= 80:
        alerts.append({
            "level": "warning",
            "message": f"Credits running low ({usage_percent:.1f}% used)",
            "action": "Monitor usage closely"
        })
    elif usage_percent >= 50:
        alerts.append({
            "level": "info",
            "message": f"Halfway through credits ({usage_percent:.1f}% used)",
            "action": None
        })
    
    if days_until_reset <= 3 and days_until_reset > 0:
        alerts.append({
            "level": "info",
            "message": f"Credits reset in {days_until_reset} days",
            "action": None
        })
    
    return alerts


# ==================== Gemini Usage Tracking ====================

GEMINI_USAGE_FILE = ".tmp/gemini_usage.json"

def log_gemini_usage(
    audio_duration_seconds: float = 0,
    input_tokens: int = 0,
    output_tokens: int = 0,
    model: str = "gemini-2.0-flash"
):
    """Track Gemini API usage with detailed metrics"""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "audio_seconds": audio_duration_seconds,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "model": model
    }
    
    try:
        with open(GEMINI_USAGE_FILE, "r") as f:
            usage = json.load(f)
    except:
        usage = {
            "entries": [],
            "totals": {
                "audio_seconds": 0,
                "input_tokens": 0,
                "output_tokens": 0,
                "requests": 0
            },
            "daily": {}
        }
    
    # Update totals
    usage["entries"].append(entry)
    usage["totals"]["audio_seconds"] += audio_duration_seconds
    usage["totals"]["input_tokens"] += input_tokens
    usage["totals"]["output_tokens"] += output_tokens
    usage["totals"]["requests"] += 1
    
    # Track daily usage
    today = datetime.now().strftime("%Y-%m-%d")
    if today not in usage["daily"]:
        usage["daily"][today] = {"requests": 0, "tokens": 0}
    usage["daily"][today]["requests"] += 1
    usage["daily"][today]["tokens"] += input_tokens + output_tokens
    
    # Keep last 1000 entries
    usage["entries"] = usage["entries"][-1000:]
    
    with open(GEMINI_USAGE_FILE, "w") as f:
        json.dump(usage, f, indent=2)
    
    return entry


def get_gemini_analytics() -> dict:
    """Get comprehensive Gemini usage analytics"""
    try:
        with open(GEMINI_USAGE_FILE, "r") as f:
            usage = json.load(f)
    except:
        usage = {"entries": [], "totals": {"audio_seconds": 0, "input_tokens": 0, "output_tokens": 0, "requests": 0}, "daily": {}}
    
    totals = usage.get("totals", {})
    pricing = PRICING["gemini"]["models"]["gemini-2.0-flash"]
    
    # Calculate costs
    input_cost = (totals.get("input_tokens", 0) / 1_000_000) * pricing["audio_input_per_1m_tokens"]
    output_cost = (totals.get("output_tokens", 0) / 1_000_000) * pricing["output_per_1m_tokens"]
    total_cost = input_cost + output_cost
    
    # Daily stats
    today = datetime.now().strftime("%Y-%m-%d")
    daily_usage = usage.get("daily", {}).get(today, {"requests": 0, "tokens": 0})
    free_tier = PRICING["gemini"]["free_tier"]
    
    return {
        "model": "gemini-2.0-flash",
        "usage": {
            "total_requests": totals.get("requests", 0),
            "audio_processed_seconds": round(totals.get("audio_seconds", 0), 2),
            "audio_processed_minutes": round(totals.get("audio_seconds", 0) / 60, 2),
            "input_tokens": totals.get("input_tokens", 0),
            "output_tokens": totals.get("output_tokens", 0),
            "total_tokens": totals.get("input_tokens", 0) + totals.get("output_tokens", 0)
        },
        "today": {
            "requests": daily_usage["requests"],
            "tokens": daily_usage["tokens"],
            "requests_remaining": max(0, free_tier["requests_per_day"] - daily_usage["requests"]),
            "within_free_tier": daily_usage["requests"] < free_tier["requests_per_day"]
        },
        "costs": {
            "input_cost": f"${input_cost:.6f}",
            "output_cost": f"${output_cost:.6f}",
            "total_cost": f"${total_cost:.6f}",
            "is_free_tier": daily_usage["requests"] < free_tier["requests_per_day"]
        },
        "pricing": {
            "model": "gemini-2.0-flash",
            "audio_input_per_1m_tokens": f"${pricing['audio_input_per_1m_tokens']}",
            "output_per_1m_tokens": f"${pricing['output_per_1m_tokens']}",
            "free_tier_daily_requests": free_tier["requests_per_day"],
            "note": "First 1500 requests/day are FREE"
        },
        "timestamp": datetime.now().isoformat()
    }


# ==================== Local Usage Tracking ====================

USAGE_FILE = ".tmp/usage_log.json"

def log_usage(feature: str, characters: int = 0, audio_seconds: float = 0, user_id: str = "admin"):
    """Log usage for internal tracking"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "feature": feature,
        "characters": characters,
        "audio_seconds": audio_seconds,
        "user_id": user_id
    }
    
    try:
        with open(USAGE_FILE, "r") as f:
            logs = json.load(f)
    except:
        logs = []
    
    logs.append(log_entry)
    logs = logs[-1000:]  # Keep last 1000 entries
    
    with open(USAGE_FILE, "w") as f:
        json.dump(logs, f, indent=2)
    
    return log_entry


def get_local_usage_stats() -> dict:
    """Get aggregated local usage stats"""
    from collections import defaultdict
    
    try:
        with open(USAGE_FILE, "r") as f:
            logs = json.load(f)
    except:
        logs = []
    
    stats = {
        "total_requests": len(logs),
        "total_characters": sum(log.get("characters", 0) for log in logs),
        "total_audio_seconds": sum(log.get("audio_seconds", 0) for log in logs),
        "by_feature": defaultdict(lambda: {"requests": 0, "characters": 0}),
        "by_date": defaultdict(int),
        "recent": logs[-10:][::-1]  # Last 10 entries, newest first
    }
    
    for log in logs:
        feature = log.get("feature", "unknown")
        stats["by_feature"][feature]["requests"] += 1
        stats["by_feature"][feature]["characters"] += log.get("characters", 0)
        date = log.get("timestamp", "")[:10]
        stats["by_date"][date] += 1
    
    stats["by_feature"] = dict(stats["by_feature"])
    stats["by_date"] = dict(stats["by_date"])
    
    return stats


# ==================== Combined Dashboard ====================

def get_admin_dashboard() -> dict:
    """Get complete admin dashboard with all analytics"""
    dashboard = {
        "elevenlabs": None,
        "gemini": None,
        "local_usage": None,
        "pricing_reference": PRICING,
        "alerts": [],
        "summary": {},
        "generated_at": datetime.now().isoformat()
    }
    
    # ElevenLabs
    try:
        el_data = get_elevenlabs_analytics()
        dashboard["elevenlabs"] = el_data
        dashboard["alerts"].extend(el_data.get("alerts", []))
    except Exception as e:
        dashboard["elevenlabs"] = {"error": str(e)}
    
    # Gemini
    try:
        dashboard["gemini"] = get_gemini_analytics()
    except Exception as e:
        dashboard["gemini"] = {"error": str(e)}
    
    # Local usage
    try:
        dashboard["local_usage"] = get_local_usage_stats()
    except Exception as e:
        dashboard["local_usage"] = {"error": str(e)}
    
    # Summary
    if dashboard["elevenlabs"] and not dashboard["elevenlabs"].get("error"):
        el = dashboard["elevenlabs"]
        gm = dashboard["gemini"] if dashboard["gemini"] and not dashboard["gemini"].get("error") else {}
        
        dashboard["summary"] = {
            "elevenlabs_credits_remaining": el["credits"]["remaining"],
            "elevenlabs_usage_percent": el["credits"]["usage_percent"],
            "elevenlabs_days_until_reset": el["subscription"]["days_until_reset"],
            "gemini_requests_today": gm.get("today", {}).get("requests", 0),
            "total_requests": dashboard["local_usage"].get("total_requests", 0) if dashboard["local_usage"] else 0
        }
    
    return dashboard


# ==================== CLI ====================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("📊 Awaaz AI - Detailed Analytics Report")
    print("="*60)
    
    # ElevenLabs
    print("\n🎤 ELEVENLABS")
    print("-"*40)
    try:
        el = get_elevenlabs_analytics()
        print(f"Plan: {el['subscription']['plan']} ({el['subscription']['monthly_cost']}/month)")
        print(f"Credits: {el['credits']['used']:,} / {el['credits']['limit']:,} ({el['credits']['usage_percent']}%)")
        print(f"Remaining: {el['credits']['remaining']:,} credits")
        print(f"Cost per 1K chars: {el['costs']['cost_per_1k_chars']}")
        print(f"Voice Tools: {el['voice_tools']['included_minutes']} minutes included")
        print(f"Next Reset: {el['subscription']['next_reset']} ({el['subscription']['days_until_reset']} days)")
        
        if el['alerts']:
            print("\n⚠️  Alerts:")
            for alert in el['alerts']:
                print(f"   [{alert['level'].upper()}] {alert['message']}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Gemini
    print("\n🤖 GEMINI")
    print("-"*40)
    try:
        gm = get_gemini_analytics()
        print(f"Model: {gm['model']}")
        print(f"Total Requests: {gm['usage']['total_requests']}")
        print(f"Audio Processed: {gm['usage']['audio_processed_minutes']} minutes")
        print(f"Today's Requests: {gm['today']['requests']} / 1500 free")
        print(f"Estimated Cost: {gm['costs']['total_cost']}")
        print(f"Within Free Tier: {'✅ Yes' if gm['today']['within_free_tier'] else '❌ No'}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*60)
