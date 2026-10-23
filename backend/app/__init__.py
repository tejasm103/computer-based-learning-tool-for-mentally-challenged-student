"""
AccessibleVerse - Flask Application Factory
"""

import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from backend/.env or root .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
load_dotenv()

from app.extensions import jwt, init_mongo

# Configure clean logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("accessibleverse")

def create_app():
    app = Flask(__name__)
    
    # Secret Key and JWT Configuration
    app.config["SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev_secret_key_accessibleverse_12345")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev_secret_key_accessibleverse_12345")
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    
    # Allowed CORS Origins - Supports local dev, Netlify deployments, and custom origins
    import re
    allowed_origins_env = os.getenv("FRONTEND_ORIGIN", "")
    
    # Default origin patterns (support local dev & any *.netlify.app domain out of the box)
    origin_patterns = [
        re.compile(r"^https:\/\/.*\.netlify\.app$"),
        re.compile(r"^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$"),
    ]
    
    is_wildcard = False
    if allowed_origins_env:
        for orig in allowed_origins_env.split(","):
            orig = orig.strip()
            if orig == "*":
                is_wildcard = True
                break
            elif orig:
                origin_patterns.append(orig)
    
    # Initialize CORS
    CORS(
        app,
        resources={r"/api/*": {"origins": "*" if is_wildcard else origin_patterns}},
        supports_credentials=not is_wildcard,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    
    # Initialize Extensions
    jwt.init_app(app)
    
    # Safely connect to MongoDB
    with app.app_context():
        init_mongo(app)
        
    # Custom JWT Error Handlers
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({
            "error": "Missing or invalid authorization token. Please login to access this resource.",
            "code": "UNAUTHORIZED"
        }), 401
        
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "error": "Your session has expired. Please log in again.",
            "code": "TOKEN_EXPIRED"
        }), 401
        
    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({
            "error": "Invalid token provided. Please log in again.",
            "code": "INVALID_TOKEN"
        }), 401

    # Register Blueprints
    from app.routes.health_routes import health_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.lesson_routes import lesson_bp
    from app.routes.video_routes import video_bp
    from app.routes.quiz_routes import quiz_bp
    from app.routes.game_routes import game_bp
    from app.routes.progress_routes import progress_bp
    from app.routes.ai_routes import ai_bp
    from app.routes.classroom_routes import classroom_bp
    from app.routes.practice_routes import practice_bp
    from app.routes.portfolio_routes import portfolio_bp
    from app.routes.learning_path_routes import learning_path_bp
    
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(lesson_bp, url_prefix="/api/lessons")
    app.register_blueprint(video_bp, url_prefix="/api/videos")
    app.register_blueprint(quiz_bp, url_prefix="/api/quizzes")
    app.register_blueprint(game_bp, url_prefix="/api/games")
    app.register_blueprint(progress_bp, url_prefix="/api/progress")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(classroom_bp, url_prefix="/api/classrooms")
    app.register_blueprint(practice_bp, url_prefix="/api/practice")
    app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")
    app.register_blueprint(learning_path_bp, url_prefix="/api/learning-path")
    
    @app.route("/")
    def index():
        return jsonify({
            "app": "AccessibleVerse Backend API",
            "status": "online",
            "health": "/api/health",
            "documentation": "See frontend for client interaction or README.md"
        })
        
    return app
