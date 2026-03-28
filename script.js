alert("JS LOADED");
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

  // LINKS
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    link.style.color = document.body.classList.contains("light") ? "#0969da" : "#58a6ff";
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
      if (p.github) {
        actionsHTML += `<a href="${p.github}" target="_blank" class="btn-github">
          <img src="images/icons/github_icon.svg" alt="GitHub">
        </a>`;
      }
      if (p.page) {
        actionsHTML += `<a href="${p.page}" target="_blank" class="btn-primary">View Project →</a>`;
      }
      if (p.report) {
        actionsHTML += `<a href="${p.report}" target="_blank" class="btn-primary">Report →</a>`;
      }

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
          ${actionsHTML ? `<div class="project-actions">${actionsHTML}</div>` : ""}
        </div>
      `;

      container.appendChild(div);

      // Observe dynamically added fade elements
      if (div.classList.contains("fade")) observer.observe(div);
    });

    // Update GitHub button backgrounds after projects load
    const githubBtns = document.querySelectorAll(".project-actions .btn-github");
    githubBtns.forEach(btn => {
      btn.style.background = document.body.classList.contains("light") ? "#f0f0f0" : "#ffffff";
    });

  } catch (err) {
    console.error("ERROR loading projects:", err);
  }
}

// =========================
// LOAD NEWS
// =========================
async function loadNews() {
  const preview = document.getElementById("news-preview");
  const full = document.getElementById("news-container");

  console.log("FULL:", full);

  if (!preview && !full) return;

  try {
    const res = await fetch("./data/news.json");
    const news = await res.json();

    console.log("NEWS:", news); // ✅ NOW it's valid

    news.sort((a, b) => b.year - a.year);

    if (preview) {
      news.slice(0, 3).forEach(n => {
        const div = document.createElement("div");
        div.className = "card fade";

        div.innerHTML = `<b>${n.year}</b> — ${n.text}`;

        preview.appendChild(div);
        observer.observe(div);
      });
    }

    if (full) {
      news.forEach(n => {
        const div = document.createElement("div");
        div.className = "timeline-item fade show";

        div.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>${n.year}</h3>
            <p>
              ${n.text}
              ${n.link ? `<br><a href="${n.link}" target="_blank">Read more →</a>` : ""}
            </p>
          </div>
        `;

        full.appendChild(div);
      });
    }

  } catch (err) {
    console.error("ERROR loading news:", err);
  }
}

// =========================
// INSTAGRAM QR MODAL
// =========================
function openInstagram() {
  const modal = document.getElementById("instagramModal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("instagramModal");
  modal.style.display = "none";
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById("instagramModal");
  if (event.target === modal) modal.style.display = "none";
}

// =========================
// INITIALIZE
// =========================
window.addEventListener("DOMContentLoaded", () => {
  // Force light mode by default
  document.body.classList.add("light");

  // Load content
  loadProjects("projects-preview", 3);
  loadProjects("projects-container");
  loadNews();
});