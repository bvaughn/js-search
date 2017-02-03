const Benchmark = require('benchmark');
const bb = require('beautify-benchmark');
const lunr = require('lunr');
const JsSearch = require('js-search');

let books;
function loadBooks() {
  const fs = require('fs');
  fs.readFile(
    'books.json',
    'utf8',
    (err, data) => {
      books = data;
      runTests();
    }
  );
}

function doSearch(Search, SearchIndex) {
  var search = new Search('isbn');
  search.searchIndex = new SearchIndex('isbn');
  search.addIndex('title');
  search.addIndex('author');
  search.addDocuments(books);
}

function runTests() {
  new Benchmark.Suite()
    .on('cycle', (event) => {
      console.log(String(event.target));
      bb.add(event.target);
    })
    .on('complete', () => {
      bb.log();
    })
    .add('lunr', () => {
      var lunrJsIndex = new lunr.Index
      lunrJsIndex.field('title')
      lunrJsIndex.field('author')
      lunrJsIndex.ref('isbn')
      for (var i = 0, length = books.length; i < length; i++) {
        lunrJsIndex.add(books[i]);
      }
    })
    .add('js-search (TF-IDF index)', () => {
      doSearch(JsSearch.Search, JsSearch.TfIdfSearchIndex);
    })
    .add('js-search (unordered index)', () => {
      doSearch(JsSearch.Search, JsSearch.UnorderedSearchIndex);
    })
    .run({ 'async': true });  
}


loadBooks();