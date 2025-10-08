import { getRecipes } from "./api.js";
import { getUserFirstName, clearUser, getTheme, setTheme } from "./storage.js";
import { debounce, renderStars, el, clamp } from "./utils.js";
import { openModal } from "./modal.js";

// Guard akses
const you = getUserFirstName();
if (!you) {
  window.location.replace("./login.html");
}
document.documentElement.classList.toggle('light', getTheme()==='light');

const nameSpan = document.getElementById("userName");
nameSpan.textContent = you || "User";

const state = document.getElementById("state");
const grid = document.getElementById("grid");
const errorBox = document.getElementById("errorBox");
const btnMore = document.getElementById("btnMore");
const btnLogout = document.getElementById("btnLogout");
const btnTheme = document.getElementById("btnTheme");
const q = document.getElementById("q");
const cuisineSel = document.getElementById("cuisine");

let DATA = [];
let VIEW = [];
let PAGE = 0;
const PAGE_SIZE = 12;

btnLogout.addEventListener("click", () => {
  clearUser();
  window.location.href = "./login.html";
});

btnTheme.addEventListener("click", () => {
  const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
  document.documentElement.classList.toggle('light', next==='light');
  setTheme(next);
});

function setBusy(b) {
  grid.setAttribute("aria-busy", b ? "true" : "false");
  state.classList.toggle("hidden", !b);
}

function safeImg(src) {
  if (src) return src;
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='100%' height='100%' fill='#0f1218'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#94a3b8' font-family='sans-serif' font-size='42'>No Image</text></svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function totalTime(r) {
  const p = Number(r.prepTimeMinutes || 0), c = Number(r.cookTimeMinutes || 0);
  return p + c;
}

function cuisineSet(list) {
  const set = new Set(list.map(r => r.cuisine).filter(Boolean));
  return ["__ALL__", ...Array.from(set).sort((a,b) => a.localeCompare(b))];
}

function optionize() {
  cuisineSel.innerHTML = "";
  for (const c of cuisineSet(DATA)) {
    const opt = el("option", { value: c }, c === "__ALL__" ? "Semua cuisine" : c);
    cuisineSel.appendChild(opt);
  }
}

function match(r, text) {
  const t = text.toLowerCase();
  if (!t) return true;
  const hay = [ r.name, r.cuisine, ...(r.ingredients || []), ...(r.tags || []) ].join(" ").toLowerCase();
  return hay.includes(t);
}

function filterData() {
  const text = q.value.trim();
  const c = cuisineSel.value;
  let list = DATA.filter(r => match(r, text));
  if (c && c !== "__ALL__") list = list.filter(r => (r.cuisine || '').toLowerCase() === c.toLowerCase());
  return list;
}

function card(r) {
  const wrap = el("article", { class: "card-recipe" });
  const img = el("img", { alt: r.name, src: safeImg(r.image) });
  const body = el("div", { class: "card-body" });

  const title = el("div", { class: "card-title" });
  title.appendChild(el("h3", {}, r.name));
  title.appendChild(el("span", { class: "badge" }, r.difficulty || "–"));

  const meta = el("div", { class: "meta" });
  meta.innerHTML = `
    <span class="chip">⏱️ ${totalTime(r)} min</span>
    <span class="chip">🍽️ ${r.servings ?? 1} porsi</span>
    <span class="chip">🌍 ${r.cuisine ?? "N/A"}</span>
    <span class="chip stars">${renderStars(clamp(Number(r.rating || 0), 0, 5))}</span>
  `;

  const ing = el("div", { class: "ing" }, `<strong>Ingredients:</strong> ${(r.ingredients || []).slice(0,6).join(", ")}${(r.ingredients||[]).length>6?"…":""}`);

  const actions = el("div", { class: "card-actions" });
  const left = el("div", {});
  (r.tags || []).slice(0,3).forEach(tag => left.appendChild(el("span", { class:"chip" }, `#${tag}`)));
  const btn = el("button", { class: "btn primary" }, "View Full Recipe");
  btn.addEventListener("click", () => showDetail(r));
  actions.appendChild(left);
  actions.appendChild(btn);

  body.appendChild(title);
  body.appendChild(meta);
  body.appendChild(ing);
  body.appendChild(actions);

  wrap.appendChild(img);
  wrap.appendChild(body);
  return wrap;
}

function showDetail(r) {
  const html = `
    <div class="recipe-detail">
      <h2 id="modalTitle">${r.name}</h2>

      <div class="detail-hero">
        <img class="hero-img" src="${safeImg(r.image)}" alt="${r.name}">
        <div class="info-cards">
          <div class="info-card"><div class="label">Prep Time</div><div class="value">${r.prepTimeMinutes ?? 0} mins</div></div>
          <div class="info-card"><div class="label">Cook Time</div><div class="value">${r.cookTimeMinutes ?? 0} mins</div></div>
          <div class="info-card"><div class="label">Servings</div><div class="value">${r.servings ?? 1}</div></div>
          <div class="info-card"><div class="label">Difficulty</div><div class="value">${r.difficulty ?? '-'}</div></div>
          <div class="info-card"><div class="label">Cuisine</div><div class="value">${r.cuisine ?? 'N/A'}</div></div>
          <div class="info-card"><div class="label">Calories</div><div class="value">${r.caloriesPerServing ? r.caloriesPerServing + ' cal/serving' : '-'}</div></div>
        </div>
      </div>

      <div class="rating-row">
        <span class="stars">${renderStars(clamp(Number(r.rating || 0), 0, 5))}</span>
        <span>(${r.reviewCount ?? 0} reviews)</span>
      </div>
      <div class="tag-row">${(r.tags||[]).map(t=>`<span class='chip'>${t}</span>`).join('')}</div>

      <div class="detail-grid">
        <section class="detail-section">
          <h3>Ingredients</h3>
          <ul>${(r.ingredients||[]).map(i=>`<li>${i}</li>`).join("")}</ul>
        </section>
        <section class="detail-section">
          <h3>Instructions</h3>
          <ol>${(r.instructions||[]).map(i=>`<li>${i}</li>`).join("")}</ol>
        </section>
      </div>
    </div>
  `;
  openModal(html);
}

function render() {
  grid.innerHTML = "";
  const end = Math.min((PAGE + 1) * PAGE_SIZE, VIEW.length);
  for (let i = 0; i < end; i++) grid.appendChild(card(VIEW[i]));
  btnMore.style.display = end < VIEW.length ? "inline-flex" : "none";
}

btnMore.addEventListener("click", () => { PAGE++; render(); });

const doSearch = debounce(() => { PAGE = 0; VIEW = filterData(); render(); }, 300);
q.addEventListener("input", doSearch);
cuisineSel.addEventListener("change", () => { PAGE = 0; VIEW = filterData(); render(); });

async function init() {
  try {
    setBusy(true);
    errorBox.classList.add("hidden");
    const recipes = await getRecipes();
    DATA = recipes;
    optionize();
    VIEW = filterData();
    render();
  } catch (err) {
    errorBox.textContent = "Gagal memuat recipes: " + err.message;
    errorBox.classList.remove("hidden");
  } finally {
    setBusy(false);
  }
}
init();
