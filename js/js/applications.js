/* ==========================================
   InternTrack - Applications Page (applications.js)
   Includes search, status filter, sort, pagination,
   add, edit, quick status change, deadline,
   delete and CSV export
   ========================================== */

// Get the elements we need from the page
const tableBody = document.getElementById("applicationsBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const resultCount = document.getElementById("resultCount");
const addBtn = document.getElementById("addBtn");
const exportBtn = document.getElementById("exportBtn");
const addForm = document.getElementById("addForm");
const addModalEl = document.getElementById("addModal");
const modalTitle = document.getElementById("addModalLabel");
const saveBtn = document.getElementById("saveBtn");
const pageSizeSelect = document.getElementById("pageSize");
const paginationNav = document.getElementById("paginationNav");

// The popup form (used for both adding and editing)
const formModal = new bootstrap.Modal(addModalEl);

// null = adding a new application, a number = editing that application
let editingId = null;

// Sorting and paging settings
let sortKey = "";        // which column is sorted ("" = original order)
let sortDir = "asc";     // "asc" or "desc"
let currentPage = 1;
let pageSize = 5;

// Colours for the status dropdown in each row
const STATUS_STYLES = {
  "Applied": "border-primary text-primary",
  "Interview": "border-warning text-warning-emphasis",
  "Offered": "border-success text-success",
  "Rejected": "border-danger text-danger"
};

// Make user text safe before putting it into the page
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Saving ----------

// Save only the user-added applications into localStorage
function saveCustomApplications() {
  const custom = applications.filter(function (app) {
    return app.custom === true;
  });
  try {
    localStorage.setItem("savedApplications", JSON.stringify(custom));
  } catch (error) {
    console.error("Could not save applications:", error);
  }
}

// Save changes made to one application
function saveChanges(app) {
  // Applications added by the user are saved together
  if (app.custom) {
    saveCustomApplications();
    return;
  }

  // Sample applications: remember the edits by id
  try {
    const edits = JSON.parse(localStorage.getItem("applicationEdits") || "{}");
    edits[app.id] = {
      company: app.company,
      position: app.position,
      dateApplied: app.dateApplied,
      status: app.status,
      deadline: app.deadline || ""
    };
    localStorage.setItem("applicationEdits", JSON.stringify(edits));
  } catch (error) {
    console.error("Could not save edits:", error);
  }
}

// ---------- Filtering and sorting ----------

// Sort a list by the chosen column
function sortApplications(list) {
  if (!sortKey) {
    return list;
  }

  const direction = sortDir === "asc" ? 1 : -1;

  return list.slice().sort(function (a, b) {
    const valueA = a[sortKey] || "";
    const valueB = b[sortKey] || "";

    // Empty values (for example no deadline) always go to the bottom
    if (valueA === "" && valueB === "") {
      return 0;
    }
    if (valueA === "") {
      return 1;
    }
    if (valueB === "") {
      return -1;
    }

    return valueA.toString().localeCompare(valueB.toString(), undefined, { sensitivity: "base" }) * direction;
  });
}

// Get the applications that match the search and filter, in the chosen order
function getVisibleApplications() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;

  const filtered = applications.filter(function (app) {
    const matchesKeyword =
      app.company.toLowerCase().includes(keyword) ||
      app.position.toLowerCase().includes(keyword);
    const matchesStatus =
      selectedStatus === "All" || app.status === selectedStatus;
    return matchesKeyword && matchesStatus;
  });

  return sortApplications(filtered);
}

// Show an arrow on the column that is being sorted
function updateSortIcons() {
  document.querySelectorAll("[data-sort]").forEach(function (button) {
    const icon = button.querySelector("i");
    if (button.getAttribute("data-sort") === sortKey) {
      icon.className = sortDir === "asc" ? "bi bi-caret-up-fill small" : "bi bi-caret-down-fill small";
    } else {
      icon.className = "bi bi-arrow-down-up small";
    }
  });
}

// ---------- Table pieces ----------

// Dropdown that lets the user change the status directly in the table
function statusSelect(app) {
  let html =
    '<select class="form-select form-select-sm fw-semibold ' + STATUS_STYLES[app.status] + '" ' +
    'style="min-width: 120px;" data-status-id="' + app.id + '" aria-label="Change status">';

  ["Applied", "Interview", "Offered", "Rejected"].forEach(function (status) {
    const selected = status === app.status ? " selected" : "";
    html += '<option value="' + status + '"' + selected + ">" + status + "</option>";
  });

  return html + "</select>";
}

