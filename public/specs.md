Specifications guide:
- Have a bunch of scroll bars stacked on top of each other, with each scroll bar being for a different genre/topic of news
  - Choose 5-10 different categories of news to have displayed on the page (ex: US politics, foreign politics, business/finance, entertainment, sports, general, health, science, technology, education, cooking/food)
    - ~20-50 news articles for each category 
  - If the screen is wide enough to show 5 articles, then the scroll bars should scroll horizontal
    - Ex:
      ===============================
      =     =     =     =     =     =
      =     =     =     =     =     =
      ===============================
  - If the screen isn't wide enough to show 5 articles, then the scroll bars should scroll vertically.
    - Example:
      =======
      =     =
      =     =
      =======
      =     =
      =     =
      =======
      =     =
      =     =
      =======
      =     =
      =     =
      =======
      =     =
      =     =
      =======

  - Each article should have a title, description, and image. The title and description should be beneath the image as seen above
  - News articles must come from one of 3 sources:
    - API: https://newsdata.io/documentation/#latest-news 
    - Another API: https://www.thenewsapi.com/documentation
    - Another API: api.spaceflightnewsapi.net 
      - If doing an API call, save the output to a JSON file to be able to always output some data even if you run out of API calls
      - Alternatively cache api calls or save in local storage or session storage 
    - Manually scraped JSON file: https://www.nytimes.com/rss 
  - Must have a navigation bar at the top of the page to jump to different news genres/topics scroll bars
  - Should have a header at the top of the web page
  - optional features
    - Articles can be able to be bookmarked by being starred. Each article must have a star that when clicked, it will signify that the article has been bookmarked by the user. This will be kept track of through localStorage.
    - Articles should also be able to be un-bookmarked by clicking the star again
  - A bookmarks bar underneath the navigation bar. That will display the articles that users bookmarked.
  - Site structure:
    /Lab1
      index.html
      /resources
          script.js
          style.css
          news.json → if storing API response in a file / manually scraping news articles