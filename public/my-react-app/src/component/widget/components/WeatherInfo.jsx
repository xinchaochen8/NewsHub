import React, { useEffect, useState } from 'react';
import defaultIcon from "../img_kyoto.jpg";
import './style/WeatherInfo.css';

const WeatherInfo = ({ icon, weatherJSON }) => {
    const [useIcon, setIcon] = useState(icon);

    useEffect(() => {
        if (icon !== null && icon !== undefined) {
            setIcon(icon);
        } else {
            setIcon(defaultIcon);
        }
    }, [icon]);

    return (
        <div>
            <img src={useIcon} id="WeatherImg" alt="Weather Icon" />
            <h2 id="Weather">{weatherJSON.weather || "TBD"}</h2>
        </div>
    );
};

export default WeatherInfo;
