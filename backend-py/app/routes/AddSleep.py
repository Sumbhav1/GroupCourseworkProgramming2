from flask import Blueprint, request, jsonify
from ..db import Database 
from ..models.user import User
from ..utils import get_user_email_from_token

sleep_bp = Blueprint('sleep', __name__, url_prefix='/sleep')

@sleep_bp.route('/add', methods=['POST'])
def add():
    try:
        token = request.headers.get("Authorization", "").split(" ")[1]  # "Bearer <token>"
        email = get_user_email_from_token(token)
    except Exception as e:
        return jsonify({"error": str(e)}), 401

    data = request.get_json()
    bedtime = data.get("bedtime")
    wakeupTime = data.get("wakeuptime")
    
    
    
    try:
        user = User().find_by_email(email)
        if user:
            user.ensure_daily_log()
            result = user.addSleep(bedtime, wakeupTime)
            if isinstance(result, dict) and "error" in result:
                return jsonify({"error": result["error"]}), 500
            return jsonify({"message": "Sleep added successfully"}), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
