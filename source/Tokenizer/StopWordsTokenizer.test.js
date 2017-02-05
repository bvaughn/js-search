import { SimpleTokenizer } from './SimpleTokenizer';
import { StopWordsTokenizer } from './StopWordsTokenizer';
import { StopWordsMap } from '../StopWordsMap';

describe('StopWordsTokenizer', function() {
  var tokenizer;

  beforeEach(function() {
    tokenizer = new StopWordsTokenizer(new SimpleTokenizer());
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

  it('should not remove Object.prototype properties', function() {
    expect(tokenizer.tokenize('constructor')).toEqual(['constructor']);
    expect(tokenizer.tokenize('hasOwnProperty')).toEqual(['hasOwnProperty']);
    expect(tokenizer.tokenize('toString')).toEqual(['toString']);
    expect(tokenizer.tokenize('valueOf')).toEqual(['valueOf']);
  });

  it('should allow stop-words to be overridden', function() {
    StopWordsMap.the = false;
    expect(tokenizer.tokenize('a and the')).toEqual(['the']);
    StopWordsMap.the = true;
  });
});