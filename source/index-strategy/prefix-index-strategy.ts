/**
 * Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
 */
class PrefixIndexStrategy implements IIndexStrategy {

  /**
   * @inheritDocs
   */
  public expandToken(token:string):Array<string> {
    var expandedTokens = [];

    var prefixString:string = '';

    for (var i = 0; i < token.length; i++) {
      prefixString += token.charAt(i);

      expandedTokens.push(prefixString);
    }

    return expandedTokens;
  }
};