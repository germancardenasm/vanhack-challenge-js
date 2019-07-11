import "../styles/index.scss";

let idCount = notesIdCounter();

const init = () => {
  if (!notesAlreadyExist()) createWelcomeNote();
  addEventListeners();
};

const notesAlreadyExist = () => localStorage.getItem("notes");

const createWelcomeNote = () => {
  saveInStorage("notes", [
    new Note(
      "This is a example note",
      new Date(),
      new Date(),
      `Hi, and thanks for using the new NoteApp`
    )
  ]);
};

const addEventListeners = () => {
  document.getElementById("save").addEventListener("click", saveNote);
  document
    .getElementById("color_picker")
    .addEventListener("click", selectColor);
  document.getElementById("add_note").addEventListener("click", addNote);
};
const addNote = () => {
  console.log("add note");
};

const saveNote = e => {
  e.preventDefault();
  const title = document.getElementById("note_title").value;
  const content = document.getElementById("note_content").value;
  const current_note = new Note(title, content, idCount.getId);
  const notes = getFromStorage("notes");
  notes.push(current_note);
  saveInStorage("notes", notes);
};

const loadNote = () => {};

const selectColor = () => {
  console.log("selectColor");
};

const saveInStorage = (name, value) =>
  localStorage.setItem(name, JSON.stringify(value));

const getFromStorage = name => JSON.parse(localStorage.getItem(name));

const Note = class {
  constructor(
    title = "",
    content = "",
    id = 0,
    dateCreated = new Date(),
    dateModified = new Date()
  ) {
    this.title = title;
    this.content = content;
    this.id = id;
    this.dateCreated = dateCreated;
    this.dateModified = dateModified;
  }

  setContent(note_content) {
    this.content = note_content;
  }
  setTitle(note_title) {
    this.title = note_title;
  }
  setDateCreated(date) {
    this.dateCreated = date;
  }
  setDateModified(date) {
    this.dateModified = date;
  }

  get note() {
    return {
      title: this.title,
      dateCreated: this.dateCreated,
      lastModified: this.dateModified,
      text: this.text
    };
  }
};

function notesIdCounter() {
  let id = 0;
  return {
    increaseId: function() {
      return ++id;
    },
    decreseId: function() {
      if (id === 0) return 0;
      return --id;
    },
    getId: function() {
      return id;
    },
    setId: function(n) {
      id = n;
    }
  };
}

init();
