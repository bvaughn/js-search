/// <reference path="pruning-strategy.ts" />
/// <reference path="../uid-to-document-map.ts" />

module JsSearch {

  /**
   * This pruning policy only returns search results matching every search token.
   */
  export class AllWordsMustMatchPruningStrategy implements IPruningStrategy {

    /**
     * @inheritDocs
     */
    public prune(uidToDocumentMaps:Array<IUidToDocumentMap>):IUidToDocumentMap {
      var filteredUidToDocumentMap:IUidToDocumentMap = {};

      for (var i = 0, numMaps = uidToDocumentMaps.length; i < numMaps; i++) {
        var uidToDocumentMap:IUidToDocumentMap = uidToDocumentMaps[i];

        if (i === 0) {
          for (var uid in uidToDocumentMap) {
            filteredUidToDocumentMap[uid] = uidToDocumentMap[uid];
          }
        } else {
          for (var uid in filteredUidToDocumentMap) {
            if (!uidToDocumentMap[uid]) {
              delete filteredUidToDocumentMap[uid];
            }
          }
        }
      }

      return filteredUidToDocumentMap;
    }
  };
};