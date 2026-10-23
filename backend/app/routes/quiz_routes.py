"""
AccessibleVerse - Quiz Routes
Interactive quizzes for language alphabets, mathematics, road safety, and daily habits.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.db_service import DBService

quiz_bp = Blueprint("quizzes", __name__)

CURATED_QUIZZES = [
    {
        "id": "quiz_kannada_letters",
        "title": "Kannada Varnamale Challenge",
        "category": "language",
        "questions": [
            {
                "id": 1,
                "question": "Which of these is the first Swara (vowel) in Kannada?",
                "options": ["ಅ", "ಕ", "ಮ", "ರ"],
                "correct": 0,
                "explanation": "‘ಅ’ is the first vowel of Kannada Varnamale, representing the short 'a' sound (as in Amma)."
            },
            {
                "id": 2,
                "question": "What is the Kannada word for 'Mother' that starts with 'ಅ'?",
                "options": ["ಆನೆ", "ಅಮ್ಮ", "ಇಲಿ", "ಊಟ"],
                "correct": 1,
                "explanation": "‘ಅಮ್ಮ’ (Amma) begins with the letter ‘ಅ’."
            },
            {
                "id": 3,
                "question": "Which letter represents 'Ka' in Kannada consonants?",
                "options": ["ಗ", "ಚ", "ಕ", "ತ"],
                "correct": 2,
                "explanation": "‘ಕ’ is the first consonant (Vyanjana) of Ka-varga."
            }
        ]
    },
    {
        "id": "quiz_hindi_letters",
        "title": "Hindi Varnamala Discovery",
        "category": "language",
        "questions": [
            {
                "id": 1,
                "question": "Which Hindi letter represents the fruit 'अनार' (Pomegranate)?",
                "options": ["अ", "आ", "इ", "ई"],
                "correct": 0,
                "explanation": "‘अ’ से अनार (Pomegranate)."
            },
            {
                "id": 2,
                "question": "Which letter produces the sound 'Ka' as in 'कमल' (Lotus)?",
                "options": ["ख", "क", "ग", "घ"],
                "correct": 1,
                "explanation": "‘क’ से कमल (Lotus)."
            }
        ]
    },
    {
        "id": "quiz_math_basics",
        "title": "Numbers & Multiplication Flash Quiz",
        "category": "mathematics",
        "questions": [
            {
                "id": 1,
                "question": "What is 7 multiplied by 8 (7 x 8)?",
                "options": ["54", "56", "58", "64"],
                "correct": 1,
                "explanation": "7 x 8 = 56."
            },
            {
                "id": 2,
                "question": "Which of the following is an EVEN number?",
                "options": ["17", "23", "42", "55"],
                "correct": 2,
                "explanation": "42 ends with 2, which makes it divisible by 2 (an even number)."
            },
            {
                "id": 3,
                "question": "What is 100 divided by 4 (100 ÷ 4)?",
                "options": ["20", "25", "30", "50"],
                "correct": 1,
                "explanation": "100 divided into 4 equal quarters is 25."
            }
        ]
    },
    {
        "id": "quiz_traffic_safety",
        "title": "Road Safety & Zebra Crossing Test",
        "category": "everyday",
        "questions": [
            {
                "id": 1,
                "question": "What should vehicles do when a traffic light turns RED?",
                "options": ["Speed up", "Stop completely", "Honk horn", "Turn left immediately"],
                "correct": 1,
                "explanation": "Red light strictly means STOP before the stop line."
            },
            {
                "id": 2,
                "question": "Where is the safest place for pedestrians to cross the road?",
                "options": ["Between parked trucks", "Any random spot", "On the Zebra Crossing", "Over highway barriers"],
                "correct": 2,
                "explanation": "Zebra crossings are legally designated pedestrian crossings."
            },
            {
                "id": 3,
                "question": "Before stepping onto the road, what is the golden rule?",
                "options": ["Look at your phone", "Look Left, Look Right, Look Left again", "Run as fast as you can", "Close your eyes"],
                "correct": 1,
                "explanation": "Always look both ways: Left, Right, and Left again to ensure oncoming vehicles have stopped."
            }
        ]
    }
]

@quiz_bp.route("", methods=["GET"])
def get_quizzes():
    return jsonify({"quizzes": CURATED_QUIZZES}), 200

@quiz_bp.route("/submit", methods=["POST"])
def submit_quiz():
    data = request.get_json() or {}
    quiz_id = data.get("quiz_id")
    user_answers = data.get("answers", {})  # e.g. {"1": 0, "2": 1}
    user_id = data.get("user_id") or "guest"
    
    quiz = next((q for q in CURATED_QUIZZES if q["id"] == quiz_id), None)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
        
    score = 0
    total = len(quiz["questions"])
    feedback = []
    
    for q in quiz["questions"]:
        qid_str = str(q["id"])
        selected = user_answers.get(qid_str)
        is_correct = (selected == q["correct"])
        if is_correct:
            score += 1
        feedback.append({
            "question_id": q["id"],
            "correct": is_correct,
            "correct_option": q["correct"],
            "explanation": q["explanation"]
        })
        
    attempt_record = DBService.record_quiz_attempt(user_id, quiz_id, score, total)
    
    return jsonify({
        "quiz_id": quiz_id,
        "score": score,
        "total": total,
        "percentage": round((score / total) * 100, 1),
        "feedback": feedback,
        "xp_earned": attempt_record.get("xp_earned", 25)
    }), 200
