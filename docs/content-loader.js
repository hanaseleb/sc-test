document.addEventListener("DOMContentLoaded", function() {
    fetch("main-content.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("content").innerHTML = html;
      })
      .catch(err => {
        console.error("コンテンツ読み込みエラー:", err);
      });
  });
  