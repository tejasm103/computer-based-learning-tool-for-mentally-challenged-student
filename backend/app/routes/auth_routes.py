"""
AccessibleVerse - Authentication Routes
Registration, Login, User Profile, and Preferences with JWT.
"""

import re
from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.db_service import DBService

auth_bp = Blueprint("auth", __name__)

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    
    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    full_name = data.get("full_name", "").strip() or username
    role = data.get("role", "student").strip().lower()
    
    if role not in ["student", "teacher"]:
        role = "student"
        
    # Validation
    if not username or len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters long."}), 400
        
    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Please provide a valid email address."}), 400
        
    if not password or len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400
        
    # Check if user already exists
    if DBService.get_user_by_email_or_username(email) or DBService.get_user_by_email_or_username(username):
        return jsonify({"error": "An account with this email or username already exists."}), 409
        
    hashed_pw = generate_password_hash(password)
    
    user_doc = {
        "username": username,
        "email": email,
        "password_hash": hashed_pw,
        "full_name": full_name,
        "role": role,
        "avatar": data.get("avatar", "star")
    }
    
    created_user = DBService.create_user(user_doc)
    user_id = str(created_user.get("_id") or created_user.get("id"))
    
    access_token = create_access_token(
        identity=user_id,
        additional_claims={"role": role, "username": username},
        expires_delta=timedelta(days=7)
    )
    
    safe_user = {
        "id": user_id,
        "username": username,
        "email": email,
        "full_name": full_name,
        "role": role,
        "avatar": created_user.get("avatar", "star"),
        "xp": created_user.get("xp", 0),
        "streak": created_user.get("streak", 1),
        "achievements": created_user.get("achievements", []),
        "accessibility_settings": created_user.get("accessibility_settings", {}),
        "language_preference": created_user.get("language_preference", "en")
    }
    
    return jsonify({
        "message": "Registration successful! Welcome to AccessibleVerse.",
        "access_token": access_token,
        "user": safe_user
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    
    identifier = data.get("identifier", "").strip()
    password = data.get("password", "")
    
    if not identifier or not password:
        return jsonify({"error": "Please enter both username/email and password."}), 400
        
    user = DBService.get_user_by_email_or_username(identifier)
    if not user:
        return jsonify({"error": "Invalid username/email or password."}), 401
        
    pw_hash = user.get("password_hash", "")
    if not check_password_hash(pw_hash, password):
        return jsonify({"error": "Invalid username/email or password."}), 401
        
    user_id = str(user.get("_id") or user.get("id"))
    role = user.get("role", "student")
    username = user.get("username", "")
    
    access_token = create_access_token(
        identity=user_id,
        additional_claims={"role": role, "username": username},
        expires_delta=timedelta(days=7)
    )
    
    safe_user = {
        "id": user_id,
        "username": username,
        "email": user.get("email", ""),
        "full_name": user.get("full_name", username),
        "role": role,
        "avatar": user.get("avatar", "star"),
        "xp": user.get("xp", 0),
        "streak": user.get("streak", 1),
        "completed_lessons": user.get("completed_lessons", []),
        "achievements": user.get("achievements", []),
        "accessibility_settings": user.get("accessibility_settings", {}),
        "language_preference": user.get("language_preference", "en")
    }
    
    return jsonify({
        "message": "Welcome back!",
        "access_token": access_token,
        "user": safe_user
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = DBService.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
        
    safe_user = {
        "id": str(user.get("_id") or user.get("id")),
        "username": user.get("username"),
        "email": user.get("email"),
        "full_name": user.get("full_name"),
        "role": user.get("role", "student"),
        "avatar": user.get("avatar", "star"),
        "xp": user.get("xp", 0),
        "streak": user.get("streak", 1),
        "completed_lessons": user.get("completed_lessons", []),
        "achievements": user.get("achievements", []),
        "accessibility_settings": user.get("accessibility_settings", {}),
        "language_preference": user.get("language_preference", "en"),
        "saved_videos": user.get("saved_videos", [])
    }
    return jsonify({"user": safe_user}), 200

@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    allowed_fields = ["full_name", "avatar", "language_preference", "accessibility_settings"]
    updates = {k: v for k, v in data.items() if k in allowed_fields}
    
    updated_user = DBService.update_user_profile(user_id, updates)
    if not updated_user:
        return jsonify({"error": "Failed to update profile."}), 400
        
    return jsonify({
        "message": "Profile updated successfully.",
        "user": {
            "id": str(updated_user.get("_id") or updated_user.get("id")),
            "username": updated_user.get("username"),
            "full_name": updated_user.get("full_name"),
            "avatar": updated_user.get("avatar"),
            "language_preference": updated_user.get("language_preference"),
            "accessibility_settings": updated_user.get("accessibility_settings")
        }
    }), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Successfully logged out."}), 200
