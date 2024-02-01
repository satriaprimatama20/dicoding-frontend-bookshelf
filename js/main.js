// main.js
document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const textBook = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = parseInt(document.getElementById("inputBookYear").value); // Convert to number
  ;
  const checkBookIsComplete = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  function generateId() {
    return +new Date();
  }
  const bookObject = generateBookObject(
    generateID,
    textBook,
    textAuthor,
    bookYear,
    checkBookIsComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

const books = [];
const RENDER_EVENT = "render_book"

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";
  for (const bookItem of books) {
    const bookElement = readBook(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.appendChild(bookElement);
    } else {
      completeBookshelfList.appendChild(bookElement);
    }
  }
});

function readBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + bookObject.author;
  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + bookObject.year;

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.appendChild(textTitle);
  textContainer.appendChild(textAuthor);
  textContainer.appendChild(textYear);

  const container = document.createElement("div");
  container.classList.add("action");
  container.appendChild(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (!bookObject.isComplete) {
    const selesaiButton = document.createElement("button");
    selesaiButton.classList.add("green");
    selesaiButton.innerText = "Selesai dibaca";
    selesaiButton.addEventListener("click", function () {
      moveBook(bookObject.id, true);
    });

    container.appendChild(selesaiButton);

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerText = "Hapus buku";
    hapusButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });
    container.appendChild(hapusButton);
  } else {
    const belumSelesaiButton = document.createElement("button");
    belumSelesaiButton.classList.add("green");
    belumSelesaiButton.innerText = "Belum selesai dibaca";
    belumSelesaiButton.addEventListener("click", function () {
      moveBook(bookObject.id, false);
    });

    container.appendChild(belumSelesaiButton);

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerText = "Hapus buku";
    hapusButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });
    container.appendChild(hapusButton);
  }

  return container;
}

function moveBook(id, isComplete) {
  const bookIndex = books.findIndex(book => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = isComplete;
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function deleteBook(id) {
  const bookIndex = books.findIndex(book => book.id === id);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function searchBook() {
  const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";
  for (const bookItem of filteredBooks) {
    const bookElement = readBook(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.appendChild(bookElement);
    } else {
      completeBookshelfList.appendChild(bookElement);
    }
  }
}

const SAVED_EVENT = "saved-read";
const STORAGE_KEY = "BOOKSHELF_APPS";

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    books.push(...data);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}