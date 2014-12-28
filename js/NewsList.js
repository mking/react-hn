var _ = require('lodash');
var $ = require('jquery');
var NewsItem = require('./NewsItem');
var Promise = require('bluebird');
var React = require('react/addons');

var NewsList = React.createClass({
  componentWillMount: function () {
    Promise.resolve($.ajax({
      url: '/json/items.json',
      dataType: 'json'
    })).then((items) => {
      this.setState({items: items});
    });
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
  },

  getHeader: function () {
    return (
      <div className="newsList-header">
        {this.getLogo()}
        <div className="newsList-title">Hacker News</div>
        {this.getNav()}
        {this.getLogin()}
      </div>
    );
  },

  getInitialState: function () {
    return {
      items: []
    };
  },

  getLogin: function () {
    return (
      <div className="newsList-login">
        <a className="newsList-textLink" href="https://news.ycombinator.com/login?whence=news">login</a>
      </div>
    );
  },

  getLogo: function () {
    return (
      <div className="newsList-logo">
        <div className="newsList-logoBorder">
          <div className="newsList-logoText">
            Y
          </div>
        </div>
      </div>
    );
  },

  getNav: function () {
    var navItems = [
      {
        name: 'new',
        url: 'newest'
      },
      {
        name: 'comments',
        url: 'newcomments'
      },
      {
        name: 'show',
        url: 'show'
      },
      {
        name: 'ask',
        url: 'ask'
      },
      {
        name: 'jobs',
        url: 'jobs'
      },
      {
        name: 'submit',
        url: 'submit'
      }
    ];

    return (
      <div className="newsList-nav">
        {_.map(navItems, (navItem) => {
          return <a key={navItem.url} className="newsList-navLink newsList-textLink" href={'https://news.ycombinator.com/' + navItem.url}>{navItem.name}</a>
        })}
      </div>
    );
  },

  getMore: function () {
    return (
      <div className="newsList-more">
        <a className="newsList-textLink newsList-moreLink" href="https://news.ycombinator.com/news?p=2">More</a>
      </div>
    );
  },

  render: function () {
    return (
      <div className="newsList">
        {this.getHeader()}
        <div className="newsList-newsItems">
          {_.map(this.state.items, (item, index) => {
            return <NewsItem key={item.id} item={item} rank={index + 1}/>;
          })}
        </div>
        {this.getMore()}
      </div>
    );
  }
});

module.exports = NewsList;
