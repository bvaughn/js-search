// @flow

import type { ITokenizer } from './Tokenizer';

var REGEX = /[^a-zа-яё0-9\-']+/i;

/**
 * Simple tokenizer that splits strings on whitespace characters and returns an array of all non-empty substrings.
 */
export class SimpleTokenizer implements ITokenizer {

  /**
   * @inheritDocs
   */
  tokenize(text : string) : Array<string> {
    return text
      .split(REGEX)
      .filter(
        (text) => text // Filter empty tokens
      );
  }
};
