;
var PrefixIndexStrategy = (function () {
    function PrefixIndexStrategy() {
    }
    PrefixIndexStrategy.prototype.expandToken = function (token) {
        var expandedTokens = [];
        var prefixString = '';
        for (var i = 0; i < token.length; i++) {
            prefixString += token.charAt(i);
            expandedTokens.push(prefixString);
        }
        return expandedTokens;
    };
    return PrefixIndexStrategy;
})();
;
var AllWordsMustMatchPruningStrategy = (function () {
    function AllWordsMustMatchPruningStrategy() {
    }
    AllWordsMustMatchPruningStrategy.prototype.prune = function (uidToDocumentMaps) {
        var filteredUidToDocumentMap = {};
        for (var i = 0, numMaps = uidToDocumentMaps.length; i < numMaps; i++) {
            var uidToDocumentMap = uidToDocumentMaps[i];
            if (i === 0) {
                for (var uid in uidToDocumentMap) {
                    filteredUidToDocumentMap[uid] = uidToDocumentMap[uid];
                }
            }
            else {
                for (var uid in filteredUidToDocumentMap) {
                    if (!uidToDocumentMap[uid]) {
                        delete filteredUidToDocumentMap[uid];
                    }
                }
            }
        }
        return filteredUidToDocumentMap;
    };
    return AllWordsMustMatchPruningStrategy;
})();
;
var LowerCaseSanitizer = (function () {
    function LowerCaseSanitizer() {
    }
    LowerCaseSanitizer.prototype.sanitize = function (text) {
        return text ? text.toLocaleLowerCase().trim() : '';
    };
    return LowerCaseSanitizer;
})();
;
;
;
var WhitespaceTokenizer = (function () {
    function WhitespaceTokenizer() {
    }
    WhitespaceTokenizer.prototype.tokenize = function (text) {
        return text.split(/\s+/)
            .filter(function (text) {
            return !!text;
        });
    };
    return WhitespaceTokenizer;
})();
;
var Search = (function () {
    function Search(uidFieldName) {
        this.uidFieldName_ = uidFieldName;
        this.indexStrategy_ = new PrefixIndexStrategy();
        this.pruningStrategy = new AllWordsMustMatchPruningStrategy();
        this.sanitizer_ = new LowerCaseSanitizer();
        this.tokenizer_ = new WhitespaceTokenizer();
        this.documents_ = [];
        this.searchableFieldsMap_ = {};
        this.searchIndex_ = {};
    }
    Object.defineProperty(Search.prototype, "indexStrategy", {
        set: function (value) {
            if (this.initialized_) {
                throw Error('IIndexStrategy cannot be set after initialization');
            }
            this.indexStrategy_ = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Search.prototype, "pruningStrategy", {
        set: function (value) {
            this.pruningStrategy_ = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Search.prototype, "sanitizer", {
        set: function (value) {
            if (this.initialized_) {
                throw Error('ISanitizer cannot be set after initialization');
            }
            this.sanitizer_ = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Search.prototype, "tokenizer", {
        set: function (value) {
            if (this.initialized_) {
                throw Error('ITokenizer cannot be set after initialization');
            }
            this.tokenizer_ = value;
        },
        enumerable: true,
        configurable: true
    });
    Search.prototype.addDocument = function (document) {
        this.addDocuments([document]);
    };
    Search.prototype.addDocuments = function (documents) {
        this.documents_.push.apply(this.documents_, documents);
        this.indexDocuments_(documents, Object.keys(this.searchableFieldsMap_));
    };
    Search.prototype.addSearchableField = function (field) {
        this.searchableFieldsMap_[field] = true;
        this.indexDocuments_(this.documents_, [field]);
    };
    Search.prototype.search = function (query) {
        var tokens = this.tokenizer_.tokenize(this.sanitizer_.sanitize(query));
        var uidToDocumentMaps = [];
        for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
            var token = tokens[i];
            var uidToDocumentMap = this.searchIndex_[token];
            if (uidToDocumentMap) {
                uidToDocumentMaps.push(uidToDocumentMap);
            }
        }
        var uidToDocumentMap = this.pruningStrategy_.prune(uidToDocumentMaps);
        var documents = [];
        for (var uid in uidToDocumentMap) {
            documents.push(uidToDocumentMap[uid]);
        }
        return documents;
    };
    Search.prototype.indexDocuments_ = function (documents, searchableFields) {
        this.initialized_ = true;
        for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
            var document = documents[di];
            var uid = document[this.uidFieldName_];
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
    return Search;
})();
;
;
;
//# sourceMappingURL=js-search.js.map