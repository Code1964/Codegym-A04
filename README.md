# World Voyage ![ロゴ](/static/favicon.ico)
このプロダクトは、調べたい国や県がある場所の地図をクリックすることでそこの歴史・地理を調べられる、視覚的に楽しんで勉強できるサイトです。

CODEGYM Academyに所属するAA093・AA095・AA097・AA105のチームメンバーで開発しています。

### プロダクトURL: https://worldvoyage-vipot6c2la-an.a.run.app

# webアプリケーションの特徴
当アプリケーションには新規登録・ログイン・ログアウト機能、パスワード変更機能、国や地域の歴史を検索できる機能、単語帳機能、お気に入り登録機能などがあります。

検索機能はログインなしでもご利用いただけますが、単語帳の作成機能やお気に入り登録機能などは新規登録・ログインを行っていただく必要があります。

# webアプリケーションの使用方法
トップページで、行きたい国名を選択し、「冒険に出る」をクリックするとその場所にマップが移動します。
地図情報をクリックすることで、その国の名前が検索欄に表示されます。
「情報を見る」をクリックするとトップページで選択した国の情報が表示されます。

例えば、日本をクリックすると、「日本」という位置情報を取得し、「調べる」ボタンを押すとWikipediaAPIからその国の情報を取得して国の歴史や地理が表示されます。国だけでなく、県や市区町村でも同様です。

トップページ上部のMapを選択すると、自分の現在地にピンが表示されます。
地図をクリックすると、クリックされた場所が検索欄に入力され、「調べる」を押すとその場所の情報が閲覧できます。
国単位、県単位、市単位のボタンをクリックすることで、場所を絞り込めます。
地図上の市ボタンをクリックして場所のピンが表示された後、そのピンをクリックすると、「場所で検索中です」の検索欄に場所名が入力されます。
検索ボタンをクリックするとGoogle検索に飛んでいつものようにWebサイトなどを閲覧できます。

ログインしているユーザーはお気に入り登録機能を使うことができます。
トップページのMapをクリックして好きな場所を選択します。
その後、調べるを押して右上に表示される「お気に入り登録」をクリックしてください。
登録した場所は地図にピンが立てられます。左側に一覧表示され、そこをクリックすると「場所で検索中」の検索欄に場所名が入力されます。
検索ボタンをクリックするとGoogle検索に飛んでいつものようにWebサイトなどを閲覧できます。

ログインしているユーザーはノート機能も使うことができます。
国や地域の情報ページから自分の登録したいものを選びます。
トップページのNoteから登録したもの一覧を確認できます。
登録したものは右の三角ボタンで内容を確認できます。

# 使用技術

## 環境

Docker

## フロントエンド
HTML，CSS(TailWindCSS)，JavaScript

## バックエンド
Python (Flask，Pandas)，SQLite

## API
Google Maps API，Wikipedia API，Pixabay API

## デプロイ
Google Cloud Platform (Cloud Run)

# Requirement
- Flask
- Flask-Session
- requests
- wikipedia
- python-dotenv
- pandas
- wikipedia-api

##  Installation
```
$ pip install -r requirements.txt
```

# Usage
## Git Clone
```
$ git clone https://github.com/Code1964/World-Voyage.git
```

## Setting Google Maps API

```
$ touch .env
```

`.env`ファイルにGoogle Maps APIをセット

## Setting up a Docker environment

```
$ docker build -t world_voyage .
$ docker run -v $(pwd):/app -p 8080:8080 -it world_voyage bash
```

## Launching a web application

```
# python main.py
```

# 文責
藤井香凜(フジイカリン)

中島優人(ナカシマユウト)

# ライセンス
"World Voyage"はアマノ技研の所在地・位置座標データを使用しています。
