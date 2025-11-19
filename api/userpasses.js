export const config = {
  runtime: "nodejs", // WAJIB supaya fetch dan Node API berjalan
};

export default async function handler(req, res) {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const url = `https://catalog.roblox.com/v1/search/items?creatorTargetId=${userId}&creatorType=User&limit=30&category=Passes`;

    const response = await fetch(url); // fetch bawaan Node18 → AMAN
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(500).json({ error: "Invalid response from Roblox" });
    }

    const passes = data.data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.product?.price ?? 0,
      icon: item.thumbnailUrl ?? "",
      onSale: item.product?.isForSale ?? false,
    }));

    return res.status(200).json({ passes });

  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
