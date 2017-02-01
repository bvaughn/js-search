import { SimpleTokenizer } from './SimpleTokenizer';
import { StemmingTokenizer } from './StemmingTokenizer';

describe('StemmingTokenizer', function() {
  var tokenizer;

  beforeEach(function() {
    var stemmingFunction = function(text) {
      if (text === 'cats') {
        return 'cat';
      } else {
        return text;
      }
    };

    tokenizer = new StemmingTokenizer(stemmingFunction, new SimpleTokenizer());
  });

  it('should handle empty values', function() {
    expect(tokenizer.tokenize('')).toEqual([]);
    expect(tokenizer.tokenize(' ')).toEqual([]);
  });

  it('should convert words to stems', function() {
    expect(tokenizer.tokenize('the cats')).toEqual(['the', 'cat']);
  });
});