import { courseRender, LoadCourseToForm } from "./courses.js"
import { renderInstructor, setupAddingInstructor, setupEdittingInstructor } from "./instructors.js"

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
            courseRender();
        }

        if(pageName === "editting_courses"){
            const selectedCourseId = JSON.parse(localStorage.getItem("selectedCourseId"))
            LoadCourseToForm(selectedCourseId)
        }

        if(pageName === "instructors"){
            const instructors = JSON.parse(localStorage.getItem("instructors"))
            renderInstructor(instructors)
            
            const inputSearch = document.getElementById("instructorSearch")
            inputSearch.addEventListener("input", () => {
                const instructorList = JSON.parse(localStorage.getItem("instructors"))
                const input = inputSearch.value.toLowerCase()
                const filteredInstructor = instructorList.filter(i => i.id.toLowerCase().includes(input) || i.name.toLowerCase().includes(input)
                                                                || i.email.toLowerCase().includes(input) || i.phone.toLowerCase().includes(input))

                renderInstructor(filteredInstructor)
            })
        }

        if(pageName === "add_instructors"){
            setupAddingInstructor()
        }

        if(pageName === "editting_instructors"){
            const selectedInstructorId = JSON.parse(localStorage.getItem("selectedInstructorId"))
            setupEdittingInstructor(selectedInstructorId)
        }
    }catch(error){
        console.log(error);
        pageContainer.innerHTML = "<h4>Page not found</h4>";
    }
}

loadPage("courses")