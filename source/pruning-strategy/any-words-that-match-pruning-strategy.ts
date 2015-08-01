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
    public prune(uidToDocumentMaps:Array<IUidToDocumentMap>):IUidToDocumentMap {
      var filteredUidToDocumentMap:IUidToDocumentMap = {};

      for (var i = 0, numMaps = uidToDocumentMaps.length; i < numMaps; i++) {
        var uidToDocumentMap:IUidToDocumentMap = uidToDocumentMaps[i];

        for (var uid in uidToDocumentMap) {
          filteredUidToDocumentMap[uid] = uidToDocumentMap[uid];
        }
      }

      return filteredUidToDocumentMap;
    }
  };
};