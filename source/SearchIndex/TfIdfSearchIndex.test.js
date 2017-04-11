import { Search } from '../Search';
import { TfIdfSearchIndex } from './TfIdfSearchIndex';

describe('Search', function() {
  var documents, search, uid;

  var addDocument = function(title) {
    var document = {
      uid: ++uid,
      title: title
    };

    documents.push(document);
    search.addDocument(document);

    return document;
  };

  beforeEach(function() {
    documents = [];
    uid = 0;

    search = new Search('uid');
    search.searchIndex = new TfIdfSearchIndex('uid');
    search.addIndex('title');

    var titles = [
      'this document is about node.',
      'this document is about ruby.',
      'this document is about ruby and node.',
      'this document is about node. it has node examples'
    ];

    for (var i = 0, length = titles.length; i < length; ++i) {
      addDocument(titles[i]);
    }
  });

  var calculateIdf = function(numDocumentsWithToken) {
    return 1 + Math.log(search._documents.length/(1 + numDocumentsWithToken));
  };

  var assertIdf = function(term, numDocumentsWithToken) {
    var _calculateIdf = search.searchIndex._createCalculateIdf();
    expect(_calculateIdf(term, search._documents)).toEqual(calculateIdf(numDocumentsWithToken));
  };

  it('should handle special words like "constructor"', function () {
    addDocument('constructor');
  });

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
      assertIdf('foobar', 0);
    });

    it('should clear IFD cache if new documents are indexed', function() {
      assertIdf('ruby', 2);

      addDocument('this document is not about ruby.');

      assertIdf('ruby', 3);
    });
  });

  var calculateTfIdf = function(numDocumentsWithToken, tokenCountInDocument) {
    return calculateIdf(numDocumentsWithToken) * tokenCountInDocument;
  };

  var assertTfIdf = function(terms, document, expectedTfIdf) {
    var _calculateTfIdf = search.searchIndex._createCalculateTfIdf();
    expect(_calculateTfIdf(terms, document, search._documents)).toEqual(expectedTfIdf);
  };

  describe('TF-IDF', function() {
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
      // The order of the other results isn't important for this test.
      expect(results[0]).toEqual(documents[3]);
    });

    it('should give documents containing words with a lower IDF a higher relative ranking', function() {
      var documentA = addDocument('foo bar foo bar baz baz baz baz');
      var documentB = addDocument('foo bar foo foo baz baz baz baz');
      var documentC = addDocument('foo bar baz bar baz baz baz baz');

      for (var i = 0; i < 10; i++) {
        addDocument('foo foo baz foo foo baz foo foo baz foo foo baz foo foo baz foo foo baz foo foo baz foo foo');
      }

      var results = search.search('foo bar');

      expect(results.length).toEqual(3);

      // Document A should come first because it has 2 "bar" (which have a lower total count) and 2 "foo"
      // Document C should come first because it has 2 "bar" (which have a lower total count) but only 1 "foo"
      // Document B should come last because although it has 3 "foo" it has only 1 "bar"
      expect(results[0]).toEqual(documentA);
      expect(results[1]).toEqual(documentC);
      expect(results[2]).toEqual(documentB);
    });
  });

  it('should support nested uid paths', function() {
    const melissaSmith = {
      name: 'Melissa Smith',
      login: {
        userId: 2562
      }
    };
    const johnSmith = {
      name: 'John Smith',
      login: {
        userId: 54213
      }
    };

    var searchIndex = new TfIdfSearchIndex(['login', 'userId']);
    searchIndex.indexDocument(['Melissa'], 2562, melissaSmith);
    searchIndex.indexDocument(['Smith'], 2562, melissaSmith);
    searchIndex.indexDocument(['John'], 54213, johnSmith);
    searchIndex.indexDocument(['Smith'], 54213, johnSmith);

    expect(searchIndex.search(['Melissa'], [melissaSmith, johnSmith])).toEqual([melissaSmith]);
    expect(searchIndex.search(['John'], [melissaSmith, johnSmith])).toEqual([johnSmith]);
    expect(searchIndex.search(['Smith'], [melissaSmith, johnSmith])).toEqual([melissaSmith, johnSmith]);
  });
});
