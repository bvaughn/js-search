describe('PrefixIndexStrategy', function() {
  var documentA, documentB, indexStrategy, searchIndex;

  var validateSearchIndex = function(token, expectedDocuments) {
    var indexedDocuments = searchIndex[token];

    expect(indexedDocuments).toBeTruthy();
    expect(Object.keys(indexedDocuments).length).toEqual(expectedDocuments.length);

    expectedDocuments.forEach(function(document) {
      expect(indexedDocuments[document.uid]).toBe(document);
    });
  };

  beforeEach(function() {
    indexStrategy = new PrefixIndexStrategy();
    searchIndex = {};

    documentA = {
      uid: 'foo'
    };
    documentB = {
      uid: 'bar'
    };
  });

  it('should index on a single-character field value', function() {
    indexStrategy.index(searchIndex, documentA.uid, ['a'], documentA);

    expect(Object.keys(searchIndex).length).toEqual(1);
    validateSearchIndex('a', [documentA]);
  });

  it('should index on a multi-character field value', function() {
    indexStrategy.index(searchIndex, documentA.uid, ['abc'], documentA);

    expect(Object.keys(searchIndex).length).toEqual(3);
    validateSearchIndex('a', [documentA]);
    validateSearchIndex('ab', [documentA]);
    validateSearchIndex('abc', [documentA]);
  });

  it('should index multiple fields', function() {
    indexStrategy.index(searchIndex, documentA.uid, ['ab', 'ac'], documentA);

    expect(Object.keys(searchIndex).length).toEqual(3);
    validateSearchIndex('a', [documentA]);
    validateSearchIndex('ab', [documentA]);
    validateSearchIndex('ac', [documentA]);
  });

  it('should index multiple documents', function() {
    indexStrategy.index(searchIndex, documentA.uid, ['ab'], documentA);
    indexStrategy.index(searchIndex, documentB.uid, ['ac'], documentB);

    expect(Object.keys(searchIndex).length).toEqual(3);
    validateSearchIndex('a', [documentA, documentB]);
    validateSearchIndex('ab', [documentA]);
    validateSearchIndex('ac', [documentB]);
  });

  it('should index multiple documents with multiple fields', function() {
    indexStrategy.index(searchIndex, documentA.uid, ['ab', 'ac'], documentA);
    indexStrategy.index(searchIndex, documentB.uid, ['a', 'ad'], documentB);

    expect(Object.keys(searchIndex).length).toEqual(4);
    validateSearchIndex('a', [documentA, documentB]);
    validateSearchIndex('ab', [documentA]);
    validateSearchIndex('ac', [documentA]);
    validateSearchIndex('ad', [documentB]);
  });
});