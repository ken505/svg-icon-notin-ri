"use strict";
{
  const question = document.getElementById("question");
  const choices = document.getElementById("choices");
  const btn = document.getElementById("btn");
  const result = document.getElementById("result");
  const scoreLabel = document.querySelector("#result > p");

  const quizSet = [
    { q: "A", c: ["A0", "A2", "A3"] },
    { q: "B", c: ["B0", "B2", "B3"] },
    { q: "C", c: ["C0", "C2", "C3"] },
  ];

  let currentNum = 0;
  // 何問目のクイズを解いているかを変数で保持。

  let isAnswered;
  // 一度回答した後に、同じ質問で再度回答できないように、回答したかどうかを isAnswered という変数で管理。

  let score = 0;
  // 最後の問題に答えたあとに、スコアが表示されるように、正答数を管理するための変数、scoreを宣言。

  function shuffle(arr) {
    // フィッシャーイェーツのシャッフルアルゴリズムを実装。
    // 範囲を狭めながら最後の要素とランダムに選んだ要素を入れ替えていく。

    for (let i = arr.length - 1; i > 0; i--) {
      // ランダムに選ぶ範囲の終点のインデックスを i という変数で宣言。
      // i が 0 より大きい間、 i を１ずつ減らしながら以下の処理を行う。

      const j = Math.floor(Math.random() * (i + 1));
      // ランダムに選ぶ要素のインデックスを定数 j とし、乱数を代入。
      // ランダムに選ぶ範囲の終点のインデックスが i なので、 0 から i 番目のランダムな整数値を生成する。

      [arr[j], arr[i]] = [arr[i], arr[j]];
      // 分割代入を使って i と j を入れ替える。
    }

    return arr;
  }

  // 正誤判定を行う関数。

  function checkAnswer(li) {
    // if (isAnswered === true) { === trueは省略可
    if (isAnswered) {
      return;
      // isAnswerdが既にtrueだったら以降の処理を行わない。
    }
    isAnswered = true;
    // 一度回答したことを変数で保持。

    if (li.textContent === quizSet[currentNum].c[0]) {
      // 正解は quizSet の currentNum 番目の c の最初の要素(0 番目)と一緒であることと定義。

      li.classList.add("correct");
      // 正解だったらliにcorrectクラスをつける。
      score++;
      // スコアに１点加点。
    } else {
      li.classList.add("wrong");
      // 不正解だったらliにwrongクラスをつける。
    }

    btn.classList.remove("disabled");
    // 次の質問に進むボタンのdisabledクラスを外す。
    // （押せる風の見た目にする）
  }

  // クイズをセットする関数。

  function setQuiz() {
    isAnswered = false;
    // 回答済みをfalseにする。

    // 問題文の埋め込み。

    question.textContent = quizSet[currentNum].q;
    // question Idのついたｐ要素のテキストに、quizSetのcurrentNum番目のqを代入。

    while (choices.firstChild) {
      choices.removeChild(choices.firstChild);
      // choices の最初の子要素がある限り choices の最初の子要素を消す。
      // setQuiz() で回答の選択肢を表示する前に、全ての選択肢を消さないと、次の設問に進んでも、答えた設問が残ってしまう。
      // while は () の中に単一のオブジェクトを入れる場合、それが false や null でない限り、ブロックの中の処理をくり返す。
      // choices.firstChild の値が null になるまでループが回って、結果的に choices の子要素が全て消える。
    }

    // 問題をシャッフルする関数。

    const shuffledChoices = shuffle([...quizSet[currentNum].c]);
    // shuffle() 関数を使って選択肢をシャッフルしてから表示。
    // shuffle() 関数に大元の選択肢、uizSet の配列の値のコピーを渡す。

    // コピーの渡し方
    // quizSet[currentNum].c をスプレット演算子を使って、[ ] の中で新しい配列を展開させる。
    // 元の選択肢の配列はそのままに、シャッフルされた配列が作られる。

    // そのまま配列を渡すと、値のコピーが関数に渡されるのではなく、参照が渡されるので、渡した引数を関数の中で書き換えてしまうと、引数にした大元の配列も書き換えられてしまう。
    // そうなると選択肢の最初の要素を正解にして正誤判定するので、正誤判定ができなくなる。

    shuffledChoices.forEach((choice) => {
      // forEach() でshuffledChoices を処理。
      // forEachを使って配列の全ての要素(ここではquizSetオブジェクトのcurrentNum番目の回答文であるc要素)に対して以下の処理をする。
      // forEachに引数(ここではchoice)を設定しておくと、配列の要素をその名前で一つづつ受け取ってこのブロックで使うことができる。
      // forEach() は、 for 文を使った処理と違って、要素数などを気にせずにすっきりと処理が書ける。

      const li = document.createElement("li");
      // HTMLのliの空要素を生成し、定数liに代入。

      li.textContent = choice;
      // li要素のテキストにchoiceを代入。

      // 正誤判定処理

      li.addEventListener("click", () => {
        checkAnswer(li);
      });

      choices.appendChild(li);
      // choices Idのついた ul要素にli要素を追加する。
    });

    if (currentNum === quizSet.length - 1) {
      btn.textContent = "Show Score";
      // もし currentNum が quizSet.length よりひとつ小さい値(最後の問題)だったらボタンのテキストを Show Score に変える。
    }
  }

  setQuiz();

  btn.addEventListener("click", () => {
    // btn Idのついた要素をクリックしたら以下の処理をする。

    if (btn.classList.contains("disabled")) {
      return;
      // もしdisabled クラスが付いていたら、以降の処理を行わない。
      // クイズに回答した状態でないと、次の設問に進めないようにする。
    }

    btn.classList.add("disabled");

    if (currentNum === quizSet.length - 1) {
      // 最後の問題だったら(currentNum が quizSet.length - 1 と等しかったら)以下の処理を行う。

      scoreLabel.textContent = `score: ${score} / ${quizSet.length}`;
      // scoreLabelのテキストにスコアを代入。

      result.classList.remove("hidden");
      // hiddenクラスのついたスコア表示のhiddenクラスを外し、スコアを表示させる。
    } else {
      currentNum++;
      setQuiz();
      // currentNumを１増やしてsetQuizを呼び出すことで、次の設問が呼び出される。
    }
  });
}
