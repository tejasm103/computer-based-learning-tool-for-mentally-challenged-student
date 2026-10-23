"""
AccessibleVerse - Database Service & Seed Data
Provides persistent MongoDB operations with in-memory fallback for initial local development.
"""

import os
from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import get_db, is_db_connected

# Official Curated Educational Videos as specified in requirements
CURATED_VIDEOS = [
    {
        "id": "vid_01",
        "youtube_id": "x6D51-pz2A4",
        "title": "Kannada Varnamale for Beginners - Swaragalu & Vyanjangalu",
        "category": "language",
        "language": "kn",
        "level": "beginner",
        "duration": "12:45",
        "description": "Learn basic Kannada alphabets, proper pronunciation, and writing strokes for vowels and consonants.",
        "thumbnail": "https://img.youtube.com/vi/x6D51-pz2A4/hqdefault.jpg"
    },
    {
        "id": "vid_02",
        "youtube_id": "D0Ajq682yrA",
        "title": "Hindi Varnamala - Swar aur Vyanjan with Pictures",
        "category": "language",
        "language": "hi",
        "level": "beginner",
        "duration": "10:15",
        "description": "Visual Hindi alphabet learning guide with phonetic sounds, pronunciation tips, and everyday examples.",
        "thumbnail": "https://img.youtube.com/vi/D0Ajq682yrA/hqdefault.jpg"
    },
    {
        "id": "vid_03",
        "youtube_id": "p-kAI-qOeJA",
        "title": "English Phonics and Alphabet Adventure A to Z",
        "category": "language",
        "language": "en",
        "level": "beginner",
        "duration": "14:20",
        "description": "Master English letter sounds, phonics blending, uppercase, and lowercase letter recognition.",
        "thumbnail": "https://img.youtube.com/vi/p-kAI-qOeJA/hqdefault.jpg"
    },
    {
        "id": "vid_04",
        "youtube_id": "ccEpTTZW34g",
        "title": "Numbers 1 to 100 & Counting with Fun Visuals",
        "category": "mathematics",
        "language": "en",
        "level": "beginner",
        "duration": "15:30",
        "description": "Learn numbers 1 to 100, place value concepts, counting blocks, and number identification games.",
        "thumbnail": "https://img.youtube.com/vi/ccEpTTZW34g/hqdefault.jpg"
    },
    {
        "id": "vid_05",
        "youtube_id": "4YzNB9DNmoI",
        "title": "Multiplication Tables 1 to 20 Made Super Easy",
        "category": "mathematics",
        "language": "en",
        "level": "intermediate",
        "duration": "18:05",
        "description": "Speed tricks, memory songs, and visual patterns to memorize multiplication tables effortlessly.",
        "thumbnail": "https://img.youtube.com/vi/4YzNB9DNmoI/hqdefault.jpg"
    },
    {
        "id": "vid_06",
        "youtube_id": "XRW67ZxPGk8",
        "title": "Traffic Signals, Road Safety & Pedestrian Crossing",
        "category": "everyday",
        "language": "en",
        "level": "beginner",
        "duration": "09:40",
        "description": "Understanding red, yellow, and green traffic lights, zebra crossings, and essential road safety rules.",
        "thumbnail": "https://img.youtube.com/vi/XRW67ZxPGk8/hqdefault.jpg"
    },
    {
        "id": "vid_07",
        "youtube_id": "FnW0TqxhJik",
        "title": "Daily Hygiene, Healthy Habits & Morning Routines",
        "category": "everyday",
        "language": "en",
        "level": "beginner",
        "duration": "08:15",
        "description": "Step-by-step hand washing, dental care, dressing up, and developing positive daily routines.",
        "thumbnail": "https://img.youtube.com/vi/FnW0TqxhJik/hqdefault.jpg"
    },
    {
        "id": "vid_08",
        "youtube_id": "KaBYEZ6q2tY",
        "title": "Emotions, Communication & Social Interactions",
        "category": "everyday",
        "language": "en",
        "level": "intermediate",
        "duration": "11:50",
        "description": "Recognizing feelings, building empathy, respectful conversations, and expressing needs clearly.",
        "thumbnail": "https://img.youtube.com/vi/KaBYEZ6q2tY/hqdefault.jpg"
    },
    {
        "id": "vid_09",
        "youtube_id": "NUMz00m8ySk",
        "title": "Computer Basics, Mouse, Keyboard & Internet Safety",
        "category": "technology",
        "language": "en",
        "level": "beginner",
        "duration": "13:10",
        "description": "Parts of a computer, staying safe on the web, password hygiene, and cyber awareness.",
        "thumbnail": "https://img.youtube.com/vi/NUMz00m8ySk/hqdefault.jpg"
    },
    {
        "id": "vid_10",
        "youtube_id": "xPq1KrYWbqo",
        "title": "Coding for Kids: HTML, CSS & JavaScript Fundamentals",
        "category": "technology",
        "language": "en",
        "level": "intermediate",
        "duration": "16:45",
        "description": "Create your first interactive web page with tags, colors, animations, and friendly logic.",
        "thumbnail": "https://img.youtube.com/vi/xPq1KrYWbqo/hqdefault.jpg"
    }
]

