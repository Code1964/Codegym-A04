import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
import pandas as pd
import sqlite3

from helpers import apology

def map():
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    # index.htmlからmap.htmlに送るための処理
    nation_name = request.args.get('nation')

    placeIDs = [] # htmlに渡す用の空リスト作成
    # ログインしていた場合
    if "user_id" in session:
        conn = sqlite3.connect("globe.db")
        cur = conn.cursor()
        cur.execute("SELECT placeID FROM favorite WHERE user_id = ?", (session["user_id"],))
        placeIDs = cur.fetchall()
        if placeIDs:
            placeIDs = [data[0] for data in placeIDs]
        cur.close()
        conn.close()

    if nation_name == '国名を選択してください' or not nation_name:
        return render_template("map.html", google_maps_api_key=google_maps_api_key, placeIDs=placeIDs)

    df = pd.read_csv("asti-datr0411wc/r0411world_utf8.csv", sep='\t') # data frameを読み込む

    # 例外処理
    nations = df['name_jps'].values
    if not nation_name in nations:
        return apology("bad argument", 400)

    # 緯度経度を入れる
    latlng_str = []
    # 緯度を取得
    latitudes = df[df.name_jps == nation_name]["lat"].values
    # 経度を取得
    longitudes = df[df.name_jps == nation_name]["lon"].values
    for lat, lon in zip(latitudes, longitudes):
        latlng_str.append({"lat": lat, "lng": lon})
    # 使える形式に修正
    locations = "{}, {}".format(latlng_str[0]['lat'], latlng_str[0]['lng'])

    # 国名を取得
    nation_name = df[df.name_jps == nation_name]["name_jps"].values[0]
    nation_name = nation_name.split("（")[0]

    #ここからjavascriptに変数送るのってどうやるの？
    return render_template("map.html", google_maps_api_key=google_maps_api_key, locations=locations, nation_name=nation_name, placeIDs=placeIDs)
