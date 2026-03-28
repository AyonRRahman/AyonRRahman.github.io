console.log("JS LOADED - Academic Timeline with Month Sorting");

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
    icon.style.background = document.body.classList.contains("light") ? "transparent" : "#ffffff";
  });

  // PROJECT GITHUB BUTTONS
  const githubBtns = document.querySelectorAll(".project-actions .btn-github");
  githubBtns.forEach(btn => {
    btn.style.background = document.body.classList.contains("light") ? "#f0f0f0" : "#ffffff";
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
      div.className = containerId === "projects-preview" ? "card fade" : "project-card";

      let actionsHTML = "";
      if (p.github) actionsHTML += `<a href="${p.github}" target="_blank" class="btn-github"><img src="images/icons/github_icon.svg" alt="GitHub"></a>`;
      if (p.page) actionsHTML += `<a href="${p.page}" target="_blank" class="btn-primary">View Project</a>`;
      if (p.report) actionsHTML += `<a href="${p.report}" target="_blank" class="btn-primary">PDF</a>`;

      div.innerHTML = `
        ${containerId === "projects-container" && p.image ? `<div class="project-image"><img src="${p.image}" alt="${p.title}"></div>` : ""}
        <div class="project-content">
          <h3>${p.title || ""}</h3>
          <p class="project-desc">${p.desc || ""}</p>
          ${p.details ? `<p class="project-details">${p.details}</p>` : ""}
          ${p.tags && p.tags.length ? `<div class="project-tags">${p.tags.map(tag => `<span>${tag}</span>`).join("")}</div>` : ""}
          ${actionsHTML ? `<div class="project-actions">${actionsHTML}</div>` : ""}
        </div>
      `;

      container.appendChild(div);
      if (div.classList.contains("fade")) observer.observe(div);
    });

  } catch (err) {
    console.error("ERROR loading projects:", err);
  }
}

// =========================
// LOAD NEWS (Academic Timeline with Month Sorting)
// =========================
async function loadNews() {
  const preview = document.getElementById("news-preview");
  const full = document.getElementById("news-container");
  if (!preview && !full) return;

  try {
    const res = await fetch("./data/news.json");
    const news = await res.json();

    // Parse month+year into Date objects
    news.forEach(n => {
      n.dateObj = new Date(n.year); // JS can parse "Month, YYYY" automatically
    });

    // Sort descending by date
    news.sort((a,b)=> b.dateObj - a.dateObj);

    // Group by year
    const newsByYear = {};
    news.forEach(n => {
      const year = n.dateObj.getFullYear();
      if (!newsByYear[year]) newsByYear[year] = [];
      newsByYear[year].push(n);
    });

    const sortedYears = Object.keys(newsByYear).sort((a,b)=> b-a);

    if (full) {
      sortedYears.forEach((year, idxYear) => {
        // Year header
        const yearDiv = document.createElement("div");
        yearDiv.className = "timeline-year";
        yearDiv.textContent = year;
        full.appendChild(yearDiv);

        // Items within year (sorted by month descending)
        newsByYear[year].sort((a,b)=> b.dateObj - a.dateObj).forEach((n, idx) => {
          const div = document.createElement("div");
          div.className = "timeline-item fade show";
          if (idxYear === 0 && idx === 0) div.classList.add("latest"); // Highlight most recent

          div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-month">${n.dateObj.toLocaleString('default',{month:'short'})}</span>
              <p>${n.text}${n.link ? `<br><a href="${n.link}" target="_blank">Read more →</a>` : ""}</p>
            </div>
          `;
          full.appendChild(div);
          observer.observe(div);
        });
      });
    }

    if (preview) {
      news.slice(0,3).forEach(n => {
        const div = document.createElement("div");
        div.className = "card fade";
        div.innerHTML = `<b>${n.dateObj.toLocaleString('default',{month:'short'})}, ${n.dateObj.getFullYear()}</b> — ${n.text}`;
        preview.appendChild(div);
        observer.observe(div);
      });
    }

  } catch (err) {
    console.error("ERROR loading news:", err);
  }
}

// =========================
// MODAL
// =========================
function openInstagram() {
  document.getElementById("instagramModal").style.display = "block";
}
function closeModal() {
  document.getElementById("instagramModal").style.display = "none";
}
window.onclick = function(event) {
  const modal = document.getElementById("instagramModal");
  if (event.target === modal) modal.style.display = "none";
}

// =========================
// LOAD RESEARCH CURRENT WORK
// =========================
async function loadResearch() {
  const container = document.getElementById("current-work");
  if (!container) return;

  try {
    const res = await fetch("./data/research.json");
    const works = await res.json();

    works.forEach(w => {
      const div = document.createElement("div");
      div.className = "card fade";

      div.innerHTML = `<b>${w.title}</b><br>${w.desc}`;

      container.appendChild(div);
      observer.observe(div);
    });
  } catch (err) {
    console.error("ERROR loading research:", err);
  }
}

// =========================
// LOAD PUBLICATIONS
// =========================
async function loadPublications() {
  const container = document.getElementById("publications");
  if (!container) return;

  try {
    const res = await fetch("./data/publications.json");
    const pubs = await res.json();

    // sort by year descending
    pubs.sort((a, b) => b.year - a.year);

    pubs.forEach((p, idx) => {
      const div = document.createElement("div");
      div.className = "card fade";

      // Highlight most recent
      if (idx === 0) div.classList.add("latest");

      div.innerHTML = `
        <b>${p.authors}</b> (${p.year})<br>
        <i>${p.title}</i><br>
        ${p.venue}<br>
        ${p.link ? `<a href="${p.link}" target="_blank">[Paper]</a>` : ""}
      `;

      container.appendChild(div);
      observer.observe(div);
    });
  } catch (err) {
    console.error("ERROR loading publications:", err);
  }
}

// =========================
// INITIALIZE
// =========================
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("light");

  loadProjects("projects-preview", 3);
  loadProjects("projects-container");
  loadNews();
  loadResearch();
  loadPublications();
});