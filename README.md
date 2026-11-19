# InternTrack

A web application prototype for tracking internship applications. Built for the IMS566 Advanced Web Design Development and Content Management individual project at Universiti Teknologi MARA.

## Description

InternTrack helps students keep track of their internship applications in one place. Users can log in, view a dashboard with charts, manage their applications, and keep a list of companies. All sample data is fictional. There is no database: login is simulated with hardcoded credentials, and anything a user adds or edits is saved in the browser using localStorage.

## Live Demo
- Website: https://atiqahhfatiin-blip.github.io/interntrack-app/
- Repository: https://github.com/atiqahhfatiin-blip/interntrack-app
  
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

## Bootstrap Components Used

Bootstrap 5.3 is loaded through the jsDelivr CDN. Components used in this project:

| Component | Where it is used | Documentation |
| Grid system | Page layout on all pages | [Grid](https://getbootstrap.com/docs/5.3/layout/grid/) |
| Navbar | Responsive navigation bar with hamburger menu | [Navbar](https://getbootstrap.com/docs/5.3/components/navbar/) |
| Dropdowns | Profile menu in the navigation bar | [Dropdowns](https://getbootstrap.com/docs/5.3/components/dropdowns/) |
| Cards | Summary cards, charts and company cards | [Cards](https://getbootstrap.com/docs/5.3/components/card/) |
| Buttons | Login, add, export and action buttons | [Buttons](https://getbootstrap.com/docs/5.3/components/buttons/) |
| Forms and input groups | Login form and add/edit forms | [Forms](https://getbootstrap.com/docs/5.3/forms/overview/), [Input group](https://getbootstrap.com/docs/5.3/forms/input-group/) |
| Form validation | Error messages on empty or invalid fields | [Validation](https://getbootstrap.com/docs/5.3/forms/validation/) |
| Modal | Add and edit popup forms | [Modal](https://getbootstrap.com/docs/5.3/components/modal/) |
| Toasts | Success and info messages | [Toasts](https://getbootstrap.com/docs/5.3/components/toasts/) |
| Alerts | Login error message | [Alerts](https://getbootstrap.com/docs/5.3/components/alerts/) |
| Badges | Status labels and deadline warnings | [Badges](https://getbootstrap.com/docs/5.3/components/badge/) |
| Tables | Applications table | [Tables](https://getbootstrap.com/docs/5.3/content/tables/) |
| Pagination | Applications table pages | [Pagination](https://getbootstrap.com/docs/5.3/components/pagination/) |
| List group | Recent applications on the dashboard | [List group](https://getbootstrap.com/docs/5.3/components/list-group/) |
| Color modes | Light and dark mode | [Color modes](https://getbootstrap.com/docs/5.3/customize/color-modes/) |
| Bootstrap Icons | Icons across the website | [Bootstrap Icons](https://icons.getbootstrap.com/) |

Other libraries: [Chart.js](https://www.chartjs.org/docs/latest/) for the charts

## Project Structure

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

Fatin Atiqah - IMS566, Universiti Teknologi MARA
