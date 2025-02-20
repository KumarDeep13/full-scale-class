// Initialize students from localStorage or use default data
let students = JSON.parse(localStorage.getItem("students")) || [
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
  {
    id: "003",
    name: "Mike Johnson",
    scores: {
      science: {
        initial: [{ score: 75, date: "2024-03-01" }],
        midterm: [{ score: 82, date: "2024-03-15" }],
        final: [],
      },
      history: {
        initial: [{ score: 95, date: "2024-03-02" }],
        midterm: [{ score: 89, date: "2024-03-16" }],
        final: [],
      },
    },
  },
  // Add more students...
];

// Function to save students data to localStorage
function saveStudentsData() {
  localStorage.setItem("students", JSON.stringify(students));
}

document.addEventListener("DOMContentLoaded", function () {
  // Get students data from localStorage
  let students = JSON.parse(localStorage.getItem("students")) || [];
  const studentsGrid = document.querySelector(".students-grid");

  // Create modal for adding new student
  const modalHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Student</h2>
          <button class="close-modal">&times;</button>
        </div>
        <form class="student-form" id="addStudentForm">
          <div class="form-group">
            <label for="studentName">Student Name</label>
            <input type="text" id="studentName" required>
          </div>
          <div class="form-group">
            <label for="studentId">Student ID</label>
            <input type="text" id="studentId" required>
          </div>
          <div class="form-group">
            <label>Initial Subject Scores</label>
            <div class="subject-scores-input">
              <div class="score-row">
                <select class="subject-select" required>
                  <option value="">Select Subject</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="literature">Literature</option>
                  <option value="history">History</option>
                </select>
                <input type="number" class="score-input" min="0" max="100" placeholder="Score" required>
                <input type="date" class="date-input" required>
              </div>
            </div>
            <button type="button" class="add-subject-btn">
              <i class="fas fa-plus"></i> Add Subject
            </button>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Add Student</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Modal elements
  const modalOverlay = document.querySelector(".modal-overlay");
  const closeModalBtn = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");
  const addStudentBtn = document.querySelector(".add-student-btn");
  const addStudentForm = document.getElementById("addStudentForm");

  // Modal functions
  const openModal = () => modalOverlay.classList.add("active");
  const closeModal = () => {
    modalOverlay.classList.remove("active");
    addStudentForm.reset();
    // Reset form state
    const studentIdInput = document.getElementById("studentId");
    studentIdInput.disabled = false;
    document.querySelector(".submit-btn").textContent = "Add Student";
    addStudentForm.onsubmit = handleAddStudent; // Reset to default handler
    // Clear all subject rows except the first one
    const subjectRows = document.querySelectorAll(".score-row");
    for (let i = 1; i < subjectRows.length; i++) {
      subjectRows[i].remove();
    }
  };

  // Event listeners for modal
  addStudentBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Add subject row functionality
  const addSubjectBtn = modalOverlay.querySelector(".add-subject-btn");
  addSubjectBtn.addEventListener("click", () => {
    const scoreRow = document.createElement("div");
    scoreRow.className = "score-row";
    scoreRow.innerHTML = `
      <select class="subject-select" required>
        <option value="">Select Subject</option>
        <option value="mathematics">Mathematics</option>
        <option value="science">Science</option>
        <option value="literature">Literature</option>
        <option value="history">History</option>
      </select>
      <input type="number" class="score-input" min="0" max="100" placeholder="Score" required>
      <input type="date" class="date-input" required>
      <button type="button" class="remove-subject-btn" onclick="this.parentElement.remove()">
        <i class="fas fa-minus"></i>
      </button>
    `;
    modalOverlay.querySelector(".subject-scores-input").appendChild(scoreRow);
  });

  // Handle form submission for adding new student
  function handleAddStudent(e) {
    e.preventDefault();
    const scores = {};

    // Collect scores from all score rows
    this.querySelectorAll(".score-row").forEach((row) => {
      const subject = row.querySelector(".subject-select").value;
      const score = parseInt(row.querySelector(".score-input").value);
      const date = row.querySelector(".date-input").value;

      if (subject && !isNaN(score) && date) {
        if (!scores[subject]) {
          scores[subject] = [];
        }
        scores[subject].push({
          score: score,
          date: date,
          type: "initial",
        });
      }
    });

    const newStudent = {
      id: this.studentId.value,
      name: this.studentName.value,
      scores: scores,
    };

    students.push(newStudent);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    closeModal();
    showNotification("Student added successfully!");
  }

  // Add the default form submission handler
  addStudentForm.onsubmit = handleAddStudent;

  // Function to show notifications
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Function to display students
  function displayStudents(filteredStudents = students) {
    studentsGrid.innerHTML = filteredStudents
      .map((student) => {
        const initials = student.name
          .split(" ")
          .map((n) => n[0])
          .join("");

        const subjectScores = Object.entries(student.scores)
          .map(([subject, scores]) => {
            const average =
              scores.reduce((sum, score) => sum + score.score, 0) /
              scores.length;
            return `
              <div class="subject-score">
                <span class="subject-name">${
                  subject.charAt(0).toUpperCase() + subject.slice(1)
                }</span>
                <span class="score-value">${Math.round(average)}%</span>
              </div>
            `;
          })
          .join("");

        return `
          <div class="student-record-card">
            <div class="student-header">
              <div class="student-avatar">
                ${initials}
              </div>
              <div class="student-basic-info">
                <h3>${student.name}</h3>
                <p>ID: ${student.id}</p>
              </div>
              <div class="student-actions">
                <button class="edit-btn" onclick="handleEdit('${student.id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="handleDelete('${student.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="subject-scores">
              ${subjectScores}
            </div>
          </div>
        `;
      })
      .join("");
  }

  // Make functions available globally
  window.handleEdit = function (studentId) {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const studentNameInput = document.getElementById("studentName");
    const studentIdInput = document.getElementById("studentId");
    const subjectScoresInput = document.querySelector(".subject-scores-input");

    studentNameInput.value = student.name;
    studentIdInput.value = student.id;
    studentIdInput.disabled = true;

    // Clear existing subject rows
    subjectScoresInput.innerHTML = "";

    // Add existing subject scores
    Object.entries(student.scores).forEach(([subject, scores]) => {
      scores.forEach((score) => {
        const scoreRow = document.createElement("div");
        scoreRow.className = "score-row";
        scoreRow.innerHTML = `
          <select class="subject-select" required>
            <option value="mathematics" ${
              subject === "mathematics" ? "selected" : ""
            }>Mathematics</option>
            <option value="science" ${
              subject === "science" ? "selected" : ""
            }>Science</option>
            <option value="literature" ${
              subject === "literature" ? "selected" : ""
            }>Literature</option>
            <option value="history" ${
              subject === "history" ? "selected" : ""
            }>History</option>
          </select>
          <input type="number" class="score-input" min="0" max="100" value="${
            score.score
          }" required>
          <input type="date" class="date-input" value="${score.date}" required>
          <button type="button" class="remove-subject-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-minus"></i>
          </button>
        `;
        subjectScoresInput.appendChild(scoreRow);
      });
    });

    // Change form submit button text
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.textContent = "Update Student";

    // Show modal
    modalOverlay.classList.add("active");

    // Update form submission handler
    addStudentForm.onsubmit = function (e) {
      e.preventDefault();

      const scores = {};
      this.querySelectorAll(".score-row").forEach((row) => {
        const subject = row.querySelector(".subject-select").value;
        const score = parseInt(row.querySelector(".score-input").value);
        const date = row.querySelector(".date-input").value;

        if (subject && !isNaN(score) && date) {
          if (!scores[subject]) {
            scores[subject] = [];
          }
          scores[subject].push({
            score: score,
            date: date,
            type: "initial",
          });
        }
      });

      // Update student data
      const studentIndex = students.findIndex((s) => s.id === studentId);
      students[studentIndex] = {
        ...students[studentIndex],
        name: this.studentName.value,
        scores: scores,
      };

      // Save and refresh
      localStorage.setItem("students", JSON.stringify(students));
      displayStudents();
      closeModal();
      showNotification("Student updated successfully!");
    };
  };

  window.handleDelete = function (studentId) {
    if (confirm("Are you sure you want to delete this student?")) {
      students = students.filter((student) => student.id !== studentId);
      localStorage.setItem("students", JSON.stringify(students));
      displayStudents();
      showNotification("Student deleted successfully!");
    }
  };

  // Initial display
  displayStudents();

  // Search and filter functionality
  const searchInput = document.getElementById("searchStudent");
  const filterSubject = document.getElementById("filterSubject");

  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm)
    );
    displayStudents(filteredStudents);
  });

  filterSubject.addEventListener("change", function (e) {
    const subject = e.target.value;
    const filteredStudents =
      subject === "all"
        ? students
        : students.filter((student) => student.scores[subject]);
    displayStudents(filteredStudents);
  });

  // Save default data if localStorage is empty
  if (!localStorage.getItem("students")) {
    saveStudentsData();
  }
  initializeStudentList();
  setupEventListeners();

  // Add event listener for add score button
  document
    .querySelector(".add-score-btn")
    .addEventListener("click", addScoreRow);
});

