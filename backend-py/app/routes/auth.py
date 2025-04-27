from flask import Blueprint, request, jsonify
from ..models.user import User
import bcrypt
import jwt
from datetime import timedelta, datetime 
from ..config import Config 

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User().find_by_email(email)

    if user:
        # Compare the entered password with the stored hashed password
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            JWT_SECRET = Config.JWT_SECRET
            # Generate JWT token
            payload = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'settings_finished': user.settings_finished,
                'exp': datetime.now() + timedelta(hours=1)  # Token expiration (1 hour)
            }
            
            # Create JWT token
            token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

            return jsonify({
                "message": "Login successful",
                "token": token,  # Send token for session verification
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "settings_finished": user.settings_finished
                }
            }), 200
        else:
            return jsonify({"message": "Invalid password"}), 400
    else:
        return jsonify({"message": "Email not found"}), 400
    
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    user = User().signupUser(name, email, password)

    if user:
        JWT_SECRET = Config.JWT_SECRET
        payload = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'settings_finished': user.settings_finished,
                'exp': datetime.now() + timedelta(hours=1)  # Token expiration (1 hour)
            }
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        return jsonify({
                "message": "Sign-up successful",
                "token": token,  # Send token for session verification
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "settings_finished": user.settings_finished
                }
            }), 201
    else:
     return jsonify({"message": "Error during sign-up, email may already be in use"}), 400
    
            



