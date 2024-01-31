document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Fungsi ini berguna untuk menyimpan data input ke dalam console dalam bentuk data object
function addBook() {
  const textBook = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const checkBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).value;

  const generateID = generateId();
  function generateId() {
    return +new Date();
  }
  const bookObject = generateBookObject(
    generateID,
    textBook,
    textAuthor,
    bookYear,
    false
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  //   local storage
  saveData();
}

function generateBookObject(id, book, author, bookYear, isCompleted) {
  return {
    id,
    book,
    author,
    bookYear,
    isCompleted,
  };
}

const books = [];
const RENDER_EVENT = "renderBook";

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBookList = document.getElementById("incompleteBookshelfList");
  uncompleteBookList.innerHTML = "";
  const completeBookList = document.getElementById("completeBookshelfList");
  completeBookList.innerHTML = "";
  for (const bookItem of books) {
    const bookElement = readBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompleteBookList.append(bookElement);
    } else if (inputBookIsComplete.isCompleted) {
      completeBookList.append(bookElement);
    } else completeBookList.append(bookElement);
  }
});

// Fungsi untuk menghasilkan item untuk mengisi container "Yang Harus Dilakukan"
function readBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.book;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;
  const textYear = document.createElement("p");
  textYear.innerText = bookObject.bookYear;

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("action");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (!bookObject.isCompleted) {
    const selesaiButton = document.createElement("button");
    selesaiButton.classList.add("green");
    selesaiButton.innerText = "Selesai dibaca";

    selesaiButton.addEventListener("click", function () {
      addBookToCompletedList(bookObject.id);
    });

    container.append(selesaiButton);

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerText = "Hapus Buku";
    hapusButton.addEventListener("click", function () {
      removeBookFromCompletedList(bookObject.id);
    });
    container.append(hapusButton);
  }

  return container;
}

const checklist = document.getElementById("inputBookIsComplete");
const checkbox = checklist.querySelector("input[type='checkbox']");
checkbox.addEventListener("change", function () {
  updateChecklistStatus();
});
function updateChecklistStatus() {
  if (checkbox.checked) {
    addBookToCompletedList(bookObject.id);
  } else {
    listItem.classList.remove("checked");
  }
}

// fUNGSI INI BERFUNGSI U/ MEMINDAHKAN TODO DARI RAK "YANG HARUS DILAKUKAN" KE RAK 'YANG SUDAH DILAKUKAN'

function addBookToCompletedList(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  //   local storage
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompletedList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  //   local storage
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return indexedDB;
    }
  }
  return -1;
}

// save data to local storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-read";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// Fungsi untuk menampilkan data yang telah disimpan di localstorage

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
