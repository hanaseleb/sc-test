/* script.js */

// グローバル変数の定義
let data = [];           // ソート対象の配列
let animations = [];     // アニメーション用の各ステップを格納
let animationSpeed = 300; // アニメーションの間隔（ミリ秒）
const arraySize = 50;    // 配列の要素数

/* 配列（バー）の初期生成 */
function resetArray() {
  data = [];
  for (let i = 0; i < arraySize; i++) {
    // 5～300のランダムな整数を生成
    data.push(Math.floor(Math.random() * 300) + 5);
  }
  renderArray();
}

/* 配列をDOM上にバーとして描画 */
function renderArray() {
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.id = "bar-" + i;
    bar.style.height = data[i] + "px";
    container.appendChild(bar);
  }
}

/* 指定インデックスのバーだけ更新 */
function updateBar(index) {
  const bar = document.getElementById("bar-" + index);
  if (bar) {
    bar.style.height = data[index] + "px";
  }
}

/* バーにハイライトを付ける（色指定） */
function highlightBars(indices, color) {
  indices.forEach(i => {
    const bar = document.getElementById("bar-" + i);
    if (bar) {
      bar.style.backgroundColor = color;
    }
  });
}

/* ハイライト解除 */
function removeHighlight(indices) {
  indices.forEach(i => {
    const bar = document.getElementById("bar-" + i);
    if (bar) {
      bar.style.backgroundColor = "";
    }
  });
}

/* アニメーションの各ステップを処理 */
function processAnimationStep(step) {
  if (step.type === "compare") {
    // 比較時は赤色でハイライト
    highlightBars(step.indices, "red");
    setTimeout(() => {
      removeHighlight(step.indices);
    }, animationSpeed / 2);
  } else if (step.type === "swap") {
    // 交換処理：配列内の値を入れ替え、表示も更新
    const [i, j] = step.indices;
    let temp = data[i];
    data[i] = data[j];
    data[j] = temp;
    updateBar(i);
    updateBar(j);
    highlightBars(step.indices, "green");
    setTimeout(() => {
      removeHighlight(step.indices);
    }, animationSpeed / 2);
  } else if (step.type === "overwrite") {
    // 上書き処理
    data[step.index] = step.value;
    updateBar(step.index);
    highlightBars([step.index], "blue");
    setTimeout(() => {
      removeHighlight([step.index]);
    }, animationSpeed / 2);
  }
}

/* アニメーション再生：各ステップを順次処理 */
function playAnimations() {
  if (animations.length === 0) return;
  let i = 0;
  const interval = setInterval(() => {
    if (i >= animations.length) {
      clearInterval(interval);
      resetControls(true);
      return;
    }
    const step = animations[i];
    processAnimationStep(step);
    i++;
  }, animationSpeed);
}

/* コントロールの有効／無効を切り替え */
function resetControls(enable) {
  document.getElementById("start-btn").disabled = !enable;
  document.getElementById("reset-btn").disabled = !enable;
  document.getElementById("algorithm-select").disabled = !enable;
}

/* アルゴリズムごとの説明文を表示 */
function setDescription(text) {
  document.getElementById("algo-description").innerText = text;
}

/* =========================================
   各ソートアルゴリズムのアニメーション生成
   ※ 各処理中、比較・交換・上書きのステップを animations 配列に記録
========================================= */

// ① バブルソート：隣接要素を比較・交換
function bubbleSort() {
  let arr = data.slice();
  animations = [];
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push({ type: "compare", indices: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        animations.push({ type: "swap", indices: [j, j + 1] });
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

// ② 選択ソート：未整列部分から最小値を探して交換
function selectionSort() {
  let arr = data.slice();
  animations = [];
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      animations.push({ type: "compare", indices: [minIndex, j] });
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      animations.push({ type: "swap", indices: [i, minIndex] });
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
}

// ③ 挿入ソート：整列済み部分に要素を挿入
function insertionSort() {
  let arr = data.slice();
  animations = [];
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      animations.push({ type: "compare", indices: [j, j + 1] });
      if (arr[j] > key) {
        animations.push({ type: "overwrite", index: j + 1, value: arr[j] });
        arr[j + 1] = arr[j];
        j--;
      } else {
        break;
      }
    }
    animations.push({ type: "overwrite", index: j + 1, value: key });
    arr[j + 1] = key;
  }
}

// ④ マージソート：分割統治法で部分配列を整列し統合
function mergeSort() {
  let arr = data.slice();
  animations = [];
  mergeSortRec(arr, 0, arr.length - 1);
}
function mergeSortRec(arr, left, right) {
  if (left >= right) return;
  let mid = Math.floor((left + right) / 2);
  mergeSortRec(arr, left, mid);
  mergeSortRec(arr, mid + 1, right);
  merge(arr, left, mid, right);
}
function merge(arr, left, mid, right) {
  let leftPart = arr.slice(left, mid + 1);
  let rightPart = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < leftPart.length && j < rightPart.length) {
    animations.push({ type: "compare", indices: [left + i, mid + 1 + j] });
    if (leftPart[i] <= rightPart[j]) {
      animations.push({ type: "overwrite", index: k, value: leftPart[i] });
      arr[k] = leftPart[i];
      i++;
    } else {
      animations.push({ type: "overwrite", index: k, value: rightPart[j] });
      arr[k] = rightPart[j];
      j++;
    }
    k++;
  }
  while (i < leftPart.length) {
    animations.push({ type: "overwrite", index: k, value: leftPart[i] });
    arr[k] = leftPart[i];
    i++; k++;
  }
  while (j < rightPart.length) {
    animations.push({ type: "overwrite", index: k, value: rightPart[j] });
    arr[k] = rightPart[j];
    j++; k++;
  }
}

