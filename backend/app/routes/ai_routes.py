"""
AccessibleVerse - AI Learning Assistant & Quiz Generator Routes
Provides trilingual AI explanations (English, Kannada, Hindi), hints, step-by-step
breakdowns, practice question generation, and rule-based fallback when AI is offline.
"""

import os
from flask import Blueprint, request, jsonify
from app.services.db_service import DBService

ai_bp = Blueprint("ai", __name__)

# Rule-based rich fallback dictionary for educational concepts
FALLBACK_KNOWLEDGE = {
    "kannada": {
        "swaragalu": {
            "en": "Kannada vowels (Swaragalu) are 14 independent sounds from 'ಅ' to 'ಅಃ'. They do not need other letters to be spoken.",
            "kn": "ಕನ್ನಡ ಸ್ವರಗಳು ಸ್ವತಂತ್ರವಾಗಿ ಉಚ್ಚರಿಸಬಹುದಾದ ಅಕ್ಷರಗಳು. 'ಅ' ಇಂದ 'ಅಃ' ವರೆಗೆ ಒಟ್ಟು 14 ಸ್ವರಗಳಿವೆ.",
            "hi": "कन्नड़ स्वर (स्वरागलु) 14 स्वतंत्र ध्वनियाँ हैं ('ಅ' से 'ಅಃ' तक), जिन्हें बिना किसी अन्य अक्षर की सहायता के बोला जाता है।",
            "hint": "Try remembering the short vowels (ಅ, ಇ, ಉ) vs long vowels (ಆ, ಈ, ಊ).",
            "example": "ಅ - ಅಮ್ಮ (Amma), ಆ - ಆನೆ (Aane), ಇ - ಇಲಿ (Ili)",
            "practice": "Which Swara represents the sound in 'Aane' (Elephant)? Answer: ಆ"
        },
        "vyanjanagalu": {
            "en": "Kannada consonants (Vyanjangalu) are 34 letters from 'ಕ' to 'ಳ', organized into groups called Vargas (Ka, Cha, Ta, Tha, Pa) and Avargiya letters.",
            "kn": "ಕನ್ನಡ ವ್ಯಂಜನಗಳು ಸ್ವರಗಳ ಸಹಾಯದಿಂದ ಉಚ್ಚರಿಸಲ್ಪಡುತ್ತವೆ. ಕ ಇಂದ ಳ ವರೆಗೆ ಒಟ್ಟು 34 ವ್ಯಂಜನಗಳಿವೆ.",
            "hi": "कन्नड़ व्यंजन 'ಕ' से 'ಳ' तक 34 अक्षर हैं, जिन्हें 5 वर्गों में और अवर्गीय अक्षरों में बांटा गया है।",
            "hint": "Group consonants by their row sound: Ka, Kha, Ga, Gha, Nga.",
            "example": "ಕ - ಕಮಲ (Kamala), ಗ - ಗಣೇಶ (Ganesha)",
            "practice": "What is the third consonant in the Ka-varga? Answer: ಗ"
        }
    },
    "hindi": {
        "varnamala": {
            "en": "Hindi Varnamala consists of 11 vowels (Swar) and 35+ consonants (Vyanjan). Each letter has an exact phonetic sound.",
            "kn": "ಹಿಂದಿ ವರ್ಣಮಾಲೆಯು 11 ಸ್ವರಗಳು ಮತ್ತು 35 ಕ್ಕೂ ಹೆಚ್ಚು ವ್ಯಂಜನಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
            "hi": "हिंदी वर्णमाला में 11 स्वर और 35 से अधिक व्यंजन होते हैं। देवनागरी लिपि वैज्ञानिक और ध्वन्यात्मक है।",
            "hint": "Each letter in Devanagari is pronounced exactly as written.",
            "example": "अ - अनार (Anar), आ - आम (Aam), क - कमल (Kamal)",
            "practice": "Which letter represents 'Aam' (Mango)? Answer: आ"
        }
    },
    "mathematics": {
        "multiplication": {
            "en": "Multiplication is repeated addition. For example, 4 × 3 means adding 4 three times (4 + 4 + 4 = 12).",
            "kn": "ಗುಣಾಕಾರವು ಪುನರಾವರ್ತಿತ ಸಂಕಲನವಾಗಿದೆ. ಉದಾಹರಣೆಗೆ 4 × 3 ಎಂದರೆ 4 ಅನ್ನು 3 ಬಾರಿ ಕೂಡಿಸುವುದು (4 + 4 + 4 = 12).",
            "hi": "गुणा बार-बार जोड़ना है। जैसे 4 × 3 का अर्थ है 4 को 3 बार जोड़ना (4 + 4 + 4 = 12)।",
            "hint": "Notice number patterns: 5s always end in 0 or 5. 10s always end in 0.",
            "example": "6 × 7 = 42. (6 + 6 + 6 + 6 + 6 + 6 + 6 = 42)",
            "practice": "What is 8 × 9? Answer: 72"
        },
        "fractions": {
            "en": "A fraction shows part of a whole. The top number is the numerator (parts we have), the bottom is the denominator (total equal parts).",
            "kn": "ಭಿನ್ನರಾಶಿಯು ಪೂರ್ಣ ಭಾಗದ ತುಂಡನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಮೇಲಿನ ಸಂಖ್ಯೆ ಅಂಶ, ಕೆಳಗಿನ ಸಂಖ್ಯೆ ಛೇದ.",
            "hi": "भिन्न किसी पूर्ण वस्तु के हिस्से को दर्शाता है। ऊपर की संख्या अंश और नीचे की संख्या हर कहलाती है।",
            "hint": "Think of a pizza sliced into 4 equal slices. 1 slice is 1/4 of the pizza.",
            "example": "1/2 is half, 1/4 is one quarter.",
            "practice": "If you eat 2 slices of a 4-slice pie, what fraction did you eat? Answer: 2/4 or 1/2"
        }
    },
    "science": {
        "solar_system": {
            "en": "Our solar system has 8 planets orbiting the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
            "kn": "ನಮ್ಮ ಸೌರವ್ಯೂಹದಲ್ಲಿ ಸೂರ್ಯನ ಸುತ್ತ 8 ಗ್ರಹಗಳು ಸುತ್ತುತ್ತವೆ: ಬುಧ, ಶುಕ್ರ, ಭೂಮಿ, ಮಂಗಳ, ಗುರು, ಶನಿ, ಯುರೇನಸ್ ಮತ್ತು ನೆಪ್ಚೂನ್.",
            "hi": "हमारे सौरमंडल में सूर्य की परिक्रमा करने वाले 8 ग्रह हैं: बुध, शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, अरुण और वरुण।",
            "hint": "Use the mnemonic: 'My Very Educated Mother Just Served Us Noodles'.",
            "example": "Earth is the 3rd planet and the only known planet with water and life.",
            "practice": "Which planet is famous for its bright icy rings? Answer: Saturn"
        },
        "photosynthesis": {
            "en": "Photosynthesis is the process plants use to make food using sunlight, water, and carbon dioxide, releasing clean oxygen.",
            "kn": "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯು ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಬಳಸಿ ಆಹಾರ ತಯಾರಿಸುವ ಮತ್ತು ಆಮ್ಲಜನಕ ಬಿಡುಗಡೆ ಮಾಡುವ ಕ್ರಿಯೆ.",
            "hi": "प्रकाश संश्लेषण वह प्रक्रिया है जिससे पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड से भोजन बनाते हैं और ऑक्सीजन छोड़ते हैं।",
            "hint": "Leaves are like tiny plant kitchens powered by green chlorophyll and sunlight.",
            "example": "Sunlight + Water + CO2 -> Plant Glucose + Oxygen",
            "practice": "What gas do plants release for us to breathe? Answer: Oxygen"
        }
    },
    "cybersecurity": {
        "passwords": {
            "en": "Strong passwords protect your private accounts. Use a passphrase with letters, numbers, and symbols like 'Sun#River42'.",
            "kn": "ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಕ್ಷಿಸುತ್ತವೆ. ಹೆಸರು ಅಥವಾ ಜನ್ಮದಿನಾಂಕದ ಬದಲು ಕನಿಷ್ಠ 4 ವಿಭಿನ್ನ ಪದಗಳು ಮತ್ತು ಚಿಹ್ನೆಗಳನ್ನು ಬಳಸಿ.",
            "hi": "मजबूत पासवर्ड आपके खातों को सुरक्षित रखते हैं। नाम या जन्मतिथि के बजाय 4 यादृच्छिक शब्द, अंक और प्रतीक मिलाकर बनाएं।",
            "hint": "A passphrase of 4 random words is easier to remember and much harder for hackers to crack.",
            "example": "Weak: '123456', Strong: 'BlueCoffeeTable#88'",
            "practice": "Should you ever share your password with friends? Answer: No, keep it private."
        },
        "phishing": {
            "en": "Phishing is when scammers pretend to be a trusted company to trick you into clicking unsafe links or sharing passwords.",
            "kn": "ಫಿಶಿಂಗ್ ಎಂದರೆ ನಕಲಿ ಸಂದೇಶಗಳು ಅಥವಾ ಲಿಂಕ್‌ಗಳ ಮೂಲಕ ನಿಮ್ಮ ಗೌಪ್ಯ ಮಾಹಿತಿಯನ್ನು ಕದಿಯುವ ತಂತ್ರ.",
            "hi": "फ़िशिंग एक साइबर धोखाधड़ी है जिसमें धोखेबाज़ नकली लिंक भेजकर आपकी निजी जानकारी या पासवर्ड चुराने की कोशिश करते हैं।",
            "hint": "Look for urgency traps: 'Click NOW or account closed!' is usually a scam.",
            "example": "Always check the sender email domain carefully before clicking links.",
            "practice": "What should you do if an unknown email asks for your password urgently? Answer: Report and delete it."
        }
    },
    "everyday": {
        "traffic": {
            "en": "Traffic lights guide road users: Red means STOP, Yellow means CAUTION/WAIT, Green means GO safely.",
            "kn": "ಟ್ರಾಫಿಕ್ ದೀಪಗಳು: ಕೆಂಪು ಎಂದರೆ ನಿಲ್ಲಿ, ಹಳದಿ ಎಂದರೆ ಎಚ್ಚರಿಕೆ/ಕಾಯಿರಿ, ಹಸಿರು ಎಂದರೆ ಸುರಕ್ಷಿತವಾಗಿ ಚಲಿಸಿ.",
            "hi": "ट्रैफ़िक लाइट: लाल का मतलब रुकें, पीला का मतलब प्रतीक्षा/सावधानी, हरा का मतलब सुरक्षित आगे बढ़ें।",
            "hint": "Always look both ways and use the Zebra Crossing.",
            "example": "Pedestrians cross only when the pedestrian walking light is GREEN.",
            "practice": "What does a flashing yellow signal mean? Answer: Slow down and proceed with caution."
        },
        "money": {
            "en": "Indian Rupee (₹) includes coins (₹1, ₹2, ₹5, ₹10) and paper notes (₹20 to ₹500). Count money carefully and check your balance.",
            "kn": "ಭಾರತೀಯ ರೂಪಾಯಿ (₹) ನಾಣ್ಯಗಳು ಮತ್ತು ನೋಟುಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಅಂಗಡಿಯಲ್ಲಿ ಖರೀದಿಸಿದಾಗ ಉಳಿಕೆ ಹಣವನ್ನು ಲೆಕ್ಕ ಹಾಕಿ ತೆಗೆದುಕೊಳ್ಳಿ.",
            "hi": "भारतीय रुपया (₹) में सिक्के और नोट होते हैं। खरीदारी करते समय सामान की कीमत और बाकी बचे पैसों की जांच करें।",
            "hint": "If an item costs ₹35 and you give a ₹50 note, you should get ₹15 back (50 - 35 = 15).",
            "example": "A notebook costs ₹20, pencil costs ₹5. Total = ₹25.",
            "practice": "You pay ₹100 for a ₹70 book. How much change do you receive? Answer: ₹30"
        }
    }
}

