import { loadPage } from "./app.js";
import api from "../../axios/axios.js"

export async function renderExercise() {
    const text = document.getElementById("exerciseForText");
    const exerciseBody = document.getElementById("exerciseBody");
    const addExerciseBtn = document.getElementById("addExerciseBtn");
    const backBtn = document.getElementById("backToSessionBtn");

    const course = JSON.parse(localStorage.getItem("selectedCourse"));
    const session = JSON.parse(localStorage.getItem("selectedSession"));

    text.textContent = `Exercises for Session ${session.sessionNo} of (${course.title})`;

    const res = await api.get(`/courses/${session.courseId}/sessions/${session.sessionId}/exercises`)
    const exercises = res.data || []

    exerciseBody.innerHTML = exercises.map((ex, index) =>
        `
            <tr>
                <td>${index + 1}</td>
                <td>${ex.Exercise_Question}</td>
                <td>${ex.Exercise_Answer}</td>
                <td>
                    <button class="mini-btn delete delete-ex-btn"
                        data-exercise-no="${ex.Exercise_Number}"
                        data-session-no="${ex.Session_ID}"
                        data-course-id="${ex.Course_ID}">
                        <i class="bi bi-trash"></i>
                        Delete
                    </button>
                </td>
            </tr>
        `
    ).join("")

    document.querySelectorAll(".delete-ex-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const ok = confirm("Delete session " + btn.dataset.exerciseNo + "?");
            if(!ok) return;

            try{
                const exerciseNo = btn.dataset.exerciseNo
                const sessionId = btn.dataset.sessionNo
                const courseId = btn.dataset.courseId

                await api.delete(`/courses/${courseId}/sessions/${sessionId}/exercises/${exerciseNo}`)
                loadPage("exercises")
            }catch(err){
                console.error(err)
                alert("Delete failed")
            }
            
        })
    })

    addExerciseBtn.addEventListener("click", () => {
        loadPage("add_exercises");
    })

    backBtn.addEventListener("click", () => {
        loadPage("sessions")
    })
}

export function setupExerciseImport() {
    const excelFile = document.getElementById("excelFile")
    const importBtn = document.getElementById("importExcelBtn")
    const importResult = document.getElementById("importResult")
    const backBtn = document.getElementById("backToExerciseBtn")

    const selectedSession = JSON.parse(localStorage.getItem("selectedSession"));

    backBtn.addEventListener("click", () => {
        loadPage("exercises")
    })

    importBtn.addEventListener("click", async () => {
        if (!excelFile.files.length) {
            alert("Please choose an Excel file first.");
            return;
        }

        const file = excelFile.files[0]

        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet -> JSON
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const exercise = rows.map((row, index) => ({
            exerciseNo: index + 1,
            sessionId: selectedSession.sessionId,
            courseId: selectedSession.courseId,

            question: row.Question?.trim() || "",
            optionA: row.Option_A?.trim() || "",
            optionB: row.Option_B?.trim() || "",
            optionC: row.Option_C?.trim() || "",
            optionD: row.Option_D?.trim() || "",
            answer: row.Answer?.trim() || ""
        }))

        const invalid = exercise.find(ex => !ex.question || !ex.answer);
        if (invalid) {
            alert("Some exercises are missing Question or Answer. Please check the template.");
            return;
        }

        await api.post(
            `/courses/${selectedSession.courseId}/sessions/${selectedSession.sessionId}/exercises/import`,
            { exercise }
        )

        importResult.innerHTML = `
            <div class="alert-success">
                Imported <b>${exercise.length}</b> exercises successfully
            </div> 
        `
    })
}