module JsSearch {

  /**
   * TODO
   */
  export interface ISearchIndex {

    /**
     * TODO
     *
     * @param token
     * @param uid
     * @param document
     * @return Sanitized text
     */
    indexDocument(token:string, uid:string, document:Object):void;

    /**
     * TODO
     *
     * @param query
     * @param tokens
     */
    search(tokens:Array<string>):Array<Object>;
  };
};