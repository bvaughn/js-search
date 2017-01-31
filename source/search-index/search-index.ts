module JsSearch {

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
    indexDocument(token:string, uid:string, document:Object):void;

    /**
     * Restores the search index from a previous serialization.
     *
     * @param persisted
     */
    restore(serialized:string):void;

    /**
     * Return all documents that match the specified tokens.
     *
     * @param tokens Tokenized query (eg "the boy" query becomes ["the", "boy"] tokens)
     * @param corpus All document in search corpus
     * @return Array of matching documents
     */
    search(tokens:Array<string>, corpus:Array<Object>):Array<Object>;

    /**
     * Return serialized representation of search index.
     * This representation can later be passed to the `restore` method to restore the index at this point.
     *
     * @return Serialized index string
     */
    serialize():string;
  };
};
