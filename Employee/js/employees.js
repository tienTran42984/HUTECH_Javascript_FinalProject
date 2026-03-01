import { loadPage } from "./app.js";

const employees = [
    {
        id: "EMP-001",
        name: "Sung Lam",
        email: "sungLam@gmail.com",
        phone: "+1 (555) 839-482",
        gender: "Male",
        address: "492 Local Street",
        dob: "2022-02-24",
        accountId: 3
    },
]

localStorage.setItem("employees", JSON.stringify(employees));

export function renderEmployee(employeeList){
    const tableBody = document.getElementById("employeeTable")
    const addEmployeeBtn = document.getElementById("addEmployeeBtn")

    tableBody.innerHTML = employeeList.map(employee => 
        `
            <tr>
                <td>
                    <div class="instructor-row">
                        <div class="avatar">
                            ${employee.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <div>${employee.name}</div>
                            <small style="color:#888;">ID: ${employee.id}</small>
                        </div>
                    </div>
                </td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td>${employee.dob}</td>
                <td>${employee.gender}</td>               
                <td>${employee.address}</td>  
                <td>
                    <button class="update-btn" data-employee-id="${employee.id}">Update</button>
                </td>
            </tr>
        `
    ).join("")

    addEmployeeBtn.addEventListener("click", () => {
        loadPage("add_employees")
    })

    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedEmployeeId = btn.dataset.employeeId
            localStorage.setItem("selectedEmployeeId", JSON.stringify(selectedEmployeeId))
            loadPage("editting_employees")
        })
    })
}

export function setupAddingEmployee(){
    const form = document.getElementById("addEmployeeForm")

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        const accounts = JSON.parse(localStorage.getItem("users")) || [];

        const name = document.getElementById("insName").value
        const email = document.getElementById("insEmail").value
        const phone = document.getElementById("insPhone").value
        const gender = document.getElementById("insGender").value
        const dob = document.getElementById("insDob").value
        const address = document.getElementById("insAddress").value

        const existingAccount = accounts.find(acc => acc.email === email);
        if (existingAccount) {
            alert("Email already exists in the system!");
            return;
        }

        const newEmployeeId = "EMP-" + String(employees.length + 1).padStart(3, "0");
        const newAccountId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;

        const newEmployee = {
            id: newEmployeeId,
            name,
            email,
            phone,
            gender,
            dob,
            address,
            accountId: newAccountId
        }

        const newAccount = {
            id: newAccountId,
            username: email.split("@")[0], // default username
            password: "Default@123", // default password
            verified: true,
            role: "Employee"
        };

        employees.push(newEmployee)
        accounts.push(newAccount)

        localStorage.setItem("employees", JSON.stringify(employees));
        localStorage.setItem("users", JSON.stringify(accounts));

        alert("Employee created successfully")
        form.reset()
        loadPage("employees")
    })
}

export function setupEdittingEmployee(id){
    const form = document.getElementById("addEmployeeForm")

    const employees = JSON.parse(localStorage.getItem("employees")) || []
    const account = JSON.parse(localStorage.getItem("users")) || []

    let selectedEmployee = employees.find(e => e.id === id)
    console.log(selectedEmployee)
    let selectedAccount = account.find(a => a.id === selectedEmployee.accountId);
    console.log(selectedAccount)

    document.getElementById("insName").value = selectedEmployee.name;
    document.getElementById("insEmail").value = selectedEmployee.email;
    document.getElementById("insPhone").value = selectedEmployee.phone;
    document.getElementById("insGender").value = selectedEmployee.gender; 
    document.getElementById("insDob").value = selectedEmployee.dob;
    document.getElementById("insAddress").value = selectedEmployee.address;

    document.getElementById("accUsername").value = selectedAccount.username;
    document.getElementById("accPassword").value = selectedAccount.password;
    document.getElementById("accRole").value = selectedAccount.role;
    document.getElementById("accountStatus").value = selectedAccount.verified;

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        const accounts = JSON.parse(localStorage.getItem("users")) || [];

        const name = document.getElementById("insName").value;
        const email = document.getElementById("insEmail").value;
        const phone = document.getElementById("insPhone").value;
        const gender = document.getElementById("insGender").value;
        const dob = document.getElementById("insDob").value
        const address = document.getElementById("insAddress").value;

        const username = document.getElementById("accUsername").value;
        const status = document.getElementById("accountStatus").value

        const empIndex = employees.findIndex(e => e.id === id);
        const accIndex = accounts.findIndex(a => a.id === selectedEmployee.accountId);

        employees[empIndex] = {
            ...employees[empIndex],
            name: name,
            email: email,
            phone: phone,
            gender: gender,
            dob: dob,
            address: address
        }

        accounts[accIndex] = {
            ...accounts[accIndex],
            username: username,
            verified: status
        }

        localStorage.setItem("employees", JSON.stringify(employees));
        localStorage.setItem("users", JSON.stringify(accounts));

        alert("Employees updated successfully!");
        loadPage("employees")
    })
}