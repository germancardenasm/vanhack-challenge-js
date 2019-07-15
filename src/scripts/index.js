import "../styles/index.scss";

let idCount = notesIdCounter();

const init = () => {
  if (!notesAlreadyExist()) createWelcomeNote();
  saveInStorage("currentNote", {});
  showNotes();
  addEventListeners();
};

const notesAlreadyExist = () => localStorage.getItem("notes");

const createWelcomeNote = () => {
  const welcomeNote = new Note(
    "This is a example note",
    `Hi, and thanks for using the new NoteApp`,
    idCount.getId(),
    "white",
    new Date(),
    new Date()
  );
  saveInStorage("notes", [welcomeNote]);
};

const showNotes = () => {
  const list = getFromStorage("notes");
  clearNotesContainer();
  if (list.length === 0) return;
  list.forEach(element => {
    addNewNoteOnScreen(element);
  });
  idCount.setId(list[list.length - 1].id);
};

const clearNotesContainer = (container = "notes_list") => {
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
    note.color,
    note.dateCreated,
    note.dataModified
  );
  let noteContainer = document.createElement("div");
  noteContainer.classList.add("card_container");
  noteContainer.innerHTML = newNote.noteHTML;
  notes_list.appendChild(noteContainer);
};

const addEventListeners = () => {
  getById("add_note").addEventListener("click", discardChanges);
  getById("save").addEventListener("click", saveNote);
  getById("discardChanges").addEventListener("click", discardChanges);
  getById("delete").addEventListener("click", deleteNote);
  getById("color_picker").addEventListener("click", selectColor);
  getById("notes_list").addEventListener("click", loadSelectedNote);
  $("#collapseDiv").on("hidden.bs.collapse", function(e) {
    const btn = getById("collapseBtn");
    btn.innerHTML = `<i class="collapse_icon fas fa-caret-down"></i>`;
  });
  $("#collapseDiv").on("shown.bs.collapse", function(e) {
    const btn = getById("collapseBtn");
    btn.innerHTML = `<i class="collapse_icon fas fa-caret-up"></i>`;
  });
};

const addNote = () => {
  console.log("add note");
};

const saveNote = e => {
  const notesList = getFromStorage("notes");
  const currentNote = getFromStorage("currentNote");
  const color = getNoteColor();
  if (isEditingNote()) {
    const updatedCurrentNote = updateNote(currentNote);
    const indexCurrentNote = getNoteIndex(notesList, updatedCurrentNote.id);
    notesList[indexCurrentNote] = updatedCurrentNote;
    saveInStorage("currentNote", updatedCurrentNote);
    saveInStorage("notes", notesList);
  } else {
    const data = getScreenData();
    const note = new Note(
      data.title,
      data.content,
      idCount.getId(),
      data.color
    );
    notesList.push(note);
    saveInStorage("notes", notesList);
    saveInStorage("currentNote", note);
  }
  removeSelectionBorder();
  showNotes();
  drawBorderOnCurrenNote();
};

const getNoteColor = () => {
  const colors = getById("color_picker").children;
  for (let i = 1; i < colors.length; i++) {
    if (colors[i].classList.contains("selected")) {
      console.log(colors[i].id);
      return colors[i].id;
    }
  }
};

const getNoteIndex = (notesList, id) => notesList.findIndex(e => e.id === id);

const isEditingNote = () => {
  const noteExist = getFromStorage("currentNote").id >= 0;
  if (noteExist) return true;
  return false;
};

const getScreenData = () => {
  const title = getById("note_title").value;
  const content = getById("note_content").value;
  return { title: title, content: content, color: getNoteColor() };
};

const updateNote = note => {
  const inScreenData = getScreenData();
  const updatedNote = new Note(
    inScreenData.title,
    inScreenData.title,
    note.id,
    inScreenData.color,
    note.dateCreated,
    new Date()
  );
  return updatedNote;
};

const drawBorderOnCurrenNote = () => {
  const notesContainer = getById("notes_list");
  const list = [...notesContainer.children];
  const id = getFromStorage("currentNote").id;
  const noteIndex = list.findIndex(
    e => parseInt(e.firstElementChild.id) === id
  );
  removeSelectionBorder();
  toggleClassFromElement(notesContainer.children[noteIndex], "selected");
};

