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
        print("====================================")
        print(user_id)
        print(region)
        print(section)
        print(title)
        print(detail)
        print("====================================")

        # TODO: insertでDBに登録
        # sqlite3の例
        # ==== query ====================
        # conn = sqlite3.connect("globe.db")
        # cur = conn.cursor()
        # cur.execute("INSERT INTO flashcards (username, hash) VALUES(?, ?)", (username, hash))
        # conn.commit()
        # cur.close()
        # conn.close()
        # ===============================

    # TODO: selectでDBから取得
    # sqlite3の例
    # ==== query ====================
    # conn = sqlite3.connect("globe.db")
    # cur = conn.cursor()
    # 引数は単体の場合でもタプルにすることに注意
    # user = cur.execute("SELECT username FROM flashcards WHERE username=?", (username,)).fetchone()
    # cur.close()
    # conn.close()
    # ===============================

    return render_template("flashcard.html")
    # return render_template("flashcard.html", flashcards=flashcards)
