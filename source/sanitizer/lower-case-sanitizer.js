/// <reference path="sanitizer.ts" />
var JsSearch;
(function (JsSearch) {
    /**
     * Sanitizes text by converting to a locale-friendly lower-case version and triming leading and trailing whitespace.
     */
    var LowerCaseSanitizer = (function () {
        function LowerCaseSanitizer() {
        }
        /**
         * @inheritDocs
         */
        LowerCaseSanitizer.prototype.sanitize = function (text) {
            return text ? text.toLocaleLowerCase().trim() : '';
        };
        return LowerCaseSanitizer;
    })();
    JsSearch.LowerCaseSanitizer = LowerCaseSanitizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=lower-case-sanitizer.js.map