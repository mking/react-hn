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
  var detailDeferreds = _.map(stories.slice(0, 30), function (itemId) {
    return $.ajax({
      url: 'https://hacker-news.firebaseio.com/v0/item/' + itemId + '.json',
      dataType: 'json'
    });
  });
  return $.when.apply($, detailDeferreds);
}).then(function () {
  // Extract the response JSON
  var items = _.map(arguments, function (argument) {
    return argument[0];
  });
  React.render(<NewsList items={items}/>, $('#content')[0]);
});
