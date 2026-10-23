"""
AccessibleVerse - Digital Student Portfolio & Certificate Verification Routes
Provides verified certificate issuance, public cryptographic verification, and student project portfolios.
"""

from flask import Blueprint, request, jsonify
from app.services.db_service import DBService

portfolio_bp = Blueprint("portfolio", __name__)

@portfolio_bp.route("", methods=["GET"])
def get_portfolio():
    """Retrieve digital student portfolio."""
    user_id = request.args.get("user_id", "guest")
    portfolio = DBService.get_user_portfolio(user_id)
    certificates = DBService.get_user_certificates(user_id)
    return jsonify({
        "success": True,
        "portfolio": portfolio,
        "certificates": certificates
    }), 200

@portfolio_bp.route("/items", methods=["POST"])
def add_portfolio_item():
    """Add a coding exercise, reflection, or project to portfolio."""
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    title = data.get("title", "Creative Discovery")
    item_type = data.get("type", "coding")
    content = data.get("content", "")
    tags = data.get("tags", [])

    item = DBService.add_portfolio_item(user_id, {
        "title": title,
        "type": item_type,
        "content": content,
        "tags": tags
    })
    return jsonify({"success": True, "item": item}), 201

@portfolio_bp.route("/certificates/issue", methods=["POST"])
def issue_certificate():
    """Issue a verified learning milestone certificate."""
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    course_id = data.get("course_id", "course_foundations")
    course_title = data.get("course_title", "Foundations of Accessible Learning")
    student_name = data.get("student_name", "AccessibleVerse Scholar")

    # Anti-cheating check: verify user has at least some activity or completed lessons
    user = DBService.get_user_by_id(user_id) if user_id != "guest" else None
    xp = user.get("xp", 0) if user else 100
    if xp < 50 and course_id != "welcome":
        return jsonify({
            "success": False,
            "error": "Certificates require verified course completion and milestone achievement."
        }), 400

    cert = DBService.issue_certificate(user_id, course_id, course_title, student_name)
    return jsonify({"success": True, "certificate": cert}), 201

@portfolio_bp.route("/certificates", methods=["GET"])
def list_certificates():
    """List certificates earned by student."""
    user_id = request.args.get("user_id", "guest")
    certs = DBService.get_user_certificates(user_id)
    return jsonify({"success": True, "certificates": certs}), 200

@portfolio_bp.route("/certificates/verify/<cert_id>", methods=["GET"])
def verify_certificate(cert_id):
    """Public verification endpoint to check genuine certificate validity."""
    result = DBService.verify_certificate(cert_id)
    status_code = 200 if result.get("valid") else 404
    return jsonify(result), status_code
