
import fs from "fs";

async function fetchReddit() {
  const res = await fetch(
    "https://www.reddit.com/r/art+illustration+digitalart+ui_design+web_design.json"
  );
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

      // ❌ Remove junk
      const isNotJunk =
        !title.includes("megathread") &&
        !title.includes("weekly") &&
        !title.includes("discussion");

      return hasImage && isRelevant && isNotJunk;
    })
    .slice(0, 10)
    .map(post => ({
      title: post.title,
      image: post.url, // 🔥 full image (not thumbnail)
      description: post.selftext || post.title,
      link: "https://reddit.com" + post.permalink
    }));

  fs.writeFileSync("reddit.json", JSON.stringify(posts, null, 2));

  console.log("✅ Filtered Reddit data fetched!");
}

fetchReddit();