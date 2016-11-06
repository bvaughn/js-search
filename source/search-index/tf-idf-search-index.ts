/// <reference path="search-index.ts" />

module JsSearch {

  /**
   * Search index capable of returning results matching a set of tokens and ranked according to TF-IDF.
   */
  export class TfIdfSearchIndex implements ISearchIndex {

    private tokenToIdfCache_:{[token:string]:number};
    private tokenMap_:ITfIdfTokenMap;
    private uidFieldName_:string;

    constructor(uidFieldName:string) {
      this.uidFieldName_ = uidFieldName;
      this.tokenToIdfCache_ = {};
      this.tokenMap_ = {};
    }

    /**
     * @inheritDocs
     */
    public indexDocument(token:string, uid:string, document:Object):void {
      this.tokenToIdfCache_ = {}; // New index invalidates previous IDF caches

      if (typeof this.tokenMap_[token] !== 'object') {
        this.tokenMap_[token] = {
          $numDocumentOccurrences: 0,
          $totalNumOccurrences: 1,
          $uidMap: {},
        };
      } else {
        this.tokenMap_[token].$totalNumOccurrences++;
      }

      if (!this.tokenMap_[token].$uidMap[uid]) {
        this.tokenMap_[token].$numDocumentOccurrences++;

        this.tokenMap_[token].$uidMap[uid] = {
          $document: document,
          $numTokenOccurrences: 1
        };
      } else {
        this.tokenMap_[token].$uidMap[uid].$numTokenOccurrences++;
      }
    }

    /**
     * @inheritDocs
     */
    public search(tokens:Array<string>, corpus:Array<Object>):Array<Object> {
      var uidToDocumentMap:{[uid:string]:Object} = {};

      for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
        var token:string = tokens[i];
        var tokenMetadata:ITfIdfTokenMetadata = this.tokenMap_[token];

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

      var documents:Array<Object> = [];

      for (var uid in uidToDocumentMap) {
        documents.push(uidToDocumentMap[uid]);
      }

      // Return documents sorted by TF-IDF
      return documents.sort(function (documentA, documentB) {
        return this.calculateTfIdf_(tokens, documentB, corpus) -
               this.calculateTfIdf_(tokens, documentA, corpus);
      }.bind(this));
    }

    /**
     * Calculate the inverse document frequency of a search token. This calculation diminishes the weight of tokens that
     * occur very frequently in the set of searchable documents and increases the weight of terms that occur rarely.
     */
    private calculateIdf_(token:string, documents:Array<Object>):number {
      if (!this.tokenToIdfCache_[token]) {
        var numDocumentsWithToken:number = this.tokenMap_[token] && this.tokenMap_[token].$numDocumentOccurrences || 0;

        this.tokenToIdfCache_[token] = 1 + Math.log(documents.length / (1 + numDocumentsWithToken));
      }

      return this.tokenToIdfCache_[token];
    }

    /**
     * Calculate the term frequency–inverse document frequency (TF-IDF) ranking for a set of search tokens and a
     * document. The TF-IDF is a numeric statistic intended to reflect how important a word (or words) are to a document
     * in a corpus. The TF-IDF value increases proportionally to the number of times a word appears in the document but
     * is offset by the frequency of the word in the corpus. This helps to adjust for the fact that some words appear
     * more frequently in general (e.g. a, and, the).
     */
    private calculateTfIdf_(tokens:Array<string>, document:Object, documents:Array<Object>):number {
      var score:number = 0;

      for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        var token:string = tokens[i];

        var inverseDocumentFrequency:number = this.calculateIdf_(token, documents);

        if (inverseDocumentFrequency === Infinity) {
          inverseDocumentFrequency = 0;
        }

        var uid:any = document && document[this.uidFieldName_];
        var termFrequency:number =
          this.tokenMap_[token] &&
          this.tokenMap_[token].$uidMap[uid] &&
          this.tokenMap_[token].$uidMap[uid].$numTokenOccurrences || 0;

        score += termFrequency * inverseDocumentFrequency;
      }

      return score;
    }
  };

  interface ITfIdfTokenMap {
    [token:string]:ITfIdfTokenMetadata;
  };

  interface ITfIdfTokenMetadata {
    $numDocumentOccurrences:number;
    $totalNumOccurrences:number;
    $uidMap:ITfIdfUidMap;
  };

  interface ITfIdfUidMap {
    [uid:string]:ITfIdfUidMetadata;
  };

  interface ITfIdfUidMetadata {
    $document:Object;
    $numTokenOccurrences:number;
  };
};
