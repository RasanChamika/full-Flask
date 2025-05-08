from flask import Blueprint, request, jsonify, session, redirect, url_for, current_app, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import mysql,init_supabase
from app.auth.forms import RegisterForm, LoginForm
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

          data = [{"userName": username,
                   "userEmail": email,
                   "userPassword": hashed_password}]


          # connection = init_supabase(current_app)
          # try:
          #      cursor = connection.cursor()
          #      cursor.execute('INSERT INTO users ("userName", "userEmail", "userPassword") VALUES (%s, %s, %s)', (username,email,hashed_password))
          #      connection.commit()
          #      cursor.close()
          #      connection.close()
          #      print("User registered successfully")
          # except Exception as e:
          #      print(f"Error registering user: {e}")
          #      cursor.close()
          #      connection.close()

          supabase = current_app.supabase
          
          if supabase:
               print("connection success!")
          else:
               print("connection fails")

          try:
               response = supabase.table("users").insert(data).execute()
               print(f"User registered successfully, response: {response}")
               for field in register_form:
                    field.data = ""
               return render_template("main/web.html")
          except Exception as e:
               print(f"Error inserting data: {e}")

          
     return render_template("auth/Register.html", register_form=register_form,login_form=login_form)

@auth_bp.route("/employee_register", methods=["POST", "GET"])
def employee_register():
     data = request.get_json()
     email = data.get("email")

     supabase = current_app.supabase

     try:
          response = supabase.table("employee").select('*').eq('employee_email',email).execute()
          print(f"Employee search successfully, response: {response.data}")
          if response.data and len(response.data) > 0:
               print("Employee exists.")
               try:
                    response2 = supabase.table("users").select('*').eq('userEmail', email).execute()
                    print(f"User search successfully, response: {response2.data}")
                    if response2.data and len(response2.data) > 0:
                         print("User already exists.")
                         return True, jsonify({"message": "User already exists"}), 200
                    else:
                         print("User not exists.")
                         return jsonify({"message": "Only employee exists."}), 200
               except Exception as e:
                    print(f"Error inserting data: {e}")
          else:
               print("Employee not exists.")
               return False, jsonify({"message": "Employee not exists"}), 200
          
     except Exception as e:
          print(f"Error inserting data: {e}")
          return False, jsonify({"message": "Error occurred"}), 500

@auth_bp.route("/login", methods=["POST", "GET"])
def login():
          register_form = RegisterForm()
          login_form = LoginForm()

          if login_form.validate_on_submit():
               email = login_form.email.data
               password = login_form.password.data
               check_password = login_form.confirm_password.data
          else:
               print("Form validation failed")
               return render_template("auth/Register.html", login_form=login_form,register_form=register_form)


          supabase = current_app.supabase
          if supabase:
               print("connection success!")
          else:
               print("connection fails")
          
          success, respons, _ = employee_register()
          data = respons.get_json()
          if success:
               try:
                    response = supabase.table("users").select('*').eq('userEmail', email).execute()
                    if response.data and len(response.data) > 0:
                         userpassword = response.data[3]['userPassword']
                         if check_password_hash(userpassword, password):
                              print("Login successful")
                              session['user'] = email
                              return render_template("main/web.html")
                         else:
                              print("Invalid password")
                              return render_template("auth/Register.html", login_form=login_form,register_form=register_form)
                    elif not success and data.get("message") == "Employee not exists":
                         print("Employee not exists")
                         return render_template("auth/Register.html", login_form=login_form,register_form=register_form)
                    else:
                         print("User not exists")
                         return render_template("auth/Register.html", login_form=login_form,register_form=register_form)
               except Exception as e:
                    print(f"Error inserting data: {e}")
                    return render_template("auth/Register.html", login_form=login_form,register_form=register_form)
          else:
               print("Supabase connection failed")
               return render_template("auth/Register.html", login_form=login_form,register_form=register_form)

                         
          