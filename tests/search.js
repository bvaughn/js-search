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
});