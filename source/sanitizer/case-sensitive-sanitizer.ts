/**
 * Enforces case-sensitive text matches.
 */
class CaseSensitiveSanitizer implements ISanitizer {

  /**
   * @inheritDocs
   */
  public sanitize(text:string):string {
    return text ? text.trim() : '';
  }
};