/// <reference path="tokenizer.ts" />

module JsSearch {

  /**
   * Stemming is the process of reducing search tokens to their root (or stem) so that searches for different forms of a
   * word will match. For example "search", "searching" and "searched" are all reduced to the stem "search".
   *
   * <p>This stemming tokenizer converts tokens (words) to their stem forms before returning them. It requires an
   * external stemming function to be provided; for this purpose I recommend the NPM 'porter-stemmer' library.
   *
   * <p>For more information see http://tartarus.org/~martin/PorterStemmer/
   */
  export class StemmingTokenizer implements ITokenizer {

    private stemmingFunction_:(text:string) => string;
    private tokenizer_:ITokenizer;

    /**
     * Constructor.
     *
     * @param stemmingFunction Function capable of accepting a word and returning its stem.
     * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
     */
    constructor(stemmingFunction:(text:string) => string, decoratedTokenizer:ITokenizer) {
      this.stemmingFunction_ = stemmingFunction;
      this.tokenizer_ = decoratedTokenizer;
    }

    /**
     * @inheritDocs
     */
    public tokenize(text:string):Array<string> {
      return this.tokenizer_.tokenize(text)
        .map(function(token:string):string {
          return this.stemmingFunction_(token);
        }, this);
    }
  };
};