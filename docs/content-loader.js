document.addEventListener("DOMContentLoaded", function () {
  fetch("main-content.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
      // main-content.html の読み込み完了後に初期化関数を呼び出す
      if (typeof initSortApp === "function") {
        initSortApp();
      }
    })
    .catch((err) => {
      console.error("コンテンツ読み込みエラー:", err);
    });
});
