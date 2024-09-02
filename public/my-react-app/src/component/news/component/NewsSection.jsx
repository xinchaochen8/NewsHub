import React, { useState, useEffect } from 'react';

import background from "../../src/img/stroy_bg_02.jpg";
import NewsItem from './NewsItem';


const NewsSection = ({ category, news }) => {
  const [index, setIndex] = useState(0);

  const handleClick = () => {
    const anchor = document.querySelector('#navbar');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (news && news.length > 0) {
      const refreshInterval = setInterval(() => {
        const newIndex = (index + 5 < 30) ? index + 5 : 0;
        setIndex(newIndex);
      }, 5000);

      return () => clearInterval(refreshInterval);
    }
  }, [news, index]);

  return (
    <div className="NewsSection">
      <a onClick={handleClick} className='NewsTitle'>
        <h1 className="sectionTitle" id={`${category}NewsTitle`}>{category.charAt(0).toUpperCase() + category.slice(1)} Section</h1>
      </a>
      <div className="newsSection" style={{backgroundImage: `url(${background})`}}>
        {news && news.slice(index, index + 5).map((item, articleIndex) => (
          <NewsItem
            key={articleIndex}
            item={item}
            index={index}
            articleIndex={articleIndex}
            category={category}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
