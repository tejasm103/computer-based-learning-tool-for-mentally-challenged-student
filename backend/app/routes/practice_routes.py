"""
AccessibleVerse - Mistake Review, Revision & Pronunciation Routes
Handles recording quiz errors, targeted mistake revision drills, and speech pronunciation data.
"""

from flask import Blueprint, request, jsonify
from app.services.db_service import DBService

practice_bp = Blueprint("practice", __name__)

PRONUNCIATION_BANK = {
    "kannada": [
        {"id": "kn_01", "letter": "ಅ", "word": "ಅಮ್ಮ", "trans": "Amma", "meaning": "Mother", "phonetic": "uh-muh", "audio_text": "ಅಮ್ಮ"},
        {"id": "kn_02", "letter": "ಆ", "word": "ಆನೆ", "trans": "Aane", "meaning": "Elephant", "phonetic": "aah-nay", "audio_text": "ಆನೆ"},
        {"id": "kn_03", "letter": "ಇ", "word": "ಇಲಿ", "trans": "Ili", "meaning": "Mouse / Rat", "phonetic": "ih-lee", "audio_text": "ಇಲಿ"},
        {"id": "kn_04", "letter": "ಈ", "word": "ಈಜು", "trans": "Eeju", "meaning": "Swim", "phonetic": "ee-joo", "audio_text": "ಈಜು"},
        {"id": "kn_05", "letter": "ಉ", "word": "ಊಟ", "trans": "Oota", "meaning": "Meal", "phonetic": "oo-tuh", "audio_text": "ಊಟ"},
        {"id": "kn_06", "letter": "ಕ", "word": "ಕಮಲ", "trans": "Kamala", "meaning": "Lotus", "phonetic": "kuh-muh-luh", "audio_text": "ಕಮಲ"},
        {"id": "kn_07", "letter": "ಗ", "word": "ಗಣೇಶ", "trans": "Ganesha", "meaning": "Deity Ganesha", "phonetic": "guh-nay-shuh", "audio_text": "ಗಣೇಶ"},
        {"id": "kn_08", "letter": "ನ", "word": "ನವಿಲು", "trans": "Navilu", "meaning": "Peacock", "phonetic": "nuh-vee-loo", "audio_text": "ನವಿಲು"}
    ],
    "hindi": [
        {"id": "hi_01", "letter": "अ", "word": "अनार", "trans": "Anar", "meaning": "Pomegranate", "phonetic": "uh-naar", "audio_text": "अनार"},
        {"id": "hi_02", "letter": "आ", "word": "आम", "trans": "Aam", "meaning": "Mango", "phonetic": "aahm", "audio_text": "आम"},
        {"id": "hi_03", "letter": "इ", "word": "इमली", "trans": "Imli", "meaning": "Tamarind", "phonetic": "eem-lee", "audio_text": "इमली"},
        {"id": "hi_04", "letter": "क", "word": "कमल", "trans": "Kamal", "meaning": "Lotus", "phonetic": "kuh-muhl", "audio_text": "कमल"},
        {"id": "hi_05", "letter": "ग", "word": "गमला", "trans": "Gamla", "meaning": "Flower Pot", "phonetic": "guhm-laa", "audio_text": "गमला"},
        {"id": "hi_06", "letter": "प", "word": "पतंग", "trans": "Patang", "meaning": "Kite", "phonetic": "puh-tuhng", "audio_text": "पतंग"}
    ],
    "english": [
        {"id": "en_01", "letter": "A", "word": "Apple", "trans": "Apple", "meaning": "Sweet red fruit", "phonetic": "/æp.əl/", "audio_text": "Apple"},
        {"id": "en_02", "letter": "B", "word": "Butterfly", "trans": "Butterfly", "meaning": "Colorful insect", "phonetic": "/ˈbʌt.ə.flaɪ/", "audio_text": "Butterfly"},
        {"id": "en_03", "letter": "C", "word": "Courage", "trans": "Courage", "meaning": "Being brave", "phonetic": "/ˈkʌr.ɪdʒ/", "audio_text": "Courage"},
        {"id": "en_04", "letter": "D", "word": "Discovery", "trans": "Discovery", "meaning": "Finding new knowledge", "phonetic": "/dɪˈskʌv.ər.i/", "audio_text": "Discovery"},
        {"id": "en_05", "letter": "S", "word": "Sunshine", "trans": "Sunshine", "meaning": "Light from sun", "phonetic": "/ˈsʌn.ʃaɪn/", "audio_text": "Sunshine"}
    ]
}

@practice_bp.route("/mistakes", methods=["POST"])
def record_mistake():
    """Record an incorrect answer for review and targeted revision."""
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    quiz_id = data.get("quiz_id", "general")
    question_id = data.get("question_id", 0)
    question_text = data.get("question_text", "")
    chosen_option = data.get("chosen_option", "")
    correct_option = data.get("correct_option", "")
    explanation = data.get("explanation", "")
    category = data.get("category", "general")

    mistake_id = DBService.record_mistake(
        user_id=user_id,
        quiz_id=quiz_id,
        question_id=question_id,
        question_text=question_text,
        chosen_option=chosen_option,
        correct_option=correct_option,
        explanation=explanation,
        category=category
    )
    return jsonify({"success": True, "mistake_id": mistake_id}), 201

@practice_bp.route("/mistakes", methods=["GET"])
def get_mistakes():
    """Get unresolved mistakes for the current learner."""
    user_id = request.args.get("user_id", "guest")
    resolved_param = request.args.get("resolved", "false").lower() == "true"
    mistakes = DBService.get_user_mistakes(user_id, resolved=resolved_param)
    return jsonify({
        "success": True,
        "count": len(mistakes),
        "mistakes": mistakes
    }), 200

@practice_bp.route("/mistakes/<mistake_id>/resolve", methods=["POST"])
def resolve_mistake(mistake_id):
    """Mark a mistake as resolved after successful practice."""
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    res = DBService.resolve_mistake(user_id, mistake_id)
    if res.get("success"):
        DBService.increment_mission_progress(user_id, "quiz", count=1)
    return jsonify(res), 200

@practice_bp.route("/targeted", methods=["GET"])
def get_targeted_practice():
    """Generate targeted revision questions based on past mistakes."""
    user_id = request.args.get("user_id", "guest")
    mistakes = DBService.get_user_mistakes(user_id, resolved=False)
    
    revision_items = []
    for m in mistakes[:5]:
        revision_items.append({
            "mistake_id": m.get("id") or m.get("_id"),
            "question": m.get("question_text"),
            "correct_answer": m.get("correct_option"),
            "explanation": m.get("explanation"),
            "category": m.get("category")
        })
    return jsonify({"success": True, "revision_items": revision_items}), 200

@practice_bp.route("/pronunciation", methods=["GET"])
def get_pronunciation_words():
    """Get word bank for pronunciation and speech recognition drills."""
    lang = request.args.get("language", "all").lower()
    if lang in PRONUNCIATION_BANK:
        return jsonify({"success": True, "words": PRONUNCIATION_BANK[lang], "language": lang}), 200
    return jsonify({"success": True, "bank": PRONUNCIATION_BANK}), 200
