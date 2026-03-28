console.log("Teaching page JS loaded");

// LOAD COURSES
async function loadCourses() {
  const container = document.getElementById("courses-list");
  if (!container) return;

  try {
    const res = await fetch("./data/courses.json");
    const courses = await res.json();

    courses.forEach(c => {
      const div = document.createElement("div");
      div.className = "card fade";

      div.innerHTML = `
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <p>
          <a href="${c.nsuLink}" target="_blank" class="btn-primary">NSU Course Page</a>
          ${c.localLink ? `<a href="${c.localLink}" class="btn-primary">Course Page </a>` : ""}
        </p>
      `;

      container.appendChild(div);
      if (typeof observer !== "undefined") observer.observe(div);
    });

  } catch (err) {
    console.error("Error loading courses:", err);
  }
}

// INITIALIZE
window.addEventListener("DOMContentLoaded", () => {
  loadCourses();
});