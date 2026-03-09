const lessonList = document.getElementById("lessonList");
const completeBtn = document.getElementById("completeBtn");
const learningCourseId = Number(localStorage.getItem("learningCourseId"));

let enrolledCoursesData = getFromStorage("enrolledCourses");
let currentCourse = enrolledCoursesData.find(course => course.id === learningCourseId);

const lessons = [
    "Introduction",
    "Overview",
    "Core Concepts",
    "Practice",
    "Mini Quiz"
];

lessons.forEach((lesson, index) => {
    const li = document.createElement("li");
    li.className = "lesson-item";
    li.textContent = `${index + 1}. ${lesson}`;
    lessonList.appendChild(li);
});

completeBtn.addEventListener("click", () => {
    if (!currentCourse) return;

    currentCourse.progress += 20;
    if (currentCourse.progress > 100) currentCourse.progress = 100;

    enrolledCoursesData = enrolledCoursesData.map(course =>
        course.id === currentCourse.id ? currentCourse : course
    );

    saveToStorage("enrolledCourses", enrolledCoursesData);
    alert(`Progress updated to ${currentCourse.progress}%`);
});