import { SimpleTokenizer } from './SimpleTokenizer';

describe('SimpleTokenizer', function() {
  var tokenizer

  beforeEach(function() {
    tokenizer = new SimpleTokenizer();
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

  it('should remove punctuation', function() {
    expect(tokenizer.tokenize('this and, this.')).toEqual(['this', 'and', 'this']);
  });

  it('should not remove hyphens', function() {
    expect(tokenizer.tokenize('billy-bob')).toEqual(['billy-bob']);
  });

  it('should not remove apostrophes', function() {
    expect(tokenizer.tokenize('it\'s')).toEqual(['it\'s']);
  });

  it('should handle cyrillic', function() {
    expect(tokenizer.tokenize('Есть хоть одна девушка, которую ты хочешь? Или ты устал от женщин'))
      .toEqual([
        'Есть',
        'хоть',
        'одна',
        'девушка',
        'которую',
        'ты',
        'хочешь',
        'Или',
        'ты',
        'устал',
        'от',
        'женщин'
      ]);
  });
});