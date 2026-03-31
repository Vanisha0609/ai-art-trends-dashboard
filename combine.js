import fs from "fs";

function safeRead(file) {
  try {
    if (!fs.existsSync(file)) {
      console.log(`⚠️ ${file} not found, using empty array`);
      return [];
    }

    const data = fs.readFileSync(file, "utf-8");

    if (!data) return [];

    return JSON.parse(data);
  } catch (err) {
    console.log(`❌ Error reading ${file}:`, err.message);
    return [];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

try {
  const rss = safeRead("raw-news.json");
  const reddit = safeRead("reddit.json");

  const combined = [...rss, ...reddit];

  shuffleArray(combined);

  fs.writeFileSync("combined.json", JSON.stringify(combined, null, 2));

  console.log(`✅ Data combined! (${combined.length} articles)`);

  process.exit(0);

} catch (err) {
  console.log("❌ combine.js crashed:", err.message);

  // fallback to prevent pipeline failure
  fs.writeFileSync("combined.json", JSON.stringify([], null, 2));

  process.exit(1);
}
