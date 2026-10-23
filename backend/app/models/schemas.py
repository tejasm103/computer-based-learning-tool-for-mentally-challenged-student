"""
AccessibleVerse - Data Models and Schema Definitions
Documents MongoDB collection schemas for users, lessons, video_lessons, progress, quiz_attempts, and game_scores.
"""

USER_SCHEMA = {
    "username": str,
    "email": str,
    "password_hash": str,
    "full_name": str,
    "role": str,  # 'student' | 'teacher'
    "avatar": str,
    "xp": int,
    "streak": int,
    "completed_lessons": list,  # [lesson_id, ...]
    "achievements": list,        # [achievement_id, ...]
    "saved_videos": list,        # [video_id, ...]
    "language_preference": str,  # 'en' | 'kn' | 'hi'
    "accessibility_settings": {
        "high_contrast": bool,
        "dark_mode": bool,
        "font_size": str,        # 'small' | 'medium' | 'large' | 'xlarge'
        "dyslexic_font": bool,
        "narration": bool,
        "reduced_motion": bool,
        "mode_2d": bool
    },
    "created_at": "datetime"
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
