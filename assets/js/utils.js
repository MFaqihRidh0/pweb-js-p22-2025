// Debounce untuk search realtime
export function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
export function renderStars(r) {
  const full = Math.floor(r); const half = r - full >= 0.5;
  let s = ""; for (let i=0;i<full;i++) s += "★"; if (half) s += "★"; while (s.length<5) s += "☆";
  return s.split("").map(ch => `<span class="${ch==="★"?"on":"off"}">${ch}</span>`).join("");
}
export function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
export function el(tag, attrs = {}, html = "") {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v; else if (k.startsWith("data-")) e.setAttribute(k, v); else e[k] = v;
  }
  if (html) e.innerHTML = html; return e;
}
