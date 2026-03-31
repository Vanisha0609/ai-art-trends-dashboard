import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;

// ✅ Safe read function
function safeRead(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
if (!API_KEY) {
  console.log("❌ Missing API KEY");
}
const articles = safeRead("combined.json");

async function processArticle(article) {
  
  try {
    const content = article.description || article.title;
    if (!API_KEY) return fallback(article);
    const prompt = `
    Analyze this art-related content.

    Return ONLY in this JSON format:
    {
      "summary": "...",
      "style": "...",
      "mood": "..."
    }
    
    Content:
    ${content}
    `;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );


    if (!res.ok) {
      console.log("❌ API error:", res.status);
      return fallback(article);
    }

    let data;

    try {
      data = await res.json();
    } catch (err) {
      console.log("❌ Invalid JSON response");
      return fallback(article);
    }

    // ✅ API-level fallback
    if (!data.candidates || data.candidates.length === 0) {
      console.log("❌ Gemini API Error:", data);

      return fallback(article);
    }

    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json|```/g, "").trim();
    try {
      const aiData = JSON.parse(text);

      return {
        title: article.title,
        image: article.image || "https://placehold.co/600x400",
        summary: aiData.summary,
        category: getCategory(article.title + " " + article.description),
        style: aiData.style,
        mood: aiData.mood,
        link: article.link
      };

    } catch (err) {
      console.log("⚠️ JSON parse failed");

      return fallback(article);
    }

  } catch (error) {
    // 🚨 THIS handles quota/network issues
    console.log("❌ Fetch failed:", error.message);

    return fallback(article);
  }
}

function fallback(article) {
  return {
    title: article.title,
    image: article.image || "https://placehold.co/600x400",
    summary: article.description || article.title,
    category: getCategory(article.title + " " + article.description),
    style: "Unknown",
    mood: "Neutral",
    link: article.link
  };
}

function getCategory(text) {
  text = text.toLowerCase();

  if (text.includes("ux") || text.includes("ui")) return "UI/UX";
  if (text.includes("figma") || text.includes("adobe")) return "Tools";
  if (text.includes("ai")) return "AI Design";
  if (text.includes("3d")) return "3D Art";
  if (text.includes("illustration") || text.includes("drawing")) return "Illustration";
  if (text.includes("typography")) return "Typography";

  return "Design";
}

async function run() {
  try{
  const results = [];

  for (let article of articles.slice(0, 6)) {
    const processed = await processArticle(article);
    results.push(processed);
  }

 const now = new Date().toISOString();

  const finalData = {
    lastUpdated: now,
    articles: results
  };

  fs.writeFileSync("news.json", JSON.stringify(finalData, null, 2));
  console.log(`✅ Generated news (${results.length} articles)`);

  process.exit(0);
}catch (err) {
    console.log("❌ generate.js crashed:", err.message);

    fs.writeFileSync("news.json", JSON.stringify({
      lastUpdated: new Date().toISOString(),
      articles: []
    }, null, 2));

    process.exit(1);
  }
}

run();