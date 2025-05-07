from flask_mysqldb import MySQL
from supabase import create_client, Client
import psycopg2
import os
import httpx
import supabase



mysql = MySQL()

def init_supabase(app):

    # url = app.config["SUPABASE_URL"]
    # key = app.config["SUPABASE_KEY"]
    # cert_path = app.config["CETR_PATH"]

    try:
        connection = psycopg2.connect(
            user=app.config["USER"],
            password=app.config["PASSWORD"],
            host=app.config["HOST"],
            port=app.config["PORT"],
            dbname=app.config["DBNAME"]
        )
        print("Connection successful")
        return connection

    except Exception as e:
        print(f"Failed to connect: {e}")


    # app.supabase = create_client(url, key)