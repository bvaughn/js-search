describe('WhitespaceTokenizer', function() {
  var tokenizer;

  beforeEach(function() {
    tokenizer = new WhitespaceTokenizer();
  });

  it('should convert single-token strings', function() {
    expect(tokenizer.tokenize('a')).toEqual(['a']);
  });

  it('should convert multi-token strings', function() {
    expect(tokenizer.tokenize('a b c')).toEqual(['a', 'b', 'c']);
  });

  it('should not return empty tokens', function() {
    expect(tokenizer.tokenize('  a  ')).toEqual(['a']);
  });
});