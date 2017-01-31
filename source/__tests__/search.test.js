import { Search } from '../search';

describe('Search', function() {
  var documentBar, documentBaz, documentFoo, nestedDocumentFoo, search;

  var validateSearchResults = function(results, expectedDocuments) {
    expect(results.length).toBe(expectedDocuments.length);
    expectedDocuments.forEach(function(document) {
      expect(results).toContain(document);
    });
  };

  beforeEach(function() {
    search = new Search('uid');

    documentBar = {
      uid: 'bar',
      title: 'Bar',
      description: 'This is a document about bar',
      aNumber: 0,
      aBoolean: false
    };
    documentBaz = {
      uid: 'baz',
      title: 'BAZ',
      description: 'All about baz',
      array: ['test', true, 456]
    };
    documentFoo = {
      uid: 'foo',
      title: 'foo',
      description: 'Is kung foo the same as kung fu?',
      aNumber: 167543,
      aBoolean: true,
      array: [123, 'test', 'foo']
    };
    nestedDocumentFoo = {
      uid: 'foo',
      title: 'foo',
      description: 'Is kung foo the same as kung fu?',
      nested: {
        title: 'nested foo'
      }
    }
  });

  it('should index a new document on all searchable fields', function() {
    search.addIndex('title');
    spyOn(search._indexStrategy, 'expandToken').and.returnValue([]);
    search.addDocument(documentBar);
    expect(search._indexStrategy.expandToken).toHaveBeenCalledWith('bar');
  });

  it('should re-index existing documents if a new searchable field is added', function() {
    search.addDocument(documentBar);
    spyOn(search._indexStrategy, 'expandToken').and.returnValue([]);
    search.addIndex('title');
    expect(search._indexStrategy.expandToken).toHaveBeenCalledWith('bar');

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

  it('should index and find non-string values if they can be converted to strings', function() {
    search.addIndex('aBoolean');
    search.addIndex('aNumber');
    search.addDocument(documentBar);
    search.addDocument(documentFoo);

    validateSearchResults(search.search('167'), [documentFoo]);
    validateSearchResults(search.search('true'), [documentFoo]);
    validateSearchResults(search.search('0'), [documentBar]);
    validateSearchResults(search.search('false'), [documentBar]);
  });

  it('should stringified arrays', function() {
    search.addIndex('array');
    search.addDocuments([documentFoo, documentBaz]);

    validateSearchResults(search.search('test'), [documentFoo, documentBaz]);
    validateSearchResults(search.search('true'), [documentBaz]);
    validateSearchResults(search.search('456'), [documentBaz]);
  });

  it('should index nested document properties', function() {
    search.addIndex(['nested', 'title']);
    search.addDocument(nestedDocumentFoo);

    validateSearchResults(search.search('nested foo'), [nestedDocumentFoo]);
  });

  it('should gracefully handle broken property path', function() {
    search.addIndex(['nested', 'title', 'not', 'existing']);
    search.addDocument(nestedDocumentFoo);

    validateSearchResults(search.search('nested foo'), []);
  });
});
