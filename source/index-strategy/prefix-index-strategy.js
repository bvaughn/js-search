/// <reference path="index-strategy.ts" />
var JsSearch;
(function (JsSearch) {
    /**
     * Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
     */
    var PrefixIndexStrategy = (function () {
        function PrefixIndexStrategy() {
        }
        /**
         * @inheritDocs
         */
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
//# sourceMappingURL=prefix-index-strategy.js.map