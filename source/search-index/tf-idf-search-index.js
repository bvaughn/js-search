// @flow

import type { ISearchIndex } from './search-index';

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
  indexDocument(token : string, uid : string, document : Object) : void {
    this._tokenToIdfCache = {}; // New index invalidates previous IDF caches

    if (typeof this._tokenMap[token] !== 'object') {
      this._tokenMap[token] = {
        $numDocumentOccurrences: 0,
        $totalNumOccurrences: 1,
        $uidMap: {},
      };
    } else {
      this._tokenMap[token].$totalNumOccurrences++;
    }

    if (!this._tokenMap[token].$uidMap[uid]) {
      this._tokenMap[token].$numDocumentOccurrences++;

      this._tokenMap[token].$uidMap[uid] = {
        $document: document,
        $numTokenOccurrences: 1
      };
    } else {
      this._tokenMap[token].$uidMap[uid].$numTokenOccurrences++;
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
        for (var uid in tokenMetadata.$uidMap) {
          uidToDocumentMap[uid] = tokenMetadata.$uidMap[uid].$document;
        }
      } else {
        for (var uid in uidToDocumentMap) {
          if (!tokenMetadata.$uidMap[uid]) {
            delete uidToDocumentMap[uid];
          }
        }
      }
    }

    var documents : Array<Object> = [];

    for (var uid in uidToDocumentMap) {
      documents.push(uidToDocumentMap[uid]);
    }

    // Return documents sorted by TF-IDF
    return documents.sort(function (documentA, documentB) {
      return this._calculateTfIdf(tokens, documentB, corpus) -
        this._calculateTfIdf(tokens, documentA, corpus);
    }.bind(this));
  }

  /**
   * Calculate the inverse document frequency of a search token. This calculation diminishes the weight of tokens that
   * occur very frequently in the set of searchable documents and increases the weight of terms that occur rarely.
   */
  _calculateIdf(token : string, documents : Array<Object>) : number {
    if (!this._tokenToIdfCache[token]) {
      var numDocumentsWithToken:number = this._tokenMap[token] && this._tokenMap[token].$numDocumentOccurrences || 0;

      this._tokenToIdfCache[token] = 1 + Math.log(documents.length / (1 + numDocumentsWithToken));
    }

    return this._tokenToIdfCache[token];
  }

  /**
   * Calculate the term frequency–inverse document frequency (TF-IDF) ranking for a set of search tokens and a
   * document. The TF-IDF is a numeric statistic intended to reflect how important a word (or words) are to a document
   * in a corpus. The TF-IDF value increases proportionally to the number of times a word appears in the document but
   * is offset by the frequency of the word in the corpus. This helps to adjust for the fact that some words appear
   * more frequently in general (e.g. a, and, the).
   */
  _calculateTfIdf(tokens : Array<string>, document : Object, documents : Array<Object>) : number {
    var score:number = 0;

    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      var token:string = tokens[i];

      var inverseDocumentFrequency:number = this._calculateIdf(token, documents);

      if (inverseDocumentFrequency === Infinity) {
        inverseDocumentFrequency = 0;
      }

      var uid:any = document && document[this._uidFieldName];
      var termFrequency:number =
        this._tokenMap[token] &&
        this._tokenMap[token].$uidMap[uid] &&
        this._tokenMap[token].$uidMap[uid].$numTokenOccurrences || 0;

      score += termFrequency * inverseDocumentFrequency;
    }

    return score;
  }
};
