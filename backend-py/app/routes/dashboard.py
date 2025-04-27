from flask import Blueprint, request, jsonify
from ..db import Database 
from ..models.user import User
from ..utils import get_user_email_from_token

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@dashboard_bp.route("/fetch", methods=["GET"])
def fetchDashboard():
    try:
        token = request.headers.get("Authorization", "").split(" ")[1]  # "Bearer <token>"
        email = get_user_email_from_token(token)
    except Exception as e:
        return jsonify({"error": str(e)}), 401
    
    user = User.find_by_email(email)

    

