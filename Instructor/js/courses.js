import { loadPage } from "./app.js";
import api from "../../axios/axios.js"
import { formatDate } from "../../utils/DateFormatUtils.js";
import { renderStars} from "../../utils/RenderRatingStar.js"
import { renderPagination } from "../../utils/RenderPagination.js";
import { renderFilteredCourses } from "../../utils/RenderFilteredCourses.js";
import { renderSuggestions } from "../../utils/RenderSuggestion.js";

let allCourses = [];

export function selectCourseFromSearch(courseId) {
    const selected = allCourses.find(c => c.id == courseId);
    if (!selected) return;
    renderFilteredCourses([selected]);
    document.getElementById("suggestions").style.display = "none";
}

async function loadCourseEarnings(courseId) {
     try {
        const res = await api.get(`/courses/${courseId}/earnings`);
        const data = res.data;
        document.getElementById("totalSubscribers").textContent = data.total_subscribers || 0;
        document.getElementById("totalEarned").textContent = (data.total_earned || 0).toFixed(2);
    } catch (err) {
        console.error(err);
    }
}

function setupCourseSearch() {
    const searchInput = document.getElementById("courseSearch");
    const suggestionsBox = document.getElementById("suggestions");

    if (!searchInput) return; 

    searchInput.addEventListener("input", async () => {
        const keyword = searchInput.value.trim();

        if (!keyword) {
            suggestionsBox.innerHTML = "";
            suggestionsBox.style.display = "none";
            renderFilteredCourses(allCourses); 
            return;
        }
        try {
            const res = await api.get(`/courses/search?q=${keyword}`);
            const results = res.data || [];

            renderSuggestions(results);
        } catch (err) {
            console.error(err);
        }
    });
}

function renderFeedbacks(feedbacks) {
    const list = document.getElementById("feedbackList")
    const avgBox = document.getElementById("avgRating")
    if (!feedbacks.length) {
        list.innerHTML = "<p>No feedback yet</p>"
        avgBox.innerHTML = ""
        return
    }

    const avg = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length

    avgBox.innerHTML =
        `
        <div class="mb-2">
            ${renderStars(avg)}
            <span>(${avg.toFixed(1)} / 5)</span>
        </div>
    `

    list.innerHTML = feedbacks.map(f =>
        `
            <div class="feedback-item">
                <div class="feedback-stars">
                    ${renderStars(f.rating)}
                </div>

                <p class="feedback-comment">
                    ${f.comment}
                </p>

                <small class="feedback-author">
                    By ${f.learnerName} - ${formatDate(f.createdAt)}
                </small>
            </div>
    `).join("")
}

async function loadFeedbacks(courseId, page = 1) {
    try {
        const feedbacks = await api.get(`/courses/${courseId}/feedbacks?page=${page}`)
        renderFeedbacks(feedbacks.data)
        renderPagination(courseId, page)
    } catch (err) {
        console.error(err)
        alert("Failed to load feedbacks")
    }
}

export async function renderCourses() {
    const grid = document.getElementById("coursesGrid")

    const loginUser = JSON.parse(localStorage.getItem("loginUser"))

    const res = await api.get(`/instructor/${loginUser.Instructor_ID}/courses`)
    const courses = await res.data || []

    allCourses = courses
    renderFilteredCourses(courses)
    setupCourseSearch()
}

export function setupAddingCourses() {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const loginUser = JSON.parse(localStorage.getItem("loginUser"))

        const title = document.getElementById("courseTitle").value.trim();
        const objective = document.getElementById("courseObjective").value.trim()
        const description = document.getElementById("courseDesc").value.trim();
        const price = document.getElementById("coursePrice").value.trim();
        const status = document.getElementById("courseStatus").value

        if (!title || !objective || !description || !price) {
            alert("Please fill all fields.");
            return;
        }

        const newCourse = {
            courseName: title,
            overview: description,
            objective: objective,
            fee: price,
            status: status,
            instructorId: loginUser.Instructor_ID
        }

        try {
            await api.post("/courses", newCourse)
            alert("Course created successfully!")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Failed to create course")
        }
    })
}

export function setupEditCourse() {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    const course = JSON.parse(localStorage.getItem("selectedCourse"))

    document.getElementById("courseTitle").value = course.title
    document.getElementById("courseObjective").value = course.objective
    document.getElementById("courseDesc").value = course.overview
    document.getElementById("coursePrice").value = course.fee
    document.getElementById("courseStatus").value = course.status

    loadFeedbacks(course.id)
    loadCourseEarnings(course.id)

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const updatedCourse = {
            courseName: document.getElementById("courseTitle").value.trim(),
            objective: document.getElementById("courseObjective").value.trim(),
            overview: document.getElementById("courseDesc").value.trim(),
            fee: document.getElementById("coursePrice").value,
            status: document.getElementById("courseStatus").value
        }

        try {
            await api.put(`/courses/${course.id}`, updatedCourse)
            alert("Course updated successfully")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Update failed")
        } finally {
            localStorage.removeItem("selectedCourse")
        }
    })
}
