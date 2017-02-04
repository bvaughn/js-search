// @flow

import type { IIndexStrategy } from './IndexStrategy';

/**
 * Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
 */
export class PrefixIndexStrategy implements IIndexStrategy {

  /**
   * @inheritDocs
   */
  expandToken(token : string) : Array<string> {
    var expandedTokens = [];
    var string = '';

    for (var i = 0, length = token.length; i < length; ++i) {
      string += token.charAt(i);
      expandedTokens.push(string);
    }

    return expandedTokens;
  }
};
