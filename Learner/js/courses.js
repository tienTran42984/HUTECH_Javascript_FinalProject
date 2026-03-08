const courseList = document.getElementById("courseList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

function renderCourses(courses) {
    courseList.innerHTML = "";

    if (courses.length === 0) {
        courseList.innerHTML = `
            <div class="card">
                <p>No courses found.</p>
            </div>
        `;
        return;
    }

    courses.forEach(function(course) {
        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
            <div class="course-thumb">
                <span class="course-badge">${course.category}</span>
            </div>
            <div class="course-body">
                <h3>${course.title}</h3>
                <div class="course-meta">
                    <span>${course.lessons} lessons</span>
                    <span>${course.level}</span>
                </div>
                <p class="course-desc">${course.description}</p>
                <div class="course-footer">
                    <span class="price">
                        ${course.price === 0 ? "Free" : course.price.toLocaleString("vi-VN") + " VND"}
                    </span>
                    <button class="btn btn-primary" onclick="viewCourse(${course.id})">View</button>
                </div>
            </div>
        `;

        courseList.appendChild(card);
    });
}

function filterCourses() {
    const keyword = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const price = priceFilter.value;

    const filtered = coursesData.filter(course => {
        const matchKeyword = course.title.toLowerCase().includes(keyword);
        const matchCategory = category === "all" || course.category === category;
        const matchPrice =
            price === "all" ||
            (price === "free" && course.price === 0) ||
            (price === "paid" && course.price > 0);

        return matchKeyword && matchCategory && matchPrice;
    });

    renderCourses(filtered);
}

function viewCourse(id) {
    localStorage.setItem("selectedCourseId", id);
    window.location.href = "course_detail.html";
}

searchInput.addEventListener("input", filterCourses);
categoryFilter.addEventListener("change", filterCourses);
priceFilter.addEventListener("change", filterCourses);

renderCourses(coursesData);