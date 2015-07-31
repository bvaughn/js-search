# JsSearch: client-side search library

### What is it?

JsSearch enables efficient client-side searches of JavaScript and JSON objects.
It is ES5 compatible and does not require jQuery or any other third-party libraries.

### Is there a demo?

Yes there is!

[http://bvaughn.github.io/js-search/](http://bvaughn.github.io/js-search/)

### How does it work?

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