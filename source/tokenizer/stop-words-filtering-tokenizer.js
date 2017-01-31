// @flow

import type { ITokenizer } from './tokenizer';

import { StopWordsMap } from '../stop-words-map';

/**
 * Stop words are very common (e.g. "a", "and", "the") and are often not semantically meaningful in the context of a
 * search. This tokenizer removes stop words from a set of tokens before passing the remaining tokens along for
 * indexing or searching purposes.
 */
export class StopWordsTokenizer implements ITokenizer {
  _tokenizer : ITokenizer;

  /**
   * Constructor.
   *
   * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
   */
  constructor(decoratedTokenizer : ITokenizer) {
    this._tokenizer = decoratedTokenizer;
  }

  /**
   * @inheritDocs
   */
  tokenize(text : string) : Array<string> {
    return this._tokenizer.tokenize(text)
      .filter(
        (token) => token && StopWordsMap[token] !== token
      );
  }
};
