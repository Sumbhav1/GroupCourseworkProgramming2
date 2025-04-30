from flask import Blueprint, request, jsonify
from ..db import Database 
from ..models.user import User
from ..utils import get_user_email_from_token

meal_bp = Blueprint('meals', __name__, url_prefix='/meals')

@meal_bp.route('/add', methods=['POST'])
def add():
    try:
        token = request.headers.get("Authorization", "").split(" ")[1]  # "Bearer <token>"
        email = get_user_email_from_token(token)
    except Exception as e:
        return jsonify({"error": str(e)}), 401

    data = request.get_json()
    calories = data.get("total_calories")
    
    if calories is None:
        return jsonify({"error": "Missing total_calories in request body"}), 400
    
    try:
        user = User().find_by_email(email)
        if user:
            user.ensure_daily_log()
            result = user.addMeal(calories)
            if isinstance(result, dict) and "error" in result:
                return jsonify({"error": result["error"]}), 500
            return jsonify({"message": "Meal added successfully"}), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500




    