function initializeStudentList() {
  const studentList = document.querySelector(".student-list");
  if (!studentList) return; // Guard clause if element not found

  studentList.innerHTML = ""; // Clear existing list

  // Check if we have students
  if (students.length === 0) {
    studentList.innerHTML = `
      <div class="no-data-message">
        No students found. Add a student to get started.
      </div>
    `;
    return;
  }

  students.forEach((student) => {
    const averages = calculateAverages(student.scores);
    const card = createStudentCard(student, averages);
    studentList.appendChild(card);
  });
}

function createStudentCard(student, averages) {
  if (!student || !student.scores) return null;

  const card = document.createElement("div");
  card.className = "student-card";

  // Get subjects the student is enrolled in
  const studentSubjects = Object.keys(student.scores);

  card.innerHTML = `
    <div class="student-info">
      <h4>${student.name || "Unknown Student"}</h4>
      <p>ID: ${student.id || "No ID"}</p>
      <p class="enrolled-subjects">Subjects: ${
        studentSubjects.length ? studentSubjects.join(", ") : "No subjects"
      }</p>
      <div class="subject-scores">
        ${Object.entries(student.scores)
          .map(
            ([subject, scores]) => `
            <div class="subject-score">
              <span class="subject-name">${subject}</span>
              <div class="exam-scores">
                ${(scores || [])
                  .map(
                    (score) => `
                    <div class="exam-type">
                      <span class="exam-label">${score.type}</span>
                      <div class="score-entry">
                        <span>${score.score}%</span>
                        <small>(${score.date})</small>
                      </div>
                    </div>
                  `
                  )
                  .join("")}
              </div>
              <div class="progress-bar">
                <div class="progress" style="width: ${
                  averages[subject] || 0
                }%"></div>
              </div>
              <span>${averages[subject] || 0}%</span>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
    <div class="student-actions">
      <button class="submit-btn" onclick="openScoreModal('${student.id}')">
        Enter Score
      </button>
      <button class="delete-btn" onclick="deleteStudent('${student.id}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  return card;
}

