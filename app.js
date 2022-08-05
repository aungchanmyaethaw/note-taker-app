// Global Selector
const formEl = document.querySelector('form');
const modalEl = document.querySelector('#modal');
const noteContainerEl = document.querySelector('.note-container');
const titleInputEl = document.querySelector('#title');
const toggleBtnEl = document.querySelector('.toggle__btn');
const root = document.querySelector(':root');
let theme = 'light';
window.addEventListener('DOMContentLoaded', () => {
    setNotestoUI();
    if (localStorage.getItem('keep.theme')) {
        root.setAttribute('color-scheme', localStorage.getItem('keep.theme'));
        theme = localStorage.getItem('keep.theme');
    }
    toggleBtnEl.textContent = theme;
});

toggleBtnEl.addEventListener('click', () => {
    toggleTheme();
    const audio = document.querySelector('audio');

    audio.play();
});

class Note {
    constructor(title, body) {
        this.title = title;
        this.body = body;
        this.id = Math.floor(Math.random() * 2000);
    }
}

// --- Toggle Light and Dark Mode

function toggleTheme() {
    theme === 'light' ? (theme = 'dark') : (theme = 'light');
    toggleBtnEl.textContent = theme;
    localStorage.setItem('keep.theme', theme);
    root.setAttribute('color-scheme', theme);
}

// --- Add a new Note

function addNewNote(note) {
    const newUInote = document.createElement('div');
    newUInote.classList.add('note');
    newUInote.innerHTML = `
                <span hidden>${note.id}</span>
                <h2 class="note__title">${note.title}</h2>
                <p class="note__body">
                    ${note.body}
                </p>
                <div class="note__btns">
                    <button class="note__btn note__view">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="note__btn note__delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
    noteContainerEl.appendChild(newUInote);
}

// --- Get Notes from LocalStorage

function getNotes() {
    let notes;
    if (localStorage.getItem('keep.notes') === null) {
        notes = [];
    } else {
        notes = JSON.parse(localStorage.getItem('keep.notes'));
    }

    return notes;
}

// --- Store Notes to LocalStorage

function setNotetoLocalStorage(note) {
    let notes = getNotes();
    notes.push(note);
    localStorage.setItem('keep.notes', JSON.stringify(notes));
}

// --- Adding Existed Notes from localStorage to UI

function setNotestoUI() {
    const notes = getNotes();
    notes.forEach((note) => addNewNote(note));
}

// --- ShowAlert

function showAlert(message, alertClass) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('message', alertClass);
    alertBox.textContent = message;
    formEl.insertAdjacentElement('beforebegin', alertBox);
    setTimeout(() => alertBox.remove(), 3000);
}

// --- ShowModal

function showModal(title, body) {
    const modalTitle = document.querySelector('.modal__title');
    const modalBody = document.querySelector('.modal__body');
    const modalCloseBtn = document.querySelector('.modal__btn');
    modalTitle.textContent = title;
    modalBody.textContent = body;
    modalEl.showModal();
    modalCloseBtn.addEventListener('click', () => modalEl.close());
}

// --- Delete Note

function deleteNote(id) {
    let notes = getNotes();
    notes.forEach((note, index) => {
        if (note.id === id) {
            notes.splice(index, 1);
        }
    });
    localStorage.setItem('keep.notes', JSON.stringify(notes));
    showAlert('Note successfully deleted!', 'delete');
    // notes = notes.filter((note) => note.id !== id);
}

noteContainerEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('note__view')) {
        const currentNote = event.target.closest('.note');
        const noteTitle = currentNote.querySelector('.note__title').textContent;
        const noteBody = currentNote.querySelector('.note__body').textContent;
        showModal(noteTitle, noteBody);
    }

    if (event.target.classList.contains('note__delete')) {
        const currentNote = event.target.closest('.note');
        const noteId = currentNote.querySelector('span').textContent;
        deleteNote(Number(noteId));
        currentNote.remove();
    }
});

formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const bodyInputEl = document.querySelector('#note');
    if (titleInputEl.value.length > 0 && bodyInputEl.value.length > 0) {
        const newNote = new Note(titleInputEl.value, bodyInputEl.value);
        addNewNote(newNote);
        setNotetoLocalStorage(newNote);
        showAlert('New Note Added...!', 'success');
        titleInputEl.value = '';
        bodyInputEl.value = '';
    } else {
        showAlert('Please fill All Input', 'failed');
    }
});
