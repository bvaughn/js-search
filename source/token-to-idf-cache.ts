module JsSearch {

  /**
   * UID to searchable document map.
   */
  export interface TokenToIdfCache {
    [uid:string]:number;
  }
};