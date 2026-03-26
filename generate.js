import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const articles = JSON.parse(fs.readFileSync("combined.json"));

async function processArticle(article) {
  const prompt = `
  Analyze this art-related content.

  Return ONLY in this JSON format:
  {
    "summary": "...",
    "style": "...",
    "mood": "..."
  }

  Content:
  ${article.description}
  `;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    }
  );

  const data = await res.json();
  if (!data.candidates || data.candidates.length === 0) {
    console.log("❌ Gemini API Error:", data);

    return {
      title: article.title,
      image: article.image,
      summary: article.description,
      style: "Unknown",
      mood: "Neutral",
      link: article.link
    };
  }
  console.log(JSON.stringify(data, null, 2));
  const text = data.candidates[0].content.parts[0].text;

  try {
    const aiData = JSON.parse(text);

    return {
      title: article.title,
      image: article.image,
      summary: aiData.summary,
      style: aiData.style,
      mood: aiData.mood,
      link: article.link
    };

  } catch (err) {
    console.log("⚠️ Error parsing AI response");

    return {
      title: article.title,
      image: article.image,
      summary: article.description,
      style: "Unknown",
      mood: "Neutral",
      link: article.link
    };
  }
}

async function run() {
  const results = [];

  for (let article of articles.slice(0, 10)) {
    const processed = await processArticle(article);
    results.push(processed);
  }

  fs.writeFileSync("news.json", JSON.stringify(results, null, 2));

  console.log("✅ news.json generated!");
}

run();