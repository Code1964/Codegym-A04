let cards = document.querySelectorAll(".flip-card");
cards.forEach(function(card) {
  card.addEventListener("click", function() {
    // 現在のカードの表裏状態を取得
    let isFlipped = this.classList.contains("flipped");

    // 表裏状態を切り替える
    if (isFlipped) {
      this.classList.remove("flipped");
    } else {
      this.classList.add("flipped");
    }
  });
});

