var $ = require('jquery');
var NewsList = require('./NewsList');
var React = require('react');

$.ajax({
  url: '/json/items.json'
}).then(function (items) {
  React.render(<NewsList items={items}/>, $('#content')[0]);
});
