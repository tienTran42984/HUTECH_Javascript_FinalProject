import { loadPage } from "./app.js"

const instructors = [
    {
        id: "INS-001",
        name: "Binh Nguyen",
        email: "binh.nguyen@university.edu",
        phone: "+1 (555) 123-4567",
        gender: "Male",
        accountId: 2
    },
]

localStorage.setItem("instructors", JSON.stringify(instructors))

export function renderInstructor(instructorList){
    const tableBody = document.getElementById("instructorTable")
    const addingInstructorBtn = document.getElementById("addInstructorBtn")

    tableBody.innerHTML = instructorList.map(instructor => 
        `
            <tr>
                <td>
                    <div class="instructor-row">
                        <div class="avatar">
                            ${instructor.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <div>${instructor.name}</div>
                            <small style="color:#888;">ID: ${instructor.id}</small>
                        </div>
                    </div>
                </td>
                <td>${instructor.email}</td>
                <td>${instructor.phone}</td>
                <td>${instructor.gender}</td>               
                <td>
                    <button class="update-btn" data-instructor-id="${instructor.id}">Update</button>
                </td>
            </tr>
        `
    ).join("")

    addingInstructorBtn.addEventListener("click", () => {
        loadPage("add_instructors")
    })

    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedInstructorId = btn.dataset.instructorId
            localStorage.setItem("selectedInstructorId", JSON.stringify(selectedInstructorId))
            loadPage("editting_instructors")
        })
    })
}

export function setupAddingInstructor(){
    const form = document.getElementById("addInstructorForm")

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const instructor = JSON.parse(localStorage.getItem("instructors")) || []
        const account = JSON.parse(localStorage.getItem("users")) || []

        const name = document.getElementById("insName").value;
        const email = document.getElementById("insEmail").value
        const phone = document.getElementById("insPhone").value;
        const gender = document.getElementById("insGender").value

        const newInstructorId = "INS-" + String(instructors.length + 1).padStart(3, "0");

        const newInstructor = {
            id: newInstructorId,
            name,
            email,
            phone,
            gender
        }

        instructor.push(newInstructor)
        localStorage.setItem("instructors", JSON.stringify(instructor))

        const newAccount = {
            id: account.length + 1,
            username: email.split("@")[0], // default username
            email: email,
            password: "Default@123", // default password
            phone: phone,
            verified: true,
            role: "Instructor"
        };

        account.push(newAccount)
        localStorage.setItem("users", JSON.stringify(account))

        alert("New instructor and account created")
        form.reset()
        loadPage("instructors")
    })
}

export function setupEdittingInstructor(id){
    const instructor = JSON.parse(localStorage.getItem("instructors")) || []
    console.log(instructor)
    const account = JSON.parse(localStorage.getItem("users")) || []
    console.log(account)

    const selectedInstructor = instructor.find(i => i.id === id)
    const selectedAccount = account.find(a => a.id === selectedInstructor.accountId);
    console.log(selectedAccount)

    document.getElementById("insName").value = selectedInstructor.name;
    document.getElementById("insEmail").value = selectedInstructor.email;
    document.getElementById("insPhone").value = selectedInstructor.phone;
    document.getElementById("insGender").value = selectedInstructor.gender; 

    document.getElementById("accUsername").value = selectedAccount.username;
    document.getElementById("accPassword").value = selectedAccount.password;
    document.getElementById("accRole").value = selectedAccount.role;
}