// Node.jsの標準ライブラリである 'node:http' と 'node:url' は今回は使わないが、
// TypeScript環境ではインポートの書き方が変わる可能性があるため、注意が必要じゃな。
// 今回はPrismaのデータベース操作を試すためのコードじゃぞ。

// 生成した Prisma Client をインポートするぞ。
// ここで重要なのは、Prisma Clientのパスが './generated/prisma/client' であることじゃ。
// これはPrismaが自動生成するファイルの場所を指しておるぞ。
import { PrismaClient } from "./generated/prisma/client";

// PrismaClient のインスタンスを作成するんじゃ。
// log: ['query'] を設定することで、実際にデータベースに送られるSQLクエリがコンソールに表示されるようになるぞ。
// これで、Prismaが裏で何をしておるのかがよくわかるじゃろう。
const prisma = new PrismaClient({
  log: ["query"], // クエリが実行されたときに実際に実行したクエリをログに表示する設定じゃ
});

// 非同期関数 main を定義するぞ。データベース操作は時間がかかることがあるからのう、
// 'async' と 'await' を使うことで、処理が終わるまで待つことができるのじゃ。
async function main() {
  console.log("Prisma Client を初期化しました。");

  // まず、現在のユーザー一覧を取得してみるぞ。
  // まだ誰もいないはずじゃから、空っぽの配列が表示されるじゃろう。
  const usersBefore = await prisma.user.findMany();
  console.log("Before ユーザー一覧:", usersBefore);

  // 新しいユーザーをデータベースに追加するんじゃ！
  // `data` オブジェクトに、作成したいユーザーの情報を渡すのじゃな。
  const newUser = await prisma.user.create({
    data: {
      name: `新しいユーザー ${new Date().toISOString()}`, // ユニークな名前を生成するぞ
    },
  });
  console.log("新しいユーザーを追加しました:", newUser);

  // もう一度ユーザー一覧を取得して、新しいユーザーが追加されたか確認するのじゃ。
  const usersAfter = await prisma.user.findMany();
  console.log("After ユーザー一覧:", usersAfter);
}

// main 関数を実行するぞ。もし途中でエラーが起こったら、
// そのエラーメッセージを表示して、プログラムを終了するようにしておる。
// 最後に、Prisma Client とデータベースの接続を必ず切断するようにしておるぞ。
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma Client を切断しました。");
  });
