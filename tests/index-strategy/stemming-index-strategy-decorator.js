describe('PrefixIndexStrategy', function() {
  var indexStrategy;

  beforeEach(function() {
    var stemmingFunction = function(text) {
      if (text === 'cats') {
        return 'cat';
      } else {
        return text;
      }
    };

    indexStrategy = new JsSearch.StemmingIndexStrategyDecorator(stemmingFunction, new JsSearch.PrefixIndexStrategy());
  });

  it('should not expand empty tokens', function() {
    var expandedTokens = indexStrategy.expandToken('');

    expect(expandedTokens.length).toEqual(0);
  });

  it('should expand a stemmed token', function() {
    var expandedTokens = indexStrategy.expandToken('cats');

    expect(expandedTokens.length).toEqual(3);
    expect(expandedTokens).toContain('c');
    expect(expandedTokens).toContain('ca');
    expect(expandedTokens).toContain('cat');
  });

  it('should expand non-stemmed tokens', function() {
    var expandedTokens = indexStrategy.expandToken('cat');

    expect(expandedTokens.length).toEqual(3);
    expect(expandedTokens).toContain('c');
    expect(expandedTokens).toContain('ca');
    expect(expandedTokens).toContain('cat');
  });
});