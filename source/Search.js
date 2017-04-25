// @flow
import getNestedFieldValue from './getNestedFieldValue';

import { PrefixIndexStrategy } from './IndexStrategy/index';
import { LowerCaseSanitizer } from './Sanitizer/index';
import { TfIdfSearchIndex } from './SearchIndex/index';
import { SimpleTokenizer } from './Tokenizer/index';

import type { IIndexStrategy } from './IndexStrategy/index';
import type { ISanitizer } from './Sanitizer/index';
import type { ISearchIndex } from './SearchIndex/index';
import type { ITokenizer } from './Tokenizer/index';

/**
 * Simple client-side searching within a set of documents.
 *
 * <p>Documents can be searched by any number of fields. Indexing and search strategies are highly customizable.
 */
export class Search {

  _documents : Array<Object>;
  _indexStrategy : IIndexStrategy;
  _initialized : boolean;
  _sanitizer : ISanitizer;

  /**
   * Array containing either a property name or a path (list of property names) to a nested value
   */
  _searchableFields : Array<string|Array<string>>;

  _searchIndex : ISearchIndex;
  _tokenizer : ITokenizer;
  _uidFieldName : string | Array<string>;

  /**
   * Constructor.
   * @param uidFieldName Field containing values that uniquely identify search documents; this field's values are used
   *                     to ensure that a search result set does not contain duplicate objects.
   */
  constructor(uidFieldName : string | Array<string>) {
    if (!uidFieldName) {
      throw Error('js-search requires a uid field name constructor parameter');
    }

    this._uidFieldName = uidFieldName;

    // Set default/recommended strategies
    this._indexStrategy = new PrefixIndexStrategy();
    this._searchIndex = new TfIdfSearchIndex(uidFieldName);
    this._sanitizer = new LowerCaseSanitizer();
    this._tokenizer = new SimpleTokenizer();

    this._documents = [];
    this._searchableFields = [];
  }

  /**
   * Override the default index strategy.
   * @param value Custom index strategy
   * @throws Error if documents have already been indexed by this search instance
   */
  set indexStrategy(value : IIndexStrategy) {
    if (this._initialized) {
      throw Error('IIndexStrategy cannot be set after initialization');
    }

    this._indexStrategy = value;
  }

  get indexStrategy() : IIndexStrategy {
    return this._indexStrategy;
  }

  /**
   * Override the default text sanitizing strategy.
   * @param value Custom text sanitizing strategy
   * @throws Error if documents have already been indexed by this search instance
   */
  set sanitizer(value : ISanitizer) {
    if (this._initialized) {
      throw Error('ISanitizer cannot be set after initialization');
    }

    this._sanitizer = value;
  }
  get sanitizer() : ISanitizer {
    return this._sanitizer;
  }

  /**
   * Override the default search index strategy.
   * @param value Custom search index strategy
   * @throws Error if documents have already been indexed
   */
  set searchIndex(value : ISearchIndex) {
    if (this._initialized) {
      throw Error('ISearchIndex cannot be set after initialization');
    }

    this._searchIndex = value;
  }
  get searchIndex() : ISearchIndex {
    return this._searchIndex;
  }

  /**
   * Override the default text tokenizing strategy.
   * @param value Custom text tokenizing strategy
   * @throws Error if documents have already been indexed by this search instance
   */
  set tokenizer(value : ITokenizer) {
    if (this._initialized) {
      throw Error('ITokenizer cannot be set after initialization');
    }

    this._tokenizer = value;
  }
  get tokenizer() : ITokenizer {
    return this._tokenizer;
  }

  /**
   * Add a searchable document to the index. Document will automatically be indexed for search.
   * @param document
   */
  addDocument(document : Object) : void {
    this.addDocuments([document]);
  }

  /**
   * Adds searchable documents to the index. Documents will automatically be indexed for search.
   * @param document
   */
  addDocuments(documents : Array<Object>) : void {
    this._documents = this._documents.concat(documents);
    this.indexDocuments_(documents, this._searchableFields);
  }

  /**
   * Add a new searchable field to the index. Existing documents will automatically be indexed using this new field.
   *
   * @param field Searchable field or field path. Pass a string to index a top-level field and an array of strings for nested fields.
   */
  addIndex(field : string|Array<string>) {
    this._searchableFields.push(field);
    this.indexDocuments_(this._documents, [field]);
  }

  /**
   * Search all documents for ones matching the specified query text.
   * @param query
   * @returns {Array<Object>}
   */
  search(query : string) : Array<Object> {
    var tokens : Array<string> = this._tokenizer.tokenize(this._sanitizer.sanitize(query));

    return this._searchIndex.search(tokens, this._documents);
  }

  /**
   * @param documents
   * @param _searchableFields Array containing property names and paths (lists of property names) to nested values
   * @private
   */
  indexDocuments_(documents : Array<Object>, _searchableFields : Array<string|Array<string>>) : void {
    this._initialized = true;

    var indexStrategy = this._indexStrategy;
    var sanitizer = this._sanitizer;
    var searchIndex = this._searchIndex;
    var tokenizer = this._tokenizer;
    var uidFieldName = this._uidFieldName;

    for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
      var doc = documents[di];
      var uid;

      if (uidFieldName instanceof Array) {
        uid = getNestedFieldValue(doc, uidFieldName);
      } else {
        uid = doc[uidFieldName];
      }

      for (var sfi = 0, numSearchableFields = _searchableFields.length; sfi < numSearchableFields; sfi++) {
        var fieldValue;
        var searchableField = _searchableFields[sfi];

        if (searchableField instanceof Array) {
          fieldValue = getNestedFieldValue(doc, searchableField);
        } else {
          fieldValue = doc[searchableField];
        }

        if (
          fieldValue != null &&
          typeof fieldValue !== 'string' &&
          fieldValue.toString
        ) {
          fieldValue = fieldValue.toString();
        }

        if (typeof fieldValue === 'string') {
          var fieldTokens = tokenizer.tokenize(sanitizer.sanitize(fieldValue));

          for (var fti = 0, numFieldValues = fieldTokens.length; fti < numFieldValues; fti++) {
            var fieldToken = fieldTokens[fti];
            var expandedTokens = indexStrategy.expandToken(fieldToken);

            for (var eti = 0, nummExpandedTokens = expandedTokens.length; eti < nummExpandedTokens; eti++) {
              var expandedToken = expandedTokens[eti];

              searchIndex.indexDocument(expandedToken, uid, doc);
            }
          }
        }
      }
    }
  }
}
