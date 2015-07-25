# JS Search
##### Simple client-side search utility

For example, JS Search could be used to index the following books:

```js
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
search.search('The');   // theGreatGatsby, theDaVinciCode
search.search('scott'); // theGreatGatsby
search.search('d');     // angelsAndDemons, theDaVinciCode
```