interface IPruningStrategy {

  prune(uidToDocumentMaps:Array<IUidToDocumentMap>):IUidToDocumentMap;
};