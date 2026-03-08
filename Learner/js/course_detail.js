const courseDetail = document.getElementById("courseDetail");
const selectedCourseId = Number(localStorage.getItem("selectedCourseId"));
const course = coursesData.find(c => c.id === selectedCourseId);

function enrollCourse(courseId) {
    let enrolledCourses = getFromStorage("enrolledCourses");
    const alreadyEnrolled = enrolledCourses.some(item => item.id === courseId);

    if (alreadyEnrolled) {
        alert("You already enrolled in this course.");
        return;
    }

    const selected = coursesData.find(item => item.id === courseId);
    enrolledCourses.push({ ...selected, progress: 0 });
    saveToStorage("enrolledCourses", enrolledCourses);

    if (selected.price > 0) {
        window.location.href = "payment.html";
    } else {
        alert("Enroll successful!");
        window.location.href = "my_learning.html";
    }
}

if (course) {
    courseDetail.innerHTML = `
        <div class="page-header">
            <div>
                <h1>${course.title}</h1>
                <p>Learn with ${course.instructor} and improve your ${course.category.toLowerCase()} skills.</p>
            </div>
            <button class="btn btn-outline" onclick="history.back()">Back</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1.4fr; gap:24px;">
            <div class="card">
                <div class="course-thumb" style="height:220px; border-radius:18px;"></div>
                <div style="margin-top:18px;">
                    <p style="margin-bottom:10px;"><strong>Instructor:</strong> ${course.instructor}</p>
                    <p style="margin-bottom:10px;"><strong>Category:</strong> ${course.category}</p>
                    <p style="margin-bottom:10px;"><strong>Level:</strong> ${course.level}</p>
                    <p style="margin-bottom:10px;"><strong>Lessons:</strong> ${course.lessons}</p>
                    <p class="price" style="font-size:24px; margin:18px 0;">
                        ${course.price === 0 ? "Free" : course.price.toLocaleString("vi-VN") + " VND"}
                    </p>
                    <button class="btn btn-primary" style="width:100%;" onclick="enrollCourse(${course.id})">
                        ${course.price === 0 ? "Enroll Now" : "Buy Now"}
                    </button>
                </div>
            </div>

            <div class="card">
                <h2 class="section-title">About This Course</h2>
                <p style="color: var(--muted); margin-bottom: 22px;">
                    ${course.description}
                </p>

                <h2 class="section-title">What You Will Learn</h2>
                <div class="lesson-item active">Build practical skills through hands-on lessons</div>
                <div class="lesson-item">Understand core concepts clearly</div>
                <div class="lesson-item">Apply knowledge in mini exercises</div>
                <div class="lesson-item">Track progress lesson by lesson</div>
            </div>
        </div>
    `;
}