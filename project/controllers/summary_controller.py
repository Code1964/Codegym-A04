from flask import Flask, flash, redirect, render_template, request, session
import wikipedia

# リダイレクト元：map.html
# 地域名をgetで取得

def summary():
    region_name = request.args.get('region')

    # キーワードで検索
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

    return render_template("summary.html", wiki_summary=page_data.summary)