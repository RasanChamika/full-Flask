from flask_mysqldb import MySQL
from supabase import create_client
import os

mysql = MySQL()

def init_supabase(app):

    url = app.config["SUPABASE_URL"]
    key = app.config["SUPABASE_KEY"]

    app.supabase = create_client(url, key)  
    