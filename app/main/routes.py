from pydoc import plain
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
        # first_row = df.iloc[0]  
        # result = {
        # "title": first_row["title"],
        # "description": first_row["description"],
        # "file": first_row["file"],
        # "plans": []
        # }

        # for _, row in df.iterrows():
        #     details_lines = str(row["details"]).split('\n')

        #     # Skip if details are missing or not properly formatted
        #     if len(details_lines) < 5:
        #         print(f"Skipping row due to insufficient details: {row}")
        #         continue
        #     plan = {
        #         "subtitle": row["subtitle"],
        #         "price_with_tax": row["details"].split('\n')[0].split(':')[-1].strip(),
        #         "voice_any_net": int(row["details"].split('\n')[1].split(':')[-1]),
        #         "sms_any_net": int(row["details"].split('\n')[2].split(':')[-1]),
        #         "any_time_data": row["details"].split('\n')[3].split(':')[-1].strip(),
        #         "validity": row["details"].split('\n')[4].split(':')[-1].strip(),
        #         "trc_reference_no": row["TRC Reference No"],
        #         "commencing_date": str(row["Commencing Date"]),
        #         "expiry_date": str(row["Expiry Date"])
        #     }
        #     result["plans"].append(plan)
        if os.path.exists('app/static/image/output.json'):
            with open('app/static/image/output.json', 'r') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    existing_data = []
        else:
            existing_data = []

        combined_data = existing_data + [cleaned_data]
        with open('app/static/image/output.json', 'w') as f:
            json.dump(combined_data, f, indent=4)

    else:
        print("File failed to upload")
        return jsonify({"error": "File upload failed"}), 400
    return jsonify({"message": "File uploaded successfully"}), 200


@main_bp.route("/show_plans", methods=["POST"])
def display_plans():
    try:
        with open("app/static/output.json", "r") as f:
            plans = json.load(f)
        return jsonify(plans), 200
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