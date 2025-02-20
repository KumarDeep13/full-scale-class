document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the category page
  const isCategoryPage = document.querySelector(".category-title") !== null;
  let currentSubject = "";
  let topicChart = null; // Store chart instance

  // Get students data from localStorage
  window.students = JSON.parse(localStorage.getItem("students")) || [
    {
      id: "001",
      name: "John Doe",
      scores: {
        mathematics: [
          { type: "quiz", score: 85, date: "2024-03-01" },
          { type: "midterm", score: 78, date: "2024-03-15" },
        ],
        science: [
          { type: "quiz", score: 90, date: "2024-03-02" },
          { type: "midterm", score: 88, date: "2024-03-16" },
        ],
      },
    },
    {
      id: "002",
      name: "Jane Smith",
      scores: {
        mathematics: [
          { type: "quiz", score: 92, date: "2024-03-01" },
          { type: "midterm", score: 95, date: "2024-03-15" },
        ],
        literature: [
          { type: "quiz", score: 88, date: "2024-03-02" },
          { type: "midterm", score: 91, date: "2024-03-16" },
        ],
      },
    },
  ];

  // Make functions globally accessible
  window.currentSubject = "";
  window.getSubjectData = getSubjectData;
  window.updateProgressChart = updateProgressChart;
  window.showStudentData = showStudentData;
  window.showAllStudents = showAllStudents;

  // Initialize views based on page type
  if (isCategoryPage) {
    currentSubject = document.querySelector(".category-title").textContent;
    window.currentSubject = currentSubject;
    setupToggleView();
    updateCategoryStats();
  } else {
    initializeProgressPageViews();
  }

  // Initialize Charts
  const progressCtx = document.getElementById("progressChart").getContext("2d");

  // Overall Progress Chart
  const progressChart = new Chart(progressCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Overall Progress",
          data: [65, 70, 75, 80, 85, 90],
          borderColor: "#4CAF50",
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(76, 175, 80, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  // Only initialize subject chart if element exists
  let subjectChart;
  if (subjectCtx) {
    // Subject-wise Performance Chart
    subjectChart = new Chart(subjectCtx, {
      type: "bar",
      data: {
        labels: ["Mathematics", "Science", "Literature", "History"],
        datasets: [
          {
            label: "Current Score",
            data: [85, 75, 90, 70],
            backgroundColor: ["#81C784", "#64B5F6", "#FFB74D", "#BA68C8"],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  }

  // Handle Score Form Submission
  const scoreForm = document.getElementById("scoreForm");
  if (scoreForm) {
    scoreForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const subject = isCategoryPage
        ? currentSubject.toLowerCase()
        : document.getElementById("subject").value;
      const score = parseInt(document.getElementById("score").value);
      const examType = document.getElementById("examType").value;

      // Add score to storage
      if (!students[0].scores[subject]) {
        students[0].scores[subject] = [];
      }

      students[0].scores[subject].push({
        score: score,
        date: new Date(),
        examType: examType,
      });

      // Update charts
      if (isCategoryPage) {
        updateTopicCharts();
      } else {
        updateCharts(subject, score);
      }

      // Show success message
      showNotification("Score added successfully!");

      // Clear form
      scoreForm.reset();
    });
  }

  // Initialize Student List
  initializeStudentList();

  // Add search functionality
  const searchInput = document.getElementById("searchStudent");
  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const studentCards = document.querySelectorAll(".student-card");

    studentCards.forEach((card) => {
      const studentName = card.querySelector("h4").textContent.toLowerCase();
      card.style.display = studentName.includes(searchTerm) ? "flex" : "none";
    });
  });

  // Add subject filter functionality
  const filterSubject = document.getElementById("filterSubject");
  filterSubject.addEventListener("change", function (e) {
    const subject = e.target.value;
    const studentCards = document.querySelectorAll(".student-card");

    studentCards.forEach((card) => {
      if (subject === "all") {
        card.style.display = "flex";
      } else {
        const studentSubject = card.querySelector("p.subject").textContent;
        card.style.display = studentSubject === subject ? "flex" : "none";
      }
    });
  });

  // Initialize views based on page type
  function initializeCategoryPageViews() {
    const toggleBtn = document.getElementById("toggleView");
    const progressView = document.getElementById("progressView");
    const subjectView = document.getElementById("subjectView");

    toggleBtn.addEventListener("click", function () {
      progressView.classList.toggle("hidden");
      subjectView.classList.toggle("hidden");
    });
  }

  function initializeProgressPageViews() {
    const toggleBtn = document.getElementById("toggleView");
    const studentView = document.getElementById("studentView");
    const teacherView = document.getElementById("teacherView");

    toggleBtn.addEventListener("click", function () {
      studentView.classList.toggle("hidden");
      teacherView.classList.toggle("hidden");
    });
  }

  // Check if we're on the progress page
  const isProgressPage = window.location.pathname.includes("progress.html");

  if (isProgressPage) {
    initializeProgressCharts();
  }

  function setupToggleView() {
    const toggleBtn = document.getElementById("toggleView");
    const progressView = document.getElementById("progressView");
    const subjectView = document.getElementById("subjectView");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        // Toggle active-view class instead of hidden
        if (progressView.classList.contains("hidden")) {
          // Switching to progress view
          progressView.classList.remove("hidden");
          subjectView.classList.remove("active-view");
          progressView.classList.add("active-view");
          subjectView.classList.add("hidden");

          // Force layout recalculation
          void progressView.offsetHeight;

          // Update progress view content
          document.querySelector(".subject-name").textContent = currentSubject;
          const subject = currentSubject.toLowerCase();

          // Get fresh data from localStorage
          window.students = JSON.parse(localStorage.getItem("students")) || [];

          const subjectData = getSubjectData(subject);
          updateProgressChart(subjectData);
          updateDistributionChart(subjectData);
          displayStudentList(subject);

          // Show the view all button
          const viewAllBtn = document.querySelector(".view-all-btn");
          if (viewAllBtn) {
            viewAllBtn.style.display = "block";
            viewAllBtn.classList.add("visible");
          }
        } else {
          // Switching back to subject view
          subjectView.classList.remove("hidden");
          progressView.classList.remove("active-view");
          subjectView.classList.add("active-view");
          progressView.classList.add("hidden");
        }

        // Update toggle button icon
        const icon = toggleBtn.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-chart-line");
          icon.classList.toggle("fa-list");
        }
      });
    }
  }

  function updateStudentCharts() {
    // Get student data for current subject
    const subjectData = getSubjectData(currentSubject.toLowerCase());

    // Update progress chart
    updateProgressChart(subjectData);

    // Update distribution chart
    updateDistributionChart(subjectData);
  }

  function getSubjectData(subject) {
    // Filter students with scores in this subject
    return students
      .filter((student) => student.scores[subject])
      .map((student) => ({
        name: student.name,
        scores: student.scores[subject],
      }));
  }

  function updateProgressChart(data) {
    const ctx = document.getElementById("progressChart").getContext("2d");

    if (topicChart) {
      topicChart.destroy();
    }

    if (!data || data.length === 0) {
      showNotification("No student data available");
      return;
    }

    const datasets = [];

    // Add individual student lines
    data.forEach((student) => {
      datasets.push({
        label: student.name,
        data: student.scores.map((score) => score.score),
        borderColor: getRandomColor(),
        fill: false,
      });
    });

    topicChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data[0].scores.map((score) => score.date),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Score (%)",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `${currentSubject} - Student Progress`,
            font: { size: 14 },
          },
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 10,
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  function updateDistributionChart(data) {
    const ctx = document.getElementById("distributionChart").getContext("2d");

    if (!data || data.length === 0) return;

    // Get latest scores for each student
    const latestScores = data.map((student) => {
      const sortedScores = student.scores.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return sortedScores[0].score;
    });

    // Calculate distribution
    const distribution = {
      "90-100": 0,
      "80-89": 0,
      "70-79": 0,
      "60-69": 0,
      "Below 60": 0,
    };

    latestScores.forEach((score) => {
      if (score >= 90) distribution["90-100"]++;
      else if (score >= 80) distribution["80-89"]++;
      else if (score >= 70) distribution["70-79"]++;
      else if (score >= 60) distribution["60-69"]++;
      else distribution["Below 60"]++;
    });

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(distribution),
        datasets: [
          {
            data: Object.values(distribution),
            backgroundColor: [
              "#4CAF50",
              "#8BC34A",
              "#FFC107",
              "#FF9800",
              "#F44336",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${currentSubject} - Score Distribution`,
            font: { size: 14 },
          },
          legend: {
            position: "bottom",
            labels: { font: { size: 11 } },
          },
        },
      },
    });
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function updateTopicCharts() {
    // Get topic data for the current subject
    const topicData = getTopicData(currentSubject);

    // Update or create the progress chart
    topicChart = new Chart(progressCtx, {
      type: "bar",
      data: {
        labels: topicData.map((topic) => topic.name),
        datasets: [
          {
            label: "Topic Progress",
            data: topicData.map((topic) => topic.progress),
            backgroundColor: [
              "#81C784", // Algebra
              "#64B5F6", // Calculus
              "#FFB74D", // Geometry
              "#BA68C8", // Statistics
            ],
            barThickness: 20, // Make bars thinner
          },
          {
            label: "Class Average",
            data: topicData.map((topic) => topic.classAverage),
            type: "line",
            borderColor: "#4CAF50",
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Progress (%)",
            },
          },
          x: {
            ticks: {
              font: {
                size: 11, // Smaller font for x-axis labels
              },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `${currentSubject} - Topic Progress vs Class Average`,
            font: {
              size: 14, // Smaller title
            },
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 10,
              font: {
                size: 11, // Smaller legend text
              },
            },
          },
        },
      },
    });
  }

  function getTopicData(subject) {
    // This would typically come from your backend
    // For now, using static data for demonstration
    const topicData = {
      Mathematics: [
        {
          name: "Algebra",
          progress: 85,
          classAverage: 78,
          studentScores: [85, 92, 78, 88, 75],
        },
        {
          name: "Calculus",
          progress: 65,
          classAverage: 70,
          studentScores: [65, 75, 68, 72, 70],
        },
        {
          name: "Geometry",
          progress: 90,
          classAverage: 82,
          studentScores: [90, 85, 88, 80, 75],
        },
        {
          name: "Statistics",
          progress: 70,
          classAverage: 75,
          studentScores: [70, 80, 75, 73, 77],
        },
      ],
      // Add data for other subjects here
    };

    return topicData[subject] || [];
  }
});

function updateCharts(subject, newScore) {
  // Update subject chart
  const subjectIndex = subjectChart.data.labels.indexOf(subject);
  if (subjectIndex !== -1) {
    subjectChart.data.datasets[0].data[subjectIndex] = newScore;
    subjectChart.update();
  }

  // Calculate and update overall progress
  const allScores = Object.values(students[0].scores)
    .flat()
    .map((s) => s.score);
  const average = allScores.length
    ? allScores.reduce((a, b) => a + b) / allScores.length
    : 0;

  // Add new point to progress chart
  progressChart.data.labels.push(new Date().toLocaleDateString());
  progressChart.data.datasets[0].data.push(average);

  // Keep only last 6 points
  if (progressChart.data.labels.length > 6) {
    progressChart.data.labels.shift();
    progressChart.data.datasets[0].data.shift();
  }

  progressChart.update();
}

function initializeStudentList() {
  const studentList = document.querySelector(".student-list");
  const students = [
    { name: "John Doe", id: "001", average: 85 },
    { name: "Jane Smith", id: "002", average: 92 },
    { name: "Mike Johnson", id: "003", average: 78 },
    // Add more students as needed
  ];

  students.forEach((student) => {
    const studentCard = document.createElement("div");
    studentCard.className = "student-card";
    studentCard.innerHTML = `
      <div class="student-info">
        <h4>${student.name}</h4>
        <p>ID: ${student.id}</p>
        <p>Average: ${student.average}%</p>
      </div>
      <button class="submit-btn" onclick="enterScore('${student.name}')">
        Enter Score
      </button>
    `;
    studentList.appendChild(studentCard);
  });
}

function enterScore(studentName) {
  const scoreEntry = document.getElementById("scoreEntry");
  const studentNameInput = document.getElementById("studentName");

  scoreEntry.classList.remove("hidden");
  studentNameInput.value = studentName;

  // Scroll to score entry section
  scoreEntry.scrollIntoView({ behavior: "smooth" });
}

// Helper function to show notifications
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function initializeProgressCharts() {
  const subjectCtx = document.getElementById("subjectChart").getContext("2d");
  const progressCtx = document.getElementById("progressChart").getContext("2d");

  new Chart(subjectCtx, {
    type: "bar",
    data: {
      labels: ["Mathematics", "Science", "Literature", "History"],
      datasets: [
        {
          label: "Performance",
          data: [75, 60, 85, 45],
          backgroundColor: ["#81C784", "#64B5F6", "#FFB74D", "#BA68C8"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  new Chart(progressCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Overall Progress",
          data: [65, 70, 75, 80, 85, 78],
          borderColor: "#4CAF50",
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(76, 175, 80, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

function displayStudentList(subject) {
  const studentList = document.querySelector("#progressView .student-list");
  if (!studentList) return;

  // Clear existing content
  studentList.innerHTML = "";

  // Get fresh data from localStorage
  const students = JSON.parse(localStorage.getItem("students")) || [];

  const studentsInSubject = students.filter(
    (student) => student.scores[subject]
  );

  if (studentsInSubject.length === 0) {
    studentList.innerHTML =
      '<div class="no-data-message">No students found for this subject</div>';
    return;
  }

  // Add a header with total count and view all button
  studentList.innerHTML = `
    <div class="student-list-header">
      <h4>Students (${studentsInSubject.length})</h4>
      <button class="toggle-list-btn" onclick="toggleStudentList(this)">
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
    <div class="student-list-content hidden">
      ${studentsInSubject
        .map((student) => {
          const scores = student.scores[subject];
          const average =
            scores.reduce((sum, score) => sum + score.score, 0) / scores.length;

          return `
            <div class="student-item" 
              data-student-id="${student.id}"
              data-subject="${subject}"
              onclick="window.showStudentData('${student.id}', '${subject}')"
            >
              <div class="student-info">
                <h4>${student.name}</h4>
                <p>ID: ${student.id}</p>
              </div>
              <div class="score-info">
                <div class="average-score">${Math.round(average)}%</div>
                <div class="score-details">
                  ${scores
                    .map(
                      (score) => `
                    <div class="score-entry">
                      ${score.score}% <small>${score.type}</small>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>`;
}

window.showStudentData = function (studentId, subject) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  document.querySelector(".selected-student").textContent = student.name;

  updateProgressChart([
    {
      name: student.name,
      scores: student.scores[subject],
    },
  ]);
};

window.showAllStudents = function () {
  const selectedStudent = document.querySelector(".selected-student");
  const viewAllBtn = document.querySelector(".view-all-btn");

  if (selectedStudent) {
    selectedStudent.textContent = "All Students";
  }
  if (viewAllBtn) {
    viewAllBtn.classList.remove("visible");
    // Wait for animation to complete before hiding
    setTimeout(() => {
      viewAllBtn.style.display = "none";
    }, 300);
  }

  // Remove active class from all student items
  const studentItems = document.querySelectorAll(".student-item");
  studentItems.forEach((item) => item.classList.remove("active"));

  const subjectData = getSubjectData(window.currentSubject.toLowerCase());
  updateProgressChart(subjectData);
};

function updateCategoryStats() {
  const subject = currentSubject.toLowerCase();
  const studentsInSubject = students.filter(
    (student) => student.scores[subject]
  );

  // Calculate total progress
  let totalProgress = 0;
  let totalAssignments = 0;
  let completedAssignments = 0;

  studentsInSubject.forEach((student) => {
    const scores = student.scores[subject];
    // Calculate average score for this student
    const studentAverage =
      scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
    totalProgress += studentAverage;

    // Count assignments
    scores.forEach((score) => {
      totalAssignments++;
      if (score.score >= 60) {
        // Consider assignment complete if score >= 60
        completedAssignments++;
      }
    });
  });

  // Calculate final averages
  const averageProgress = studentsInSubject.length
    ? Math.round(totalProgress / studentsInSubject.length)
    : 0;

  // Update the stats in the UI
  const progressStats = document.querySelector(".progress-stats");
  if (progressStats) {
    progressStats.innerHTML = `
      <div class="stat-card">
        <h3>Total Progress</h3>
        <div class="stat-value">${averageProgress}%</div>
        <div class="progress-bar">
          <div class="progress" style="width: ${averageProgress}%"></div>
        </div>
      </div>
      <div class="stat-card">
        <h3>Assignments</h3>
        <div class="stat-value">${completedAssignments}/${totalAssignments}</div>
        <div class="progress-bar">
          <div class="progress" style="width: ${
            (completedAssignments / totalAssignments) * 100
          }%"></div>
        </div>
      </div>
      <div class="stat-card">
        <h3>Students Enrolled</h3>
        <div class="stat-value">${studentsInSubject.length}</div>
        <div class="student-list-preview">
          ${studentsInSubject
            .slice(0, 3)
            .map(
              (student) => `
            <div class="student-preview">
              <span class="student-name">${student.name}</span>
              <span class="student-score">${Math.round(
                student.scores[subject].reduce(
                  (sum, score) => sum + score.score,
                  0
                ) / student.scores[subject].length
              )}%</span>
            </div>
          `
            )
            .join("")}
          ${
            studentsInSubject.length > 3
              ? `<div class="more-students">+${
                  studentsInSubject.length - 3
                } more</div>`
              : ""
          }
        </div>
      </div>
    `;
  }
}

window.toggleStudentList = function (btn) {
  const content = btn
    .closest(".student-list")
    .querySelector(".student-list-content");
  const icon = btn.querySelector("i");

  content.classList.toggle("hidden");
  icon.classList.toggle("fa-chevron-down");
  icon.classList.toggle("fa-chevron-up");

  if (!content.classList.contains("hidden")) {
    content.style.maxHeight = content.scrollHeight + "px";
  } else {
    content.style.maxHeight = null;
  }
};
