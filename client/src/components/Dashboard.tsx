import PageHeading from "@/components/layout/page-heading";
import { useEffect, useState } from "react";
import { AIInsights, Metrics, User } from "@/types";
import { fetchUserData } from "@/api/userData";
import VisualizationChart from "@/components/VisualizationChart";
import MetricsOverview from "@/components/MetricOverview";
import UserTable from "@/components/UserTable";
import AIRecommendations from "./ai-recommendations";

const CACHE_KEY = "dashboard_data_cache7";
const CACHE_EXPIRY = 50000 * 60 * 1000; //5 mins

const Dashboard = () => {
  const [data, setData] = useState<{
    overviewMetrics: Metrics;
    users: User[];
    aiInsights: AIInsights;
  } | null>(null);

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const isFresh =
        new Date().getTime() - parsedData.timestamp < CACHE_EXPIRY;
      if (isFresh) {
        setData(parsedData.data);
        return;
      }
    }

    fetchUserData().then((data) => {
      setData(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: new Date().getTime() })
      );
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <PageHeading heading="Customer Engagement Dashboard" />
      <span className="absolute -left-4 -right-4 -top-8 -z-[1]">
        <img
          src="/images/home-bg.png"
          width={1180}
          height={200}
          alt="home-bg"
          className="h-52 w-full xl:h-auto"
        />
      </span>
      <div className="flex flex-col gap-6">
        <VisualizationChart />

        <MetricsOverview overviewMetrics={data.overviewMetrics} />
        <AIRecommendations aiInsights={data.aiInsights} />
        <UserTable users={data.users} />
      </div>
    </div>
  );
};

export default Dashboard;
