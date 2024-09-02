const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs/promises');
const fs2 = require('fs');

const mongoose = require('mongoose');
const { time, timeStamp } = require('console');

const app = express();
const port = 3000;

// app.use(express.static(__dirname + '/public'));

const app_public = path.join(__dirname, 'public', 'my-react-app', 'build');

app.use(express.static(app_public));

// view engine set up
app.set("views", path.join(__dirname));
app.set("view engine", "ejs");


const newsCategories = ['business', 'education', 'entertainment', 'general', 'health', 'politics', 'science', 'sports', 'technology', 'world'];
const quoteQuery = ['freedom', 'happiness', 'love', 'learning', 'knowledge', 'success'];


// API to get image from NASA
async function nasaAPI() {
  let APIkey = "zeGd7ia6pNhFJ2PPK0bxb3G1Xd5dcDPJeONESbn2";
  let apiUrl = "https://api.nasa.gov/planetary/apod?api_key=" + APIkey + "&hd=True";

  let JSON;

  try {
    const response = await axios.get(apiUrl);
    JSON = {
      status: 'ok',
      message: 'Ciallo～(∠・ω< ) : return NASA daily image',
      date: response.data.date,
      explanation: response.data.explanation,
      hdurl: response.data.hdurl,
      media_type: response.data.media_type,
      title: response.data.title,
      url: response.data.url
    };

  } catch (error) {
    JSON = {
      'status': 'error',
      'message': `Kira (<ゝω・)☆～绮罗星 : ${error}`
    };
  }

  return JSON;
}

async function weatherAPI(longitude, latitude) {


  // using Weather API
  // how to make API call
  // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&exclude={part}&appid={API key}
  // my API key: e65507530d58ac21373d098f16563185
  let apiKey = "e65507530d58ac21373d098f16563185";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude +
    "&lon=" + longitude + "&appid=" + apiKey + "&units=Imperial";
  // using jquery to get data
  let JSON = null;
  try {
    const response = await axios.get(apiUrl);
    JSON = {
      'status': 'ok',
      'message': 'Ciallo～(∠・ω< ) : return weather info',
      'weather': response.data.weather[0].main,
      'city': response.data.name,
      'current_temp': response.data.main.temp.toFixed(0),
      'lowest_temp': response.data.main.temp_min.toFixed(0),
      'highest_temp': response.data.main.temp_max.toFixed(0),
      'humidity': response.data.main.humidity,
      'windspeed': response.data.wind.speed,
      'icon': response.data.weather[0].icon
    };
  } catch (error) {
    JSON = {
      'status': 'error',
      'message': `Kira (<ゝω・)☆～绮罗星 : ${error}`
    };
  }

  return JSON;
}

async function stockAPI() {
  // let apiUrl = 'https://financialmodelingprep.com/api/v3/available-traded/list?apikey=5f3d8a90cbd4c73db225ace3a5d7e9cb';

  // return a list of top stock news
  let apiUrl = "https://finnhub.io/api/v1/news?category=general&token=cn2f5qhr01qt9t7u7n0gcn2f5qhr01qt9t7u7n10";

  let JSON = null;
  try {
    const response = await axios.get(apiUrl);
    let processedJSON = [];

    await Promise.all(response.data.map((article) => {
      processedJSON.push({
        "urlToImage": article.image,
        "url": article.url,
        "title": article.headline,
        "description": article.summary
      });
    }));

    JSON = {
      "status": 'ok',
      "message": 'Ciallo～(∠・ω< ) : return stocks info',
      "stocks": processedJSON
    };

  } catch (error) {
    JSON = {
      "status": "error",
      "message": `Kira (<ゝω・)☆～绮罗星 : ${error}`
    };
  }

  return JSON;
}


async function quoteAPI() {
  const i = Math.floor(Math.random() * 6);
  let quoteType = quoteQuery[i];
  let apiKey = '7618Kg8uflTMe/hBhxqk0A==ayLWpO0GtQjPXTV3';
  let apiUrl = `https://api.api-ninjas.com/v1/quotes?category=${quoteType}`;

  let JSON = null;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Api-Key": apiKey
      }
    });

    JSON = {
      "status": "ok",
      'message': 'Ciallo～(∠・ω< ) : return a quote',
      "quote": response.data[0].quote,
      "author": response.data[0].author,
      "category": response.data[0].category
    }

  } catch (error) {
    JSON = {
      "status": "error",
      "message": `Kira (<ゝω・)☆～绮罗星 : ${error}`
    };
  }

  return JSON;
}

async function newsGETJSON(req, res) {
  try {
    const retJSON = {};

    await Promise.all(newsCategories.map(async (category) => {
      const jsonFilePath = path.join(__dirname, 'public/src/json', `${category}.json`);
      const fileContent = await fs.readFile(jsonFilePath, 'utf-8');

      const newsJson = JSON.parse(fileContent);

      // getting the first 30 articles
      const targetJson = newsJson.articles.slice(0, 30);

      // Use category as a key in retJSON
      retJSON[category] = targetJson;
    }));

    return ({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : Obtained all news articles ",
      totalResults: Object.keys(retJSON).length,
      articles: retJSON
    });

  } catch (error) {
    return ({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : Something happened when fetching all news articles - ${error}`
    });
  }
}


//  GET / = retrieve your HTML page from Lab 1
app.get('/', (req, res) => {
  // Send the HTML file as a response
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.sendFile(path.join(app_public, 'index.html'));

});

// GET /news = retrieve a listing of article numbers 
// (hint: you can use headers for this if you don’t want to send the list in the body of your response; 
// hint2: consider pagination, since you have a lot of articles!)
app.get('/news', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Returned Supported Categories. Can use them as /news/category. For example, /news/business for all the endpoints for business news.",
    totalResults: newsCategories.length,
    articles: newsCategories
  });
});


// GET /news/cateogry = retrieve the all articles that belongs to the same category from the JSON object
app.get('/news/:category', async (req, res) => {
  const requestCategory = req.params.category.toLowerCase();
  if (newsCategories.includes(requestCategory)) {
    const jsonFilePath = path.join(__dirname, 'public/src/json', `${requestCategory}.json`);

    try {
      // Use await to get the actual content
      const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
      const requestContent = JSON.parse(fileContent);
      const maxContent = requestContent.articles.length;

      const endpoint = [];
      // index by 30 each time, so each request will also return 30 articles
      for (var i = 0; i < maxContent; i += 30) {
        const end = Math.min(i + 30, maxContent);
        endpoint.push(`${i} to ${end}`);
      }

      res.status(200).json({
        status: "ok",
        message: "Ciallo～(∠・ω< ) : return listing of article numbers ",
        totalResults: endpoint.length,
        articles: endpoint
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Something happened to the server side: ${error.message} (<ゝω・)☆`,
        totalResults: null,
        articles: null
      });
    }
  } else {
    res.status(404).json({
      status: "error",
      message: "Unrecognized Category (<ゝω・)☆",
      totalResults: null,
      articles: null
    });
  }
});


