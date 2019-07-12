const param = {
  title: "german",
  content: "cardenas",
  id: 3,
  dateCreated: new Date(),
  dateModified: new Date()
};

class Note {
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
}

var note = new Note(param); //?
note;

/* let a = new Note();
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
 */
