/* ==========================================
   InternTrack - Companies Page (companies.js)
   Includes search, location filter, add and delete
   ========================================== */

// Get the elements we need from the page
const grid = document.getElementById("companiesGrid");
const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");
const resultCount = document.getElementById("resultCount");
const addCompanyForm = document.getElementById("addCompanyForm");
const addCompanyModalEl = document.getElementById("addCompanyModal");
const locationList = document.getElementById("locationList");

// Make user text safe before putting it into the page
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Save only the user-added companies into localStorage
function saveCustomCompanies() {
  const custom = companies.filter(function (company) {
    return company.custom === true;
  });
  try {
    localStorage.setItem("savedCompanies", JSON.stringify(custom));
  } catch (error) {
    console.error("Could not save companies:", error);
  }
}

// Fill the location dropdown and the suggestion list from the company data
function buildLocationOptions() {
  const selected = locationFilter.value;

  // Get each location once, in alphabetical order
  const locations = [];
  companies.forEach(function (company) {
    if (!locations.includes(company.location)) {
      locations.push(company.location);
    }
  });
  locations.sort();

  // Rebuild the dropdown (keep the "All locations" option first)
  locationFilter.innerHTML = '<option value="All">All locations</option>';
  locationList.innerHTML = "";
  locations.forEach(function (location) {
    locationFilter.innerHTML +=
      '<option value="' + escapeHtml(location) + '">' + escapeHtml(location) + "</option>";
    locationList.innerHTML += '<option value="' + escapeHtml(location) + '"></option>';
  });

  // Keep the user's previous choice if it still exists
  locationFilter.value = locations.includes(selected) ? selected : "All";
}

// Draw the cards using only the companies that match the search and filter
function renderCompanies() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedLocation = locationFilter.value;

  const filtered = companies.filter(function (company) {
    const matchesKeyword =
      company.name.toLowerCase().includes(keyword) ||
      company.industry.toLowerCase().includes(keyword);
    const matchesLocation =
      selectedLocation === "All" || company.location === selectedLocation;
    return matchesKeyword && matchesLocation;
  });

  // Clear the old cards
  grid.innerHTML = "";

  // Show a message if nothing matches
  if (filtered.length === 0) {
    grid.innerHTML =
      '<div class="col-12"><p class="text-center text-muted py-4">' +
      '<i class="bi bi-search me-1"></i>No companies found.</p></div>';
  }

  // Build one card for every matching company
  filtered.forEach(function (company) {
    // Only companies added by the user can be deleted
    let deleteButton = "";
    if (company.custom) {
      deleteButton =
        '<button class="btn btn-outline-danger btn-sm mt-3" data-delete-id="' + company.id + '">' +
        '<i class="bi bi-trash me-1"></i>Delete</button>';
    }

    grid.innerHTML +=
      '<div class="col-12 col-md-6 col-lg-4">' +
        '<div class="card company-card h-100">' +
          '<div class="card-body">' +
            '<h2 class="h5 fw-bold">' + escapeHtml(company.name) + '</h2>' +
            '<span class="badge text-bg-primary mb-3">' + escapeHtml(company.industry) + '</span>' +
            '<p class="mb-1"><i class="bi bi-geo-alt me-1"></i><strong>Location:</strong> ' + escapeHtml(company.location) + '</p>' +
            '<p class="mb-0"><i class="bi bi-envelope me-1"></i><strong>Email:</strong> ' + escapeHtml(company.email) + '</p>' +
            deleteButton +
          '</div>' +
        '</div>' +
      '</div>';
  });

  // Update the result count
  resultCount.textContent =
    "Showing " + filtered.length + " of " + companies.length + " companies";
}

// ---------- Add a new company ----------
addCompanyForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Stop and show red messages if any field is empty or the email is invalid
  if (!addCompanyForm.checkValidity()) {
    addCompanyForm.classList.add("was-validated");
    return;
  }

  // Next id = highest existing id + 1
  const nextId = Math.max.apply(null, companies.map(function (company) {
    return company.id;
  })) + 1;

  // Create the new company object
  const newCompany = {
    id: nextId,
    name: document.getElementById("nameInput").value.trim(),
    industry: document.getElementById("industryInput").value.trim(),
    location: document.getElementById("locationInput").value.trim(),
    email: document.getElementById("emailInput").value.trim(),
    custom: true
  };

  companies.push(newCompany);
  saveCustomCompanies();

  // Close the modal and reset the form
  const modal = bootstrap.Modal.getInstance(addCompanyModalEl);
  if (modal) {
    modal.hide();
  }
  addCompanyForm.reset();
  addCompanyForm.classList.remove("was-validated");

  buildLocationOptions();
  renderCompanies();
  showToast(newCompany.name + " added successfully!", "success");
});

// ---------- Delete a company (only user-added ones) ----------
grid.addEventListener("click", function (event) {
  const button = event.target.closest("[data-delete-id]");
  if (!button) {
    return;
  }

  const id = Number(button.getAttribute("data-delete-id"));
  if (!confirm("Delete this company?")) {
    return;
  }

  const index = companies.findIndex(function (company) {
    return company.id === id && company.custom === true;
  });
  if (index !== -1) {
    companies.splice(index, 1);
    saveCustomCompanies();
    buildLocationOptions();
    renderCompanies();
    showToast("Company deleted.", "secondary");
  }
});

// Redraw the cards every time the user types or changes the dropdown
searchInput.addEventListener("input", renderCompanies);
locationFilter.addEventListener("change", renderCompanies);

// Set up the page when it loads
buildLocationOptions();
renderCompanies();