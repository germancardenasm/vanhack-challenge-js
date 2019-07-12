import "../styles/index.scss";

let idCount = notesIdCounter();

const init = () => {
  if (!notesAlreadyExist()) {
    createWelcomeNote();
  }

  showNotesList();

  saveInStorage("currentNote", {});
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

const showNotesList = () => {
  const list = getFromStorage("notes");
  clearContainer();
  list.forEach(element => {
    appendNoteOnScreen(element);
  });
  idCount.setId(list[list.length - 1].id);
};

const clearContainer = (section = "notes_list") => {
  var myNode = getById(section);
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
};

const appendNoteOnScreen = note => {
  const notes_list = getById("notes_list");
  let newNote = new Note(
    note.title,
    note.content,
    note.id,
    note.dateCreated,
    note.dataModified
  );
  let noteContainer = document.createElement("div");
  noteContainer.classList.add("card");
  noteContainer.id = note.id;
  noteContainer.innerHTML = newNote.noteHTML;
  notes_list.appendChild(noteContainer);
};

const addEventListeners = () => {
  getById("save").addEventListener("click", saveNote);
  getById("color_picker").addEventListener("click", selectColor);
  getById("add_note").addEventListener("click", addNote);
  getById("notes_list").addEventListener("click", loadSelectedNote);
};

const addNote = () => {
  console.log("add note");
};

const saveNote = e => {
  e.preventDefault();
  const notesList = getFromStorage("notes");
  const currentNote = getFromStorage("currentNote");

  if (isEditingNote()) {
    const updatedCurrentNote = updateNote(currentNote);
    const indexCurrentNote = getNoteIndex(notesList, updatedCurrentNote.id);
    notesList[indexCurrentNote] = updatedCurrentNote;
    saveInStorage("currentNote", updatedCurrentNote);
    saveInStorage("notes", notesList);
    showNotesList();
  } else {
    const data = getScreenNoteData();
    const note = new Note(data.title, data.content, idCount.getId());
    notesList.push(note);
    saveInStorage("notes", notesList);
    saveInStorage("currentNote", note);
    appendNoteOnScreen(note);
  }
};

const getNoteIndex = (notesList, id) => notesList.findIndex(e => e.id === id);

const isEditingNote = () => {
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

const loadSelectedNote = e => {
  if (!isNoteContainer(e)) return;

  let note = {};
  let noteIndex = 0;
  const list = getFromStorage("notes");
  const noteTitleInput = getById("note_title");
  const noteContentInput = getById("note_content");
  let nodeElement = e.target;
  while (!nodeElement.classList.contains("card")) {
    nodeElement = nodeElement.parentElement;
  }
  setBorderOfNotesToDefault(nodeElement);
  setBorderOfSelectedNote(nodeElement);
  noteIndex = parseInt(nodeElement.id - 1);
  note = list[noteIndex];
  saveInStorage("currentNote", note);
  noteTitleInput.value = note.title;
  noteContentInput.value = note.content;
};

const setBorderOfNotesToDefault = note => {
  const listContainer = note.parentElement;
  const notes = [...listContainer.childNodes];
  notes.forEach(note => note.classList.remove("selected"));
};

const setBorderOfSelectedNote = nodeElement => {
  nodeElement.classList.toggle("selected");
};

const isNoteContainer = e => {
  const isIt =
    e.target.parentElement.classList.contains("card-body") ||
    e.target.parentElement.classList.contains("card");
  return isIt;
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
