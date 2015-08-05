/// <reference path="index-strategy/index-strategy.ts" />
/// <reference path="index-strategy/prefix-index-strategy.ts" />
/// <reference path="pruning-strategy/all-words-must-match-pruning-strategy.ts" />
/// <reference path="pruning-strategy/pruning-strategy.ts" />
/// <reference path="sanitizer/lower-case-sanitizer.ts" />
/// <reference path="sanitizer/sanitizer.ts" />
/// <reference path="search-index" />
/// <reference path="token-document-index" />
/// <reference path="token-index" />
/// <reference path="token-to-idf-cache" />
/// <reference path="tokenizer/simple-tokenizer.ts" />
/// <reference path="tokenizer/tokenizer.ts" />

module JsSearch {

  /**
   * Simple client-side searching within a set of documents.
   *
   * <p>Documents can be searched by any number of fields. Indexing and search strategies are highly customizable.
   */
  export class Search {

    private documents_:Array<Object>;
    private uidFieldName_:string;
    private indexStrategy_:IIndexStrategy;
    private initialized_:boolean;
    private tokenizer_:ITokenizer;
    private sanitizer_:ISanitizer;
    private searchableFieldsMap_:Object;
    private searchIndex_:SearchIndex;
    private pruningStrategy_:IPruningStrategy;
    private tokenToIdfCache_:TokenToIdfCache;

    /**
     * Constructor.
     * @param uidFieldName Field containing values that uniquely identify search documents; this field's values are used
     *                     to ensure that a search result set does not contain duplicate objects.
     */
    constructor(uidFieldName:string) {
      this.uidFieldName_ = uidFieldName;

      this.indexStrategy_ = new PrefixIndexStrategy();
      this.pruningStrategy = new AllWordsMustMatchPruningStrategy();
      this.sanitizer_ = new LowerCaseSanitizer();
      this.tokenizer_ = new SimpleTokenizer();

      this.documents_ = [];
      this.searchableFieldsMap_ = {};
      this.searchIndex_ = {};
      this.tokenToIdfCache_ = {};
    }

    /**
     * Override the default index strategy.
     * @param value Custom index strategy
     * @throws Error if documents have already been indexed by this search instance
     */
    public set indexStrategy(value:IIndexStrategy) {
      if (this.initialized_) {
        throw Error('IIndexStrategy cannot be set after initialization');
      }

      this.indexStrategy_ = value;
    }

    public get indexStrategy():IIndexStrategy {
      return this.indexStrategy_;
    }

    /**
     * Override the default pruning strategy.
     * @param value Custom pruning strategy
     */
    public set pruningStrategy(value:IPruningStrategy) {
      this.pruningStrategy_ = value;
    }

    public get pruningStrategy():IPruningStrategy {
      return this.pruningStrategy_;
    }

    /**
     * Override the default text sanitizing strategy.
     * @param value Custom text sanitizing strategy
     * @throws Error if documents have already been indexed by this search instance
     */
    public set sanitizer(value:ISanitizer) {
      if (this.initialized_) {
        throw Error('ISanitizer cannot be set after initialization');
      }

      this.sanitizer_ = value;
    }

    public get sanitizer():ISanitizer {
      return this.sanitizer_;
    }

    /**
     * Override the default text tokenizing strategy.
     * @param value Custom text tokenizing strategy
     * @throws Error if documents have already been indexed by this search instance
     */
    public set tokenizer(value:ITokenizer) {
      if (this.initialized_) {
        throw Error('ITokenizer cannot be set after initialization');
      }

      this.tokenizer_ = value;
    }

    public get tokenizer():ITokenizer {
      return this.tokenizer_;
    }

    /**
     * Add a searchable document to the index. Document will automatically be indexed for search.
     * @param document
     */
    public addDocument(document:Object):void {
      this.addDocuments([document]);
    }

    /**
     * Adds searchable documents to the index. Documents will automatically be indexed for search.
     * @param document
     */
    public addDocuments(documents:Array<Object>):void {
      this.documents_.push.apply(this.documents_, documents);
      this.indexDocuments_(documents, Object.keys(this.searchableFieldsMap_));
    }

