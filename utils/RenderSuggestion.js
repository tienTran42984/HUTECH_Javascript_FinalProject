import { selectCourseFromSearch } from "../Instructor/js/courses.js";

export function renderSuggestions(courses) {
    const suggestionsBox = document.getElementById("suggestions");

    if (!courses.length) {
        suggestionsBox.innerHTML = `<div class="suggestion-item">No results</div>`;
        suggestionsBox.style.display = "block";
        return;
    }

    suggestionsBox.innerHTML = courses.map(course => `
        <div class="suggestion-item" data-id="${course.id}">
            <strong>${course.title}</strong>
            <p>${course.overview}</p>
        </div>
    `).join("");

    suggestionsBox.style.display = "block";
    document.querySelectorAll(".suggestion-item").forEach(item => {
        item.addEventListener("click", () => {
            const courseId = item.dataset.id;
            selectCourseFromSearch(courseId);
        });
    });
}