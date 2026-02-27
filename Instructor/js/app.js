import { renderCourses, setupAddingCourses } from "./courses.js";
import { setupAccountForm } from "./settings.js";
import { renderSessions, setupAddingSession, setupEditSession } from "./sessions.js";
import { renderExercise, setupExerciseImport } from "./exercises.js";

const navButtons = document.querySelectorAll(".nav-btn");
const pageContainer = document.getElementById("pageContainer")
const pageTitle = document.getElementById("pageTitle");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

const loginUser = JSON.parse(localStorage.getItem("loginUser"))
console.log(loginUser)
if(!loginUser){
    window.location.href = "../../General/pages/login.html"
}
if(loginUser.role !== "Instructor" || loginUser.verified === false) {
    alert("Access denied!")
    window.location.href = "../../General/pages/login.html"
}

userEmail.textContent = loginUser.email;


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

export async function loadPage(pageName) {
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
    const activeBtn = document.querySelector(`.nav-btn[data-page="${pageName}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    switch(pageName){
        case "settings":
            setupAccountForm();
            break;
        
        case "courses":
            renderCourses();
            const addingCourseBtn = document.getElementById("addCourseBtn")
            addingCourseBtn.addEventListener("click", () => {
                loadPage("add_courses")
            })
            break;

        case "sessions":
            renderSessions()
            break;
        
        case "add_sessions":
            setupAddingSession()
            break;
        
        case "edit_sessions":
            setupEditSession()
            break;
        
        case "add_courses":
            setupAddingCourses()
            break;
        
        case "exercises":
            renderExercise()
            break;
        
        case "add_exercises":
            setupExerciseImport()
            break;
        
        default:
            pageContainer.innerHTML = "Page Not found"
    }
}

loadPage("dashboard");