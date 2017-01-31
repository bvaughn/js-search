// @flow

/**
 * A search index stores documents in such a way as to enable quick lookup against one or more tokens.
 */
export interface ISearchIndex {

  /**
   * Track the specified document and token association.
   *
   * @param token
   * @param uid
   * @param document
   * @return Sanitized text
   */
  indexDocument(
    token : string,
    uid : string,
    document : Object
  ) : void;

  /**
   * Return all documents that match the specified tokens.
   *
   * @param tokens Tokenized query (eg "the boy" query becomes ["the", "boy"] tokens)
   * @param corpus All document in search corpus
   * @return Array of matching documents
   */
  search(
    tokens : Array<string>,
    corpus : Array<Object>
  ) : Array<Object>;
};
