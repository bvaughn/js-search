module JsSearch {

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
};