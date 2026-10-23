"""
AccessibleVerse - Data Models and Schema Definitions
Documents MongoDB collection schemas for users, lessons, classrooms, assignments,
mistakes, certificates, missions, portfolios, quiz_attempts, and game_scores.
"""

USER_SCHEMA = {
    "username": str,
    "email": str,
    "password_hash": str,
    "full_name": str,
    "role": str,  # 'student' | 'teacher' | 'guardian'
    "avatar": str,
    "xp": int,
    "streak": int,
    "completed_lessons": list,   # [lesson_id, ...]
    "achievements": list,         # [achievement_id, ...]
    "saved_videos": list,         # [video_id, ...]
    "enrolled_classrooms": list,  # [classroom_id, ...]
    "language_preference": str,   # 'en' | 'kn' | 'hi'
    "accessibility_settings": {
        "high_contrast": bool,
        "dark_mode": bool,
        "font_size": str,         # 'small' | 'medium' | 'large' | 'xlarge'
        "dyslexic_font": bool,
        "narration": bool,
        "reduced_motion": bool,
        "mode_2d": bool,
        "untimed": bool,
        "tts_speed": float
    },
    "created_at": "datetime"
}

CLASSROOM_SCHEMA = {
    "name": str,
    "subject": str,
    "description": str,
    "teacher_id": str,
    "join_code": str,             # e.g. "AV-8392"
    "students": list,             # [student_id, ...]
    "created_at": "datetime"
}

ASSIGNMENT_SCHEMA = {
    "classroom_id": str,
    "teacher_id": str,
    "title": str,
    "description": str,
    "activity_type": str,         # 'lesson' | 'quiz' | 'coding' | 'story'
    "activity_id": str,
    "due_date": str,
    "xp_reward": int,
    "submissions": list,          # [{student_id, submitted_at, score, feedback, status}]
    "created_at": "datetime"
}

MISTAKE_SCHEMA = {
    "user_id": str,
    "quiz_id": str,
    "question_id": int,
    "question_text": str,
    "chosen_option": str,
    "correct_option": str,
    "explanation": str,
    "category": str,
    "resolved": bool,
    "attempt_count": int,
    "created_at": "datetime"
}

CERTIFICATE_SCHEMA = {
    "certificate_id": str,        # e.g. "CERT-AV-2026-X839"
    "user_id": str,
    "student_name": str,
    "course_id": str,
    "course_title": str,
    "issued_at": "datetime",
    "verified": bool
}

DAILY_MISSION_SCHEMA = {
    "user_id": str,
    "date": str,                  # "YYYY-MM-DD"
    "missions": list,             # [{id, title, target, current, completed, xp_reward}]
    "all_completed": bool
}

PORTFOLIO_SCHEMA = {
    "user_id": str,
    "bio": str,
    "is_public": bool,
    "items": list,                # [{id, title, type, content, timestamp, tags}]
    "updated_at": "datetime"
}

GAME_SCORE_SCHEMA = {
    "user_id": str,
    "username": str,
    "game_id": str,
    "score": int,
    "level": int,
    "created_at": "datetime"
}

QUIZ_ATTEMPT_SCHEMA = {
    "user_id": str,
    "quiz_id": str,
    "score": int,
    "total_questions": int,
    "percentage": float,
    "xp_earned": int,
    "created_at": "datetime"
}
