import { loadPage } from "./app.js";

const courses = [
    {
        id: "C001",
        title: "Java Programming Basics",
        description: "Introductory Java course. Through this course you will learn essential knowledge about Java programming language.",
        price: 199,
        status: "Available",
        instructorId: "INS-001"
    },
    {
        id: "C002",
        title: "Web Development with JavaScript",
        description: "Learn HTML, CSS, and JavaScript fundamentals.",
        price: 149,
        status: "Unavailable",
        instructorId: "INS-001"
    },
    {
        id: "C003",
        title: "Database Fundamentals",
        description: "SQL basics and database design.",
        price: 129,
        status: "Available",
        instructorId: "INS-001"
    }
];

localStorage.setItem("courses", JSON.stringify(courses))

export function courseRender(courseList){
    const courseGrid = document.getElementById("courseGrid")
    const searchInput = document.getElementById("searchInput")

    courseGrid.innerHTML = courseList.map(course => 
        `
            <div class="course-card">
                <div>
                    <div class="course-title">${course.title}</div>
                    <div class="course-desc">${course.description}</div>
                    <div class="course-price">RM ${course.price}</div>
                    <span class="status-badge ${course.status === "Available" ? "status-available" : "status-unavailable"}">
                        ${course.status}
                    </span>
                </div>

                <div class="card-actions">
                    <button class="update-btn" data-course-id="${course.id}">
                        <i class="bi bi-pencil-square"></i> Update
                    </button>

                    ${course.status === "Unavailable" ? `<button class="delete-btn" data-course-id="${course.id}">
                                                            <i class="bi bi-trash"></i> Delete
                                                        </button>
                                                        ` : ""}
                </div>
            </div>
        `
    ).join("")

    searchInput.addEventListener("input", () => {
        const courseList = JSON.parse(localStorage.getItem("courses")) || []
        const input = searchInput.value.toLowerCase()

        const filteredCourses = courseList.filter(c => c.title.toLocaleLowerCase().includes(input) || c.id.toLocaleLowerCase().includes(input))
        courseRender(filteredCourses)
    })

    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedCourseId = btn.dataset.courseId
            localStorage.setItem("selectedCourseId", JSON.stringify(selectedCourseId))
            loadPage("editting_courses");
        })
    })

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const ok = confirm("Delete session " + btn.dataset.sessionId + "?");
            const deletedCourseId = btn.dataset.courseId

            if(ok){
                const index = courses.findIndex(c => c.id === deletedCourseId)
                courses.splice(index, 1)
                alert("Deleted course successfully");
                loadPage("courses")
            }

        })
    })
}

export function LoadCourseToForm(courseId){
    const editingForm = document.getElementById("addCourseForm")
    const courseTitle = document.getElementById("courseTitle")
    const courseDesc = document.getElementById("courseDesc")
    const coursePrice = document.getElementById("coursePrice")
    const courseStatus = document.getElementById("courseStatus")

    const selectedCourse = courses.find(c => c.id === courseId)

    courseTitle.value = selectedCourse.title;
    courseDesc.value = selectedCourse.description;
    coursePrice.value = selectedCourse.price;
    courseStatus.value = selectedCourse.status;

    editingForm.addEventListener("submit", (e) => {
        e.preventDefault()
        
        const updatedCourse = {
            id: courseId,
            title: document.getElementById("courseTitle").value,
            description: document.getElementById("courseDesc").value,
            price: document.getElementById("coursePrice").value,
            status: document.getElementById("courseStatus").value
        }

        const index = courses.findIndex(c => c.id === courseId);
        courses[index] = updatedCourse;

        alert(`Update course ${selectedCourse.title} successfully`)
        loadPage("courses")
    })

}