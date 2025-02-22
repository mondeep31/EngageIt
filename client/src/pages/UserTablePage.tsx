import { fetchUserData } from "@/api/userData";
import SidebarComp from "@/components/Sidebar";
import UserTable from "@/components/UserTable";
import { Metrics, User, AIInsights } from "@/types";
import { useEffect, useState } from "react";

const CACHE_KEY = "dashboard_data5";
const CACHE_EXPIRY = 50000 * 60 * 1000; // 50000 minutes

const UserTablePage = () => {
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
    <div className="flex h-screen">
      <SidebarComp />
      <div className="min-h-screen bg-gray-50/50 p-8 flex-1 overflow-y-auto">
        <UserTable users={data.users} />
      </div>
    </div>
  );
};

export default UserTablePage;
