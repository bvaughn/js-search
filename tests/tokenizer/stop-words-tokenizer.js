describe('StopWordsTokenizer', function() {
  var tokenizer;

  beforeEach(function() {
    tokenizer = new JsSearch.StopWordsTokenizer(new JsSearch.SimpleTokenizer());
  });

  it('should handle empty values', function() {
    expect(tokenizer.tokenize('')).toEqual([]);
    expect(tokenizer.tokenize(' ')).toEqual([]);
  });

  it('should not remove tokens that are not stop words', function() {
    expect(tokenizer.tokenize('software')).toEqual(['software']);
  });

  it('should remove stop word tokens', function() {
    expect(tokenizer.tokenize('and testing')).toEqual(['testing']);
  });

  it('should handle all stop word token sets', function() {
    expect(tokenizer.tokenize('a and the')).toEqual([]);
  });
});