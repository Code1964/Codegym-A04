import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
import sqlite3

def flashcard():
    if request.method == "POST":
        user_id = session["user_id"]
        region = request.form.get("region_name")
        section = request.form.get("section")
        title = request.form.get("title")
        detail = request.form.get("detail")

        # insertでDBに登録
        conn = sqlite3.connect("globe.db")
        cur = conn.cursor()
        cur.execute("INSERT INTO flashcards (user_id, region, section, title, detail) VALUES(?, ?, ?, ?, ?)", (user_id, region, section, title, detail))
        conn.commit()
        cur.close()
        conn.close()

    # selectでDBから取得
    conn = sqlite3.connect("globe.db")
    cur = conn.cursor()
    flashcards = cur.execute("SELECT * FROM flashcards WHERE user_id=?", (session["user_id"],)).fetchall()
    cur.close()
    conn.close()

    return render_template("flashcard.html", flashcards=flashcards)
