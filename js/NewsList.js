var _ = require('lodash');
var $ = require('jquery');
var NewsHeader = require('./NewsHeader');
var NewsItem = require('./NewsItem');
var React = require('react/addons');

var NewsList = React.createClass({
  componentDidMount: function () {
    if (this.props.items) {
      return;
    }

    $.ajax({
      url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
      dataType: 'json'
    }).then(function (stories) {
      var detailDeferreds = _.map(stories.slice(0, 30), function (itemId) {
        return $.ajax({
          url: 'https://hacker-news.firebaseio.com/v0/item/' + itemId + '.json',
          dataType: 'json'
        });
      });
      return $.when.apply($, detailDeferreds);
    }).then(function () {
      var items = _.map(arguments, function (argument) {
        return argument[0];
      });
      this.setState({items: items});
    }.bind(this));
  },

  getInitialState: function () {
    return {
      items: []
    };
  },

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
          {_.map(this.props.items || this.state.items, function (item, index) {
            return <NewsItem key={item.id} item={item} rank={index + 1}/>;
          }.bind(this))}
        </div>
        {this.getMore()}
      </div>
    );
  }
});

module.exports = NewsList;
