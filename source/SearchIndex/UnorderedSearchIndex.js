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
    if (typeof this._tokenToUidToDocumentMap[token] !== 'object') {
      this._tokenToUidToDocumentMap[token] = {};
    }

    this._tokenToUidToDocumentMap[token][uid] = doc;
  }

  /**
   * @inheritDocs
   */
  search(tokens : Array<string>, corpus : Array<Object>) : Array<Object> {
    var intersectingDocumentMap = {};

    var tokenToUidToDocumentMap = this._tokenToUidToDocumentMap;

    for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
      var token = tokens[i];
      var documentMap = tokenToUidToDocumentMap[token];

      // Short circuit if no matches were found for any given token.
      if (!documentMap) {
        return [];
      }

      if (i === 0) {
        var keys = Object.keys(documentMap);

        for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
          var uid = keys[j];

          intersectingDocumentMap[uid] = documentMap[uid];
        }
      } else {
        var keys = Object.keys(intersectingDocumentMap);

        for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
          var uid = keys[j];

          if (typeof documentMap[uid] !== 'object') {
            delete intersectingDocumentMap[uid];
          }
        }
      }
    }

    var keys = Object.keys(intersectingDocumentMap);
    var documents = [];

    for (var i = 0, numKeys = keys.length; i < numKeys; i++) {
      var uid = keys[i];

      documents.push(intersectingDocumentMap[uid]);
    }

    return documents;
  }
};
