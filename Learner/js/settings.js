const settingsForm = document.getElementById("settingsForm");
const darkModeToggle = document.getElementById("darkModeToggle");

window.addEventListener("DOMContentLoaded", function () {
    const profile = JSON.parse(localStorage.getItem("learnerProfile")) || {};

    document.getElementById("learnerName").value = profile.name || "";
    document.getElementById("learnerEmail").value = profile.email || "";
    document.getElementById("avatarUrl").value = profile.avatar || "";
    darkModeToggle.checked = profile.darkMode || false;

    if (profile.darkMode) {
        document.body.classList.add("dark-mode");
    }
});

darkModeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
});

settingsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const profile = {
        name: document.getElementById("learnerName").value.trim(),
        email: document.getElementById("learnerEmail").value.trim(),
        avatar: document.getElementById("avatarUrl").value.trim(),
        darkMode: darkModeToggle.checked
    };

    localStorage.setItem("learnerProfile", JSON.stringify(profile));
    alert("Settings saved successfully!");
});