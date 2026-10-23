"""
AccessibleVerse - Backend Extensions
Initializes PyMongo and Flask-JWT-Extended with safe error handling.
"""

import os
import logging
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError, ServerSelectionTimeoutError

logger = logging.getLogger("accessibleverse")

jwt = JWTManager()
mongo_client = None
db = None
db_connected = False
db_error_message = ""

def init_mongo(app):
    """
    Safely initialize MongoDB connection.
    Never exposes credentials or raw connection string in logs.
    """
    global mongo_client, db, db_connected, db_error_message
    
    uri = os.getenv("MONGODB_URI", "")
    db_name = os.getenv("MONGODB_DB_NAME", "accessibleverse")
    
    # Check if placeholder still present
    if "<db_password>" in uri or not uri:
        db_connected = False
        db_error_message = "MongoDB URI contains '<db_password>' placeholder or is empty. Please replace it with your actual MongoDB password in backend/.env."
        logger.warning(db_error_message)
        return False
        
    try:
        # Connect to MongoDB with timeout
        mongo_client = MongoClient(
            uri,
            serverSelectionTimeoutMS=4000,
            connectTimeoutMS=4000,
            socketTimeoutMS=4000
        )
        # Verify connection by pinging admin
        mongo_client.admin.command("ping")
        db = mongo_client[db_name]
        db_connected = True
        db_error_message = ""
        logger.info("Successfully connected to MongoDB Atlas database '%s'", db_name)
        
        # Initialize default indexes
        try:
            db.users.create_index("email", unique=True)
            db.users.create_index("username", unique=True)
            db.game_scores.create_index([("game_id", 1), ("score", -1)])
            db.quiz_attempts.create_index([("user_id", 1), ("quiz_id", 1)])
        except Exception as idx_err:
            logger.warning("Could not create indexes: %s", str(idx_err))
            
        return True
    except (ConnectionFailure, ConfigurationError, ServerSelectionTimeoutError) as err:
        db_connected = False
        # Do NOT log the URI or credentials
        db_error_message = f"Failed to connect to MongoDB Atlas: {err.__class__.__name__}. Check database credentials and network access (IP Whitelist)."
        logger.error(db_error_message)
        return False
    except Exception as general_err:
        db_connected = False
        db_error_message = f"Unexpected database error: {general_err.__class__.__name__}"
        logger.error(db_error_message)
        return False

def get_db():
    """Return active database handle if connected, else None"""
    return db if db_connected else None

def is_db_connected():
    """Check connectivity status"""
    return db_connected

def get_db_error():
    """Return safe error message without credentials"""
    return db_error_message
