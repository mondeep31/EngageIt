import BarChartComponent from "../components/charts/BarChart";
import HorizontalBarChartComponent from "../components/charts/HorizontalBarChart";
import LineChartComponent from "../components/charts/LineChart";
import PieChartComponent from "../components/charts/PieChart";
import ScatterPlotComponent from "../components/charts/ScatterPlot";

const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="flex-1">{children}</div>
  </div>
);

const Charts = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-bold mb-6 text-gray-900">
      Analytics Dashboard
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartContainer title="User Activity Metrics (DAU/WAU/MAU)">
        <BarChartComponent />
      </ChartContainer>

      <ChartContainer title="Key Performance Indicators">
        <LineChartComponent />
      </ChartContainer>

      <ChartContainer title="User Engagement Distribution">
        <PieChartComponent />
      </ChartContainer>

      <ChartContainer title="Login Frequency by User">
        <HorizontalBarChartComponent />
      </ChartContainer>

      <ChartContainer title="Login vs Engagement Correlation">
        <ScatterPlotComponent />
      </ChartContainer>
    </div>
  </div>
);

export default Charts;
