module JsSearch {

  /**
   * Maps search tokens to the documents in which they are used.
   * Also tracks metadata about the tokens to enable TF-IDF calculations.
   */
  export interface SearchIndex {
    [token:string]:TokenIndex;
  }

  /**
   * Contains information about a single token and the documents in which it appears.
   */
  export interface TokenIndex {

    /**
     * Total number of documents in which the current token appears.
     */
    $documentsCount:number;

    /**
     * Total number of times the current token appears within all documents.
     */
    $totalTokenCount:number;

    /**
     * UID to document map for each document in which the current token appears.
     */
    $uidToDocumentMap:UidToDocumentMap;
  }

  /**
   * UID to searchable document map.
   */
  export interface UidToDocumentMap {
    [uid:string]:TokenDocumentIndex;
  }

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