from flask import Blueprint, request, jsonify, session, url_for, render_template,current_app
from app.extensions import mysql,init_supabase
import json

main_bp = Blueprint("main", __name__, url_prefix='/main')

@main_bp.route("/")
def index():
 return render_template("main/web.html")

@main_bp.route("/content")
def content():
 return render_template("web.html")

@main_bp.route("/show_plans", methods=["POST"])
def display_plans():
    try:
        with open("app/static/output.json", "r") as f:
            plans = json.load(f)
        return jsonify(plans), 200
    except Exception as e:
        print(f"Error reading file: {e}")
        return jsonify({"error": "Files not found"}), 404