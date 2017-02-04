// @flow

import type { ISearchIndex } from './SearchIndex';

type ITfIdfTokenMap = {
  [token : string] : ITfIdfTokenMetadata;
};

type ITfIdfUidMap = {
  [uid : string] : ITfIdfUidMetadata;
};

type ITfIdfTokenMetadata = {
  $numDocumentOccurrences : number;
  $totalNumOccurrences : number;
  $uidMap : ITfIdfUidMap;
};

type ITfIdfUidMetadata = {
  $document : Object;
  $numTokenOccurrences : number;
};

/**
 * Search index capable of returning results matching a set of tokens and ranked according to TF-IDF.
 */
export class TfIdfSearchIndex implements ISearchIndex {
  _uidFieldName : string;
  _tokenToIdfCache : {[token : string] : number};
  _tokenMap : ITfIdfTokenMap;

  constructor(uidFieldName : string) {
    this._uidFieldName = uidFieldName;
    this._tokenToIdfCache = {};
    this._tokenMap = {};
  }

  /**
   * @inheritDocs
   */
  indexDocument(token : string, uid : string, doc : Object) : void {
    this._tokenToIdfCache = {}; // New index invalidates previous IDF caches

    var tokenMap = this._tokenMap;
    var tokenDatum;

    if (!tokenMap.hasOwnProperty(token)) {
      tokenMap[token] = tokenDatum = {
        $numDocumentOccurrences: 0,
        $totalNumOccurrences: 1,
        $uidMap: {},
      };
    } else {
      tokenDatum = tokenMap[token];
      tokenDatum.$totalNumOccurrences++;
    }

    var uidMap = tokenDatum.$uidMap;

    if (!uidMap.hasOwnProperty(uid)) {
      tokenDatum.$numDocumentOccurrences++;
      uidMap[uid] = {
        $document: doc,
        $numTokenOccurrences: 1
      };
    } else {
      uidMap[uid].$numTokenOccurrences++;
    }
  }

  /**
   * @inheritDocs
   */
  search(tokens : Array<string>, corpus : Array<Object>) : Array<Object> {
    var uidToDocumentMap : {[uid : string] : Object} = {};

    for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
      var token:string = tokens[i];
      var tokenMetadata:ITfIdfTokenMetadata = this._tokenMap[token];

      // Short circuit if no matches were found for any given token.
      if (!tokenMetadata) {
        return [];
      }

      if (i === 0) {
        var keys = Object.keys(tokenMetadata.$uidMap);
        for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
          var uid = keys[j];

          uidToDocumentMap[uid] = tokenMetadata.$uidMap[uid].$document;
        }
      } else {
        var keys = Object.keys(uidToDocumentMap);
        for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
          var uid = keys[j];

          if (!tokenMetadata.$uidMap.hasOwnProperty(uid)) {
            delete uidToDocumentMap[uid];
          }
        }
      }
    }

    var documents : Array<Object> = [];

    for (var uid in uidToDocumentMap) {
      documents.push(uidToDocumentMap[uid]);
    }

    var tokenMap = this._tokenMap;
    var tokenToIdfCache = this._tokenToIdfCache;
    var uidFieldName = this._uidFieldName;

    var calculateTfIdf = this._createCalculateTfIdf();

    // Return documents sorted by TF-IDF
    return documents.sort((documentA, documentB) =>
      calculateTfIdf(tokens, documentB, corpus) -
      calculateTfIdf(tokens, documentA, corpus)
    );
  }

  _createCalculateIdf () : Function {
    var tokenMap = this._tokenMap;
    var tokenToIdfCache = this._tokenToIdfCache;

    return function calculateIdf(token : string, documents : Array<Object>) : number {
      if (!tokenToIdfCache[token]) {
        var numDocumentsWithToken:number = tokenMap[token]
          ? tokenMap[token].$numDocumentOccurrences
          : 0;

        tokenToIdfCache[token] = 1 + Math.log(documents.length / (1 + numDocumentsWithToken));
      }

      return tokenToIdfCache[token];
    }
  }

  _createCalculateTfIdf () : Function {
    var tokenMap = this._tokenMap;
    var uidFieldName = this._uidFieldName;
    var calculateIdf = this._createCalculateIdf();

    return function calculateTfIdf(tokens : Array<string>, document : Object, documents : Array<Object>) : number {
      var score:number = 0;

      for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        var token:string = tokens[i];

        var inverseDocumentFrequency:number = calculateIdf(token, documents);

        if (inverseDocumentFrequency === Infinity) {
          inverseDocumentFrequency = 0;
        }

        var uid:any = document && document[uidFieldName];
        var termFrequency:number = tokenMap[token] && tokenMap[token].$uidMap[uid]
          ? tokenMap[token].$uidMap[uid].$numTokenOccurrences
          : 0;

        score += termFrequency * inverseDocumentFrequency;
      }

      return score;
    }
  }
};
