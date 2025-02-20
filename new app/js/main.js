document.addEventListener("DOMContentLoaded", function () {
  // Pre-load commonly used pages
  function preloadPage(url) {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
  }

  // Preload our main pages
  preloadPage("tasks.html");
  preloadPage("progress.html");
  preloadPage("notes.html");
  preloadPage("profile.html");

  // Handle bottom navigation
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Prevent default behavior
      event.preventDefault();

      // Remove active class from all items
      navItems.forEach((nav) => nav.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Handle navigation
      const page = this.querySelector("span").textContent.toLowerCase();

      // Show loading feedback
      this.style.opacity = "0.7";

      // Add small delay for visual feedback
      setTimeout(() => {
        switch (page) {
          case "home":
            window.location.href = "index.html";
            break;
          case "tasks":
            window.location.href = "tasks.html";
            break;
          case "progress":
            window.location.href = "progress.html";
            break;
          case "notes":
            window.location.href = "notes.html";
            break;
          case "students":
            window.location.href = "students.html";
            break;
          case "profile":
            window.location.href = "profile.html";
            break;
        }
      }, 100);
    });
  });

  // Handle search functionality
  const searchInput = document.querySelector(".search-bar input");

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      // Add search functionality here
      console.log("Searching for:", e.target.value);
    });
  }

  // Handle category clicks
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Show loading feedback
      this.style.opacity = "0.7";
      const categoryName = this.querySelector("span").textContent;
      // Store the category name in localStorage for the next page
      localStorage.setItem("selectedCategory", categoryName);
      window.location.href = "categories.html";
    });
  });

  // Handle back button
  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", function () {
      // Show loading feedback
      this.style.opacity = "0.7";
      window.location.href = "index.html";
    });
  }

  // Reset opacity on page load
  window.addEventListener("pageshow", function () {
    document
      .querySelectorAll(".nav-item, .category-item, .back-button")
      .forEach((el) => (el.style.opacity = "1"));
  });

  // Set category title if on categories page
  const categoryTitle = document.querySelector(".category-title");
  if (categoryTitle) {
    const selectedCategory = localStorage.getItem("selectedCategory");
    if (selectedCategory) {
      categoryTitle.textContent = selectedCategory;
    }
  }

  // Handle doctor card clicks
  const doctorCards = document.querySelectorAll(".doctor-card");
  doctorCards.forEach((card) => {
    card.addEventListener("click", function () {
      const doctorName = this.querySelector("h4").textContent;
      console.log(`Clicked on ${doctorName}'s profile`);
      // You can add navigation to doctor's profile page here
    });
  });
});
