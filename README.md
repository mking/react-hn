React HN
===
This tutorial will show you how to build the [Hacker News front page](https://news.ycombinator.com) in React ([view finished tutorial](https://mking.github.io/react-hn)). To do this, we are going to build small, self-contained components, and then we will compose them (like Lego bricks) to get the final result.

Background required: HTML/CSS/JS

There are five parts to this tutorial:

 1. [Setup](#setup)

 1. NewsItem component

    <img src="img/NewsItem@2x.png" width="532">

     1. [Display the title.](#newsitem-title)

        <img src="img/Title.png" width="107">

     1. [Display the title and domain.](#newsitem-title-and-domain)

        <img src="img/TitleDomain.png" width="213">

     1. [Display the subtext.](#newsitem-subtext)

        <img src="img/Subtext.png" width="268">

     1. [Display the rank and vote.](#newsitem-rank-and-vote)

        <img src="img/RankVote.png" width="297">

 1. NewsHeader component

    <img src="img/NewsHeader@2x.png" width="532">

    1. [Display the logo and title.](#newsheader-logo-and-title)

       <img src="img/LogoTitle.png" width="140">

    1. [Display the nav links.](#newsheader-nav)

       <img src="img/Nav.png" width="453">

    1. [Display the login link.](#newsheader-login)

       <img src="img/Login.png" width="530">

 1. NewsList component

    <img src="img/NewsList@2x.png" width="532">
 1. [Display live data](#hacker-news-api)

    During development, we use static data from the /json directory.

Setup
---
 1. Create the project directory structure.
    ```
    mkdir -p hn/{build/js,css,html,img,js,json}
    cd hn
    ```

 1. [Download the sample data](https://raw.githubusercontent.com/mking/react-hn/master/NewsItem/json/items.json) into /json.

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

 1. Run Watchify. I normally run this in a separate terminal tab.
    ```
    watchify -v -o build/js/NewsItem.js js/NewsItem.js
    ```

NewsItem Title
---
 1. Create a new JS file: /js/NewsItem.js.
    ```
    var $ = require('jquery');
    var React = require('react');

    var NewsItem = React.createClass({
      componentWillMount: function () {
        $.ajax({
          url: '/json/items.json'
        }).then(function (items) {
          // Log the data so we can inspect it in the developer console.
          console.log('items', items);
          this.setState({item: items[0]});
        }.bind(this));
      },

      getInitialState: function () {
        return {};
      },

      render: function () {
        // Render nothing if state is not yet loaded.
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
    ```

 1. Create a new, empty CSS file: /css/NewsItem.css.

 1. Create a new HTML file: /html/NewsItem.html.
    ```
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NewsItem</title>
        <link href="/css/NewsItem.css" rel="stylesheet">
      </head>
      <body>
        <div id="content"></div>
        <script src="/build/js/NewsItem.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
    ```
    watchify -v -o build/js/NewsHeader.js js/NewsHeader.js
    ```

 1. Start the HTTP server.
    ```
    python -m SimpleHTTPServer 8888
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/Title.png" width="107">

    <img src="img/DeveloperConsole.png" width="274">

NewsItem Title and Domain
---
 1. Update the JS.
    ```
    var url = require('url');
    ...
    var NewsItem = React.createClass({
      ...
      getDomain: function () {
        return url.parse(this.state.item.url).hostname;
      },
      ...
      render: function () {
        ...
        return (
          <div className="newsItem">
            <a className="newsItem-titleLink" href={this.state.item.url}>{this.state.item.title}</a>
            <div className="newsItem-domain">
              ({this.getDomain()})
            </div>
          </div>
        );
      }
      ...
    ```

 1. Update the CSS. We are following [Jacob Thornton's CSS style guide](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06).
    ```
    body {
      font-family: Verdana, sans-serif;
    }

    .newsItem {
      color: #828282;
    }

    .newsItem-domain {
      font-size: 8pt;
      margin-left: 5px;
    }

    .newsItem-titleLink {
      color: black;
      font-size: 10pt;
      text-decoration: none;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/TitleDomain.png" width="213">

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
        if (this.state.item.kids.length) {
          commentText = this.state.item.kids.length + ' comments';
        }

        return (
          <a href={'https://news.ycombinator.com/item?id=' + this.state.item.id}>{commentText}</a>
        );
      },
      ...
      getSubtext: function () {
        return (
          <div className="newsItem-subtext">
            {this.state.item.score} points by <a href={'https://news.ycombinator.com/user?id=' + this.state.item.by}>{this.state.item.by}</a> {moment.utc(this.state.item.time * 1000).fromNow()} | {this.getCommentLink()}
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
        ...
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

    .newsItem-subtext > a {
      color: #828282;
      text-decoration: none;
    }

    .newsItem-subtext > a:hover {
      text-decoration: underline;
    }
    ```

 1. Refresh the browser. You should see the following.

    <img src="img/Subtext.png" width="268">

NewsItem Rank and Vote
---
 1. Update the JS. We use a fake rank for now.
     ```
    var NewsItem = React.createClass({
      ...
      getRank: function () {
        return (
          <div className="newsItem-rank">
            1.
          </div>
        );
      },
      ...
      getVote: function () {
        return (
          <div className="newsItem-vote">
            <a href={'https://news.ycombinator.com/vote?for=' + this.state.item.id + '&dir=up&whence=news'}>
              <img src="/img/grayarrow2x.gif" width="10"/>
            </a>
          </div>
        );
      },
      ...
      render: function () {
        ...
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

    <img src="img/RankVote.png" width="297">

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

    React.render(<NewsHeader/>, $('#content')[0]);
    ```

 1. Create a new CSS file: /css/NewsHeader.css.
    ```
    body {
      font-family: Verdana, sans-serif;
    }

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
      </head>
      <body>
        <div id="content"></div>
        <script src="/build/js/NewsHeader.js"></script>
      </body>
    </html>
    ```

 1. Start Watchify.
    ```
    watchify -v -o build/js/NewsHeader.js js/NewsHeader.js
    ```

 1. Start the HTTP server if necessary.
    ```
    python -m SimpleHTTPServer 8888
    ```

 1. Visit [http://localhost:8888/html/NewsHeader.html](http://localhost:8888/html/NewsHeader.html). You should see the following.

    <img src="img/LogoTitle.png" width="140">

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

    <img src="img/Nav.png" width="453">

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

    <img src="img/Login.png" width="530">

NewsList
---

Hacker News API
---
