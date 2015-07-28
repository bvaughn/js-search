describe('AllWordsMustMatchPruningStrategy', function() {
  var documentA, documentB, documentC, mapOfA, mapOfAandB, mapOfAandC, mapOfB, mapOfNothing, pruningStrategy;

  var validatePrunedMap = function(map, expectedDocuments) {
    expect(Object.keys(map).length).toEqual(expectedDocuments.length);

    expectedDocuments.forEach(function(document) {
      expect(map[document.uid]).toBe(document);
    });
  };

  beforeEach(function() {
    pruningStrategy = new AllWordsMustMatchPruningStrategy();
    documentA = {
      uid: 'a'
    };
    documentB = {
      uid: 'b'
    };
    documentC = {
      uid: 'c'
    };
    mapOfA = {
      a: documentA
    };
    mapOfB = {
      b: documentB
    };
    mapOfAandB = {
      a: documentA,
      b: documentB
    };
    mapOfAandC = {
      a: documentA,
      c: documentC
    };
    mapOfNothing = {};
  });

  it('should return no matches if any map is empty', function() {
    validatePrunedMap(pruningStrategy.prune([mapOfNothing]), []);
    validatePrunedMap(pruningStrategy.prune([mapOfNothing, mapOfA]), []);
    validatePrunedMap(pruningStrategy.prune([mapOfA, mapOfNothing]), []);
  });

  it('should return no matches if maps do not intersect', function() {
    validatePrunedMap(pruningStrategy.prune([mapOfA, mapOfB]), []);
  });

  it('should return only documents that exist in all maps', function() {
    validatePrunedMap(pruningStrategy.prune([mapOfA, mapOfAandB]), [documentA]);
    validatePrunedMap(pruningStrategy.prune([mapOfAandB, mapOfA]), [documentA]);
    validatePrunedMap(pruningStrategy.prune([mapOfAandC, mapOfAandB]), [documentA]);
  });

  it('should not prune if all documents are present in all maps', function() {
    validatePrunedMap(pruningStrategy.prune([mapOfA, mapOfA]), [documentA]);
    validatePrunedMap(pruningStrategy.prune([mapOfAandB, mapOfAandB]), [documentA, documentB]);
  });
});