var $ = require('jquery');
var React = require('react');

var NewsItem = React.createClass({
  render: function () {
    return (
      <div className="newsItem">
        NewsItem test
      </div>
    );
  }
});

React.render(<NewsItem/>, $('#content')[0]);
