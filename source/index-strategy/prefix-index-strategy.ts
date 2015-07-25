class PrefixIndexStrategy implements IIndexStrategy {

  public index(searchIndex:ISearchTokenToDocumentMap, uid:string, fieldTokens:Array<string>, document:Object):void {
    for (var i = 0, numFieldValues = fieldTokens.length; i < numFieldValues; i++) {
      var fieldToken:string = fieldTokens[i];
      var prefixString:string = '';

      for (var j = 0; j < fieldToken.length; j++) {
        prefixString += fieldToken.charAt(j);

        if (!searchIndex[prefixString]) {
          searchIndex[prefixString] = {};
        }

        searchIndex[prefixString][uid] = document;
      }
    }
  }
};