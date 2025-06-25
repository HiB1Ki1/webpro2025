// Node.jsの標準ライブラリである 'node:http' と 'node:url' をインポートするぞ
// 'node:' プレフィックスを使うのが、新しいNode.jsの書き方じゃな
import * as http from "node:http";
import { URL } from "node:url"; // URLオブジェクトはグローバルでも使えるが、明示的にインポートするのも良いぞ

// サーバーが待ち受けるポート番号を定義するんじゃ
// 環境変数 (process.env.PORT) が設定されていればそれを使うが、
// もし設定がなければ、デフォルトで '8888' を使うようにしておるぞ
const PORT = process.env.PORT || 8888;

// HTTPサーバーを作成するのじゃ
// リクエスト（ブラウザからの要求）とレスポンス（サーバーからの応答）を処理する関数を渡すんじゃ
const server = http.createServer((req, res) => {
  // リクエストのURLを解析するためにURLオブジェクトを使うのじゃ
  // 第2引数にtrueを渡すと、クエリ文字列も自動で解析してくれるぞ
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  // レスポンスのヘッダーを設定するのじゃ
  // まずはContent-Typeを 'text/plain; charset=utf-8' に設定して、
  // 文字コードがUTF-8であることをブラウザに教えてやるんじゃ
  // writeHead は一度しか呼べないので、setHeader で少しずつ設定していくのがコツじゃな
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // リクエストのパス（URLのどこにアクセスしたか）によって処理を分けるぞ
  if (requestUrl.pathname === "/") {
    // ルートパス ('/') にアクセスされた場合の処理じゃ
    console.log("ルートパスがリクエストされたぞ！"); // どこが実行されたか分かりやすくするためにログを出すんじゃ
    res.writeHead(200); // ステータスコード200 (OK) を返すぞ
    res.end("こんにちは！"); // "こんにちは！" というメッセージをブラウザに送るんじゃ
  } else if (requestUrl.pathname === "/ask") {
    // '/ask' パスにアクセスされた場合の処理じゃ
    console.log("/ask パスがリクエストされたぞ！"); // ログを出すぞ

    // クエリパラメータ 'q' の値を取得するんじゃ
    const question = requestUrl.searchParams.get("q");

    if (question) {
      // 'q' パラメータがあれば、その内容を返すんじゃ
      console.log(`質問は '${question}' じゃな。`); // 質問内容をログに出すぞ
      res.writeHead(200); // ステータスコード200 (OK) を返すぞ
      res.end(`Your question is '${question}'`); // 質問内容をブラウザに送るんじゃ
    } else {
      // 'q' パラメータがなければ、エラーメッセージを返すぞ
      console.log("質問が指定されておらんぞ…"); // ログを出すぞ
      res.writeHead(400); // ステータスコード400 (Bad Request) を返すぞ
      res.end("質問が指定されていません。例: /ask?q=my+question");
    }
  } else {
    // それ以外のパスにアクセスされた場合の処理じゃ
    console.log(`未知のパスがリクエストされたぞ: ${requestUrl.pathname}`); // ログを出すぞ
    res.writeHead(404); // ステータスコード404 (Not Found) を返すぞ
    res.end("見つからんのう…。"); // 見つからない旨をブラウザに送るんじゃ
  }
});

// サーバーを指定されたポートで起動するんじゃ
server.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で動き出したぞ！`); // サーバーが起動したことをログで知らせるんじゃ
  console.log("止めるには Ctrl+C を押すとよいぞ。");
});
