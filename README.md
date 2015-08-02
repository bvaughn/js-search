# Search: client-side search library

Js Search enables efficient client-side searches of JavaScript and JSON objects.
It is ES5 compatible and does not require jQuery or any other third-party libraries.

Js Search is a lightweight version of [Lunr JS](http://lunrjs.com/). It is not as full-featured. (For example, Js Search does not currently provide a stemming feature.) However it is a little faster (runtime) and smaller (filesize) which may make it a compelling option in some cases.

Here are some JS Perf benchmarks comparing the two libraries. (Thanks to [olivernn](https://github.com/olivernn) for tweaking the Lunr side for a better comparison!)

* [Js Search vs Lunr JS: Building an index](http://jsperf.com/js-search-vs-lunr-js-build-search-index/4)
* [Js Search vs Lunr JS: Running searches](http://jsperf.com/js-search-vs-lunr-js-running-searches/4)

### Installation

You can install using either [Bower](http://bower.io/) or [NPM](https://www.npmjs.com/) like so:

```shell
npm install js-search
bower install js-search
```

### Overview

At a high level you configure Js Search by telling it which fields it should index for searching and then add the objects to be searched.

For example, a simple use of JS Search would be as follows:

```javascript
var theGreatGatsby = {
  isbn: '9781597226769',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
};
var theDaVinciCode = {
  isbn: '0307474275',
  title: 'The DaVinci Code',
  author: 'Dan Brown'
};
var angelsAndDemons = {
  isbn: '074349346X',
  title: 'Angels & Demons',
  author: 'Dan Brown'
};

var search = new Search('isbn');
search.addIndex('title');
search.addIndex('author');
search.addDocuments([theGreatGatsby, theDaVinciCode, angelsAndDemons]);
search.search('The');   // [theGreatGatsby, theDaVinciCode]
search.search('scott'); // [theGreatGatsby]
search.search('d');     // [angelsAndDemons, theDaVinciCode]
```

### Tokenization

Tokenization is the process of breaking text (e.g. sentences) into smaller, searchable tokens (e.g. words or parts of words). Js Search provides a basic tokenizer that should work well for English but you can provider your own like so:

```javascript
search.tokenizer = {
  tokenize( text /* string */ ) {
    // Convert text to an Array of strings and return the Array
  }
};
```

### Stemming

Stemming is the process of reducing search tokens to their root (or "stem") so that searches for different forms of a word will still yield results. For example "search", "searching" and "searched" can all be reduced to the stem "search".

Js Search does not implement its own stemming library but it does support stemming through the use of third-party libraries.

To enable stemming, use the `StemmingTokenizer` like so:

```javascript
var stemmer = require('porter-stemmer').stemmer;

search.tokenizer =
	new JsSearch.StemmingTokenizer(
        stemmer, // Function should accept a string param and return a string
	    new JsSearch.SimpleTokenizer());
```

### Stop Words

Stop words are very common (e.g. a, an, and, the, of) and are often not semantically meaningful. By default Js Search does not filter these words, but filtering can be enabled by using the `StopWordsTokenizer` like so:

```javascript
search.tokenizer =
	new JsSearch.StopWordsTokenizer(
    	new JsSearch.SimpleTokenizer());
```

By default Js Search uses a slightly modified version of the Google History stop words listed on [www.ranks.nl/stopwords](http://www.ranks.nl/stopwords). You can modify this list of stop words by adding or removing values from the `JsSearch.StopWordsMap` object like so:

```javascript
JsSearch.StopWordsMap.the = false; // Do not treate "the" as a stop word
JsSearch.StopWordsMap.bob = true;  // Treate "bob" as a stop word
```

Note that stop words are lower case and so using a case-sensitive sanitizer may prevent some stop words from being removed.