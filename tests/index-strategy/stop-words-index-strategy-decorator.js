describe('PrefixIndexStrategy', function() {
  var indexStrategy;

  beforeEach(function() {
    indexStrategy = new JsSearch.StopWordsIndexStrategyDecorator(new JsSearch.PrefixIndexStrategy());
  });

  it('should not expand empty tokens', function() {
    var expandedTokens = indexStrategy.expandToken('');

    expect(expandedTokens.length).toEqual(0);
  });

  it('should not expand a stop-word token', function() {
    var expandedTokens = indexStrategy.expandToken('a');

    expect(expandedTokens.length).toEqual(0);
  });

  it('should expand non-stop-word tokens', function() {
    var expandedTokens = indexStrategy.expandToken('cat');

    expect(expandedTokens.length).toEqual(3);
    expect(expandedTokens).toContain('c');
    expect(expandedTokens).toContain('ca');
    expect(expandedTokens).toContain('cat');
  });
});