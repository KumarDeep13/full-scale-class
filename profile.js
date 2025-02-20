document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const profileContent = document.getElementById("profileContent");
  const errorMessage = document.getElementById("errorMessage");
  const logoutBtn = document.querySelector(".logout-btn");

  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    showProfile();
  }

  document.querySelector(".login-btn").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "Deep" && password === "1111") {
      localStorage.setItem("isLoggedIn", "true");
      showProfile();
      errorMessage.textContent = "";
    } else {
      errorMessage.textContent = "Invalid username or password";
    }
  });

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    showLogin();
  });

  function showProfile() {
    loginForm.classList.add("hidden");
    profileContent.classList.remove("hidden");
  }

  function showLogin() {
    loginForm.classList.remove("hidden");
    profileContent.classList.add("hidden");
  }
});
