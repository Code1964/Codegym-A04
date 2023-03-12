import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import apology, login_required

def change_password():
    """Change user's password"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # 古いパスワードが送信
        if not request.form.get("old_password"):
            return apology("must provide old password", 403)

        # 新しいパスワードが送信
        elif not request.form.get("new_password"):
            return apology("must provide new password", 403)

        # 確認パスワードが送信
        elif not request.form.get("confirmation"):
            return apology("must confirm new password", 403)

        # 新しいパスワードとその確認が一致しない場合
        elif request.form.get("new_password") != request.form.get("confirmation"):
            return apology("new password and confirmation must match", 403)

        # ユーザーのデータベースを照会
        conn = sqlite3.connect("globe.db")
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],))
        user = cur.fetchone()

        # 古いパスワードが正しいか確認する
        if not check_password_hash(user[2], request.form.get("old_password")):
            return apology("invalid old password", 403)

        # パスワードをデータベースにアップロード
        new_hashed_password = generate_password_hash(request.form.get("new_password"))
        cur.execute("UPDATE users SET hash = ? WHERE id = ?", (new_hashed_password, session["user_id"]))
        conn.commit()
        conn.close()

        # ユーザーIDを忘れたら
        session.clear()

        flash('You were successfully change password!')
        # ホームページにリダイレクト
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("change_password.html")
