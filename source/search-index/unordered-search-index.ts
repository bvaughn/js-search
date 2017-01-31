/// <reference path="search-index.ts" />

module JsSearch {

  /**
   * Search index capable of returning results matching a set of tokens but without any meaningful rank or order.
   */
  export class UnorderedSearchIndex implements ISearchIndex {

    private tokenToUidToDocumentMap_:{[token:string]:{[uid:string]:any}};

    constructor() {
      this.tokenToUidToDocumentMap_ = {};
    }

    /**
     * @inheritDocs
     */
    public indexDocument(token:string, uid:string, document:Object):void {
      if (!this.tokenToUidToDocumentMap_[token]) {
        this.tokenToUidToDocumentMap_[token] = {};
      }

      this.tokenToUidToDocumentMap_[token][uid] = document;
    }

    /**
     * @inheritDocs
     */
    public restore(serialized:string):void {
      this.tokenToUidToDocumentMap_ = JSON.parse(serialized);
    }

    /**
     * @inheritDocs
     */
    public search(tokens:Array<string>, corpus:Array<Object>):Array<Object> {
      var uidToDocumentMap:{[uid:string]:any} = {};

      for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
        var token:string = tokens[i];
        var currentUidToDocumentMap:{[uid:string]:any} = this.tokenToUidToDocumentMap_[token] || {};

        if (i === 0) {
          for (var uid in currentUidToDocumentMap) {
            uidToDocumentMap[uid] = currentUidToDocumentMap[uid];
          }
        } else {
          for (var uid in uidToDocumentMap) {
            if (!currentUidToDocumentMap[uid]) {
              delete uidToDocumentMap[uid];
            }
          }
        }
      }

      var documents:Array<Object> = [];

      for (var uid in uidToDocumentMap) {
        documents.push(uidToDocumentMap[uid]);
      }

      return documents;
    }

    /**
     * @inheritDocs
     */
    public serialize():string {
      return JSON.stringify(this.tokenToUidToDocumentMap_);
    }
  };
};