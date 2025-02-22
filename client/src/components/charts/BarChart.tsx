import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import data from "@/data/getUsers.json";

interface ChartData {
  name: string;
  value: number;
}

const transformedData: ChartData[] = [
  { name: "DAU", value: data.overviewMetrics.dailyActiveUsers },
  { name: "WAU", value: data.overviewMetrics.weeklyActiveUsers },
  { name: "MAU", value: data.overviewMetrics.monthlyActiveUsers },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">{`${payload[0].value} users`}</p>
      </div>
    );
  }
  return null;
};

const BarChartComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={transformedData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis
        dataKey="name"
        tick={{ fill: "#666" }}
        axisLine={{ stroke: "#ccc" }}
      />
      <YAxis tick={{ fill: "#666" }} axisLine={{ stroke: "#ccc" }} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default BarChartComponent;
