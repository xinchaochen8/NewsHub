import React, { useState, useEffect } from 'react';
import WeatherInfo from './components/WeatherInfo';
import TemperatureInfo from './components/TemperatureInfo';
import OtherInfo from './components/OtherInfo';
import QuoteInfo from './components/QuoteInfo';

import defaultBackground from './stroy_bg_02.jpg';

import './widget.css';

const Widget = () => {
    const [weatherJSON, setWeatherJSON] = useState({});
    const [quoteJSON, setQuoteJSON] = useState({});
    // const [nasaJSON, setNasaJSON] = useState({});
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [explanation, setExplanation] = useState("");
    
    const [icon, setIcon] = useState(null);

    const [latitude, setLatitude] = useState(42.73055451364849);
    const [longitude, setLongitude] = useState(73.67831622699917);

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    function success(pos) {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
    }

    function error(err) {
        console.warn(`Kira (<ゝω・)☆～绮罗星 : ${err.message} \n
                    Using Default Location`);
    }

    const build = async (callback) => {
        try {
            const response = await fetch(`/build/all?latitude=${latitude}&longtitude=${longitude}`);
            const data = await response.json();

            if (data.status === 'ok') {
                callback(data);
            } else {
                callback({
                    "status": "error",
                    "message": data
                });
            }
        } catch (error) {
            callback({
                "status": "error",
                "message": "query fail"
            });
        }
    }

    function explain_nasaIMG() {
        if (backgroundImage !== defaultBackground && explanation !== "") {
            alert(explanation);
        } else {
            alert("Ciallo～(∠・ω< ) : No Valid Explanation");
        }
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    
        const fetchData = async () => {
            try {
                const response = await fetch(`/build/all?latitude=${latitude}&longitude=${longitude}`);
                const data = await response.json();
    
                if (data.status === 'ok') {
                    if (data.weather && data.weather.status === 'ok') {
                        setWeatherJSON(data.weather);
                        setIcon(`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png` || "./img_kyoto.jpg");
                    } else {
                        alert(data.weather?.message || 'Weather data unavailable');
                    }
    
                    if (data.quote && data.quote.status === 'ok') {
                        setQuoteJSON(data.quote);
                    } else {
                        alert(data.quote?.message || 'Quote data unavailable');
                    }
    
                    if (data.nasa && data.nasa.status === 'ok' && data.nasa.media_type === 'image') {
                        setBackgroundImage(`url(${data.nasa.hdurl})` || `url(${defaultBackground})`);
                        setExplanation(data.nasa.explanation);
                    } else {
                        setBackgroundImage(`url(${defaultBackground})`);
                        alert(`Using default background since nasa returned a ${data.nasa?.media_type}\n Link: ${data.nasa?.url}` || 'NASA data unavailable');
                        if (data.nasa?.media_type === 'video' && data.nasa?.url !== null) {
                            window.open(data.nasa?.url);
                        }
                    }
                } else {
                    alert(data.message || 'Error in fetching data');
                }
            } catch (error) {
                alert('Error in fetching data');
            }
        };
    
        fetchData();
    }, [latitude, longitude]);
    
    return (
        <div className="widget-container" id="widget" style={{ backgroundImage: backgroundImage }} onClick={explain_nasaIMG}>
            <WeatherInfo icon={icon} weatherJSON={weatherJSON} />
            <TemperatureInfo weatherJSON={weatherJSON} />
            <OtherInfo weatherJSON={weatherJSON} />
            <QuoteInfo quoteJSON={quoteJSON} />
        </div>
    );
};
export default Widget;
