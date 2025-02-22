// src/components/ScatterPlotComponent.tsx
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import data from "@/data/getUsers.json";

const transformedData = data.overviewMetrics.churnPredictionList.map(
  (user: { number_of_logins: number; engagementScore: number }) => ({
    x: user.number_of_logins,
    y: user.engagementScore,
  })
);

const ScatterPlotComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart>
      <XAxis type="number" dataKey="x" name="Logins" />
      <YAxis type="number" dataKey="y" name="Engagement Score" />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Scatter data={transformedData} fill="#8884d8" />
    </ScatterChart>
  </ResponsiveContainer>
);

export default ScatterPlotComponent;