@ai_bp.route("/explain", methods=["POST"])
def explain_topic():
    """
    Trilingual AI explanation endpoint.
    Accepts topic, subject, language (en, kn, hi), and context.
    Returns structured explanation, hints, real-world examples, and practice question.
    """
    data = request.get_json() or {}
    topic = data.get("topic", "").strip().lower()
    subject = data.get("subject", "general").strip().lower()
    lang = data.get("language", "en").strip().lower()
    if lang not in ["en", "kn", "hi"]:
        lang = "en"

    # Search fallback knowledge base
    matched_entry = None
    subj_data = FALLBACK_KNOWLEDGE.get(subject, {})
    for key, entry in subj_data.items():
        if key in topic or topic in key:
            matched_entry = entry
            break
            
    if not matched_entry:
        # Check all subjects for topic match
        for s_name, s_entries in FALLBACK_KNOWLEDGE.items():
            for key, entry in s_entries.items():
                if key in topic or topic in key:
                    matched_entry = entry
                    break
            if matched_entry:
                break

    # If match found in knowledge base
    if matched_entry:
        explanation_text = matched_entry.get(lang, matched_entry.get("en", ""))
        return jsonify({
            "success": True,
            "topic": topic,
            "language": lang,
            "explanation": explanation_text,
            "hint": matched_entry.get("hint", ""),
            "example": matched_entry.get("example", ""),
            "practice_question": matched_entry.get("practice", ""),
            "source": "pedagogical_engine"
        }), 200

    # Default friendly pedagogic response
    default_explanations = {
        "en": f"Let's explore '{topic or subject}'! Learning step-by-step with curiosity helps you understand deeply. Focus on one idea at a time, observe real-world examples, and test yourself with fun practice.",
        "kn": f"ಬನ್ನಿ, '{topic or subject}' ಬಗ್ಗೆ ಸರಳವಾಗಿ ಕಲಿಯೋಣ! ಒಂದೊಂದೇ ಹಂತವಾಗಿ ಕಲಿಯುವುದು ನಿಮ್ಮ ಸ್ಮರಣಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ. ಉದಾಹರಣೆಗಳೊಂದಿಗೆ ಅಭ್ಯಾಸ ಮಾಡಿ.",
        "hi": f"आइए '{topic or subject}' के बारे में सरलता से सीखें! एक-एक कदम करके सीखना और दैनिक उदाहरणों को देखना समझने में बहुत मदद करता है।"
    }

    return jsonify({
        "success": True,
        "topic": topic,
        "language": lang,
        "explanation": default_explanations.get(lang, default_explanations["en"]),
        "hint": "Break down large concepts into small, bite-sized daily habits.",
        "example": "Notice how this concept appears in your everyday school and home life.",
        "practice_question": f"Can you describe one example of {topic or 'this subject'} that you noticed today?",
        "source": "rule_based_fallback"
    }), 200