# Curated Lessons Curriculum across Languages, Mathematics, Everyday Life, and Coding
CURATED_LESSONS = [
    {
        "id": "kn-varnamale-1",
        "title": "ಕನ್ನಡ ವರ್ಣಮಾಲೆ - ಸ್ವರಗಳು (Kannada Vowels)",
        "subject": "kannada",
        "level": "beginner",
        "icon": "book-open",
        "description": "Learn the 14 Kannada Swaragalu (ಅ to ಅಃ) with audio pronunciation and word associations.",
        "xp": 50,
        "content": {
            "vowels": [
                {"letter": "ಅ", "trans": "a", "word": "ಅಮ್ಮ (Amma - Mother)", "sound": "short-a"},
                {"letter": "ಆ", "trans": "aa", "word": "ಆನೆ (Aane - Elephant)", "sound": "long-aa"},
                {"letter": "ಇ", "trans": "i", "word": "ಇಲಿ (Ili - Rat)", "sound": "short-i"},
                {"letter": "ಈ", "trans": "ee", "word": "ಈಜು (Eeju - Swim)", "sound": "long-ee"},
                {"letter": "ಉ", "trans": "u", "word": "ಉಡುಗೊರೆ (Udugore - Gift)", "sound": "short-u"},
                {"letter": "ಊ", "trans": "oo", "word": "ಊಟ (Oota - Meal)", "sound": "long-oo"},
                {"letter": "ಋ", "trans": "ru", "word": "ಋಷಿ (Rushi - Sage)", "sound": "vocalic-r"},
                {"letter": "ಎ", "trans": "e", "word": "ಎಲೆ (Ele - Leaf)", "sound": "short-e"},
                {"letter": "ಏ", "trans": "ee", "word": "ಏಣಿ (Eeni - Ladder)", "sound": "long-ee"},
                {"letter": "ಐ", "trans": "ai", "word": "ಐದು (Aidu - Five)", "sound": "diphthong-ai"},
                {"letter": "ಒ", "trans": "o", "word": "ಒಂಟೆ (Onte - Camel)", "sound": "short-o"},
                {"letter": "ಓ", "trans": "oo", "word": "ಓಲೆ (Oole - Earring)", "sound": "long-oo"},
                {"letter": "ಔ", "trans": "au", "word": "ಔಷಧ (Aushadha - Medicine)", "sound": "diphthong-au"},
                {"letter": "ಅಂ", "trans": "am", "word": "ಅಂಗಡಿ (Angadi - Shop)", "sound": "anusvara"},
                {"letter": "ಅಃ", "trans": "aha", "word": "ವಿಸರ್ಗ (Visarga)", "sound": "visarga"}
            ]
        }
    },
    {
        "id": "kn-vyanjana-1",
        "title": "ಕನ್ನಡ ವರ್ಣಮಾಲೆ - ವ್ಯಂಜನಗಳು (Kannada Consonants)",
        "subject": "kannada",
        "level": "intermediate",
        "icon": "book-open",
        "description": "Learn the 34 Kannada Vyanjangalu (ಕ to ಳ) organized by Ka-varga, Cha-varga, and beyond.",
        "xp": 60,
        "content": {
            "consonants": [
                {"letter": "ಕ", "trans": "ka", "word": "ಕಮಲ (Kamala - Lotus)"},
                {"letter": "ಖ", "trans": "kha", "word": "ಖಡ್ಗ (Khadga - Sword)"},
                {"letter": "ಗ", "trans": "ga", "word": "ಗಣೇಶ (Ganesha - Deity)"},
                {"letter": "ಘ", "trans": "gha", "word": "ಘಂಟೆ (Ghante - Bell)"},
                {"letter": "ಚ", "trans": "cha", "word": "ಚಮಚ (Chamacha - Spoon)"},
                {"letter": "ಜ", "trans": "ja", "word": "ಜಲ (Jala - Water)"},
                {"letter": "ಟ", "trans": "ta", "word": "ಟೊಮೆಟೊ (Tomato)"},
                {"letter": "ಡ", "trans": "da", "word": "ಡಮರು (Damaru - Drum)"},
                {"letter": "ತ", "trans": "tha", "word": "ತರಕಾರಿ (Tarakari - Vegetables)"},
                {"letter": "ದ", "trans": "da", "word": "ದೀಪ (Deepa - Lamp)"},
                {"letter": "ನ", "trans": "na", "word": "ನವಿಲು (Navilu - Peacock)"},
                {"letter": "ಪ", "trans": "pa", "word": "ಪಾರಿವಾಳ (Parivala - Pigeon)"},
                {"letter": "ಬ", "trans": "ba", "word": "ಬಾಳೆಹಣ್ಣು (Balehannu - Banana)"},
                {"letter": "ಮ", "trans": "ma", "word": "ಮರ (Mara - Tree)"},
                {"letter": "ಯ", "trans": "ya", "word": "ಯಜ್ಞ (Yajna - Ritual)"},
                {"letter": "ರ", "trans": "ra", "word": "ರೈಲು (Railu - Train)"},
                {"letter": "ಲ", "trans": "la", "word": "ಲಡ್ಡು (Laddu - Sweet)"},
                {"letter": "ವ", "trans": "va", "word": "ವನ (Vana - Forest)"},
                {"letter": "ಸ", "trans": "sa", "word": "ಸೂರ್ಯ (Surya - Sun)"},
                {"letter": "ಹ", "trans": "ha", "word": "ಹೂವು (Hoovu - Flower)"},
                {"letter": "ಳ", "trans": "la", "word": "ಕಿಳಿ (Kili - Parrot)"}
            ]
        }
    },
    {
        "id": "hi-varnamala-1",
        "title": "हिंदी वर्णमाला - स्वर और व्यंजन (Hindi Alphabet)",
        "subject": "hindi",
        "level": "beginner",
        "icon": "languages",
        "description": "Master Devanagari vowels (स्वर) and consonants (व्यंजन) with audio guide and picture examples.",
        "xp": 50,
        "content": {
            "vowels": [
                {"letter": "अ", "trans": "a", "word": "अनार (Pomegranate)"},
                {"letter": "आ", "trans": "aa", "word": "आम (Mango)"},
                {"letter": "इ", "trans": "i", "word": "इमली (Tamarind)"},
                {"letter": "ई", "trans": "ee", "word": "ईख (Sugarcane)"},
                {"letter": "उ", "trans": "u", "word": "उल्लू (Owl)"},
                {"letter": "ऊ", "trans": "oo", "word": "ऊन (Wool)"},
                {"letter": "ए", "trans": "e", "word": "एक (One)"},
                {"letter": "ऐ", "trans": "ai", "word": "ऐनक (Glasses)"},
                {"letter": "ओ", "trans": "o", "word": "ओखली (Mortar)"},
                {"letter": "औ", "trans": "au", "word": "औरत (Woman)"}
            ],
            "consonants": [
                {"letter": "क", "trans": "ka", "word": "कमल (Lotus)"},
                {"letter": "ख", "trans": "kha", "word": "खरगोश (Rabbit)"},
                {"letter": "ग", "trans": "ga", "word": "गमला (Pot)"},
                {"letter": "घ", "trans": "gha", "word": "घर (House)"},
                {"letter": "च", "trans": "cha", "word": "चम्मच (Spoon)"},
                {"letter": "छ", "trans": "chha", "word": "छतरी (Umbrella)"},
                {"letter": "ज", "trans": "ja", "word": "जहाज (Ship)"},
                {"letter": "झ", "trans": "jha", "word": "झंडा (Flag)"},
                {"letter": "ट", "trans": "ta", "word": "टमाटर (Tomato)"},
                {"letter": "ड", "trans": "da", "word": "डमरू (Drum)"},
                {"letter": "त", "trans": "ta", "word": "तरबूज (Watermelon)"},
                {"letter": "थ", "trans": "tha", "word": "थर्मस (Flask)"},
                {"letter": "द", "trans": "da", "word": "दवात (Inkpot)"},
                {"letter": "ध", "trans": "dha", "word": "धनुष (Bow)"},
                {"letter": "न", "trans": "na", "word": "नल (Tap)"},
                {"letter": "प", "trans": "pa", "word": "पतंग (Kite)"},
                {"letter": "फ", "trans": "pha", "word": "फल (Fruit)"},
                {"letter": "ब", "trans": "ba", "word": "बत्तख (Duck)"},
                {"letter": "भ", "trans": "bha", "word": "भालू (Bear)"},
                {"letter": "म", "trans": "ma", "word": "मछली (Fish)"},
                {"letter": "य", "trans": "ya", "word": "यज्ञ (Sacrifice)"},
                {"letter": "र", "trans": "ra", "word": "रथ (Chariot)"},
                {"letter": "ल", "trans": "la", "word": "लट्टू (Top)"},
                {"letter": "व", "trans": "va", "word": "वक (Heron)"},
                {"letter": "श", "trans": "sha", "word": "शलजम (Turnip)"},
                {"letter": "स", "trans": "sa", "word": "सपेरा (Charmer)"},
                {"letter": "ह", "trans": "ha", "word": "हाथी (Elephant)"}
            ]
        }
    },
    {
        "id": "en-alphabet-phonics",
        "title": "English Phonics & Word Discovery A to Z",
        "subject": "english",
        "level": "beginner",
        "icon": "type",
        "description": "Learn English letters, upper and lowercase pairs, phonetic sounds, and everyday vocabulary.",
        "xp": 50,
        "content": {
            "letters": [
                {"upper": "A", "lower": "a", "sound": "/æ/ as in Apple", "word": "Apple", "example": "A sweet red fruit."},
                {"upper": "B", "lower": "b", "sound": "/b/ as in Ball", "word": "Ball", "example": "We bounce the ball."},
                {"upper": "C", "lower": "c", "sound": "/k/ as in Cat", "word": "Cat", "example": "The playful cat purrs."},
                {"upper": "D", "lower": "d", "sound": "/d/ as in Dog", "word": "Dog", "example": "A loyal friendly dog."},
                {"upper": "E", "lower": "e", "sound": "/e/ as in Elephant", "word": "Elephant", "example": "A majestic animal."},
                {"upper": "F", "lower": "f", "sound": "/f/ as in Fish", "word": "Fish", "example": "Swimming in clean water."},
                {"upper": "G", "lower": "g", "sound": "/ɡ/ as in Giraffe", "word": "Giraffe", "example": "Tallest gentle friend."},
                {"upper": "H", "lower": "h", "sound": "/h/ as in House", "word": "House", "example": "A cozy safe home."}
            ]
        }
    },
    {
        "id": "math-numbers-100",
        "title": "Numbers 1 to 100 & Counting Patterns",
        "subject": "mathematics",
        "level": "beginner",
        "icon": "calculator",
        "description": "Explore 1 to 100 counting grid, tens and units, even and odd numbers with interactive counters.",
        "xp": 50,
        "content": {
            "ranges": ["1 to 20: Core foundations", "21 to 50: Tens groupings", "51 to 100: Century journey"],
            "concepts": ["Place value (Tens & Ones)", "Even numbers (2, 4, 6...)", "Odd numbers (1, 3, 5...)"]
        }
    },
    {
        "id": "math-multiplication-tables",
        "title": "Multiplication Tables 1 to 20 Mastery",
        "subject": "mathematics",
        "level": "intermediate",
        "icon": "hash",
        "description": "Master multiplication tables from 1 to 20 with interactive drill cards, audio spoken tables, and patterns.",
        "xp": 75,
        "content": {
            "tables": list(range(1, 21))
        }
    },
    {
        "id": "life-traffic-safety",
        "title": "Traffic Signals, Road Safety & Safe Crossing",
        "subject": "everyday",
        "level": "beginner",
        "icon": "shield-check",
        "description": "Learn the 3 traffic light signals, zebra crossing etiquette, pedestrian guidelines, and key signs.",
        "xp": 60,
        "content": {
            "lights": [
                {"color": "Red", "action": "STOP completely before the stop line."},
                {"color": "Yellow", "action": "WAIT & CAUTION. Prepare to stop safely."},
                {"color": "Green", "action": "GO safely after checking pedestrians."}
            ],
            "rules": [
                "Always cross on the Zebra Crossing when the pedestrian light is GREEN.",
                "Look Left, Look Right, and Look Left again before stepping onto the road.",
                "Never run across a road; walk briskly and attentively.",
                "Always walk on the sidewalk / footpath."
            ]
        }
    },
    {
        "id": "life-hygiene-habits",
        "title": "Personal Hygiene, Daily Routine & Health",
        "subject": "everyday",
        "level": "beginner",
        "icon": "sparkles",
        "description": "Daily grooming habits: brush twice daily, 20-second hand washing, nutritious meals, and rest.",
        "xp": 50,
        "content": {
            "checklist": [
                "Brush teeth morning and night",
                "Wash hands with soap for 20 seconds before eating",
                "Bathe daily and wear clean clothes",
                "Drink adequate water and eat fresh fruits",
                "Sleep for 8-9 hours for a fresh mind"
            ]
        }
    },
    {
        "id": "cs-coding-intro",
        "title": "Computer Basics & First Steps in Coding",
        "subject": "technology",
        "level": "beginner",
        "icon": "code",
        "description": "Discover computer parts, safe internet habits, and write your first HTML and Python code snippets.",
        "xp": 80,
        "content": {
            "topics": ["Hardware vs Software", "Internet safety & strong passwords", "HTML: The skeleton of web pages", "Python: Friendly programming logic"]
        }
    }
]

