import fs from "fs";

const rss = JSON.parse(fs.readFileSync("raw-news.json") || "[]");
const reddit = JSON.parse(fs.readFileSync("reddit.json") || "[]");

const combined = [...rss, ...reddit];
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffleArray(combined);

fs.writeFileSync("combined.json", JSON.stringify(combined, null, 2));

console.log("✅ Data combined!");