    /**
     * Add a new searchable field to the index. Existing documents will automatically be indexed using this new field.
     * @param field Searchable field (e.g. "title")
     */
    public addIndex(field:string) {
      this.searchableFieldsMap_[field] = true;
      this.indexDocuments_(this.documents_, [field]);
    }

    /**
     * Search all documents for ones matching the specified query text.
     * @param query
     * @returns {Array<Object>}
     */
    public search(query:string):Array<Object> {
      var tokens:Array<string> = this.tokenizer_.tokenize(this.sanitizer_.sanitize(query));
      var uidToDocumentMaps:Array<UidToDocumentMap> = [];

      for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
        var token:string = tokens[i];

        uidToDocumentMaps.push(this.searchIndex_[token] && this.searchIndex_[token].$uidToDocumentMap || {});
      }

      var uidToDocumentMap:UidToDocumentMap = this.pruningStrategy_.prune(uidToDocumentMaps);
      var documents:Array<Object> = [];

      for (var uid in uidToDocumentMap) {
        documents.push(uidToDocumentMap[uid].$document);
      }

      // Return documents sorted by TF-IDF
      documents = documents.sort(function(documentA, documentB) {
        return this.calculateTfIdf_(tokens, documentB) -
               this.calculateTfIdf_(tokens, documentA);
      }.bind(this));

      return documents;
    }

    /**
     * Calculate the inverse document frequency of a search token. This calculation diminishes the weight of tokens that
     * occur very frequently in the set of searchable documents and increases the weight of terms that occur rarely.
     */
    private calculateIdf_(token:string):number {
      if (!this.tokenToIdfCache_[token]) {
        var numDocumentsWithToken:number = 0;

        if (this.searchIndex_[token]) {
          numDocumentsWithToken = <number> this.searchIndex_[token].$documentsCount;
        }

        this.tokenToIdfCache_[token] = 1 + Math.log(this.documents_.length / (1 + numDocumentsWithToken));
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
        inverseDocumentFrequency = inverseDocumentFrequency === Infinity ? 0 : inverseDocumentFrequency;

        var termFrequency:number = 0;
        var uid:any = document && document[this.uidFieldName_];

        if (this.searchIndex_[token] &&
            this.searchIndex_[token].$uidToDocumentMap[uid]) {
          termFrequency = this.searchIndex_[token].$uidToDocumentMap[uid].$tokenCount;
        }

        score += termFrequency * inverseDocumentFrequency;
      }

      return score;
    }

    private indexDocuments_(documents:Array<Object>, searchableFields:Array<string>):void {
      this.tokenToIdfCache_ = {}; // New index invalidates previous IDF cache
      this.initialized_ = true;

      for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
        var document:Object = documents[di];
        var uid:string = document[this.uidFieldName_];

        for (var sfi = 0, numSearchableFields = searchableFields.length; sfi < numSearchableFields; sfi++) {
          var searchableField:string = searchableFields[sfi];
          var fieldValue:any = document[searchableField];

          if (typeof fieldValue === 'string') {
            var fieldTokens:Array<string> = this.tokenizer_.tokenize(this.sanitizer_.sanitize(fieldValue));

            for (var fti = 0, numFieldValues = fieldTokens.length; fti < numFieldValues; fti++) {
              var fieldToken:string = fieldTokens[fti];
              var expandedTokens:Array<string> = this.indexStrategy_.expandToken(fieldToken);

              for (var eti = 0, nummExpandedTokens = expandedTokens.length; eti < nummExpandedTokens; eti++) {
                var expandedToken = expandedTokens[eti];

                if (!this.searchIndex_[expandedToken]) {
                  this.searchIndex_[expandedToken] = {
                    $documentsCount: 0,
                    $totalTokenCount: 1,
                    $uidToDocumentMap: {}
                  };
                } else {
                  this.searchIndex_[expandedToken].$totalTokenCount++;
                }

                if (!this.searchIndex_[expandedToken].$uidToDocumentMap[uid]) {
                  this.searchIndex_[expandedToken].$documentsCount++;
                  this.searchIndex_[expandedToken].$uidToDocumentMap[uid] = {
                    $tokenCount: 1,
                    $document: document
                  };
                } else {
                  this.searchIndex_[expandedToken].$uidToDocumentMap[uid].$tokenCount++;
                }
              }
            }
          }
        }
      }
    }
  };
};