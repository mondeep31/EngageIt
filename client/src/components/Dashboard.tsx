import PageHeading from "@/components/layout/page-heading";
import { useEffect, useState } from "react";
import { AIInsights, Metrics, User } from "@/types";
import { fetchUserData } from "@/api/userData";
import VisualizationChart from "@/components/VisualizationChart";
import MetricsOverview from "@/components/MetricOverview";
import UserTable from "@/components/UserTable";

const Dashboard = () => {
  const [data, setData] = useState<{
    overviewMetrics: Metrics;
    users: User[];
    aiInsights: AIInsights;
  } | null>(null);

  useEffect(() => {
    fetchUserData().then((data) => {
      setData(data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <PageHeading heading="Customer Engagement Dashboard" />
      <VisualizationChart />
      <MetricsOverview overviewMetrics={data.overviewMetrics} />
      <UserTable users={data.users} />
    </div>
  );
};

export default Dashboard;
