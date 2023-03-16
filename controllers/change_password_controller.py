import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import apology, login_required

def change_password():
    """Change user's password"""

    # POST メソッドでアクセスされた場合
    if request.method == "POST":
        old_password = request.form.get("old_password")
        new_password = request.form.get("new_password")
        confirmation = request.form.get("confirmation")

        # フォームが正しく送信されなかった場合
        if not old_password or not new_password or not confirmation:
            return apology("All fields must be filled", 403)

        # 新しいパスワードとその確認が一致しない場合
        if new_password != confirmation:
            return apology("new password and confirmation must match", 403)

        # ユーザーのデータベースを照会
        conn = sqlite3.connect("globe.db")
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],))
        user = cur.fetchone()

        # 古いパスワードが正しいか確認する
        if not check_password_hash(user[2], old_password):
            return apology("invalid old password", 403)

        # パスワードをデータベースにアップロード
        new_hashed_password = generate_password_hash(new_password)
        cur.execute("UPDATE users SET hash = ? WHERE id = ?", (new_hashed_password, session["user_id"]))
        conn.commit()
        cur.close()
        conn.close()

        # ユーザーIDを忘れたら
        session.clear()

        flash('You have successfully changed your password!')
        # ホームページにリダイレクト
        return redirect("/")

    # GET メソッドでアクセスされた場合
    else:
        return render_template("change_password.html")
