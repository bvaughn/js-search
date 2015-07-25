describe('Search', function() {
  var documentBar, documentBaz, documentFoo, search;

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
    search.addSearchableField('title');
    spyOn(search.indexStrategy_, 'index');
    search.addDocument(documentBar);
    expect(search.indexStrategy_.index).toHaveBeenCalled();
    var args = search.indexStrategy_.index.calls.mostRecent().args;
    expect(args[1]).toEqual(documentBar.uid);
    expect(args[2].length).toEqual(1);
    expect(args[2]).toContain('bar');
    expect(args[3]).toBe(documentBar);
  });

  it('should re-index existing documents if a new searchable field is added', function() {
    search.addDocument(documentBar);
    spyOn(search.indexStrategy_, 'index');
    search.addSearchableField('title');
    expect(search.indexStrategy_.index).toHaveBeenCalled();
    var args = search.indexStrategy_.index.calls.mostRecent().args;
    expect(args[1]).toEqual(documentBar.uid);
    expect(args[2].length).toEqual(1);
    expect(args[2]).toContain('bar');
    expect(args[3]).toBe(documentBar);

  });

  it('should find matches for all searchable fields', function() {
    search.addSearchableField('title');
    search.addSearchableField('description');
    search.addDocument(documentFoo);
    // Search title text
    validateSearchResults(search.search('foo'), [documentFoo]);
    // Search description text
    validateSearchResults(search.search('kung'), [documentFoo]);
  });

  it('should find no matches if none exist', function() {
    search.addSearchableField('title');
    search.addDocument(documentFoo);
    validateSearchResults(search.search('notinthetitle'), []);
  });
});