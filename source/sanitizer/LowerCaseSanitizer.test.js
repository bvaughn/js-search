import { LowerCaseSanitizer } from './LowerCaseSanitizer';

describe('LowerCaseSanitizer', function() {
  var sanitizer;

  beforeEach(function() {
    sanitizer = new LowerCaseSanitizer();
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

  it('should handle leading and trailing whitespace', function() {
    expect(sanitizer.sanitize(' a')).toEqual('a');
    expect(sanitizer.sanitize('b ')).toEqual('b');
    expect(sanitizer.sanitize(' c ')).toEqual('c');
  });

  it('should convert uppercase to lower case', function() {
    expect(sanitizer.sanitize('AbC')).toEqual('abc');
  });
});