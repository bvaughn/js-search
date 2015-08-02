var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="index-strategy.ts" />
var JsSearch;
(function (JsSearch) {
    var AllSubstringsIndexStrategy = (function () {
        function AllSubstringsIndexStrategy() {
        }
        AllSubstringsIndexStrategy.prototype.expandToken = function (token) {
            var expandedTokens = [];
            for (var i = 0, length = token.length; i < length; ++i) {
                var prefixString = '';
                for (var j = i; j < length; ++j) {
                    prefixString += token.charAt(j);
                    expandedTokens.push(prefixString);
                }
            }
            return expandedTokens;
        };
        return AllSubstringsIndexStrategy;
    })();
    JsSearch.AllSubstringsIndexStrategy = AllSubstringsIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="index-strategy.ts" />
var JsSearch;
(function (JsSearch) {
    var ExactWordIndexStrategy = (function () {
        function ExactWordIndexStrategy() {
        }
        ExactWordIndexStrategy.prototype.expandToken = function (token) {
            return token ? [token] : [];
        };
        return ExactWordIndexStrategy;
    })();
    JsSearch.ExactWordIndexStrategy = ExactWordIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="index-strategy.ts" />
var JsSearch;
(function (JsSearch) {
    var PrefixIndexStrategy = (function () {
        function PrefixIndexStrategy() {
        }
        PrefixIndexStrategy.prototype.expandToken = function (token) {
            var expandedTokens = [];
            var prefixString = '';
            for (var i = 0, length = token.length; i < length; ++i) {
                prefixString += token.charAt(i);
                expandedTokens.push(prefixString);
            }
            return expandedTokens;
        };
        return PrefixIndexStrategy;
    })();
    JsSearch.PrefixIndexStrategy = PrefixIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="pruning-strategy.ts" />
/// <reference path="../uid-to-document-map.ts" />
var JsSearch;
(function (JsSearch) {
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
    JsSearch.AllWordsMustMatchPruningStrategy = AllWordsMustMatchPruningStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="pruning-strategy.ts" />
/// <reference path="../uid-to-document-map.ts" />
var JsSearch;
(function (JsSearch) {
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
    JsSearch.AnyWordsThatMatchPruningStrategy = AnyWordsThatMatchPruningStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="sanitizer.ts" />
var JsSearch;
(function (JsSearch) {
    var CaseSensitiveSanitizer = (function () {
        function CaseSensitiveSanitizer() {
        }
        CaseSensitiveSanitizer.prototype.sanitize = function (text) {
            return text ? text.trim() : '';
        };
        return CaseSensitiveSanitizer;
    })();
    JsSearch.CaseSensitiveSanitizer = CaseSensitiveSanitizer;
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="sanitizer.ts" />
var JsSearch;
(function (JsSearch) {
    var LowerCaseSanitizer = (function () {
        function LowerCaseSanitizer() {
        }
        LowerCaseSanitizer.prototype.sanitize = function (text) {
            return text ? text.toLocaleLowerCase().trim() : '';
        };
        return LowerCaseSanitizer;
    })();
    JsSearch.LowerCaseSanitizer = LowerCaseSanitizer;
    ;
})(JsSearch || (JsSearch = {}));
;
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    var SimpleTokenizer = (function () {
        function SimpleTokenizer() {
        }
        SimpleTokenizer.prototype.tokenize = function (text) {
            return text.split(/[^a-zA-Z0-9\-']+/)
                .filter(function (text) {
                return !!text;
            });
        };
        return SimpleTokenizer;
    })();
    JsSearch.SimpleTokenizer = SimpleTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
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
(function (JsSearch) {
    var Search = (function () {
        function Search(uidFieldName) {
            this.uidFieldName_ = uidFieldName;
            this.indexStrategy_ = new JsSearch.PrefixIndexStrategy();
            this.pruningStrategy = new JsSearch.AllWordsMustMatchPruningStrategy();
            this.sanitizer_ = new JsSearch.LowerCaseSanitizer();
            this.tokenizer_ = new JsSearch.SimpleTokenizer();
            this.documents_ = [];
            this.searchableFieldsMap_ = {};
            this.searchIndex_ = {};
        }
        Object.defineProperty(Search.prototype, "indexStrategy", {
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
        Object.defineProperty(Search.prototype, "pruningStrategy", {
            get: function () {
                return this.pruningStrategy_;
            },
            set: function (value) {
                this.pruningStrategy_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "sanitizer", {
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
        Object.defineProperty(Search.prototype, "tokenizer", {
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
        Search.prototype.addDocument = function (document) {
            this.addDocuments([document]);
        };
        Search.prototype.addDocuments = function (documents) {
            this.documents_.push.apply(this.documents_, documents);
            this.indexDocuments_(documents, Object.keys(this.searchableFieldsMap_));
        };
        Search.prototype.addIndex = function (field) {
            this.searchableFieldsMap_[field] = true;
            this.indexDocuments_(this.documents_, [field]);
        };
        Search.prototype.search = function (query) {
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
    JsSearch.Search = Search;
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    var StemmingTokenizer = (function () {
        function StemmingTokenizer(stemmingFunction, decoratedTokenizer) {
            this.stemmingFunction_ = stemmingFunction;
            this.tokenizer_ = decoratedTokenizer;
        }
        StemmingTokenizer.prototype.tokenize = function (text) {
            return this.tokenizer_.tokenize(text)
                .map(function (token) {
                return this.stemmingFunction_(token);
            }, this);
        };
        return StemmingTokenizer;
    })();
    JsSearch.StemmingTokenizer = StemmingTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
/// <reference path="tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    var StopWordsTokenizer = (function () {
        function StopWordsTokenizer(decoratedTokenizer) {
            this.tokenizer_ = decoratedTokenizer;
        }
        StopWordsTokenizer.prototype.tokenize = function (text) {
            return this.tokenizer_.tokenize(text)
                .filter(function (token) {
                return !JsSearch.StopWordsMap[token];
            });
        };
        return StopWordsTokenizer;
    })();
    JsSearch.StopWordsTokenizer = StopWordsTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
var JsSearch;
(function (JsSearch) {
    var TokenHighlighter = (function () {
        function TokenHighlighter(opt_indexStrategy, opt_sanitizer, opt_wrapperTagName) {
            this.indexStrategy_ = opt_indexStrategy || new JsSearch.PrefixIndexStrategy();
            this.sanitizer_ = opt_sanitizer || new JsSearch.LowerCaseSanitizer();
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
    JsSearch.TokenHighlighter = TokenHighlighter;
    ;
})(JsSearch || (JsSearch = {}));
;
var JsSearch;
(function (JsSearch) {
    JsSearch.StopWordsMap = {
        a: true,
        about: true,
        an: true,
        and: true,
        are: true,
        as: true,
        at: true,
        be: true,
        by: true,
        for: true,
        from: true,
        how: true,
        i: true,
        in: true,
        is: true,
        it: true,
        of: true,
        on: true,
        or: true,
        that: true,
        the: true,
        this: true,
        to: true,
        was: true,
        what: true,
        when: true,
        where: true,
        who: true,
        will: true,
        with: true,
    };
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=js-search.js.map