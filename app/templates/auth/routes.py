from flask import Blueprint, request, jsonify, session, redirect, url_for, current_app, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import mysql,init_supabase
from app.templates.auth.forms import RegisterForm, LoginForm
import re

auth_bp = Blueprint("auth", __name__, url_prefix='/auth')


@auth_bp.route("/register", methods=["POST", "GET"])
def register():
     register_form = RegisterForm()
     login_form= LoginForm()
     if register_form.validate_on_submit():
          username = register_form.username.data
          email = register_form.email.data
          password = register_form.password.data
          hashed_password = generate_password_hash(password)

          data = [{
               "userName" : username,
               "userEmail": email,
               "userPassword": hashed_password
          }]

          supabase = current_app.supabase
          response = supabase.table('user').insert(data).execute()

          if response.error:
               print(f"Error in inserting data. {response.error}")
          else:
               print("data inserted successfully!")
     return render_template("auth/Register.html", register_form=register_form,login_form=login_form)

@auth_bp.route("/login", methods=["POST", "GET"])
def login():
     register_form = RegisterForm()
     login_form = LoginForm()
     if login_form.validate_on_submit():
          email = login_form.email.data
          password = login_form.password.data

          supabase = current_app.supabase
          response = supabase.table('employee').select('*').eq('employee_email',email).execute()
          if response.data and len(response.data) > 0:
               print("Employee exists.")
               response2 = supabase.table('user').select('*').eq('userEmail', email).execute()
               if response2.data and len(response2.data) > 0:
                    response3 = supabase.table('user').select('userPassword').eq('userEmail', email).execute()
                    if check_password_hash(response3.data[0], password) :
                         print("password correct")
                    else:
                         print("password incorrect")
               else:
                    print("user not exists.")
          else:
               print("Emploee not exists.")  
     return render_template("auth/Register.html", login_form=login_form,register_form=register_form)