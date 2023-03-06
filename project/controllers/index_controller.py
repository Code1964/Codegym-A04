from flask import Flask, flash, redirect, render_template, request, session
import pandas as pd

def index():

    df = pd.read_csv("asti-datr0411wc/r0411world_utf8.csv", sep='\t') # data frameを読み込む
    nations = df['name_jps'].values
    # print(nations) # 国の一覧, これをindex.htmlに渡す

    return render_template("index.html")
