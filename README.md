React HN
===
This is a visual React tutorial. This tutorial should give you a feel for "growing" a React UI from small, modular parts. By the end of this tutorial, you will have built the [HN front page in React](https://mking.github.io/react-hn).

> Note: This tutorial covers React, Browserify, and CSS. It does not cover event handling (not needed for the HN front page), state (not needed for the HN front page), or Flux.

This tutorial has five parts:

 1. [Setup](#setup)

 1. [NewsItem component](#newsitem)

    <img src="img/NewsItem@2x.png" width="532">

 1. [NewsHeader component](#newsheader)

    <img src="img/NewsHeader@2x.png" width="532">

 1. [NewsList component](#newslist)

    <img src="img/NewsList@2x.png" width="532">

 1. [Display live data from the Hacker News API](#hacker-news-api)

---

Setup
---
 1. Create the project directory structure.
    ```bash
    mkdir -p hn/{build/js,css,html,img,js,json}
    cd hn
    ```

    > Note: We will be building the project from scratch. The solution in this repo is meant primarily to be a reference.

 1. [Download the sample data](https://raw.githubusercontent.com/mking/react-hn/master/json/items.json) into /json.

 1. Download [y18.gif](https://news.ycombinator.com/y18.gif) and [grayarrow2x.gif](https://news.ycombinator.com/grayarrow2x.gif) into /img.

 1. Create /package.json.
    ```json
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
    ```bash
    # These dependencies are required for running the app.
    npm install --save react jquery lodash moment

    # These dependencies are required for building the app.
    npm install --save-dev browserify watchify reactify

    # These dependencies are globally installed command line tools.
    npm install -g browserify watchify http-server
    ```

[Next](#newsitem)

---

NewsItem
---
 1. [Display the title.](#newsitem-title)

    <img src="img/NewsItemTitle.png" width="110">

 1. [Add the domain.](#newsitem-domain)

    <img src="img/NewsItemDomain.png" width="213">

 1. [Add the subtext.](#newsitem-subtext)

    <img src="img/NewsItemSubtext.png" width="268">

 1. [Add the rank and vote.](#newsitem-rank-and-vote)

    <img src="img/NewsItemRankVote.png" width="297">

[Previous](#setup) &middot; [Next](#newsitem-title)

---

NewsItem Title
---
 1. Create a new JS file: /js/NewsItem.js.
    ```javascript
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

    > Note: You should be able to paste this code directly into your JS file.

 1. Create a new JS file: /js/NewsItemTest.js.
    ```javascript
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

    > Note: This lets us develop the NewsItem component in isolation, rather than requiring it to be hooked into the full app.

 1. Create a new CSS file: /css/NewsItem.css. We are following [Jacob Thornton's CSS style guide](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06).
    ```css
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
    ```css
    body {
      font-family: Verdana, sans-serif;
    }
    ```

 1. Create a new HTML file: /html/NewsItem.html.
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NewsItem</title>
        <link href="../css/NewsItem.css" rel="stylesheet">
        <link href="../css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="../build/js/NewsItemTest.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify. This compiles your React (JSX) components into ordinary JavaScript.
    ```bash
    watchify -v -o build/js/NewsItemTest.js js/NewsItemTest.js
    ```

 1. Start the HTTP server.
    ```bash
    http-server -p 8888
    ```

 1. Visit [http://localhost:8888/html/NewsItem.html](http://localhost:8888/html/NewsItem.html). You should see the following.

    <img src="img/NewsItemTitle.png" width="110">

    <img src="img/DeveloperConsole.png" width="274">

[Previous](#newsitem) &middot; [Next](#newsitem-domain)

NewsItem Domain
---
 1. Update the JS.
    ```javascript
    // ...
    var url = require('url');

    var NewsItem = React.createClass({
      // ...

      getDomain: function () {
        return url.parse(this.props.item.url).hostname;
      },

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

    > Note: This code should be added onto the existing code in /js/NewsItem.js.

 1. Update the CSS.
    ```css
    .newsItem-domain {
      font-size: 8pt;
      margin-left: 5px;
    }
    ```

    > Note: This code should be added onto the existing code in /css/NewsItem.css.

 1. Refresh the browser. You should see the following.

    <img src="img/NewsItemDomain.png" width="213">

[Previous](#newsitem-title) &middot; [Next](#newsitem-subtext)

---

NewsItem Subtext
---
 1. Update the JS. Note: We are factoring out the title part into its own method.
    ```javascript
    // ...
    var moment = require('moment');

    var NewsItem = React.createClass({
      // ...

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

      getSubtext: function () {
        return (
          <div className="newsItem-subtext">
            {this.props.item.score} points by <a href={'https://news.ycombinator.com/user?id=' + this.props.item.by}>{this.props.item.by}</a> {moment.utc(this.props.item.time * 1000).fromNow()} | {this.getCommentLink()}
          </div>
        );
      },

      getTitle: function () {
        return (
          <div className="newsItem-title">
            ...
          </div>
        );
      },

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
    ```css
    .newsItem-subtext {
      font-size: 7pt;
    }

    .newsItem-subtext > a {
      color: #828282;
      text-decoration: none;
    }

    .newsItem-subtext > a:hover {
      text-decoration: underline;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsItemSubtext.png" width="268">

[Previous](#newsitem-domain) &middot; [Next](#newsitem-rank-and-vote)

---

NewsItem Rank and Vote
---
 1. Update the JS.
     ```javascript
    var NewsItem = React.createClass({
      // ...

      getRank: function () {
        return (
          <div className="newsItem-rank">
            {this.props.rank}.
          </div>
        );
      },

      getVote: function () {
        return (
          <div className="newsItem-vote">
            <a href={'https://news.ycombinator.com/vote?for=' + this.props.item.id + '&dir=up&whence=news'}>
              <img src="../img/grayarrow2x.gif" width="10"/>
            </a>
          </div>
        );
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
    ```

 1. Update the CSS.
    ```css
    .newsItem {
      /* ... */
      align-items: baseline;
      display: flex;  
    }

    .newsItem-itemText {
      flex-grow: 1;
    }

    .newsItem-rank {
      flex-basis: 25px;
      font-size: 10pt;
      text-align: right;
    }

    .newsItem-vote {
      flex-basis: 15px;
      text-align: center;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsItemRankVote.png" width="297">

    You have now implemented an HN news item in React.

    <img src="img/NewsItem@2x.png" width="532">

[Previous](#newsitem-subtext) &middot; [Next](#newsheader)

---

NewsHeader
---
1. [Display the logo and title.](#newsheader-logo-and-title)

   <img src="img/NewsHeaderLogoTitle.png" width="140">

1. [Add the nav links.](#newsheader-nav)

   <img src="img/NewsHeaderNav.png" width="453">

1. [Add the login link.](#newsheader-login)

   <img src="img/NewsHeaderLogin.png" width="530">

[Previous](#newsitem-rank-and-vote) &middot; [Next](#newsheader-logo-and-title)

---

NewsHeader Logo and Title
---
 1. Create a new JS file: /js/NewsHeader.js.
    ```javascript
    var $ = require('jquery');
    var React = require('react');

    var NewsHeader = React.createClass({
      getLogo: function () {
        return (
          <div className="newsHeader-logo">
            <a href="https://www.ycombinator.com"><img src="../img/y18.gif"/></a>
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
    ```javascript
    var $ = require('jquery');
    var NewsHeader = require('./NewsHeader');
    var React = require('react');

    React.render(<NewsHeader/>, $('#content')[0]);
    ```

 1. Create a new CSS file: /css/NewsHeader.css.
    ```css
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
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NewsHeader</title>
        <link href="../css/NewsHeader.css" rel="stylesheet">
        <link href="../css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="../build/js/NewsHeaderTest.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
    ```bash
    watchify -v -o build/js/NewsHeaderTest.js js/NewsHeaderTest.js
    ```

 1. Start the HTTP server if necessary.
    ```bash
    http-server -p 8888
    ```

 1. Visit [http://localhost:8888/html/NewsHeader.html](http://localhost:8888/html/NewsHeader.html). You should see the following.

    <img src="img/NewsHeaderLogoTitle.png" width="140">

[Previous](#newsheader) &middot; [Next](#newsheader-nav)

---

NewsHeader Nav
---
 1. Update the JS.
    ```javascript
    // ...
    var _ = require('lodash');

    var NewsHeader = React.createClass({
      // ...

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
                <a key={navLink.url} className="newsHeader-navLink newsHeader-textLink" href={'https://news.ycombinator.com/' + navLink.url}>
                  {navLink.name}
                </a>
              );
            })}
          </div>
        );
      },

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
    ```css
    .newsHeader-nav {
      flex-grow: 1;
      margin-left: 10px;
    }

    .newsHeader-navLink:not(:first-child)::before {
      content: ' | ';
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsHeaderNav.png" width="453">

[Previous](#newsheader-logo-and-title) &middot; [Next](#newsheader-login)

---

NewsHeader Login
---
 1. Update the JS.
    ```javascript
    var NewsHeader = React.createClass({
      // ...

      getLogin: function () {
        return (
          <div className="newsHeader-login">
            <a className="newsHeader-textLink" href="https://news.ycombinator.com/login?whence=news">login</a>
          </div>
        );
      },

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
    ```css
    .newsHeader-login {
      margin-right: 5px;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/NewsHeaderLogin.png" width="530">

    You have now implemented the HN header in React.

    <img src="img/NewsHeader@2x.png" width="532">

[Previous](#newsheader-nav) &middot; [Next](#newslist)

---

NewsList
---
1. [Display the header and items.](#newslist-header-and-items)

   <img src="img/NewsListHeaderItems.png" width="270">

1. [Add the more link.](#newslist-more)

   <img src="img/NewsListMore.png" width="136">

[Previous](#newsheader-login) &middot; [Next](#newslist-header-and-items)

---

NewsList Header and Items
---
 1. Create a new JS file: /js/NewsList.js.
    ```javascript
    var _ = require('lodash');
    var NewsHeader = require('./NewsHeader');
    var NewsItem = require('./NewsItem');
    var React = require('react');

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
    ```javascript
    var $ = require('jquery');
    var NewsList = require('./NewsList');
    var React = require('react');

    $.ajax({
      url: '/json/items.json'
    }).then(function (items) {
      React.render(<NewsList items={items}/>, $('#content')[0]);
    });
    ```

 1. Create a new CSS file: /css/NewsList.css.
    ```css
    .newsList {
      background: #f6f6ef;
      margin-left: auto;
      margin-right: auto;
      width: 85%;
    }
    ```

 1. Create a new HTML file: /html/NewsList.html.
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NewsList</title>
        <link href="../css/NewsHeader.css" rel="stylesheet">
        <link href="../css/NewsItem.css" rel="stylesheet">
        <link href="../css/NewsList.css" rel="stylesheet">
        <link href="../css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="../build/js/NewsListTest.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
     ```bash
    watchify -v -o build/js/NewsListTest.js js/NewsListTest.js
    ```

 1. Start the HTTP server if necessary.
    ```bash
    http-server -p 8888
    ```

 1. Visit [http://localhost:8888/html/NewsList.html](http://localhost:8888/html/NewsList.html). You should see the following.

    <img src="img/NewsListHeaderItems.png" width="270">

[Previous](#newslist) &middot; [Next](#newslist-more)

---

NewsList More
---
 1. Update the JS.
    ```javascript
    var NewsList = React.createClass({
      // ...

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
            ...
            {this.getMore()}
          </div>
        );
      }
    ```

 1. Update the CSS.
    ```css
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

[Previous](#newslist-header-and-items) &middot; [Next](#hacker-news-api)

---

Hacker News API
---
 1. Create a new JS file: /js/app.js.
    ```javascript
    var _ = require('lodash');
    var $ = require('jquery');
    var NewsList = require('./NewsList');
    var React = require('react');

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

      // Render the items
      React.render(<NewsList items={items}/>, $('#content')[0]);
    });

    ```

 1. Create a new HTML file: /html/app.html.
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Hacker News</title>
        <link href="../css/NewsHeader.css" rel="stylesheet">
        <link href="../css/NewsItem.css" rel="stylesheet">
        <link href="../css/NewsList.css" rel="stylesheet">
        <link href="../css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="../build/js/app.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
    ```bash
    watchify -v -o build/js/app.js js/app.js
    ```

 1. Start the HTTP server if necessary.
    ```bash
    http-server -p 8888
    ```

 1. Visit [http://localhost:8888/html/app.html](http://localhost:8888/html/app.html).

    You have now implemented the [HN front page](https://news.ycombinator.com) in React.

[Previous](#newslist-more)
