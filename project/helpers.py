import os
import requests
import urllib.parse

from flask import redirect, render_template, request, session
from functools import wraps


def apology(message, code=400):
    """Render message as an apology to user."""

    def escape(s):
        """
        Escape special characters.
        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s

    return render_template("apology.html", top=code, bottom=escape(message)), code


def login_required(f): # 引数fは元の関数
    """
    Decorate routes to require login.
    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """

    @wraps(f) # 元の関数をラップする
    def decorated_function(*args, **kwargs): # 可変長引数にしてどんな関数にも対応できるようにする
        if session.get("user_id") is None: # sessionにuser_idがない場合->loginしていない場合
            return redirect("/login")
        return f(*args, **kwargs) # ログインしていた場合はそのまま関数を返す

    return decorated_function
    