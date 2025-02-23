import axios from 'axios';

export interface ProcessedData {
  overviewMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    retentionRate: number;
    collectiveEngagementScore: number;
    churnPredictionList: Array<{
      id: number;
      name: string;
      email: string;
      last_login_date: string;
      number_of_logins: number;
      number_of_features_used: number;
      time_spent_on_platform: number;
      features_used: string[];
      engagementScore: number;
      retentionCategory: string;
      churnRisk: boolean;
      aiRecommendation: string;
    }>;
  };
}

export const fetchProcessedData = async (): Promise<ProcessedData> => {
  try {
    const response = await axios.get<ProcessedData>('/api/processed-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching processed data:', error);
    throw error;
  }
};

// Helper functions for charts
export const getEngagementScoreData = (data: ProcessedData) => {
  return data.overviewMetrics.churnPredictionList.map(user => ({
    id: user.id,
    name: user.name,
    engagementScore: user.engagementScore,
    features: user.number_of_features_used,
    logins: user.number_of_logins
  }));
};

export const getRetentionData = (data: ProcessedData) => {
  const categories = {
    High: 0,
    Medium: 0,
    Low: 0
  };
  
  data.overviewMetrics.churnPredictionList.forEach(user => {
    categories[user.retentionCategory as keyof typeof categories]++;
  });

  return Object.entries(categories).map(([category, count]) => ({
    category,
    count,
    percentage: (count / data.overviewMetrics.churnPredictionList.length) * 100
  }));
};

export const getFeatureUsageData = (data: ProcessedData) => {
  const featureUsage: Record<string, number> = {};
  
  data.overviewMetrics.churnPredictionList.forEach(user => {
    user.features_used.forEach(feature => {
      featureUsage[feature] = (featureUsage[feature] || 0) + 1;
    });
  });

  return Object.entries(featureUsage)
    .map(([feature, count]) => ({
      feature,
      count,
      percentage: (count / data.overviewMetrics.churnPredictionList.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
};

export const getActiveUsersData = (data: ProcessedData) => {
  const { dailyActiveUsers, weeklyActiveUsers, monthlyActiveUsers } = data.overviewMetrics;
  return [
    { period: 'Daily', users: dailyActiveUsers },
    { period: 'Weekly', users: weeklyActiveUsers },
    { period: 'Monthly', users: monthlyActiveUsers }
  ];
};

export const getChurnRiskData = (data: ProcessedData) => {
  const atRisk = data.overviewMetrics.churnPredictionList.filter(user => user.churnRisk).length;
  const total = data.overviewMetrics.churnPredictionList.length;
  
  return {
    atRisk,
    notAtRisk: total - atRisk,
    atRiskPercentage: (atRisk / total) * 100,
    notAtRiskPercentage: ((total - atRisk) / total) * 100
  };
};
