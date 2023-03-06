import os
from flask import Flask, flash, redirect, render_template, request, session
import pandas as pd


def map():
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    df = pd.read_csv("asti-datr0411wc/r0411world_utf8.csv", sep='\t') # data frameを読み込む
    # print(df) # data frameを閲覧
    # print(len(df)) # 198カ国
    # print(df[df.country_code == 'GB']) # イギリス(GB)のname_jp長すぎ -> 略称(name_jps)の方がいい
    # print(df['name_jps']) # 国の一覧

    data = df[['name_jps', 'lat', 'lon']].values # このデータを使ってください
    # print(data)

    # 一個ずつ確認したい場合↓
    # for row in data:
    #     print(row) # 3つとも表示
        # print(row[0]) # 国名
        # print(row[0]) # 緯度
        # print(row[0]) # 経度

    return render_template("map.html", google_maps_api_key=google_maps_api_key)