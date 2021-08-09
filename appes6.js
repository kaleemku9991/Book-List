class Book{
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI{
  addBookToList(book){
    const list = document.getElementById('book-list');
    const row = document.createElement('tr')
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='delete'>X</a></td>`;
    list.appendChild(row);
  }
  deleteBook(target){
    if(target.className==='delete'){
      target.parentElement.parentElement.remove();
    }
  }
  clearFields(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
  showAlert(message, className){
    //create div
    const div = document.createElement('div');
    //class name
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(message));
    //get parent
    const container = document.querySelector('.container');
    //get form
    const form = document.querySelector('#book-form')
    //insert alert
    container.insertBefore(div, form);
    //timeout 3 sec
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }
}

//class local storage
class Store{
  static getBooks(){
    let books;
    if(localStorage.getItem('books')===null){
      books=[];
    }
    else{
      books=JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static displayBooks(){
    const books =Store.getBooks();
    books.forEach(function(book){
      const ui=new UI;
      ui.addBookToList(book)
    });
  }
  static addBook(book){
    const books=Store.getBooks();
    books.push(book);
    localStorage.setItem('books',JSON.stringify(books));
  }
  static removeBook(isbn){
   const books=Store.getBooks(); 
   books.forEach(function(book,index){
    if(book.isbn === isbn){
      books.splice(index, 1);
    }
    localStorage.setItem('books',JSON.stringify(books));
  });
  }
}
//dom load event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

//add event listner
document.getElementById('book-form').addEventListener('submit', function (e) {
  //get values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;
  //instantiate
  const book = new Book(title, author, isbn);
  //instantiate
  const ui = new UI();
  //  validation sucess or error
  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all fields', 'error')
  }
  else {
    //add to book list
    ui.addBookToList(book);
    Store.addBook(book)
    //show succes
    ui.showAlert('Book Added successfully!', 'success')
    //clear field
    ui.clearFields(book);
  }
  e.preventDefault();
})

document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();
  ui.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Book Removed!','success');
  e.preventDefault();
})