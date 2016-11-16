describe('Search', function() {
  var documents, search;

  beforeEach(function() {
    search = new JsSearch.Search('uid');
    search.searchIndex = new JsSearch.UnorderedSearchIndex();
    search.addIndex('title');

    var titles = [
      'this document is about node.',
      'this document is about ruby.',
      'this document is about ruby and node.',
      'this document is about node. it has node examples'
    ];

    documents = [];
    for (var i = 0, length = titles.length; i < length; ++i) {
      var document = {
        uid: i,
        title: titles[i]
      };

      documents.push(document);
      search.addDocument(document);
    }
  });

  var validateSearchResults = function(results, expectedDocuments) {
    expect(results.length).toBe(expectedDocuments.length);
    expectedDocuments.forEach(function(document) {
      expect(results).toContain(document);
    });
  };

  it('should return documents matching search tokens', function() {
    var results = search.search('node');

    validateSearchResults(results, [documents[0], documents[2], documents[3]]);
  });

  it('should serialize indexed documents', function() {
    expect(search.searchIndex.serialize()).toBeTruthy();
  });

  it('should restore persisted indexed documents', function() {
    const serialized = search.searchIndex.serialize();

    search = new JsSearch.Search('uid');
    search.searchIndex = new JsSearch.UnorderedSearchIndex();
    search.searchIndex.restore(serialized);

    var results = search.search('node');

    validateSearchResults(results, [documents[0], documents[2], documents[3]]);
  });
});