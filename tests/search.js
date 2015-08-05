describe('Search', function() {
  var documentBar, documentBaz, documentFoo, search;

  var validateSearchResults = function(results, expectedDocuments) {
    expect(results.length).toBe(expectedDocuments.length);
    expectedDocuments.forEach(function(document) {
      expect(results).toContain(document);
    });
  };

  beforeEach(function() {
    search = new JsSearch.Search('uid');

    documentBar = {
      uid: 'bar',
      title: 'Bar',
      description: 'This is a document about bar'
    };
    documentBaz = {
      uid: 'baz',
      title: 'BAZ',
      description: 'All about baz'
    };
    documentFoo = {
      uid: 'foo',
      title: 'foo',
      description: 'Is kung foo the same as kung fu?'
    };
  });

  it('should index a new document on all searchable fields', function() {
    search.addIndex('title');
    spyOn(search.indexStrategy_, 'expandToken').and.returnValue([]);
    search.addDocument(documentBar);
    expect(search.indexStrategy_.expandToken).toHaveBeenCalledWith('bar');
  });

  it('should re-index existing documents if a new searchable field is added', function() {
    search.addDocument(documentBar);
    spyOn(search.indexStrategy_, 'expandToken').and.returnValue([]);
    search.addIndex('title');
    expect(search.indexStrategy_.expandToken).toHaveBeenCalledWith('bar');

  });

  it('should find matches for all searchable fields', function() {
    search.addIndex('title');
    search.addIndex('description');
    search.addDocument(documentFoo);
    // Search title text
    validateSearchResults(search.search('foo'), [documentFoo]);
    // Search description text
    validateSearchResults(search.search('kung'), [documentFoo]);
  });

  it('should find no matches if none exist', function() {
    search.addIndex('title');
    search.addDocument(documentFoo);
    validateSearchResults(search.search('xyz'), []);
  });

  it('should find no matches if one token is empty', function() {
    search.addIndex('title');
    search.addDocument(documentFoo);
    validateSearchResults(search.search('foo xyz'), []);
  });

  describe('TF-IDF', function() {
    var documents = [];

    beforeEach(function() {
      search.addIndex('title');

      var titles = [
        'this document is about node.',
        'this document is about ruby.',
        'this document is about ruby and node.',
        'this document is about node. it has node examples'
      ];

      for (var i = 0, length = titles.length; i < length; ++i) {
        var document = {
          uid: i,
          title: titles[i]
        };

        documents.push(document);
        search.addDocument(document);
      }
    });

    var calculateIdf = function(numDocumentsWithToken) {
      return 1 + Math.log(search.documents_.length/(1 + numDocumentsWithToken));
    };

    var calculateTfIdf = function(numDocumentsWithToken, tokenCountInDocument) {
      return calculateIdf(numDocumentsWithToken) * tokenCountInDocument;
    };

    var assertIdf = function(term, numDocumentsWithToken) {
      expect(search.calculateIdf_(term)).toEqual(calculateIdf(numDocumentsWithToken));
    };

    it('should compute IDF correctly', function() {
      assertIdf('and', 1);
      assertIdf('document', 4);
      assertIdf('node', 3);
      assertIdf('foob', 0);
    });

    it('should compute TF-IDF correctly', function() {
      expect(search.calculateTfIdf_(['node'], documents[0])).toEqual(calculateTfIdf(3, 1));
      expect(search.calculateTfIdf_(['node'], documents[1])).toEqual(calculateTfIdf(3, 0));
      expect(search.calculateTfIdf_(['node'], documents[3])).toEqual(calculateTfIdf(3, 2));
      expect(search.calculateTfIdf_(['document', 'node'], documents[3]))
        .toEqual(calculateTfIdf(4, 1) + calculateTfIdf(3, 2));
      expect(search.calculateTfIdf_(['ruby', 'and'], documents[2]))
        .toEqual(calculateTfIdf(2, 1) + calculateTfIdf(1, 1));
      expect(search.calculateTfIdf_(['foobar'])).toEqual(0);
    });

    it('should order search results by TF-IDF descending', function() {
      var results = search.search('node');

      expect(results.length).toEqual(3);

      // The 4th document has "node" twice so it should be first of the 3
      expect(results[0]).toEqual(documents[3]);
    });

    // TODO tf-idf ordering tests
  });
});