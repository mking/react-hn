var _ = require('lodash');
var NewsHeader = require('./NewsHeader');
var NewsItem = require('./NewsItem');
var React = require('react');

var NewsList = React.createClass({
  getMore: function () {
    return (
      <div className="newsList-more">
        <a className="newsList-moreLink" href="https://news.ycombinator.com/news?p=2">More</a>
      </div>
    );
  },

  render: function () {
    return (
      <div className="newsList">
        <NewsHeader/>
        <div className="newsList-items">
          {_.map(this.props.items, function (item, index) {
            return <NewsItem key={item.id} item={item} rank={index + 1}/>;
          }.bind(this))}
        </div>
        {this.getMore()}
      </div>
    );
  }
});

module.exports = NewsList;