@ai_bp.route("/quiz-generate", methods=["POST"])
def generate_quiz():
    """
    AI Quiz Creator: generates custom quizzes by subject, language, topic, and difficulty.
    Supports multiple-choice, true/false, and short answer formats.
    """
    data = request.get_json() or {}
    subject = data.get("subject", "science").lower()
    lang = data.get("language", "en").lower()
    difficulty = data.get("difficulty", "beginner").lower()
    topic = data.get("topic", "general")

    # Generate custom questions based on topic
    generated_questions = []
    
    if "solar" in topic or "planet" in topic or subject == "science":
        generated_questions = [
            {
                "id": 1,
                "type": "mcq",
                "question": "Which planet is closest to the Sun?" if lang != "kn" else "ಸೂರ್ಯನಿಗೆ ಅತ್ಯಂತ ಹತ್ತಿರವಿರುವ ಗ್ರಹ ಯಾವುದು?",
                "options": ["Mercury", "Venus", "Earth", "Mars"] if lang != "kn" else ["ಬುಧ (Mercury)", "ಶುಕ್ರ (Venus)", "ಭೂಮಿ (Earth)", "ಮಂಗಳ (Mars)"],
                "correct": 0,
                "hint": "It is also the smallest planet in our solar system.",
                "explanation": "Mercury is the first and closest planet orbiting the Sun at an average distance of 58 million km."
            },
            {
                "id": 2,
                "type": "true_false",
                "question": "Earth is the only known planet that has oceans of liquid water and living organisms.",
                "options": ["True", "False"],
                "correct": 0,
                "hint": "Think about where animals, plants, and humans live.",
                "explanation": "True! Earth's temperature and atmosphere make it unique in supporting liquid water and life."
            },
            {
                "id": 3,
                "type": "mcq",
                "question": "What gas do plants release during photosynthesis for humans and animals to breathe?",
                "options": ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"],
                "correct": 1,
                "hint": "We inhale this vital gas every second.",
                "explanation": "Plants take in Carbon Dioxide and release clean Oxygen into the air."
            }
        ]
    elif "cyber" in topic or subject == "cybersecurity":
        generated_questions = [
            {
                "id": 1,
                "type": "mcq",
                "question": "Which of these is the SAFEST password?",
                "options": ["12345678", "password", "MyDog123", "BlueRiver#Coffee99"],
                "correct": 3,
                "hint": "Long passphrases with mixed symbols and random words are hardest to crack.",
                "explanation": "'BlueRiver#Coffee99' is a multi-word passphrase with symbols, offering high cryptographic strength."
            },
            {
                "id": 2,
                "type": "true_false",
                "question": "You should click on urgent email links claiming you won a lottery from an unknown sender.",
                "options": ["True", "False"],
                "correct": 1,
                "hint": "Urgency and unexpected prizes are the most common signs of a phishing scam.",
                "explanation": "False! Never click suspicious links. Verify with a parent or teacher."
            }
        ]
    elif "money" in topic or subject == "everyday":
        generated_questions = [
            {
                "id": 1,
                "type": "mcq",
                "question": "If you buy an apple for ₹15 and pay with a ₹50 note, how much change should you receive?",
                "options": ["₹25", "₹35", "₹40", "₹30"],
                "correct": 1,
                "hint": "Subtract 15 from 50 (50 - 15 = ?).",
                "explanation": "₹50 - ₹15 = ₹35 change."
            },
            {
                "id": 2,
                "type": "mcq",
                "question": "What should a pedestrian do when the pedestrian crossing light turns RED?",
                "options": ["Wait safely on the footpath", "Run across fast", "Ignore the light", "Walk slowly in middle of road"],
                "correct": 0,
                "hint": "Red means stop and wait.",
                "explanation": "A red pedestrian signal means vehicles have right of way; pedestrians must wait safely on the curb."
            }
        ]
    else:
        generated_questions = [
            {
                "id": 1,
                "type": "mcq",
                "question": f"What is a primary foundational concept in {topic or subject}?",
                "options": ["Understanding the core definitions", "Skipping the fundamentals", "Memorizing without understanding", "Ignoring practice"],
                "correct": 0,
                "hint": "Strong foundations make advanced learning joyful and effortless.",
                "explanation": "Understanding core definitions step-by-step is the proven method to master any subject."
            }
        ]

    return jsonify({
        "success": True,
        "title": f"{subject.capitalize()} Practice Quiz: {topic.capitalize()}",
        "subject": subject,
        "language": lang,
        "difficulty": difficulty,
        "questions_count": len(generated_questions),
        "questions": generated_questions
    }), 200


@ai_bp.route("/recommend", methods=["POST"])
def recommend_next_steps():
    """
    Personalized recommendation engine based on user history, mistakes, and goals.
    """
    data = request.get_json() or {}
    user_id = data.get("user_id", "guest")
    user = DBService.get_user_by_id(user_id) if user_id != "guest" else None
    
    completed = user.get("completed_lessons", []) if user else []
    all_lessons = DBService.get_all_lessons()
    
    # Recommend next uncompleted lessons
    uncompleted = [l for l in all_lessons if l["id"] not in completed]
    recommended = uncompleted[:3] if uncompleted else all_lessons[:3]
    
    # Check if user has unresolved mistakes
    mistakes = DBService.get_user_mistakes(user_id, resolved=False) if user else []
    
    return jsonify({
        "success": True,
        "recommended_lessons": recommended,
        "unresolved_mistakes_count": len(mistakes),
        "streak": user.get("streak", 1) if user else 1,
        "xp": user.get("xp", 0) if user else 0,
        "reason": "Based on your progress and learning pace, these topics will maximize your concept mastery."
    }), 200
