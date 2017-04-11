// @flow
import getNestedFieldValue from '../getNestedFieldValue';

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
  _uidFieldName : string | Array<string>;
  _tokenToIdfCache : {[token : string] : number};
  _tokenMap : ITfIdfTokenMap;

  constructor(uidFieldName : string | Array<string>) {
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

    if (typeof tokenMap[token] !== 'object') {
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

    if (typeof uidMap[uid] !== 'object') {
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
      var token = tokens[i];
      var tokenMetadata = this._tokenMap[token];

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

          if (typeof tokenMetadata.$uidMap[uid] !== 'object') {
            delete uidToDocumentMap[uid];
          }
        }
      }
    }

    var documents = [];

    for (var uid in uidToDocumentMap) {
      documents.push(uidToDocumentMap[uid]);
    }

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
        var numDocumentsWithToken:number = typeof tokenMap[token] !== 'undefined'
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

        var uid:any;
        if (uidFieldName instanceof Array) {
          uid = document && getNestedFieldValue(document, uidFieldName);
        } else {
          uid = document && document[uidFieldName];
        }

        var termFrequency:number =
          typeof tokenMap[token] !== 'undefined' &&
          typeof tokenMap[token].$uidMap[uid] !== 'undefined'
            ? tokenMap[token].$uidMap[uid].$numTokenOccurrences
            : 0;

        score += termFrequency * inverseDocumentFrequency;
      }

      return score;
    }
  }
};
