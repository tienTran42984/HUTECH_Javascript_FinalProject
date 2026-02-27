import { loadPage } from "./app.js";

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

export function renderSessions() {
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

    document.querySelectorAll(".exercise-session-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionNo = Number(btn.dataset.sessionId);

            const session = sessions.find(s => s.sessionNo === sessionNo);
            localStorage.setItem("selectedSession", JSON.stringify(session));

            loadPage("exercises");
        });
    });

    addSessionBtn.addEventListener("click", () => {
        loadPage("add_sessions")
    })
}

export function setupAddingSession() {
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

export function setupEditSession(){
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