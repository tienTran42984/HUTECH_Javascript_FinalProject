import { loadPage } from "./app.js";

export function setupDashboard() {
    const loginUser = JSON.parse(localStorage.getItem("loginUser"))

    const gotoButtons = pageContainer.querySelectorAll("[data-goto]");
    gotoButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            loadPage(btn.dataset.goto);
        });
    });
    
    const displayMail = document.getElementById("displayMail")
    if(loginUser){
        displayMail.textContent = loginUser.email
    }
}