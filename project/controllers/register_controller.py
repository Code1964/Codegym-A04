from flask import Flask, flash, redirect, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import apology
import sqlite3

def register():
    """Register user"""

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return apology("Must Give Username", 403)

        # 今あるデータベースのユーザーネームと一致していた時はreturn apologyを返す
        conn = sqlite3.connect("globe.db")
        c = conn.cursor()
        c.execute("SELECT username FROM users WHERE username=?", (username,))
        user = c.fetchone()
        c.close()
        conn.close()
        if user is not None:
            return apology("Username already exists", 400)

        if not password:
            return apology("Must Give Password", 403)

        if not confirmation:
            return apology("Must Give Confirmation", 403)

        if password != confirmation:
            return apology("Passwords Do Not Match", 403)

        hash = generate_password_hash(password)

        try:
            # ==== query ====================
            conn = sqlite3.connect("globe.db")
            cur = conn.cursor()
            # 引数はタプルにすることに注意
            cur.execute("INSERT INTO users (username, hash) VALUES(?, ?)", (username, hash))
            conn.commit()
            cur.close()
            conn.close()
            # ================================
        except:
            return apology("Failed to register to the database.", 500)

        flash("ユーザー登録完了")
        return redirect("/")

    # getメソッドのとき
    else:
        return render_template("register.html")
