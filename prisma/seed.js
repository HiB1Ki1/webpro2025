const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 登録したいお店のデータ
const restaurantsToSeed = [
  {
    name: "ラーメン ぶっ豚 日吉店",
    genre: "ラーメン",
    price_range: "1000円〜2000円",
    address: "神奈川県横浜市港北区日吉本町1-2-6",
    latitude: 35.55328,
    longitude: 139.64627,
  },
  {
    name: "壱角家 日吉店",
    genre: "ラーメン",
    price_range: "〜1000円",
    address: "神奈川県横浜市港北区日吉2-1-8",
    latitude: 35.5524,
    longitude: 139.64805,
  },
  {
    name: "武蔵家 日吉店",
    genre: "ラーメン",
    price_range: "〜1000円",
    address: "神奈川県横浜市港北区日吉本町1-3-19",
    latitude: 35.55331,
    longitude: 139.6475,
  },
];

async function main() {
  console.log("Start seeding...");
  for (const r of restaurantsToSeed) {
    const restaurant = await prisma.restaurant.upsert({
      where: { address: r.address }, // 住所をユニークなキーとしてお店を探す
      update: {}, // もし見つかった場合、何もしない（情報を更新したければここに書く）
      create: r, // もし見つからなかった場合、新しいデータとして作成する
    });
    console.log(
      `Created or found restaurant with address: ${restaurant.address}`
    );
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