function calculateAverages(scores) {
  const averages = {};

  if (!scores) return averages;

  Object.entries(scores).forEach(([subject, scores]) => {
    if (scores && scores.length > 0) {
      const total = scores.reduce((sum, score) => sum + score.score, 0);
      averages[subject] = Math.round(total / scores.length);
    } else {
      averages[subject] = 0;
    }
  });

  return averages;
}

function openScoreModal(studentId) {
  const student = students.find((s) => s.id === studentId);
  const modal = document.getElementById("scoreModal");
  const studentNameInput = document.getElementById("modalStudentName");

  studentNameInput.value = student.name;
  modal.classList.remove("hidden");
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function setupEventListeners() {
  // Handle score form submission
  document
    .getElementById("scoreEntryForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const studentName = document.getElementById("modalStudentName").value;
      const subject = document.getElementById("modalSubject").value;
      const examType = document.getElementById("modalExamType").value;
      const score = parseInt(document.getElementById("modalScore").value);

      // Find student and update scores
      const student = students.find((s) => s.name === studentName);
      if (student) {
        if (!student.scores[subject]) {
          student.scores[subject] = {
            initial: [],
            midterm: [],
            final: [],
          };
        }

        student.scores[subject][examType].push({
          score: score,
          date: new Date().toISOString().split("T")[0],
        });

        // Save to localStorage after updating scores
        saveStudentsData();

        // Update display
        initializeStudentList();
        showNotification("Score added successfully!");
        closeModal();
      }
    });

  // Handle search
  document
    .getElementById("searchStudent")
    .addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const studentCards = document.querySelectorAll(".student-card");

      studentCards.forEach((card) => {
        const studentName = card.querySelector("h4").textContent.toLowerCase();
        card.style.display = studentName.includes(searchTerm) ? "flex" : "none";
      });
    });

  // Handle subject filter
  document
    .getElementById("filterSubject")
    .addEventListener("change", function (e) {
      const subject = e.target.value;
      const studentCards = document.querySelectorAll(".student-card");

      // Clear and rebuild student list with filter
      const studentList = document.querySelector(".student-list");
      studentList.innerHTML = "";

      students.forEach((student) => {
        if (subject === "all" || student.scores[subject]) {
          const averages = calculateAverages(student.scores);
          const card = createStudentCard(student, averages);
          studentList.appendChild(card);
        }
      });
    });
}

function openAddStudentModal() {
  document.getElementById("addStudentModal").classList.remove("hidden");
}

