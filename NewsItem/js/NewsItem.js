var $ = require('jquery');
var moment = require('moment');
var React = require('react');
var url = require('url');

var NewsItem = React.createClass({
  componentWillMount: function () {
    $.ajax({
      url: '/json/items.json'
    }).then(function (items) {
      console.log('items', items);
      this.setState({item: items[0]});
    }.bind(this));
  },

  getCommentLink: function () {
    var commentText = 'discuss';
    if (this.state.item.kids.length) {
      commentText = this.state.item.kids.length + ' comments';
    }

    return (
      <a href={'https://news.ycombinator.com/item?id=' + this.state.item.id}>{commentText}</a>
    );
  },

  getDomain: function () {
    return url.parse(this.state.item.url).hostname;
  },

  getInitialState: function () {
    return {};
  },

  getRank: function () {
    return (
      <div className="newsItem-rank">
        1.
      </div>
    );
  },

  getSubtext: function () {
    return (
      <div className="newsItem-subtext">
        {this.state.item.score} points by <a href={'https://news.ycombinator.com/user?id=' + this.state.item.by}>{this.state.item.by}</a> {moment.utc(this.state.item.time * 1000).fromNow()} | {this.getCommentLink()}
      </div>
    );
  },

  getTitle: function () {
    return (
      <div className="newsItem-title">
        <a className="newsItem-titleLink" href={this.state.item.url}>{this.state.item.title}</a>
        <span className="newsItem-domain">
          ({this.getDomain()})
        </span>
      </div>
    );
  },

  getVote: function () {
    return (
      <div className="newsItem-vote">
        <a href={'https://news.ycombinator.com/vote?for=' + this.state.item.id + '&dir=up&whence=news'}>
          <img src="/img/grayarrow2x.gif" width="10"/>
        </a>
      </div>
    );
  },

  render: function () {
    if (!this.state.item) {
      return null;
    }

    return (
      <div className="newsItem">
        {this.getRank()}
        {this.getVote()}
        <div className="newsItem-itemText">
          {this.getTitle()}
          {this.getSubtext()}
        </div>
      </div>
    );
  }
});

React.render(<NewsItem/>, $('#content')[0]);
