from flask import Blueprint, request, jsonify
from ..db import Database 
from ..models.user import User
from ..utils import get_user_email_from_token

settings_bp = Blueprint('settings', __name__, url_prefix='/settings')

@settings_bp.route("/fetch", methods=["GET"])
def fetch_settings():
    try:
        token = request.headers.get("Authorization", "").split(" ")[1]  # "Bearer <token>"
        print(f"[FETCH] Token received: {token}")
        email = get_user_email_from_token(token)
        print(f"[FETCH] Email extracted: {email}")
    except Exception as e:
        print(f"[FETCH] Error extracting email from token: {e}")
        return jsonify({"error": str(e)}), 401

    user = User().find_by_email(email)
    print(f"[FETCH] User found: {user is not None}")

    if user:
        settings = user.getSettings()
        print(f"[FETCH] Settings retrieved: {settings}")
        if settings:
            return jsonify(settings)
        else:
            print(f"[FETCH] No settings found for user")
            return jsonify({"error": "error fetching settings"}), 404

@settings_bp.route('/set', methods=["POST"])
def set_settings():
    data = request.get_json()
    print(f"[SET] Data received: {data}")

    try:
        token = request.headers.get("Authorization", "").split(" ")[1]
        print(f"[SET] Token received: {token}")
        email = get_user_email_from_token(token)
        print(f"[SET] Email extracted: {email}")
    except Exception as e:
        print(f"[SET] Error extracting email from token: {e}")
        return jsonify({"error": str(e)}), 401

    calories = data.get("calories")
    bedtime = data.get("bedtime")
    wakeupTime = data.get("wakeupTime")
    sleep = data.get("sleep")
    meals = data.get("meals")
    notificationsSleep = data.get("notificationsSleep")
    notificationsMeals = data.get("notificationsMeals")

    print(f"[SET] Parsed values - Calories: {calories}, Bedtime: {bedtime}, WakeupTime: {wakeupTime}, Sleep: {sleep}, Meals: {meals}, NotificationsSleep: {notificationsSleep}, NotificationsMeals: {notificationsMeals}")

    user = User().find_by_email(email)
    print(f"[SET] User found: {user is not None}")

    if user:
        updatedUser = user.setSettings(  
            calories, meals, sleep, bedtime, wakeupTime, notificationsMeals, notificationsSleep
        )
        print(f"[SET] Settings update status: {'Success' if updatedUser else 'Failure'}")

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
        print(f"[SET] User not found with email: {email}")
        return jsonify({
            "message": "User not found"
        }), 404

    

    

        

    
    
        

    
