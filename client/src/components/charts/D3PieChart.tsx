import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getChurnRiskData, ChurnRiskData } from "@/api/processedDataService";

const D3PieChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<ChurnRiskData[]>([]);

  useEffect(() => {
    getChurnRiskData().then((data) => setChartData(data));
  }, []);

  useEffect(() => {
    if (!chartData.length || !svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();
    const width = svgRef.current.clientWidth || 300;
    const height = 300;
    const radius = Math.min(width, height) / 2.5;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal<string>()
      .domain(chartData.map((d) => d.category))
      .range(["#ef4444", "#22c55e"]);

    const pie = d3.pie<ChurnRiskData>().value((d) => d.value);
    const arc = d3
      .arc<d3.PieArcDatum<ChurnRiskData>>()
      .innerRadius(0)
      .outerRadius(radius);

    svg
      .selectAll("path")
      .data(pie(chartData))
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d) => color(d.data.category))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    // ✅ Add Legend on the Right Side
    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove();
    const legendItems = legend
      .selectAll(".legend-item")
      .data(chartData)
      .enter()
      .append("div")
      .attr("class", "flex items-center space-x-2");

    legendItems
      .append("div")
      .style("width", "14px")
      .style("height", "14px")
      .style("background-color", (d) => color(d.category)!)
      .style("border-radius", "50%");

    legendItems
      .append("span")
      .text((d) => `${d.category} (${d.percentage.toFixed(1)}%)`);
  }, [chartData]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      {/* Pie Chart */}
      <svg ref={svgRef} className="w-2/3 h-full" />

      {/* Legend Positioned to the Right */}
      <div
        ref={legendRef}
        className="flex flex-col ml-auto mt-6 space-y-2 text-sm text-gray-700"
      ></div>
    </div>
  );
};

export default D3PieChart;
