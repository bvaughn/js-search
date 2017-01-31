// @flow

/**
 * A tokenizer converts a string of text (e.g. "the boy") to a set of tokens (e.g. "the", "boy"). These tokens are used
 * for indexing and searching purposes.
 */
export interface ITokenizer {

  /**
   * @param text String of text (e.g. "the boy")
   * @return Array of text tokens (e.g. "the", "boy")
   */
  tokenize(text : string) : Array<string>;
};
