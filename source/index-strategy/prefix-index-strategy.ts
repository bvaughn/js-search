/// <reference path="index-strategy.ts" />

module JsSearch {

  /**
   * Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
   */
  export class PrefixIndexStrategy implements IIndexStrategy {

    /**
     * @inheritDocs
     */
    public expandToken(token:string):Array<string> {
      var expandedTokens = [];

      var prefixString:string = '';

      for (var i = 0, length = token.length; i < length; ++i) {
        prefixString += token.charAt(i);

        expandedTokens.push(prefixString);
      }

      return expandedTokens;
    }
  };
};