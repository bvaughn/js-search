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

var filter = process.argv.length === 3
  ? new RegExp(process.argv[2])
  : null;

var benchmarks = [];

function setupBenchmarks(corpus) {
  // Index strategies
  initBenchmark({
    corpus,
    indexStrategy: 'PrefixIndexStrategy'
  });
  initBenchmark({
    corpus,
    indexStrategy: 'AllSubstringsIndexStrategy'
  });
  initBenchmark({
    corpus,
    indexStrategy: 'PrefixIndexStrategy'
  });

  // Search indices
  initBenchmark({
    corpus,
    searchIndex: 'TfIdfSearchIndex'
  });
  initBenchmark({
    corpus,
    searchIndex: 'UnorderedSearchIndex'
  });

  // Tokenizers
  initBenchmark({
    corpus,
    tokenizer: 'SimpleTokenizer'
  });
  initBenchmark({
    corpus,
    tokenizer: 'StemmingTokenizer'
  });
  initBenchmark({
    corpus,
    tokenizer: 'StopWordsTokenizer'
  });

  runNextTest();
}

function identity(text) {
  return text;
}

function createTokenizer(module, tokenizer) {
  switch (tokenizer) {
    case 'SimpleTokenizer':
      return new module.SimpleTokenizer();
    case 'StemmingTokenizer':
      return new module.StemmingTokenizer(
        identity,
        new module.SimpleTokenizer()
      );
    case 'StopWordsTokenizer':
      return new module.StopWordsTokenizer(
        new module.SimpleTokenizer()
      );
  }
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
  indexStrategy = 'PrefixIndexStrategy',
  searchIndex = 'UnorderedSearchIndex',
  tokenizer = 'SimpleTokenizer'
}) {
  initBenchmarkForCreateIndex({
    corpus,
    indexStrategy,
    searchIndex,
    tokenizer
  });
  initBenchmarkForSearch({
    corpus,
    indexStrategy,
    searchIndex,
    tokenizer
  });
}

function initBenchmarkForCreateIndex({
  corpus,
  indexStrategy,
  searchIndex,
  tokenizer
}) {
  var label = `index\t${indexStrategy}\t${searchIndex}\t${tokenizer}`;

  if (filter && !label.match(filter)) {
    return;
  }

  var benchmark = createBenchmark();

  versions.forEach(version => {
    var IndexStrategy = version.module[indexStrategy];
    var Search = version.module.Search;
    var SearchIndex = version.module[searchIndex];

    benchmark.add(`[${version.label}]\t${label}`, () => {
      var search = new Search('isbn');
      search.indexStrategy = new IndexStrategy();
      search.searchIndex = new SearchIndex('isbn');
      search.tokenizer = createTokenizer(version.module, tokenizer);
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
  searchIndex,
  tokenizer
}) {
  var label = `search\t${indexStrategy}\t${searchIndex}\t${tokenizer}`;

  if (filter && !label.match(filter)) {
    return;
  }

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
    search.tokenizer = createTokenizer(version.module, tokenizer);
    search.addIndex('title');
    search.addIndex('author');
    search.addDocuments(corpus);

    benchmark.add(`[${version.label}]\t${label}`, () => {
      for (var i = 0, length = searchTermsLength; i < length; i++) {
        search.search(searchTerms[i]);
      }
    });
  });

  benchmarks.push(benchmark);
}
