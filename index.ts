import express from "express";
// 生成した Prisma Client をインポート
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ["query"],
});

const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得する。環境変数に設定がなければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定
app.set("view engine", "ejs");
app.set("views", "./views"); // viewsフォルダの場所をExpressに教えてやるのじゃ

// form のデータを受け取れるように設定
// これがないと、HTMLフォームから送られてくるデータをサーバーで読み取ることができんのじゃ
app.use(express.urlencoded({ extended: true }));

// ルートハンドラーじゃ。ここが '/' にアクセスされたときに実行されるぞ。
// データベースからユーザー一覧を取得して、index.ejs に渡して表示するんじゃ
app.get("/", async (req, res) => {
  console.log("GET / がリクエストされたぞ！");
  const users = await prisma.user.findMany(); // データベースから全てのユーザーを取得
  console.log("ユーザー一覧を取得したぞ:", users);
  res.render("index", { users }); // index.ejs をレンダリングして、ユーザーデータを渡す
});

// ユーザー追加ハンドラーじゃ。ここが '/users' に POST リクエストが来たときに実行されるぞ。
// フォームから送られたユーザー名と年齢を受け取って、データベースに新しいユーザーを追加するんじゃ
app.post("/users", async (req, res) => {
  console.log("POST /users がリクエストされたぞ！");
  const name = req.body.name; // フォームから送信された名前を取得
  const age = Number(req.body.age); // フォームから送信された年齢を取得し、数値に変換するんじゃ

  // 年齢が数値であるかを確認するぞ
  if (isNaN(age)) {
    console.error("年齢は数値でなければなりません。");
    res.status(400).send("年齢は数値でなければなりません。");
    return; // エラーなのでここで処理を終了する
  }

  if (name) {
    // 名前が指定されていれば、新しいユーザーをデータベースに追加するんじゃ
    const newUser = await prisma.user.create({
      data: { name, age }, // 名前と年齢を保存
    });
    console.log("新しいユーザーを追加しました:", newUser);
  }
  res.redirect("/"); // ユーザー追加後、一覧ページにリダイレクトするんじゃ。これで画面が更新されるぞ。
});

// サーバーを起動するぞ！
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("止めるには Ctrl+C を押すとよいぞ。");
});
