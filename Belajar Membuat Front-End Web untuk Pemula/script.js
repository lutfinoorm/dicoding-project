const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'SHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addNewBook();
  });

  if(isStorageExist){
    loadDataFromStorage();
  }
});

function addNewBook(){
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = parseInt(document.getElementById('inputBookYear').value);
  const isBookCompleted = document.getElementById('inputBookIsComplete').checked;
 
  const generatedID = generateId();
  const bookObject = generateTodoObject(generatedID, bookTitle, bookAuthor, bookYear, isBookCompleted);
  books.push(bookObject);

  ResetAllForm();
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(); 
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function putBook(bookObject) {
  const greenButton = document.createElement('button')
  greenButton.classList.add('green');
  if (bookObject.isCompleted){
    greenButton.innerText = 'Not Completed';
  } else {
    greenButton.innerText = 'Completed';
  }

  greenButton.addEventListener('click', () => {
    movingBook(bookObject.id)
  })

  const redButton = document.createElement('button');
  redButton.classList.add('red');
  redButton.innerText = 'Delete';

  redButton.addEventListener('click', () => {
    removingBook(bookObject)
  })

  const editButton = document.createElement('button');
  editButton.classList.add('green');
  editButton.innerText = 'Edit';

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  actionContainer.append(greenButton, editButton, redButton)

  const titleElement = document.createElement('h3');
  titleElement.innerText = bookObject.title;
  
  const authorElement = document.createElement('p');
  authorElement.innerText = bookObject.author;

  const yearElement = document.createElement('p');
  yearElement.innerText = bookObject.year;
  
  const bookElement = document.createElement('article')
  bookElement.classList.add('book_item');
  bookElement.append(titleElement, authorElement, yearElement, actionContainer);
  bookElement.setAttribute('id', `book-${bookObject.id}`);

  return bookElement;

}

function movingBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null ) return;
  setTimeout(() => {
    alert("Moving Shelf");
  }, 0)

  if (bookTarget.isCompleted) {
    bookTarget.isCompleted = false;
  } else {
    bookTarget.isCompleted = true;
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

}

function findBook(bookId){
  for (const book of books){
    if (book.id === bookId){
      return book;
    }
  }

  return null;
} 


function removingBook(book){
  const bookTarget = findBookIndex(book.id);

  if (bookTarget === -1) return ;
  
  let confirmDelete = confirm(`Are you sure you want to delete ${book.title}?`);
  if (!confirmDelete) return; 

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

}

function findBookIndex(bookId){
  for (const index in books){

    if (books[index].id = bookId){
      return index;
    }
  }

  return -1;
}

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
  const completeBookshelf = document.getElementById('completeBookshelfList'); 
  incompleteBookshelf.innerHTML = '';
  completeBookshelf.innerHTML = '';

  for (const book of books){
    const bookElement = putBook(book);
    if (book.isCompleted === false){
      incompleteBookshelf.append(bookElement);
    } else {
      completeBookshelf.append(bookElement);
    }
  }
})

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
  document.getElementById("searchBookTitle").value = "";
}

function saveData(){
  if (isStorageExist) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }

  return true;
}

document.addEventListener(SAVED_EVENT, () => {
  // alert("Moving Shelf");
  // console.log(localStorage.getItem(STORAGE_KEY))
})

function loadDataFromStorage(){
  const serialData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serialData);

  if (data !== null) {
    for (const book of data){
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}