export function setActiveNavigation(page){document.querySelectorAll(".nav-item").forEach(button=>button.classList.toggle("active",button.dataset.page===page))}
