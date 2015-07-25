interface IIndexStrategy {

  index(searchIndex:ISearchTokenToDocumentMap, uid:string, fieldTokens:Array<String>, document:Object):void;
};