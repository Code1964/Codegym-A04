# Codegym-A04
AA093・AA095・AA097・AA105のチームメンバーで開発しています。

mainブランチではなく作業ブランチでコード編集を行うよう気をつけること

## GitHubの大まかなワークフロー

1. issueを立てる
2. ブランチの作成
3. コードを作成or修正
4. プルリクエストを投げる(その前に必ずpullして最新のmainを反映する)
5. レビューしてもらう
6. mainにマージ
7. ブランチの削除

## 細かいコマンドなど

1. 現在のbranchを確認`git branch`
2. もし作業ブランチにいる場合はmainに移動し`git switch main`，mainブランチ**を最新状態に更新**`git pull`
3. 作業ブランチがなければ，作成し移動`git switch -c <作成したいブランチ名>`
4. 作業ブランチで必ずコードの編集を行う．
addとcommitの流れを繰り返す(`git status`で必ず確認)`git add .` && `git commit -m 'コメント'`
5. **pushする前にここでまた最新のmainを取り込みまた作業ブランチに戻る**`git switch main` &&`git pull`&&`git switch <作業ブランチ>`
6. リモートリポジトリからmainに変更があれば作業ブランチにmergeする`git merge main`
7. githubにあげる`git push origin <作業ブランチ名 or HEAD>`
8. (githubに移動)githubのサイト上で「Compare & pull request」を押す。色々設定(issueと紐付け)して右下の緑ボタンCreate pull requestを押すとプルリクエストができる。
9. レビュワーはFiles changedを押し，Review changesを押してコメント書いてapproveする．その後githubにある左下のMerge pull requetを押してConfirm mergeを押すことでmainにブランチがマージされる。最後にDelete branchを押してブランチを削除する。
10. ターミナルのmainブランチに戻りpushした人はローカルのブランチも削除しておく`git branch -D <作業していたブランチ名>`

githubのcommitコメントの書き方
- 機能追加	add:

- 機能修正	update:

- バグ修正	fix:

- 削除	remove:

- 仕様の変更 change:

- 整理	clean:

### 変更の一時退避

変更などを一時退避したい場合は`git stash -u`

`git stash list`で一時退避したものをリスト形式で出力

復元したい場合は`git stash pop <stash番号(例:stash@{0})>`

`git stash clear`で一時退避したものを削除

最後にまた`git stash list`で削除できているか確認

# Usage

## Git Clone
```
$ git clone https://github.com/Code1964/Globe-learning.git
```

## docker使わないFlaskの実行方法

```
cd project
pip install -r requirements.txt
flask run
```

## Setting up a Docker environment

```
$ docker compose up -d --build
$ docker compose exec python3 bash
```

## Launching a web application
Go to the same directory as app.py file

```
/ cd project
/ flask run --host=0.0.0.0
```

## 終了方法

```
exit
docker ps     # 現状確認して
docker compose down
docker image ls # イメージを確認
docker image rm <image ID>
```

## TailwindCSSを更新するときに使用

```
npx tailwindcss -i ./static/css/input.css -o ./static/dist/css/output.css --watch
```
