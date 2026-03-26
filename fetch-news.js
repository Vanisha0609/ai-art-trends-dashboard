import Parser from "rss-parser";
import fs from "fs";

const parser = new Parser();

async function fetchNews() {
  const feed = await parser.parseURL("https://www.artnews.com/feed/");

  const articles = feed.items.slice(0, 10).map(item => ({
    title: item.title,
    description: item.contentSnippet,
    link: item.link,
    image: item.enclosure?.url || "https://placehold.co/600x400"
  }));

  fs.writeFileSync("raw-news.json", JSON.stringify(articles, null, 2));

  console.log("✅ Real news fetched!");
}

fetchNews();