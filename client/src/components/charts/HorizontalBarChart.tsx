// src/components/HorizontalBarChartComponent.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import data from "@/data/getUsers.json";

const transformedData = data.overviewMetrics.churnPredictionList.map(
  (user: { name: string; number_of_logins: number }) => ({
    name: user.name,
    value: user.number_of_logins,
  })
);

const HorizontalBarChartComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart layout="vertical" data={transformedData}>
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" />
      <Tooltip />
      <Bar dataKey="value" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);

export default HorizontalBarChartComponent;
