// =========================
// FADE-IN ANIMATION
// =========================
const faders = document.querySelectorAll('.fade');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
});
faders.forEach(el => observer.observe(el));

// =========================
// DARK MODE TOGGLE
// =========================
function toggleMode() {
  document.body.classList.toggle("light");

  // HERO background
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.background = document.body.classList.contains("light")
      ? "linear-gradient(to bottom, #f0f0f0, #e0e0e0)"
      : "linear-gradient(to bottom, rgba(10, 25, 50,0.95), rgba(20, 30, 60,0.9))";
  }

  // ICON LINKS
  const icons = document.querySelectorAll(".icon-links img");
  icons.forEach(icon => {
    icon.style.filter = document.body.classList.contains("light")
      ? "brightness(1.2)"
      : "brightness(0.9)";
  });

  // LINK COLORS
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    link.style.color = document.body.classList.contains("light") ? "#0969da" : "#58a6ff";
  });
}

// =========================
// LOAD PROJECTS
// =========================
async function loadProjects(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch("./data/projects.json");
    const projects = await res.json();

    const projList = limit ? projects.slice(0, limit) : projects;

    projList.forEach(p => {
      const div = document.createElement("div");
      // remove fade from project-container cards, but keep for preview
      div.className = containerId === "projects-preview" ? "card fade" : "project-card";

      div.innerHTML = `
        ${containerId === "projects-container" && p.image ? `
          <div class="project-image">
            <img src="${p.image}" alt="${p.title}">
          </div>
        ` : ""}
        <div class="project-content">
          <h3>${p.title || ""}</h3>
          <p class="project-desc">${p.desc || ""}</p>
          ${p.details ? `<p class="project-details">${p.details}</p>` : ""}
          ${p.tags && p.tags.length ? `<div class="project-tags">${p.tags.map(tag => `<span>${tag}</span>`).join("")}</div>` : ""}
          ${p.link ? `<div class="project-actions"><a href="${p.link}" target="_blank" class="btn-primary">View Project →</a></div>` : ""}
        </div>
      `;

      container.appendChild(div);

      // Observe dynamically added fade elements
      if (div.classList.contains("fade")) {
        observer.observe(div);
      }
    });

  } catch (err) {
    console.error("ERROR loading projects:", err);
  }
}

// =========================
// LOAD NEWS
// =========================
async function loadNews() {
  const container = document.getElementById("news-preview");
  if (!container) return;

  try {
    const res = await fetch("./data/news.json");
    const news = await res.json();

    news.slice(0, 3).forEach(n => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<b>${n.year}</b> — ${n.text}`;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("ERROR loading news:", err);
  }
}

// =========================
// INITIALIZE
// =========================
window.addEventListener("DOMContentLoaded", () => {
  loadProjects("projects-preview", 3);
  loadProjects("projects-container");
  loadNews();
});