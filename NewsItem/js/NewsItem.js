var $ = require('jquery');
var React = require('react');

var NewsItem = React.createClass({
  componentWillMount: function () {
    $.ajax({
      url: '/json/items.json'
    }).then(function (items) {
      console.log('items', items);
      this.setState({item: items[0]});
    }.bind(this));
  },

  getInitialState: function () {
    return {};
  },

  render: function () {
    if (!this.state.item) {
      return null;
    }

    return (
      <div className="newsItem">
        {this.state.item.title}
      </div>
    );
  }
});

React.render(<NewsItem/>, $('#content')[0]);
