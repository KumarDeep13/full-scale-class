document.addEventListener("DOMContentLoaded", function () {
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  const calendarDays = document.querySelector(".calendar-days");
  const monthDisplay = document.querySelector(".calendar-header h3");
  const prevMonthBtn = document.querySelector(".prev-month");
  const nextMonthBtn = document.querySelector(".next-month");

  // Calendar navigation
  prevMonthBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    const monthLength = lastDay.getDate();

    // Update month/year display
    const months = [
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
    monthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;

    // Create calendar grid
    let calendarHTML = `
      <div class="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div class="days">
    `;

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      calendarHTML += '<div class="calendar-day empty"></div>';
    }

    // Add days of the month
    for (let day = 1; day <= monthLength; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSunday = date.getDay() === 0;

      calendarHTML += `
        <div class="calendar-day${isToday ? " current-date" : ""}${
        isSunday ? " sunday" : ""
      }" 
             data-date="${date.toISOString().split("T")[0]}">
          ${day}
        </div>
      `;
    }

    calendarHTML += "</div>";
    calendarDays.innerHTML = calendarHTML;

    // Add click handlers to days
    document.querySelectorAll(".calendar-day:not(.empty)").forEach((day) => {
      day.addEventListener("click", () => {
        // Remove selected class from all days
        document
          .querySelectorAll(".calendar-day")
          .forEach((d) => d.classList.remove("selected"));
        // Add selected class to clicked day
        day.classList.add("selected");
        const selectedDate = day.dataset.date;
        showEventsForDate(selectedDate);
      });
    });
  }

  function showEventsForDate(date) {
    // Get events from localStorage or use empty array
    const events = JSON.parse(localStorage.getItem("calendar_events")) || [];
    const dayEvents = events.filter((event) => event.date === date);

    const scheduleList = document.querySelector(".schedule-items");
    if (dayEvents.length === 0) {
      scheduleList.innerHTML =
        '<p class="no-events">No events scheduled for this day</p>';
    } else {
      scheduleList.innerHTML = dayEvents
        .map(
          (event) => `
        <div class="schedule-item ${event.type}">
          <div class="event-time">${event.time}</div>
          <div class="event-details">
            <h4>${event.title}</h4>
            <p>${event.description || ""}</p>
          </div>
        </div>
      `
        )
        .join("");
    }
  }

  // Initial render
  renderCalendar();
  showEventsForDate(new Date().toISOString().split("T")[0]);
});
