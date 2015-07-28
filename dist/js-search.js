var JsSearch = (function () {
    function JsSearch(uidFieldName) {
        this.uidFieldName_ = uidFieldName;
        this.indexStrategy_ = new PrefixIndexStrategy();
        this.pruningStrategy = new AllWordsMustMatchPruningStrategy();
        this.sanitizer_ = new LowerCaseSanitizer();
        this.tokenizer_ = new WhitespaceTokenizer();
        this.documents_ = [];
        this.searchableFieldsMap_ = {};
        this.searchIndex_ = {};
    }
    Object.defineProperty(JsSearch.prototype, "indexStrategy", {
        get: function () {
            return this.indexStrategy_;
        },
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
        set: function (value) {
            if (this.initialized_) {
                throw Error('ITokenizer cannot be set after initialization');
            }
            this.tokenizer_ = value;
        },
        enumerable: true,
        configurable: true
    });
    JsSearch.prototype.addDocument = function (document) {
        this.addDocuments([document]);
    };
    JsSearch.prototype.addDocuments = function (documents) {
        this.documents_.push.apply(this.documents_, documents);
        this.indexDocuments_(documents, Object.keys(this.searchableFieldsMap_));
    };
    JsSearch.prototype.addIndex = function (field) {
        this.searchableFieldsMap_[field] = true;
        this.indexDocuments_(this.documents_, [field]);
    };
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
        return documents;
    };
    JsSearch.prototype.indexDocuments_ = function (documents, searchableFields) {
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
    return JsSearch;
})();
;
var AllSubstringsIndexStrategy = (function () {
    function AllSubstringsIndexStrategy() {
    }
    AllSubstringsIndexStrategy.prototype.expandToken = function (token) {
        var expandedTokens = [];
        for (var i = 0, length = token.length; i < length; i++) {
            var prefixString = '';
            for (var j = i; j < length; j++) {
                prefixString += token.charAt(j);
                expandedTokens.push(prefixString);
            }
        }
        return expandedTokens;
    };
    return AllSubstringsIndexStrategy;
})();
;
var ExactWordIndexStrategy = (function () {
    function ExactWordIndexStrategy() {
    }
    ExactWordIndexStrategy.prototype.expandToken = function (token) {
        return token ? [token] : [];
    };
    return ExactWordIndexStrategy;
})();
;
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
var AnyWordsThatMatchPruningStrategy = (function () {
    function AnyWordsThatMatchPruningStrategy() {
    }
    AnyWordsThatMatchPruningStrategy.prototype.prune = function (uidToDocumentMaps) {
        var filteredUidToDocumentMap = {};
        for (var i = 0, numMaps = uidToDocumentMaps.length; i < numMaps; i++) {
            var uidToDocumentMap = uidToDocumentMaps[i];
            for (var uid in uidToDocumentMap) {
                filteredUidToDocumentMap[uid] = uidToDocumentMap[uid];
            }
        }
        return filteredUidToDocumentMap;
    };
    return AnyWordsThatMatchPruningStrategy;
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
var TokenHighlighter = (function () {
    function TokenHighlighter(opt_indexStrategy, opt_sanitizer, opt_wrapperTagName) {
        this.indexStrategy_ = opt_indexStrategy || new PrefixIndexStrategy();
        this.sanitizer_ = opt_sanitizer || new LowerCaseSanitizer();
        this.wrapperTagName_ = opt_wrapperTagName || 'mark';
    }
    TokenHighlighter.prototype.highlight = function (text, tokens) {
        var tagsLength = this.wrapText_('').length;
        var tokenDictionary = {};
        for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
            var token = this.sanitizer_.sanitize(tokens[i]);
            var expandedTokens = this.indexStrategy_.expandToken(token);
            for (var j = 0, numExpandedTokens = expandedTokens.length; j < numExpandedTokens; j++) {
                var expandedToken = expandedTokens[j];
                if (!tokenDictionary[expandedToken]) {
                    tokenDictionary[expandedToken] = [token];
                }
                else {
                    tokenDictionary[expandedToken].push(token);
                }
            }
        }
        var actualCurrentWord = '';
        var sanitizedCurrentWord = '';
        var currentWordStartIndex = 0;
        for (var i = 0, textLength = text.length; i < textLength; i++) {
            var character = text.charAt(i);
            if (character === ' ') {
                actualCurrentWord = '';
                sanitizedCurrentWord = '';
                currentWordStartIndex = i + 1;
            }
            else {
                actualCurrentWord += character;
                sanitizedCurrentWord += this.sanitizer_.sanitize(character);
            }
            if (tokenDictionary[sanitizedCurrentWord] &&
                tokenDictionary[sanitizedCurrentWord].indexOf(sanitizedCurrentWord) >= 0) {
                actualCurrentWord = this.wrapText_(actualCurrentWord);
                text = text.substring(0, currentWordStartIndex) + actualCurrentWord + text.substring(i + 1);
                i += tagsLength;
                textLength += tagsLength;
            }
        }
        return text;
    };
    TokenHighlighter.prototype.wrapText_ = function (text) {
        return "<" + this.wrapperTagName_ + ">" + text + "</" + this.wrapperTagName_ + ">";
    };
    return TokenHighlighter;
})();
;
;
//# sourceMappingURL=js-search.js.map