const express = require("express");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// フロントエンドの静的ファイルを提供
app.use(express.static(path.join(__dirname, "public")));

// APIエンドポイント: すべてのレストラン情報を取得
app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
