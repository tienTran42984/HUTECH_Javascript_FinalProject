const navButtons = document.querySelectorAll(".nav-btn");
const pageContainer = document.getElementById("pageContainer")
const pageTitle = document.getElementById("pageTitle");
const logoutBtn = document.getElementById("logoutBtn");

loadPage("dashboard");

navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        loadPage(btn.dataset.page);
    });
});

logoutBtn.addEventListener("click", () => {
    const ok = confirm("Do you want to logout?");
    if (ok) {
        alert("You have logout");
    }
})

pageContainer.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => {
        loadPage(btn.dataset.goto);
    });
});

async function loadPage(pageName) {
    const res = await fetch(`${pageName}.html`);
    const html = await res.text();
    pageContainer.innerHTML = html;

    const titleMap = {
        dashboard: "Dashboard",
        courses: "My Courses",
        settings: "Account Settings"
    };
    pageTitle.textContent = titleMap[pageName] || "Dashboard";

    navButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.nav-btn[data-page="${pageName}"]`).classList.add("active");

    if(pageName === "settings"){
        setupAccountForm();
    }
}

function setupAccountForm() {
    const passwordForm = document.getElementById("passwordForm");

    if(!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const oldPass = document.getElementById("oldPass").value.trim();
        const newPass = document.getElementById("newPass").value.trim();
        const confirmPass = document.getElementById("confirmPass").value.trim();
        const success = document.getElementById("passSuccess");
        const error = document.getElementById("passError");

        if(newPass !== confirmPass){
            error.textContent = "Confirm password is not matched with entered password"
            error.style.display = "block"
            return;
        }

        if(newPass.length < 6){
            error.textContent = "New password must be at least 6 characters."
            error.style.display = "block"
            return;
        }

        if (oldPass === newPass) {
            error.textContent = "New password must be different from old password."
            error.style.display = "block"
            return
        }
        
        success.textContent = "Changning password successfully"
        success.style.display = "block"
        form.reset();
    })
}