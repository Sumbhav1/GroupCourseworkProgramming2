from flask import Blueprint, request, jsonify
from ..db import Database 
from ..models.user import User
from ..utils import get_user_email_from_token

settings_bp = Blueprint('settings', __name__, url_prefix='/settings')

@settings_bp.route("/fetch", methods=["GET"])
def fetch_settings():
    try:
        token = request.headers.get("Authorization", "").split(" ")[1]  # "Bearer <token>"
        email = get_user_email_from_token(token)
    except Exception as e:
        return jsonify({"error": str(e)}), 401

    user = User().find_by_email(email)

    if user:
        settings = user.getSettings()
        if settings:
            return jsonify(settings)
        else:
            return jsonify({"error": "error fetching settings"}, 404)

@settings_bp.route('/set', methods=["POST"])
def set_settings():
    data = request.get_json()
    token = request.headers.get("Authorization", "").split(" ")[1]  # "Bearer <token>"
    email = get_user_email_from_token(token)  
    
    calories = data.get("calories")
    bedtime = data.get("bedtime")
    wakeupTime = data.get("wakeupTime")
    sleep = data.get("sleep")
    meals = data.get("meals")
    notificationsSleep = data.get("notificationsSleep")
    notificationsMeals = data.get("notificationsMeals")

    user = User().find_by_email(email)
    if user:
        updatedUser = user.setSettings(  
            calories, meals, sleep, bedtime, wakeupTime, notificationsMeals, notificationsSleep
        )
        if updatedUser:
            return jsonify({
                "message": "Settings saved successfully",
                "user": updatedUser  
            }), 200  
        else:
            return jsonify({
                "message": "Error saving settings"
            }), 500
    else:
        return jsonify({
            "message": "User not found"
        }), 404

    

    

        

    
    
        

    
