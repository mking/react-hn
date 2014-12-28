React HN
===
This is a visual React tutorial. This tutorial should give you a feel for "growing" a React UI from small, modular parts. By the end of this tutorial, you will have built the [HN front page in React](https://mking.github.io/react-hn).

This tutorial has five parts:

 1. <a name="setup-toc" href="#setup">Setup</a>

 1. <p name="newsitem">NewsItem component</p>

    <img src="img/NewsItem@2x.png" width="532">

     1. [Display the title.](#newsitem-title)

        <img src="img/NewsItemTitle.png" width="110">

     1. [Display the domain.](#newsitem-domain)

        <img src="img/NewsItemDomain.png" width="213">

     1. [Display the subtext.](#newsitem-subtext)

        <img src="img/NewsItemSubtext.png" width="268">

     1. [Display the rank and vote.](#newsitem-rank-and-vote)

        <img src="img/NewsItemRankVote.png" width="297">

 1. <p name="newsheader">NewsHeader component</p>

    <img src="img/NewsHeader@2x.png" width="532">

    1. [Display the logo and title.](#newsheader-logo-and-title)

       <img src="img/NewsHeaderLogoTitle.png" width="140">

    1. [Display the nav links.](#newsheader-nav)

       <img src="img/NewsHeaderNav.png" width="453">

    1. [Display the login link.](#newsheader-login)

       <img src="img/NewsHeaderLogin.png" width="530">

 1. <p name="newslist">NewsList component</p>

    <img src="img/NewsList@2x.png" width="532">

    1. [Display the header and items.](#newslist-header-and-items)

       <img src="img/NewsListHeaderItems.png" width="270">

    1. [Display the more link.](#newslist-more)

       <img src="img/NewsListMore.png" width="136">

 1. <a name="hacker-news-api-toc" href="#hacker-news-api">Display live data</a>

> Note: Because there is only so much we can do in one tutorial, event handling (not needed for the HN front page) and Flux are out of scope.

Setup
---
 1. Create the project directory structure.
    ```
    mkdir -p hn/{build/js,css,html,img,js,json}
    cd hn
    ```

 1. [Download the sample data](https://raw.githubusercontent.com/mking/react-hn/master/json/items.json) into /json.

 1. Download [y18.gif](https://news.ycombinator.com/y18.gif) and [grayarrow2x.gif](https://news.ycombinator.com/grayarrow2x.gif) into /img.

 1. Create /package.json.
    ```
    {
      "name": "hn",
      "version": "0.1.0",
      "private": true,
      "browserify": {
        "transform": [
          ["reactify"]
        ]
      }
    }
    ```

 1. Install Browserify, React, and tools.
    ```
    # These dependencies are required for the running app.
    npm install --save react jquery lodash moment

    # These dependencies are required for building the app.
    npm install --save-dev browserify watchify reactify

    # These dependencies are globally installed command line tools.
    npm install -g browserify watchify
    ```

[Up](#setup-toc) - [Next](#newsitem)

NewsItem Title
---
 1. Create a new JS file: /js/NewsItem.js.
    ```
    var $ = require('jquery');
    var React = require('react');

    var NewsItem = React.createClass({
      render: function () {
        return (
          <div className="newsItem">
            <a className="newsItem-titleLink" href={this.props.item.url}>{this.props.item.title}</a>
          </div>
        );
      }
    });

    module.exports = NewsItem;
    ```

 1. Create a new JS file: /js/NewsItemTest.js.
    ```
    var $ = require('jquery');
    var NewsItem = require('./NewsItem');
    var React = require('react');

    $.ajax({
      url: '/json/items.json'
    }).then(function (items) {
      // Log the data so we can inspect it in the developer console.
      console.log('items', items);
      // Use a fake rank for now.
      React.render(<NewsItem item={items[0]} rank={1}/>, $('#content')[0]);
    });
    ```

 1. Create a new CSS file: /css/NewsItem.css. We are following [Jacob Thornton's CSS style guide](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06).
    ```
    .newsItem {
      color: #828282;
      margin-top: 5px;
    }

    .newsItem-titleLink {
      color: black;
      font-size: 10pt;
      text-decoration: none;
    }
    ```

 1. Create a new CSS file: /css/app.css.
    ```
    body {
      font-family: Verdana, sans-serif;
    }
    ```

 1. Create a new HTML file: /html/NewsItem.html.
    ```
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NewsItem</title>
        <link href="/css/NewsItem.css" rel="stylesheet">
        <link href="/css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="/build/js/NewsItemTest.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify. This compiles your React (JSX) components into ordinary JavaScript.
    ```
    watchify -v -o build/js/NewsItemTest.js js/NewsItemTest.js
    ```

 1. Start the HTTP server.
    ```
    python -m SimpleHTTPServer 8888
    ```

 1. Visit [http://localhost:8888/html/NewsItem.html](http://localhost:8888/html/NewsItem.html). You should see the following.

    <img src="img/NewsItemTitle.png" width="110">

    <img src="img/DeveloperConsole.png" width="274">

[Up](#newsitem) - [Next](#newsitem-domain)

NewsItem Domain
---
 1. Update the JS.
    ```
    var url = require('url');
    ...
    var NewsItem = React.createClass({
      ...
      getDomain: function () {
        return url.parse(this.props.item.url).hostname;
      },
      ...
      render: function () {
        return (
          <div className="newsItem">
            ...
            <span className="newsItem-domain">
              ({this.getDomain()})
            </span>
          </div>
        );
      }
    ```

 1. Update the CSS.
    ```
    .newsItem-domain {
      font-size: 8pt;
      margin-left: 5px;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsItemDomain.png" width="213">

[Up](#newsitem) - [Next](#newsitem-subtext)

NewsItem Subtext
---
 1. Update the JS. We factor out the title part into its own method.
    ```
    var moment = require('moment');
    ...
    var NewsItem = React.createClass({
      ...
      getCommentLink: function () {
        var commentText = 'discuss';
        if (this.props.item.kids && this.props.item.kids.length) {
          // This only counts top-level comments.
          // To get the full count, recursively get item details for this news item.
          commentText = this.props.item.kids.length + ' comments';
        }

        return (
          <a href={'https://news.ycombinator.com/item?id=' + this.props.item.id}>{commentText}</a>
        );
      },
      ...
      getSubtext: function () {
        return (
          <div className="newsItem-subtext">
            {this.props.item.score} points by <a href={'https://news.ycombinator.com/user?id=' + this.props.item.by}>{this.props.item.by}</a> {moment.utc(this.props.item.time * 1000).fromNow()} | {this.getCommentLink()}
          </div>
        );
      },
      ...
      getTitle: function () {
        return (
          <div className="newsItem-title">
            ...
          </div>
        );
      },
      ...
      render: function () {
        return (
          <div className="newsItem">
            {this.getTitle()}
            {this.getSubtext()}
          </div>
        );
      }
    ```

 1. Update the CSS.
    ```
    .newsItem-subtext {
      font-size: 7pt;
    }
    ...
    .newsItem-subtext > a {
      color: #828282;
      text-decoration: none;
    }
    ...
    .newsItem-subtext > a:hover {
      text-decoration: underline;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsItemSubtext.png" width="268">

[Up](#newsitem) - [Next](#newsitem-rank-and-vote)

NewsItem Rank and Vote
---
 1. Update the JS.
     ```
    var NewsItem = React.createClass({
      ...
      getRank: function () {
        return (
          <div className="newsItem-rank">
            {this.props.rank}.
          </div>
        );
      },
      ...
      getVote: function () {
        return (
          <div className="newsItem-vote">
            <a href={'https://news.ycombinator.com/vote?for=' + this.props.item.id + '&dir=up&whence=news'}>
              <img src="/img/grayarrow2x.gif" width="10"/>
            </a>
          </div>
        );
      },
      ...
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
    ```

 1. Update the CSS.
    ```
    .newsItem {
      ...
      align-items: baseline;
      display: flex;  
    }
    ...
    .newsItem-itemText {
      flex-grow: 1;
    }
    ...
    .newsItem-rank {
      flex-basis: 25px;
      font-size: 10pt;
      text-align: right;
    }
    ...
    .newsItem-vote {
      flex-basis: 15px;
      text-align: center;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsItemRankVote.png" width="297">

    You have now implemented HN news items in React.

    <img src="img/NewsItem@2x.png" width="532">

[Up](#newsitem) - [Next](#newsheader)

NewsHeader Logo and Title
---
 1. Create a new JS file: /js/NewsHeader.js.
    ```
    var $ = require('jquery');
    var React = require('react');

    var NewsHeader = React.createClass({
      getLogo: function () {
        return (
          <div className="newsHeader-logo">
            <a href="https://www.ycombinator.com"><img src="/img/y18.gif"/></a>
          </div>
        );
      },

      getTitle: function () {
        return (
          <div className="newsHeader-title">
            <a className="newsHeader-textLink" href="https://news.ycombinator.com">Hacker News</a>
          </div>
        );
      },

      render: function () {
        return (
          <div className="newsHeader">
            {this.getLogo()}
            {this.getTitle()}
          </div>
        );
      }
    });

    module.exports = NewsHeader;
    ```

 1. Create a new JS file: /js/NewsHeaderTest.js.
    ```
    var $ = require('jquery');
    var NewsHeader = require('./NewsHeader');
    var React = require('react');

    React.render(<NewsHeader/>, $('#content')[0]);
    ```

 1. Create a new CSS file: /css/NewsHeader.css.
    ```
    .newsHeader {
      align-items: center;
      background: #ff6600;
      color: black;
      display: flex;
      font-size: 10pt;
      padding: 2px;
    }

    .newsHeader-logo {
      border: 1px solid white;
      flex-basis: 18px;
      height: 18px;
    }

    .newsHeader-textLink {
      color: black;
      text-decoration: none;
    }

    .newsHeader-title {
      font-weight: bold;
      margin-left: 4px;
    }
    ```

 1. Create a new HTML file: /html/NewsHeader.html.
    ```
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NewsHeader</title>
        <link href="/css/NewsHeader.css" rel="stylesheet">
        <link href="/css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="/build/js/NewsHeaderTest.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
    ```
    watchify -v -o build/js/NewsHeaderTest.js js/NewsHeaderTest.js
    ```

 1. Start the HTTP server if necessary.
    ```
    python -m SimpleHTTPServer 8888
    ```

 1. Visit [http://localhost:8888/html/NewsHeader.html](http://localhost:8888/html/NewsHeader.html). You should see the following.

    <img src="img/NewsHeaderLogoTitle.png" width="140">

[Up](#newsheader) - [Next](#newsheader-nav)

NewsHeader Nav
---
 1. Update the JS.
    ```
    var _ = require('lodash');
    ...
    var NewsHeader = React.createClass({
      ...
      getNav: function () {
        var navLinks = [
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
          <div className="newsHeader-nav">
            {_.map(navLinks, function (navLink) {
              return (
                <a key={navLink.url} className="newsHeader-navLink newsHeader-textLink" href={'https://news.ycombinator.com/' + navLink.path}>
                  {navLink.name}
                </a>
              );
            })}
          </div>
        );
      },
      ...
      render: function () {
        return (
          <div className="newsHeader">
            ...
            {this.getNav()}
          </div>
        );
      }
    ```

 1. Update the CSS.
    ```
    .newsHeader-nav {
      flex-grow: 1;
      margin-left: 10px;
    }
    ...
    .newsHeader-navLink:not(:first-child)::before {
      content: ' | ';
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsHeaderNav.png" width="453">

[Up](#newsheader) - [Next](#newsheader-login)

NewsHeader Login
---
 1. Update the JS.
    ```
    var NewsHeader = React.createClass({
      ...
      getLogin: function () {
        return (
          <div className="newsHeader-login">
            <a className="newsHeader-textLink" href="https://news.ycombinator.com/login?whence=news">login</a>
          </div>
        );
      },
      ...
      render: function () {
        return (
          <div className="newsHeader">
            ...
            {this.getLogin()}
          </div>
        );
      }
    ```

 1. Update the CSS.
    ```
    .newsHeader-login {
      margin-right: 5px;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsHeaderLogin.png" width="530">

    You have now implemented the HN header in React.

    <img src="img/NewsHeader@2x.png" width="532">

[Up](#newsheader) - [Next](#newslist)

NewsList Header and Items
---
 1. Create a new JS file: /js/NewsList.js.
    ```
    var _ = require('lodash');
    var $ = require('jquery');
    var NewsHeader = require('./NewsHeader');
    var NewsItem = require('./NewsItem');
    var React = require('react/addons');

    var NewsList = React.createClass({
      render: function () {
        return (
          <div className="newsList">
            <NewsHeader/>
            <div className="newsList-newsItems">
              {_.map(this.props.items, function (item, index) {
                return <NewsItem key={item.id} item={item} rank={index + 1}/>;
              }.bind(this))}
            </div>
          </div>
        );
      }
    });

    module.exports = NewsList;
    ```

 1. Create a new JS file: /js/NewsListTest.js.
    ```
    var $ = require('jquery');
    var NewsList = require('./NewsList');
    var React = require('react');

    $.ajax({
      url: '/json/items.json'
    }).then(function (items) {
      React.render(<NewsList items={items}/>, $('#content')[0]);
    });
    ```

 1. Create a new CSS file: /js/NewsList.css.
    ```
    .newsList {
      background: #f6f6ef;
      margin-left: auto;
      margin-right: auto;
      width: 85%;
    }
    ```

 1. Create a new HTML file: /html/NewsList.html.
    ```
    <!DOCTYPE html>
    <html>
      <head>
        <title>NewsList</title>
        <link href="/css/NewsHeader.css" rel="stylesheet">
        <link href="/css/NewsItem.css" rel="stylesheet">
        <link href="/css/NewsList.css" rel="stylesheet">
        <link href="/css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="/build/js/NewsListTest.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
     ```
    watchify -v -o build/js/NewsListTest.js js/NewsListTest.js
    ```

 1. Start the HTTP server if necessary.
    ```
    python -m SimpleHTTPServer 8888
    ```

 1. Visit [http://localhost:8888/html/NewsList.html](http://localhost:8888/html/NewsList.html). You should see the following.

    <img src="img/NewsListHeaderItems.png" width="270">

[Up](#newslist) - [Next](#newslist-more)

NewsList More
---
 1. Update the JS.
    ```
    var NewsHeader = React.createClass({
      ...
      getMore: function () {
        return (
          <div className="newsList-more">
            <a className="newsList-moreLink" href="https://news.ycombinator.com/news?p=2">More</a>
          </div>
        );
      },
      ...
      render: function () {
        return (
          <div className="newsList">
            ...
            {this.getMore()}
          </div>
        );
      }
    ```

 1. Update the CSS.
    ```
    .newsList-more {
      margin-left: 40px; /* matches NewsItem rank and vote */
      margin-top: 10px;
      padding-bottom: 10px;
    }

    .newsList-moreLink {
      color: black;
      font-size: 10pt;
      text-decoration: none;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsListMore.png" width="136">

    You have now implemented the HN item list in React.

    <img src="img/NewsList@2x.png" width="532">

[Up](#newslist) - [Next](#hacker-news-api-toc)

Hacker News API
---
 1. Update /js/NewsList.js.
    ```
    var NewsList = React.createClass({
      ...
      componentDidMount: function () {
        if (this.props.items) {
          return;
        }

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
          this.setState({items: items});
        }.bind(this));
      },
      ...
      getInitialState: function () {
        return {
          items: []
        };
      },
      ...
      render: function () {
        ...
        {_.map(this.props.items || this.state.items, function () {
          ...
        }.bind(this)}
        ...
      }
    });
    ```

 1. Create a new JS file: /js/app.js.
    ```
    var $ = require('jquery');
    var NewsList = require('./NewsList');
    var React = require('react');

    React.render(<NewsList/>, $('#content')[0]);
    ```

 1. Create a new HTML file: /html/app.html.
    ```
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hacker News</title>
        <link href="/css/NewsHeader.css" rel="stylesheet">
        <link href="/css/NewsItem.css" rel="stylesheet">
        <link href="/css/NewsList.css" rel="stylesheet">
        <link href="/css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="/build/js/app.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
     ```
    watchify -v -o build/js/app.js js/app.js
    ```

 1. Start the HTTP server if necessary.
    ```
    python -m SimpleHTTPServer 8888
    ```

 1. Visit [http://localhost:8888/html/app.html](http://localhost:8888/html/app.html).

    You have now implemented the [HN front page](https://news.ycombinator.com) in React.

[Up](#hacker-news-api-toc)
