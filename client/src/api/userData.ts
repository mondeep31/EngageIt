import axios from "axios";
import { AIInsights, Metrics, User } from "@/types";

export const fetchUserData = async () => {
  const response = await axios.get("http://localhost:5005/api/user/getUsers");
  return response.data as {
    overviewMetrics: Metrics;
    users: User[];
    aiInsights: AIInsights;
  };
};