class AllWordsMustMatchPruningStrategy implements IPruningStrategy {

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
}