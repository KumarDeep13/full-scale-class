document.addEventListener("DOMContentLoaded", function () {
  // View Toggle Functionality
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const views = document.querySelectorAll(".view-section");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const viewToShow = this.dataset.view;

      // Update buttons
      toggleBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Update views
      views.forEach((view) => {
        if (view.id === `${viewToShow}View`) {
          view.classList.add("active");
        } else {
          view.classList.remove("active");
        }
      });
    });
  });

  // Sample task data - replace with your actual data
  const tasks = [
    {
      date: "Mar 25",
      title: "Mathematics Quiz",
      description: "Chapter 5: Algebra",
      status: "pending",
    },
    {
      date: "Mar 26",
      title: "Science Project",
      description: "Submit research paper",
      status: "completed",
    },
  ];

  // Populate task list
  const taskList = document.querySelector(".task-list");
  if (taskList) {
    taskList.innerHTML = tasks
      .map(
        (task) => `
      <div class="task-item">
        <div class="task-date">${task.date}</div>
        <div class="task-details">
          <h4>${task.title}</h4>
          <p>${task.description}</p>
        </div>
        <div class="task-status ${task.status}">${task.status}</div>
      </div>
    `
      )
      .join("");
  }
});
