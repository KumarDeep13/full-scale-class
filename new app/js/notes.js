document.addEventListener("DOMContentLoaded", function () {
  const notesContainer = document.querySelector(".notes-container");
  const addNoteBtn = document.querySelector(".add-note-btn");

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  function createNoteElement(note) {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note-card");
    noteElement.innerHTML = `
      <div class="note-content">
        <p>${note.content}</p>
        <small>${new Date(note.date).toLocaleDateString()}</small>
      </div>
      <button class="delete-note" data-id="${note.id}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    return noteElement;
  }

  function renderNotes() {
    notesContainer.innerHTML = "";
    notes.forEach((note) => {
      notesContainer.appendChild(createNoteElement(note));
    });
  }

  function addNote() {
    const content = prompt("Enter your note:");
    if (content) {
      const note = {
        id: Date.now(),
        content,
        date: new Date(),
      };
      notes.push(note);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    }
  }

  addNoteBtn.addEventListener("click", addNote);
  renderNotes();
});
