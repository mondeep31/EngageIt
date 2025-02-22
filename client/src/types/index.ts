export interface User {
    _id: string;
    id: number;
    name: string;
    email: string;
    last_login_date: string;
    number_of_logins: number;
    number_of_features_used: number;
    time_spent_on_platform: number;
    engagementScore: number;
    retentionCategory: "High" | "Medium" | "Low";
    churnRisk: boolean;
    aiRecommendation: string;
  }
  
export  interface Metrics {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    retentionRate: number;
  }
  
export interface AIInsights {
    mostUsedFeatures: string[];
    underperformingFeatures: string[];
    consolidatedRecommendations: string;
  }