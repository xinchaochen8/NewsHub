import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import './linechart.css';

const CombinedLineChart = ({ appleData, amazonData, goldData, startDate, endDate }) => {
  const ref = useRef();

  useEffect(() => {
    if (!appleData || !appleData.length || !amazonData || !amazonData.length || !goldData || !goldData.length) {
      return;
    }
    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 10, right: 30, bottom: 50, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleTime().domain(new Date(startDate), new Date(endDate)).range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.close));

    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [...appleData, ...amazonData, ...goldData];

    // const customTimeParser = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

    data.forEach(d => {
      d.time = new Date(d.time);
      d.close = +d.close;
    });

    // for x axists, add 8 more days before the first date so it will show 2023 for janurary
    const x0 = d3.min(data, d => d.time) - 1000 * 60 * 60 * 24 * 8;
    const x1 = d3.max(data, d => d.time);

    x.domain([x0, x1]);
    y.domain(d3.extent(data, d => d.close));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.append('g')
      .attr('transform', `translate(${width},0)`)
      .call(d3.axisRight(y));

    svg.append('path')
      .datum(appleData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 3)
      .attr('d', line);

    svg.append('text')
      .attr('transform', `translate(100,${y(appleData[appleData.length - 1].close + 36)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .style('fill', 'steelblue')
      .text('APPLE');


    svg.append('path')
      .datum(amazonData)
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 3)
      .attr('d', line)
      .attr('name', 'amazon');


    svg.append('text')
      .attr('transform', `translate(100,${y(amazonData[amazonData.length - 1].close + 20)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .style('fill', 'green')
      .text('AMAZON');


    svg.append('path')
      .datum(goldData)
      .attr('fill', 'none')
      .attr('stroke', 'gold')
      .attr('stroke-width', 3)
      .attr('d', line);

    svg.append('text')
      .attr('transform', `translate(100,${y(goldData[goldData.length - 1].close + 20)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .style('fill', 'gold')
      .text('GOLD');

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .style("fill", "steelblue")
      .text("Closing Prices of Apple, Amazon, and Gold Over Time");
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Closing Price');

    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 15})`)
      .style('text-anchor', 'middle')
      .text('Time');

  }, [appleData, amazonData, goldData]);

  return (
    <div className="CombinedLineChart" ref={ref} />
  );
};

export default CombinedLineChart;
