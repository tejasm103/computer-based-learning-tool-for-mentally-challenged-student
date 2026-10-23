"""
AccessibleVerse - Personalized Learning Path, Smart Calendar & Sync Routes
Generates personalized daily and weekly study paths, manages daily missions,
and coordinates idempotent progress synchronization.
"""

from flask import Blueprint, request, jsonify
from app.services.db_service import DBService

learning_path_bp = Blueprint("learning_path", __name__)

@learning_path_bp.route("", methods=["GET"])
def get_learning_path():
    """
    Generate personalized daily and weekly learning paths,
    calculating subject mastery bars and next educational activities.
    """
    user_id = request.args.get("user_id", "guest")
    user = DBService.get_user_by_id(user_id) if user_id != "guest" else None

    completed_ids = user.get("completed_lessons", []) if user else []
    all_lessons = DBService.get_all_lessons()
    
    # Calculate subject mastery
    subjects = ["kannada", "hindi", "english", "mathematics", "science", "cybersecurity", "everyday", "technology"]
    mastery = {}
    for s in subjects:
        total_s = len([l for l in all_lessons if l.get("subject") == s])
        comp_s = len([l for l in all_lessons if l.get("subject") == s and l["id"] in completed_ids])
        pct = round((comp_s / max(1, total_s)) * 100)
        mastery[s] = {"total": total_s, "completed": comp_s, "percent": pct}

    # Adapt difficulty level
    xp = user.get("xp", 0) if user else 0
    difficulty = "beginner"
    if xp >= 500:
        difficulty = "advanced"
    elif xp >= 200:
        difficulty = "intermediate"

    # Daily and weekly targets
    daily_plan = [
        {"day": "Today", "goal": "Complete 1 lesson & 1 interactive 3D challenge", "target_xp": 100},
        {"day": "Tomorrow", "goal": "Practice trilingual pronunciation & review mistakes", "target_xp": 100}
    ]

    uncompleted = [l for l in all_lessons if l["id"] not in completed_ids]
    next_up = uncompleted[:4] if uncompleted else all_lessons[:4]

    return jsonify({
        "success": True,
        "difficulty": difficulty,
        "subject_mastery": mastery,
        "daily_plan": daily_plan,
        "recommended_next": next_up,
        "completed_count": len(completed_ids),
        "total_lessons_available": len(all_lessons)
    }), 200

@learning_path_bp.route("/missions", methods=["GET"])
def get_missions():
    """Retrieve active daily missions and live completion status."""
    user_id = request.args.get("user_id", "guest")
    missions_data = DBService.get_or_create_daily_missions(user_id)
    return jsonify({"success": True, "data": missions_data}), 200

@learning_path_bp.route("/missions/progress", methods=["POST"])
def update_mission():
    """Increment progress on a mission type (lesson, quiz, game)."""
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    m_type = data.get("type", "lesson")
    count = data.get("count", 1)

    result = DBService.increment_mission_progress(user_id, m_type, count)
    return jsonify({"success": True, "data": result}), 200

@learning_path_bp.route("/calendar", methods=["GET"])
def get_calendar():
    """Retrieve scheduled study calendar events."""
    user_id = request.args.get("user_id", "guest")
    events = DBService.get_study_calendar(user_id)
    return jsonify({"success": True, "events": events}), 200

@learning_path_bp.route("/calendar", methods=["POST"])
def add_calendar_event():
    """Add a scheduled study event or assignment reminder."""
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    event = DBService.save_study_event(user_id, data)
    return jsonify({"success": True, "event": event}), 201

@learning_path_bp.route("/sync", methods=["POST"])
def sync_progress():
    """
    Idempotent multi-device progress sync.
    Safely merges completed lessons, achievements, and settings without duplicating XP.
    """
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    payload = data.get("progress_data", {})

    result = DBService.sync_user_progress(user_id, payload)
    return jsonify(result), 200
