var _ = require('lodash');
var $ = require('jquery');
var moment = require('moment');
var React = require('react/addons');
var url = require('url');

var NewsItem = React.createClass({
  getCommentLinkText: function () {
    if (!this.props.item.kids) {
      return 'discuss';
    }

    return this.props.item.kids.length + ' comments';
  },

  getCommentUrl: function () {
    return 'https://news.ycombinator.com/item?id=' + this.props.item.id;
  },

  getDomain: function () {
    var itemUrl = url.parse(this.props.item.url);
    return itemUrl.hostname;
  },

  getSubtext: function () {
    return (
      <div className="newsItem-subtext">
        <span className="newsItem-score">{this.props.item.score}</span> points by <a className="newsItem-textLink" href={this.getUserUrl()}>{this.props.item.by}</a> {this.getTime()} | <a className="newsItem-textLink" href={this.getCommentUrl()}>{this.getCommentLinkText()}</a>
      </div>
    );
  },

  getVote: function () {
    return (
      <div className="newsItem-vote">
        <a className="newsItem-voteLink" href={this.getVoteUrl()}><i className="newsItem-voteIcon fa fa-arrow-up"/></a>
      </div>
    );
  },

  getVoteUrl: function () {
    return 'https://news.ycombinator.com/vote?for=' + this.props.item.id + '&whence=news';
  },

  getRank: function () {
    return (
      <div className="newsItem-rank">{this.props.rank}.</div>
    );
  },

  getTime: function () {
    return moment(this.props.item.time * 1000).fromNow();
  },

  getTitle: function () {
    return (
      <div className="newsItem-title">
        <a className="newsItem-titleLink" href={this.props.item.url}>{this.props.item.title}</a> <span className="newsItem-domain">({this.getDomain()})</span>
      </div>
    );
  },

  getUserUrl: function () {
    return 'https://news.ycombinator.com/user?id=' + this.props.item.by;
  },

  render: function () {
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

module.exports = NewsItem;
