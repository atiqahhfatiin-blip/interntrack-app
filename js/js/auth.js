/* ==========================================
   InternTrack - Login Logic (auth.js)
   ========================================== */

// Hardcoded credentials (simulated login, no database)
const VALID_USERNAME = "student";
const VALID_PASSWORD = "1234";

// Get elements from the login page
const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const demoBtn = document.getElementById("demoBtn");
const togglePassword = document.getElementById("togglePassword");
const toggleIcon = document.getElementById("toggleIcon");

// If the user is already logged in, go straight to the dashboard
if (sessionStorage.getItem("loggedIn") === "true") {
  window.location.href = "dashboard.html";
}

// Run when the Login button is clicked
loginForm.addEventListener("submit", function (event) {
  // Stop the page from refreshing
  event.preventDefault();

  // Read what the user typed
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Compare with the hardcoded credentials
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    // Correct: save a login flag and go to dashboard
    sessionStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    // Wrong: show the red error message
    errorMsg.classList.remove("d-none");
  }
});

// Hide the error message again when the user starts typing
usernameInput.addEventListener("input", function () {
  errorMsg.classList.add("d-none");
});
passwordInput.addEventListener("input", function () {
  errorMsg.classList.add("d-none");
});

// "Use demo account" button fills in the form automatically
demoBtn.addEventListener("click", function () {
  usernameInput.value = VALID_USERNAME;
  passwordInput.value = VALID_PASSWORD;
  errorMsg.classList.add("d-none");
});

// Eye button shows or hides the password
togglePassword.addEventListener("click", function () {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleIcon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";
});