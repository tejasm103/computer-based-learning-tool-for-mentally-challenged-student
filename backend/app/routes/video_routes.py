"""
AccessibleVerse - Videos Routes
Educational YouTube library endpoints for the 10 official videos and learning playlist.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.db_service import DBService, CURATED_VIDEOS

video_bp = Blueprint("videos", __name__)

PLAYLIST_METADATA = {
    "playlist_id": "PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk",
    "title": "AccessibleVerse Complete Multilingual & Life Skills Playlist",
    "youtube_url": "https://www.youtube.com/playlist?list=PLJTr95DbZYT_Lbqfxsf3mdNetS-D_LiQk",
    "description": "Comprehensive video series covering Kannada, Hindi, and English phonics, everyday mathematics, road safety, and daily routines."
}

@video_bp.route("", methods=["GET"])
def get_videos():
    category = request.args.get("category")
    language = request.args.get("language")
    search = request.args.get("q", "").strip().lower()
    
    videos = DBService.get_all_videos(category=category, language=language)
    
    if search:
        videos = [
            v for v in videos
            if search in v["title"].lower() or search in v["description"].lower()
        ]
        
    return jsonify({
        "videos": videos,
        "playlist": PLAYLIST_METADATA,
        "total": len(videos)
    }), 200

@video_bp.route("/<video_id>/save", methods=["POST"])
@jwt_required()
def toggle_save_video(video_id):
    user_id = get_jwt_identity()
    result = DBService.toggle_saved_video(user_id, video_id)
    return jsonify(result), 200
