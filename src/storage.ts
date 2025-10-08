const KEY_NAME = "userFirstName"; const THEME_KEY = "theme";
export function getUserFirstName(): string | null { try { return localStorage.getItem(KEY_NAME); } catch { return null; } }
export function setUserFirstName(name: string){ try { localStorage.setItem(KEY_NAME, name); } catch {} }
export function clearUser(){ try { localStorage.removeItem(KEY_NAME); } catch {} }
export type ThemeMode = "light" | "dark";
export function getTheme(): ThemeMode { try { return (localStorage.getItem(THEME_KEY) as ThemeMode) || "dark"; } catch { return "dark"; } }
export function setTheme(theme: ThemeMode){ try { localStorage.setItem(THEME_KEY, theme); } catch {} }
