
import fs from "fs";

async function fetchReddit() {
try{
  const res = await fetch(
  "https://www.reddit.com/r/art+illustration+digitalart+ui_design+web_design.json?raw_json=1",
  {
    headers: {
      "User-Agent": "ArtTrendsBot/1.0 (learning project)"
    }
  }
  );
  console.log("Status:", res.status);
  if (!res.ok) {
  console.log("❌ Reddit API error:", res.status);
  fs.writeFileSync("reddit.json", JSON.stringify([], null, 2));
  return;
  }
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
  const text = await res.text();
  console.log("❌ Reddit returned HTML:", text.substring(0, 200));

  fs.writeFileSync("reddit.json", JSON.stringify([], null, 2));
  return;
  }
  const data = await res.json();

  const keywords = [
    "painting", "sketch", "drawing", "illustration",
    "digital", "ui", "ux", "figma", "adobe",
    "photoshop", "design", "concept"
  ];

  const posts = data.data.children
    .map(p => p.data)
    .filter(post => {
      const title = post.title?.toLowerCase() || "";

      // ✅ Check for real image (NOT thumbnails)
      const hasImage =
        post.post_hint === "image" ||
        post.url?.endsWith(".jpg") ||
        post.url?.endsWith(".png") ||
        post.url?.endsWith(".jpeg");

      // ✅ Keyword filtering
      const isRelevant = keywords.some(k => title.includes(k));

      const isNotJunk =
        !title.includes("megathread") &&
        !title.includes("weekly") &&
        !title.includes("discussion");

      return hasImage && isRelevant && isNotJunk;
    })
    .slice(0, 10)
    .map(post => ({
      title: post.title,
      image: post.url || "https://placehold.co/600x400", 
      description: post.selftext || post.title,
      link: "https://reddit.com" + post.permalink
    }));

  fs.writeFileSync("reddit.json", JSON.stringify(posts, null, 2));

  console.log("✅ Filtered Reddit data fetched!");
}
catch (err) {
    console.log("❌ Reddit fetch crashed:", err.message);
    fs.writeFileSync("reddit.json", JSON.stringify([], null, 2));
  }
}

fetchReddit();