from flask import Blueprint, request, jsonify
from ..db import Database 
from ..models.user import User
from ..utils import get_user_email_from_token
from datetime import time

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@dashboard_bp.route("/fetch", methods=["GET"])
def fetchDashboard():
    try:
        token = request.headers.get("Authorization", "").split(" ")[1]  # "Bearer <token>"
        email = get_user_email_from_token(token)
    except Exception as e:
        print("Token decoding error:", e)
        return jsonify({"error": str(e)}), 401
    
    try:
        user = User().find_by_email(email)
        if not user:
            return jsonify({"message": "User not found"}), 404

        settings = user.getSettings()
        if not settings:
            return jsonify({"message": "Couldn't find user settings"}), 404

        dailyLog = user.getDailyLog()
        if dailyLog is None:
            dailyLog = {
                "total_calories": 0,
                "sleep_hours": 0,
                "meals_count": 0,
                "goals_met": False,
                "streak": 0,
                "mood": None
            }

        recentLogs = user.getRecentLogs() or []

        return jsonify({
            "message": "Dashboard data fetched successfully",
            "payload": {
                "settings": {
                    "caloriesNeeded": settings['calories'],
                    "mealsNeeded":   settings['meals'],
                    "bedtime":       format_time(settings['bedtime']),
                    "wakeupTime":    format_time(settings['wakeupTime'])
                },
                "dailyLog":   dailyLog,
                "recentLogs": recentLogs
            }
        }), 200

    except Exception as e:
        print("Dashboard fetch error:", e)
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


def format_time(value):
    if isinstance(value, time):
        return value.strftime("%H:%M")
    elif isinstance(value, float):  # assume value is hours as float
        hours = int(value)
        minutes = int((value - hours) * 60)
        return f"{hours:02d}:{minutes:02d}"
    elif isinstance(value, str):
        return value  # already formatted
    return "00:00"
