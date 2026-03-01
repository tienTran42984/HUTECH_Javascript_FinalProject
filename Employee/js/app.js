import { courseRender, LoadCourseToForm } from "./courses.js"
import { renderInstructor, setupAddingInstructor, setupEdittingInstructor } from "./instructors.js"
import { renderEmployee, setupAddingEmployee,setupEdittingEmployee } from "./employees.js"
import { renderRequests, applyFilter, setupEdittingRequest } from "./requests.js"

const menuItems = document.querySelectorAll(".menu-item")
const pageContainer = document.getElementById("pageContainer")
const pageTitle = document.getElementById("pageTitle")
const logoutBtn = document.getElementById("logoutBtn")
const userEmail = document.getElementById("userEmail")

const courses = JSON.parse(localStorage.getItem("courses"))

const loginUser = JSON.parse(localStorage.getItem("loginUser"))
const employee = JSON.parse(localStorage.getItem("employees")) || [];
const employeeDetail = employee.find(e => e.accountId === loginUser.id);

userEmail.textContent = employeeDetail.email

if(!loginUser){
    window.location.href = "../../General/pages/login.html"
}
if(loginUser.role !== "Employee" || loginUser.verified === false) {
    alert("Access denied!")
    window.location.href = "../../General/pages/login.html"
}

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
            requests: "Financial Requests"
        };
        pageTitle.textContent = titleMap[pageName] || "Dashboard";

        if(pageName === "courses"){
            courseRender(courses);
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

        if(pageName === "employees"){
            const employees = JSON.parse(localStorage.getItem("employees"))
            renderEmployee(employees)

            const inputSearch = document.getElementById("employeeSearch")
            inputSearch.addEventListener("input", () => {
                const employeeList = JSON.parse(localStorage.getItem("employees"))
                const input = inputSearch.value.toLowerCase()
                const filteredEmployee = employeeList.filter(e => e.id.toLowerCase().includes(input) || e.name.toLowerCase().includes(input)
                                                            || e.email.toLowerCase().includes(input) || e.phone.toLowerCase().includes(input)
                                                            || e.address.toLowerCase().includes(input))

                renderEmployee(filteredEmployee)
            })
        }

        if(pageName === "add_employees"){
            setupAddingEmployee()
        }

        if(pageName === "editting_employees"){
            const selectedEmployeeId = JSON.parse(localStorage.getItem("selectedEmployeeId"))
            setupEdittingEmployee(selectedEmployeeId)
        }

        if(pageName === "requests"){
            const requests = JSON.parse(localStorage.getItem("requests"))
            renderRequests(requests)

            document.getElementById("requestSearch").addEventListener("input", applyFilter);
            document.getElementById("requestStatus").addEventListener("change", applyFilter);
            document.getElementById("requestDate").addEventListener("change", applyFilter);

        }

        if(pageName === "editting_requests"){
            const selectedRequestId = JSON.parse(localStorage.getItem("selectedRequestId"))
            setupEdittingRequest(selectedRequestId)
        }
    }catch(error){
        console.log(error);
        pageContainer.innerHTML = "<h4>Page not found</h4>";
    }
}

loadPage("courses")