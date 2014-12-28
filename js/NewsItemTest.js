var $ = require('jquery');
var NewsItem = require('./NewsItem');
var React = require('react');

$.ajax({
  url: '/json/items.json'
}).then(function (items) {
  // Log the data so we can inspect it in the developer console.
  console.log('items', items);
  React.render(<NewsItem item={items[0]}/>, $('#content')[0]);
});
