from flask import Flask, flash, redirect, render_template, request, session
import wikipedia

# リダイレクト元：map.html
# 地域名をgetで取得

def summary():
    region_name = request.args.get('region')

    # キーワードで検索
    wikipedia.set_lang("ja")
    search_response = wikipedia.search(region_name)
    #検索結果のページ内容を表示
    page_data = wikipedia.page(search_response[0])

    return render_template("summary.html", wiki_summary=page_data.summary)