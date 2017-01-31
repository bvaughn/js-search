// @flow

import type { ISearchIndex } from './search-index';

/**
 * Search index capable of returning results matching a set of tokens but without any meaningful rank or order.
 */
export class UnorderedSearchIndex implements ISearchIndex {
  _tokenToUidToDocumentMap : {[token : string] : {[uid : string] : any}};

  constructor() {
    this._tokenToUidToDocumentMap = {};
  }

  /**
   * @inheritDocs
   */
  indexDocument(token : string, uid : string, document : Object) : void {
    if (!this._tokenToUidToDocumentMap[token]) {
      this._tokenToUidToDocumentMap[token] = {};
    }

    this._tokenToUidToDocumentMap[token][uid] = document;
  }

  /**
   * @inheritDocs
   */
  search(tokens : Array<string>, corpus : Array<Object>) : Array<Object> {
    var uidToDocumentMap : {[uid : string]:any} = {};

    for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
      var token:string = tokens[i];
      var currentUidToDocumentMap : {[uid : string] : any} = this._tokenToUidToDocumentMap[token] || {};

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

    var documents : Array<Object> = [];

    for (var uid in uidToDocumentMap) {
      documents.push(uidToDocumentMap[uid]);
    }

    return documents;
  }
};
