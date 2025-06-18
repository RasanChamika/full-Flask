from flask import Blueprint, request, jsonify, session, url_for, render_template,current_app, redirect
from app.extensions import mysql,init_supabase
from app.auth.forms import RegisterForm, LoginForm
import json
import pandas as pd
import os

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

@main_bp.route("/add_plan", methods=["POST","GET"])
def add_plan():
    plan_file = request.files.get("plan_file")
    if plan_file:
        df = pd.read_excel(plan_file)
        print(f"DEBUG: received file = {plan_file} ({type(plan_file)})")
        cleaned_data = {}
        header = df.columns.tolist()
        for col in header:
            data = [val for val in df[col].tolist() if pd.notna(val)]
            cleaned_data[col] = data
            print(f"DEBUG: {col} = {data} ({type(data)})")
    
        file_name = cleaned_data["title"][0].replace(" ", "_").lower()

        with open(f'app/static/image/{file_name}.json', 'w') as f:
            json.dump(cleaned_data, f, indent=4)
        
        preData = {
            "title": "Plans and Rates - Prepaid",
            "subtitle": cleaned_data["title"][0],
            "description": cleaned_data["description"][0],
            "file": cleaned_data["file"][0],
            "price": cleaned_data["price"][0]
        }
        with open('app/static/output.json', 'r') as f:
            exeisting_data = json.load(f)
            if preData not in exeisting_data:
                exeisting_data.append(preData)
                with open('app/static/output.json', 'w') as f:
                    json.dump(exeisting_data, f, indent=4)
            else:
                print("Data already exists in the file")
    else:
        print("File failed to upload")
        return jsonify({"error": "File upload failed"}), 400
    return jsonify({"message": "File uploaded successfully"}), 200


with open("app/static/output.json", "r") as f:
    plans = json.load(f)
    
@main_bp.route("/show_plans", methods=["POST"])
def display_plans():
    try:
        return jsonify(plans), 200
    except Exception as e:
        print(f"Error reading file: {e}")
        return jsonify({"error": "Files not found"}), 404
    
@main_bp.route("/plan_details", methods=["GET"])
def plan_details():
    try:
        with open("app/static/image/output.json", "r") as f:
            data = json.load(f)
        return jsonify({"plans": data}), 200
    except Exception as e:
        print(f"Error reading file: {e}")
        return jsonify({"error": "Files not found"}), 404
    
@main_bp.route("/save_plans", methods=["POST"])
def save_plans():

    supabase = current_app.supabase

    try:
        values = request.get_json()
        if not values:
            return jsonify({"error": "No data provided"}), 400
        print(f"Received data: {values}")
        try:
            response = supabase.table("plans").select("*").eq('subtitle', values["subtitle"]).execute()
            print(f"User registered successfully, response: {response}")
            if response.data:
                print("Data already exists")
                return jsonify({"message": "Plans already exist"}), 200
            else:
                print("Data does not exist")
                try:
                    response = supabase.table("plans").insert(values).execute()
                    print(f"User registered successfully, response: {response}")
                    return jsonify({"message": "Plans saved successfully"}), 200
                except Exception as e:
                    print(f"Error inserting data: {e}")
                    return jsonify({"error": "Failed to save plans"}), 500
        except Exception as e:
            print(f"Error checking data: {e}")
            return jsonify({"error": "Failed to check data"}), 500
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return jsonify({"error": "Invalid JSON data"}), 400
     
    
@main_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    session.pop("userName", None)
    return redirect(url_for("main.index"))