from flask import Blueprint, request, jsonify, session, url_for, render_template,current_app, redirect
from app.extensions import mysql,init_supabase
from app.auth.forms import RegisterForm, LoginForm
import json

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def root():
    return redirect(url_for("main.splash"))
 
@main_bp.route("/splash")
def splash():   
    return render_template("startup.html")

@main_bp.route("/index")
def index():
    if "user" not in session:
        register_form  = RegisterForm()
        login_form = LoginForm()
        return render_template("auth/Register.html", register_form=register_form,login_form=login_form)
    else:
        return render_template("main/web.html")

@main_bp.route("/user", methods=["GET"])
def get_user():
    if "user" in session:
        return jsonify({"email":session["user"], "name":session["userName"]})


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
    
@main_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    session.pop("userName", None)
    return redirect(url_for("main.index"))