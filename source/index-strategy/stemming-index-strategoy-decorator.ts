/// <reference path="index-strategy.ts" />

module JsSearch {

  /**
   * Stemming is the process of reducing search tokens to their root (or stem) so that searches for different forms of a
   * word will still yield results. For example "search", "searching" and "searched" all get reduced to the stem "search".
   *
   * <p>This stemming index strategy converts incoming tokens (words) to their stem form before passing them along to the
   * decorated index strategy. It requires an external stemming function to be provided; for this purpose I recommend
   * the NPM 'porter-stemmer' library. For more information see http://tartarus.org/~martin/PorterStemmer/
   */
  export class StemmingIndexStrategyDecorator implements IIndexStrategy {

    private decoratedIndexStrategy_:IIndexStrategy;
    private stemmingFunction_:(text:string) => string;

    /**
     * Constructor.
     *
     * @param stemmingFunction Function capable of accepting a word and returning its stem.
     * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
     */
    constructor(stemmingFunction:(text:string) => string, decoratedIndexStrategy:IIndexStrategy) {
      this.decoratedIndexStrategy_ = decoratedIndexStrategy;
      this.stemmingFunction_ = stemmingFunction;
    }

    /**
     * @inheritDocs
     */
    public expandToken(token:string):Array<string> {
      return this.decoratedIndexStrategy_.expandToken(
        this.stemmingFunction_(token));
    }
  };
};