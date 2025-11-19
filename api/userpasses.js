import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const url = `https://catalog.roblox.com/v1/search/items?creatorTargetId=${userId}&creatorType=User&limit=30&category=Passes`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(500).json({ error: "Invalid response from Roblox" });
    }

    const passes = data.data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.product?.price ?? 0,
      icon: item.thumbnailUrl ?? "",
      onSale: item.product?.isForSale ?? false
    }));

    res.status(200).json({ passes });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
