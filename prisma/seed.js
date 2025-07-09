const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 既存のデータをすべて削除
  await prisma.restaurant.deleteMany({});
  console.log("Deleted existing restaurants.");

  // 新しいデータを作成
  const newRestaurants = await prisma.restaurant.createMany({
    data: [
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
    ],
  });
  console.log(`Created ${newRestaurants.count} new restaurants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
