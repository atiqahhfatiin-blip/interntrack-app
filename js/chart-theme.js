/* ==========================================
   InternTrack - Chart Theme (chart-theme.js)
   Makes chart text readable in dark mode.
   Must load after Chart.js and before dashboard.js
   ========================================== */

const darkModeOn = document.documentElement.getAttribute("data-bs-theme") === "dark";

Chart.defaults.color = darkModeOn ? "#cbd5e1" : "#495057";
Chart.defaults.borderColor = darkModeOn ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";