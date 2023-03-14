import os

import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv

from helpers import apology, login_required

from controllers import index_controller, map_controller, region_info_controller, login_controller, logout_controller, register_controller, change_password_controller, usage_controller, flashcard_controller

# Configure application, flaskのインスタンス化 (https://teratail.com/questions/356066)
app = Flask(__name__)

# Ensure templates are auto-reloaded, Trueにすると、テンプレートが変更されたときに再読み込みする。
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Flaskのデフォルトである(デジタル署名された)cookie内に格納するのではなく、ローカルファイルシステム(ディスク)に格納するようにFlaskを構成
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# .envファイルの内容を読み込む
load_dotenv()

# API keyがセットされていることを確認
if not os.getenv("GOOGLE_MAPS_API_KEY"):
    raise RuntimeError("GOOGLE_MAPS_API_KEY not set")

# リクエストを送った後レスポンスがcacheされないように設定している
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    return index_controller.index()

@app.route("/map")
def map():
    return map_controller.map()

@app.route("/region_info")
def region_info():
    return region_info_controller.region_info()

@app.route("/usage")
def usage():
    return usage_controller.usage()

@app.route("/login", methods=["GET", "POST"])
def login():
    return login_controller.login()

@app.route("/logout")
def logout():
    return logout_controller.logout()

@app.route("/register", methods=["GET", "POST"])
def register():
    return register_controller.register()

@app.route("/change_password", methods=["GET", "POST"])
@login_required
def change_password():
    return change_password_controller.change_password()

@app.route("/mypage", methods=["GET", "POST"])
@login_required
def mypage():
    return mypage_controller.mypage()

@app.route("/flashcard", methods=["GET", "POST"])
@login_required
def flashcard():
    return flashcard_controller.flashcard()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
