const body = document.body;
const progress = document.querySelector(".progress");
const themeToggle = document.querySelector("#themeToggle");
const searchToggle = document.querySelector("#searchToggle");
const searchModal = document.querySelector("#searchModal");
const searchInput = document.querySelector("#searchInput");
const searchResults = document.querySelector("#searchResults");
const filters = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
const skillButtons = document.querySelectorAll(".node");
const skillTitle = document.querySelector("#skillTitle");
const skillText = document.querySelector("#skillText");

const skillCopy = {
  vision: {
    title: "Computer Vision",
    text: "Medical imaging, DICOM preprocessing, ResNet50 ensembles, CLAHE pipelines, and explainability through Grad-CAM.",
  },
  nlp: {
    title: "NLP",
    text: "Profile matching, intent handling, repeat-query reduction, and data-driven guidance workflows using Python and Pandas.",
  },
  frontend: {
    title: "Frontend Engineering",
    text: "Responsive Next.js interfaces, dark mode systems, accessible contrast, dynamic components, and serverless contact flows.",
  },
  data: {
    title: "Data Products",
    text: "Spreadsheet ingestion, real-time tracking, MySQL foundations, cached client data, and lightweight analytics workflows.",
  },
};

const searchIndex = [
  ["Kidney Tumor Detection", "92% accuracy, Grad-CAM, DICOM CT scans", "#work"],
  ["Finance Manager", "Next.js, TypeScript, React Query, debt tracking", "#work"],
  ["Career Guidance Chatbot", "Python, Streamlit, Pandas, NLP", "#work"],
  ["Home-2 Work", "Coach hiring platform, Next.js, FormSubmit", "#work"],
  ["Skills", "Python, C, MySQL, HTML/CSS, Keras, Streamlit", "#skills"],
  ["Experience", "Python Developer Intern, B.Tech AIML, NCC", "#experience"],
  ["Contact", "Email, LinkedIn, GitHub", "#contact"],
];

function setTheme(mode) {
  body.classList.toggle("light", mode === "light");
  localStorage.setItem("theme", mode);
}

setTheme(localStorage.getItem("theme") || "dark");

themeToggle.addEventListener("click", () => {
  setTheme(body.classList.contains("light") ? "dark" : "light");
});

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const ratio = max > 0 ? scrollY / max : 0;
  progress.style.width = `${Math.min(100, ratio * 100)}%`;
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    projectCards.forEach((card) => {
      card.classList.toggle("hide", filter !== "all" && card.dataset.type !== filter);
    });
  });
});

projectCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    skillButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const content = skillCopy[button.dataset.skill];
    skillTitle.textContent = content.title;
    skillText.textContent = content.text;
  });
});

function renderSearch(term = "") {
  const cleanTerm = term.trim().toLowerCase();
  const results = searchIndex.filter(([title, detail]) => {
    return `${title} ${detail}`.toLowerCase().includes(cleanTerm);
  });

  searchResults.innerHTML = results
    .map(([title, detail, href]) => `<a href="${href}"><strong>${title}</strong><span>${detail}</span></a>`)
    .join("");

  searchResults.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeSearch);
  });
}

function openSearch() {
  renderSearch();
  searchModal.classList.add("open");
  searchModal.setAttribute("aria-hidden", "false");
  setTimeout(() => searchInput.focus(), 20);
}

function closeSearch() {
  searchModal.classList.remove("open");
  searchModal.setAttribute("aria-hidden", "true");
  searchInput.value = "";
}

searchToggle.addEventListener("click", openSearch);
searchInput.addEventListener("input", () => renderSearch(searchInput.value));
searchModal.addEventListener("click", (event) => {
  if (event.target === searchModal) closeSearch();
});

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
  if (event.key === "Escape") closeSearch();
});

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const node = entry.target;
    const target = Number(node.dataset.count);
    const suffix = node.textContent.includes("%") ? "%" : "";
    let current = 0;
    const step = Math.max(1, Math.round(target / 34));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      node.textContent = `${current}${suffix}`;
    }, 24);
    counterObserver.unobserve(node);
  });
});

counters.forEach((counter) => counterObserver.observe(counter));

const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
let points = [];
let pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * scale);
  canvas.height = Math.floor(innerHeight * scale);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  points = Array.from({ length: Math.max(42, Math.floor(innerWidth / 24)) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
  }));
}

function drawField() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const styles = getComputedStyle(body);
  const accent = styles.getPropertyValue("--accent").trim();
  const muted = styles.getPropertyValue("--muted").trim();

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;
    if (point.x < 0 || point.x > innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > innerHeight) point.vy *= -1;

    ctx.beginPath();
    ctx.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = index % 3 === 0 ? accent : muted;
    ctx.globalAlpha = 0.42;
    ctx.fill();

    points.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 128) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = (128 - distance) / 780;
        ctx.stroke();
      }
    });

    if (pointer.active) {
      const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
      if (pointerDistance < 160) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = (160 - pointerDistance) / 320;
        ctx.stroke();
      }
    }
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawField);
}

addEventListener("resize", resizeCanvas);
addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
});
addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
drawField();
