import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import data from "@/data/getUsers.json";

interface ChartData {
  name: string;
  value: number;
}

const transformedData: ChartData[] = [
  { name: "Retention Rate", value: data.overviewMetrics.retentionRate },
  {
    name: "Engagement Score",
    value: data.overviewMetrics.collectiveEngagementScore,
  },
];

const LineChartComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={transformedData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

export default LineChartComponent;
