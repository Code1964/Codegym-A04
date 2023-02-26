import os

import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from controllers import index_controller, event_controller, map_controller, summary_controller, timeline_controller
from dotenv import load_dotenv

# .envファイルの内容を読み込見込む
load_dotenv()

# Configure application, flaskのインスタンス化 (https://teratail.com/questions/356066)
app = Flask(__name__)

# Ensure templates are auto-reloaded, Trueにすると、テンプレートが変更されたときに再読み込みする。
app.config["TEMPLATES_AUTO_RELOAD"] = True

# app.add_url_rule("/", view_func=index)

@app.route("/")
def index():
    return index_controller.index()

@app.route("/event")
def event():
    return event_controller.event()

@app.route("/map")
def map():
    return map_controller.map()

@app.route("/summary")
def summary():
    return summary_controller.summary()

@app.route("/timeline")
def timeline():
    return timeline_controller.timeline()

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')
