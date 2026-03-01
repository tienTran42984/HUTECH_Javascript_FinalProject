import { loadPage } from "./app.js"

const requests = [
    {
        id: "REQ-001",
        date: "2023-12-22",
        proof: "https://i.ebayimg.com/images/g/X20AAeSwEglonvFp/s-l400.jpg",
        status: "Processing",
        reason: "I am poor",
        background: "College",
        employement_status: "Student",
        amount: "10%",
        learnerId: "STD-001",
        courseId: "C001"
    }
]

localStorage.setItem("requests", JSON.stringify(requests))

function getLearnerName(learnerId) {
    const students = JSON.parse(localStorage.getItem("students")) || []
    const student = students.find(s => s.id === learnerId)
    console.log(student.name)

    return student.name
}

function getCourseName(courseId) {
    const courses = JSON.parse(localStorage.getItem("courses")) || []
    const course = courses.find(c => c.id === courseId)

    return course.title
}

function getCoursePrice(courseId) {
    const courses = JSON.parse(localStorage.getItem("courses")) || []
    const course = courses.find(c => c.id === courseId)

    return course.price
}

export function renderRequests(requestsList){
    const reqTable = document.getElementById("requestTable")

    reqTable.innerHTML = requestsList.map(request =>
        `
            <tr>
                <td>${request.id}</td>
                <td>${getLearnerName(request.learnerId)}</td>
                <td>${getCourseName(request.courseId)}</td>
                <td>${request.date}</td>
                <td>${request.amount}</td>
                <td>
                    <span class="status-badge ${request.status === "Approved" ? "status-available" : 
                                                request.status === "Processing" ? "status-pending" : "status-unavailable"
                    }">
                        ${request.status}
                    </span>
                </td>

                <td class="text-end">
                    <button data-request-id="${request.id}" class="btn btn-link text-dark p-0" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                </td>
            </tr>
        `
    ).join("")

    document.querySelectorAll(".btn-link").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedRequestId = btn.dataset.requestId
            localStorage.setItem("selectedRequestId", JSON.stringify(selectedRequestId))
            loadPage("editting_requests")
        })
    })
}

export function applyFilter(){
    const searchValue = document.getElementById("requestSearch").value.toLowerCase()
    const statusValue = document.getElementById("requestStatus").value
    const dateValue = document.getElementById("requestDate").value

    const requests = JSON.parse(localStorage.getItem("requests"))

    const filterRequest = requests.filter(request => {
        const learnerName = getLearnerName(request.learnerId).toLowerCase()
        const courseName = getCourseName(request.courseId).toLowerCase();
        const amount = request.amount.toLowerCase()

        const search = learnerName.includes(searchValue) || courseName.includes(searchValue) || amount.includes(searchValue)
        const status = statusValue === "" || request.status === statusValue;
        const date = dateValue === "" || request.date === dateValue;

        return search && status && date
    })

    renderRequests(filterRequest)
}

export function setupEdittingRequest(id){
    const form = document.getElementById("addRequestForm")
    
    const requests = JSON.parse(localStorage.getItem("requests")) || []

    let selectedRequest = requests.find(r => r.id === id)
    console.log(selectedRequest)
    const learnerName = getLearnerName(selectedRequest.learnerId)
    const courseTitle = getCourseName(selectedRequest.courseId)
    const coursePrice = getCoursePrice(selectedRequest.courseId)

    document.getElementById("requestId").value = selectedRequest.id
    document.getElementById("learnerName").value = learnerName
    document.getElementById("courseTitle").value = `${courseTitle} - ${coursePrice}$`
    document.getElementById("requestDate").value = selectedRequest.date
    document.getElementById("requestAmount").value = selectedRequest.amount
    document.getElementById("requestBackground").value = selectedRequest.background
    document.getElementById("requestEmployment").value = selectedRequest.employement_status
    document.getElementById("requestReason").value = selectedRequest.reason
    document.getElementById("requestProof").src = selectedRequest.proof
    document.getElementById("requestStatus").value = selectedRequest.status

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const requests = JSON.parse(localStorage.getItem("requests")) || [];

        const status = document.getElementById("requestStatus").value;

        const reqIndex = requests.findIndex(r => r.id === id);

        requests[reqIndex] = {
            ...requests[reqIndex],
            status: status
        }

        localStorage.setItem("requests", JSON.stringify(requests));

        alert("Request's status updated successfully!");
        loadPage("requests")
    })
}