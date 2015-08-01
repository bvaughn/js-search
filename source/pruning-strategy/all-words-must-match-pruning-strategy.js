/// <reference path="pruning-strategy.ts" />
/// <reference path="../uid-to-document-map.ts" />
var JsSearch;
(function (JsSearch) {
    /**
     * This pruning policy only returns search results matching every search token.
     */
    var AllWordsMustMatchPruningStrategy = (function () {
        function AllWordsMustMatchPruningStrategy() {
        }
        /**
         * @inheritDocs
         */
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
//# sourceMappingURL=all-words-must-match-pruning-strategy.js.map