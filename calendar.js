function initializeCalendar() {
  const date = new Date();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const currentDate = date.getDate();

  function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const monthLength = lastDay.getDate();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const calendarHeader = document.querySelector(".calendar-header h3");
    calendarHeader.textContent = `${monthNames[month]} ${year}`;

    const calendarDays = document.querySelector(".calendar-days");
    calendarDays.innerHTML = "";

    // Add day labels
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayLabels.forEach((day) => {
      const dayLabel = document.createElement("div");
      dayLabel.className = `day-label ${day === "Sun" ? "sunday" : ""}`;
      dayLabel.textContent = day;
      calendarDays.appendChild(dayLabel);
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "calendar-day empty";
      calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= monthLength; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";

      // Check if it's a Sunday
      if (new Date(year, month, day).getDay() === 0) {
        dayElement.classList.add("sunday");
      }

      // Check if it's the current date
      if (
        day === currentDate &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear()
      ) {
        dayElement.classList.add("current-date");
      }

      dayElement.textContent = day;
      calendarDays.appendChild(dayElement);
    }
  }

  // Navigation buttons
  document.querySelector(".prev-month").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    generateCalendar(date.getMonth(), date.getFullYear());
  });

  document.querySelector(".next-month").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    generateCalendar(date.getMonth(), date.getFullYear());
  });

  // Initialize calendar
  generateCalendar(currentMonth, currentYear);
}

document.addEventListener("DOMContentLoaded", initializeCalendar);
