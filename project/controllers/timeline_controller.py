from flask import Flask, flash, redirect, render_template, request, session
import wikipedia
import wikipediaapi
import re

def timeline():
    # wikipedia.set_lang("ja")
    # print(wikipedia.search('データ分析')) データ分析の検索結果マッチしたpagetitle一覧

    # pageメソッドを用いてタイトルや中身を見れる
    # wp = wikipedia.page("東京都")
    # print(wp.title) タイトル
    # print(wp.summary) ##サマリー
    # →print(wikipedia.summary("データ解析"))でも可
    # page=wp.content コンテンツすべて
    # print(wp.html()) HTML取得
    # print(wp.url) page url取得
    # print(wp.links) page内にリンクされた単語一覧
    # print(wp.images[0]) ##page内の画像1つ目取得
    # print(wp.sections)

    # wiki = wikipediaapi.Wikipedia("ja")

    # page = wiki.page("アメリカ")
    # title = []
    # if page.exists():
    #     sections=page.sections
    #     # print(sections[0]) section1つ目出力
    #     for section in sections:
    #         if section.title == '歴史':
    #             # if section.sections:
    #             # print(type(str(section.sections[0])))
    #             # print(str(section.sections[0]))
    #             # str_var=str(section.sections[0])
    #             for i in range(len(section.sections)):
    #                 text = str(section.sections[i]).split()
    #                 # print(text[1])
    #                 title.append(text[1])
    #                 print("".join(text[3:len(text)-2]))
    #                 print("\n")

    #             break
    #     # print(title)
    # # 常に[1]がタイトル、本文の位置も決まってる
    #     # text=str_var.split()
    #     # print(text[1])
    #     # print("".join(text[3:len(text)-2]))

    # else:
    #     print("ページ存在しない")
    return render_template("timeline.html")