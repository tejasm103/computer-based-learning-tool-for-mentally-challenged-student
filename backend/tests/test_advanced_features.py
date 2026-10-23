"""
AccessibleVerse - Advanced Features Integration Tests
Verifies AI Assistant, Classrooms, Mistake Review, Certificates, Portfolios, and Learning Paths.
"""

import json
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_ai_explanation(client):
    res = client.post("/api/ai/explain", json={
        "topic": "swaragalu",
        "subject": "kannada",
        "language": "kn"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "ಕನ್ನಡ" in data["explanation"]
    assert "hint" in data
    assert "practice_question" in data

def test_ai_quiz_generation(client):
    res = client.post("/api/ai/quiz-generate", json={
        "subject": "science",
        "topic": "solar system",
        "language": "en",
        "difficulty": "beginner"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert len(data["questions"]) >= 2
    assert "correct" in data["questions"][0]

def test_classroom_management(client):
    # 1. Create classroom
    c_res = client.post("/api/classrooms", json={
        "name": "5th Grade Explorers",
        "subject": "Science & Tech",
        "description": "Weekly interactive challenges",
        "teacher_id": "test_teacher"
    })
    assert c_res.status_code == 201
    c_data = c_res.get_json()
    assert c_data["success"] is True
    classroom = c_data["classroom"]
    cid = classroom["id"]
    code = classroom["join_code"]

    # 2. Student joins
    j_res = client.post("/api/classrooms/join", json={
        "code": code,
        "student_id": "test_student_1"
    })
    assert j_res.status_code == 200
    assert j_res.get_json()["success"] is True

    # 3. Create assignment
    a_res = client.post(f"/api/classrooms/{cid}/assignments", json={
        "title": "Master the Solar System",
        "description": "Complete the planets lesson",
        "activity_type": "lesson",
        "activity_id": "science-solar-system",
        "due_date": "Friday",
        "xp_reward": 75,
        "teacher_id": "test_teacher"
    })
    assert a_res.status_code == 201
    assign_id = a_res.get_json()["assignment"]["id"]

    # 4. Student submits assignment
    s_res = client.post(f"/api/classrooms/assignments/{assign_id}/submit", json={
        "student_id": "test_student_1",
        "score": 100,
        "notes": "Finished with 100% score!"
    })
    assert s_res.status_code == 200
    assert s_res.get_json()["success"] is True

    # 5. Teacher feedback
    f_res = client.post(f"/api/classrooms/assignments/{assign_id}/feedback", json={
        "student_id": "test_student_1",
        "feedback": "Outstanding work exploring Jupiter!",
        "score": 100
    })
    assert f_res.status_code == 200
    assert f_res.get_json()["success"] is True

def test_mistake_review_center(client):
    # Record mistake
    m_res = client.post("/api/practice/mistakes", json={
        "user_id": "test_user_err",
        "quiz_id": "quiz_math_basics",
        "question_id": 1,
        "question_text": "What is 7 x 8?",
        "chosen_option": "54",
        "correct_option": "56",
        "explanation": "7 x 8 = 56",
        "category": "mathematics"
    })
    assert m_res.status_code == 201
    mid = m_res.get_json()["mistake_id"]

    # Fetch mistakes
    g_res = client.get("/api/practice/mistakes?user_id=test_user_err")
    assert g_res.status_code == 200
    assert g_res.get_json()["count"] >= 1

    # Resolve mistake
    r_res = client.post(f"/api/practice/mistakes/{mid}/resolve", json={
        "user_id": "test_user_err"
    })
    assert r_res.status_code == 200
    assert r_res.get_json()["success"] is True

def test_certificates_and_verification(client):
    # Issue certificate
    c_res = client.post("/api/portfolio/certificates/issue", json={
        "user_id": "test_scholar",
        "course_id": "kn-varnamale-1",
        "course_title": "Kannada Alphabet Mastery",
        "student_name": "Rohan Explorer"
    })
    assert c_res.status_code == 201
    cert = c_res.get_json()["certificate"]
    cert_id = cert["certificate_id"]

    # Verify certificate publicly
    v_res = client.get(f"/api/portfolio/certificates/verify/{cert_id}")
    assert v_res.status_code == 200
    assert v_res.get_json()["valid"] is True
    assert v_res.get_json()["student_name"] == "Rohan Explorer"

def test_learning_path_and_missions(client):
    # Learning path
    lp_res = client.get("/api/learning-path?user_id=guest")
    assert lp_res.status_code == 200
    data = lp_res.get_json()
    assert data["success"] is True
    assert "subject_mastery" in data
    assert "daily_plan" in data

    # Daily missions
    m_res = client.get("/api/learning-path/missions?user_id=guest")
    assert m_res.status_code == 200
    m_data = m_res.get_json()["data"]
    assert len(m_data["missions"]) == 3

    # Progress sync
    sync_res = client.post("/api/learning-path/sync", json={
        "user_id": "demo_student",
        "progress_data": {
            "completed_lessons": ["science-solar-system"],
            "achievements": ["ach_science_pioneer"]
        }
    })
    assert sync_res.status_code == 200
    assert sync_res.get_json()["success"] is True
