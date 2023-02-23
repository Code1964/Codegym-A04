# Codegym-A04
AA093・AA095・AA097・AA105のチームメンバーで開発しています。

## gitの流れ
1. 現在のbranchを確認`git branch -a`
2. master(main)に移動し**masterを最新に更新**`git switch master` && `git pull origin master` 
3. ブランチを作成&ブランチに移動`git switch -c <作成したいブランチ名>`
4. ファイルを作成・修正して細かくコミット`git add .` && `git commit -m 'コメント'`
5. **pushする前にここでまた最新のmasterを取り込む**`git pull origin master`
6. masterに変更があれば作業ブランチにmergeする`git merge master`
7. githubにあげる`git push origin <作業ブランチ名 or HEAD>`
8. githubのサイトで上のPull requestsから右のNew pull request,baseがmasterでcompareを作業ブランチ名に変更する。そしてCreate pull requestを押してから、タイトルとwirteで細かい作業内容を書く。そして右下のCreate pull requestを押すとプルリクエストができる。
9. 確認してもらったらgithubにある左下のMerge pull requetを押してConfirm mergeを押すことでmasterにブランチがマージされる。最後にDelete branchを押してブランチを削除する。
10. ローカルのブランチも削除しておく`git branch -d <作業していたブランチ名>`
11. 7でリモートを追跡するローカルの追跡ブランチ(origin/)を消し忘れた場合`git push --delete origin <ブランチ名>`
12. 7でgithub上で消した場合に追跡ブランチを全て消したい場合`git fetch -p`
13. それでも消せない場合`git branch -D <ブランチ名>`