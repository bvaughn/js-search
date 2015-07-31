var search;
var indexOnTitle = true, indexOnAuthor = true;
var allBooks = [];

var rebuildSearchIndex = function() {
  search = new JsSearch('isbn');
  if (indexOnTitle) {
    search.addIndex('title');
  }
  if (indexOnAuthor) {
    search.addIndex('author');
  }
  search.addDocuments(allBooks);
};
rebuildSearchIndex();

var indexedBooksTable = document.getElementById('indexedBooksTable');
var indexedBooksTBody = indexedBooksTable.tBodies[0];
var searchInput = document.getElementById('searchInput');
var bookCountBadge = document.getElementById('bookCountBadge');

var tokenHighlighter = new TokenHighlighter(search.indexStrategy, search.sanitizer);

var updateBooksTable = function(books) {
  indexedBooksTBody.innerHTML = '';

  var tokens = search.tokenizer.tokenize(searchInput.value);

  for (var i = 0, length = books.length; i < length; i++) {
    var book = books[i];

    var isbnColumn = document.createElement('td');
    isbnColumn.innerText = book.isbn;

    var titleColumn = document.createElement('td');
    titleColumn.innerHTML =
      indexOnTitle ?
        tokenHighlighter.highlight(book.title, tokens) :
        book.title;

    var authorColumn = document.createElement('td');
    authorColumn.innerHTML =
      indexOnAuthor ?
        tokenHighlighter.highlight(book.author, tokens) :
        book.author;

    var tableRow = document.createElement('tr');
    tableRow.appendChild(isbnColumn);
    tableRow.appendChild(titleColumn);
    tableRow.appendChild(authorColumn);

    indexedBooksTBody.appendChild(tableRow);
  }

  var searchBooks = function() {
    var query = searchInput.value;
    var results = search.search(query);

    bookCountBadge.innerText = results.length + ' books';

    if (results.length > 0) {
      updateBooksTable(results);
    } else if (!!query) {
      updateBooksTable([]);
    } else {
      bookCountBadge.innerText = allBooks.length + ' books';

      updateBooksTable(allBooks);
    }
  };

  document.getElementById('authorCheckbox').onchange = function() {
    indexOnAuthor = !indexOnAuthor;
    rebuildSearchIndex();
    searchBooks();
  };
  document.getElementById('titleCheckbox').onchange = function() {
    indexOnTitle = !indexOnTitle;
    rebuildSearchIndex();
    searchBooks();
  };
  searchInput.oninput = searchBooks;
};

var hideElement  = function(element) {
  element.className += ' hidden';
};
var showElement = function(element) {
  element.className = element.className.replace(/\s*hidden/, '');
};

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var json = JSON.parse(xmlhttp.responseText);

    allBooks = json.books;

    bookCountBadge.innerText = allBooks.length + ' books';

    var loadingProgressBar = document.getElementById('loadingProgressBar');
    hideElement(loadingProgressBar);
    showElement(indexedBooksTable);

    updateBooksTable(allBooks);
    rebuildSearchIndex();
  }
}
xmlhttp.open('GET', 'books.json', true);
xmlhttp.send();