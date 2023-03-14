import os
from flask import Flask, flash, redirect, render_template, request, session, url_for
import pandas as pd

from helpers import apology

def map():
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    # index.htmlからmap.htmlに送るための処理
    nation_name = request.args.get('nation')

    if nation_name == '国名を選択してください' or not nation_name:
        # flash("国を選択してください")
        # return redirect(url_for('index'))
        return render_template("map.html", google_maps_api_key=google_maps_api_key)

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

    #ここからjavascriptに変数送るのってどうやるの？
    return render_template("map.html", google_maps_api_key=google_maps_api_key, locations=locations)
