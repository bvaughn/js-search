[Installation](#installation) |
[Overview](#overview) |
[Tokenization](#tokenization) |
[Stemming](#stemming) |
[Stop Words](#stop-words) |
[Search Index](#configuring-the-search-index) |
[Index Strategy](#configuring-the-index-strategy)

# Js Search: client-side search library

Js Search enables efficient client-side searches of JavaScript and JSON objects.
It is ES5 compatible and does not require jQuery or any other third-party libraries.

Js Search began as a lightweight implementation of [Lunr JS](http://lunrjs.com/), offering runtime performance
improvements and a smaller file size. It has since expanded to include a rich feature set- supporting stemming,
stop-words, and TF-IDF ranking.

Here are some JS Perf benchmarks comparing the two search libraries. (Thanks to [olivernn](https://github.com/olivernn)
for tweaking the Lunr side for a better comparison!)

* [Initial building of search index](http://jsperf.com/js-search-vs-lunr-js-build-search-index/5)
* [Running a search](http://jsperf.com/js-search-vs-lunr-js-running-searches/5)

If you're looking for a simpler, web-worker optimized JS search utility check out [js-worker-search](https://github.com/bvaughn/js-worker-search).

---
### If you like this project, 🎉 [become a sponsor](https://github.com/sponsors/bvaughn/) or ☕ [buy me a coffee](http://givebrian.coffee/)
---
### Installation

You can install using either [Bower](http://bower.io/) or [NPM](https://www.npmjs.com/) like so:

```shell
npm install js-search
bower install js-search
```

### Overview

At a high level you configure Js Search by telling it which fields it should index for searching and then add the
objects to be searched.

For example, a simple use of JS Search would be as follows:

```javascript
import * as JsSearch from 'js-search';

var theGreatGatsby = {
  isbn: '9781597226769',
  title: 'The Great Gatsby',
  author: {
    name: 'F. Scott Fitzgerald'
  },
  tags: ['book', 'inspirational']
};
var theDaVinciCode = {
  isbn: '0307474275',
  title: 'The DaVinci Code',
  author: {
    name: 'Dan Brown'
  },
  tags: ['book', 'mystery']
};
var angelsAndDemons = {
  isbn: '074349346X',
  title: 'Angels & Demons',
  author: {
    name: 'Dan Brown',
  },
  tags: ['book', 'mystery']
};

var search = new JsSearch.Search('isbn');
search.addIndex('title');
search.addIndex(['author', 'name']);
search.addIndex('tags')

search.addDocuments([theGreatGatsby, theDaVinciCode, angelsAndDemons]);

search.search('The');    // [theGreatGatsby, theDaVinciCode]
search.search('scott');  // [theGreatGatsby]
search.search('dan');    // [angelsAndDemons, theDaVinciCode]
search.search('mystery') // [angelsAndDemons, theDaVinciCode]
```

### Tokenization

Tokenization is the process of breaking text (e.g. sentences) into smaller, searchable tokens (e.g. words or parts of
words). Js Search provides a basic tokenizer that should work well for English but you can provide your own like so:

```javascript
search.tokenizer = {
  tokenize( text /* string */ ) {
    // Convert text to an Array of strings and return the Array
  }
};
```

### Stemming

Stemming is the process of reducing search tokens to their root (or "stem") so that searches for different forms of a
word will still yield results. For example "search", "searching" and "searched" can all be reduced to the stem "search".

Js Search does not implement its own stemming library but it does support stemming through the use of third-party
libraries.

To enable stemming, use the `StemmingTokenizer` like so:

```javascript
var stemmer = require('porter-stemmer').stemmer;

search.tokenizer =
	new JsSearch.StemmingTokenizer(
        stemmer, // Function should accept a string param and return a string
	    new JsSearch.SimpleTokenizer());
```

### Stop Words

Stop words are very common (e.g. a, an, and, the, of) and are often not semantically meaningful. By default Js Search
does not filter these words, but filtering can be enabled by using the `StopWordsTokenizer` like so:

```javascript
search.tokenizer =
	new JsSearch.StopWordsTokenizer(
    	new JsSearch.SimpleTokenizer());
```

By default Js Search uses a slightly modified version of the Google History stop words listed on
[www.ranks.nl/stopwords](http://www.ranks.nl/stopwords). You can modify this list of stop words by adding or removing
values from the `JsSearch.StopWordsMap` object like so:

```javascript
JsSearch.StopWordsMap.the = false; // Do not treat "the" as a stop word
JsSearch.StopWordsMap.bob = true;  // Treat "bob" as a stop word
```

Note that stop words are lower case and so using a case-sensitive sanitizer may prevent some stop words from being
removed.

### Configuring the search index

There are two search indices packaged with `js-search`.

Term frequency–inverse document frequency (or TF-IDF) is a numeric statistic intended to reflect how important a word
(or words) are to a document within a corpus. The TF-IDF value increases proportionally to the number of times a word
appears in the document but is offset by the frequency of the word in the corpus. This helps to adjust for the fact that
some words (e.g. and, or, the) appear more frequently than others.

By default Js Search supports TF-IDF ranking but this can be disabled for performance reasons if it is not required. You
can specify an alternate [`ISearchIndex`](https://github.com/bvaughn/js-search/blob/master/source/SearchIndex/SearchIndex.js)
implementation in order to disable TF-IDF, like so:

```javascript
// default
search.searchIndex = new JsSearch.TfIdfSearchIndex();

// Search index capable of returning results matching a set of tokens
// but without any meaningful rank or order.
search.searchIndex = new JsSearch.UnorderedSearchIndex();
```

### Configuring the index strategy

There are three index strategies packaged with `js-search`.

`PrefixIndexStrategy` indexes for prefix searches.
(e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).

`AllSubstringsIndexStrategy` indexes for all substrings. In other word "c", "ca", "cat", "a", "at", and "t" all match "cat".

`ExactWordIndexStrategy` indexes for exact word matches. For example "bob" will match "bob jones" (but "bo" will not).

By default Js Search supports prefix indexing but this is configurable. You
can specify an alternate [`IIndexStrategy`](https://github.com/bvaughn/js-search/blob/master/source/IndexStrategy/IndexStrategy.js)
implementation in order to disable prefix indexing, like so:

```javascript
// default
search.indexStrategy = new JsSearch.PrefixIndexStrategy();

// this index strategy is built for all substrings matches.
search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

// this index strategy is built for exact word matches.
search.indexStrategy = new JsSearch.ExactWordIndexStrategy();
```
