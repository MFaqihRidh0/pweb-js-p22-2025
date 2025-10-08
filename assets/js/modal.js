const modal = document.getElementById("modal");
const body = document.getElementById("modalBody");

export function openModal(html) {
  body.innerHTML = html;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
export function closeModal() {
  modal.classList.add("hidden");
  body.innerHTML = "";
  document.body.style.overflow = "";
}
modal.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.close || t.classList.contains("modal-backdrop")) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});
