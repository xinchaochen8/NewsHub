import React from 'react';
import './style/OtherInfo.css';

const OtherInfo = ({ weatherJSON }) => {
    return (
        <section className="others_info">
            <h2>Humidity:</h2>
            <p id="Humidity">{weatherJSON.humidity || "TBD"}</p>
            <h2>Wind Speed:</h2>
            <p id="WindSpeed">{weatherJSON.windspeed || "TBD"}</p>
        </section>
    );
};

export default OtherInfo;
