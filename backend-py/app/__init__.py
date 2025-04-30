from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=["http://localhost:5173"])

    from .routes.auth import auth_bp
    from .routes.settings import settings_bp
    from .routes.AddMeals import meal_bp
    from .routes.AddSleep import sleep_bp
    from .routes.dashboard import dashboard_bp
    from .routes.setMood import mood_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(meal_bp)
    app.register_blueprint(sleep_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(mood_bp)

    return app

