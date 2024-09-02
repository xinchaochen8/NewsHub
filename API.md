# API Endpoints README

This README provides an overview of the API endpoints available in this application.

## Base URL

The base URL for accessing the endpoints is `http://localhost:3000/`.

## News Endpoints

1. **GET /news**
   - *Description*: Retrieve a listing of available news categories.
   - *Response*: Returns a list of news categories that can be used to fetch news articles.

2. **GET /news/:category**
   - *Description*: Retrieve all articles that belong to a specific category.
   - *Parameters*:
     - `:category` - The category of news articles to retrieve.
   - *Response*: Returns a listing of article numbers available for the specified category.

3. **GET /news/:category/:number**
   - *Description*: Retrieve specific articles from a category.
   - *Parameters*:
     - `:category` - The category of news articles.
     - `:number` - The starting index of the articles to retrieve.
   - *Response*: Returns the requested news articles.

4. **POST /news/:category**
   - *Description*: Append a new news article to the specified category.
   - *Parameters*:
     - `:category` - The category to which the new article will be appended.
   - *Response*: Returns the newly added news article.

5. **PUT /news**
   - *Description*: Bulk update all articles.
   - *Response*: Indicates the success of the bulk update operation.

6. **PUT /news/:category/:number**
   - *Description*: Update a specific article.
   - *Parameters*:
     - `:category` - The category of the article.
     - `:number` - The index of the article to update.
   - *Response*: Indicates the success of the article update operation.

7. **DELETE /news/:category/:number**
   - *Description*: Delete a specific article.
   - *Parameters*:
     - `:category` - The category of the article.
     - `:number` - The index of the article to delete.
   - *Response*: Indicates the success of the article deletion operation.

## Build Endpoints

8. **GET /build**
   - *Description*: Retrieve supported API endpoints.
   - *Response*: Returns a list of supported API endpoints.

9. **GET /build/all**
   - *Description*: Retrieve data from multiple sources.
   - *Response*: Returns data from weather, NASA, stock, quote, and news APIs.

10. **GET /build/:category**
    - *Description*: Retrieve data from a specific category.
    - *Parameters*:
      - `:category` - The category of data to retrieve (e.g., weather, NASA, stock, quote, news).
    - *Response*: Returns data from the specified category.

11. **POST /build/nasa**
    - *Description*: Append a new NASA image link to the existing list.
    - *Response*: Indicates the success of appending the new NASA image link.

12. **DELETE /build/nasa**
    - *Description*: Clear the list of NASA image links.
    - *Response*: Indicates the success of clearing the NASA image links.

## Database Endpoints

13. **GET /db**
    - *Description*: Retrieves document pagination for valid documents.

14. **GET /db/:number**
    - *Description*: Retrieves a specific document based on the given ID.

15. **POST /db**
    - *Description*: Creates a new document in the database.

16. **POST /db/:number**
    - *Description*: Creates a new document with a specific ID in the database.

17. **PUT /db**
    - *Description*: Updates all documents in the database.

18. **PUT /db/:number**
    - *Description*: Updates a specific document based on the given ID.

19. **DELETE /db/:number**
    - *Description*: Deletes a specific document based on the given ID.

## Stock Endpoints

20. **GET /part3/GLD**
    - *Description*: Fetches data for Gold (GLD) and stores it in the database.

21. **GET /part3/AAPL**
    - *Description*: Fetches data for Apple (AAPL) and stores it in the database.

22. **GET /part3/AMZN**
    - *Description*: Fetches data for Amazon (AMZN) and stores it in the database.

23. **GET /part3/:category**
    - *Description*: Handles requests for unknown categories and responds with an error message.

24. **GET /stock**
    - *Description*: Responds with supported stock symbols and their meanings.

25. **GET /stock/:category**
    - *Description*: Retrieves document IDs for a given stock symbol.

26. **GET /stock/:category/:id**
    - *Description*: Retrieves stock data for a given document ID and stock symbol.

27. **PUT /stock**
    - *Description*: Updates multiple documents with new field values.

28. **PUT /stock/:id**
    - *Description*: Updates a single document with a specific ID with new field values.

29. **DELETE /stock/**
    - *Description*: Responds with an error message since deleting all stocks is not supported.

30. **DELETE /stock/:id**
    - *Description*: Deletes a single document with a specific ID.

31. **POST /stock**
    - *Description*: Creates a new stock document in the database.