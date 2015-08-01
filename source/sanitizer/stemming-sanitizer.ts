/// <reference path="sanitizer.ts" />

module JsSearch {

  /**
   * Stemming is the process of reducing search tokens to their root (or stem) so that searches for different forms of a
   * word will still yield results. For example "search", "searching" and "searched" all get reduced to the stem "search".
   *
   * <p>This stemming index strategy converts incoming tokens (words) to their stem form before passing them along to the
   * decorated index strategy. It requires an external stemming function to be provided; for this purpose I recommend
   * the NPM 'porter-stemmer' library. For more information see http://tartarus.org/~martin/PorterStemmer/
   */
  export class StemmingSanitizerDecorator implements ISanitizer {

    private decoratedSanitizer_:ISanitizer;
    private stemmingFunction_:(text:string) => string;

    /**
     * Constructor.
     *
     * @param stemmingFunction Function capable of accepting a word and returning its stem.
     * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
     */
    constructor(stemmingFunction:(text:string) => string, decoratedSanitizer:ISanitizer) {
      this.decoratedSanitizer_ = decoratedSanitizer;
      this.stemmingFunction_ = stemmingFunction;
    }

    /**
     * @inheritDocs
     */
    public sanitize(text:string):string {
      return this.decoratedSanitizer_.sanitize(
        this.stemmingFunction_(text));
    }
  };
};