import os
from dotenv import load_dotenv

class Config:

    load_dotenv()

    SECRET_KEY = os.environ.get("SECRET_KEY", os.urandom(24))
    MYSQL_HOST = os.environ.get("MYSQL_HOST")
    MYSQL_USER = os.environ.get("MYSQL_USER")
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD")
    MYSQL_DB = os.environ.get("MYSQL_DB")
    UPLOAD_FOLDER = "static/images"

    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
    # CETR_PATH = os.environ.get("SUPABASE_CERT_PATH")

    # USER = os.environ.get("user")
    # PASSWORD = os.environ.get("password")
    # HOST = os.environ.get("host")
    # PORT = os.environ.get("port")
    # DBNAME = os.environ.get("dbname")