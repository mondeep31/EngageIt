import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  getRetentionData,
  RetentionCategory,
} from "@/api/processedDataService";

const D3HorizontalBarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [chartData, setChartData] = useState<RetentionCategory[]>([]);

  useEffect(() => {
    getRetentionData().then((data) => setChartData(data));
  }, []);

  useEffect(() => {
    if (!chartData.length || !svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 100, bottom: 30, left: 80 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.value) || 0])
      .range([0, width - margin.left - margin.right]);

    const y = d3
      .scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.name)!)
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", "#6366f1");

    svg
      .selectAll(".value-label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d) => y(d.name)! + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .style("font-size", "12px")
      .text((d) => d.value);
  }, [chartData]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default D3HorizontalBarChart;
