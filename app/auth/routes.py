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
               return redirect(url_for('auth.dashboard'))
          except Exception as e:
               print(f"Error inserting data: {e}")

          
     return render_template("auth/Register.html", register_form=register_form,login_form=login_form)

@auth_bp.route("/employee_register", methods=["POST", "GET"])
def employee_register():

     data = request.get_json()
     print(f"DEBUG: received JSON = {data} ({type(data)})") 
     email = data.get("email")

     success, respons = check_employee_and_user(email)

     if success:
          return jsonify(respons), 200
     else:
          return jsonify(respons), 400


@auth_bp.route("/login", methods=["POST", "GET"])
def login():
          register_form = RegisterForm()
          login_form = LoginForm()

          supabase = current_app.supabase

          if login_form.validate_on_submit():
               print("Form validation successful")
               print(f"DEBUG: received JSON = {login_form.email.data} ({type(login_form.email.data)})")
               form_email = login_form.email.data
               form_password = login_form.password.data
               form_confrim_password = login_form.confirm_password.data
               form_remember = login_form.remember.data 

               email = {"email": form_email}
               print(f"DEBUG: received JSON = {email} ({type(email)})")

               success, respons = check_employee_and_user(email['email'])
               print(f"DEBUG: received JSON = {respons} ({type(respons)})")
               print(f"DEBUG: received JSON = {success} ({type(success)})")
               if success == False:
                    if respons['message'] == 'User already exists.':
                         try:
                              password_resp = supabase.table("users").select('*').eq('userEmail', email['email']).execute()
                              if password_resp.data and len(password_resp.data) > 0:
                                   userpassword = password_resp.data[0]['userPassword']
                                   if check_password_hash(userpassword, form_password):
                                        print("Login successful")
                                        session['user'] = email['email']
                                        session['userName'] = password_resp.data[0]['userName']
                                        print(f"DEBUG: received JSON = {session['user']} ({type(session['user'])})")
                                        return redirect(url_for('auth.dashboard'))
                                   else:
                                        print("Invalid password")
                                        return render_template("auth/Register.html", login_form=login_form,register_form=register_form)
                         except Exception as e:
                              print(f"Error inserting data: {e}")
                              return render_template("auth/Register.html", login_form=login_form,register_form=register_form)
               

               elif success:
                    if respons['message'] == 'Only employee exists.':
                         employee_name = respons['employee_name']

                         data = [{"userName": employee_name,
                                   "userEmail": email['email'],
                                   "userPassword": generate_password_hash(form_confrim_password)}]
                         try:
                              add_user_resp = supabase.table("users").insert(data).execute()
                              print(f"User registered successfully, response: {add_user_resp}")
                              if add_user_resp.data and len(add_user_resp.data) > 0:
                                   session['user'] = email['email']
                                   session['userName'] = employee_name
                                   return redirect(url_for('auth.dashboard'))
                              else:
                                   print("User registration failed")
                                   return render_template("/auth/Register.html", login_form=login_form,register_form=register_form)
                         except Exception as e:   
                              print(f"Error inserting data: {e}")
                              return render_template("/auth/Register.html", login_form=login_form,register_form=register_form)
               else:       
                    print("Form validation failed")
                    return render_template("auth/Register.html", login_form=login_form,register_form=register_form)
          else:
               print("Form validation failed:", login_form.errors)

          
          return render_template("auth/Register.html", login_form=login_form, register_form=register_form)


          
                         
def check_employee_and_user(email):
     supabase = current_app.supabase
     try:
          employee_resp = supabase.table("employee").select('*').eq('employee_email', email).execute()
          if employee_resp.data and len(employee_resp.data) > 0:
               print("Employee exists.")
               try:
                    user_resp = supabase.table("users").select('*').eq('userEmail', email).execute()
                    if user_resp.data and len(user_resp.data) > 0:
                         print("User already exists.")
                         return False, {"message": "User already exists."}
                    else:
                         print("User not exists.")
                         return True, {"message": "Only employee exists.", "employee_name": employee_resp.data[0]["employee_name"]}
               except Exception as e:
                    print(f"Error checking user: {e}")
                    return False, {"message": "Error occurred"}
          else: 
               print("Employee not exists.")
               return False, {"message": "Employee not exists"}
     except Exception as e:
          print(f"Error checking employee: {e}")
          return False, {"message": "Error occurred"}
     
@auth_bp.route("/dashboard")
def dashboard():
     if 'user' in session:
          return render_template("main/web.html")
     else:
          return redirect(url_for("auth.login"))