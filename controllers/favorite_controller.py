from flask import Flask, flash, redirect, render_template, request, session, url_for
import sqlite3

from helpers import apology

def favorite():
    region = request.args.get("region_name")
    placeID = request.args.get('placeID') # ない場合もある, UNIQUEに設定してある
    if not region:
        return apology("must provide region name", 400)

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
    except sqlite3.Error:
        return apology("Database operation failed", 400)

    if not placeID:
        flash("placeID not found")
        return redirect(url_for('index'))
    return redirect(url_for('map'))
