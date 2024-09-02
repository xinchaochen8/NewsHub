// StockGraph.jsx
import React, { useState, useEffect } from 'react';
import CombinedLineChart from './CombinedLineChart';
import Chart from './Chart';
import aapl from './aapl.json';
import amzn from './amzn.json';
import gld from './gld.json';
import DataAnalysis from './DataAnalysis';

const StockGraph = () => {
  const [appleData, setAppleData] = useState([]);
  const [amazonData, setAmazonData] = useState([]);
  const [goldData, setGoldData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeForm, setActiveForm] = useState(1);


  useEffect(() => {
    const fetchData = async (stockSymbol) => {
      try {
        const response = await fetch(`/stock/${stockSymbol}/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        return data;
      } catch (error) {
        alert(error);
      }
    };
    const fetchAllData = async () => {
      try {
        const apple = await fetchData('AAPL');
        setAppleData(apple.data);
        const amazon = await fetchData('AMZN');
        setAmazonData(amazon.data);
        const gold = await fetchData('GLD');
        setGoldData(gold.data);
        // setAppleData(aapl.data);
        // setAmazonData(amzn.data);
        // setGoldData(gld.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {

    if (appleData.length > 0) {
      setStartDate(new Date(appleData[0].time));
      setEndDate(new Date(appleData[appleData.length - 1].time));
    }

  }, [appleData]);


  const toggleForm = () => {
    setActiveForm(activeForm === 1 ? 2 : 1);
  };

  return (
    <div>

      <button>
        <button onClick={toggleForm}>Change Form Set</button>
      </button>

      {
        activeForm === 1 ? (
          <>
            <Chart
              data={appleData}
              barColor={"steelblue"}
              startDate={startDate}
              endDate={endDate}
              stockSymbol={"APPLE"} />

            <Chart
              data={amazonData}
              barColor={"green"}
              startDate={startDate}
              endDate={endDate}
              stockSymbol={"AMZN"} />
            <Chart
              data={amazonData}
              barColor={"gold"}
              startDate={startDate}
              endDate={endDate}
              stockSymbol={"GOLD"} />
          </>

        ) : (
          <div id="combined-chart">
            <CombinedLineChart
              appleData={appleData}
              amazonData={amazonData}
              goldData={goldData}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )
      }
      <DataAnalysis />
    </div>
  );
};

export default StockGraph;
