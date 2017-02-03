var Benchmark = require('benchmark');
var bb = require('beautify-benchmark');
var fs = require('fs');

var versions = [
  {
    label: 'latest',
    module: require('js-search')
  },
  {
    label: 'local',
    module: require('../dist/umd/js-search')
  }
]

fs.readFile('books.json', 'utf8',
  (err, data) => setupBenchmarks(JSON.parse(data).books)
);

var benchmarks = [];

function setupBenchmarks(corpus) {
  initBenchmark({
    corpus,
    indexStrategy: 'PrefixIndexStrategy',
    searchIndex: 'UnorderedSearchIndex'
  });
  initBenchmark({
    corpus,
    indexStrategy: 'AllSubstringsIndexStrategy',
    searchIndex: 'UnorderedSearchIndex'
  });
  initBenchmark({
    corpus,
    indexStrategy: 'ExactWordIndexStrategy',
    searchIndex: 'TfIdfSearchIndex'
  });
  initBenchmark({
    corpus,
    indexStrategy: 'ExactWordIndexStrategy',
    searchIndex: 'UnorderedSearchIndex'
  });

  runNextTest();
}

function createBenchmark() {
  return new Benchmark.Suite()
    .on('cycle', (event) => {
      bb.add(event.target);
    })
    .on('complete', () => {
      bb.log();

      runNextTest();
    });
}

function runNextTest() {
  if (benchmarks.length) {
    benchmarks.pop().run({ 'async': true });
  }
}

function initBenchmark({
  corpus,
  indexStrategy,
  searchIndex
}) {
  console.log(`Initializing benchmark\t${indexStrategy}\t${searchIndex}`);

  initBenchmarkForCreateIndex({
    corpus,
    indexStrategy,
    searchIndex
  });
  initBenchmarkForSearch({
    corpus,
    indexStrategy,
    searchIndex
  });
}

function initBenchmarkForCreateIndex({
  corpus,
  indexStrategy,
  searchIndex
}) {
  var benchmark = createBenchmark();

  versions.forEach(version => {
    var IndexStrategy = version.module[indexStrategy];
    var Search = version.module.Search;
    var SearchIndex = version.module[searchIndex];

    benchmark.add(`[${version.label}]\tCreate index\t${searchIndex}\t${indexStrategy}`, () => {
      var search = new Search('isbn');
      search.indexStrategy = new IndexStrategy();
      search.searchIndex = new SearchIndex('isbn');
      search.addIndex('title');
      search.addIndex('author');
      search.addDocuments(corpus);
    });
  });

  benchmarks.push(benchmark);
}

function initBenchmarkForSearch({
  corpus,
  indexStrategy,
  searchIndex
}) {
  var searchTerms = ['letter', 'world', 'wife', 'love', 'foobar'];
  var searchTermsLength = searchTerms.length;

  var benchmark = createBenchmark();

  versions.forEach(version => {
    var IndexStrategy = version.module[indexStrategy];
    var Search = version.module.Search;
    var SearchIndex = version.module[searchIndex];

    var search = new Search('isbn');
    search.indexStrategy = new IndexStrategy();
    search.searchIndex = new SearchIndex('isbn');
    search.addIndex('title');
    search.addIndex('author');
    search.addDocuments(corpus);

    benchmark.add(`[${version.label}]\tSearch strings\t${searchIndex}\t${indexStrategy}`, () => {
      for (var i = 0, length = searchTermsLength; i < length; i++) {
        search.search(searchTerms[i]);
      }
    });
  });

  benchmarks.push(benchmark);
}
