from flask import Flask, flash, redirect, render_template, request, session, url_for
import wikipedia
import json
import requests
# リダイレクト元：map.html
# 地域名をgetで取得

def summary():
    region_name = request.args.get('region')

    if not region_name:
        flash("regionを入力しよう")
        return redirect(url_for('map'))

    # キーワードで検索
    else:
        wikipedia.set_lang("ja")
        search_response = wikipedia.search(region_name)

    #検索結果を表示
    # print('キーワード:'+ str(region_name) + 'での検索結果は' + str(len(search_response)) + '件です。')
    # print(search_response)
    #検索結果のページ内容を表示
    page_data = wikipedia.page(search_response[0])
    # print(page_data.content) # コンテンツ全て
    # print(page_data.title) # タイトル
    # print(page_data.summary) # 要約
    # print(page_data.html()) # html
    # print(page_data.images) #全写真url
    url="https://pixabay.com/api"

    params={
        "key":"34132799-a99680c2889f5f7f494030834",
        "q":region_name + "国旗",
        "lang":"ja",
        "image_type":"photo"
    }

    result = requests.get(url, params=params)

    data = json.loads(result.text)
    if data["totalHits"] > 0:
        image_url = data["hits"][0]["webformatURL"]

    return render_template("summary.html", wiki_summary=page_data.summary, region_image=image_url)