module JsSearch {

  /**
   * Contains information about a single document.
   */
  export interface TokenDocumentIndex {

    /**
     * Number of times the parent token appears in this particular document.
     */
    $tokenCount:number;

    /**
     * Searchable document.
     */
    $document:Object;
  }
};