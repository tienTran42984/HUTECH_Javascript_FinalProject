import { loadPage } from "./app.js";
import api from "../../axios/axios.js"

export async function renderSessions() {
    const text = document.getElementById("sessionsForText");
    const sessionsBody = document.getElementById("sessionsBody");
    const addSessionBtn = document.getElementById("addSessionBtn");
    const backBtn = document.getElementById("backToCoursesBtn");

    const course = JSON.parse(localStorage.getItem("selectedCourse"));

    if (!text) return;
    text.textContent = course ? `Sessions for course: ${course.title}` : "No course selected";

    const res = await api.get(`/courses/${course.id}/sessions`)
    const sessions = await res.data || [];

    sessionsBody.innerHTML = sessions.map((s, index) =>
        `
        <tr>
            <td>${index + 1}</td>
            <td>${s.sessionTitle}</td>
            <td>
                 <button class="action-btn video preview-video-btn"
                    data-video="${s.sessionVideo}">
                    <i class="bi bi-play-circle"></i>
                    Preview Video
                </button>
            </td>
            <td>
                <button class="action-btn pdf preview-pdf-btn"
                    data-pdf="${s.sessionDocument}">
                    <i class="bi bi-file-earmark-pdf"></i>
                    Preview PDF
                </button>
            </td>
            <td>
                <div class="session-actions">
                    <button class="mini-btn edit edit-session-btn"
                        data-session-id="${s.sessionId}"
                        data-course-id="${s.courseId}">
                        <i class="bi bi-pencil-square"></i>
                        Edit
                    </button>

                    <button class="mini-btn exercise exercise-session-btn"
                        data-session-id="${s.sessionId}"
                        data-course-id="${s.courseId}">
                        <i class="bi bi-journal-text"></i>
                        Exercises
                    </button>

                    <button class="mini-btn delete delete-session-btn"
                        data-session-id="${s.sessionId}"
                        data-course-id="${s.courseId}">
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
            const pdfPath = btn.dataset.pdf
            if (!pdfPath) {
                alert("No PDF available for this session.");
                return;
            }
            window.open(`http://localhost:5000/${pdfPath}`, "_blank")
        })
    })

    document.querySelectorAll(".preview-video-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const videoPath = btn.dataset.video
            if (!videoPath) {
                alert("No video available for this session.");
                return;
            }
            window.open(`http://localhost:5000/${videoPath}`, "_blank")
        })
    })

    document.querySelectorAll(".delete-session-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const ok = confirm("Delete session " + btn.dataset.sessionId + "?");
            const sessionId = btn.dataset.sessionId
            const courseId = btn.dataset.courseId
            if (!ok) return

            try {
                await api.delete(`/courses/${courseId}/sessions/${sessionId}`)
                alert("Session deleted successfully")
                loadPage("sessions")
            } catch (err) {
                console.log(err)
                alert("Delete session failed")
            }
        })
    })

    document.querySelectorAll(".edit-session-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionNo = btn.dataset.sessionId
            const course = JSON.parse(localStorage.getItem("selectedCourse"))
            const session = sessions.find(s => s.sessionId === sessionNo && s.courseId === course.id)

            localStorage.setItem("editingSession", JSON.stringify(session))
            loadPage("edit_sessions")
        })
    })

    document.querySelectorAll(".exercise-session-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionId = btn.dataset.sessionId;
            const courseId = btn.dataset.courseId
            localStorage.setItem("selectedSession", JSON.stringify({ sessionId, courseId }))
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

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const course = JSON.parse(localStorage.getItem("selectedCourse"))

        const title = document.getElementById("sessionTitle").value
        const videoFile = document.getElementById("videoFile").files[0]
        const pdfFile = document.getElementById("pdfFile").files[0]

        if (!videoFile || !pdfFile) {
            alert("Please upload both MP4 and PDF.");
            return;
        }

        if (!title) {
            alert("Please fill in the title");
            return;
        }

        const formData = new FormData()

        formData.append("title", title)
        formData.append("video", videoFile)
        formData.append("pdf", pdfFile)

        try {
            await api.post(`/courses/${course.id}/sessions`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            alert("Session added successfully")
            form.reset()
            loadPage("sessions")
        } catch (err) {
            console.log(err)
            alert("Adding session failed")
        }
    })
}

export function setupEditSession() {
    const form = document.getElementById("editSessionForm")
    const titleInput = document.getElementById("sessionTitle")
    const videoPreview = document.getElementById("videoPreview")
    const videoEmpty = document.getElementById("videoEmptyText")
    const viewPdfBtn = document.getElementById("previewPdf");
    const newVideo = document.getElementById("videoFile");
    const newPdf = document.getElementById("pdfFile")

    const session = JSON.parse(localStorage.getItem("editingSession"))
    console.log(session)
    console.log(session.videoUrl);

    titleInput.value = session.sessionTitle

    if (session.sessionVideo) {
        videoPreview.src = `http://localhost:5000/${session.sessionVideo}`
        videoPreview.style.display = "block"
        videoEmpty.style.display = "none"
    }

    viewPdfBtn.addEventListener("click", () => {
        window.open(`http://localhost:5000/${session.sessionDocument}`, "_blank")
    })

    newVideo.addEventListener("change", () => {
        const file = newVideo.files[0]

        const url = URL.createObjectURL(file)
        videoPreview.src = url
        videoPreview.style.display = "block";
        videoEmpty.style.display = "none";
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const title = titleInput.value;
        const videoFile = newVideo.files[0]
        const pdfFile = newPdf.files[0]
        const formData = new FormData()

        formData.append("title", title)
        if (videoFile) {
            formData.append("video", videoFile)
        }
        if (pdfFile) {
            formData.append("pdf", pdfFile)
        }

        try {
            await api.put(`/courses/${session.courseId}/sessions/${session.sessionId}`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            alert("Session updated successfully")
            loadPage("sessions")
        } catch (err) {
            console.log(err)
            alert("Updating session failed")
        }
    })
}