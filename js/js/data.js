/* ==========================================
   InternTrack - Sample Data (data.js)
   All data is fictional and hardcoded.
   Items added or edited by the user are saved in
   localStorage and loaded at the bottom of this file.
   ========================================== */

// Dataset 1: Internship applications
const applications = [
  { id: 1,  company: "MIMOS Berhad",     position: "Software Developer Intern",    dateApplied: "2026-08-05", status: "Offered",   deadline: "2026-11-30" },
  { id: 2,  company: "Grab Malaysia",    position: "Data Analyst Intern",          dateApplied: "2026-08-10", status: "Interview", deadline: "2026-11-18" },
  { id: 3,  company: "Petronas Digital", position: "Web Developer Intern",         dateApplied: "2026-08-12", status: "Applied",   deadline: "2026-11-22" },
  { id: 4,  company: "Maxis",            position: "Cybersecurity Intern",         dateApplied: "2026-08-15", status: "Rejected",  deadline: "" },
  { id: 5,  company: "Shopee Malaysia",  position: "UI/UX Design Intern",          dateApplied: "2026-08-18", status: "Interview", deadline: "2026-11-25" },
  { id: 6,  company: "CelcomDigi",       position: "Network Support Intern",       dateApplied: "2026-08-20", status: "Applied",   deadline: "2026-12-01" },
  { id: 7,  company: "AirAsia Digital",  position: "Mobile App Developer Intern",  dateApplied: "2026-08-22", status: "Offered",   deadline: "2026-12-05" },
  { id: 8,  company: "Fusionex",         position: "Business Intelligence Intern", dateApplied: "2026-08-25", status: "Rejected",  deadline: "" },
  { id: 9,  company: "Axiata Digital",   position: "QA Tester Intern",             dateApplied: "2026-08-28", status: "Interview", deadline: "2026-11-14" },
  { id: 10, company: "Sunway iLabs",     position: "IT Support Intern",            dateApplied: "2026-09-01", status: "Applied",   deadline: "2026-12-15" }
];

// Dataset 2: Companies
const companies = [
  { id: 1,  name: "MIMOS Berhad",     industry: "Research & Technology", location: "Kuala Lumpur",  email: "hr@mimos.example" },
  { id: 2,  name: "Grab Malaysia",    industry: "Super App / Transport", location: "Petaling Jaya", email: "careers@grab.example" },
  { id: 3,  name: "Petronas Digital", industry: "Energy & Digital",      location: "Kuala Lumpur",  email: "intern@petronasdigital.example" },
  { id: 4,  name: "Maxis",            industry: "Telecommunications",    location: "Kuala Lumpur",  email: "talent@maxis.example" },
  { id: 5,  name: "Shopee Malaysia",  industry: "E-commerce",            location: "Kuala Lumpur",  email: "jobs@shopee.example" },
  { id: 6,  name: "CelcomDigi",       industry: "Telecommunications",    location: "Shah Alam",     email: "hr@celcomdigi.example" },
  { id: 7,  name: "AirAsia Digital",  industry: "Aviation Technology",   location: "Sepang",        email: "careers@airasiadigital.example" },
  { id: 8,  name: "Fusionex",         industry: "Data Analytics",        location: "Petaling Jaya", email: "hr@fusionex.example" },
  { id: 9,  name: "Axiata Digital",   industry: "Digital Services",      location: "Kuala Lumpur",  email: "talent@axiata.example" },
  { id: 10, name: "Sunway iLabs",     industry: "Innovation Lab",        location: "Subang Jaya",   email: "intern@sunwayilabs.example" }
];

// ---------- Load items added or edited by the user ----------
try {
  // Applications added by the user (saved with custom: true)
  const savedApplications = JSON.parse(localStorage.getItem("savedApplications") || "[]");
  savedApplications.forEach(function (app) {
    applications.push(app);
  });

  // Edits made to the sample applications (saved by id)
  const savedEdits = JSON.parse(localStorage.getItem("applicationEdits") || "{}");
  applications.forEach(function (app) {
    if (!app.custom && savedEdits[app.id]) {
      Object.assign(app, savedEdits[app.id]);
    }
  });

  // Companies added by the user
  const savedCompanies = JSON.parse(localStorage.getItem("savedCompanies") || "[]");
  savedCompanies.forEach(function (company) {
    companies.push(company);
  });
} catch (error) {
  console.error("Could not load saved data:", error);
}