# Curated Achievements
CURATED_ACHIEVEMENTS = [
    {"id": "ach_first_lesson", "title": "First Step!", "description": "Complete your first learning lesson.", "icon": "award", "xp": 50},
    {"id": "ach_polyglot", "title": "Trilingual Explorer", "description": "Explore lessons in Kannada, Hindi, and English.", "icon": "globe", "xp": 100},
    {"id": "ach_math_whiz", "title": "Math Whiz", "description": "Score 100+ points in Number Quest.", "icon": "calculator", "xp": 75},
    {"id": "ach_runner_star", "title": "Runner Prodigy", "description": "Reach a score of 500 in 3D Knowledge Runner.", "icon": "zap", "xp": 150},
    {"id": "ach_road_guardian", "title": "Road Safety Guardian", "description": "Score 100% on the Traffic Safety Challenge.", "icon": "shield-check", "xp": 75},
    {"id": "ach_video_scholar", "title": "Video Scholar", "description": "Watch 3 educational videos.", "icon": "film", "xp": 100}
]

# In-Memory Datastore for safe local testing when MongoDB credentials are not yet configured
_memory_store = {
    "users": {},
    "progress": {},
    "game_scores": [],
    "quiz_attempts": [],
    "saved_videos": {}
}

class DBService:
    @staticmethod
    def get_user_by_email_or_username(identifier):
        db = get_db()
        if db is not None:
            return db.users.find_one({"$or": [{"email": identifier.lower()}, {"username": identifier.lower()}]})
        
        # Memory fallback
        for user in _memory_store["users"].values():
            if user["email"].lower() == identifier.lower() or user["username"].lower() == identifier.lower():
                return user
        return None

    @staticmethod
    def get_user_by_id(user_id):
        db = get_db()
        if db is not None:
            try:
                return db.users.find_one({"_id": ObjectId(user_id)})
            except Exception:
                return db.users.find_one({"id": user_id})
        return _memory_store["users"].get(str(user_id))

    @staticmethod
    def create_user(user_data):
        db = get_db()
        user_data["created_at"] = datetime.now(timezone.utc)
        user_data["xp"] = 0
        user_data["streak"] = 1
        user_data["completed_lessons"] = []
        user_data["achievements"] = ["ach_first_lesson"]
        user_data["accessibility_settings"] = {
            "high_contrast": False,
            "dark_mode": False,
            "font_size": "medium",
            "dyslexic_font": False,
            "narration": True,
            "reduced_motion": False,
            "mode_2d": False
        }
        user_data["language_preference"] = "en"
        
        if db is not None:
            result = db.users.insert_one(user_data)
            user_data["_id"] = str(result.inserted_id)
            user_data["id"] = str(result.inserted_id)
            return user_data
        
        # Memory fallback
        user_id = str(len(_memory_store["users"]) + 1)
        user_data["_id"] = user_id
        user_data["id"] = user_id
        _memory_store["users"][user_id] = user_data
        return user_data

    @staticmethod
    def update_user_profile(user_id, updates):
        db = get_db()
        if db is not None:
            try:
                db.users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
            except Exception:
                db.users.update_one({"id": user_id}, {"$set": updates})
            return DBService.get_user_by_id(user_id)
        
        # Memory fallback
        if str(user_id) in _memory_store["users"]:
            _memory_store["users"][str(user_id)].update(updates)
            return _memory_store["users"][str(user_id)]
        return None

    @staticmethod
    def get_all_lessons(subject=None, level=None):
        lessons = CURATED_LESSONS
        if subject:
            lessons = [l for l in lessons if l["subject"] == subject]
        if level:
            lessons = [l for l in lessons if l["level"] == level]
        return lessons

    @staticmethod
    def get_lesson_by_id(lesson_id):
        for l in CURATED_LESSONS:
            if l["id"] == lesson_id:
                return l
        return None

    @staticmethod
    def record_lesson_completion(user_id, lesson_id):
        lesson = DBService.get_lesson_by_id(lesson_id)
        xp_gain = lesson["xp"] if lesson else 25
        
        db = get_db()
        if db is not None:
            try:
                db.users.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$addToSet": {"completed_lessons": lesson_id}, "$inc": {"xp": xp_gain}}
                )
                db.progress.insert_one({
                    "user_id": str(user_id),
                    "lesson_id": lesson_id,
                    "completed_at": datetime.now(timezone.utc),
                    "xp_earned": xp_gain
                })
            except Exception:
                pass
            return {"success": True, "xp_gained": xp_gain}
        
        # Memory fallback
        user = _memory_store["users"].get(str(user_id))
        if user:
            if lesson_id not in user.get("completed_lessons", []):
                user.setdefault("completed_lessons", []).append(lesson_id)
                user["xp"] = user.get("xp", 0) + xp_gain
        return {"success": True, "xp_gained": xp_gain}

    @staticmethod
    def get_all_videos(category=None, language=None):
        videos = CURATED_VIDEOS
        if category:
            videos = [v for v in videos if v["category"] == category]
        if language:
            videos = [v for v in videos if v["language"] == language]
        return videos

    @staticmethod
    def toggle_saved_video(user_id, video_id):
        db = get_db()
        if db is not None:
            user = DBService.get_user_by_id(user_id)
            saved = user.get("saved_videos", []) if user else []
            if video_id in saved:
                saved.remove(video_id)
                action = "removed"
            else:
                saved.append(video_id)
                action = "saved"
            try:
                db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"saved_videos": saved}})
            except Exception:
                db.users.update_one({"id": user_id}, {"$set": {"saved_videos": saved}})
            return {"status": action, "saved_videos": saved}
            
        # Memory fallback
        user = _memory_store["users"].get(str(user_id))
        if not user:
            return {"status": "error", "message": "User not found"}
        saved = user.setdefault("saved_videos", [])
        if video_id in saved:
            saved.remove(video_id)
            action = "removed"
        else:
            saved.append(video_id)
            action = "saved"
        return {"status": action, "saved_videos": saved}

    @staticmethod
    def save_game_score(user_id, username, game_id, score, level=1):
        record = {
            "user_id": str(user_id),
            "username": username or "Explorer",
            "game_id": game_id,
            "score": int(score),
            "level": int(level),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db = get_db()
        if db is not None:
            db.game_scores.insert_one(record)
            # Award XP proportional to score
            xp_earned = max(10, int(score / 10))
            try:
                db.users.update_one({"_id": ObjectId(user_id)}, {"$inc": {"xp": xp_earned}})
            except Exception:
                db.users.update_one({"id": user_id}, {"$inc": {"xp": xp_earned}})
            record["xp_earned"] = xp_earned
            if "_id" in record:
                record["_id"] = str(record["_id"])
            return record
            
        # Memory fallback
        _memory_store["game_scores"].append(record)
        user = _memory_store["users"].get(str(user_id))
        xp_earned = max(10, int(score / 10))
        if user:
            user["xp"] = user.get("xp", 0) + xp_earned
        record["xp_earned"] = xp_earned
        return record

    @staticmethod
    def get_game_leaderboard(game_id, limit=10):
        db = get_db()
        if db is not None:
            cursor = db.game_scores.find({"game_id": game_id}).sort("score", -1).limit(limit)
            results = []
            for item in cursor:
                item["_id"] = str(item["_id"])
                results.append(item)
            return results
            
        # Memory fallback
        scores = [s for s in _memory_store["game_scores"] if s["game_id"] == game_id]
        scores.sort(key=lambda x: x["score"], reverse=True)
        return scores[:limit]

    @staticmethod
    def record_quiz_attempt(user_id, quiz_id, score, total_questions):
        percentage = round((score / total_questions) * 100, 1) if total_questions > 0 else 0
        xp_gain = int(percentage / 2)
        record = {
            "user_id": str(user_id),
            "quiz_id": quiz_id,
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage,
            "xp_earned": xp_gain,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db = get_db()
        if db is not None:
            db.quiz_attempts.insert_one(record)
            try:
                db.users.update_one({"_id": ObjectId(user_id)}, {"$inc": {"xp": xp_gain}})
            except Exception:
                pass
            if "_id" in record:
                record["_id"] = str(record["_id"])
            return record
            
        _memory_store["quiz_attempts"].append(record)
        user = _memory_store["users"].get(str(user_id))
        if user:
            user["xp"] = user.get("xp", 0) + xp_gain
        return record
