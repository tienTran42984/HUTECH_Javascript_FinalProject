export function setupAccountForm() {
    const passwordForm = document.getElementById("passwordForm");
    const nameDisplay = document.getElementById("nameDisplay");
    const emailDisplay = document.getElementById("emailDisplay");
    const phoneDisplay = document.getElementById("phoneDisplay");

    const loginUser = JSON.parse(localStorage.getItem("loginUser"))

    nameDisplay.value = loginUser.username;
    emailDisplay.value = loginUser.email;
    phoneDisplay.value = loginUser.phone;

    if(!passwordForm) return;

    passwordForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const oldPass = document.getElementById("oldPass").value.trim();
        const newPass = document.getElementById("newPass").value.trim();
        const confirmPass = document.getElementById("confirmPass").value.trim();
        const success = document.getElementById("passSuccess");
        const error = document.getElementById("passError");

        if(oldPass !== loginUser.password) {
            error.textContent = "Password is not matched"
            error.style.display = "block"
            success.style.display = "none"
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

        if (oldPass === newPass) {
            error.textContent = "New password must be different from old password."
            error.style.display = "block"
            success.style.display = "none"
            return
        }

        loginUser.password = newPass;
        success.style.display = "block"
        success.textContent = "Changing password successfully!!!"
        error.style.display = "none"
        localStorage.setItem("loginUser", JSON.stringify(loginUser));
        passwordForm.reset();
    })
}