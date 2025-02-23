import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchProcessedData, getActiveUsersData } from "@/api/processedDataService";

interface ChartData {
  period: string;
  users: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="font-medium">{label} Active Users</p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const LineChartComponent = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const processedData = await fetchProcessedData();
        const activeUsersData = getActiveUsersData(processedData);
        setChartData(activeUsersData);
        setError(null);
      } catch (error) {
        console.error('Error loading active users data:', error);
        setError('Failed to load active users data');
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
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="period"
          tick={{ fill: "#666" }}
          axisLine={{ stroke: "#ccc" }}
        />
        <YAxis
          tick={{ fill: "#666" }}
          axisLine={{ stroke: "#ccc" }}
          label={{ value: "Number of Users", angle: -90, position: "insideLeft", fill: "#666" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="users"
          name="Active Users"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: "#6366f1", strokeWidth: 2 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
