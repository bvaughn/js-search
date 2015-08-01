describe('StemmingSanitizerDecorator', function() {
  var sanitizer;

  beforeEach(function() {
    var stemmingFunction = function(text) {
      if (text === 'cats') {
        return 'cat';
      } else {
        return text;
      }
    };

    sanitizer = new JsSearch.StemmingSanitizerDecorator(stemmingFunction, new JsSearch.LowerCaseSanitizer());
  });

  it('should handle falsy values', function() {
    expect(sanitizer.sanitize(null)).toEqual('');
    expect(sanitizer.sanitize(undefined)).toEqual('');
    expect(sanitizer.sanitize(false)).toEqual('');
  });

  it('should handle empty strings', function() {
    expect(sanitizer.sanitize('')).toEqual('');
  });

  it('should handle whitespace-only strings', function() {
    expect(sanitizer.sanitize('  ')).toEqual('');
  });

  it('should convert words to stems', function() {
    expect(sanitizer.sanitize('cats')).toEqual('cat');
  });
});