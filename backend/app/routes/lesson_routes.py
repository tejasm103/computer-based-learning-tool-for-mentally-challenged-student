"""
AccessibleVerse - Lessons Routes
Curriculum endpoints for Kannada, Hindi, English, Mathematics, Everyday life, and Coding.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.db_service import DBService

lesson_bp = Blueprint("lessons", __name__)

@lesson_bp.route("", methods=["GET"])
def get_lessons():
    subject = request.args.get("subject")
    level = request.args.get("level")
    lessons = DBService.get_all_lessons(subject=subject, level=level)
    return jsonify({"lessons": lessons, "total": len(lessons)}), 200

@lesson_bp.route("/<lesson_id>", methods=["GET"])
def get_lesson(lesson_id):
    lesson = DBService.get_lesson_by_id(lesson_id)
    if not lesson:
        return jsonify({"error": "Lesson not found."}), 404
    return jsonify({"lesson": lesson}), 200

@lesson_bp.route("/<lesson_id>/complete", methods=["POST"])
@jwt_required()
def complete_lesson(lesson_id):
    user_id = get_jwt_identity()
    result = DBService.record_lesson_completion(user_id, lesson_id)
    return jsonify({
        "message": "Lesson completed! XP awarded.",
        "xp_gained": result.get("xp_gained", 25)
    }), 200
