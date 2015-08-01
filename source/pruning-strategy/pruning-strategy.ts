module JsSearch {

  /**
   * A pruning strategy takes an array of result sets- one per search token- and returns a single, unified result set.
   *
   * <p>Pruning strategies can be used to implement permissive searches (e.g. return results that matches at least one
   * query token) or strict searches (e.g. return only the results that match every query token).
   */
  export interface IPruningStrategy {

    /**
     * @param uidToDocumentMaps Array of results sets
     * @return Pruned result set
     */
    prune(uidToDocumentMaps:Array<IUidToDocumentMap>):IUidToDocumentMap;
  };
};