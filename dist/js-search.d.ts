declare module JsSearch {
    interface IIndexStrategy {
        expandToken(token: string): Array<string>;
    }
}
declare module JsSearch {
    class AllSubstringsIndexStrategy implements IIndexStrategy {
        expandToken(token: string): Array<string>;
    }
}
declare module JsSearch {
    class ExactWordIndexStrategy implements IIndexStrategy {
        expandToken(token: string): Array<string>;
    }
}
declare module JsSearch {
    class PrefixIndexStrategy implements IIndexStrategy {
        expandToken(token: string): Array<string>;
    }
}
declare module JsSearch {
    interface IPruningStrategy {
        prune(uidToDocumentMaps: Array<IUidToDocumentMap>): IUidToDocumentMap;
    }
}
declare module JsSearch {
    interface IUidToDocumentMap {
        [uid: string]: Object;
    }
}
declare module JsSearch {
    class AllWordsMustMatchPruningStrategy implements IPruningStrategy {
        prune(uidToDocumentMaps: Array<IUidToDocumentMap>): IUidToDocumentMap;
    }
}
declare module JsSearch {
    class AnyWordsThatMatchPruningStrategy implements IPruningStrategy {
        prune(uidToDocumentMaps: Array<IUidToDocumentMap>): IUidToDocumentMap;
    }
}
declare module JsSearch {
    interface ISanitizer {
        sanitize(text: string): string;
    }
}
declare module JsSearch {
    class CaseSensitiveSanitizer implements ISanitizer {
        sanitize(text: string): string;
    }
}
declare module JsSearch {
    class LowerCaseSanitizer implements ISanitizer {
        sanitize(text: string): string;
    }
}
declare module JsSearch {
    interface ISearchTokenToDocumentMap {
        [uid: string]: IUidToDocumentMap;
    }
}
declare module JsSearch {
    interface ITokenizer {
        tokenize(text: string): Array<string>;
    }
}
declare module JsSearch {
    class SimpleTokenizer implements ITokenizer {
        tokenize(text: string): Array<string>;
    }
}
declare module JsSearch {
    class Search {
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
}
declare module JsSearch {
    class StemmingTokenizer implements ITokenizer {
        private stemmingFunction_;
        private tokenizer_;
        constructor(stemmingFunction: (text: string) => string, decoratedTokenizer: ITokenizer);
        tokenize(text: string): Array<string>;
    }
}
declare module JsSearch {
    class StopWordsTokenizer implements ITokenizer {
        private tokenizer_;
        constructor(decoratedTokenizer: ITokenizer);
        tokenize(text: string): Array<string>;
    }
}
declare module JsSearch {
    class TokenHighlighter {
        private indexStrategy_;
        private sanitizer_;
        private wrapperTagName_;
        constructor(opt_indexStrategy: IIndexStrategy, opt_sanitizer: ISanitizer, opt_wrapperTagName: string);
        highlight(text: string, tokens: Array<string>): string;
        private wrapText_(text);
    }
}
declare module JsSearch {
    var StopWordsMap: {
        a: boolean;
        about: boolean;
        an: boolean;
        and: boolean;
        are: boolean;
        as: boolean;
        at: boolean;
        be: boolean;
        by: boolean;
        for: boolean;
        from: boolean;
        how: boolean;
        i: boolean;
        in: boolean;
        is: boolean;
        it: boolean;
        of: boolean;
        on: boolean;
        or: boolean;
        that: boolean;
        the: boolean;
        this: boolean;
        to: boolean;
        was: boolean;
        what: boolean;
        when: boolean;
        where: boolean;
        who: boolean;
        will: boolean;
        with: boolean;
    };
}
