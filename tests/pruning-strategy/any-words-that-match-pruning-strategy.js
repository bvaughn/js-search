describe('AnyWordsThatMatchPruningStrategy', function() {
  var documentA, documentB, documentC, mapOfA, mapOfAandB, mapOfAandC, mapOfB, mapOfNothing, pruningStrategy;

  var validatePrunedMap = function(map, expectedDocuments) {
    expect(Object.keys(map).length).toEqual(expectedDocuments.length);

    expectedDocuments.forEach(function(document) {
      expect(map[document.uid]).toBe(document);
    });
  };

  beforeEach(function() {
    pruningStrategy = new JsSearch.AnyWordsThatMatchPruningStrategy();
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

  it('should return matches even if a map is empty', function() {
    validatePrunedMap(pruningStrategy.prune([mapOfNothing]), []);
    validatePrunedMap(pruningStrategy.prune([mapOfNothing, mapOfA]), [documentA]);
    validatePrunedMap(pruningStrategy.prune([mapOfA, mapOfNothing]), [documentA]);
  });

  it('should return documents that exist in either maps', function() {
    validatePrunedMap(pruningStrategy.prune([mapOfA, mapOfAandB]), [documentA, documentB]);
    validatePrunedMap(pruningStrategy.prune([mapOfAandB, mapOfA]), [documentA, documentB]);
    validatePrunedMap(pruningStrategy.prune([mapOfAandC, mapOfAandB]), [documentA, documentB, documentC]);
  });

  it('should return documents that exist in all maps', function() {
    validatePrunedMap(pruningStrategy.prune([mapOfA, mapOfA]), [documentA]);
    validatePrunedMap(pruningStrategy.prune([mapOfAandB, mapOfAandB]), [documentA, documentB]);
  });
});