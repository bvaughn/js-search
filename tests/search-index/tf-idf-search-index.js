describe('Search', function() {
  var documents, search;

  beforeEach(function() {
    search = new JsSearch.Search('uid');
    search.searchIndex = new JsSearch.TfIdfSearchIndex('uid');
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

  var calculateIdf = function(numDocumentsWithToken) {
    return 1 + Math.log(search.searchIndex.numDocuments_/(1 + numDocumentsWithToken));
  };

  var assertIdf = function(term, numDocumentsWithToken) {
    expect(search.searchIndex.calculateIdf_(term)).toEqual(calculateIdf(numDocumentsWithToken));
  };

  describe('IDF', function() {
    it('should compute for tokens appearing only once', function() {
      assertIdf('and', 1);
    });
    it('should compute for tokens appearing once in each document', function() {
      assertIdf('document', 4);
    });
    it('should compute for tokens appearing multiple times in a document', function() {
      assertIdf('node', 3);
    });
    it('should compute for tokens that are not within the corpus', function() {
      assertIdf('foob', 0);
    });
  });

  var calculateTfIdf = function(numDocumentsWithToken, tokenCountInDocument) {
    return calculateIdf(numDocumentsWithToken) * tokenCountInDocument;
  };

  var assertTfIdf = function(terms, document, expectedTfIdf) {
    expect(search.searchIndex.calculateTfIdf_(terms, document)).toEqual(expectedTfIdf);
  };

  describe('TF-IDF', function() {
    it('should calculate the correct number of documents', function() {
      expect(search.searchIndex.numDocuments_).toEqual(search.documents_.length);
    });

    it('should compute for single tokens within the corpus', function() {
      assertTfIdf(['node'], documents[0], calculateTfIdf(3, 1));
      assertTfIdf(['node'], documents[3], calculateTfIdf(3, 2));
    });

    it('should compute for tokens not within the document', function() {
      assertTfIdf(['node'], documents[1], calculateTfIdf(3, 0));
      assertTfIdf(['has node'], documents[1], calculateTfIdf(3, 0));
    });

    it('should compute for multiple tokens within the corpus', function() {
      assertTfIdf(['document', 'node'], documents[3], calculateTfIdf(4, 1) + calculateTfIdf(3, 2));
      assertTfIdf(['ruby', 'and'], documents[2], calculateTfIdf(2, 1) + calculateTfIdf(1, 1));
    });

    it('should compute for tokens that are not within the corpus', function() {
      assertTfIdf(['foobar'], [], 0);
      assertTfIdf(['foo', 'bar'], [], 0);
    });
  });

  describe('search', function() {
    it('should order search results by TF-IDF descending', function() {
      var results = search.search('node');

      expect(results.length).toEqual(3);

      // The 4th document has "node" twice so it should be first of the 3
      expect(results[0]).toEqual(documents[3]);
    });
  });
});