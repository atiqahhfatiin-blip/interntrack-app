/* ==========================================
   InternTrack - Shared Logic (main.js)
   Used by all pages after login:
   page protection, navbar, footer, dark mode,
   back-to-top button and toast messages
   ========================================== */

// ---------- Page protection ----------
// If not logged in, send back to the login page
if (sessionStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

// ---------- Apply saved theme right away (avoids a white flash) ----------
try {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
} catch (error) {
  console.error("Could not read theme:", error);
}

// ---------- Logout ----------
function logout() {
  sessionStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

// ---------- Navbar ----------
function buildNavbar(activePage) {
  // Add the "active" class to the link of the current page
  function active(name) {
    return activePage === name ? " active" : "";
  }

  return (
    '<nav class="navbar navbar-expand-lg navbar-dark app-navbar">' +
      '<div class="container">' +
        '<a class="navbar-brand d-flex align-items-center" href="dashboard.html">' +
          '<img src="images/logo.svg" alt="InternTrack logo" width="32" height="32" class="me-2">' +
          'InternTrack' +
        '</a>' +

        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" ' +
                'data-bs-target="#navMenu" aria-controls="navMenu" ' +
                'aria-expanded="false" aria-label="Toggle navigation">' +
          '<span class="navbar-toggler-icon"></span>' +
        '</button>' +

        '<div class="collapse navbar-collapse" id="navMenu">' +
          '<ul class="navbar-nav ms-auto align-items-lg-center">' +
            '<li class="nav-item"><a class="nav-link' + active("dashboard") + '" href="dashboard.html"><i class="bi bi-speedometer2 me-1"></i>Dashboard</a></li>' +
            '<li class="nav-item"><a class="nav-link' + active("applications") + '" href="applications.html"><i class="bi bi-card-checklist me-1"></i>Applications</a></li>' +
            '<li class="nav-item"><a class="nav-link' + active("companies") + '" href="companies.html"><i class="bi bi-building me-1"></i>Companies</a></li>' +

            // Dark mode button
            '<li class="nav-item ms-lg-3 my-2 my-lg-0">' +
              '<button class="btn btn-outline-light btn-sm" id="themeToggle" type="button" aria-label="Toggle dark mode">' +
                '<i class="bi bi-moon-stars-fill" id="themeIcon"></i>' +
              '</button>' +
            '</li>' +

            // Profile dropdown
            '<li class="nav-item dropdown ms-lg-2">' +
              '<button class="btn btn-outline-light btn-sm d-flex align-items-center" type="button" ' +
                      'data-bs-toggle="dropdown" aria-expanded="false">' +
                '<span class="avatar me-2">S</span>Student' +
              '</button>' +
              '<ul class="dropdown-menu dropdown-menu-end">' +
                '<li><h6 class="dropdown-header">Signed in as student</h6></li>' +
                '<li><hr class="dropdown-divider"></li>' +
                '<li><button class="dropdown-item" type="button" onclick="logout()">' +
                  '<i class="bi bi-box-arrow-right me-2"></i>Logout</button></li>' +
              '</ul>' +
            '</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</nav>'
  );
}

// ---------- Footer ----------
function buildFooter() {
  return (
    '<footer class="app-footer pt-4">' +
      '<div class="container">' +
        '<div class="row g-4">' +

          '<div class="col-12 col-md-5">' +
            '<h2 class="h5 text-white d-flex align-items-center">' +
              '<img src="images/logo.svg" alt="" width="28" height="28" class="me-2">InternTrack' +
            '</h2>' +
            '<p class="small mb-0">A simple tracker for internship applications, built as a prototype ' +
            'for the IMS566 individual project.</p>' +
          '</div>' +

          '<div class="col-6 col-md-3">' +
            '<h3 class="h6 text-white">Quick Links</h3>' +
            '<ul class="list-unstyled small footer-links mb-0">' +
              '<li><a href="dashboard.html">Dashboard</a></li>' +
              '<li><a href="applications.html">Applications</a></li>' +
              '<li><a href="companies.html">Companies</a></li>' +
            '</ul>' +
          '</div>' +

          '<div class="col-6 col-md-4">' +
            '<h3 class="h6 text-white">Contact</h3>' +
            '<ul class="list-unstyled small footer-links mb-0">' +
              '<li><i class="bi bi-envelope me-2"></i>student@interntrack.example</li>' +
              '<li><i class="bi bi-geo-alt me-2"></i>Malaysia</li>' +
              '<li><i class="bi bi-mortarboard me-2"></i>Universiti Teknologi MARA</li>' +
            '</ul>' +
          '</div>' +

        '</div>' +
        '<hr class="footer-line">' +
        '<p class="text-center small pb-3 mb-0">&copy; ' + new Date().getFullYear() +
        ' InternTrack. IMS566 Individual Project. All rights reserved.</p>' +
      '</div>' +
    '</footer>'
  );
}

// ---------- Dark mode toggle ----------
function setupThemeToggle() {
  const button = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");

  // Show a sun in dark mode and a moon in light mode
  function updateIcon() {
    const isDark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  }
  updateIcon();

  button.addEventListener("click", function () {
    const isDark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);

    try {
      localStorage.setItem("theme", next);
    } catch (error) {
      console.error("Could not save theme:", error);
    }
    updateIcon();

    // Charts only pick up new colours when the page is reloaded
    if (document.querySelector("canvas")) {
      window.location.reload();
    }
  });
}

// ---------- Back to top button ----------
function setupBackToTop() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-primary back-to-top";
  button.setAttribute("aria-label", "Back to top");
  button.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(button);

  // Show the button only after scrolling down a little
  window.addEventListener("scroll", function () {
    button.classList.toggle("show", window.scrollY > 300);
  });

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- Toast message (small popup at the top right) ----------
// type can be: success, danger, warning, info
function showToast(message, type) {
  const colour = type || "success";

  // Create the toast container once
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container position-fixed end-0 p-3";
    container.style.top = "60px";
    container.style.zIndex = "1100";
    document.body.appendChild(container);
  }

  // Build one toast
  const toastEl = document.createElement("div");
  toastEl.className = "toast align-items-center text-bg-" + colour + " border-0";
  toastEl.setAttribute("role", "alert");
  toastEl.innerHTML =
    '<div class="d-flex">' +
      '<div class="toast-body"></div>' +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" ' +
      'data-bs-dismiss="toast" aria-label="Close"></button>' +
    '</div>';
  toastEl.querySelector(".toast-body").textContent = message;
  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();

  // Remove it from the page after it hides
  toastEl.addEventListener("hidden.bs.toast", function () {
    toastEl.remove();
  });
}

// ---------- Build the shared parts when the page is ready ----------
document.addEventListener("DOMContentLoaded", function () {
  const page = document.body.getAttribute("data-page");

  document.getElementById("navbar").innerHTML = buildNavbar(page);
  document.getElementById("footer").innerHTML = buildFooter();

  setupThemeToggle();
  setupBackToTop();
});