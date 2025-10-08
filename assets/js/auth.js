import { getUsers } from "./api.js";
import { setUserFirstName, getTheme } from "./storage.js";

// apply theme on load
document.documentElement.classList.toggle('light', getTheme()==='light');

const form = document.getElementById("loginForm");
const state = document.getElementById("loginState");
const msg = document.getElementById("loginMsg");
const btn = document.getElementById("btnLogin");

function showError(text){
  msg.textContent = text;
  msg.className = "msg error";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  const username = form.username.value.trim();
  const password = form.password.value;

  if (!username || !password) {
    showError("Kredensial tidak valid."); // pesan generik
    return;
  }

  btn.disabled = true;
  state.classList.remove("hidden");

  try {
    const users = await getUsers();
    const u = users.find(x => String(x.username).toLowerCase() === username.toLowerCase());
    await new Promise(r => setTimeout(r, 300)); // UX
    if (!u || String(u.password) !== String(password)) {
      showError("Kredensial tidak valid.");
      return;
    }
    setUserFirstName(u.firstName || "User");
    msg.textContent = "Login berhasil. Mengarahkan ke halaman recipes…";
    msg.className = "msg";
    setTimeout(() => { window.location.href = "./recipes.html"; }, 650);
  } catch (err) {
    showError("Terjadi masalah saat login.");
  } finally {
    btn.disabled = false;
    state.classList.add("hidden");
  }
});
