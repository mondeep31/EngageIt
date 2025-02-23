import axios from "axios";

// Define the types properly
export interface User {
    id: string;
    features_used: string[];
    engagementScore: number;
    churnRisk: boolean;
    retentionCategory: "High" | "Medium" | "Low";
}

export interface FeatureUsage {
    feature: string;
    count: number;
    percentage: number;
}

export interface ActiveUsersTrend {
    period: string;
    users: number;
}

export interface ChurnRiskData {
    category: string;
    value: number;
    percentage: number;
}

export interface RetentionCategory {
    name: string;
    value: number;
    percentage: number;
}

export interface FeatureEngagement {
    feature: string;
    avgEngagement: number;
}

// Store data globally to avoid redundant API calls
let processedData: User[] | null = null;
let overviewMetrics: any = null;

// Fetch data from the backend (only once)
export const fetchProcessedUsers = async (): Promise<{ processedData: User[]; overviewMetrics: any }> => {
    if (processedData && overviewMetrics) return { processedData, overviewMetrics }; // Return cached data if available

    try {
        const response = await axios.get("http://localhost:5005/api/user/getUsers"); // Adjust URL if needed
        processedData = response.data.overviewMetrics.churnPredictionList as User[];
        overviewMetrics = response.data.overviewMetrics;
        return { processedData, overviewMetrics };
    } catch (error) {
        console.error("Error fetching processed users:", error);
        return { processedData: [], overviewMetrics: {} };
    }
};

// 📌 Feature Usage Statistics
export const getFeatureUsageData = async (): Promise<FeatureUsage[]> => {
    const { processedData } = await fetchProcessedUsers();
    const featureCounts: { [key: string]: number } = {};

    processedData.forEach((user: User) => {
        user.features_used.forEach((feature: string) => {
            featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        });
    });

    const totalUsage = Object.values(featureCounts).reduce((sum, count) => sum + count, 0);
    return Object.entries(featureCounts).map(([feature, count]) => ({
        feature,
        count,
        percentage: (count / totalUsage) * 100,
    })).sort((a, b) => b.count - a.count);
};

// 📌 Active Users Trend
export const getActiveUsersData = async (): Promise<ActiveUsersTrend[]> => {
    const { overviewMetrics } = await fetchProcessedUsers();

    return [
        { period: "Daily", users: overviewMetrics.dailyActiveUsers },
        { period: "Weekly", users: overviewMetrics.weeklyActiveUsers },
        { period: "Monthly", users: overviewMetrics.monthlyActiveUsers },
    ];
};

// 📌 Churn Risk Distribution (Fixed Type Issue)
export const getChurnRiskData = async (): Promise<ChurnRiskData[]> => {
    const { processedData } = await fetchProcessedUsers();

    const riskCount = processedData.reduce(
        (acc: { [key: string]: number }, user: User) => {
            acc[user.churnRisk ? "At Risk" : "Not at Risk"]++;
            return acc;
        },
        { "At Risk": 0, "Not at Risk": 0 }
    );

    const totalUsers = processedData.length;
    return Object.entries(riskCount).map(([category, value]) => ({
        category,
        value: Number(value), // ✅ Explicitly cast value to number
        percentage: (Number(value) / totalUsers) * 100,
    }));
};

// 📌 Retention Categories
export const getRetentionData = async (): Promise<RetentionCategory[]> => {
    const { processedData } = await fetchProcessedUsers();

    const retentionCounts = {
        High: processedData.filter((user: User) => user.retentionCategory === "High").length,
        Medium: processedData.filter((user: User) => user.retentionCategory === "Medium").length,
        Low: processedData.filter((user: User) => user.retentionCategory === "Low").length,
    };

    const totalUsers = processedData.length;
    return Object.entries(retentionCounts).map(([name, value]) => ({
        name,
        value: Number(value), // ✅ Explicitly cast value to number
        percentage: (Number(value) / totalUsers) * 100,
    }));
};

// 📌 Features vs Engagement Score
export const getFeaturesVsEngagement = async (): Promise<FeatureEngagement[]> => {
    const { processedData } = await fetchProcessedUsers();
    const featureEngagement: { [key: string]: number[] } = {};

    processedData.forEach((user: User) => {
        user.features_used.forEach((feature: string) => {
            if (!featureEngagement[feature]) featureEngagement[feature] = [];
            featureEngagement[feature].push(user.engagementScore);
        });
    });

    return Object.entries(featureEngagement).map(([feature, scores]) => ({
        feature,
        avgEngagement: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    }));
};
