var _ = require('lodash');
var $ = require('jquery');
var NewsList = require('./NewsList');
var React = require('react/addons');

React.render(<NewsList/>, $('#content')[0]);
