const courses = [
    {
        id: "C001",
        title: "Java Programming Basics",
        description: "Introductory Java course. Through this course you will learn essential knowledge about Java programming language.",
        price: 199,
        status: "Available"
    },
    {
        id: "C002",
        title: "Web Development with JavaScript",
        description: "Learn HTML, CSS, and JavaScript fundamentals.",
        price: 149,
        status: "Unavailable"
    },
    {
        id: "C003",
        title: "Database Fundamentals",
        description: "SQL basics and database design.",
        price: 129,
        status: "Available"
    }
];

export function courseRender(){
    const courseGrid = document.getElementById("courseGrid")

    courseGrid.innerHTML = courses.map(course => 
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

                <button class="update-btn">
                    <i class="bi bi-pencil-square"></i> Update
                </button>
            </div>
        `
    ).join("")

    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            alert("Update course");
        })
    })
}