import React from 'react';
import defaultImg from './No_Preview_image.png';
const NewsItem = ({ item, index, articleIndex, category }) => {
    return (
        <section key={articleIndex} className={`${category} ${category}News${index + articleIndex} newsItem`}>
            <h3 className="Title">{item.title}</h3>
            <a href={item.url}>
                <img className="Img" src={item.urlToImage || defaultImg} alt="article image" />
            </a>
            <div className="newsContent">
                <p className="Description">{item.description || "No Description Available"}</p>
            </div>
        </section>
    );
};

export default NewsItem;
