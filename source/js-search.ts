/// <reference path="index-strategy/index-strategy.ts" />
/// <reference path="index-strategy/prefix-index-strategy.ts" />
/// <reference path="pruning-strategy/all-words-must-match-pruning-strategy.ts" />
/// <reference path="pruning-strategy/pruning-strategy.ts" />
/// <reference path="sanitizer/lower-case-sanitizer.ts" />
/// <reference path="sanitizer/sanitizer.ts" />
/// <reference path="search-token-to-document-map.ts" />
/// <reference path="tokenizer/simple-tokenizer.ts" />
/// <reference path="tokenizer/tokenizer.ts" />

module JsSearch {

  /**
   * Simple client-side searching within a set of documents.
   *
   * <p>Documents can be searched by any number of fields. Indexing and search strategies are highly customizable.
   */
  export class JsSearch {

    private documents_:Array<Object>;
    private uidFieldName_:string;
    private indexStrategy_:IIndexStrategy;
    private initialized_:boolean;
    private tokenizer_:ITokenizer;
    private sanitizer_:ISanitizer;
    private searchableFieldsMap_:Object;
    private searchIndex_:ISearchTokenToDocumentMap;
    private pruningStrategy_:IPruningStrategy;

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
      var uidToDocumentMaps:Array<IUidToDocumentMap> = [];

      for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
        var token:string = tokens[i];

        uidToDocumentMaps.push(this.searchIndex_[token] || {});
      }

      var uidToDocumentMap:IUidToDocumentMap = this.pruningStrategy_.prune(uidToDocumentMaps);
      var documents:Array<Object> = [];

      for (var uid in uidToDocumentMap) {
        documents.push(uidToDocumentMap[uid]);
      }

      // TODO Sorting/prioritization

      return documents;
    }

    private indexDocuments_(documents:Array<Object>, searchableFields:Array<string>):void {
      this.initialized_ = true;

      for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
        var document:Object = documents[di];
        var uid:string = document[this.uidFieldName_];

        // TODO Error if missing UID

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
                  this.searchIndex_[expandedToken] = {};
                }

                this.searchIndex_[expandedToken][uid] = document;
              }
            }
          }

          // TODO console.warn if missing field
        }
      }
    }
  };
};