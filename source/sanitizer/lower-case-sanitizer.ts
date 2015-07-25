/**
 * Sanitizes text by converting to a locale-friendly lower-case version and triming leading and trailing whitespace.
 */
class LowerCaseSanitizer implements ISanitizer {

  /**
   * @inheritDocs
   */
  public sanitize(text:string):string {
    return text ? text.toLocaleLowerCase().trim() : '';
  }
};