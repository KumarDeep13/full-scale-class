function initializeNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll(".nav-item");

  // Remove active class from all items
  navItems.forEach((item) => item.classList.remove("active"));

  // Add active class to current page nav item
  navItems.forEach((item) => {
    const link = item.getAttribute("onclick").match(/'([^']+)'/)[1];
    if (link === currentPage) {
      item.classList.add("active");
    }
  });

  // Add click handlers
  navItems.forEach((item) => {
    if (!item.classList.contains("active")) {
      item.addEventListener("click", function () {
        const link = this.getAttribute("onclick")?.match(/'([^']+)'/)[1];
        window.location.href = link;
      });
    }
  });
}

// Initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeNavigation);

// Update navigation items
const navItems = [
  { icon: "fa-home", text: "Home", link: "index.html" },
  { icon: "fa-calendar", text: "Calendar", link: "schedule.html" },
  { icon: "fa-chart-line", text: "Progress", link: "progress.html" },
  { icon: "fa-book-open", text: "Notes", link: "notes.html" },
  { icon: "fa-users", text: "Students", link: "students.html" },
  { icon: "fa-user", text: "Profile", link: "profile.html" },
];
