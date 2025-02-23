import { useState, useEffect } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchProcessedData, getChurnRiskData } from "@/api/processedDataService";

const COLORS = ["#6366f1", "#e11d48"];

interface ChartData {
  name: string;
  value: number;
}

const PieChartComponent: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const processedData = await fetchProcessedData();
        const churnData = getChurnRiskData(processedData);
        const formattedData = [
          { name: "At Risk", value: churnData.atRisk },
          { name: "Not At Risk", value: churnData.notAtRisk }
        ];
        setChartData(formattedData);
      } catch (error) {
        console.error('Error loading churn risk data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
