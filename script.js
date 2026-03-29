async function loadNews() {
  try {
    const res = await fetch("news.json");
    const data = await res.json();
    const articles = data.articles;
    const lastUpdated = new Date(data.lastUpdated);

    // 🕒 Calculate "time ago"
    const now = new Date();
    const diffMs = now - lastUpdated;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    let timeAgo = "";
    if (diffMins < 1) {
      timeAgo = "Just now";
    } else if (diffMins < 60) {
      timeAgo = `${diffMins} min ago`;
    } else {
      timeAgo = `${diffHours} hr ago`;
    }
    const container = document.getElementById("news-container");
    container.innerHTML = "";

// ✅ SET LAST UPDATED HERE
    document.getElementById("last-updated").innerText = `⏱️ Updated ${timeAgo}`;
    

    if (articles.length > 0) {
      const featured = articles[0];

      document.getElementById("featured-news").innerHTML = `
        <section class="relative overflow-hidden rounded-[3rem] p-10 lg:p-16 bg-gradient-to-br from-primary-container to-tertiary-container">
          
          <p class="text-xs font-bold uppercase tracking-widest mb-4">
            Today's featured news
          </p>

          <h1 class="text-4xl lg:text-5xl font-extrabold mb-6">
            ${featured.title}
          </h1>

          <p class="max-w-xl text-sm text-gray-700 mb-6">
            ${featured.summary}
          </p>

          <a href="${featured.link}" target="_blank"
            class="inline-block px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold">
            Read Full Article →
          </a>

        </section>
      `;
    }
    articles.forEach(article => {
      const card = `
        <article class="group hover-lift bg-surface-container-lowest rounded-xl overflow-hidden soft-shadow">
          
          <div class="aspect-video w-full overflow-hidden bg-surface-container">
            <img src="${article.image || 'https://via.placeholder.com/400'}"
                 class="w-full h-full object-cover"/>
          </div>

          <div class="p-6 space-y-4">
            
            <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 rounded-full bg-secondary-container text-xs font-bold uppercase">
                ${article.category || "Design"}
              </span>
              <span class="px-3 py-1 rounded-full bg-secondary-container text-xs font-bold uppercase">
                ${article.style || "Art"}
              </span>
              <span class="px-3 py-1 rounded-full bg-tertiary-container text-xs font-bold uppercase">
                ${article.mood || "Creative"}
              </span>
            </div>

            <h3 class="text-xl font-bold">
              ${article.title}
            </h3>

            <p class="text-sm text-gray-500">
              ${article.summary}
            </p>

            <a href="${article.link}" target="_blank"
               class="text-primary font-semibold text-sm">
               Read more →
            </a>

          </div>
        </article>
      `;

      container.innerHTML += card;
    });

  } catch (err) {
    console.error("Error loading news:", err);
  }
}

loadNews();