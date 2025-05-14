from flask import Flask
from app.extensions import mysql,init_supabase

from .config import Config

from app.auth.routes import auth_bp
from app.main.routes import main_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    init_supabase(app)
    mysql.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)

    return app