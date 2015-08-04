/// <reference path="tokenizer.ts" />

module JsSearch {

  /**
   * Stop words are very common (e.g. "a", "and", "the") and are often not semantically meaningful in the context of a
   * search. This tokenizer removes stop words from a set of tokens before passing the remaining tokens along for
   * indexing or searching purposes.
   */
  export class StopWordsTokenizer implements ITokenizer {

    private tokenizer_:ITokenizer;

    /**
     * Constructor.
     *
     * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
     */
    constructor(decoratedTokenizer:ITokenizer) {
      this.tokenizer_ = decoratedTokenizer;
    }

    /**
     * @inheritDocs
     */
    public tokenize(text:string):Array<string> {
      return this.tokenizer_.tokenize(text)
        .filter(function(token:string):boolean {
          return token && JsSearch.StopWordsMap[token] !== token;
        });
    }
  };
};