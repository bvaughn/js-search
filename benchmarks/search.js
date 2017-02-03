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
      books = JSON.parse(data);
      setupTest();
    }
  );
}

var lunrJsIndex;
var searchLatest;
var searchLatestTfIdf;
var searchLocal;
var searchLocalTfIdf;
var searchTerms = ['letter', 'world', 'wife', 'love', 'foobar'];
var searchTermsLength = searchTerms.length;

function setupTest() {
  lunrJsIndex = new lunr.Index();
  lunrJsIndex.field('title');
  lunrJsIndex.field('author');
  lunrJsIndex.ref('isbn');
  for (var i = 0, length = books.length; i < length; i++) {
    lunrJsIndex.add(books[i]);
  }

  searchLatest = buildIndex(JsSearch.Search, JsSearch.UnorderedSearchIndex);
  searchLatestTfIdf = buildIndex(JsSearch.Search, JsSearch.TfIdfSearchIndex);

  runTests();
}

function buildIndex(Search, SearchIndex) {
  var search = new Search('isbn');
  search.searchIndex = new SearchIndex('isbn');
  search.addIndex('title');
  search.addIndex('author');
  search.addDocuments(books);

  return search;
}

function doSearch(search) {
  for (var i = 0, length = searchTermsLength; i < length; i++) {
    search.search(searchTerms[i]);
  }
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
      doSearch(lunrJsIndex);
    })
    .add('js-search (TF-IDF index)', () => {
      doSearch(searchLatestTfIdf);
    })
    .add('js-search (unordered index)', () => {
      doSearch(searchLatest);
    })
    .run({ 'async': true });  
}

loadBooks();
