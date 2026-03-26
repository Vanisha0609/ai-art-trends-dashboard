import fetch from "node-fetch";
import fs from "fs";

async function fetchReddit() {
  const res = await fetch("https://www.reddit.com/r/Art.json");
  const data = await res.json();

  const posts = data.data.children.slice(0, 10).map(post => ({
    title: post.data.title,
    image: post.data.thumbnail.startsWith("http")
      ? post.data.thumbnail
      : "https://placehold.co/600x400",
    description: post.data.selftext || post.data.title,
    link: "https://reddit.com" + post.data.permalink
  }));

  fs.writeFileSync("reddit.json", JSON.stringify(posts, null, 2));

  console.log("✅ Reddit data fetched!");
}

fetchReddit();