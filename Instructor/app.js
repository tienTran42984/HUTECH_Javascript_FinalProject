const courses = [
  {
    id: "C001",
    title: "Java Programming Basics",
    description: "Introductory Java course. Through this course you will learn essential knowledge about Java programming language"
  },
  {
    id: "C002",
    title: "Web Development with JavaScript",
    description: "Learn HTML, CSS, and JavaScript fundamentals."
  },
  {
    id: "C003",
    title: "Database Fundamentals",
    description: "SQL basics and database design."
  },
  {
    id: "C004",
    title: "Classic Art Analysis",
    description: "This course is everything you need to know about classic arts. Including a new way to behold them."
  }
];

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

    if(pageName === "courses"){
        renderCourses();
    }

    if(pageName === "sessions"){
        renderSessions();
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

function renderCourses() {
    const grid = document.getElementById("coursesGrid")
    if(!grid) return;

    grid.innerHTML = courses.map(course => 
        `<div class="course-card">
            <div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-desc">${course.description}</p>
            </div>

            <div class="course-footer">
                <button class="app-btn primary w-100 manage-sessions-btn"
                data-course-id="${course.id}">
                    <i class="bi bi-gear-fill"></i>
                    Manage Sessions
                </button>
            </div>
        </div>`
    ).join("")

    document.querySelectorAll(".manage-sessions-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.dataset.courseId;
            localStorage.setItem("selectedCourseId", courseId);
            loadPage("sessions")
        })
    })
}

function renderSessions() {
    const courseId = localStorage.getItem("selectedCourseId");
    const info = document.getElementById("sessionsCourseInfo");
    if (!info) return;

    const course = courses.find(c => c.id === courseId);
    info.textContent = course ? `Course: ${course.title} (${course.id})` : "No course selected.";
}