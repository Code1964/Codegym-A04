from flask import Flask, flash, redirect, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session
import sqlite3

from helpers import apology, login_required

def login():
    """Log user in"""

    # ログイン情報をクリア
    session.clear()

    # POST メソッドでアクセスされた場合
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # フォームが正しくなかった場合
        if not username:
            return apology("must provide username", 403)
        elif not password:
            return apology("must provide password", 403)

        # ユーザーのデータベース照会
        conn = sqlite3.connect("voyage.db")
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        # ユーザー名が存在し、パスワードが正しいことを確認
        if len(rows) != 1 or not check_password_hash(rows[0][2], password):
            return apology("invalid username and/or password", 403)

        # ログイン情報を記録
        session["user_id"] = rows[0][0]

        flash('ログインが完了しました！')
        # ホームページにリダイレクト
        return redirect("/")

    # GET メソッドでアクセスされた場合
    else:
        return render_template("login.html")
