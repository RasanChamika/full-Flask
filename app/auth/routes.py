from flask import Blueprint, request, jsonify, session, redirect, url_for, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import mysql,init_supabase
from app.auth.forms import RegisterForm, LoginForm
import re

auth_bp = Blueprint("auth", __name__, url_prefix='/auth')

@auth_bp.route("/register", methods=["POST", "GET"])
def register():
     form = RegisterForm()
     if form.validate_on_submit():
          username = form.username.data
          email = form.email.data
          password = form.password.data
          hashed_password = generate_password_hash(password)

          data = [{
               "userName" : username,
               "userEmail": email,
               "userPassword": hashed_password
          }]

          supabase = current_app.supabase
          responce = supabase.table('user').insert(data).execute()

          if responce.error:
               print(f"Error in inserting data. {responce.error}")
          else:
               print("data inserted successfully!")
def login():
     form = LoginForm()
     if form.validate_on_submit():
          email = form.email.data
          password = form.password.data

          supabase = current_app.supabase
          responce = supabase.table('employee').select('*').eq('employee_email',email).execute()
          if responce.data and len(responce.data) > 0:
               print("Employee exists.")
          else:
               print("Emploee not exists.")