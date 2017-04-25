var { Search, AllSubstringsIndexStrategy, ExactWordIndexStrategy } = require('../dist/umd/js-search');

function identity(text) {
  return text;
}

var search = new Search('id');
search.indexStrategy = new AllSubstringsIndexStrategy();
search.addIndex('text');


for (var i = 0; i < 10000; i++) {
  search.addDocuments([
    { id: 1, text: 'foo bar' },
    { id: 2, text: 'bar baz' },
    { id: 3, text: 'baz foo' }
  ]);

  search.search('foo');
  search.search('bar');
  search.search('baz');
}