const loadSelectedNote = e => {
  if (!isNoteContainer(e)) return;

  let note = {};
  let noteIndex = 0;
  let noteId = 0;
  const list = getFromStorage("notes");
  let noteElement = e.target;
  while (!noteElement.classList.contains("card_container")) {
    noteElement = noteElement.parentElement;
  }
  removeClassFromList(noteElement.parentElement.children, "selected");
  toggleClassFromElement(noteElement, "selected");
  noteId = parseInt(noteElement.firstChild.id);
  noteIndex = parseInt(getNoteIndex(list, noteId));
  note = list[noteIndex];
  saveInStorage("currentNote", note);
  fillNoteOnScreen(note);
  positionFigureCentered(noteId, "h");
};

const positionFigureCentered = (id, direction = "h") => {
  const figure = getById(id);
  const container = getById("collapseDiv");
  let viewPortWidth = window.innerWidth || document.documentElement.clientWidth;
  let viewPortHeight =
    window.innerHeight || document.documentElement.clientHeight;
  let figureRectangle = figure.getBoundingClientRect();
  let destinationHorizontalPoint =
    viewPortWidth / 2 - figureRectangle.width / 2;
  let destinationVerticalPoint =
    viewPortHeight / 2 - figureRectangle.height / 2;
  let distanceHorizontal = figureRectangle.x - destinationHorizontalPoint;
  let distanceVertical = figureRectangle.y - destinationVerticalPoint;
  if (direction === "h") {
    container.scrollBy({
      top: 0,
      left: distanceHorizontal,
      behavior: "smooth"
    });
  } else {
    container.scrollBy({
      top: distanceVertical,
      left: 0,
      behavior: "smooth"
    });
  }
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
  showNotes();
};

const discardChanges = () => {
  removeSelectionBorder();
  saveInStorage("currentNote", {});
  getById("note_form").reset();
};

const removeSelectionBorder = () => {
  const list = getById("notes_list").children;
  removeClassFromList(list, "selected");
};

const removeClassFromList = (list, classToRemove) => {
  const notes = [...list];
  notes.forEach(note => note.classList.remove(classToRemove));
};

const toggleClassFromElement = (nodeElement, classToToggle) => {
  nodeElement.classList.toggle(classToToggle);
};

const isNoteContainer = e => {
  const isIt =
    e.target.parentElement.classList.contains("card-body") ||
    e.target.parentElement.classList.contains("card");
  return isIt;
};

const fillNoteOnScreen = note => {
  const noteTitleInput = getById("note_title");
  const noteContentInput = getById("note_content");
  const colorsList = getById("color_picker").children;
  const noteColor = getById(note.color);
  removeClassFromList(colorsList, "selected");
  toggleClassFromElement(noteColor, "selected");

  if (!note.title) note.tile = "";
  if (!note.content) note.content = "";

  noteTitleInput.value = note.title;
  noteContentInput.value = note.content;
};

const selectColor = e => {
  if (!e.target.classList.contains("color")) return;
  removeClassFromList(e.target.parentElement.children, "selected");
  toggleClassFromElement(e.target, "selected");
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
      <div class='card'> 
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
  </div>
</div>`;
};

const Note = class {
  constructor(
    title = "",
    content = "",
    id = 0,
    color = "white",
    dateCreated = new Date(),
    dateModified = new Date()
  ) {
    this.title = title;
    this.content = content;
    this.id = id;
    this.color = color;
    this.dateCreated = dateCreated;
    this.dateModified = dateModified;
    this.colors = {
      white: "bg-light",
      blue: "bg-primary",
      red: "bg-danger",
      green: "bg-success"
    };
  }
  setTitle(note_title) {
    this.title = note_title;
  }
  setContent(note_content) {
    this.content = note_content;
  }
  setColor(note_color) {
    this.color = note_color;
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
      color: this.color,
      dateCreated: this.dateCreated,
      lastModified: this.dateModified
    };
  }

  get noteHTML() {
    return `<div id=${this.id} class="card ${this.colors[this.color]}">
              <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <p class="card-text">
                  ${this.content}
                </p>
              </div>
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
