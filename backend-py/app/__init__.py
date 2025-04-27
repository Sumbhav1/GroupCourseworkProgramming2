from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=["http://localhost:5173"])

    from .routes.auth import auth_bp
    from .routes.settings import settings_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(settings_bp)

    return app

