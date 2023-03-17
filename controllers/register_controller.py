from flask import Flask, flash, redirect, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import apology
import sqlite3

def register():
    """Register user"""

    # POST メソッドの場合
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return apology("Must Give Username", 403)
        elif not password:
            return apology("Must Give Password", 403)
        elif not confirmation:
            return apology("Must Give Confirmation", 403)
        elif password != confirmation:
            return apology("Passwords Do Not Match", 403)

        try:
            # 今あるデータベースのユーザーネームと一致していた時はapologyを返す
            conn = sqlite3.connect("World-Voyage.db")
            cur = conn.cursor()
            cur.execute("SELECT username FROM users WHERE username=?", (username,))
            user = cur.fetchone()

            if user is not None:
                return apology("Username already exists", 400)

            hash = generate_password_hash(password)

            cur.execute("INSERT INTO users (username, hash) VALUES(?, ?)", (username, hash))
            conn.commit()
            cur.close()
            conn.close()
        except sqlite3.Error:
            return apology("Failed to register to the database.", 500)

        flash('You were successfully registered')
        return redirect("/")

    # GET メソッドの場合
    else:
        return render_template("register.html")
