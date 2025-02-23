import { useState, useEffect } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchProcessedData, getFeatureUsageData } from "@/api/processedDataService";

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="font-medium">{label}</p>
        <p>Usage Count: {payload[0].value}</p>
        <p>Usage Rate: {payload[0].payload.percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const BarChartComponent: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const processedData = await fetchProcessedData();
        const featureData = getFeatureUsageData(processedData);
        const formattedData = featureData.slice(0, 10).map(item => ({
          name: item.feature,
          value: item.count,
          percentage: item.percentage
        }));
        setChartData(formattedData);
        setError(null);
      } catch (error) {
        console.error('Error loading feature usage data:', error);
        setError('Failed to load feature usage data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[300px]">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-[300px] text-red-500">{error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#666" }}
          axisLine={{ stroke: "#ccc" }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fill: "#666" }}
          axisLine={{ stroke: "#ccc" }}
          label={{ value: "Usage Count", angle: -90, position: "insideLeft", fill: "#666" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="value"
          fill="#6366f1"
          radius={[4, 4, 0, 0]}
          name="Feature Usage"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
