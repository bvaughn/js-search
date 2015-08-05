/// <reference path="search-index.ts" />

module JsSearch {

  /**
   * TODO
   */
  export class TfIdfSearchIndex implements ISearchIndex {

    private numDocuments_:number;
    private tokenToIdfCache_:{[token:string]:number};
    private tokenToNumDocumentsMap_:{[uid:string]:number};
    private tokenToTotalNumOccurrencesMap_:{[uid:string]:number};
    private tokenToUidToDocumentMap_:{[token:string]:{[uid:string]:any}};
    private tokenToUidToNumOccurrencesMap_:{[token:string]:{[uid:string]:number}};
    private uidFieldName_:string;
    private uidMap_:{[uid:string]:boolean};

    constructor(uidFieldName:string) {
      this.uidFieldName_ = uidFieldName;

      this.numDocuments_ = 0;
      this.tokenToIdfCache_ = {};
      this.tokenToNumDocumentsMap_ = {};
      this.tokenToTotalNumOccurrencesMap_ = {};
      this.tokenToUidToDocumentMap_ = {};
      this.tokenToUidToNumOccurrencesMap_ = {};
      this.uidMap_ = {};
    }

    /**
     * @inheritDocs
     */
    public indexDocument(token:string, uid:string, document:Object):void {
      delete this.tokenToIdfCache_[token]; // New index invalidates previous IDF cache

      if (!this.uidMap_[uid]) {
        this.numDocuments_++;
        this.uidMap_[uid] = true;
      }

      if (!this.tokenToUidToDocumentMap_[token]) {
        this.tokenToNumDocumentsMap_[token] = 0;
        this.tokenToTotalNumOccurrencesMap_[token] = 1;
        this.tokenToUidToDocumentMap_[token] = {};
        this.tokenToUidToNumOccurrencesMap_[token] = {};
      } else {
        this.tokenToTotalNumOccurrencesMap_[token]++;
      }

      if (!this.tokenToUidToDocumentMap_[token][uid]) {
        this.tokenToNumDocumentsMap_[token]++;
        this.tokenToUidToDocumentMap_[token][uid] = document;
        this.tokenToUidToNumOccurrencesMap_[token][uid] = 1;
      } else {
        this.tokenToUidToNumOccurrencesMap_[token][uid]++;
      }
    }

    /**
     * @inheritDocs
     */
    public search(tokens:Array<string>):Array<Object> {
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

      // Return documents sorted by TF-IDF
      return documents.sort(function (documentA, documentB) {
        return this.calculateTfIdf_(tokens, documentB) -
               this.calculateTfIdf_(tokens, documentA);
      }.bind(this));
    }

    /**
     * Calculate the inverse document frequency of a search token. This calculation diminishes the weight of tokens that
     * occur very frequently in the set of searchable documents and increases the weight of terms that occur rarely.
     */
    private calculateIdf_(token:string):number {
      if (!this.tokenToIdfCache_[token]) {
        var numDocumentsWithToken:number = this.tokenToNumDocumentsMap_[token] || 0;

        this.tokenToIdfCache_[token] = 1 + Math.log(this.numDocuments_ / (1 + numDocumentsWithToken));
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
    private calculateTfIdf_(tokens:Array<string>, document:Object):number {
      var score:number = 0;

      for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        var token:string = tokens[i];

        var inverseDocumentFrequency:number = this.calculateIdf_(token);

        if (inverseDocumentFrequency === Infinity) {
          inverseDocumentFrequency = 0;
        }

        var termFrequency:number = 0;
        var uid:any = document && document[this.uidFieldName_];

        if (this.tokenToUidToNumOccurrencesMap_[token]) {
          termFrequency = this.tokenToUidToNumOccurrencesMap_[token][uid] || 0;
        }

        score += termFrequency * inverseDocumentFrequency;
      }

      return score;
    }
  };
};