interface IIndexStrategy {
    index(searchIndex: ISearchTokenToDocumentMap, uid: string, fieldTokens: Array<String>, document: Object): void;
}
declare class PrefixIndexStrategy implements IIndexStrategy {
    index(searchIndex: ISearchTokenToDocumentMap, uid: string, fieldTokens: Array<string>, document: Object): void;
}
declare class AllWordsMustMatchPruningStrategy implements IPruningStrategy {
    prune(uidToDocumentMaps: Array<IUidToDocumentMap>): IUidToDocumentMap;
}
interface IPruningStrategy {
    prune(uidToDocumentMaps: Array<IUidToDocumentMap>): IUidToDocumentMap;
}
declare class LowerCaseSanitizer implements ISanitizer {
    sanitize(text: string): string;
}
interface ISanitizer {
    sanitize(text: string): string;
}
interface ITokenizer {
    tokenize(text: string): Array<string>;
}
declare class WhitespaceTokenizer implements ITokenizer {
    tokenize(text: string): Array<string>;
}
declare class Search {
    private documents_;
    private uidFieldName_;
    private indexStrategy_;
    private initialized_;
    private tokenizer_;
    private sanitizer_;
    private searchableFieldsMap_;
    private searchIndex_;
    private pruningStrategy_;
    constructor(uidFieldName: string);
    indexStrategy: IIndexStrategy;
    pruningStrategy: IPruningStrategy;
    sanitizer: ISanitizer;
    tokenizer: ITokenizer;
    addDocument(document: Object): void;
    addDocuments(documents: Array<Object>): void;
    addSearchableField(field: string): void;
    search(query: string): Array<Object>;
    private initializeSearchIndex_(documents, searchableFields);
}
interface ISearchTokenToDocumentMap {
    [uid: string]: IUidToDocumentMap;
}
interface IUidToDocumentMap {
    [uid: string]: Object;
}
