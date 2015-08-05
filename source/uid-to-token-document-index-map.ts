module JsSearch {

  /**
   * UID to searchable document map.
   */
  export interface UidToTokenDocumentIndexMap {
    [uid:string]:TokenDocumentIndex;
  }
};