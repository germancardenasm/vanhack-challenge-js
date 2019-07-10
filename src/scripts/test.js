class Note {
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
}

let a = new Note();
a.setContent = "Esta es la nota de prueba";
a.note; //?

let idCounter = notesIdCounter();

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

idCounter.getId(); //?

idCounter.increaseId(); //?

idCounter.getId(); //?

idCounter.increaseId(); //?

idCounter.decreseId(); //?

idCounter.decreseId(); //?

idCounter.decreseId(); //?

idCounter.decreseId(); //?
idCounter.setId(10);
idCounter.getId(); //?
