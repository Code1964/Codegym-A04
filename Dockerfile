# docker hubから既にあるpythonを持ってくる
FROM python:3

# rootユーザーに指定
USER root

RUN apt-get update
RUN apt-get -y install locales && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TERM xterm

# flaskデフォルトの5000portは既に使われていたので8000に変更
ENV FLASK_RUN_PORT 8000

# flaskデバッグモードをオンにする
ENV FLASK_DEBUG 1

# タイムゾーンを指定
# apscheduler使う時のtzlocal.utils.ZoneInfoNotFoundError対策
# https://laid-back-scientist.com/docker-jp
ENV TZ Asia/Tokyo

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

# 必要なライブラリをインストール
COPY ./project/requirements.txt .
RUN pip install -r requirements.txt

RUN apt update

# apt-getが修正されたaptコマンドを使ってsqlite3をインストール
RUN apt install sqlite3

# tailwindのためのnpxのためのnpmインストール
# https://qiita.com/irico/items/0260e93d313b9ba5dc74
RUN apt install -y nodejs npm
# https://tailwindcss.com/docs/installation
# 下記は一度ファイルを作成されれれば大丈夫
# RUN npm install -D tailwindcss

# aliasを.bashrcに定義
RUN echo 'alias fr="flask run --host=0.0.0.0"' >> ~/.bashrc
RUN echo 'alias tw="npx tailwindcss -i ./static/css/input.css -o ./static/dist/css/output.css --watch"' >> ~/.bashrc
