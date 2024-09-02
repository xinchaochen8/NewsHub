import React from 'react';
import './style/QuoteInfo.css';

const QuoteInfo = ({ quoteJSON }) => {
    return (
        <>
            <h3 id="quote">{quoteJSON.quote || 'TBD'}</h3>
            <p id="author">{quoteJSON.author || 'TBD'}</p>
        </>
    );
};

export default QuoteInfo;
