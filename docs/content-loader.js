document.addEventListener("DOMContentLoaded", function () {
  fetch("main-content.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
      // ここで初期化処理を呼び出す
      if (typeof initSortApp === "function") {
        initSortApp();
      }
    })
    .catch((err) => {
      console.error("コンテンツ読み込みエラー:", err);
    });
});
