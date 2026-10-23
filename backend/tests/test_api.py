"""
AccessibleVerse - Backend API Tests
Tests for health check, authentication, lessons, videos, and game scores.
"""

import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Verify /api/health returns 200 and expected service status"""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "connected" in data["database"]

def test_get_lessons(client):
    """Verify /api/lessons returns lesson catalog"""
    res = client.get("/api/lessons")
    assert res.status_code == 200
    data = res.get_json()
    assert "lessons" in data
    assert len(data["lessons"]) > 0

def test_get_curated_videos(client):
    """Verify /api/videos returns the curated educational YouTube library"""
    res = client.get("/api/videos")
    assert res.status_code == 200
    data = res.get_json()
    assert "videos" in data
    assert len(data["videos"]) >= 10
    assert "playlist" in data
    assert "PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk" in data["playlist"]["playlist_id"]

def test_register_and_login_flow(client):
    """Verify user registration, JWT generation, and profile fetch"""
    test_user = {
        "username": "testexplorer",
        "email": "testexplorer@accessibleverse.org",
        "password": "Password123!",
        "full_name": "Test Explorer",
        "role": "student"
    }
    
    # Register
    reg_res = client.post("/api/auth/register", json=test_user)
    assert reg_res.status_code in [201, 409]
    
    # Login
    login_res = client.post("/api/auth/login", json={
        "identifier": "testexplorer",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    login_data = login_res.get_json()
    assert "access_token" in login_data
    assert login_data["user"]["username"] == "testexplorer"
    
    token = login_data["access_token"]
    
    # Get current user profile with token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.get_json()
    assert me_data["user"]["username"] == "testexplorer"

def test_game_score_submission(client):
    """Verify submitting score to /api/games/score"""
    score_payload = {
        "game_id": "knowledge-runner",
        "score": 450,
        "level": 3,
        "username": "SpeedyStudent"
    }
    res = client.post("/api/games/score", json=score_payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["record"]["score"] == 450
    
    # Leaderboard
    lb_res = client.get("/api/games/leaderboard/knowledge-runner")
    assert lb_res.status_code == 200
    lb_data = lb_res.get_json()
    assert len(lb_data["leaderboard"]) > 0
