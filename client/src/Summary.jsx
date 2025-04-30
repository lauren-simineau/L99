import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Summary.css';

function Summary() {
  const chartRef = useRef();

  useEffect(() => {
    axios.get('/api/summary-data', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      const data = res.data;
  
      const margin = { top: 50, right: 50, bottom: 60, left: 150 };
const width = 700 - margin.left - margin.right;
const height = 900 - margin.top - margin.bottom;  

  
      const svg = d3.select(chartRef.current);
      svg.selectAll('*').remove();


const legend = svg.append('g')
.attr('transform', `translate(${margin.left}, 10)`);

const legendData = [
{ label: 'Willing to Trust AI', color: '#0072B2' },
{ label: 'Willing to Accept AI', color: '#E69F00' }
];

legend.selectAll('rect')
.data(legendData)
.enter()
.append('rect')
.attr('x', (d, i) => i * 200)
.attr('width', 18)
.attr('height', 18)
.attr('fill', d => d.color);

legend.selectAll('text')
.data(legendData)
.enter()
.append('text')
.attr('x', (d, i) => i * 200 + 25)
.attr('y', 13)
.style('font-size', '13px')
.text(d => d.label);

  
      const chart = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      const subgroups = ['trust', 'accept'];
      const countries = data.map(d => d.country);
  
      const y0 = d3.scaleBand()
        .domain(countries)
        .range([0, height])
        .padding(0.2);
  
      const y1 = d3.scaleBand()
        .domain(subgroups)
        .range([0, y0.bandwidth()])
        .padding(0.05);
  
      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.trust, d.accept))])
        .nice()
        .range([0, width]);
  
        const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#0072B2', '#E69F00']);  // trust = blue, accept = orange
      
  
      // Axes
      chart.append('g').call(d3.axisLeft(y0));
      chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));
  
      // Bars
      chart.selectAll('g.bar-group')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', d => `translate(0,${y0(d.country)})`)
        .selectAll('rect')
        .data(d => subgroups.map(key => ({ key, value: d[key] })))
        .enter()
        .append('rect')
        .attr('y', d => y1(d.key))
        .attr('x', 0)
        .attr('height', y1.bandwidth())
        .attr('width', d => x(d.value))
        .attr('fill', d => color(d.key));
  
      // Labels
      // Add value labels at the end of each bar
chart.selectAll('g.bar-group')
.data(data)
.enter()
.append('g')
.attr('transform', d => `translate(0, ${y0(d.country)})`)
.selectAll('text.bar-label')
.data(d => subgroups.map(key => ({
  key,
  value: d[key],
  yOffset: y1(key),
})))
.enter()
.append('text')
.attr('class', 'bar-label')
.attr('x', d => x(d.value) + 5)
.attr('y', d => d.yOffset + y1.bandwidth() / 2 + 4)
.attr('text-anchor', 'start')
.style('font-size', '11px')
.style('fill', '#111827')
.text(d => `${d.value}%`);

      // X-axis label
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top + 40)
        .style('font-size', '18px')
        .text('Percent');
  
      // Y-axis label
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(20, ${height / 2 + margin.top}) rotate(-90)`)
        .style('font-size', '18px')
        .text('Country');
    });
  }, []);
  

  return (
    <div className="summary-container">
      <h1 className="summary-title">AI Reputability Percentage by Country</h1>
      <svg ref={chartRef}></svg>
      <p className="summary-paragraph">
      This chart data is sourced from the HatchWorksAI article and compares the willingness of individuals across 17 countries to trust and accept AI systems. Each country is represented by two horizontal bars: one for the percentage of people willing to trust AI, and another for those willing to accept its use. The data reveals significant regional differences, with countries like India and China showing high acceptance and trust levels, while nations like Japan, Finland, and the Netherlands report much lower percentages. The chart highlights global disparities in public perception of AI technologies and underscores the need for culturally aware strategies to foster trust in AI-driven systems.</p>
    </div>
  );
}

export default Summary;
