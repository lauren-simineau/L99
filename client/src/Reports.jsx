import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Reports.css';

function Reports() {
  const chartRef = useRef();

  useEffect(() => {
    axios.get('/api/report-data', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      const data = res.data;

      const margin = { top: 40, right: 30, bottom: 60, left: 70 };
      const width = 800 - margin.left - margin.right;
      const height = 450 - margin.top - margin.bottom;

      const svg = d3.select(chartRef.current);
      svg.selectAll('*').remove();

      const chart = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

      const color = d3.scaleOrdinal(d3.schemeBlues[5]);

      // Axes
      chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.6em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-40)");

      chart.append('g')
        .call(d3.axisLeft(y));

      // Bars
      chart.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.label))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', (d, i) => color(i));

      // Value labels
      chart.selectAll('text.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => x(d.label) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', '#111827')
        .text(d => `$${d.value}B`);

      // Axis Labels
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top + 50)
        .style('font-size', '16px')
        .text('Year');

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(20, ${height / 2 + margin.top}) rotate(-90)`)
        .style('font-size', '16px')
        .text('Market Size (USD Billion)');
    });
  }, []);

  return (
    <div className="reports-container">
      <h1 className="reports-title">AI Market Size (2022–2032)</h1>
      <svg ref={chartRef}></svg>
      <p className="reports-paragraph">
        This chart is sourced from the HatchWorksAI article and the data was provided by Precedence Research. This chart shows the global AI market is projected to grow from $454 billion in 2022 to over $2.57 trillion by 2032. This rapid growth reflects increasing investments and adoption across industries.
      </p>
    </div>
  );
}

export default Reports;
