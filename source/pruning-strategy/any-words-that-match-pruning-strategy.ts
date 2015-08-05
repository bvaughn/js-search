/// <reference path="pruning-strategy.ts" />
/// <reference path="../uid-to-document-map.ts" />

module JsSearch {

  /**
   * This pruning policy returns search results matching any search token.
   */
  export class AnyWordsThatMatchPruningStrategy implements IPruningStrategy {

    /**
     * @inheritDocs
     */
    public prune(uidToDocumentMaps:Array<UidToDocumentMap>):UidToDocumentMap {
      var filteredUidToDocumentMap:UidToDocumentMap = {};

      for (var i = 0, numMaps = uidToDocumentMaps.length; i < numMaps; i++) {
        var uidToDocumentMap:UidToDocumentMap = uidToDocumentMaps[i];

        for (var uid in uidToDocumentMap) {
          filteredUidToDocumentMap[uid] = uidToDocumentMap[uid];
        }
      }

      return filteredUidToDocumentMap;
    }
  };
};