// Show the deadline with a warning when it is close or already passed
function deadlineCell(app) {
  // No deadline needed for empty or rejected applications
  if (!app.deadline || app.status === "Rejected") {
    return '<span class="text-muted">-</span>';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(app.deadline + "T00:00:00");
  const days = Math.round((due - today) / 86400000);

  let note = "";
  if (days < 0) {
    note = ' <span class="badge text-bg-danger">Overdue</span>';
  } else if (days === 0) {
    note = ' <span class="badge text-bg-danger">Today</span>';
  } else if (days <= 7) {
    note = ' <span class="badge text-bg-warning">' + days + (days === 1 ? " day" : " days") + " left</span>";
  }

  return app.deadline + note;
}

// One page button for the pagination bar
function pageItem(label, page, isDisabled, isActive) {
  let classes = "page-item";
  if (isDisabled) {
    classes += " disabled";
  }
  if (isActive) {
    classes += " active";
  }
  return '<li class="' + classes + '"><button type="button" class="page-link" data-page="' + page + '">' + label + "</button></li>";
}

// Draw the page buttons (Prev, 1, 2, 3, Next)
function renderPagination(totalPages) {
  // No buttons needed when everything fits on one page
  if (totalPages <= 1) {
    paginationNav.innerHTML = "";
    return;
  }

  let html = '<ul class="pagination pagination-sm justify-content-center mb-0">';
  html += pageItem("Prev", currentPage - 1, currentPage === 1, false);
  for (let page = 1; page <= totalPages; page++) {
    html += pageItem(page, page, false, page === currentPage);
  }
  html += pageItem("Next", currentPage + 1, currentPage === totalPages, false);
  html += "</ul>";

  paginationNav.innerHTML = html;
}

// Draw the table for the current page
function renderTable() {
  const visible = getVisibleApplications();

  // Work out how many pages there are and keep the current page valid
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // Take only the applications for this page
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = visible.slice(startIndex, startIndex + pageSize);

  // Clear the old rows
  tableBody.innerHTML = "";

  // Show a message if nothing matches
  if (visible.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="7" class="text-center text-muted py-4">' +
      '<i class="bi bi-search me-1"></i>No applications found.</td></tr>';
  }

  // Build one table row for every application on this page
  pageItems.forEach(function (app, index) {
    // Every application can be edited
    let actionCell =
      '<button class="btn btn-outline-primary btn-sm me-1" data-edit-id="' + app.id + '" ' +
      'aria-label="Edit application"><i class="bi bi-pencil"></i></button>';

    // Only applications added by the user can be deleted
    if (app.custom) {
      actionCell +=
        '<button class="btn btn-outline-danger btn-sm" data-delete-id="' + app.id + '" ' +
        'aria-label="Delete application"><i class="bi bi-trash"></i></button>';
    }

    tableBody.innerHTML +=
      "<tr>" +
        "<td>" + (startIndex + index + 1) + "</td>" +
        "<td class='fw-semibold'>" + escapeHtml(app.company) + "</td>" +
        "<td>" + escapeHtml(app.position) + "</td>" +
        "<td>" + app.dateApplied + "</td>" +
        "<td>" + deadlineCell(app) + "</td>" +
        "<td>" + statusSelect(app) + "</td>" +
        "<td class='text-nowrap'>" + actionCell + "</td>" +
      "</tr>";
  });

  // Update the result count
  if (visible.length === 0) {
    resultCount.textContent = "No applications to show";
  } else {
    const endIndex = startIndex + pageItems.length;
    resultCount.textContent = "Showing " + (startIndex + 1) + "-" + endIndex + " of " + visible.length + " applications";
    if (visible.length !== applications.length) {
      resultCount.textContent += " (filtered from " + applications.length + ")";
    }
  }

  updateSortIcons();
  renderPagination(totalPages);
}

// ---------- Open the popup form ----------

// Empty form for a new application
function openAddMode() {
  editingId = null;
  addForm.reset();
  addForm.classList.remove("was-validated");
  modalTitle.textContent = "Add New Application";
  saveBtn.textContent = "Save Application";
  // Default the date to today (yyyy-mm-dd)
  document.getElementById("dateInput").value = new Date().toLocaleDateString("en-CA");
  formModal.show();
}

// Form filled with the details of an existing application
function openEditMode(app) {
  editingId = app.id;
  addForm.classList.remove("was-validated");
  modalTitle.textContent = "Edit Application";
  saveBtn.textContent = "Save Changes";

  document.getElementById("companyInput").value = app.company;
  document.getElementById("positionInput").value = app.position;
  document.getElementById("dateInput").value = app.dateApplied;
  document.getElementById("deadlineInput").value = app.deadline || "";
  document.getElementById("statusInput").value = app.status;
  formModal.show();
}

addBtn.addEventListener("click", openAddMode);

// ---------- Save the form (add or edit) ----------
addForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Stop and show red messages if any required field is empty
  if (!addForm.checkValidity()) {
    addForm.classList.add("was-validated");
    return;
  }

  // Read the values from the form
  const values = {
    company: document.getElementById("companyInput").value.trim(),
    position: document.getElementById("positionInput").value.trim(),
    dateApplied: document.getElementById("dateInput").value,
    deadline: document.getElementById("deadlineInput").value,
    status: document.getElementById("statusInput").value
  };

  if (editingId === null) {
    // ----- Adding a new application -----
    // Next id = highest existing id + 1
    const nextId = Math.max.apply(null, applications.map(function (app) {
      return app.id;
    })) + 1;

    values.id = nextId;
    values.custom = true;
    applications.push(values);
    saveCustomApplications();
    showToast("Application to " + values.company + " added!", "success");
  } else {
    // ----- Editing an existing application -----
    const app = applications.find(function (item) {
      return item.id === editingId;
    });
    if (app) {
      Object.assign(app, values);
      saveChanges(app);
      showToast("Application to " + app.company + " updated!", "success");
    }
  }

  formModal.hide();
  renderTable();
});

