document.addEventListener("DOMContentLoaded", () => {
  // 日吉駅を中心に地図を初期化
  const map = L.map("map").setView([35.553, 139.647], 16);

  // 地図のタイル（見た目）を設定
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let allRestaurants = []; // すべてのレストランデータを保持する配列
  const markersLayer = L.layerGroup().addTo(map); // マーカーを管理するレイヤー

  // サーバーからレストランのデータを取得
  fetch("/api/restaurants")
    .then((response) => response.json())
    .then((data) => {
      allRestaurants = data;
      displayRestaurants(allRestaurants);
    })
    .catch((error) => console.error("Error fetching restaurants:", error));

  // レストランを地図上に表示する関数
  function displayRestaurants(restaurants) {
    markersLayer.clearLayers(); // 既存のマーカーをすべて削除
    restaurants.forEach((restaurant) => {
      const marker = L.marker([
        restaurant.latitude,
        restaurant.longitude,
      ]).addTo(markersLayer);
      marker.bindPopup(
        `<b>${restaurant.name}</b><br>${restaurant.genre}<br>価格帯: ${restaurant.price_range}`
      );
    });
  }

  // フィルタ機能
  const priceFilter = document.getElementById("price-filter");
  priceFilter.addEventListener("change", (e) => {
    const selectedPrice = e.target.value;
    if (selectedPrice === "all") {
      displayRestaurants(allRestaurants);
    } else {
      const filteredRestaurants = allRestaurants.filter(
        (r) => r.price_range === selectedPrice
      );
      displayRestaurants(filteredRestaurants);
    }
  });

  // ランダム選択機能
  const randomBtn = document.getElementById("random-btn");
  randomBtn.addEventListener("click", () => {
    if (allRestaurants.length === 0) return;

    // 現在フィルタリングされているレストランを取得
    const currentPrice = priceFilter.value;
    const targetRestaurants =
      currentPrice === "all"
        ? allRestaurants
        : allRestaurants.filter((r) => r.price_range === currentPrice);

    if (targetRestaurants.length === 0) {
      alert("対象のお店がありません！");
      return;
    }

    const randomIndex = Math.floor(Math.random() * targetRestaurants.length);
    const randomRestaurant = targetRestaurants[randomIndex];

    // 地図をそのお店に移動してポップアップを開く
    map.setView([randomRestaurant.latitude, randomRestaurant.longitude], 17);

    // マーカーを見つけてポップアップを開く
    markersLayer.eachLayer((marker) => {
      const latLng = marker.getLatLng();
      if (
        latLng.lat === randomRestaurant.latitude &&
        latLng.lng === randomRestaurant.longitude
      ) {
        marker.openPopup();
      }
    });
  });
});
