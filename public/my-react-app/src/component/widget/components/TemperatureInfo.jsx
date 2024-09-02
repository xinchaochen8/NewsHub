import React from 'react';
import './style/TemperatureInfo.css';

const TemperatureInfo = ({ weatherJSON }) => {
    return (
        <section className="temperature">
            <section className="current_temperature">
                <h2>Temperature:</h2>
                <p id="Current_Temperature">{weatherJSON.current_temp || "TBD"}</p>
            </section>
            <div className="other_temperatures">
                <h2>Highest Temperature:</h2>
                <p id="Highest_Temperature">{weatherJSON.highest_temp || "TBD"}</p>
                <h2>Lowest Temperature:</h2>
                <p id="Lowest_Temperature">{weatherJSON.lowest_temp || "TBD"}</p>
            </div>
        </section>
    );
};

export default TemperatureInfo;
