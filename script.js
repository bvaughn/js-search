var search, results, allBooks = [];

var indexOnAuthorCheckbox = document.getElementById('indexOnAuthorCheckbox');
var indexStrategySelect = document.getElementById('indexStrategySelect');
var removeStopWordsCheckbox = document.getElementById('removeStopWordsCheckbox');
var indexOnTitleCheckbox = document.getElementById('indexOnTitleCheckbox');
var highlightMatchingTokensCheckbox = document.getElementById('highlightMatchingTokensCheckbox');
var useStemmingCheckbox = document.getElementById('useStemmingCheckbox');

var rebuildAndRerunSearch = function() {
  rebuildSearchIndex();
  searchBooks();
};

indexOnAuthorCheckbox.onchange = rebuildAndRerunSearch;
indexStrategySelect.onchange = rebuildAndRerunSearch;
removeStopWordsCheckbox.onchange = rebuildAndRerunSearch;
indexOnTitleCheckbox.onchange = rebuildAndRerunSearch;
useStemmingCheckbox.onchange = rebuildAndRerunSearch;

var rebuildSearchIndex = function() {
  search = new JsSearch.Search('isbn');

  var indexStrategy =  eval('new ' + indexStrategySelect.value + '()');
  if (removeStopWordsCheckbox.checked) {
    indexStrategy = new JsSearch.StopWordsIndexStrategyDecorator(indexStrategy);
  }
  if (useStemmingCheckbox.checked) {
    indexStrategy = new JsSearch.StemmingIndexStrategyDecorator(stemmer, indexStrategy);
  }
  search.indexStrategy = indexStrategy;

  if (indexOnTitleCheckbox.checked) {
    search.addIndex('title');
  }
  if (indexOnAuthorCheckbox.checked) {
    search.addIndex('author');
  }

  search.addDocuments(allBooks);
};
rebuildSearchIndex();

var indexedBooksTable = document.getElementById('indexedBooksTable');
var indexedBooksTBody = indexedBooksTable.tBodies[0];
var searchInput = document.getElementById('searchInput');
var bookCountBadge = document.getElementById('bookCountBadge');

var tokenHighlighter = new JsSearch.TokenHighlighter(search.indexStrategy, search.sanitizer);

var updateBooksTable = function(books) {
  indexedBooksTBody.innerHTML = '';

  var tokens = search.tokenizer.tokenize(searchInput.value);

  for (var i = 0, length = books.length; i < length; i++) {
    var book = books[i];

    var isbnColumn = document.createElement('td');
    isbnColumn.innerText = book.isbn;

    var titleColumn = document.createElement('td');
    titleColumn.innerHTML =
      highlightMatchingTokensCheckbox.checked && indexOnTitleCheckbox.checked ?
        tokenHighlighter.highlight(book.title, tokens) :
        book.title;

    var authorColumn = document.createElement('td');
    authorColumn.innerHTML =
      highlightMatchingTokensCheckbox.checked && indexOnAuthorCheckbox.checked ?
        tokenHighlighter.highlight(book.author, tokens) :
        book.author;

    var tableRow = document.createElement('tr');
    tableRow.appendChild(isbnColumn);
    tableRow.appendChild(titleColumn);
    tableRow.appendChild(authorColumn);

    indexedBooksTBody.appendChild(tableRow);
  }
};

var updateBookCountAndTable = function() {
  updateBookCount(results.length);

  if (results.length > 0) {
    updateBooksTable(results);
  } else if (!!searchInput.value) {
    updateBooksTable([]);
  } else {
    updateBookCount(allBooks.length);
    updateBooksTable(allBooks);
  }
};

highlightMatchingTokensCheckbox.onchange = updateBookCountAndTable;

var searchBooks = function() {
  results = search.search(searchInput.value);
  updateBookCountAndTable();
};

searchInput.oninput = searchBooks;

var updateBookCount = function(numBooks) {
  bookCountBadge.innerText = numBooks + ' books';
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

    updateBookCount(allBooks.length);

    var loadingProgressBar = document.getElementById('loadingProgressBar');
    hideElement(loadingProgressBar);
    showElement(indexedBooksTable);

    updateBooksTable(allBooks);
    rebuildSearchIndex();
  }
}
xmlhttp.open('GET', 'books.json', true);
xmlhttp.send();