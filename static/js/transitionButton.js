// ボタン1がクリックされた場合の処理
document.getElementById("button1").addEventListener("click", function() {
    // ボタン1を非表示にする
    document.getElementById("button1").style.display = "none";
    // 新しい選択肢を表示する
    var newButton = document.createElement("button");
    newButton.innerText = "新しい選択肢";
    newButton.className = "btn btn-primary";
    newButton.addEventListener("click", function() {
      // 新しい選択肢がクリックされた場合も、同じ処理を実行する
      document.getElementById("button2").style.display = "none";
      // ここに新しい選択肢がクリックされた場合の処理を追加する
    });
    document.body.appendChild(newButton);
  });
  
  // ボタン2がクリックされた場合の処理
  document.getElementById("button2").addEventListener("click", function() {
    // ボタン2を非表示にする
    document.getElementById("button2").style.display = "none";
    // 新しい選択肢を表示する
    var newButton = document.createElement("button");
    newButton.innerText = "新しい選択肢";
    newButton.className = "btn btn-primary";
    newButton.addEventListener("click", function() {
      // 新しい選択肢がクリックされた場合も、同じ処理を実行する
      document.getElementById("button1").style.display = "none";
      // ここに新しい選択肢がクリックされた場合の処理を追加する
    });
    document.body.appendChild(newButton);
  });