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

const sessions = [
  {
    sessionNo: 1,
    courseId: "C001",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    sessionNo: 2,
    courseId: "C001",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    pdfUrl: "https://www.africau.edu/images/default/sample.pdf"
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
    const activeBtn = document.querySelector(`.nav-btn[data-page="${pageName}"]`);
    if (activeBtn) activeBtn.classList.add("active");

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

    if(!passwordForm) return;

    passwordForm.addEventListener("submit", (e) => {
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
            const course = courses.find(c => c.id === courseId);
            localStorage.setItem("selectedCourse", JSON.stringify(course));

            const TestCourse = JSON.parse(localStorage.getItem("selectedCourse"));
            alert(JSON.stringify(TestCourse, null, 2));

            loadPage("sessions")
        })
    })
}

function renderSessions() {
    const text = document.getElementById("sessionsForText");
    const sessionsBody = document.getElementById("sessionsBody");
    const course = JSON.parse(localStorage.getItem("selectedCourse"));
    const courseSessions = sessions.filter(s => s.courseId === course.id);

    if (!text) return;
    text.textContent = course ? `Sessions for course: ${course.title}` : "No course selected";

    sessionsBody.innerHTML = courseSessions.map(courseSession => 
        `
        <tr>
            <td>${courseSession.sessionNo}</td>
            <td>
                 <button class="action-btn video preview-video-btn"
                    data-session-id="${courseSession.sessionNo}">
                    <i class="bi bi-play-circle"></i>
                    Preview Video
                </button>
            </td>
            <td>
                <button class="action-btn pdf preview-pdf-btn"
                    data-session-id="${courseSession.sessionNo}">
                    <i class="bi bi-file-earmark-pdf"></i>
                    Preview PDF
                </button>
            </td>
            <td>
                <div class="session-actions">
                    <button class="mini-btn edit edit-session-btn"
                        data-session-id="${courseSession.sessionNo}">
                        <i class="bi bi-pencil-square"></i>
                        Edit
                    </button>

                    <button class="mini-btn exercise exercise-session-btn"
                        data-session-id="${courseSession.sessionNo}">
                        <i class="bi bi-journal-text"></i>
                        Exercises
                    </button>

                    <button class="mini-btn delete delete-session-btn"
                        data-session-id="${courseSession.sessionNo}">
                        <i class="bi bi-trash"></i>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
         `
    ).join("");

    document.querySelectorAll(".preview-pdf-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionNo = Number(btn.dataset.sessionId)
            console.log(sessionNo);
            const session = sessions.find(s => s.sessionNo === sessionNo)
            console.log(session);

            if (!session || !session.pdfUrl) {
                alert("No PDF available for this session.");
                return;
            }

            window.open(session.pdfUrl, "_blank")
        })
    })

    document.querySelectorAll(".preview-video-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionNo = Number(btn.dataset.sessionId)
            console.log(sessionNo)
            const session = sessions.find(s => s.sessionNo === sessionNo)
            console.log(session)

            if (!session || !session.videoUrl) {
                alert("No video available for this session.");
                return;
            }

            window.open(session.videoUrl, "_blank");
        })
    })

    document.querySelectorAll(".delete-session-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const ok = confirm("Delete session " + btn.dataset.sessionId + "?");
            const sessionNo = Number(btn.dataset.sessionId)

            if(ok){
                const index = sessions.findIndex(s => s.sessionNo === sessionNo);
                sessions.splice(index, 1)
                alert("Delete session successfully")
                loadPage("sessions");
            }
        })
    })
}