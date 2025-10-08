const KEY_NAME = "userFirstName";

/** @returns {string|null} */
export function getUserFirstName() {
  try { return localStorage.getItem(KEY_NAME); } catch { return null; }
}
export function setUserFirstName(name) {
  try { localStorage.setItem(KEY_NAME, name); } catch {}
}
export function clearUser() {
  try { localStorage.removeItem(KEY_NAME); } catch {}
}

const THEME_KEY = "theme"; // "light" | "dark"
export function getTheme(){ try{ return localStorage.getItem(THEME_KEY) || "dark"; }catch{ return "dark"; } }
export function setTheme(theme){ try{ localStorage.setItem(THEME_KEY, theme); }catch{} }
