declare class JsSearch {
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
    addIndex(field: string): void;
    search(query: string): Array<Object>;
    private indexDocuments_(documents, searchableFields);
}
interface IIndexStrategy {
    expandToken(token: string): Array<string>;
}
declare class PrefixIndexStrategy implements IIndexStrategy {
    expandToken(token: string): Array<string>;
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
interface ISearchTokenToDocumentMap {
    [uid: string]: IUidToDocumentMap;
}
interface IUidToDocumentMap {
    [uid: string]: Object;
}
