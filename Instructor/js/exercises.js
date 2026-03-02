import { loadPage } from "./app.js";

export function renderExercise(){
    const text = document.getElementById("exerciseForText");
    const exerciseBody = document.getElementById("exerciseBody");
    const addExerciseBtn = document.getElementById("addExerciseBtn");
    const backBtn = document.getElementById("backToSessionBtn");

    const course = JSON.parse(localStorage.getItem("selectedCourse"));
    const session = JSON.parse(localStorage.getItem("selectedSession"));
    const exercises = JSON.parse(localStorage.getItem("exercises")) || [];

    text.textContent = `Exercises for Session ${session.sessionNo} of (${course.title})`;

    const sessionExercises = exercises.filter(e =>
        e.courseId === course.id && e.sessionNo === session.sessionNo
    );

    exerciseBody.innerHTML = sessionExercises.map((ex, index) => 
        `
            <tr>
                <td>${index+1}</td>
                <td>${ex.question}</td>
                <td>${ex.answer}</td>
                <td>
                    <button class="mini-btn delete delete-ex-btn"
                        data-exercise-no="${ex.exerciseNo}">
                        <i class="bi bi-trash"></i>
                        Delete
                    </button>
                </td>
            </tr>
        `
    ).join("")
    
    document.querySelectorAll(".delete-ex-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const exercise = JSON.parse(localStorage.getItem("exercises"))
            const ok = confirm("Delete session " + btn.dataset.exerciseNo + "?");

            if(ok){
                const exerciseNo = btn.dataset.exerciseNo
                const index = exercise.findIndex(e => e.exerciseNo === exerciseNo);
                exercise.splice(index, 1)
                localStorage.setItem("exercises", JSON.stringify(exercise))
                alert("Delete session successfully")
                loadPage("exercises");
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
            sessionNo: selectedSession.sessionNo,
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

        const allExercises = JSON.parse(localStorage.getItem("exercises")) || [];
        console.log(allExercises)
        const filtered = allExercises.filter(ex => ex.sessionNo !== selectedSession.sessionNo);
        console.log(filtered)

        const updated = [...filtered, ...exercise];
        console.log(updated)
        localStorage.setItem("exercises", JSON.stringify(updated));

        importResult.innerHTML = `
            <div class="alert-success">
                Imported <b>${exercise.length}</b> exercises for Session <b>${selectedSession.sessionNo}</b>.
            </div>
        `;
    })
}