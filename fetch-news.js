import Parser from "rss-parser";
import fs from "fs";

const parser = new Parser();

const feeds = [
  "https://uxdesign.cc/feed",
  "https://www.creativebloq.com/feeds/all",
  "https://www.smashingmagazine.com/feed/"
];

async function fetchNews() {
  let allArticles = [];

  for (let url of feeds) {
    try {
      const feed = await parser.parseURL(url);

      const articles = feed.items.slice(0, 2).map(item => ({
        title: item.title,
        description: item.contentSnippet || item.content || "",
        link: item.link,
        image: item.enclosure?.url || "https://placehold.co/600x400"
      }));

      allArticles.push(...articles);

    } catch (err) {
      console.log("❌ Error fetching:", url);
    }
  }

  // 🧹 Remove duplicates
  const unique = Array.from(
    new Map(allArticles.map(a => [a.link, a])).values()
  );

  fs.writeFileSync("raw-news.json", JSON.stringify(unique, null, 2));

  console.log("✅ Design news fetched!");
}

fetchNews();