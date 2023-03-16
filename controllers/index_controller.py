from flask import Flask, flash, redirect, render_template, request, session
import pandas as pd

def index():
    # 国情報を読み込む
    df = pd.read_csv("asti-datr0411wc/r0411world_utf8.csv", sep='\t')
    nations = df['name_jps'].values
    return render_template("index.html",nations=nations)
