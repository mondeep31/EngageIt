import PageHeading from "@/components/layout/page-heading";
import D3HorizontalBarChart from "../components/charts/D3HorizontalBarChart";
import D3BarChart from "../components/charts/D3BarChart";
import D3LineChart from "../components/charts/D3LineChart";
import D3PieChart from "../components/charts/D3PieChart";

const ChartContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="h-[300px] w-full">{children}</div>
  </div>
);

const Charts = () => (
  <div className="min-h-screen bg-gray-50/50 p-8">
    <div className="relative mb-8">
      <PageHeading heading="Analytics Dashboard" />
      <span className="absolute -left-4 -right-4 -top-8 -z-[1]">
        <img
          src="/images/home-bg.png"
          width={1180}
          height={200}
          alt="home-bg"
          className="h-52 w-full xl:h-auto"
        />
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartContainer title="Feature Usage Statistics">
        <D3BarChart />
      </ChartContainer>

      <ChartContainer title="Active Users Trend">
        <D3LineChart />
      </ChartContainer>

      <ChartContainer title="Churn Risk Distribution">
        <D3PieChart />
      </ChartContainer>

      <ChartContainer title="Retention Categories">
        <D3HorizontalBarChart />
      </ChartContainer>
    </div>
  </div>
);

export default Charts;
