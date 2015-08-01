/// <reference path="tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    /**
     * Simple tokenizer that splits strings on whitespace characters and returns an array of all non-empty substrings.
     */
    var SimpleTokenizer = (function () {
        function SimpleTokenizer() {
        }
        /**
         * @inheritDocs
         */
        SimpleTokenizer.prototype.tokenize = function (text) {
            return text.split(/[^a-zA-Z0-9\-']+/)
                .filter(function (text) {
                return !!text; // Filter empty tokens
            });
        };
        return SimpleTokenizer;
    })();
    JsSearch.SimpleTokenizer = SimpleTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=simple-tokenizer.js.map