import React, { useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


import './App.css';

import Audio from './component/audio/Audio';
import Request from './component/form/Request';
import Header from './component/header/Header';
import Navbar from './component/navbar/Navbar';
import NewsContainer from './component/news/NewsContainer';
import Welcome from './component/welcome/Welcome';
import Widget from './component/widget/Widget';
import StockManagement from './component/dataManagement/StockManagement';
import StockGraph from './component/visualization/StockGraph';
import ScrollTop from './component/scroll/ScrollTop';
import Quote from './component/quote/Quote';

function App() {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [isHomeVisible, setIsHomeVisible] = useState(false);
  const [isFormOneActive, setIsFormOneActive] = useState(true);
  const [page, setPage] = useState("Next Page");

  const handleWelcomeClick = () => {
    setIsWelcomeVisible(false);
    setIsHomeVisible(true);
  };

  const toggleForm = () => {
    setIsFormOneActive(!isFormOneActive);
    if (isFormOneActive) {
      setPage("Previous Page");
    } else{
      setPage("Next Page");
    }
  };

  return (
    <div className="App">

      <Navbar />

      <Quote />


      <ScrollTop />

    </div>
  );
}

export default App;
