const myLearningList = document.getElementById("myLearningList");
const enrolledCourses = getFromStorage("enrolledCourses");

function renderMyCourses() {
    myLearningList.innerHTML = "";

    if (enrolledCourses.length === 0) {
        myLearningList.innerHTML = `<div class="card"><p>You have not enrolled in any courses yet.</p></div>`;
        return;
    }

    enrolledCourses.forEach(course => {
        const item = document.createElement("div");
        item.className = "course-card";

        item.innerHTML = `
            <div class="course-thumb">
                <span class="course-badge">${course.category}</span>
            </div>
            <div class="course-body">
                <h3>${course.title}</h3>
                <div class="course-meta">
                    <span>${course.lessons} lessons</span>
                    <span>${course.level}</span>
                </div>
                <p class="course-desc">Keep going to improve your skills step by step.</p>
                <div class="progress-wrap">
                    <div class="progress-bar" style="width:${course.progress}%"></div>
                </div>
                <div class="course-footer">
                    <span class="price">${course.progress}% completed</span>
                    <button class="btn btn-primary" onclick="goToSession(${course.id})">Continue</button>
                </div>
            </div>
        `;

        myLearningList.appendChild(item);
    });
}

function goToSession(courseId) {
    localStorage.setItem("learningCourseId", courseId);
    window.location.href = "session.html";
}

renderMyCourses();