// ⑤ クイックソート：ピボットを用いた分割統治法
function quickSort() {
  let arr = data.slice();
  animations = [];
  quickSortRec(arr, 0, arr.length - 1);
}
function quickSortRec(arr, low, high) {
  if (low < high) {
    let pivotIndex = partition(arr, low, high);
    quickSortRec(arr, low, pivotIndex - 1);
    quickSortRec(arr, pivotIndex + 1, high);
  }
}
function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    animations.push({ type: "compare", indices: [j, high] });
    if (arr[j] < pivot) {
      animations.push({ type: "swap", indices: [i, j] });
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      i++;
    }
  }
  animations.push({ type: "swap", indices: [i, high] });
  let temp = arr[i];
  arr[i] = arr[high];
  arr[high] = temp;
  return i;
}

// ⑥ ヒープソート：ヒープ構造を利用して整列
function heapSort() {
  let arr = data.slice();
  animations = [];
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    animations.push({ type: "swap", indices: [0, i] });
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    heapify(arr, i, 0);
  }
}
function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n) {
    animations.push({ type: "compare", indices: [l, largest] });
    if (arr[l] > arr[largest]) {
      largest = l;
    }
  }
  if (r < n) {
    animations.push({ type: "compare", indices: [r, largest] });
    if (arr[r] > arr[largest]) {
      largest = r;
    }
  }
  if (largest !== i) {
    animations.push({ type: "swap", indices: [i, largest] });
    let temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    heapify(arr, n, largest);
  }
}

/* ===========================
   イベントリスナー設定
=========================== */

// 「開始」ボタン
document.getElementById("start-btn").addEventListener("click", function() {
  const algo = document.getElementById("algorithm-select").value;
  resetControls(false);
  if (algo === "bubble") {
    bubbleSort();
    setDescription("バブルソートは、隣接する要素を比較しながら順次交換して整列するシンプルな手法です。");
    playAnimations();
  } else if (algo === "selection") {
    selectionSort();
    setDescription("選択ソートは、未整列部分から最小値を探し出し、先頭の要素と交換して整列します。");
    playAnimations();
  } else if (algo === "insertion") {
    insertionSort();
    setDescription("挿入ソートは、すでに整列された部分に対して、適切な位置に要素を挿入する手法です。");
    playAnimations();
  } else if (algo === "merge") {
    mergeSort();
    setDescription("マージソートは、分割統治法により配列を分割し、整列後に統合する安定なソートです。");
    playAnimations();
  } else if (algo === "quick") {
    quickSort();
    setDescription("クイックソートは、ピボットを用いて配列を分割し、再帰的に整列する高速な手法です。");
    playAnimations();
  } else if (algo === "heap") {
    heapSort();
    setDescription("ヒープソートは、ヒープ構造を利用して最大値を順次取り出し整列する手法です。");
    playAnimations();
  } else {
    alert("選択されたアルゴリズムのビジュアル化は未実装です。");
    resetControls(true);
  }
});

// 「リセット」ボタン
document.getElementById("reset-btn").addEventListener("click", function() {
  resetArray();
});

// 初期化：ページ読み込み時に配列を生成
window.onload = function() {
  resetArray();
  setDescription("アルゴリズムを選択して、開始ボタンを押してください。");
};

// サイドバーメニュー：現在はソートアルゴリズムのみ（将来的に他の項目を追加可能）
document.getElementById("menu-sort").addEventListener("click", function(e) {
  e.preventDefault();
  // ここでメニュー選択時のコンテンツ切替処理を実装可能
});
