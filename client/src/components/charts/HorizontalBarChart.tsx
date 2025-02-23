// src/components/HorizontalBarChartComponent.tsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchProcessedData, getRetentionData } from "@/api/processedDataService";

interface ChartData {
  name: string;
  value: number;
}

const HorizontalBarChartComponent: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const processedData = await fetchProcessedData();
        const retentionData = getRetentionData(processedData);
        const formattedData = retentionData.map(item => ({
          name: item.category,
          value: item.count
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error('Error loading retention data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fill: "#666" }} axisLine={{ stroke: "#ccc" }} />
        <YAxis dataKey="name" type="category" tick={{ fill: "#666" }} axisLine={{ stroke: "#ccc" }} />
        <Tooltip />
        <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalBarChartComponent;
