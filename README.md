React HN
===
This tutorial will show you how to build the Hacker News front page in React. There are four parts to this tutorial:

 1. [Build the NewsItem](#newsitem)

    <img src="img/NewsItem@2x.png" width="532">
 2. [Build the NewsHeader](#newsheader)

    <img src="img/NewsHeader@2x.png" width="532">
 3. [Build the NewsList](#newslist)

    <img src="img/NewsList@2x.png" width="532">
 4. [Hook up with the Hacker News API](#hackernewsapi)

    During development, we use static data from the /json directory.

NewsItem
---
<img src="img/NewsList@2x.png" width="532" height="1000">

NewsHeader
---
<img src="img/NewsList@2x.png" width="532" height="1000">

NewsList
---
<img src="img/NewsList@2x.png" width="532" height="1000">

Hacker News API
---
<img src="img/NewsList@2x.png" width="532" height="1000">

python -m SimpleHTTPServer 8888
watchify -v -o build/js/app.js js/app.js
scss --watch scss:build/css

NOT using ReactFire in order to illustrate JSON access.


Step 1: Show html
Step 2: Hook up react: Show js component (NewsList)
Step 3: Hook up css: Style the test div
Step 4: Get the data from local and print the one title.
Step 5: Print all titles. Factor out NewsItem.
- Fix the key missing warning.
Step 6: Hook up the urls.
- Hold open the data structure in the console.
Step 7: Let's develop NewsItem independently of NewsList.

title=>subtext=>

Style
---
JS
- One file per component
- Alphabetize methods and requires
- Use `get*` for render helpers. A component should have one main method (`render()`) that breaks out into smaller render helpers.
- Use `handle*` for event handlers.
- Follow the React team's JS style.

CSS
- One file per component
- Alphabetize rules and declarations
- Follow [Jacob Thornton's CSS style](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06) (components and variables only)
