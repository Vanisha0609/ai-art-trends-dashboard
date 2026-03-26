import fs from "fs";

const rss = JSON.parse(fs.readFileSync("raw-news.json"));
const reddit = JSON.parse(fs.readFileSync("reddit.json"));

const combined = [...rss, ...reddit];

fs.writeFileSync("combined.json", JSON.stringify(combined, null, 2));

console.log("✅ Data combined!");