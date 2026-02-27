import { loadPage } from "./app.js";

const courses = [
  {
    id: "C001",
    title: "Java Programming Basics",
    description: "Introductory Java course. Through this course you will learn essential knowledge about Java programming language",
    price: 120
  },
  {
    id: "C002",
    title: "Web Development with JavaScript",
    description: "Learn HTML, CSS, and JavaScript fundamentals.",
    price: 130
  },
  {
    id: "C003",
    title: "Database Fundamentals",
    description: "SQL basics and database design.",
    price: 200
  },
  {
    id: "C004",
    title: "Classic Art Analysis",
    description: "This course is everything you need to know about classic arts. Including a new way to behold them.",
    price: 100
  }
];

function generateNextCourseId(){
  if(courses.length === 0) return "C001";

  const maxNum = Math.max(...courses.map(c => Number(c.id.replace("C", ""))));

  return "C" + String(maxNum + 1).padStart(3, "0");
}

export function renderCourses() {
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

export function setupAddingCourses() {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const title = document.getElementById("courseTitle").value.trim();
        const description = document.getElementById("courseDesc").value.trim();
        const price = document.getElementById("coursePrice").value.trim();

        if(!title || !description || !price){
            alert("Please fill all fields.");
            return;
        }

        const newCourseId = generateNextCourseId()
        const newCourse = {
            id: newCourseId,
            title: title,
            description: description,
            price: price
        }
        courses.push(newCourse)

        alert("Course added!");
        loadPage("courses");
    })
}
