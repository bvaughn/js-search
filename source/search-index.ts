module JsSearch {

  /**
   * Maps search tokens to the documents in which they are used.
   * Also tracks metadata about the tokens to enable TF-IDF calculations.
   */
  export interface SearchIndex {
    [token:string]:TokenIndex;
  }
};