import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Chart = ({ data, stockSymbol, barColor }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const margin = { top: 10, right: 30, bottom: 80, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 550 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // parse time values into JavaScript Date objects
        data.forEach(d => {
            d.time = new Date(d.time);
        });

        const x = d3.scaleBand()
            .domain(data.map(d => d.time))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.close)])
            .range([height, 0]);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%Y-%m-%d'))
            )
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('dx', '-0.5em')
            .attr('dy', '0.5em');

        svg.append('g')
            .call(d3.axisLeft(y));

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.time))
            .attr('y', d => y(d.close))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.close))
            .attr('fill', barColor);

        svg.append('text')
            .attr('transform', `translate(${width / 2},${height + margin.top + 50})`)
            .style('text-anchor', 'middle')
            .text('Time');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Closing Price');

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2 - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .style("fill", "steelblue")
            .text(`Closing Prices of ${stockSymbol}`);
    }, [data]);

    return (
        <div className="CombinedLineChart" >
            <svg ref={svgRef}></svg>

        </div>
    );
};

export default Chart;
