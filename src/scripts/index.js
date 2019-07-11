import "../styles/index.scss";

let idCount = notesIdCounter();

const init = () => {
  if (!notesAlreadyExist()) {
    createWelcomeNote();
    saveInStorage("currentNote", {});
  }
  addEventListeners();
};

const notesAlreadyExist = () => localStorage.getItem("notes");

const createWelcomeNote = () => {
  saveInStorage("notes", [
    new Note(
      "This is a example note",
      `Hi, and thanks for using the new NoteApp`,
      idCount.getId(),
      new Date(),
      new Date()
    )
  ]);
};

const addEventListeners = () => {
  getById("save").addEventListener("click", saveNote);
  getById("color_picker").addEventListener("click", selectColor);
  getById("add_note").addEventListener("click", addNote);
};

const addNote = () => {
  console.log("add note");
};

const saveNote = e => {
  e.preventDefault();
  const notesList = getFromStorage("notes");
  const currentNoteInStorage = getFromStorage("currentNote");

  if (itIsEditingNote()) {
    const updatedCurrentNote = updateNote(currentNoteInStorage);
    const indexCurrentNote = getNoteIndex(notesList, updatedCurrentNote.id);
    notesList[indexCurrentNote] = updatedCurrentNote;
    saveInStorage("currentNote", updatedCurrentNote);
    saveInStorage("notes", notesList);
  } else {
    const data = getScreenNoteData();
    const note = new Note(data.title, data.content, idCount.getId());
    notesList.push(note);
    saveInStorage("notes", notesList);
    saveInStorage("currentNote", note);
    loadNoteInList(note);
  }
};

const getNoteIndex = (notesList, id) => notesList.findIndex(e => e.id === id);

const itIsEditingNote = () => {
  const noteExist = getFromStorage("currentNote").id >= 0;
  if (noteExist) return true;
  return false;
};

const getScreenNoteData = () => {
  const title = getById("note_title").value;
  const content = getById("note_content").value;
  return { title: title, content: content };
};

const updateNote = note => {
  const noteInScreenData = getScreenNoteData();
  note.title = noteInScreenData.title;
  note.content = noteInScreenData.content;
  note.dateModified = new Date();
  return note;
};

const loadNoteInList = currentNote => {
  const notes_list = getById("notes_list");
  let note = document.createElement("div");
  note.classList.add("card");
  note.innerHTML = currentNote.noteHTML;
  notes_list.appendChild(note);
};

const selectColor = () => {
  console.log("selectColor");
};

const saveInStorage = (name, value) =>
  localStorage.setItem(name, JSON.stringify(value));

const getFromStorage = name => JSON.parse(localStorage.getItem(name));

const getById = id => document.getElementById(id);

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
      content: this.content,
      id: this.id,
      dateCreated: this.dateCreated,
      lastModified: this.dateModified
    };
  }

  get noteHTML() {
    return `<div class="card-body">
           <h5 class="card-title">${this.title}</h5>
           <p class="card-text">
            ${this.content}
           </p>
           <a href="#" class="card-link">Card link</a>
           <a href="#" class="card-link">Another link</a>
         </div>
        `;
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
      this.increaseId();
      return id;
    },
    setId: function(n) {
      id = n;
    }
  };
}

init();
