var _ = require('lodash');
var $ = require('jquery');
var NewsList = require('./NewsList');
var React = require('react');

// Get the top item ids
$.ajax({
  url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  dataType: 'json'
}).then(function (stories) {
  // Get the item details in parallel
  var detailDeferreds = _(stories.slice(0, 30)).map(function (itemId) {
    return $.ajax({
      url: 'https://hacker-news.firebaseio.com/v0/item/' + itemId + '.json',
      dataType: 'json'
    });
  }).value();
  return $.when.apply($, detailDeferreds);
}).then(function () {
  // Extract the response JSON
  var items = _(arguments).map(function (argument) {
    return argument[0];
  }).value();
  React.render(<NewsList items={items}/>, $('#content')[0]);
});
