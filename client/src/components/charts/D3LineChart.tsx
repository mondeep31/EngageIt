import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  getActiveUsersData,
  ActiveUsersTrend,
} from "@/api/processedDataService";

const D3LineChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [chartData, setChartData] = useState<ActiveUsersTrend[]>([]);

  useEffect(() => {
    getActiveUsersData().then((data) => setChartData(data));
  }, []);

  useEffect(() => {
    if (!chartData.length || !svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();
    const width = svgRef.current.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scalePoint()
      .domain(chartData.map((d) => d.period))
      .range([0, width - margin.left - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.users) || 0])
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    const line = d3
      .line<ActiveUsersTrend>()
      .x((d) => x(d.period)!)
      .y((d) => y(d.users))
      .curve(d3.curveMonotoneX);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 3)
      .attr("d", line as any);
  }, [chartData]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default D3LineChart;
