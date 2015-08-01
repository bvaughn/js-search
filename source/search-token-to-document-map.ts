module JsSearch {
  export interface ISearchTokenToDocumentMap {
    [uid: string]: IUidToDocumentMap;
  };
};