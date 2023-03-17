import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
import sqlite3

def flashcard():
    # conn = sqlite3.connect("globe.db")
    # c = conn.cursor()
    # # c.execute("INSERT INTO flashcards (region_name, title, detail) VALUES(?, ?, ?)")
    # flashcards = c.execute("SELECT * FROM flashcards")
    # return render_template("flashcard.html", flashcards=flashcards)

# CREATE TABLE flashcards (user_id INT NOT NULL, region TEXT NOT NULL, section TEXT NOT NULL, title TEXT NOT NULL, detail TEXT NOT NULL);

    if request.method == "POST":
        user_id = session["user_id"]
        region = request.form.get("region_name")
        section = request.form.get("section")
        title = request.form.get("title")
        detail = request.form.get("detail")
        # image = request.form.get("image")
        print("====================================")
        print(user_id)
        print(region)
        print(section)
        print(title)
        print(detail)
        print("====================================")

        # insertでDBに登録
        # ==== query ====================
        conn = sqlite3.connect("globe.db")
        cur = conn.cursor()
        cur.execute("INSERT INTO flashcards (user_id, region, section, title, detail) VALUES(?, ?, ?, ?, ?)", (user_id, region, section, title, detail))
        conn.commit()
        cur.close()
        conn.close()
        # ===============================

    # selectでDBから取得
    # ==== query ====================
    conn = sqlite3.connect("globe.db")
    cur = conn.cursor()
    # 引数は単体の場合でもタプルにすることに注意
    flashcards = cur.execute("SELECT * FROM flashcards WHERE user_id=?", (session["user_id"],)).fetchall()
    cur.close()
    conn.close()
    # ===============================

    return render_template("flashcard.html", flashcards=flashcards)
