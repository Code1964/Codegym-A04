from flask import Flask, flash, redirect, render_template, request, session
import wikipedia
import wikipediaapi
from helpers import apology

def timeline():
    region_name = request.args.get('region')

    if not region_name:
        flash("regionを入力しよう")
        return redirect(url_for('map'))

    wiki = wikipediaapi.Wikipedia("ja")
    page = wiki.page(region_name)
    if not page.exists():
        return apology("Not in countries where data acquisition is possible", 501)


    sections = page.sections
    # print(sections[1])  # section1つ目出力, 基本的に概要

    title = []
    detail = []
    for section in sections:
        if section.title == '歴史':
            for i in range(len(section.sections)):
                text = str(section.sections[i]).split()
                # print(text[1]) # 常に[1]がタイトル、本文の位置も決まってる
                title.append(text[1])
                # print("".join(text[3:len(text)-2]))
                detail.append("".join(text[3:len(text)-2]))
            break

    print(title[0])
    print(detail[0])
    historys = dict(zip(title, detail))

    return render_template("timeline.html", historys=historys)