import { courseRender, LoadCourseToForm } from "./courses.js"

const menuItems = document.querySelectorAll(".menu-item")
const pageContainer = document.getElementById("pageContainer")
const pageTitle = document.getElementById("pageTitle")
const logoutBtn = document.getElementById("logoutBtn")

const courses = JSON.parse(localStorage.getItem("courses"))

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

export async function loadPage(pageName){
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
            courseRender(courses);
        }

        if(pageName === "editting_courses"){
            const selectedCourseId = JSON.parse(localStorage.getItem("selectedCourseId"))
            LoadCourseToForm(selectedCourseId)
        }
    }catch(error){
        console.log(error);
        pageContainer.innerHTML = "<h4>Page not found</h4>";
    }
}

loadPage("courses")