/* ==========================================
   InternTrack - Dashboard Logic (dashboard.js)
   ========================================== */

// Count applications by status
function countByStatus(status) {
  return applications.filter(function (app) {
    return app.status === status;
  }).length;
}

// Make user text safe before putting it into the page
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Pick a Bootstrap colour for each status
function statusBadge(status) {
  const colours = {
    "Applied": "primary",
    "Interview": "warning",
    "Offered": "success",
    "Rejected": "danger"
  };
  return '<span class="badge text-bg-' + colours[status] + '">' + status + '</span>';
}

// ---------- Welcome banner ----------
// Greeting changes depending on the time of day
const hour = new Date().getHours();
let greeting = "Good evening";
if (hour < 12) {
  greeting = "Good morning";
} else if (hour < 18) {
  greeting = "Good afternoon";
}
document.getElementById("greetingText").textContent = greeting + ", Student!";

// Show today's date
document.getElementById("todayDate").textContent = new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

// Short summary sentence built from the data
document.getElementById("bannerSummary").textContent =
  "You have " + countByStatus("Interview") + " interviews lined up and " +
  countByStatus("Applied") + " applications waiting for a reply.";

// ---------- Summary cards ----------
document.getElementById("totalCount").textContent = applications.length;
document.getElementById("interviewCount").textContent = countByStatus("Interview");
document.getElementById("offerCount").textContent = countByStatus("Offered");
document.getElementById("rejectedCount").textContent = countByStatus("Rejected");

// ---------- Recent applications list ----------
// Sort a copy by date (newest first) and keep the first 5
const recentApplications = applications.slice().sort(function (a, b) {
  const byDate = b.dateApplied.localeCompare(a.dateApplied);
  return byDate !== 0 ? byDate : b.id - a.id;
}).slice(0, 5);

const recentList = document.getElementById("recentList");

if (recentApplications.length === 0) {
  recentList.innerHTML =
    '<li class="list-group-item text-center text-muted py-4">No applications yet.</li>';
}

recentApplications.forEach(function (app) {
  recentList.innerHTML +=
    '<li class="list-group-item d-flex justify-content-between align-items-center px-0">' +
      '<div>' +
        '<div class="fw-semibold">' + escapeHtml(app.company) + '</div>' +
        '<div class="small text-muted">' + escapeHtml(app.position) + ' &middot; ' + app.dateApplied + '</div>' +
      '</div>' +
      statusBadge(app.status) +
    '</li>';
});

// ---------- Chart 1: Doughnut - applications by status ----------
new Chart(document.getElementById("statusChart"), {
  type: "doughnut",
  data: {
    labels: ["Applied", "Interview", "Offered", "Rejected"],
    datasets: [{
      data: [
        countByStatus("Applied"),
        countByStatus("Interview"),
        countByStatus("Offered"),
        countByStatus("Rejected")
      ],
      backgroundColor: ["#2563eb", "#f59e0b", "#16a34a", "#dc2626"],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" }
    }
  }
});

// ---------- Chart 2: Line - application timeline ----------
// Sort a copy of the applications by date, then count a running total
const sortedByDate = applications.slice().sort(function (a, b) {
  return a.dateApplied.localeCompare(b.dateApplied);
});
const timelineLabels = sortedByDate.map(function (app) {
  return app.dateApplied;
});
const timelineTotals = sortedByDate.map(function (app, index) {
  return index + 1;
});

new Chart(document.getElementById("timelineChart"), {
  type: "line",
  data: {
    labels: timelineLabels,
    datasets: [{
      label: "Total applications",
      data: timelineTotals,
      borderColor: "#2563eb",
      backgroundColor: "rgba(37, 99, 235, 0.15)",
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }
});

// ---------- Chart 3: Bar - companies by location ----------
// Count how many companies are in each location
const locationCounts = {};
companies.forEach(function (company) {
  locationCounts[company.location] = (locationCounts[company.location] || 0) + 1;
});

new Chart(document.getElementById("locationChart"), {
  type: "bar",
  data: {
    labels: Object.keys(locationCounts),
    datasets: [{
      label: "Companies",
      data: Object.values(locationCounts),
      backgroundColor: "#1e3a8a",
      borderRadius: 6
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  }
});