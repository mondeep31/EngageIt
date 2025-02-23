// src/components/ScatterPlotComponent.tsx
import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchProcessedData, getEngagementScoreData } from "@/api/processedDataService";

interface ChartData {
  id: number;
  name: string;
  engagementScore: number;
  features: number;
  logins: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="font-medium">{data.name}</p>
        <p>Engagement Score: {data.engagementScore}</p>
        <p>Features Used: {data.features}</p>
        <p>Total Logins: {data.logins}</p>
      </div>
    );
  }
  return null;
};

const ScatterPlotComponent: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const processedData = await fetchProcessedData();
        const engagementData = getEngagementScoreData(processedData);
        setChartData(engagementData);
      } catch (error) {
        console.error('Error loading engagement score data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="features"
          name="Features Used"
          tick={{ fill: "#666" }}
          axisLine={{ stroke: "#ccc" }}
          label={{ value: "Features Used", position: "bottom", fill: "#666" }}
        />
        <YAxis
          dataKey="engagementScore"
          name="Engagement Score"
          tick={{ fill: "#666" }}
          axisLine={{ stroke: "#ccc" }}
          label={{ value: "Engagement Score", angle: -90, position: "left", fill: "#666" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Scatter
          name="User Engagement"
          data={chartData}
          fill="#6366f1"
          shape="circle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlotComponent;
