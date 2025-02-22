import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import data from "@/data/getUsers.json";

const transformedData = data.overviewMetrics.churnPredictionList.map(
  (user: { name: string; engagementScore: number }) => ({
    name: user.name,
    value: user.engagementScore,
  })
);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={transformedData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
      >
        {transformedData.map((_, index: number) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export default PieChartComponent;
