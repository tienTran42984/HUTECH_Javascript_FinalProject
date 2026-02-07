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
        const addingCourseBtn = document.getElementById("addCourseBtn")
        addingCourseBtn.addEventListener("click", () => {
            loadPage("add_courses")
        })
    }

    if(pageName === "sessions"){
        renderSessions();
    }
    if(pageName === "add_sessions"){
        setupAddingSession()
    }

    if(pageName === "edit_sessions"){
        setupEditSession()
    }

    if(pageName === "add_courses"){
        setupAddingCourses()
    }
}

function generateNextCourseId(){
  if(courses.length === 0) return "C001";

  const maxNum = Math.max(...courses.map(c => Number(c.id.replace("C", ""))));

  return "C" + String(maxNum + 1).padStart(3, "0");
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

function setupAddingCourses() {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const title = document.getElementById("courseTitle").value.trim();
        const description = document.getElementById("courseDesc").value.trim();

        if(!title || !description){
            alert("Please fill all fields.");
            return;
        }

        const newCourseId = generateNextCourseId()
        const newCourse = {
            id: newCourseId,
            title: title,
            description: description
        }
        courses.push(newCourse)

        alert("Course added!");
        loadPage("courses");
    })
}

function renderCourses() {
    const grid = document.getElementById("coursesGrid")
    if(!grid) return;

    grid.innerHTML = filterCourse.map(course => 
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
    const addSessionBtn = document.getElementById("addSessionBtn");
    const course = JSON.parse(localStorage.getItem("selectedCourse"));
    const courseSessions = sessions.filter(s => s.courseId === course.id);
    const backBtn = document.getElementById("backToCoursesBtn");

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

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

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

    document.querySelectorAll(".edit-session-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionNo =  Number(btn.dataset.sessionId)
            const course = JSON.parse(localStorage.getItem("selectedCourse"))
            const session = sessions.find(s => s.sessionNo === sessionNo && s.courseId === course.id)

            localStorage.setItem("editingSession", JSON.stringify(session))
            loadPage("edit_sessions")
        })
    })

    addSessionBtn.addEventListener("click", () => {
        loadPage("add_sessions")
    })
}

function setupAddingSession() {
    const form = document.getElementById("addSessionForm")
    
    const videoInput = document.getElementById("videoFile")
    const videoPreview = document.getElementById("videoPreview")
    const videoEmpty = document.getElementById("videoEmptyText")

    videoInput.addEventListener("change", () => {
        const file = videoInput.files[0]

        const url = URL.createObjectURL(file)
        videoPreview.src = url
        videoPreview.style.display = "block";
        videoEmpty.style.display = "none";
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const course = JSON.parse(localStorage.getItem("selectedCourse"))
        const videoFile = document.getElementById("videoFile").files[0]
        const pdfFile = document.getElementById("pdfFile").files[0]

        if (!videoFile && !pdfFile) {
            alert("Please upload both MP4 and PDF.");
            return;
        }

        const courseSessions = sessions.filter(s => s.courseId === course.id);
        const nextSessionNo = courseSessions.length > 0 ? Math.max(...courseSessions.map(s => s.sessionNo)) + 1 : 1
        
        const newSession = {
            sessionNo: nextSessionNo,
            courseId: course.id,
            videoUrl: URL.createObjectURL(videoFile),
            pdfUrl: URL.createObjectURL(pdfFile)
        }

        sessions.push(newSession)
        alert(`Session ${newSession} added`);
        form.reset()
        loadPage("sessions")
    })
}

function setupEditSession(){
    const form = document.getElementById("editSessionForm")
    const videoPreview = document.getElementById("videoPreview")
    const videoEmpty = document.getElementById("videoEmptyText")
    const viewPdfBtn = document.getElementById("previewPdf");
    const newVideo = document.getElementById("videoFile");
    const newPdf = document.getElementById("pdfFile")

    const session = JSON.parse(localStorage.getItem("editingSession"))
    console.log(session)
    console.log(session.videoUrl);

    if(session.videoUrl){
        console.log(session.videoUrl);
        videoPreview.src = session.videoUrl
        videoPreview.style.display = "block"
        videoEmpty.style.display = "none"
    }

    viewPdfBtn.addEventListener("click", () => {
        window.open(session.pdfUrl, "_blank")
    })

    newVideo.addEventListener("change", () => {
        const file = newVideo.files[0]

        const url = URL.createObjectURL(file)
        videoPreview.src = url
        videoPreview.style.display = "block";
        videoEmpty.style.display = "none";
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const videoFile = newVideo.files[0]
        const pdfFile = newPdf.files[0]

        if (videoFile) session.videoUrl = URL.createObjectURL(videoFile)
        if (pdfFile) session.pdfUrl = URL.createObjectURL(pdfFile)

        const index = sessions.findIndex(s => s.sessionNo === session.sessionNo)
        if (index !== -1) sessions[index] = session

        alert("Session updated")
        loadPage("sessions")
    })

}