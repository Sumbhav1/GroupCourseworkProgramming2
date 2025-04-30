from flask import Blueprint, request, jsonify
from ..db import Database 
from ..models.user import User
from ..utils import get_user_email_from_token

mood_bp = Blueprint('mood', __name__, url_prefix='/mood')

@mood_bp.route('/set', methods=['POST'])
def setMood():
    data = request.get_json()
    email = data.get("email")
    mood = data.get("mood") 

    if not email or not mood:
        return jsonify({"error": "Email and mood are required."}), 400

    user = User().find_by_email(email)
    if not user:
        return jsonify({"error": "User not found."}), 404

    try:
        user.setMood(mood)
        return jsonify({"message": "Mood updated successfully."}), 200
    except Exception as e:
        print("Error in setMood route:", e)
        return jsonify({"error": "Failed to update mood."}), 500

    