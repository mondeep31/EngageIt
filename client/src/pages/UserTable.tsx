import { fetchUserData } from "@/api/userData";
import SidebarComp from "@/components/Sidebar";
import UserTable from "@/components/UserTable";
import { Metrics, User, AIInsights } from "@/types";
import { useEffect, useState } from "react";

const UserTablePage = () => {
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
    <div className="flex h-screen">
      <SidebarComp />
      <div className="min-h-screen bg-gray-50/50 p-8 flex-1 overflow-y-auto">
        <UserTable users={data.users} />
      </div>
    </div>
  );
};

export default UserTablePage;
