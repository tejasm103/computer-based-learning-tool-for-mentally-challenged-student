"""
AccessibleVerse - Main Application Server Entry Point
Run this script to start the Flask REST API locally or on Render.
"""

import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development").lower() == "development"
    print(f"\n=======================================================")
    print(f"🚀 AccessibleVerse Backend REST API is running!")
    print(f"📡 Local URL: http://127.0.0.1:{port}")
    print(f"🩺 Health Check: http://127.0.0.1:{port}/api/health")
    print(f"=======================================================\n")
    app.run(host="0.0.0.0", port=port, debug=debug)
