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
    interface ISearchIndex {
        indexDocument(token: string, uid: string, document: Object): void;
        search(tokens: Array<string>, corpus: Array<Object>): Array<Object>;
    }
}
declare module JsSearch {
    class TfIdfSearchIndex implements ISearchIndex {
        private tokenToIdfCache_;
        private tokenMap_;
        private uidFieldName_;
        constructor(uidFieldName: string);
        indexDocument(token: string, uid: string, document: Object): void;
        search(tokens: Array<string>, corpus: Array<Object>): Array<Object>;
        private calculateIdf_(token, documents);
        private calculateTfIdf_(tokens, document, documents);
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
        private indexStrategy_;
        private initialized_;
        private sanitizer_;
        private searchableFieldsMap_;
        private searchIndex_;
        private tokenizer_;
        private uidFieldName_;
        constructor(uidFieldName: string);
        indexStrategy: IIndexStrategy;
        sanitizer: ISanitizer;
        searchIndex: ISearchIndex;
        tokenizer: ITokenizer;
        addDocument(document: Object): void;
        addDocuments(documents: Array<Object>): void;
        addIndex(field: string): void;
        search(query: string): Array<Object>;
        private indexDocuments_(documents, searchableFields);
    }
}
declare module JsSearch {
    class UnorderedSearchIndex implements ISearchIndex {
        private tokenToUidToDocumentMap_;
        constructor();
        indexDocument(token: string, uid: string, document: Object): void;
        search(tokens: Array<string>, corpus: Array<Object>): Array<Object>;
    }
}
declare module JsSearch {
    var StopWordsMap: {
        a: string;
        able: string;
        about: string;
        across: string;
        after: string;
        all: string;
        almost: string;
        also: string;
        am: string;
        among: string;
        an: string;
        and: string;
        any: string;
        are: string;
        as: string;
        at: string;
        be: string;
        because: string;
        been: string;
        but: string;
        by: string;
        can: string;
        cannot: string;
        could: string;
        dear: string;
        did: string;
        do: string;
        does: string;
        either: string;
        else: string;
        ever: string;
        every: string;
        for: string;
        from: string;
        get: string;
        got: string;
        had: string;
        has: string;
        have: string;
        he: string;
        her: string;
        hers: string;
        him: string;
        his: string;
        how: string;
        however: string;
        i: string;
        if: string;
        in: string;
        into: string;
        is: string;
        it: string;
        its: string;
        just: string;
        least: string;
        let: string;
        like: string;
        likely: string;
        may: string;
        me: string;
        might: string;
        most: string;
        must: string;
        my: string;
        neither: string;
        no: string;
        nor: string;
        not: string;
        of: string;
        off: string;
        often: string;
        on: string;
        only: string;
        or: string;
        other: string;
        our: string;
        own: string;
        rather: string;
        said: string;
        say: string;
        says: string;
        she: string;
        should: string;
        since: string;
        so: string;
        some: string;
        than: string;
        that: string;
        the: string;
        their: string;
        them: string;
        then: string;
        there: string;
        these: string;
        they: string;
        this: string;
        tis: string;
        to: string;
        too: string;
        twas: string;
        us: string;
        wants: string;
        was: string;
        we: string;
        were: string;
        what: string;
        when: string;
        where: string;
        which: string;
        while: string;
        who: string;
        whom: string;
        why: string;
        will: string;
        with: string;
        would: string;
        yet: string;
        you: string;
        your: string;
    };
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
