/**
 * Indexes for all substring searches (e.g. the term "cat" is indexed as "c", "ca", "cat", "a", "at", and "t").
 */
class AllSubstringsIndexStrategy implements IIndexStrategy {

  /**
   * @inheritDocs
   */
  public expandToken(token:string):Array<string> {
    var expandedTokens = [];

    for (var i = 0, length = token.length; i < length; ++i) {
      var prefixString:string = '';

      for (var j = i; j < length; ++j) {
        prefixString += token.charAt(j);

        expandedTokens.push(prefixString);
      }
    }

    return expandedTokens;
  }
};