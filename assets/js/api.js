const API = "https://dummyjson.com";
async function fetchWithTimeout(url, opt = {}, ms = 10000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { ...opt, signal: ctl.signal }); } finally { clearTimeout(t); }
}

// AUTH USERS: LOCAL ONLY (password required)
export async function getUsers() {
  const res = await fetch("./data/users.json");
  if (!res.ok) throw new Error("users.json tidak ditemukan");
  const data = await res.json();
  return data.users || [];
}

// RECIPES: remote -> fallback lokal (tetap sama)
export async function getRecipes() {
  try {
    const res = await fetchWithTimeout(`${API}/recipes?limit=100`);
    if (!res.ok) throw new Error("recipes api failed");
    const data = await res.json(); return data.recipes || [];
  } catch {
    const res = await fetch("./data/recipes.json");
    if (!res.ok) throw new Error("fallback recipes.json not found");
    const data = await res.json(); return data.recipes || data;
  }
}
