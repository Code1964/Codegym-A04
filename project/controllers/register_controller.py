from flask import Flask, flash, redirect, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3

# データベースに接続
conn = sqlite3.connect('globe.db')

# カーソルを取得
cur = conn.cursor()

# usersテーブルを作成するクエリを実行
cur.execute('''CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, hash TEXT)''')

# データベースに変更を反映
conn.commit()

# データベースを閉じる
conn.close()


def register():
    """Register user"""
    
    if request.method == "POST":       
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return render_template("Must Give Username")

        if not password:
            return render_template("Must Give Password")

        if not confirmation:
            return render_template("Must Give Confirmation")

        if password != confirmation:
            return render_template("Passwords Do Not Match")

        hash = generate_password_hash(password)

        try:
            # INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...)
            # new_user = db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, hash)
            pass
        except:
            return render_template("Username already exists")

        # session["user_id"] = new_user
        flash("ユーザー登録完了")
        return redirect("/")
        
    # getメソッドのとき
    else:
        return render_template("register.html")
        
