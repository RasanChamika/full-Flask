from flask_mysqldb import MySQL
from supabase import create_client, Client
import psycopg2
import os
import httpx
import supabase
import certifi
import urllib3



mysql = MySQL()

def init_supabase(app):

    urllib3.disable_warnings()

    os.environ["CURL_CA_BUNDLE"] = ""

    url = app.config["SUPABASE_URL"]
    key = app.config["SUPABASE_KEY"]
    # cert_path = app.config["CETR_PATH"]

    # try:
    #     connection = psycopg2.connect(
    #         user=app.config["USER"],
    #         password=app.config["PASSWORD"],
    #         host=app.config["HOST"],
    #         port=app.config["PORT"],
    #         dbname=app.config["DBNAME"]
    #     )
    #     print("Connection successful")
    #     return connection

    # except Exception as e:
    #     print(f"Failed to connect: {e}")

    # insecure_httpx_client = httpx.Client(verify="C:/Users/rasanh.ou/Documents/plane_app/app/static")

    # client_options = {"verify": False}
    # httpx_client = httpx.Client(verify=False)

    # Initialize Supabase client
    supabase: Client = create_client(url, key)

    # Inject insecure client to bypass SSL verification errors
    # supabase._client = insecure_httpx_client

    # Attach to app
    app.supabase = supabase