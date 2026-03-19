import api from "../../axios/axios.js"

export function setupAccountForm() {
    const passwordForm = document.getElementById("passwordForm");
    const nameDisplay = document.getElementById("nameDisplay");
    const emailDisplay = document.getElementById("emailDisplay");
    const phoneDisplay = document.getElementById("phoneDisplay");

    nameDisplay.value = loginUser.Account_Username;
    emailDisplay.value = loginUser.email;
    phoneDisplay.value = loginUser.phone;

    if(!passwordForm) return;

    passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const oldPass = document.getElementById("oldPass").value.trim();
        const newPass = document.getElementById("newPass").value.trim();
        const confirmPass = document.getElementById("confirmPass").value.trim();
        const success = document.getElementById("passSuccess");
        const error = document.getElementById("passError");

        if(newPass.length < 6){
            error.textContent = "Password must be at least 6 characters";
            error.style.display = "block";
            return;
        }

        if(newPass !== confirmPass){
            error.textContent = "Confirm password is not matched with entered password"
            error.style.display = "block"
            success.style.display = "none"
            return;
        }

        if(newPass.length < 6){
            error.textContent = "New password must be at least 6 characters."
            error.style.display = "block"
            return;
        }

        try{
            const loginUser = JSON.parse(localStorage.getItem("loginUser"));

            await api.post("/change-password", {
                accountNumber: loginUser.Account_Number,
                oldPassword: oldPass,
                newPassword: newPass
            })
            success.textContent = "Password updated successfully";
            success.style.display = "block";
            error.style.display = "none";

            passwordForm.reset();
        } catch(err){
            error.textContent = err.response.data.message;
            error.style.display = "block";
            success.style.display = "none";
        }
    })
}