function closeAddStudentModal() {
  document.getElementById("addStudentModal").classList.add("hidden");
  document.getElementById("addStudentForm").reset();
  // Remove any extra score rows except the first one
  const scoreRows = document.querySelectorAll(".score-row");
  for (let i = 1; i < scoreRows.length; i++) {
    scoreRows[i].remove();
  }
}

function addScoreRow() {
  const scoreRow = document.createElement("div");
  scoreRow.className = "score-row";
  scoreRow.innerHTML = `
    <select class="subject-select">
      <option value="mathematics">Mathematics</option>
      <option value="science">Science</option>
      <option value="literature">Literature</option>
      <option value="history">History</option>
    </select>
    <input type="number" class="score-input" min="0" max="100" placeholder="Score" />
    <input type="date" class="date-input" />
    <button type="button" class="remove-score-btn" onclick="this.parentElement.remove()">-</button>
  `;
  document.querySelector(".subject-scores-input").appendChild(scoreRow);
}

// Add some CSS for the enrolled subjects
const style = document.createElement("style");
style.textContent = `
  .enrolled-subjects {
    color: var(--primary-color);
    font-size: 14px;
    margin: 5px 0;
  }
  
  .subject-name {
    font-weight: 500;
    text-transform: capitalize;
  }
`;
document.head.appendChild(style);

// Add function to delete student
function deleteStudent(studentId) {
  if (confirm("Are you sure you want to delete this student?")) {
    students = students.filter((student) => student.id !== studentId);
    saveStudentsData();
    initializeStudentList();
    showNotification("Student deleted successfully!");
  }
}

// Add CSS for no data message
const noDataStyle = document.createElement("style");
noDataStyle.textContent = `
  .no-data-message {
    text-align: center;
    padding: 40px 20px;
    color: var(--light-text);
    background-color: var(--section-4);
    border-radius: 12px;
    margin: 20px;
  }
`;
document.head.appendChild(noDataStyle);

function editStudent(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  // Populate modal with student data
  const studentNameInput = document.getElementById("studentName");
  const studentIdInput = document.getElementById("studentId");
  const subjectScoresInput = document.querySelector(".subject-scores-input");

  studentNameInput.value = student.name;
  studentIdInput.value = student.id;
  studentIdInput.disabled = true; // Don't allow ID editing

  // Clear existing subject rows
  subjectScoresInput.innerHTML = "";

  // Add existing subject scores
  Object.entries(student.scores).forEach(([subject, scores]) => {
    scores.forEach((score) => {
      const scoreRow = document.createElement("div");
      scoreRow.className = "score-row";
      scoreRow.innerHTML = `
        <select class="subject-select" required>
          <option value="mathematics" ${
            subject === "mathematics" ? "selected" : ""
          }>Mathematics</option>
          <option value="science" ${
            subject === "science" ? "selected" : ""
          }>Science</option>
          <option value="literature" ${
            subject === "literature" ? "selected" : ""
          }>Literature</option>
          <option value="history" ${
            subject === "history" ? "selected" : ""
          }>History</option>
        </select>
        <input type="number" class="score-input" min="0" max="100" value="${
          score.score
        }" required>
        <input type="date" class="date-input" value="${score.date}" required>
        <button type="button" class="remove-subject-btn" onclick="this.parentElement.remove()">
          <i class="fas fa-minus"></i>
        </button>
      `;
      subjectScoresInput.appendChild(scoreRow);
    });
  });

  // Change form submit button text
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "Update Student";

  // Show modal
  modalOverlay.classList.add("active");

  // Update form submission handler for edit mode
  const form = document.getElementById("addStudentForm");
  form.onsubmit = function (e) {
    e.preventDefault();

    const scores = {};
    this.querySelectorAll(".score-row").forEach((row) => {
      const subject = row.querySelector(".subject-select").value;
      const score = parseInt(row.querySelector(".score-input").value);
      const date = row.querySelector(".date-input").value;

      if (subject && !isNaN(score) && date) {
        if (!scores[subject]) {
          scores[subject] = [];
        }
        scores[subject].push({
          score: score,
          date: date,
          type: "initial",
        });
      }
    });

    // Update student data
    const studentIndex = students.findIndex((s) => s.id === studentId);
    students[studentIndex] = {
      ...students[studentIndex],
      name: this.studentName.value,
      scores: scores,
    };

    // Save and refresh
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    closeModal();

    // Show success message
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = "Student updated successfully!";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);

    // Reset form for next use
    this.reset();
    studentIdInput.disabled = false;
    submitBtn.textContent = "Add Student";
    form.onsubmit = null; // Remove edit mode handler
  };
}
