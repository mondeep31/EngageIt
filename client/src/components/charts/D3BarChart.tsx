import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getFeatureUsageData, FeatureUsage } from "@/api/processedDataService";

const D3BarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [chartData, setChartData] = useState<FeatureUsage[]>([]);

  useEffect(() => {
    getFeatureUsageData().then((data) => setChartData(data.slice(0, 10)));
  }, []);

  useEffect(() => {
    if (!chartData.length || !svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();
    const width = svgRef.current.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.feature))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.count) || 0])
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.feature)!)
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.top - margin.bottom - y(d.count))
      .attr("fill", "#6366f1");
  }, [chartData]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default D3BarChart;
