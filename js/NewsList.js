var _ = require('lodash');
var $ = require('jquery');
var NewsHeader = require('./NewsHeader');
var NewsItem = require('./NewsItem');
var React = require('react/addons');

var NewsList = React.createClass({
  componentWillMount: function () {
    $.ajax({
      url: '/json/items.json',
      dataType: 'json'
    }).then(function (items) {
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
          {_.map(this.state.items, function (item, index) {
            return <NewsItem key={item.id} item={item} rank={index + 1}/>;
          }.bind(this))}
        </div>
        {this.getMore()}
      </div>
    );
  }
});

module.exports = NewsList;


/*Promise.resolve($.ajax({
  url: this.props.endpoint + '/v0/topstories.json',
  dataType: 'json'
})).then((allStories) => {
  var stories = allStories.slice(0, 30);
  return Promise.all(_.map(stories, (story) => {
    return Promise.resolve($.ajax({
      url: this.props.endpoint + '/v0/item/' + story + '.json',
      dataType: 'json'
    }));
  }));
}).then((stories) => {
  console.log(JSON.stringify(stories));
});*/
