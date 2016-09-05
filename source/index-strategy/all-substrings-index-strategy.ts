/// <reference path="index-strategy.ts" />

module JsSearch {

  /**
   * Indexes for all substring searches (e.g. the term "cat" is indexed as "c", "ca", "cat", "a", "at", and "t").
   */
  export class AllSubstringsIndexStrategy implements IIndexStrategy {

    /**
     * @inheritDocs
     */
    public expandToken(token:string):Array<string> {
      var expandedTokens = [];

      for (var i = 0, length = token.length; i < length; ++i) {
        for (var j = i; j < length; ++j) {
          expandedTokens.push(token.substring(i, j + 1));
        }
      }

      return expandedTokens;
    }
  };
};
