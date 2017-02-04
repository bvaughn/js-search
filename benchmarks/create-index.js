const Benchmark = require('benchmark');
const bb = require('beautify-benchmark');
const lunr = require('lunr');
const JsSearchLatest = require('js-search');
const JsSearchLocal = require('../dist/umd/js-search');

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
    .add('js-search:latest (TF-IDF index)', () => {
      doSearch(JsSearchLatest.Search, JsSearchLatest.TfIdfSearchIndex);
    })
    .add('js-search:latest (unordered index)', () => {
      doSearch(JsSearchLatest.Search, JsSearchLatest.UnorderedSearchIndex);
    })
    .add('js-search:local (TF-IDF index)', () => {
      doSearch(JsSearchLocal.Search, JsSearchLocal.TfIdfSearchIndex);
    })
    .add('js-search:local (unordered index)', () => {
      doSearch(JsSearchLocal.Search, JsSearchLocal.UnorderedSearchIndex);
    })
    .run({ 'async': true });  
}


loadBooks();