// GET /news/category/### = retrieve the all articles that belongs to the same category from the JSON object
// this will return 30 articles from that endpoint
app.get('/news/:category/:number', async (req, res) => {
  const requestCategory = req.params.category.toLowerCase();
  const articleNumber = parseInt(req.params.number);

  if (newsCategories.includes(requestCategory)) {
    const jsonFilePath = path.join(__dirname, 'public/src/json', `${requestCategory}.json`);

    try {
      const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
      const requestContent = JSON.parse(fileContent);

      // checking if specific news that are requested from the category
      // is within range 
      if (articleNumber < requestContent.articles.length) {
        const allNews = requestContent.articles;
        const articleList = [];

        for (var index = articleNumber; index < allNews.length && index < articleNumber + 30; index++) {
          articleList.push(allNews[index]);
        }

        res.status(200).json({
          status: "ok",
          message: "Ciallo～(∠・ω< ) : Returned requested news article ",
          totalResults: articleList.length,
          articles: articleList
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: `Unavilable News Article Number (<ゝω・)☆: ${articleNumber} ${requestContent.articles.length}`,
          totalResults: null,
          articles: null
        });
      }
    } catch (error) {

      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Serverside error. Can try again (<ゝω・)☆',
        totalResults: null,
        articles: null
      });

    }
  } else {
    res.status(404).json({
      status: "error",
      message: "Unrecognized Category (<ゝω・)☆",
      totalResults: 0,
      articles: null
    });
  }
});

// POST /news/category = append a news article to the end of the JSON object for specific category
// this will return the news article that is newly added
app.post('/news/:category', async (req, res) => {
  const category = req.params.category.toLowerCase();

  const jsonFilePath = path.join(__dirname, 'public/src/json', `${category}.json`);

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (!newsCategories.includes(category)) {
      throw new Error(`Invalid category '${category}'. It must be one of ${newsCategories.join(', ')}.`);
    }

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    const dummyJson = {
      "source": {
        "id": null,
        "name": "POST"
      },
      "author": "Yuzusoft",
      "title": "Exciting Adventure in the World of Visual Novels",
      "description": "Immerse yourself in a captivating visual novel experience created by Yuzusoft.",
      "url": "https://www.yuzusoft.co.jp/",
      "urlToImage": "https://example.com/yuzusoft-cover-image.jpg",
      "publishedAt": `${formattedDate}`,
      "content": "Embark on a thrilling journey with Yuzusoft's latest visual novel. Uncover mysteries, forge relationships, and make crucial choices that shape the outcome of the story. Immerse yourself in beautifully crafted art, captivating music, and an engaging narrative that will keep you hooked from start to finish. Whether you're a seasoned visual novel enthusiast or a newcomer to the genre, Yuzusoft's creations promise an unforgettable experience. Stay tuned for updates as we unveil more details about this exciting release!"
    };

    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    const newsJson = JSON.parse(fileContent);

    newsJson.articles.push(dummyJson);
    newsJson.totalResults += 1;

    // using 2 in parameter so updated json is formatted
    const updatedNewsJson = JSON.stringify(newsJson, null, 2);

    await fs.writeFile(jsonFilePath, updatedNewsJson, 'utf-8');

    res.status(201).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : A new news article append to back of ${category}.json for ${category} news, under public/src/json`,
      totalResults: 1,
      articles: [dummyJson]
    });

  } catch (error) {
    res.status(500).json({
      status: `error`,
      message: `Server side error (<ゝω・)☆ : ${error}`,
      totalResults: null,
      articles: null
    });

  }
});


// PUT /news = bulk update all your articles
// can update the images that is showing for all my articles to img_kyto.jpg
app.put('/news', async (req, res) => {
  try {
    await Promise.all(newsCategories.map(async (category) => {
      const jsonFilePath = path.join(__dirname, 'public/src/json', `${category}.json`);
      const fileContent = await fs.readFile(jsonFilePath, 'utf-8');

      var newsJson = JSON.parse(fileContent);

      newsJson.articles.forEach(news => {
        news.urlToImage = "./src/img_kyoto.jpg";
      })

      await fs.writeFile(jsonFilePath, JSON.stringify(newsJson, null, 2), 'utf-8');

    }));

    res.status(200).json({
      status: 'ok',
      message: 'Ciallo～(∠・ω< ) : bulk updated all news',
      totalResults: null,
      articles: null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server side error when updating images (<ゝω・)☆",
      totalResults: null,
      articles: null
    });
  }
});

// PUT /news/:category/:number = update the specific article
// update image for a specific article to img_kyto.jpg
app.put('/news/:category/:number', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const number = parseInt(req.params.number);

    const jsonFilePath = path.join(__dirname, 'public/src/json', `${category}.json`);
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');

    let newsJson = JSON.parse(fileContent);

    newsJson.articles[number].urlToImage = "./src/target.png";

    await fs.writeFile(jsonFilePath, JSON.stringify(newsJson, null, 2), 'utf8');

    res.status(200).json({
      status: 'ok',
      message: `Ciallo～(∠・ω< ) : updated news #${number}`,
      totalResults: null,
      articles: null
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server side error when updating images (<ゝω・)☆",
      totalResults: null,
      articles: null
    });
  }
});


// DELETE /news/:category/:number = delete the specific article
// smart to set all the values for that specific articles to null
app.delete('/news/:category/:number', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const number = parseInt(req.params.number);

    const jsonFilePath = path.join(__dirname, 'public/src/json', `${category}.json`);
    fileContent = await fs.readFile(jsonFilePath, 'utf-8');

    let newsJson = JSON.parse(fileContent);

    const compartment = ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content'];

    compartment.map(async (part) => {
      newsJson.articles[number][part] = null;
    });

    await fs.writeFile(jsonFilePath, JSON.stringify(newsJson, null, 2), 'utf8');

    res.status(200).json({
      status: 'ok',
      message: `Ciallo～(∠・ω< ) : delete news #${number}`,
      totalResults: null,
      articles: null
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server side error when deleting news (<ゝω・)☆',
      totalResults: null,
      articles: null
    });
  }

});

// api endpoint for lab 3

// return all the endpoints 
app.get('/build', async (req, res) => {
  const endpoints = ["get:all", "get:weather-and-nasa",
    "get:weather-and-stock", "get:weather-and-quote", "get:nasa-and-stock",
    "get:nasa-and-quote", "put:updateAll", "put:[weather/nasa/stock/quote/news/updateAll]", 'post:nasa',
    'delete:nasa'];

  res.status(200).json({
    status: "ok",
    message: "Ciallo～(∠・ω< ) : Returned Supported Endpoints.",
    totalResults: endpoints.length,
    articles: endpoints
  });
});

