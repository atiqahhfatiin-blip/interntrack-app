# InternTrack

A web application prototype for tracking internship applications. Built for the IMS566 Advanced Web Design Development and Content Management individual project at Universiti Teknologi MARA.

## Description

InternTrack helps students keep track of their internship applications in one place. Users can log in, view a dashboard with charts, manage their applications, and keep a list of companies. All sample data is fictional. There is no database: login is simulated with hardcoded credentials, and anything a user adds or edits is saved in the browser using localStorage.

## Live Demo

This project can be published with GitHub Pages.
After enabling Pages in the repository settings, set the source to **GitHub Actions**.

## Features

### Authentication
- Login page with a demo account hint, an auto-fill button and a show/hide password button
- Error message for an invalid username or password
- Page protection: other pages cannot be opened without logging in
- Logout from the profile dropdown

### Navigation and layout
- Consistent responsive navigation bar and footer on every page (built by one shared script)
- Profile dropdown in the navigation bar
- Light and dark mode (the choice is remembered)
- Back-to-top button, toast notifications and fade-in animations
- Favicon and a footer with quick links and contact details

### Dashboard
- Welcome banner with a time-based greeting, today's date and a short summary
- Summary cards: total applications, interviews, offers and rejected
- Recent Applications list (latest 5)
- Three interactive Chart.js charts:
  - Doughnut chart: applications by status
  - Line chart: application timeline
  - Bar chart: companies by location

### Applications page
- Table of all applications with colour-coded status
- Add a new application using a form with validation
- Edit any application and change its status directly in the table
- Deadline column with Overdue, Today and days-left warnings
- Search by company or position, and filter by status
- Sort by clicking a column title
- Pagination with a choice of 5, 10 or 25 rows per page
- Export the current list to a CSV file
- Delete applications that were added by the user

### Companies page
- Responsive grid of company cards
- Add a new company (name, industry, location and email) using a validated form
- Search by name or industry, and filter by location
- Delete companies that were added by the user
- New companies and locations are reflected in the dashboard bar chart

### Content management and design
- Page titles, meta description and author tags on every page
- Semantic HTML (header, nav, main, section, footer)
- Responsive layout for desktop, tablet and mobile
- Commented HTML, CSS and JavaScript

## How to Test Login

1. Open the live website link above.
2. Enter the following credentials:
   - **Username:** `student`
   - **Password:** `1234`
3. Click **Login** to go to the dashboard.
4. Or click **Use demo account** on the login page to fill in the credentials automatically.
5. To test the error message, enter a wrong username or password.

## Notes

- Applications and companies added or edited by the user are stored in the browser (localStorage), so they only appear on the same browser and device.
- To reset the sample data, clear the site data in the browser (Developer Tools, Application tab, Local Storage).

## Frameworks and Libraries Used

- [Bootstrap 5.3](https://getbootstrap.com/) - layout, components, modals, toasts and responsive design
- [Bootstrap Icons 1.11](https://icons.getbootstrap.com/) - icons
- [Chart.js 4.4](https://www.chartjs.org/) - data visualisation
- HTML5, CSS3 and vanilla JavaScript

## Project Structure

```
interntrack/
├── index.html            (login page)
├── dashboard.html
├── applications.html
├── companies.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── auth.js           (login logic)
│   ├── main.js           (page protection, navbar, footer, dark mode, toasts)
│   ├── data.js           (sample data and saved data loading)
│   ├── chart-theme.js    (chart colours for dark mode)
│   ├── dashboard.js
│   ├── applications.js
│   └── companies.js
└── images/
    └── logo.svg
```

## Author

Atin comel kiyowo - IMS566, Universiti Teknologi MARA