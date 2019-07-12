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
  if (list.length === 0) {
    clearContainer();
    return;
  }

  clearContainer();
  list.forEach(element => {
    addNewNoteOnScreen(element);
  });
  idCount.setId(list[list.length - 1].id);
};

const clearContainer = (container = "notes_list") => {
  var element = getById(container);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const addNewNoteOnScreen = note => {
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
  getById("discardChanges").addEventListener("click", discardChanges);
  getById("delete").addEventListener("click", deleteNote);
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
    addNewNoteOnScreen(note);
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
  let noteId = 0;
  const list = getFromStorage("notes");
  const noteTitleInput = getById("note_title");
  const noteContentInput = getById("note_content");
  let nodeElement = e.target;
  while (!nodeElement.classList.contains("card")) {
    nodeElement = nodeElement.parentElement;
  }
  setBorderOfNotesToDefault(nodeElement);
  setBorderOfSelectedNote(nodeElement);
  noteId = parseInt(nodeElement.id);
  noteIndex = parseInt(getNoteIndex(list, noteId));
  note = list[noteIndex];
  saveInStorage("currentNote", note);
  if (!note.title) note.tile = "";
  if (!note.content) note.content = "";
  noteTitleInput.value = note.title;
  noteContentInput.value = note.content;
};

const deleteNote = () => {
  if (!isNote()) return;
  const modalWrapper = getById("modal_wrapper");
  modalWrapper.innerHTML = modal(getFromStorage("currentNote"));
  $("#erase_modal").modal("show");
  addModalEventListener();
};

const isNote = () => {
  const isThere = getFromStorage("currentNote").id;
  return isThere;
};

const addModalEventListener = () => {
  const confirmButton = getById("confirm");
  confirmButton.addEventListener("click", finishErasing);
};

const finishErasing = () => {
  $("#erase_modal").modal("hide");
  const id = getFromStorage("currentNote").id;
  const notesList = getFromStorage("notes");
  getById("note_form").reset();
  const indexNoteToDelete = getNoteIndex(notesList, id);
  notesList.splice(indexNoteToDelete, 1);
  saveInStorage("notes", notesList);
  saveInStorage("currentNote", {});
  showNotesList();
};

const discardChanges = () => {
  saveInStorage("currentNote", {});
  getById("note_form").reset();
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

let modal = note => {
  return `<div class="modal fade" id="erase_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">
          Please confirm deletion:
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card-body">
          <h5 class="card-title">${note.title}</h5>
          <p class="card-text">
          ${note.content}
          </p>
          <a href="#" class="card-link">Card link</a>
        </div>
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-secondary" id="confirm">Delete</button>
      <button type="button" class="btn btn-success" data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>`;
};

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
