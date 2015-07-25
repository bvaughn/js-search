class Search {

  private documents_:Array<Object>;
  private uidFieldName_:string;
  private indexStrategy_:IIndexStrategy;
  private initialized_:boolean;
  private tokenizer_:ITokenizer;
  private sanitizer_:ISanitizer;
  private searchableFieldsMap_:Object;
  private searchIndex_:ISearchTokenToDocumentMap;
  private pruningStrategy_:IPruningStrategy;

  constructor(uidFieldName:string) {
    this.uidFieldName_ = uidFieldName;

    this.indexStrategy_ = new PrefixIndexStrategy();
    this.pruningStrategy = new AllWordsMustMatchPruningStrategy();
    this.sanitizer_ = new LowerCaseSanitizer();
    this.tokenizer_ = new WhitespaceTokenizer();

    this.documents_ = [];
    this.searchableFieldsMap_ = {};
    this.searchIndex_ = {};
  }

  public set indexStrategy(value:IIndexStrategy) {
    if (this.initialized_) {
      throw Error('IIndexStrategy cannot be set after initialization');
    }

    this.indexStrategy_ = value;
  }

  public set pruningStrategy(value:IPruningStrategy) {
    this.pruningStrategy_ = value;
  }

  public set sanitizer(value:ISanitizer) {
    if (this.initialized_) {
      throw Error('ISanitizer cannot be set after initialization');
    }

    this.sanitizer_ = value;
  }

  public set tokenizer(value:ITokenizer) {
    if (this.initialized_) {
      throw Error('ITokenizer cannot be set after initialization');
    }

    this.tokenizer_ = value;
  }

  public addDocument(document:Object):void {
    this.addDocuments([document]);
  }

  public addDocuments(documents:Array<Object>):void {
    this.documents_.push.apply(this.documents_, documents);
    this.initializeSearchIndex_(documents, Object.keys(this.searchableFieldsMap_));
  }

  public addSearchableField(field:string) {
    this.searchableFieldsMap_[field] = true;
    this.initializeSearchIndex_(this.documents_, [field]);
  }

  public search(query:string):Array<Object> {
    var tokens:Array<string> = this.tokenizer_.tokenize(this.sanitizer_.sanitize(query));
    var uidToDocumentMaps:Array<IUidToDocumentMap> = [];

    for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
      var token:string = tokens[i];
      var uidToDocumentMap:IUidToDocumentMap = this.searchIndex_[token];

      if (uidToDocumentMap) {
        uidToDocumentMaps.push(uidToDocumentMap);
      }
    }

    var uidToDocumentMap:IUidToDocumentMap = this.pruningStrategy_.prune(uidToDocumentMaps);
    var documents:Array<Object> = [];

    for (var uid in uidToDocumentMap) {
      documents.push(uidToDocumentMap[uid]);
    }

    // TODO Sorting/prioritization

    return documents;
  }

  private initializeSearchIndex_(documents:Array<Object>, searchableFields:Array<string>):void {
    this.initialized_ = true;

    for (var i = 0, numDocuments = documents.length; i < numDocuments; i++) {
      var document:Object = documents[i];
      var uid:string = document[this.uidFieldName_];

      // TODO Error if missing UID

      for (var j = 0, numSearchableFields = searchableFields.length; j < numSearchableFields; j++) {
        var searchableField:string = searchableFields[j];
        var fieldValue:any = document[searchableField];

        if (typeof fieldValue === 'string') {
          var fieldTokens:Array<string> = this.tokenizer_.tokenize(this.sanitizer_.sanitize(fieldValue));

          this.indexStrategy_.index(this.searchIndex_, uid, fieldTokens, document);
        }

        // TODO console.warn if missing field
      }
    }
  }
};