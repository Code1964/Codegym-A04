from flask import Flask, flash, redirect, render_template, request, session, url_for
import sqlite3

from helpers import apology

# CREATE TABLE favorite (user_id INT NOT NULL, region TEXT NOT NULL, placeID TEXT UNIQUE);

def favorite():
    region = request.args.get("region_name")
    placeID = request.args.get('placeID') # ない場合もある, UNIQUEに設定してある
    if not region:
        return apology("must provide region name", 400)
    # ==== query ====================
    try:
        conn = sqlite3.connect("globe.db")
        cur = conn.cursor()
        if not placeID:
            cur.execute("INSERT INTO favorite (user_id, region, placeID) VALUES(?, ?, ?)", (session["user_id"], region, 'null'))
        else:
            cur.execute("INSERT INTO favorite (user_id, region, placeID) VALUES(?, ?, ?)", (session["user_id"], region, placeID))
        conn.commit()
        cur.close()
        conn.close()
    except:
        return apology("Database operation failed", 400)
    # ================================

    if not placeID:
        flash("placeID not found")
        return redirect(url_for('index'))
    return redirect(url_for('map'))
