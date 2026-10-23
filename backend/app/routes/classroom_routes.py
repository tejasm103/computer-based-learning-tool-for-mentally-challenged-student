"""
AccessibleVerse - Teacher & Guardian Classroom Routes
Supports classroom creation, student enrollment via join codes, assignments,
completion tracking, grading, and personalized teacher feedback.
"""

from flask import Blueprint, request, jsonify
from app.services.db_service import DBService

classroom_bp = Blueprint("classrooms", __name__)

@classroom_bp.route("", methods=["POST"])
def create_classroom():
    """Create a new classroom (Teachers & Guardians)."""
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    subject = data.get("subject", "General").strip()
    description = data.get("description", "").strip()
    teacher_id = data.get("teacher_id", "teacher_1")

    if not name:
        return jsonify({"error": "Classroom name is required."}), 400

    classroom = DBService.create_classroom(teacher_id, name, subject, description)
    return jsonify({
        "success": True,
        "message": f"Classroom '{name}' created successfully!",
        "classroom": classroom
    }), 201

@classroom_bp.route("/teacher", methods=["GET"])
def get_teacher_classrooms():
    """Retrieve classrooms created by teacher."""
    teacher_id = request.args.get("teacher_id", "teacher_1")
    classrooms = DBService.get_classrooms_by_teacher(teacher_id)
    return jsonify({"success": True, "classrooms": classrooms}), 200

@classroom_bp.route("/join", methods=["POST"])
def join_classroom():
    """Enroll student into a classroom using a join code."""
    data = request.get_json() or {}
    code = data.get("code", "").strip()
    student_id = data.get("student_id", "guest")

    if not code:
        return jsonify({"error": "Classroom join code is required."}), 400

    result = DBService.join_classroom(student_id, code)
    if not result.get("success"):
        return jsonify(result), 404

    return jsonify(result), 200

@classroom_bp.route("/student", methods=["GET"])
def get_student_classrooms():
    """Retrieve classrooms enrolled by a student."""
    student_id = request.args.get("student_id", "guest")
    classrooms = DBService.get_student_classrooms(student_id)
    return jsonify({"success": True, "classrooms": classrooms}), 200

@classroom_bp.route("/<classroom_id>/assignments", methods=["POST"])
def create_assignment(classroom_id):
    """Teacher creates an assignment for the classroom."""
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    activity_type = data.get("activity_type", "lesson")
    activity_id = data.get("activity_id", "")
    due_date = data.get("due_date", "Next Week")
    xp_reward = data.get("xp_reward", 50)
    teacher_id = data.get("teacher_id", "teacher_1")

    if not title:
        return jsonify({"error": "Assignment title is required."}), 400

    assignment = DBService.create_assignment(
        classroom_id=classroom_id,
        teacher_id=teacher_id,
        title=title,
        description=description,
        activity_type=activity_type,
        activity_id=activity_id,
        due_date=due_date,
        xp_reward=xp_reward
    )
    return jsonify({"success": True, "assignment": assignment}), 201

@classroom_bp.route("/<classroom_id>/assignments", methods=["GET"])
def get_classroom_assignments(classroom_id):
    """List assignments for a classroom."""
    assignments = DBService.get_assignments(classroom_id=classroom_id)
    return jsonify({"success": True, "assignments": assignments}), 200

@classroom_bp.route("/assignments/<assignment_id>/submit", methods=["POST"])
def submit_assignment(assignment_id):
    """Student submits an assignment."""
    data = request.get_json() or {}
    student_id = data.get("student_id", "guest")
    score = data.get("score", 100)
    notes = data.get("notes", "")

    result = DBService.submit_assignment(assignment_id, student_id, score=score, notes=notes)
    if not result.get("success"):
        return jsonify(result), 400

    # Reward XP to student
    DBService.increment_mission_progress(student_id, "lesson", count=1)
    return jsonify(result), 200

@classroom_bp.route("/assignments/<assignment_id>/feedback", methods=["POST"])
def add_feedback(assignment_id):
    """Teacher provides feedback and grade on a student submission."""
    data = request.get_json() or {}
    student_id = data.get("student_id", "")
    feedback_text = data.get("feedback", "").strip()
    score = data.get("score")

    if not student_id or not feedback_text:
        return jsonify({"error": "student_id and feedback are required."}), 400

    result = DBService.add_assignment_feedback(assignment_id, student_id, feedback_text, score)
    return jsonify(result), 200
