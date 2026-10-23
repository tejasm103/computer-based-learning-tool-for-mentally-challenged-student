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
        "description": "Learn all 34 Kannada Vyanjangalu (ಕ to ಳ) organized by vargas and avargiya vyanjana with audio.",
        "xp": 60,
        "content": {
            "consonants": [
                {"letter": "ಕ", "trans": "ka", "word": "ಕಮಲ (Kamala - Lotus)"},
                {"letter": "ಖ", "trans": "kha", "word": "ಖಡ್ಗ (Khadga - Sword)"},
                {"letter": "ಗ", "trans": "ga", "word": "ಗಣೇಶ (Ganesha - Deity)"},
                {"letter": "ಘ", "trans": "gha", "word": "ಘಂಟೆ (Ghante - Bell)"},
                {"letter": "ಙ", "trans": "nga", "word": "ಙ (Nga)"},
                {"letter": "ಚ", "trans": "cha", "word": "ಚಮಚ (Chamacha - Spoon)"},
                {"letter": "ಛ", "trans": "chha", "word": "ಛತ್ರಿ (Chhatri - Umbrella)"},
                {"letter": "ಜ", "trans": "ja", "word": "ಜಲ (Jala - Water)"},
                {"letter": "ಝ", "trans": "jha", "word": "ಝರಿ (Jhari - Stream)"},
                {"letter": "ಞ", "trans": "nya", "word": "ಞ (Nya)"},
                {"letter": "ಟ", "trans": "ta", "word": "ಟೊಮೆಟೊ (Tomato)"},
                {"letter": "ಠ", "trans": "tha", "word": "ಠಸ್ಸೆ (Thasse - Stamp)"},
                {"letter": "ಡ", "trans": "da", "word": "ಡಮರು (Damaru - Drum)"},
                {"letter": "ಢ", "trans": "dha", "word": "ಢಕ್ಕೆ (Dhakke - Big Drum)"},
                {"letter": "ಣ", "trans": "na", "word": "ವೀಣೆ (Veene - Lute)"},
                {"letter": "ತ", "trans": "ta", "word": "ತರಕಾರಿ (Tarakari - Vegetables)"},
                {"letter": "ಥ", "trans": "tha", "word": "ಥಳಥಳ (Thalathala - Sparkle)"},
                {"letter": "ದ", "trans": "da", "word": "ದೀಪ (Deepa - Lamp)"},
                {"letter": "ಧ", "trans": "dha", "word": "ಧನುಸ್ಸು (Dhanussu - Bow)"},
                {"letter": "ನ", "trans": "na", "word": "ನವಿಲು (Navilu - Peacock)"},
                {"letter": "ಪ", "trans": "pa", "word": "ಪಾರಿವಾಳ (Parivala - Pigeon)"},
                {"letter": "ಫ", "trans": "pha", "word": "ಫಲ (Phala - Fruit)"},
                {"letter": "ಬ", "trans": "ba", "word": "ಬಾಳೆಹಣ್ಣು (Balehannu - Banana)"},
                {"letter": "ಭ", "trans": "bha", "word": "ಭಾರತ (Bharatha - India)"},
                {"letter": "ಮ", "trans": "ma", "word": "ಮರ (Mara - Tree)"},
                {"letter": "ಯ", "trans": "ya", "word": "ಯಜ್ಞ (Yajna - Fire ritual)"},
                {"letter": "ರ", "trans": "ra", "word": "ರೈಲು (Railu - Train)"},
                {"letter": "ಲ", "trans": "la", "word": "ಲಡ್ಡು (Laddu - Sweet)"},
                {"letter": "ವ", "trans": "va", "word": "ವನ (Vana - Forest)"},
                {"letter": "ಶ", "trans": "sha", "word": "ಶಂಖ (Shankha - Conch)"},
                {"letter": "ಷ", "trans": "sha", "word": "ಷಟ್ಕೋನ (Shatkona - Hexagon)"},
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
        "description": "Master all Devanagari vowels (स्वर) and consonants (व्यंजन) with audio guide and picture examples.",
        "xp": 50,
        "content": {
            "vowels": [
                {"letter": "अ", "trans": "a", "word": "अनार (Pomegranate)"},
                {"letter": "आ", "trans": "aa", "word": "आम (Mango)"},
                {"letter": "इ", "trans": "i", "word": "इमली (Tamarind)"},
                {"letter": "ई", "trans": "ee", "word": "ईख (Sugarcane)"},
                {"letter": "उ", "trans": "u", "word": "उल्लू (Owl)"},
                {"letter": "ऊ", "trans": "oo", "word": "ऊन (Wool)"},
                {"letter": "ऋ", "trans": "ri", "word": "ऋषि (Sage)"},
                {"letter": "ए", "trans": "e", "word": "एक (One)"},
                {"letter": "ऐ", "trans": "ai", "word": "ऐनक (Glasses)"},
                {"letter": "ओ", "trans": "o", "word": "ओखली (Mortar)"},
                {"letter": "औ", "trans": "au", "word": "औरत (Woman)"},
                {"letter": "अं", "trans": "am", "word": "अंगूर (Grapes)"},
                {"letter": "अः", "trans": "ah", "word": "प्रातः (Morning)"}
            ],
            "consonants": [
                {"letter": "क", "trans": "ka", "word": "कमल (Lotus)"},
                {"letter": "ख", "trans": "kha", "word": "खरगोश (Rabbit)"},
                {"letter": "ग", "trans": "ga", "word": "गमला (Pot)"},
                {"letter": "घ", "trans": "gha", "word": "घर (House)"},
                {"letter": "ङ", "trans": "nga", "word": "अंग (Limb)"},
                {"letter": "च", "trans": "cha", "word": "चम्मच (Spoon)"},
                {"letter": "छ", "trans": "chha", "word": "छतरी (Umbrella)"},
                {"letter": "ज", "trans": "ja", "word": "जहाज (Ship)"},
                {"letter": "झ", "trans": "jha", "word": "झंडा (Flag)"},
                {"letter": "ञ", "trans": "nya", "word": "चंचल (Playful)"},
                {"letter": "ट", "trans": "ta", "word": "टमाटर (Tomato)"},
                {"letter": "ठ", "trans": "tha", "word": "ठठेरा (Tinsmith)"},
                {"letter": "ड", "trans": "da", "word": "डमरू (Drum)"},
                {"letter": "ढ", "trans": "dha", "word": "ढक्कन (Lid)"},
                {"letter": "ण", "trans": "na", "word": "बाण (Arrow)"},
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
                {"letter": "ष", "trans": "sha", "word": "षटकोण (Hexagon)"},
                {"letter": "स", "trans": "sa", "word": "सपेरा (Snake Charmer)"},
                {"letter": "ह", "trans": "ha", "word": "हाथी (Elephant)"},
                {"letter": "क्ष", "trans": "ksha", "word": "क्षत्रिय (Warrior)"},
                {"letter": "त्र", "trans": "tra", "word": "त्रिशूल (Trident)"},
                {"letter": "ज्ञ", "trans": "gya", "word": "ज्ञानी (Wise person)"}
            ]
        }
    },
    {
        "id": "en-alphabet-phonics",
        "title": "English Phonics & Word Discovery A to Z",
        "subject": "english",
        "level": "beginner",
        "icon": "type",
        "description": "Learn all 26 English letters A to Z, upper and lowercase pairs, phonetic sounds, and everyday vocabulary.",
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
                {"upper": "H", "lower": "h", "sound": "/h/ as in House", "word": "House", "example": "A cozy safe home."},
                {"upper": "I", "lower": "i", "sound": "/aɪ/ as in Ice cream", "word": "Ice cream", "example": "A delicious cold treat."},
                {"upper": "J", "lower": "j", "sound": "/dʒ/ as in Jug", "word": "Jug", "example": "Holds refreshing water."},
                {"upper": "K", "lower": "k", "sound": "/k/ as in Kite", "word": "Kite", "example": "Soaring in the blue sky."},
                {"upper": "L", "lower": "l", "sound": "/l/ as in Lion", "word": "Lion", "example": "King of the jungle."},
                {"upper": "M", "lower": "m", "sound": "/m/ as in Monkey", "word": "Monkey", "example": "Swinging through trees."},
                {"upper": "N", "lower": "n", "sound": "/n/ as in Nest", "word": "Nest", "example": "Home for little birds."},
                {"upper": "O", "lower": "o", "sound": "/ɒ/ as in Orange", "word": "Orange", "example": "Juicy and citrus fruit."},
                {"upper": "P", "lower": "p", "sound": "/p/ as in Parrot", "word": "Parrot", "example": "Colorful chatting bird."},
                {"upper": "Q", "lower": "q", "sound": "/kw/ as in Queen", "word": "Queen", "example": "A wise noble ruler."},
                {"upper": "R", "lower": "r", "sound": "/r/ as in Rabbit", "word": "Rabbit", "example": "Fast hopping bunny."},
                {"upper": "S", "lower": "s", "sound": "/s/ as in Sun", "word": "Sun", "example": "Bright warming sunshine."},
                {"upper": "T", "lower": "t", "sound": "/t/ as in Tiger", "word": "Tiger", "example": "Strong striped guardian."},
                {"upper": "U", "lower": "u", "sound": "/ʌ/ as in Umbrella", "word": "Umbrella", "example": "Shelters from the rain."},
                {"upper": "V", "lower": "v", "sound": "/v/ as in Van", "word": "Van", "example": "Rides together on a trip."},
                {"upper": "W", "lower": "w", "sound": "/w/ as in Watch", "word": "Watch", "example": "Tells us the right time."},
                {"upper": "X", "lower": "x", "sound": "/z/ as in Xylophone", "word": "Xylophone", "example": "Makes melodious music."},
                {"upper": "Y", "lower": "y", "sound": "/j/ as in Yak", "word": "Yak", "example": "Gentle mountain giant."},
                {"upper": "Z", "lower": "z", "sound": "/z/ as in Zebra", "word": "Zebra", "example": "Black and white striped friend."}
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
    },
    {
        "id": "science-solar-system",
        "title": "Cosmic Explorer: Planets & Our Solar System",
        "subject": "science",
        "level": "beginner",
        "icon": "globe",
        "description": "Travel through the 8 planets orbiting our Sun, understand planetary scales, day-night cycles, and moon phases.",
        "xp": 70,
        "content": {
            "planets": [
                {"name": "Mercury", "fact": "Smallest planet, closest to the Sun."},
                {"name": "Venus", "fact": "Hottest planet with thick atmosphere."},
                {"name": "Earth", "fact": "Our home with oceans, life, and breathable air."},
                {"name": "Mars", "fact": "The Red Planet with iron-rich soil and giant volcanoes."},
                {"name": "Jupiter", "fact": "Largest planet with a Great Red Spot storm."},
                {"name": "Saturn", "fact": "Famous for its stunning bright icy rings."},
                {"name": "Uranus", "fact": "An ice giant that rotates on its side."},
                {"name": "Neptune", "fact": "Distant windy blue planet with supersonic storms."}
            ]
        }
    },
    {
        "id": "science-plant-ecosystem",
        "title": "Living Ecosystems: Plants, Photosynthesis & Habitats",
        "subject": "science",
        "level": "intermediate",
        "icon": "flower",
        "description": "Discover how plants convert sunlight into energy, the role of pollinators, and how animals coexist in habitats.",
        "xp": 65,
        "content": {
            "steps": [
                {"step": "Roots", "desc": "Absorb water and minerals from soil."},
                {"step": "Stem", "desc": "Transports water and holds leaves up to sunlight."},
                {"step": "Leaves", "desc": "Use chlorophyll and sunlight to make plant food (Photosynthesis)."},
                {"step": "Oxygen", "desc": "Plants release fresh oxygen for humans and animals to breathe."}
            ]
        }
    },
    {
        "id": "cyber-safe-browsing",
        "title": "Cyber Shield: Passwords, Phishing & Safe Browsing",
        "subject": "cybersecurity",
        "level": "beginner",
        "icon": "shield-check",
        "description": "Learn to identify phishing scams, craft unbreakable passwords, secure your camera, and protect your identity online.",
        "xp": 80,
        "content": {
            "rules": [
                {"title": "Strong Passphrase", "tip": "Use 4 random words plus numbers, e.g. 'BlueSkyRiver#99'."},
                {"title": "Spotting Phishing", "tip": "Never click urgent links from unknown senders asking for passwords."},
                {"title": "Private Wi-Fi", "tip": "Avoid logging into sensitive accounts on open public Wi-Fi without VPN."},
                {"title": "Permissions Check", "tip": "Review camera and microphone permissions on apps regularly."}
            ]
        }
    },
    {
        "id": "life-money-shopping",
        "title": "Money Mastery: Indian Rupee (₹) & Smart Shopping",
        "subject": "everyday",
        "level": "beginner",
        "icon": "coins",
        "description": "Identify Indian Rupee coins and notes (₹1, ₹2, ₹5, ₹10, ₹20, ₹50, ₹100, ₹500), make budgets, and calculate change.",
        "xp": 60,
        "content": {
            "currency": [
                {"denomination": "₹1, ₹2, ₹5, ₹10 Coins", "use": "Everyday small grocery items and transit fares."},
                {"denomination": "₹20, ₹50, ₹100 Notes", "use": "Market shopping, books, and stationeries."},
                {"denomination": "₹200, ₹500 Notes", "use": "Large utility bills, clothing, and household savings."}
            ]
        }
    },
    {
        "id": "life-clock-time",
        "title": "Clock Reading & Daily Routine Scheduling",
        "subject": "everyday",
        "level": "beginner",
        "icon": "clock",
        "description": "Master reading analog clock hands (hour and minute), AM/PM concepts, and organizing your daily learning hours.",
        "xp": 55,
        "content": {
            "concepts": ["Short hand: Hours (1 to 12)", "Long hand: Minutes (60 in an hour)", "AM: Morning, PM: Afternoon & Evening"]
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
    {"id": "ach_video_scholar", "title": "Video Scholar", "description": "Watch 3 educational videos.", "icon": "film", "xp": 100},
    {"id": "ach_science_pioneer", "title": "Science Pioneer", "description": "Explore the Solar System and Ecosystems.", "icon": "globe", "xp": 100},
    {"id": "ach_cyber_shield", "title": "Cyber Shield Guardian", "description": "Conquer the Cybersecurity Escape Room.", "icon": "shield", "xp": 120},
    {"id": "ach_money_master", "title": "Rupee Master", "description": "Master the Indian Rupee Money and Shopping Counter.", "icon": "coins", "xp": 80},
    {"id": "ach_code_creator", "title": "Code Creator", "description": "Write and run your first interactive code snippet.", "icon": "code", "xp": 100},
    {"id": "ach_story_hero", "title": "Story Explorer", "description": "Complete your first interactive branching story.", "icon": "book", "xp": 80},
    {"id": "ach_mistake_healer", "title": "Mistake Master", "description": "Review and master 3 past quiz mistakes.", "icon": "check-circle", "xp": 90}
]

# In-Memory Datastore for safe local testing and offline execution
_memory_store = {
    "users": {},
    "progress": {},
    "game_scores": [],
    "quiz_attempts": [],
    "saved_videos": {},
    "classrooms": {},
    "assignments": [],
    "assignment_submissions": [],
    "mistakes": [],
    "certificates": {},
    "daily_missions": {},
    "portfolios": {},
    "study_events": []
}

class DBService:
    @staticmethod
    def get_user_by_email_or_username(identifier):
        db = get_db()
        if db is not None:
            return db.users.find_one({"$or": [{"email": identifier.lower()}, {"username": identifier.lower()}]})
        
        # Memory fallback
        for user in _memory_store["users"].values():
            u_email = user.get("email", "").lower()
            u_name = user.get("username", "").lower()
            if u_email == identifier.lower() or u_name == identifier.lower():
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

    # =========================================================================
    # Classroom & Guardian Methods
    # =========================================================================
    @staticmethod
    def create_classroom(teacher_id, name, subject, description=""):
        import random, string
        code = "AV-" + "".join(random.choices(string.digits, k=4))
        classroom = {
            "name": name,
            "subject": subject,
            "description": description,
            "teacher_id": str(teacher_id),
            "join_code": code,
            "students": [],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db = get_db()
        if db is not None:
            res = db.classrooms.insert_one(classroom)
            classroom["_id"] = str(res.inserted_id)
            classroom["id"] = str(res.inserted_id)
            return classroom
        
        cid = "class_" + str(len(_memory_store["classrooms"]) + 1)
        classroom["_id"] = cid
        classroom["id"] = cid
        _memory_store["classrooms"][cid] = classroom
        return classroom

    @staticmethod
    def get_classrooms_by_teacher(teacher_id):
        db = get_db()
        if db is not None:
            cursor = db.classrooms.find({"teacher_id": str(teacher_id)})
            return [{**c, "_id": str(c["_id"]), "id": str(c["_id"])} for c in cursor]
        return [c for c in _memory_store["classrooms"].values() if c["teacher_id"] == str(teacher_id)]

    @staticmethod
    def get_classroom_by_code(code):
        db = get_db()
        if db is not None:
            c = db.classrooms.find_one({"join_code": code.upper()})
            if c:
                return {**c, "_id": str(c["_id"]), "id": str(c["_id"])}
            return None
        for c in _memory_store["classrooms"].values():
            if c["join_code"] == code.upper():
                return c
        return None

    @staticmethod
    def join_classroom(student_id, code):
        classroom = DBService.get_classroom_by_code(code)
        if not classroom:
            return {"success": False, "error": "Invalid classroom join code."}
        
        cid = classroom["id"]
        sid = str(student_id)
        db = get_db()
        if db is not None:
            try:
                db.classrooms.update_one({"_id": ObjectId(cid)}, {"$addToSet": {"students": sid}})
            except Exception:
                db.classrooms.update_one({"id": cid}, {"$addToSet": {"students": sid}})
            try:
                db.users.update_one({"_id": ObjectId(sid)}, {"$addToSet": {"enrolled_classrooms": cid}})
            except Exception:
                db.users.update_one({"id": sid}, {"$addToSet": {"enrolled_classrooms": cid}})
            return {"success": True, "classroom": classroom}
        
        if sid not in classroom.setdefault("students", []):
            classroom["students"].append(sid)
        user = _memory_store["users"].get(sid)
        if user:
            user.setdefault("enrolled_classrooms", []).append(cid)
        return {"success": True, "classroom": classroom}

    @staticmethod
    def get_student_classrooms(student_id):
        sid = str(student_id)
        db = get_db()
        if db is not None:
            cursor = db.classrooms.find({"students": sid})
            return [{**c, "_id": str(c["_id"]), "id": str(c["_id"])} for c in cursor]
        return [c for c in _memory_store["classrooms"].values() if sid in c.get("students", [])]

    @staticmethod
    def create_assignment(classroom_id, teacher_id, title, description, activity_type, activity_id, due_date, xp_reward=50):
        assignment = {
            "classroom_id": str(classroom_id),
            "teacher_id": str(teacher_id),
            "title": title,
            "description": description,
            "activity_type": activity_type,
            "activity_id": activity_id,
            "due_date": due_date,
            "xp_reward": int(xp_reward),
            "submissions": {},
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db = get_db()
        if db is not None:
            res = db.assignments.insert_one(assignment)
            assignment["_id"] = str(res.inserted_id)
            assignment["id"] = str(res.inserted_id)
            return assignment
        
        aid = "assign_" + str(len(_memory_store["assignments"]) + 1)
        assignment["_id"] = aid
        assignment["id"] = aid
        _memory_store["assignments"].append(assignment)
        return assignment

    @staticmethod
    def get_assignments(classroom_id=None, student_id=None):
        db = get_db()
        query = {}
        if classroom_id:
            query["classroom_id"] = str(classroom_id)
        if db is not None:
            cursor = db.assignments.find(query)
            items = []
            for item in cursor:
                item["_id"] = str(item["_id"])
                item["id"] = str(item["_id"])
                items.append(item)
            return items
        
        results = _memory_store["assignments"]
        if classroom_id:
            results = [a for a in results if a["classroom_id"] == str(classroom_id)]
        return results

    @staticmethod
    def submit_assignment(assignment_id, student_id, score=100, notes=""):
        sid = str(student_id)
        submission = {
            "student_id": sid,
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "score": score,
            "notes": notes,
            "feedback": "",
            "status": "completed"
        }
        db = get_db()
        if db is not None:
            try:
                db.assignments.update_one(
                    {"_id": ObjectId(assignment_id)},
                    {"$set": {f"submissions.{sid}": submission}}
                )
            except Exception:
                db.assignments.update_one(
                    {"id": assignment_id},
                    {"$set": {f"submissions.{sid}": submission}}
                )
            return {"success": True, "submission": submission}
        
        for a in _memory_store["assignments"]:
            if a["id"] == str(assignment_id):
                a.setdefault("submissions", {})[sid] = submission
                return {"success": True, "submission": submission}
        return {"success": False, "error": "Assignment not found"}

    @staticmethod
    def add_assignment_feedback(assignment_id, student_id, feedback_text, score=None):
        sid = str(student_id)
        updates = {f"submissions.{sid}.feedback": feedback_text}
        if score is not None:
            updates[f"submissions.{sid}.score"] = score
        db = get_db()
        if db is not None:
            try:
                db.assignments.update_one({"_id": ObjectId(assignment_id)}, {"$set": updates})
            except Exception:
                db.assignments.update_one({"id": assignment_id}, {"$set": updates})
            return {"success": True}
        for a in _memory_store["assignments"]:
            if a["id"] == str(assignment_id):
                if sid in a.get("submissions", {}):
                    a["submissions"][sid]["feedback"] = feedback_text
                    if score is not None:
                        a["submissions"][sid]["score"] = score
                    return {"success": True}
        return {"success": False}

    # =========================================================================
    # Mistake Review & Practice Center
    # =========================================================================
    @staticmethod
    def record_mistake(user_id, quiz_id, question_id, question_text, chosen_option, correct_option, explanation, category="general"):
        mistake = {
            "user_id": str(user_id),
            "quiz_id": quiz_id,
            "question_id": question_id,
            "question_text": question_text,
            "chosen_option": chosen_option,
            "correct_option": correct_option,
            "explanation": explanation,
            "category": category,
            "resolved": False,
            "attempt_count": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db = get_db()
        if db is not None:
            existing = db.mistakes.find_one({
                "user_id": str(user_id),
                "quiz_id": quiz_id,
                "question_id": question_id
            })
            if existing:
                db.mistakes.update_one(
                    {"_id": existing["_id"]},
                    {"$inc": {"attempt_count": 1}, "$set": {"resolved": False, "chosen_option": chosen_option}}
                )
                return str(existing["_id"])
            res = db.mistakes.insert_one(mistake)
            return str(res.inserted_id)
        
        for m in _memory_store["mistakes"]:
            if m["user_id"] == str(user_id) and m["quiz_id"] == quiz_id and m["question_id"] == question_id:
                m["attempt_count"] += 1
                m["resolved"] = False
                m["chosen_option"] = chosen_option
                return m.get("id", "m_id")
        
        mid = "mistake_" + str(len(_memory_store["mistakes"]) + 1)
        mistake["id"] = mid
        _memory_store["mistakes"].append(mistake)
        return mid

    @staticmethod
    def get_user_mistakes(user_id, resolved=False):
        db = get_db()
        if db is not None:
            cursor = db.mistakes.find({"user_id": str(user_id), "resolved": resolved}).sort("created_at", -1)
            results = []
            for item in cursor:
                item["_id"] = str(item["_id"])
                item["id"] = str(item["_id"])
                results.append(item)
            return results
        return [m for m in _memory_store["mistakes"] if m["user_id"] == str(user_id) and m["resolved"] == resolved]

    @staticmethod
    def resolve_mistake(user_id, mistake_id):
        db = get_db()
        if db is not None:
            try:
                db.mistakes.update_one(
                    {"_id": ObjectId(mistake_id), "user_id": str(user_id)},
                    {"$set": {"resolved": True, "resolved_at": datetime.now(timezone.utc).isoformat()}}
                )
            except Exception:
                db.mistakes.update_one(
                    {"id": mistake_id, "user_id": str(user_id)},
                    {"$set": {"resolved": True, "resolved_at": datetime.now(timezone.utc).isoformat()}}
                )
            return {"success": True}
        for m in _memory_store["mistakes"]:
            if (m.get("id") == mistake_id or m.get("_id") == mistake_id) and m["user_id"] == str(user_id):
                m["resolved"] = True
                m["resolved_at"] = datetime.now(timezone.utc).isoformat()
                return {"success": True}
        return {"success": False}

    # =========================================================================
    # Certificates & Milestone Verification
    # =========================================================================
    @staticmethod
    def issue_certificate(user_id, course_id, course_title, student_name):
        import uuid
        cert_code = "CERT-AV-2026-" + uuid.uuid4().hex[:8].upper()
        cert = {
            "certificate_id": cert_code,
            "user_id": str(user_id),
            "student_name": student_name or "AccessibleVerse Scholar",
            "course_id": course_id,
            "course_title": course_title,
            "issued_at": datetime.now(timezone.utc).strftime("%B %d, %Y"),
            "verified": True,
            "issuer": "AccessibleVerse — Learn Without Limits Initiative"
        }
        db = get_db()
        if db is not None:
            db.certificates.insert_one(cert)
            cert["_id"] = str(cert.get("_id", cert_code))
            return cert
        
        _memory_store["certificates"][cert_code] = cert
        return cert

    @staticmethod
    def get_user_certificates(user_id):
        db = get_db()
        if db is not None:
            cursor = db.certificates.find({"user_id": str(user_id)})
            return [{**c, "_id": str(c["_id"])} for c in cursor]
        return [c for c in _memory_store["certificates"].values() if c["user_id"] == str(user_id)]

    @staticmethod
    def verify_certificate(cert_id):
        cert_code = cert_id.strip().upper()
        db = get_db()
        if db is not None:
            c = db.certificates.find_one({"certificate_id": cert_code})
            if c:
                return {**c, "_id": str(c["_id"]), "valid": True}
        if cert_code in _memory_store["certificates"]:
            return {**_memory_store["certificates"][cert_code], "valid": True}
        return {"valid": False, "error": "Certificate ID not found or could not be verified."}

    # =========================================================================
    # Daily Missions & Smart Study Plan
    # =========================================================================
    @staticmethod
    def get_or_create_daily_missions(user_id):
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        default_missions = [
            {"id": "m1", "title": "Complete 1 Learning Lesson", "type": "lesson", "target": 1, "current": 0, "xp_reward": 50, "completed": False},
            {"id": "m2", "title": "Score 80%+ in any Quiz", "type": "quiz", "target": 1, "current": 0, "xp_reward": 60, "completed": False},
            {"id": "m3", "title": "Explore a 3D Island / Play a Game", "type": "game", "target": 1, "current": 0, "xp_reward": 40, "completed": False}
        ]
        db = get_db()
        if db is not None:
            doc = db.daily_missions.find_one({"user_id": str(user_id), "date": today_str})
            if not doc:
                record = {
                    "user_id": str(user_id),
                    "date": today_str,
                    "missions": default_missions,
                    "all_completed": False
                }
                db.daily_missions.insert_one(record)
                record["_id"] = str(record["_id"])
                return record
            doc["_id"] = str(doc["_id"])
            return doc
        
        key = f"{user_id}_{today_str}"
        if key not in _memory_store["daily_missions"]:
            _memory_store["daily_missions"][key] = {
                "user_id": str(user_id),
                "date": today_str,
                "missions": default_missions,
                "all_completed": False
            }
        return _memory_store["daily_missions"][key]

    @staticmethod
    def increment_mission_progress(user_id, mission_type, count=1):
        missions_data = DBService.get_or_create_daily_missions(user_id)
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        updated = False
        xp_awarded = 0
        for m in missions_data["missions"]:
            if m["type"] == mission_type and not m["completed"]:
                m["current"] = min(m["target"], m["current"] + count)
                if m["current"] >= m["target"]:
                    m["completed"] = True
                    xp_awarded += m["xp_reward"]
                updated = True
        
        if updated:
            missions_data["all_completed"] = all(m["completed"] for m in missions_data["missions"])
            db = get_db()
            if db is not None:
                db.daily_missions.update_one(
                    {"user_id": str(user_id), "date": today_str},
                    {"$set": {"missions": missions_data["missions"], "all_completed": missions_data["all_completed"]}}
                )
                if xp_awarded > 0:
                    try:
                        db.users.update_one({"_id": ObjectId(user_id)}, {"$inc": {"xp": xp_awarded}})
                    except Exception:
                        db.users.update_one({"id": str(user_id)}, {"$inc": {"xp": xp_awarded}})
            else:
                user = _memory_store["users"].get(str(user_id))
                if user and xp_awarded > 0:
                    user["xp"] = user.get("xp", 0) + xp_awarded
        return missions_data

    @staticmethod
    def get_study_calendar(user_id):
        db = get_db()
        if db is not None:
            cursor = db.study_events.find({"user_id": str(user_id)}).sort("date", 1)
            return [{**e, "_id": str(e["_id"])} for e in cursor]
        return [e for e in _memory_store["study_events"] if e["user_id"] == str(user_id)]

    @staticmethod
    def save_study_event(user_id, event_data):
        event = {
            "user_id": str(user_id),
            "title": event_data.get("title", "Study Session"),
            "date": event_data.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d")),
            "time": event_data.get("time", "10:00 AM"),
            "activity_type": event_data.get("activity_type", "lesson"),
            "completed": event_data.get("completed", False)
        }
        db = get_db()
        if db is not None:
            res = db.study_events.insert_one(event)
            event["_id"] = str(res.inserted_id)
            return event
        _memory_store["study_events"].append(event)
        return event

    # =========================================================================
    # Digital Portfolio
    # =========================================================================
    @staticmethod
    def get_user_portfolio(user_id):
        db = get_db()
        if db is not None:
            p = db.portfolios.find_one({"user_id": str(user_id)})
            if p:
                return {**p, "_id": str(p["_id"])}
        
        if str(user_id) in _memory_store["portfolios"]:
            return _memory_store["portfolios"][str(user_id)]
        
        default_port = {
            "user_id": str(user_id),
            "bio": "Lifelong explorer on AccessibleVerse — learning without limits!",
            "is_public": False,
            "items": [],
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        return default_port

    @staticmethod
    def add_portfolio_item(user_id, item_data):
        import uuid
        item = {
            "id": "port_" + uuid.uuid4().hex[:8],
            "title": item_data.get("title", "My Project"),
            "type": item_data.get("type", "coding"),
            "content": item_data.get("content", ""),
            "tags": item_data.get("tags", []),
            "created_at": datetime.now(timezone.utc).strftime("%B %d, %Y")
        }
        db = get_db()
        if db is not None:
            db.portfolios.update_one(
                {"user_id": str(user_id)},
                {"$push": {"items": item}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
                upsert=True
            )
            return item
        
        port = _memory_store["portfolios"].setdefault(str(user_id), {
            "user_id": str(user_id),
            "bio": "Explorer on AccessibleVerse",
            "is_public": False,
            "items": [],
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
        port["items"].append(item)
        return item

    # =========================================================================
    # Progress Sync (Anti-Duplication & Multi-Device Merging)
    # =========================================================================
    @staticmethod
    def sync_user_progress(user_id, client_payload):
        user = DBService.get_user_by_id(user_id)
        if not user:
            user = {
                "id": str(user_id),
                "username": str(user_id),
                "full_name": "Explorer",
                "role": "student",
                "xp": 0,
                "streak": 1,
                "completed_lessons": [],
                "achievements": [],
                "accessibility_settings": {}
            }
            db = get_db()
            if db is not None:
                try:
                    db.users.insert_one({**user, "_id": ObjectId()})
                except Exception:
                    pass
            else:
                _memory_store["users"][str(user_id)] = user
        
        client_completed = client_payload.get("completed_lessons", [])
        server_completed = set(user.get("completed_lessons", []))
        
        new_lessons = [lid for lid in client_completed if lid not in server_completed]
        xp_gain_from_lessons = 0
        for lid in new_lessons:
            lesson = DBService.get_lesson_by_id(lid)
            xp_gain_from_lessons += (lesson["xp"] if lesson else 50)
            server_completed.add(lid)
            
        client_achievements = client_payload.get("achievements", [])
        server_achievements = set(user.get("achievements", []))
        server_achievements.update(client_achievements)
        
        a11y = client_payload.get("accessibility_settings", {})
        
        updates = {
            "completed_lessons": list(server_completed),
            "achievements": list(server_achievements),
            "accessibility_settings": {**user.get("accessibility_settings", {}), **a11y}
        }
        
        if xp_gain_from_lessons > 0:
            updates["xp"] = user.get("xp", 0) + xp_gain_from_lessons
        
        updated_user = DBService.update_user_profile(user_id, updates)
        return {
            "success": True,
            "user": updated_user,
            "new_lessons_synced": len(new_lessons),
            "xp_awarded": xp_gain_from_lessons
        }
