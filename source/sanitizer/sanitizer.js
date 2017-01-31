// @flow

/**
 * A sanitizer helps convert searchable field text and user query text to a format that can be easily compared. Among
 * other things, this often involves operations like trimming leading and trailing whitespace.
 */
export interface ISanitizer {

  /**
   * @param text
   * @return Sanitized text
   */
  sanitize(text : string) : string;
};
