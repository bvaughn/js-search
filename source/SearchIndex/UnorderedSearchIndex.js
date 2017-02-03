// @flow

import type { ISearchIndex } from './SearchIndex';

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
  indexDocument(token : string, uid : string, doc : Object) : void {
    if (!this._tokenToUidToDocumentMap[token]) {
      this._tokenToUidToDocumentMap[token] = {};
    }

    this._tokenToUidToDocumentMap[token][uid] = doc;
  }

  /**
   * @inheritDocs
   */
  search(tokens : Array<string>, corpus : Array<Object>) : Array<Object> {
    var intersectingDocumentMap = {};

    for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
      var token = tokens[i];
      var documentMap = this._tokenToUidToDocumentMap[token] || {};

      if (i === 0) {
        var keys = Object.keys(documentMap);
        var numKeys = keys.length;

        for (var i = 0; i < numKeys; i++) {
          var uid = keys[i];

          intersectingDocumentMap[uid] = documentMap[uid];
        }
      } else {
        var keys = Object.keys(intersectingDocumentMap);
        var numKeys = keys.length;

        for (var i = 0; i < numKeys; i++) {
          var uid = keys[i];

          if (!documentMap[uid]) {
            delete intersectingDocumentMap[uid];
          }
        }
      }
    }

    var keys = Object.keys(intersectingDocumentMap);
    var numKeys = keys.length;
    var documents = [];

    for (var i = 0; i < numKeys; i++) {
      var uid = keys[i];

      documents.push(intersectingDocumentMap[uid]);
    }

    return documents;
  }
};
