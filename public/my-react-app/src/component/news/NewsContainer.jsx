// NewsContainer.jsx
import React, { useState, useEffect } from 'react';
import NewsSection from './component/NewsSection';

import './newscontainer.css'

const NewsContainer = () => {
  // "Bookmarks"
  const categories = [ "general", "business", "politics",  "technology", "science", "education", "health", "entertainment"];

  // const [newsJSON, setNewsJSON] = useState({});
  const [stockJSON, setStockJSON] = useState({});
  const [categoryNews, setCategoryNews] = useState({});

  const fetchData = async () => {
    try {
      const response = await fetch("/build/news-and-stock");
      const data = await response.json();

      if (data.status === 'ok') {

        if (data.news && data.news.status === 'ok') {
          // setNewsJSON(data.news);
          setCategoryNews(data.news.articles);
        } else {
          alert(data.news.message || 'News data unavailable');
        }

        if (data.stock && data.stock.status === 'ok') {
          setStockJSON(data.stock);

        } else {
          alert(data.stock.message || "Stock Data Unavaiable");
        }
      } else {
        alert(data.message || 'Stock data unavailable');
      }
    } catch (error) {
      alert('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  return (
    <div className="news">
      <NewsSection key={99} category="stock" news={stockJSON["stocks"]}  />

      {categories.map((category, index) => (
        <NewsSection key={index} category={category} news={categoryNews[category]} />
      ))}
    </div>
  );
};

export default NewsContainer;
