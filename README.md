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
4. コードの編集を行う．
addとcommitの流れを繰り返す(`git status`で必ず確認)`git add .` && `git commit -m 'コメント'`
5. **pushする前にここでまた最新のmainを取り込みまた作業ブランチに戻る`git switch main` &&**`git pull`&&`git switch <作業ブランチ>`
6. mainに変更があれば作業ブランチにmergeする`git merge main`
7. githubにあげる`git push origin <作業ブランチ名 or HEAD>`
8. (githubに移動)githubのサイト上で「****Compare & pull request」****を押す。色々設定して右下の緑ボタンCreate pull requestを押すとプルリクエストができる。
9. レビュワーはFiles changedを押し，Review changesを押してコメント書いてapproveする．その後githubにある左下のMerge pull requetを押してConfirm mergeを押すことでmainにブランチがマージされる。最後にDelete branchを押してブランチを削除する。
10. pushした人はローカルのブランチも削除しておく`git branch -D <作業していたブランチ名>`

githubのcommitコメントの書き方
- 機能追加	add:

- 機能修正	update:

- バグ修正	fix:

- 削除	remove:

- 仕様の変更 change:

- 整理	clean:

# Usage

## Git Clone
```
$ git clone https://github.com/Code1964/Globe-learning.git
```
## Setting up a Docker environment

```
$ docker compose up -d --build
$ docker compose exec python3 bash
```

## Launching a web application
Go to the same directory as app.py file

```
$ cd app
$ flask run --host=0.0.0.0
```