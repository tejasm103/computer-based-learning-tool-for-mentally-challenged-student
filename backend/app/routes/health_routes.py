"""
AccessibleVerse - Health Check Route
Safely verifies Flask application and MongoDB connection without leaking secrets.
"""

import os
from flask import Blueprint, jsonify
from app.extensions import is_db_connected, get_db_error

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def check_health():
    db_status = is_db_connected()
    db_err = get_db_error()
    
    response = {
        "status": "healthy",
        "service": "AccessibleVerse Backend REST API",
        "database": {
            "connected": db_status,
            "engine": "MongoDB Atlas",
            "database_name": os.getenv("MONGODB_DB_NAME", "accessibleverse"),
            "notice": db_err if not db_status else "Connected and operational"
        },
        "environment": os.getenv("FLASK_ENV", "development"),
        "version": "1.0.0"
    }
    
    # Return 200 even if DB is in fallback/unconnected mode so frontend and container health probes can read the diagnostic status
    return jsonify(response), 200