// ---------- Table clicks: edit and delete buttons ----------
tableBody.addEventListener("click", function (event) {
  // Edit button
  const editButton = event.target.closest("[data-edit-id]");
  if (editButton) {
    const id = Number(editButton.getAttribute("data-edit-id"));
    const app = applications.find(function (item) {
      return item.id === id;
    });
    if (app) {
      openEditMode(app);
    }
    return;
  }

  // Delete button (only for applications added by the user)
  const deleteButton = event.target.closest("[data-delete-id]");
  if (deleteButton) {
    const id = Number(deleteButton.getAttribute("data-delete-id"));
    if (!confirm("Delete this application?")) {
      return;
    }

    const index = applications.findIndex(function (app) {
      return app.id === id && app.custom === true;
    });
    if (index !== -1) {
      applications.splice(index, 1);
      saveCustomApplications();
      renderTable();
      showToast("Application deleted.", "secondary");
    }
  }
});

// ---------- Change the status directly from the table ----------
tableBody.addEventListener("change", function (event) {
  const select = event.target.closest("[data-status-id]");
  if (!select) {
    return;
  }

  const id = Number(select.getAttribute("data-status-id"));
  const app = applications.find(function (item) {
    return item.id === id;
  });
  if (app) {
    app.status = select.value;
    saveChanges(app);
    renderTable();
    showToast(app.company + " is now: " + app.status, "info");
  }
});

// ---------- Sort by clicking a column title ----------
document.querySelectorAll("[data-sort]").forEach(function (button) {
  button.addEventListener("click", function () {
    const key = button.getAttribute("data-sort");

    if (sortKey === key) {
      // Same column again: flip the direction
      sortDir = sortDir === "asc" ? "desc" : "asc";
    } else {
      // New column: start with ascending
      sortKey = key;
      sortDir = "asc";
    }

    currentPage = 1;
    renderTable();
  });
});

// ---------- Pagination ----------
paginationNav.addEventListener("click", function (event) {
  const button = event.target.closest("[data-page]");
  if (!button) {
    return;
  }
  currentPage = Number(button.getAttribute("data-page"));
  renderTable();
});

pageSizeSelect.addEventListener("change", function () {
  pageSize = Number(pageSizeSelect.value);
  currentPage = 1;
  renderTable();
});

// ---------- Export to CSV ----------

// Wrap a value in quotes so commas inside it do not break the file
function csvCell(value) {
  let text = String(value === undefined || value === null ? "" : value);

  // Stop spreadsheet programs from treating text that starts with = + - @ as a formula
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return '"' + text.replace(/"/g, '""') + '"';
}

function exportCsv() {
  // Export what the user currently sees (after search, filter and sort), from every page
  const rows = getVisibleApplications();

  if (rows.length === 0) {
    showToast("No applications to export.", "warning");
    return;
  }

  // First line = column titles
  const lines = [
    ["No", "Company", "Position", "Date Applied", "Deadline", "Status"].map(csvCell).join(",")
  ];

  // One line for each application
  rows.forEach(function (app, index) {
    lines.push([
      index + 1,
      app.company,
      app.position,
      app.dateApplied,
      app.deadline || "",
      app.status
    ].map(csvCell).join(","));
  });

  // The first character helps Excel read the file correctly
  const csv = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link and click it to start the download
  const link = document.createElement("a");
  link.href = url;
  link.download = "interntrack-applications-" + new Date().toLocaleDateString("en-CA") + ".csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast(rows.length + " applications exported to CSV.", "success");
}

exportBtn.addEventListener("click", exportCsv);

// ---------- Search and filter ----------
// Go back to page 1 whenever the search or filter changes
searchInput.addEventListener("input", function () {
  currentPage = 1;
  renderTable();
});
statusFilter.addEventListener("change", function () {
  currentPage = 1;
  renderTable();
});

// Draw the table once when the page loads
renderTable();