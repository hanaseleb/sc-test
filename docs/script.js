// グローバル変数の定義
let data = []; // ソート対象の配列
let animations = []; // アニメーション用の各ステップを格納
let animationSpeed = 300; // アニメーションの間隔（ミリ秒）
const arraySize = 10; // バーは10本
let animationInterval = null; // setInterval のハンドル

// 各種処理は以前と同様の実装をそのまま利用
// ・・・（ここに resetArray, renderArray, updateBar, highlightBars, removeHighlight,
//       processAnimationStep, playAnimations, resetControls, setDescription などの関数を配置）・・・

function resetArray() {
  data = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
  renderArray();
}

function renderArray() {
  const arrayContainer = document.getElementById("array-container");
  arrayContainer.innerHTML = "";
  data.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "array-bar";
    bar.style.height = `${value}%`;
    bar.style.width = `${100 / arraySize}%`;
    arrayContainer.appendChild(bar);
  });
}

/* 各ソートアルゴリズムの実装もそのまま */
// ① バブルソート、② 選択ソート、③ 挿入ソート、④ マージソート、⑤ クイックソート、⑥ ヒープソート
// （以前提供したコードと同じ内容を配置してください）

function playAnimations() {
  if (animations.length === 0) return;
  let i = 0;
  animationInterval = setInterval(() => {
    if (i >= animations.length) {
      clearInterval(animationInterval);
      resetControls(true);
      return;
    }
    processAnimationStep(animations[i]);
    i++;
  }, animationSpeed);
}

/* --- 以下、初期化関数 initSortApp の定義 --- */
function initSortApp() {
  // 初期化：読み込んだメインコンテンツ内の要素に対してイベントリスナーを登録する
  document.getElementById("start-btn").addEventListener("click", function () {
    const algo = document.getElementById("algorithm-select").value;
    resetControls(false);
    animations = []; // アニメーションステップをリセット
    if (algo === "bubble") {
      bubbleSort();
      setDescription(
        "バブルソート: 各隣接要素間の比較および必要に応じた交換操作を繰り返し、局所的に最大（または最小）の要素を末尾へ移動させる安定ソートです。最適ケースは O(n) ですが、一般的には O(n²) の計算量となります。"
      );
      playAnimations();
    } else if (algo === "selection") {
      selectionSort();
      setDescription(
        "選択ソート: 未整列部分から最小（または最大）の要素を逐次選択し、先頭要素と交換する手法です。比較回数は O(n²) ですが、交換回数は最大 n − 1 回であるため、書き換えコストが高い環境では有利な場合があります。"
      );
      playAnimations();
    } else if (algo === "insertion") {
      insertionSort();
      setDescription(
        "挿入ソート: 整列済み部分に対して、未整列要素を適切な位置に挿入する安定ソートです。ほぼ整列済みの入力では O(n) となり、小規模なデータセットに適しています。"
      );
      playAnimations();
    } else if (algo === "merge") {
      mergeSort();
      setDescription(
        "マージソート: 分割統治法に基づき、配列を再帰的に分割してから各部分を統合する安定ソートです。常に O(n log n) の計算量を保証しますが、統合時に追加メモリが必要となります。"
      );
      playAnimations();
    } else if (algo === "quick") {
      quickSort();
      setDescription(
        "クイックソート: ピボットを基準に配列を部分分割し、再帰的にソートを実施する手法です。平均 O(n log n) ですが、最悪ケースは O(n²) となるため、ピボット選択の戦略が重要です。"
      );
      playAnimations();
    } else if (algo === "heap") {
      heapSort();
      setDescription(
        "ヒープソート: ヒープ（優先度付きキュー）を構築し、根（最大または最小）を順次取り出す手法です。常に O(n log n) の計算量を維持し、追加メモリをほとんど必要としません。"
      );
      playAnimations();
    } else {
      alert("選択されたアルゴリズムのビジュアル化は未実装です。");
      resetControls(true);
    }
  });

  // 「停止」ボタンのイベント登録：実行中のアニメーションを停止
  document.getElementById("stop-btn").addEventListener("click", function () {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
      resetControls(true);
    }
  });

  // 「リセット」ボタンのイベント登録
  document.getElementById("reset-btn").addEventListener("click", function () {
    resetArray();
  });

  // 初期状態の設定
  resetArray();
  renderArray(); // ここを追加
  setDescription("アルゴリズムを選択して、開始ボタンを押してください。");
}
