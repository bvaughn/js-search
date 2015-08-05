module JsSearch {
  export interface TokenToDocumentMap {
    [uid: string]: UidToDocumentMap;
  };
};