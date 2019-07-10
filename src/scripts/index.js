import "../styles/index.scss";

const init = () => {
  if (!notesAlreadyExist()) createWelcomeNote();
  addEventListeners();
};

const notesAlreadyExist = () => localStorage.getItem("notes");

const createWelcomeNote = () => {
  saveInStorage(
    "notes",
    new Note(
      "This is a example note",
      new Date(),
      new Date(),
      `Hi, and thanks for using the new NoteApp`
    )
  );
};

const addEventListeners = () => {
  document.getElementById("save").addEventListener("click", saveNote);
  document
    .getElementById("color_picker")
    .addEventListener("click", selectColor);
  document.getElementById("add_note").addEventListener("click", addNote);
};

const saveNote = e => {
  e.preventDefault;
  console.log("save note");
};
const selectColor = () => {
  console.log("selectColor");
};
const addNote = () => {
  console.log("add note");
};

const saveInStorage = (name, value) =>
  localStorage.setItem(name, JSON.stringify(value));

const getFromStorage = name => JSON.parse(localStorage.getItem(name));

const Note = class {
  constructor(
    title = "",
    dateCreated = new Date(),
    dateModified = new Date(),
    content = ""
  ) {
    this.title = title;
    this.dateCreated = dateCreated;
    this.dateModified = dateModified;
    this.content = content;
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

init();