app.get('/build/all', async (req, res) => {
  let weatherJSON = null, nasaJSON = null, stockJSON = null, quoteJSON = null, newsJSON = null;

  // using query for user to input their longitude and latitude
  const longitude = req.query.longitude || -73.6814687;
  const latitude = req.query.latitude || 42.7297628;

  try {
    // Uncomment the line below if you have a 'weatherAPI' function
    weatherJSON = await weatherAPI(longitude, latitude);

    nasaJSON = await nasaAPI();
    stockJSON = await stockAPI();
    quoteJSON = await quoteAPI();
    newsJSON = await newsGETJSON();

    res.status(200).json({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : all request success",
      weather: weatherJSON,
      nasa: nasaJSON,
      stock: stockJSON,
      quote: quoteJSON,
      news: newsJSON
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.get('/build/news-and-stock', async (req, res) => {
  let weatherJSON = null, nasaJSON = null;



  try {
    // Uncomment the line below if you have a 'weatherAPI' function
    stockJSON = await stockAPI();

    newsJSON = await newsGETJSON();

    res.status(200).json({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : weather and nasa request success",
      weather: null,
      nasa: null,
      stock: stockJSON,
      quote: null,
      news: newsJSON
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.get('/build/weather-and-nasa', async (req, res) => {
  let weatherJSON = null, nasaJSON = null;

  const longitude = req.query.longitude || -73.6814687;
  const latitude = req.query.latitude || 42.7297628;

  try {
    // Uncomment the line below if you have a 'weatherAPI' function
    weatherJSON = await weatherAPI(longitude, latitude);

    nasaJSON = await nasaAPI();

    res.status(200).json({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : weather and nasa request success",
      weather: weatherJSON,
      nasa: nasaJSON,
      stock: null,
      quote: null,
      news: null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.get('/build/weather-and-stock', async (req, res) => {
  let weatherJSON = null, stockJSON = null;

  const longitude = req.query.longitude || -73.6814687;
  const latitude = req.query.latitude || 42.7297628;

  try {
    // Uncomment the line below if you have a 'weatherAPI' function
    weatherJSON = await weatherAPI(longitude, latitude);

    stockJSON = await stockAPI();

    res.status(200).json({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : weather and stock request success",
      weather: weatherJSON,
      nasa: null,
      stock: stockJSON,
      quote: null,
      news: null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.get('/build/weather-and-quote', async (req, res) => {
  let weatherJSON = null, quoteJSON = null;

  const longitude = req.query.longitude || -73.6814687;
  const latitude = req.query.latitude || 42.7297628;

  try {
    // Uncomment the line below if you have a 'weatherAPI' function
    weatherJSON = await weatherAPI(longitude, latitude);

    quoteJSON = await quoteAPI();

    res.status(200).json({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : weather and quote request success",
      weather: weatherJSON,
      nasa: null,
      stock: null,
      quote: quoteJSON,
      news: null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.get('/build/nasa-and-stock', async (req, res) => {
  let nasaJSON = null, stockJSON = null;

  try {

    nasaJSON = await nasaAPI();
    stockJSON = await stockAPI();

    res.status(200).json({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : nasa and stock request success",
      weather: null,
      nasa: nasaJSON,
      stock: stockJSON,
      quote: null,
      news: null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});


app.get('/build/nasa-and-quote', async (req, res) => {
  let nasaJSON = null, quoteJSON = null;

  try {

    nasaJSON = await nasaAPI();
    quoteJSON = await quoteAPI();

    res.status(200).json({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : nasa and quote request success",
      weather: null,
      nasa: nasaJSON,
      stock: null,
      quote: quoteJSON,
      news: null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.put('/build/updateAll', async (req, res) => {
  let weatherJSON = null, nasaJSON = null, stockJSON = null, quoteJSON = null, newsJSON = null;

  const longitude = req.query.longitude || -73.6814687;
  const latitude = req.query.latitude || 42.7297628;

  try {
    // Uncomment the line below if you have a 'weatherAPI' function
    weatherJSON = await weatherAPI(longitude, latitude);

    nasaJSON = await nasaAPI();
    stockJSON = await stockAPI();
    quoteJSON = await quoteAPI();
    newsJSON = await newsGETJSON();

    dataJSON = JSON.stringify({
      status: "ok",
      message: "Ciallo～(∠・ω< ) : all request success",
      weather: weatherJSON,
      nasa: nasaJSON,
      stock: stockJSON,
      quote: quoteJSON,
      news: newsJSON
    }, null, 2);

    const jsonFilePath = path.join(__dirname, 'public/src/json', `data.json`);
    await fs.writeFile(jsonFilePath, dataJSON, 'utf-8');

    res.status(201).json({
      status: "success",
      message: "Ciallo～(∠・ω< ) : Bulk Updated Data in data.json located uner public/src/json"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.put('/build/:category', async (req, res) => {
  const target = req.params.category.toLowerCase();

  try {
    let newTargetJSON = null;
    switch (target) {
      case "weather":
        const longitude = req.query.longitude || -73.6814687;
        const latitude = req.query.latitude || 42.7297628;
        newTargetJSON = await weatherAPI(longitude, latitude);
        break;
      case "nasa":
        newTargetJSON = await nasaAPI();

        break;
      case "stock":
        newTargetJSON = await stockAPI();
        break;
      case "quote":
        newTargetJSON = await quoteAPI();
        break;
      case "news":
        newTargetJSON = await newsGETJSON();
        break;
      default:
        res.status(405).json({
          status: "error",
          message: `Kira (<ゝω・)☆～绮罗星 : invalid category for put action`
        });
        return;
    }

    const jsonFilePath = path.join(__dirname, 'public/src/json', `data.json`);
    const currentData = await fs.readFile(jsonFilePath, 'utf-8');

    let newsJson = JSON.parse(currentData);
    newsJson[target] = newTargetJSON;

    // using 2 in parameter so updated json is formatted
    const updatedNewsJson = JSON.stringify(newsJson, null, 2);

    await fs.writeFile(jsonFilePath, updatedNewsJson, 'utf-8');
    res.status(201).json({
      status: "success",
      message: `Kira (<ゝω・)☆～绮罗星 : updated ${target} with latest data locate under public/src/json`,
      newData: newTargetJSON
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});


app.post('/build/nasa', async (req, res) => {

  try {
    const nasaJSON = await nasaAPI();

    const jsonFilePath = path.join(__dirname, 'public/src/json', `nasaImage.json`);
    const currentData = await fs.readFile(jsonFilePath, 'utf-8');

    let newJson = JSON.parse(currentData);

    newJson.links.push(nasaJSON.hdurl);

    // using 2 in parameter so updated json is formatted
    const updatedNewsJson = JSON.stringify(newJson, null, 2);

    await fs.writeFile(jsonFilePath, updatedNewsJson, 'utf-8');
    res.status(201).json({
      status: "success",
      message: `Kira (<ゝω・)☆～绮罗星 : append image link to nasaImage.json with latest image data\n 
                Located under public/src/json`,
      newImage: nasaJSON.hdurl,
      updatedJSON: newJson
    });


  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});


app.delete('/build/nasa', async (req, res) => {
  try {
    const nasaJSON = await nasaAPI();

    const jsonFilePath = path.join(__dirname, 'public/src/json', `nasaImage.json`);

    const clearJSON = JSON.stringify(
      {
        links: []
      },
      null,
      2);

    await fs.writeFile(jsonFilePath, clearJSON, 'utf-8');
    res.status(201).json({
      status: "success",
      message: `Kira (<ゝω・)☆～绮罗星 : clear nasaImage.json under public/src/json`,
      newImage: null,
      updatedJSON: clearJSON
    });


  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }

});

// lab5
// mongo connection
mongoose.connect(process.env.MONGODB);

const lab5DBSchema = new mongoose.Schema({
  id: Number,
  document: [Object],
  valid: Boolean
});

const lab5DB = mongoose.model('Datas', lab5DBSchema);

// this select all documents that have an valid input for id
async function findPaginations() {
  const documents = await lab5DB.find({ id: { $exists: true }, valid: "true" }, 'id').exec();
  // console.log(documents);
  const pagination = documents.map(doc => doc.id);
  return pagination;
}

// return the largest id used 
async function latestUsedID() {
  const largestID = (await lab5DB
    .find({})
    .sort({ id: -1 })
    .exec())[0].id;

  return largestID;
}

app.put('/db', async (req, res) => {
  try {
    const largestIDIndex = (await latestUsedID()) + 1;

    for (let i = 1; i < largestIDIndex; i++) {
      console.log(i);
      let weatherJSON = null, nasaJSON = null, stockJSON = null, quoteJSON = null, newsJSON = null;

      // using query for user to input their longitude and latitude
      const longitude = req.query.longitude || -73.6814687;
      const latitude = req.query.latitude || 42.7297628;

      try {
        weatherJSON = await weatherAPI(longitude, latitude);
        nasaJSON = await nasaAPI();
        stockJSON = await stockAPI();
        quoteJSON = await quoteAPI();
        newsJSON = await newsGETJSON();

        const result = ({
          id: i,
          document: {
            weather: weatherJSON,
            nasa: nasaJSON,
            stock: stockJSON,
            quote: quoteJSON,
            news: newsJSON
          },
          valid: 'true'
        });

        const filter = { id: i };
        await lab5DB.findOneAndUpdate(filter, result);

      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
        });
      }
    }
    const updatedDocument = largestIDIndex - 1;
    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : bulk updated all documents. 
        upto document ${updatedDocument}`
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Unexpected error: ${error}`
    });
  }
});

app.put("/db/:number", async (req, res) => {
  const docID = parseInt(req.params.number);
  if (docID == 0) {
    try {
      const largestIDIndex = (await latestUsedID()) + 1;

      for (let i = 1; i < largestIDIndex; i++) {
        console.log(i);
        let weatherJSON = null, nasaJSON = null, stockJSON = null, quoteJSON = null, newsJSON = null;

        // using query for user to input their longitude and latitude
        const longitude = req.query.longitude || -73.6814687;
        const latitude = req.query.latitude || 42.7297628;

        try {
          weatherJSON = await weatherAPI(longitude, latitude);
          nasaJSON = await nasaAPI();
          stockJSON = await stockAPI();
          quoteJSON = await quoteAPI();
          newsJSON = await newsGETJSON();

          const result = ({
            id: i,
            document: {
              weather: weatherJSON,
              nasa: nasaJSON,
              stock: stockJSON,
              quote: quoteJSON,
              news: newsJSON
            },
            valid: 'true'
          });

          const filter = { id: i };
          await lab5DB.findOneAndUpdate(filter, result);

        } catch (error) {
          return res.status(500).json({
            status: "error",
            message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
          });
        }
      }
      const updatedDocument = largestIDIndex - 1;
      res.status(200).json({
        status: "ok",
        message: `Ciallo～(∠・ω< ) : bulk updated all documents. 
          upto document ${updatedDocument}`
      });

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Unexpected error: ${error}`
      });
    }
  } else {
    try {

      let weatherJSON = null, nasaJSON = null, stockJSON = null, quoteJSON = null, newsJSON = null;

      // using query for user to input their longitude and latitude
      const longitude = req.query.longitude || -73.6814687;
      const latitude = req.query.latitude || 42.7297628;

      weatherJSON = await weatherAPI(longitude, latitude);
      nasaJSON = await nasaAPI();
      stockJSON = await stockAPI();
      quoteJSON = await quoteAPI();
      newsJSON = await newsGETJSON();

      const documents = await lab5DB.find({ id: `${docID}` }).exec();

      if (documents[0].id == docID) {
        const result = ({
          id: docID,
          document: {
            weather: weatherJSON,
            nasa: nasaJSON,
            stock: stockJSON,
            quote: quoteJSON,
            news: newsJSON
          },
          valid: 'true'
        });

        console.log(result);
        const filter = { id: docID };
        await lab5DB.findOneAndUpdate(filter, result);

      } else {
        throw new Error(`Invalid ID, document ${docID} not found`);

      }

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
      })
    }

    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : updated document ${docID}`
    });

  }
});

app.delete("/db/:number", async (req, res) => {
  const docID = parseInt(req.params.number);

  try {
    if (req.params.number == "0" || req.params.number == "") {
      throw new Error("body for delete should not be 0 or empty, can't drop whole database");

    }

    const documents = await lab5DB.find({ id: `${docID}` }).exec();

    if (documents.length > 0 && documents[0].id == docID && documents[0].valid == true) {
      const result = {
        id: docID,
        valid: false,
        document: null
      };

      console.log(result);
      const filter = { id: docID };
      await lab5DB.findOneAndUpdate(filter, result);

      res.status(200).json({
        status: "ok",
        message: `Ciallo～(∠・ω< ) : deleted document ${docID}`
      });

    } else {
      throw new Error(`Invalid ID, document ${docID} not found`);
    }

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});




app.get("/db", async (req, res) => {
  try {
    const pagination = await findPaginations();

    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : return document pagination for valid document
        ${pagination}`
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `unexpected error: ${error}`
    })
  }
});

// return specific document base on given id
app.get("/db/:number", async (req, res) => {
  const docID = parseInt(req.params.number);

  if (docID == 0) {
    try {
      const pagination = await findPaginations();

      res.status(200).json({
        status: "ok",
        message: `Ciallo～(∠・ω< ) : return document pagination for valid document
          ${pagination}`
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `unexpected error: ${error}`
      })
    }

  } else {
    try {

      const documents = await lab5DB.find({ id: `${docID}` }).exec();
      let valid = false;
      if (documents.length > 0) {
        valid = documents[0].valid;
      }
      let validity = "document is not available";
      if (valid) {
        validity = "document is available"
      }
      console.log(valid);
      const returnedDoc = valid ? documents[0] : null;
      res.status(200).json({
        status: "ok",
        message: `Ciallo～(∠・ω< ) : GET document ${docID} success and
        ${validity}`,
        document: returnedDoc
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `unexpected error: ${error}`
      })
    }
  }
});

app.post("/db", async (req, res) => {
  console.log(req.params);
  try {
    // if (req.params.number !== "" || req.params.number !== "0") {
    //   throw new Error ("body have to be either empty or 0 for post request");
    // }
    let weatherJSON = null, nasaJSON = null, stockJSON = null, quoteJSON = null, newsJSON = null;

    // using query for user to input their longitude and latitude
    const longitude = req.query.longitude || -73.6814687;
    const latitude = req.query.latitude || 42.7297628;

    weatherJSON = await weatherAPI(longitude, latitude);
    nasaJSON = await nasaAPI();
    stockJSON = await stockAPI();
    quoteJSON = await quoteAPI();
    newsJSON = await newsGETJSON();

    const largestID = (await latestUsedID()) + 1;

    const result = new lab5DB({
      id: largestID,
      document: {
        weather: weatherJSON,
        nasa: nasaJSON,
        stock: stockJSON,
        quote: quoteJSON,
        news: newsJSON
      },
      valid: 'true'
    });

    await result.save();


    return res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : documented posted with id: ${largestID}`,
      document: result
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

app.post("/db/:number", async (req, res) => {
  console.log(2);
  try {
    if (req.params.number !== "" && req.params.number !== "0") {
      throw new Error("body have to be either empty or 0 for post request");
    }
    let weatherJSON = null,
      nasaJSON = null,
      stockJSON = null,
      quoteJSON = null,
      newsJSON = null;

    // using query for user to input their longitude and latitude
    const longitude = req.query.longitude || -73.6814687;
    const latitude = req.query.latitude || 42.7297628;

    weatherJSON = await weatherAPI(longitude, latitude);
    nasaJSON = await nasaAPI();
    stockJSON = await stockAPI();
    quoteJSON = await quoteAPI();
    newsJSON = await newsGETJSON();

    const largestID = (await latestUsedID()) + 1;

    const result = new lab5DB({
      id: largestID,
      document: {
        weather: weatherJSON,
        nasa: nasaJSON,
        stock: stockJSON,
        quote: quoteJSON,
        news: newsJSON
      },
      valid: true
    });

    await result.save();

    return res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : documented posted with id: ${largestID}`,
      document: result
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
    });
  }
});

// Lab 6

// most quries, top choice for historical data
async function Alphavantage(stockSymbol) {
  let APIkey = process.env.AlphavantageAPI;
  let apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&adjusted=false&symbol="
    + stockSymbol + "&outputsize=full&apikey=" + APIkey;

  let JSON;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data["Time Series (Daily)"];
    // Format the data to match the schema
    // console.log(response.data);
    const formattedData = Object.entries(data)
      .slice(0, 2000)
      .map(([date, values]) => ({
        time: new Date(date),
        stockSymbol: stockSymbol,
        open: parseFloat(values["1. open"]),
        close: parseFloat(values["4. close"]),
        dayLow: parseFloat(values["3. low"]),
        dayHigh: parseFloat(values["2. high"]),
        volume: parseInt(values["5. volume"]),
        source: "Alphavantage API",
        valid: true
      }));

    JSON = {
      status: 'ok',
      message: `Ciallo～(∠・ω< ) : return stock data for ${stockSymbol}`,
      data: formattedData
    };

  } catch (error) {
    JSON = {
      'status': 'error',
      'message': `Kira (<ゝω・)☆～绮罗星 : ${error}`,
      'data': null
    };
  }

  return JSON;
}

async function Polygon(stockSymbol) {

  let APIkey = process.env.PolygonAPI;
  let apiUrl = "https://api.polygon.io/v2/aggs/ticker/" + stockSymbol +
    "/range/1/day/2018-01-01/2024-04-07?adjusted=true&sort=desc&limit=1000&apiKey=" + APIkey;

  let JSON;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data["results"];
    // Format the data to match the schema
    const formattedData = data.slice(0, 1000).map(result => ({
      time: new Date(result.t),
      stockSymbol: stockSymbol,
      open: result.o,
      close: result.c,
      dayLow: result.l,
      dayHigh: result.h,
      volume: result.v,
      source: "Polygon API",
      valid: true // You can set this based on your criteria
    }));

    JSON = {
      status: 'ok',
      message: `Ciallo～(∠・ω< ) : return stock data for ${stockSymbol}`,
      data: formattedData
    };

  } catch (error) {
    JSON = {
      'status': 'error',
      'message': `Kira (<ゝω・)☆～绮罗星 : ${error}`,
      'data': null
    };
  }

  return JSON;
}

async function FinancialModelingPrep(stockSymbol) {
  let APIkey = process.env.FinancialModelingPrepAPI;
  let apiUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${stockSymbol}?apikey=${APIkey}`;

  let responseJSON;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.historical;

    const formattedData = data.slice(0, 2000).map(result => ({

      time: new Date(result.date),
      stockSymbol: stockSymbol,
      open: result.open,
      close: result.close,
      dayLow: result.low,
      dayHigh: result.high,
      volume: result.volume,
      source: "FinancialModelingPrep",
      valid: true // You can set this based on your criteria
    }));

    responseJSON = {
      status: 'ok',
      message: `Ciallo～(∠・ω< ) : returned stock data for ${stockSymbol}`,
      data: formattedData
    };

  } catch (error) {
    responseJSON = {
      status: 'error',
      message: `Kira (<ゝω・)☆～绮罗星 : ${error.response.data}`,
      data: null
    };
  }
  return responseJSON;
}

const lab6DBSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  time: { type: Date, default: Date.now },
  stockSymbol: { type: String, required: true },
  open: { type: Number, default: null },
  close: { type: Number, default: null },
  dayLow: { type: Number, default: null },
  dayHigh: { type: Number, default: null },
  volume: { type: Number, default: null },
  source: { type: String, required: true },
  valid: { type: Boolean, default: false }
});

const lab6DB = mongoose.model('Stocks', lab6DBSchema);

const lab6DBList = ["AAPL", "AMZN", "GLD"];

async function stockLastUsedID() {
  const largestID = await lab6DB
    .find({}, 'id')
    .sort({ id: -1 })
    .exec();

  return largestID[0].id;
}

async function Lab6findPaginations() {
  const documents = await lab6DB.find({ valid: true }, 'id').exec();
  const pagination = documents.map(doc => doc.id);
  return pagination;
}

// fetch 300+ documents for lab1 part 1
// good for resetting database
app.get('/part1', async (req, res) => {
  try {
    // Fetch data for APPLE (AAPL), Gold Futures (GLD), and Amazon (AMZN)
    const appleData = (await Alphavantage("AAPL"))["data"];
    const amazonData = (await Polygon("AMZN"))["data"];
    const goldData = (await FinancialModelingPrep("GLD"))["data"];

    // const appleData = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'apple.json')))["apple"];
    // const amazonData = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'amazon.json')))["amazon"];
    // const goldData = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'gold.json')))["goldData"];

    let i = 1;

    // drop all data
    await lab6DB.deleteMany({});


    // for (const values of appleData) {
    //   if (!isNaN(values.open)) { // Check if open value is not NaN
    //     const filter = { id: i };
    //     await lab6DB.findOneAndUpdate(filter, { ...values, id: i }, { upsert: true });
    //     i++;
    //   } else {
    //     console.log(`Skipping update for APPLE data at index ${i} because open value is NaN`);
    //   }
    // }

    for (const values of amazonData) {
      if (!isNaN(values.open)) {
        const filter = { id: i };
        await lab6DB.findOneAndUpdate(filter, { ...values, id: i }, { upsert: true });
        i++;
      } else {
        console.log(`Skipping update for Amazon data at index ${i} because open value is NaN`);
      }
    }

    // Update data for Gold Futures (GLD)
    for (const values of goldData) {
      if (!isNaN(values.open)) {
        const filter = { id: i };
        await lab6DB.findOneAndUpdate(filter, { ...values, id: i }, { upsert: true });
        i++;
      } else {
        console.log(`Skipping update for Gold Futures data at index ${i} because open value is NaN`);
      }
    }

    res.status(200).json({
      status: "ok",
      message: "Updated Amazon, Apple, and Gold Futures data"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Unexpected error: ${error}`
    });
  }


  // res.status(200).json({
  // status: "ok",
  //   apple: appleData,
  //   amazon: amazonData,
  //   goldData: goldData
  // });

});


app.get('/addMoreData', async (req, res) => {
  try {
    // Fetch data for APPLE (AAPL), Gold Futures (GLD), and Amazon (AMZN)
    const appleData = (await Alphavantage("AMZN"))["data"];
    // const amazonData = (await Polygon("AMZN"))["data"];
    // const goldData = (await FinancialModelingPrep("GLD"))["data"];

    // const appleData = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'apple.json')))["apple"];
    // const amazonData = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'amazon.json')))["amazon"];
    // const goldData = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'gold.json')))["goldData"];

    let i = await ((stockLastUsedID()) )+1;


    for (const values of appleData) {
      if (!isNaN(values.open)) { // Check if open value is not NaN
        const filter = { id: i };
        await lab6DB.findOneAndUpdate(filter, { ...values, id: i }, { upsert: true });
        i++;
      } else {
        console.log(`Skipping update for APPLE data at index ${i} because open value is NaN`);
      }
    }

    // for (const values of amazonData) {
    //   if (!isNaN(values.open)) {
    //     const filter = { id: i };
    //     await lab6DB.findOneAndUpdate(filter, { ...values, id: i }, { upsert: true });
    //     i++;
    //   } else {
    //     console.log(`Skipping update for Amazon data at index ${i} because open value is NaN`);
    //   }
    // }

    // // Update data for Gold Futures (GLD)
    // for (const values of goldData) {
    //   if (!isNaN(values.open)) {
    //     const filter = { id: i };
    //     await lab6DB.findOneAndUpdate(filter, { ...values, id: i }, { upsert: true });
    //     i++;
    //   } else {
    //     console.log(`Skipping update for Gold Futures data at index ${i} because open value is NaN`);
    //   }
    // }

    res.status(200).json({
      status: "ok",
      message: "Updated Amazon, Apple, and Gold Futures data"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Unexpected error: ${error}`
    });
  }


  // res.status(200).json({
  // status: "ok",
  //   apple: appleData,
  //   amazon: amazonData,
  //   goldData: goldData
  // });

});


app.get("/part3/", async (req, res) => {
  // Fetch data for APPLE (AAPL), Gold Futures (GLD), and Amazon (AMZN)
  res.status(200).json({
    status: "ok",
    message: "possible GET endpoint is /part3/AAPL, /part3/AMZN, /part3/GLD"
  });
});

// app.get("/part3/:category", async (req, res) => {
//   const requestCategory = req.params.category.toUpperCase();

//   try {
//     let data;

//     if (requestCategory == "AAPL") {
//       data = (await Alphavantage("AAPL"))["data"];
//     } else if (requestCategory == "AMZN") {
//       data = (await Polygon("AMZN"))["data"];
//     } else if (requestCategory == "GLD") {
//       data = (await FinancialModelingPrep("GLD"))["data"];
//     } else {
//       throw new Error(`Category ${requestCategory} is not valid`);
//     }

//     // backup when API runs out of query
//     // if (requestCategory == "AAPL") {
//     //   data = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'apple.json')))["apple"];
//     // } else if (requestCategory == "AMZN") {
//     //   data = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'amazon.json')))["amazon"];
//     // } else if (requestCategory == "GLD") {
//     //   data = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'gold.json')))["goldData"];
//     // } else {
//     //   throw new Error `Category ${requestCategory} is not valid`;
//     // }

//     const largestIdDocument = await lab6DB.findOne({}, { id: 1 }).sort({ id: -1 });
//     let index = largestIdDocument ? largestIdDocument.id + 1 : 0;

//     if (index === 0) {
//       throw new Error("Error when fetching latest ID");
//     }

//     for (const values of data) {
//       if (!isNaN(values.open)) {
//         const filter = { id: index };
//         await lab6DB.findOneAndUpdate(filter, { ...values, id: index }, { upsert: true });
//         index++;
//       } else {
//         console.log(`Skipping update for ${requestCategory} data because open value is NaN`);
//       }
//     }

//     res.status(200).json({
//       status: "ok",
//       message: `Ciallo～(∠・ω< ) : Successfully added ${data.length} data for ${requestCategory} from ${data[0].source}`,
//       data: data
//     });
//   } catch (e) {
//     res.status(500).json({
//       status: "error",
//       message: `Kira (<ゝω・)☆～绮罗星 : Error: ${e}`
//     });
//   }
// });

app.get("/part3/GLD", async (req, res) => {

  try {
    let data;
    data = (await FinancialModelingPrep("GLD"))["data"];

    //   data = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'gold.json')))["goldData"];

    const largestIdDocument = await lab6DB.findOne({}, { id: 1 }).sort({ id: -1 });
    let index = largestIdDocument ? largestIdDocument.id + 1 : 0;

    if (index === 0) {
      throw new Error("Error when fetching latest ID");
    }

    for (const values of data) {
      if (!isNaN(values.open)) {
        const filter = { id: index };
        await lab6DB.findOneAndUpdate(filter, { ...values, id: index }, { upsert: true });
        index++;
      } else {
        console.log(`Skipping update for GLD data because open value is NaN`);
      }
    }

    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : Successfully added ${data.length} data for GLD from ${data[0].source}`,
      data: data
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : Error: ${e}`
    });
  }
});

app.get("/part3/AAPL", async (req, res) => {

  try {
    let data;

    data = (await Alphavantage("AAPL"))["data"];


    // backup when API runs out of query

    //   data = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'apple.json')))["apple"];


    const largestIdDocument = await lab6DB.findOne({}, { id: 1 }).sort({ id: -1 });
    let index = largestIdDocument ? largestIdDocument.id + 1 : 0;

    if (index === 0) {
      throw new Error("Error when fetching latest ID");
    }

    for (const values of data) {
      if (!isNaN(values.open)) {
        const filter = { id: index };
        await lab6DB.findOneAndUpdate(filter, { ...values, id: index }, { upsert: true });
        index++;
      } else {
        console.log(`Skipping update for AAPL data because open value is NaN`);
      }
    }

    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : Successfully added ${data.length} data for AAPL from ${data[0].source}`,
      data: data
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : Error: ${e}`
    });
  }
});

app.get("/part3/AMZN", async (req, res) => {

  try {
    let data;


    data = (await Polygon("AMZN"))["data"];

    //   data = JSON.parse(fs2.readFileSync(path.join(__dirname, 'public', 'amazon.json')))["amazon"];

    const largestIdDocument = await lab6DB.findOne({}, { id: 1 }).sort({ id: -1 });
    let index = largestIdDocument ? largestIdDocument.id + 1 : 0;

    if (index === 0) {
      throw new Error("Error when fetching latest ID");
    }

    for (const values of data) {
      if (!isNaN(values.open)) {
        const filter = { id: index };
        await lab6DB.findOneAndUpdate(filter, { ...values, id: index }, { upsert: true });
        index++;
      } else {
        console.log(`Skipping update for AMZN data because open value is NaN`);
      }
    }

    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : Successfully added ${data.length} data for AMZN from ${data[0].source}`,
      data: data
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : Error: ${e}`
    });
  }
});

app.get("/part3/:category", async (req, res) => {
  // Fetch data for APPLE (AAPL), Gold Futures (GLD), and Amazon (AMZN)
  const requestCategory = req.params.category.toUpperCase();

  res.status(404).json({
    status: "error",
    message: `Kira (<ゝω・)☆～绮罗星 : ${requestCategory} is not avilable`
  });
});

app.get('/stock', async (req, res) => {
  const typeMessage = ["AAPL for Apple", "AMZN for Amazon", "GLD for Gold"];

  res.status(200).json({
    status: "ok",
    message: "Ciallo～(∠・ω< ) : Returned Supported Stocks and Futures. Can use them as /news/type. For example, /news/APPL for all the document id related to APPLE stock.",
    types: typeMessage
  });
});

// get all id by category, aka StockSymbol, or simply by id
app.get('/stock/:category', async (req, res) => {
  const requestCategory = req.params.category.toUpperCase();

  if (!isNaN(requestCategory) && Number.isInteger(parseFloat(requestCategory))) {

    try {
      if (requestCategory == 0) {
        const typeMessage = ["AAPL for Apple", "AMZN for Amazon", "GLD for Gold"];

        res.status(200).json({
          status: "ok",
          message: "Ciallo～(∠・ω< ) : Returned Supported Stocks and Futures. Can use them as /news/type. For example, /news/APPL for all the document id related to APPLE stock.",
          types: typeMessage
        });
      } else {
        const result = await lab6DB.findOne({ id: requestCategory, valid: true });

        if (!result) {

          return res.status(404).json({
            status: "error",
            message: `Kira (<ゝω・)☆～绮罗星 : Document with id ${requestCategory} not found or valid field is false for that document`,
            document: null
          });
        }


        res.status(200).json({
          status: "ok",
          message: `Ciallo～(∠・ω< ) : Returned document with id ${requestCategory}`,
          document: result
        });
      }
    } catch (error) {
      // Handle unexpected errors
      res.status(500).json({
        status: "error",
        message: `Kira (<ゝω・)☆～绮罗星 : Unexpected error: ${error}`,
        document: null
      });
    }
  }
  else if (lab6DBList.includes(requestCategory)) {
    try {

      const result = await lab6DB.find({ stockSymbol: requestCategory, valid: true }).select('id');


      const ids = result.map(obj => obj.id).join(',');

      res.status(200).json({
        status: "ok",
        message: `Ciallo～(∠・ω< ) : Returned supported ids for ${requestCategory}`,
        ids: ids
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Kira (<ゝω・)☆～绮罗星 : Unexpected error: ${error}`,
        ids: null
      });
    }
  } else {
    res.status(404).json({
      status: "error",
      message: `Requested category ${requestCategory} is not supported`,
      ids: null
    });
  }
});

app.get('/stock/:category/:id', async (req, res) => {
  const requestCategory = req.params.category.toUpperCase();
  const index = parseInt(req.params.id);
  if (req.params.id == 'all') {
    try {
      if (lab6DBList.includes(requestCategory)) {
        const result = await lab6DB.find({
          stockSymbol: requestCategory,
          valid: true,
          $expr: {
            $and: [
              { $eq: [{ $dayOfWeek: "$time" }, 3] },
              { $gt: [{ $year: "$time" }, 2022] }     
            ]
          }
        }).select('-_id -__v').sort({ time: -1 });

        res.status(200).json({
          status: 'ok',
          message: `Ciallo～(∠・ω< ) : Returned all datas for ${requestCategory}`,
          data: result
        });

      } else {
        throw new Error(`Unrecognized category is provided – ${requestCategory}`);
      }

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Kira (<ゝω・)☆～绮罗星 : ${error}`
      });
    }
  }
  else if (lab6DBList.includes(requestCategory)) {
    try {
      // find the document with the specified index and category
      const document = await lab6DB.findOne({ id: index, stockSymbol: requestCategory });

      if (document) {
        if (document.valid) {
          // if the document is valid, return the document itself
          res.status(200).json({
            status: "ok",
            message: `Returned document for category ${requestCategory} and id ${index}`,
            document: document
          });
        } else {
          // if the document is not valid, return the ID with a message indicating the document is deleted
          // hopefully never reach, since stockSymbol will be null after document deleted
          res.status(200).json({
            status: "ok",
            message: `Document with category ${requestCategory} and id ${index} is deleted`,
            document: null,
            id: index
          });
        }
      } else {
        res.status(404).json({
          status: "error",
          message: `Document not found for category ${requestCategory} and id ${index}`,
          document: null
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Unexpected error: ${error}`,
        document: null
      });
    }
  } else {
    res.status(404).json({
      status: "error",
      message: `Requested category ${requestCategory} is not supported`,
      document: null
    });
  }
});

// bulk update the price for APPLE (APPL), Gold Futures (GLD), and Amazon (AMZN)
// update items from id 1 to 582, then drop the remaining
app.put('/stock', async (req, res) => {
  try {

    const fieldsToUpdate = req.query;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Kira (<ゝω・)☆～绮罗星 : At least one field to update must be provided",
      });
    }


    let updateFields = {};
    let fields = [];
    let validFieldNum = 0;

    // parse the field and value user want to update
    if (fieldsToUpdate.open !== undefined) {
      updateFields.open = parseFloat(fieldsToUpdate.open);
      fields.push("open");
      validFieldNum++;
    }
    if (fieldsToUpdate.close !== undefined) {
      updateFields.close = parseFloat(fieldsToUpdate.close);
      fields.push("close");
      validFieldNum++;
    }
    if (fieldsToUpdate.dayLow !== undefined) {
      updateFields.dayLow = parseFloat(fieldsToUpdate.dayLow);
      fields.push("dayLow");
      validFieldNum++;

    }
    if (fieldsToUpdate.dayHigh !== undefined) {
      updateFields.dayHigh = parseFloat(fieldsToUpdate.dayHigh);
      fields.push("dayHigh");
      validFieldNum++;

    }
    if (fieldsToUpdate.volume !== undefined) {
      updateFields.volume = parseInt(fieldsToUpdate.volume);
      fields.push("volume");
      validFieldNum++;

    }
    if (fieldsToUpdate.source !== undefined) {
      updateFields.source = fieldsToUpdate.source;
      fields.push("source");
      validFieldNum++;

    }
    if (fieldsToUpdate.stockSymbol !== undefined) {
      updateFields.stockSymbol = fieldsToUpdate.stockSymbol;
      fields.push("stockSymbol");
      validFieldNum++;

    }

    if (Object.keys(fieldsToUpdate).length === 0 || validFieldNum === 0) {
      return res.status(400).json({
        status: "error",
        message: "Kira (<ゝω・)☆～绮罗星 : At least one valid field to update must be provided",
      });
    }


    const result = await lab6DB.updateMany({ valid: true }, { $set: updateFields });

    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : updated ${fields} for all valid documents`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : Unexpected error: ${error}`,
    });
  }
});

app.put('/stock/:id', async (req, res) => {
  const { id } = req.params;
  if (id == 0) {
    try {

      const fieldsToUpdate = req.query;

      let validFieldNum = 0;

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Kira (<ゝω・)☆～绮罗星 : At least one field to update must be provided",
        });
      }

      let updateFields = {};
      let fields = [];
      // parse the field and value user want to update
      if (fieldsToUpdate.open !== undefined) {
        updateFields.open = parseFloat(fieldsToUpdate.open);
        fields.push("open");
        validFieldNum++;
      }
      if (fieldsToUpdate.close !== undefined) {
        updateFields.close = parseFloat(fieldsToUpdate.close);
        fields.push("close");
        validFieldNum++;
      }
      if (fieldsToUpdate.dayLow !== undefined) {
        updateFields.dayLow = parseFloat(fieldsToUpdate.dayLow);
        fields.push("dayLow");
        validFieldNum++;
      }
      if (fieldsToUpdate.dayHigh !== undefined) {
        updateFields.dayHigh = parseFloat(fieldsToUpdate.dayHigh);
        fields.push("dayHigh");
        validFieldNum++;

      }
      if (fieldsToUpdate.volume !== undefined) {
        updateFields.volume = parseInt(fieldsToUpdate.volume);
        fields.push("volume");
        validFieldNum++;
      }
      if (fieldsToUpdate.source !== undefined) {
        updateFields.source = fieldsToUpdate.source;
        fields.push("source");
        validFieldNum++;
      }
      if (fieldsToUpdate.stockSymbol !== undefined) {
        updateFields.stockSymbol = fieldsToUpdate.stockSymbol;
        fields.push("stockSymbol");
        validFieldNum++;
      }

      if (Object.keys(fieldsToUpdate).length === 0 || validFieldNum === 0) {
        return res.status(400).json({
          status: "error",
          message: "Kira (<ゝω・)☆～绮罗星 : At least one field to update must be provided",
        });
      }
      const result = await lab6DB.updateMany({ valid: true }, { $set: updateFields });

      res.status(200).json({
        status: "ok",
        message: `Ciallo～(∠・ω< ) : updated ${fields} for all valid documents`,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Kira (<ゝω・)☆～绮罗星 : Unexpected error: ${error}`,
      });
    }
  } else {


    try {

      const document = await lab6DB.findOne({ id });

      if (!document) {
        return res.status(404).json({
          status: "error",
          message: "Kira (<ゝω・)☆～绮罗星 : Document not found"
        });
      }

      if (!document.valid) {
        return res.status(400).json({
          status: "error",
          message: `Kira (<ゝω・)☆～绮罗星 : Document ${id} with id found but valid is false: document was deleted`
        });
      }

      const fieldsToUpdate = req.query;


      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Kira (<ゝω・)☆～绮罗星 : At least one field to update must be provided",
        });
      }

      let updateFields = {};
      let fields = [];
      let validFieldNum = 0;
      // parse the field and value user want to update
      if (fieldsToUpdate.open !== undefined) {
        updateFields.open = parseFloat(fieldsToUpdate.open);
        fields.push("open");
        validFieldNum++;
      }
      if (fieldsToUpdate.close !== undefined) {
        updateFields.close = parseFloat(fieldsToUpdate.close);
        fields.push("close");
        validFieldNum++;
      }
      if (fieldsToUpdate.dayLow !== undefined) {
        updateFields.dayLow = parseFloat(fieldsToUpdate.dayLow);
        fields.push("dayLow");
        validFieldNum++;

      }
      if (fieldsToUpdate.dayHigh !== undefined) {
        updateFields.dayHigh = parseFloat(fieldsToUpdate.dayHigh);
        fields.push("dayHigh");
        validFieldNum++;

      }
      if (fieldsToUpdate.volume !== undefined) {
        updateFields.volume = parseInt(fieldsToUpdate.volume);
        fields.push("volume");
        validFieldNum++;

      }
      if (fieldsToUpdate.source !== undefined) {
        updateFields.source = fieldsToUpdate.source;
        fields.push("source");
        validFieldNum++;

      }
      if (fieldsToUpdate.stockSymbol !== undefined) {
        updateFields.stockSymbol = fieldsToUpdate.stockSymbol;
        fields.push("stockSymbol");
        validFieldNum++;

      }

      const result = await lab6DB.updateOne({ id }, { $set: updateFields });

      if (Object.keys(fieldsToUpdate).length === 0 || validFieldNum === 0) {
        return res.status(400).json({
          status: "error",
          message: "Kira (<ゝω・)☆～绮罗星 : At least one field to update must be provided",
        });
      }

      res.status(200).json({
        status: "ok",
        message: `Ciallo～(∠・ω< ) : updated ${fields} for document with ID ${id}`
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Kira (<ゝω・)☆～绮罗星 : Unexpected error: ${error}`
      });
    }
  }
});

app.delete('/stock/', async (req, res) => {
  res.status(500).json({
    status: "error",
    message: `Kira (<ゝω・)☆～绮罗星 : cannot delete all stocks`,
    updatedDocument: null
  });
});

app.delete('/stock/:id', async (req, res) => {
  const idToUpdate = req.params.id;
  if (idToUpdate == 0) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : cannot delete all stocks`,
      updatedDocument: null
    });

  } else {
    try {
      // attempt to find and update the document with the provided id
      const updatedDocument = await lab6DB.findOneAndUpdate(
        { id: idToUpdate },
        {
          $set: {
            valid: false,
            // set other fields to null to represent successful delete
            time: null,
            stockSymbol: null,
            open: null,
            close: null,
            dayLow: null,
            dayHigh: null,
            volume: null,
            source: null
          }
        },
        { new: true }
      );

      if (updatedDocument) {
        res.status(200).json({
          status: "ok",
          message: `Ciallo～(∠・ω< ) : Deleted document with id ${idToUpdate}`,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: `Kira (<ゝω・)☆～绮罗星 : Document with id ${idToUpdate} not found`,
          updatedDocument: null
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Kira (<ゝω・)☆～绮罗星 : Unexpected error: ${error}`,
        updatedDocument: null
      });
    }
  }
});

app.post("/stock", async (req, res) => {
  try {
    const largestIdDocument = await lab6DB.findOne({}, { id: 1 }).sort({ id: -1 });
    let newId = 1;

    if (largestIdDocument) {
      newId = largestIdDocument.id + 1;
    }



    // fields user can adjust for new document
    const open = req.query.open !== undefined ? parseFloat(req.query.open) : 0;
    const close = req.query.close !== undefined ? parseFloat(req.query.close) : 0;
    const dayLow = req.query.dayLow !== undefined ? parseFloat(req.query.dayLow) : 0;
    const dayHigh = req.query.dayHigh !== undefined ? parseFloat(req.query.dayHigh) : 0;
    const volume = req.query.volume !== undefined ? parseInt(req.query.volume) : 0;
    const source = req.query.source !== undefined ? req.query.source : 'default';
    const stockSymbol = req.query.stockSymbol !== undefined ? req.query.stockSymbol : 'default';


    // fields user have no access to
    const id = newId;
    const time = new Date();
    const valid = true;

    const newDocument = new lab6DB({
      id,
      time,
      stockSymbol,
      open,
      close,
      dayLow,
      dayHigh,
      volume,
      source,
      valid
    });

    await newDocument.save();

    res.status(200).json({
      status: "ok",
      message: `Ciallo～(∠・ω< ) : Showing the document that will be created with id ${newDocument.id}`,
      data: newDocument
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Kira (<ゝω・)☆～绮罗星 : Unexpected error: ${error}`
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});