const employees = [
    {
        id: "EMP-001",
        name: "Sung Lam",
        email: "sungLam@gmail.com",
        phone: "+1 (555) 839-482",
        gender: "Male",
        address: "492 Local Street",
        dob: "24/2/2022",
        accountId: 3
    },
]

localStorage.setItem("employees", JSON.stringify(employees));