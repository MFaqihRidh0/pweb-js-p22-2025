const modal = document.getElementById("modal") as HTMLDivElement; const body = document.getElementById("modalBody") as HTMLDivElement;
export function openModal(html:string){ body.innerHTML=html; modal.classList.remove("hidden"); (document.body as HTMLBodyElement).style.overflow="hidden"; }
export function closeModal(){ modal.classList.add("hidden"); body.innerHTML=""; (document.body as HTMLBodyElement).style.overflow=""; }
modal.addEventListener("click",(e)=>{ const t=e.target as HTMLElement; if(t.dataset.close || t.classList.contains("modal-backdrop")) closeModal(); });
window.addEventListener("keydown",(e)=>{ if(e.key==="Escape" && !modal.classList.contains("hidden")) closeModal(); });
