/// <reference path="index-strategy/index-strategy.ts" />
/// <reference path="index-strategy/prefix-index-strategy.ts" />
/// <reference path="pruning-strategy/all-words-must-match-pruning-strategy.ts" />
/// <reference path="pruning-strategy/pruning-strategy.ts" />
/// <reference path="sanitizer/lower-case-sanitizer.ts" />
/// <reference path="sanitizer/sanitizer.ts" />
/// <reference path="search-token-to-document-map.ts" />
/// <reference path="tokenizer/simple-tokenizer.ts" />
/// <reference path="tokenizer/tokenizer.ts" />
var JsSearch;
(function (JsSearch_1) {
    /**
     * Simple client-side searching within a set of documents.
     *
     * <p>Documents can be searched by any number of fields. Indexing and search strategies are highly customizable.
     */
    var JsSearch = (function () {
        /**
         * Constructor.
         * @param uidFieldName Field containing values that uniquely identify search documents; this field's values are used
         *                     to ensure that a search result set does not contain duplicate objects.
         */
        function JsSearch(uidFieldName) {
            this.uidFieldName_ = uidFieldName;
            this.indexStrategy_ = new JsSearch_1.PrefixIndexStrategy();
            this.pruningStrategy = new JsSearch_1.AllWordsMustMatchPruningStrategy();
            this.sanitizer_ = new JsSearch_1.LowerCaseSanitizer();
            this.tokenizer_ = new JsSearch_1.SimpleTokenizer();
            this.documents_ = [];
            this.searchableFieldsMap_ = {};
            this.searchIndex_ = {};
        }
        Object.defineProperty(JsSearch.prototype, "indexStrategy", {
            get: function () {
                return this.indexStrategy_;
            },
            /**
             * Override the default index strategy.
             * @param value Custom index strategy
             * @throws Error if documents have already been indexed by this search instance
             */
            set: function (value) {
                if (this.initialized_) {
                    throw Error('IIndexStrategy cannot be set after initialization');
                }
                this.indexStrategy_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsSearch.prototype, "pruningStrategy", {
            get: function () {
                return this.pruningStrategy_;
            },
            /**
             * Override the default pruning strategy.
             * @param value Custom pruning strategy
             */
            set: function (value) {
                this.pruningStrategy_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsSearch.prototype, "sanitizer", {
            get: function () {
                return this.sanitizer_;
            },
            /**
             * Override the default text sanitizing strategy.
             * @param value Custom text sanitizing strategy
             * @throws Error if documents have already been indexed by this search instance
             */
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ISanitizer cannot be set after initialization');
                }
                this.sanitizer_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsSearch.prototype, "tokenizer", {
            get: function () {
                return this.tokenizer_;
            },
            /**
             * Override the default text tokenizing strategy.
             * @param value Custom text tokenizing strategy
             * @throws Error if documents have already been indexed by this search instance
             */
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ITokenizer cannot be set after initialization');
                }
                this.tokenizer_ = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Add a searchable document to the index. Document will automatically be indexed for search.
         * @param document
         */
        JsSearch.prototype.addDocument = function (document) {
            this.addDocuments([document]);
        };
        /**
         * Adds searchable documents to the index. Documents will automatically be indexed for search.
         * @param document
         */
        JsSearch.prototype.addDocuments = function (documents) {
            this.documents_.push.apply(this.documents_, documents);
            this.indexDocuments_(documents, Object.keys(this.searchableFieldsMap_));
        };
        /**
         * Add a new searchable field to the index. Existing documents will automatically be indexed using this new field.
         * @param field Searchable field (e.g. "title")
         */
        JsSearch.prototype.addIndex = function (field) {
            this.searchableFieldsMap_[field] = true;
            this.indexDocuments_(this.documents_, [field]);
        };
        /**
         * Search all documents for ones matching the specified query text.
         * @param query
         * @returns {Array<Object>}
         */
        JsSearch.prototype.search = function (query) {
            var tokens = this.tokenizer_.tokenize(this.sanitizer_.sanitize(query));
            var uidToDocumentMaps = [];
            for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
                var token = tokens[i];
                uidToDocumentMaps.push(this.searchIndex_[token] || {});
            }
            var uidToDocumentMap = this.pruningStrategy_.prune(uidToDocumentMaps);
            var documents = [];
            for (var uid in uidToDocumentMap) {
                documents.push(uidToDocumentMap[uid]);
            }
            // TODO Sorting/prioritization
            return documents;
        };
        JsSearch.prototype.indexDocuments_ = function (documents, searchableFields) {
            this.initialized_ = true;
            for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
                var document = documents[di];
                var uid = document[this.uidFieldName_];
                // TODO Error if missing UID
                for (var sfi = 0, numSearchableFields = searchableFields.length; sfi < numSearchableFields; sfi++) {
                    var searchableField = searchableFields[sfi];
                    var fieldValue = document[searchableField];
                    if (typeof fieldValue === 'string') {
                        var fieldTokens = this.tokenizer_.tokenize(this.sanitizer_.sanitize(fieldValue));
                        for (var fti = 0, numFieldValues = fieldTokens.length; fti < numFieldValues; fti++) {
                            var fieldToken = fieldTokens[fti];
                            var expandedTokens = this.indexStrategy_.expandToken(fieldToken);
                            for (var eti = 0, nummExpandedTokens = expandedTokens.length; eti < nummExpandedTokens; eti++) {
                                var expandedToken = expandedTokens[eti];
                                if (!this.searchIndex_[expandedToken]) {
                                    this.searchIndex_[expandedToken] = {};
                                }
                                this.searchIndex_[expandedToken][uid] = document;
                            }
                        }
                    }
                }
            }
        };
        return JsSearch;
    })();
    JsSearch_1.JsSearch = JsSearch;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=js-search.js.map