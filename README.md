# JsSearch: client-side search library

JsSearch enables efficient client-side searches of JavaScript and JSON objects.
It is ES5 compatible and does not require jQuery or any other third-party libraries.

You can see a live demo of JS search here:

[bvaughn.github.io/js-search/](http://bvaughn.github.io/js-search/)

There are also some JS Perf benchmarks comparing JS Search to Lunr JS:

[jsperf.com/js-search-vs-lunr-js](http://jsperf.com/js-search-vs-lunr-js)
* Building an index: [jsperf.com/js-search-vs-lunr-js-build-search-index](http://jsperf.com/js-search-vs-lunr-js-build-search-index) (94% faster) 
* Searching text: [jsperf.com/js-search-vs-lunr-js-running-searches](http://jsperf.com/js-search-vs-lunr-js-running-searches) (78% faster)

### Installation

You can install using either [Bower](http://bower.io/) or [NPM](https://www.npmjs.com/) like so:

```shell
npm install js-search
bower install js-search
```

### Overview

Configure JsSearch by telling it which fields it should analyze for searching and then add the objects to be searched.

For example:

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

var search = new JsSearch('isbn');
search.addIndex('title');
search.addIndex('author');
search.addDocuments([theGreatGatsby, theDaVinciCode, angelsAndDemons]);
search.search('The');   // [theGreatGatsby, theDaVinciCode]
search.search('scott'); // [theGreatGatsby]
search.search('d');     // [angelsAndDemons, theDaVinciCode]
```