const paymentForm = document.getElementById("paymentForm");

paymentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    let isValid = true;

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("methodError").textContent = "";

    if (fullName.length < 3) {
        document.getElementById("nameError").textContent = "Full name must be at least 3 characters.";
        isValid = false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("emailError").textContent = "Invalid email address.";
        isValid = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone number must be 10 digits.";
        isValid = false;
    }

    if (paymentMethod === "") {
        document.getElementById("methodError").textContent = "Please select a payment method.";
        isValid = false;
    }

    if (isValid) {
        alert("Payment successful!");
        window.location.href = "my_learning.html";
    }
});