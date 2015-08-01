/// <reference path="sanitizer.ts" />

module JsSearch {

  /**
   * Enforces case-sensitive text matches.
   */
  export class CaseSensitiveSanitizer implements ISanitizer {

    /**
     * @inheritDocs
     */
    public sanitize(text:string):string {
      return text ? text.trim() : '';
    }
  };
};