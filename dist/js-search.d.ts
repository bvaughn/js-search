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
declare class AllSubstringsIndexStrategy implements IIndexStrategy {
    expandToken(token: string): Array<string>;
}
declare class ExactWordIndexStrategy implements IIndexStrategy {
    expandToken(token: string): Array<string>;
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
declare class AnyWordsThatMatchPruningStrategy implements IPruningStrategy {
    prune(uidToDocumentMaps: Array<IUidToDocumentMap>): IUidToDocumentMap;
}
interface IPruningStrategy {
    prune(uidToDocumentMaps: Array<IUidToDocumentMap>): IUidToDocumentMap;
}
declare class CaseSensitiveSanitizer implements ISanitizer {
    sanitize(text: string): string;
}
declare class LowerCaseSanitizer implements ISanitizer {
    sanitize(text: string): string;
}
interface ISanitizer {
    sanitize(text: string): string;
}
declare class SimpleTokenizer implements ITokenizer {
    tokenize(text: string): Array<string>;
}
interface ITokenizer {
    tokenize(text: string): Array<string>;
}
declare class TokenHighlighter {
    private indexStrategy_;
    private sanitizer_;
    private wrapperTagName_;
    constructor(opt_indexStrategy: IIndexStrategy, opt_sanitizer: ISanitizer, opt_wrapperTagName: string);
    highlight(text: string, tokens: Array<string>): string;
    private wrapText_(text);
}
interface ISearchTokenToDocumentMap {
    [uid: string]: IUidToDocumentMap;
}
interface IUidToDocumentMap {
    [uid: string]: Object;
}
