import { renderStars } from "./RenderRatingStar.js";
import { loadPage } from "../Instructor/js/app.js";

export function renderFilteredCourses(courses) {
    const grid = document.getElementById("coursesGrid");
    grid.innerHTML = courses.map(course =>
        `<div class="course-card">
            <div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-desc">${course.overview}</p>
            </div>

            <div class="course-rating">
                ${course.total_reviews > 0 ? `${renderStars(course.avg_rating)}
                    <span>(${course.avg_rating}/5 - ${course.total_reviews} reviews)</span>`
                : `<span>No ratings yet</span>`}
            </div>

            <div class="course-footer">
                <button class="app-btn secondary w-100 edit-course-btn mb-2"
                    data-course-id="${course.id}">
                    Edit Course
                </button>

                <button class="app-btn primary w-100 manage-sessions-btn"
                    data-course-id="${course.id}">
                    Manage Sessions
                </button>
            </div>
        </div>`
    ).join("");

    attachCourseEvents(courses);
}

function attachCourseEvents(courses) {
    document.querySelectorAll(".manage-sessions-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.dataset.courseId;
            const course = courses.find(c => c.id == courseId);

            localStorage.setItem("selectedCourse", JSON.stringify(course));
            loadPage("sessions");
        });
    });

    document.querySelectorAll(".edit-course-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.dataset.courseId;
            const course = courses.find(c => c.id == courseId);

            localStorage.setItem("selectedCourse", JSON.stringify(course));
            loadPage("edit_courses");
        });
    });
}