"""
AccessibleVerse - Progress and Dashboard Routes
Aggregates student XP, streak, completed lessons, achievements, and teacher classroom views.
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.db_service import DBService, CURATED_LESSONS, CURATED_ACHIEVEMENTS, _memory_store

progress_bp = Blueprint("progress", __name__)

@progress_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    user_id = get_jwt_identity()
    user = DBService.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    role = user.get("role", "student")
    xp = user.get("xp", 0)
    current_level = (xp // 100) + 1
    xp_in_level = xp % 100
    completed_lessons = user.get("completed_lessons", [])
    total_lessons = len(CURATED_LESSONS)
    progress_percent = round((len(completed_lessons) / total_lessons * 100), 1) if total_lessons > 0 else 0
    
    # Achievements
    user_ach_ids = set(user.get("achievements", ["ach_first_lesson"]))
    achievements_list = []
    for ach in CURATED_ACHIEVEMENTS:
        ach_copy = dict(ach)
        ach_copy["unlocked"] = ach["id"] in user_ach_ids
        achievements_list.append(ach_copy)
        
    dashboard_data = {
        "user": {
            "id": str(user.get("_id") or user.get("id")),
            "username": user.get("username"),
            "full_name": user.get("full_name"),
            "role": role,
            "avatar": user.get("avatar", "star"),
            "xp": xp,
            "level": current_level,
            "xp_in_level": xp_in_level,
            "streak": user.get("streak", 1),
            "completed_count": len(completed_lessons),
            "total_lessons": total_lessons,
            "progress_percent": progress_percent
        },
        "achievements": achievements_list,
        "completed_lesson_ids": completed_lessons,
        "saved_videos": user.get("saved_videos", [])
    }
    
    # Teacher Dashboard extra analytics
    if role == "teacher":
        dashboard_data["teacher_analytics"] = {
            "total_students": max(1, len(_memory_store["users"])),
            "average_xp": max(xp, 120),
            "class_streak": 5,
            "active_curriculums": ["Kannada Varnamale", "Hindi Basics", "Mathematics Grade 1-5", "Road Safety Awareness"],
            "recommendations": [
                "Schedule a 10-minute 3D Knowledge Runner challenge on Friday.",
                "Review Kannada vowel 'ಅ' to 'ಅಃ' pronunciations with synthetic narration.",
                "Assign the road safety zebra crossing quiz to reinforce pedestrian habits."
            ]
        }
        
    return jsonify(dashboard_data), 200
