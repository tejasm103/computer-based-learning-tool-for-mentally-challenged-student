"""
AccessibleVerse - Educational Game Routes
Manages game scores, high-score leaderboards, and XP rewards.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.db_service import DBService

game_bp = Blueprint("games", __name__)

GAME_CATALOG = [
    {
        "id": "knowledge-runner",
        "title": "Knowledge Runner 3D",
        "type": "3D Action / Endless Runner",
        "description": "Navigate a 3-lane futuristic learning highway, dodge hurdles, collect knowledge crystals, and answer checkpoint questions."
    },
    {
        "id": "alphabet-adventure",
        "title": "Alphabet Adventure",
        "type": "Language Match & Phonics",
        "description": "Catch and match letters in Kannada, Hindi, and English to form words and hear authentic pronunciation."
    },
    {
        "id": "number-quest",
        "title": "Number Quest",
        "type": "Math Speed Challenge",
        "description": "Sharpen fast counting, addition, multiplication tables, and division in an interactive arcade."
    },
    {
        "id": "memory-match",
        "title": "Memory Match",
        "type": "Cognitive Memory & Focus",
        "description": "Flip and pair cards featuring multilingual alphabets, geometric shapes, and everyday tools."
    },
    {
        "id": "puzzle-world",
        "title": "Puzzle World",
        "type": "Spatial & Logic Puzzles",
        "description": "Piece together tangrams, geometric shapes, and sequential patterns to unlock learning rooms."
    },
    {
        "id": "traffic-safety",
        "title": "Traffic Safety Challenge",
        "type": "Simulation / Everyday Safety",
        "description": "Make safe road-crossing decisions, obey traffic signals, and protect pedestrian avatars."
    }
]

@game_bp.route("", methods=["GET"])
def get_game_catalog():
    return jsonify({"games": GAME_CATALOG}), 200

@game_bp.route("/score", methods=["POST"])
def submit_score():
    data = request.get_json() or {}
    
    game_id = data.get("game_id")
    score = data.get("score", 0)
    level = data.get("level", 1)
    user_id = data.get("user_id") or "guest"
    username = data.get("username") or "Explorer"
    
    if not game_id:
        return jsonify({"error": "game_id is required"}), 400
        
    saved_record = DBService.save_game_score(
        user_id=user_id,
        username=username,
        game_id=game_id,
        score=score,
        level=level
    )
    
    return jsonify({
        "message": "Game score recorded!",
        "record": saved_record,
        "xp_earned": saved_record.get("xp_earned", 10)
    }), 201

@game_bp.route("/leaderboard/<game_id>", methods=["GET"])
def get_leaderboard(game_id):
    limit = int(request.args.get("limit", 10))
    leaderboard = DBService.get_game_leaderboard(game_id, limit=limit)
    return jsonify({
        "game_id": game_id,
        "leaderboard": leaderboard
    }), 200
