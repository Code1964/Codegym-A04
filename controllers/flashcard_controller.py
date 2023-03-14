import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
import sqlite3

def flashcard():
    # conn = sqlite3.connect("globe.db")
    # c = conn.cursor()
    # # c.execute("INSERT INTO flashcards (region_name, title, detail) VALUES(?, ?, ?)")
    # flashcards = c.execute("SELECT * FROM flashcards")
    # return render_template("flashcard.html", flashcards=flashcards)

    return render_template("flashcard.html")
