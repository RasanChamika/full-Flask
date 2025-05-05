from flask import Blueprint, request, jsonify, session, url_for

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def index():
 return jsonify({"message": "Welcome to the main page!"})