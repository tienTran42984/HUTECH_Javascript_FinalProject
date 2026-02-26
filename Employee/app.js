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

const menuItems = document.querySelectorAll(".menu-item")
const pageContainer = document.getElementById("pageContainer")
const pageTitle = document.getElementById("pageTitle")
const logoutBtn = document.getElementById("logoutBtn")

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        const pageName = item.dataset.page
        if(!pageName) return

        menuItems.forEach(i => i.classList.remove("active"))
        item.classList.add("active")

        loadPage(pageName)
    })
})

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loginUser");
    window.location.href = "../../General/pages/login.html";
});

async function loadPage(pageName){
    const pageContainer = document.getElementById("pageContainer")
    const pageTitle = document.getElementById("pageTitle")

    try{
        const res = await fetch(`${pageName}.html`)
        const html = await res.text()

        pageContainer.innerHTML = html;

        const titleMap = {
            courses: "Course Management",
            instructors: "Instructor Management",
            employees: "Employee Management",
            financialRequests: "Financial Requests"
        };
        pageTitle.textContent = titleMap[pageName] || "Dashboard";

        if(pageName === "courses"){
            courseRender();
        }
    }catch(error){
        console.log(error);
        pageContainer.innerHTML = "<h4>Page not found</h4>";
    }
}

loadPage("Dashboard")

function courseRender(){
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
                </div>dd

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