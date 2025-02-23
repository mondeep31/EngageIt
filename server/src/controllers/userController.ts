import { Request, Response } from "express";
import User from "../models/User";
import path from 'path';
import fs from 'fs';

const WEIGHTS = {
    loginCount: 0.2,
    featuresUsed: 0.3,
    recency: 0.5
};

// Load pre-processed data
let processedData: any;
try {
    const processedDataPath = path.join(__dirname, '..', 'data', 'processedData.json');

    const rawData = fs.readFileSync(processedDataPath, 'utf-8');
    processedData = JSON.parse(rawData);
    if (!processedData || !processedData.overviewMetrics || !processedData.overviewMetrics.churnPredictionList) {
        console.error('Invalid processed data format:', processedData);
        processedData = { overviewMetrics: { churnPredictionList: [] } };
    }
} catch (error) {
    console.error('Error loading processed data:', error);
    processedData = { overviewMetrics: { churnPredictionList: [] } };
}

const daysSinceLastLogin = (lastLoginDate: Date): number => {
    const today = new Date();
    const lastLogin = new Date(lastLoginDate);
    return Math.ceil((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
};

const calculateEngagementScore = (user: any): number => {
    const recencyScore = 1 / (1 + daysSinceLastLogin(user.last_login_date));
    const engagementScore =
        (user.number_of_logins * WEIGHTS.loginCount) +
        (user.number_of_features_used * WEIGHTS.featuresUsed) +
        (recencyScore * WEIGHTS.recency);

    return Math.min(100, Math.max(0, Math.round(engagementScore)));
};

const calculateChurnRisk = (lastLoginDate: Date, engagementScore: number): boolean => {
    return daysSinceLastLogin(lastLoginDate) > 30 && engagementScore < 40;
};

const determineRetentionCategory = (churnRisk: boolean, engagementScore: number): string => {
    if (engagementScore > 70) return "High";
    if (engagementScore > 40) return "Medium";
    return "Low";
};
const calculateActiveUsers = (users: any[], days: number): number => {
    return users.filter(user => daysSinceLastLogin(user.last_login_date) <= days).length;
};

const calculateRetentionRate = (users: any[], period: number): number => {
    const activeUsers = calculateActiveUsers(users, period);
    return Math.round((activeUsers / users.length) * 100);
};

const getFeatureUsageStats = (users: any[]) => {
    const featureUsage: { [key: string]: number } = {};
    users.forEach(user => {
        user.features_used.forEach((feature: string) => {
            featureUsage[feature] = (featureUsage[feature] || 0) + 1;
        });
    });

    const sortedFeatures = Object.entries(featureUsage)
        .sort(([, a], [, b]) => b - a)
        .map(([feature]) => feature);

    return {
        mostUsedFeatures: sortedFeatures.slice(0, 3),
        underperformingFeatures: sortedFeatures.slice(-3)
    };
};

const findMatchingRecommendation = (user: any, churnRisk: boolean, engagementScore: number): string => {
    try {
        // Find matching user in processed data with stricter matching criteria
        const matchingUser = processedData.overviewMetrics.churnPredictionList.find((u: any) => {
            // Check if the user IDs match
            if (u.id === user.id) {
                return true;
            }

            // If no exact ID match, use stricter matching criteria
            const featureOverlap = u.features_used.filter((f: string) => 
                user.features_used.includes(f)
            ).length;
            
            const featureOverlapPercentage = featureOverlap / Math.max(u.features_used.length, user.features_used.length);
            
            return Math.abs(u.engagementScore - engagementScore) <= 3 && 
                   u.churnRisk === churnRisk &&
                   featureOverlapPercentage >= 0.7 &&  // At least 70% feature overlap
                   Math.abs(u.number_of_logins - user.number_of_logins) <= 5; // Similar login count
        });

        if (matchingUser) {
            return matchingUser.aiRecommendation;
        }
    } catch (error) {
        console.error('Error finding matching recommendation:', error);
    }

    // Provide a more specific default recommendation based on user metrics
    if (churnRisk) {
        return `We noticed your engagement has decreased. Try exploring these features: ${user.features_used.slice(0, 2).join(', ')}`;
    } else if (engagementScore > 70) {
        return `Great engagement! Consider trying advanced features to further enhance your experience.`;
    }
    return `Continue exploring our platform features to maximize your experience.`;
};

const findConsolidatedRecommendation = (mostUsedFeatures: string[], underperformingFeatures: string[]): string => {
    try {
        // Find a matching recommendation from processed data
        const matchingUser = processedData.overviewMetrics.churnPredictionList.find((user: any) => {
            return mostUsedFeatures.some(f => user.features_used.includes(f)) ||
                   underperformingFeatures.some(f => user.features_used.includes(f));
        });

        if (matchingUser) {
            return matchingUser.aiRecommendation;
        }
    } catch (error) {
        console.error('Error finding consolidated recommendation:', error);
    }

    return "Default consolidated recommendation: Focus on improving user engagement across all features.";
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        let users = await User.find();



        const processedUsers = await Promise.all(
            users.map(async (user) => {
                const engagementScore = calculateEngagementScore(user);
                const churnRisk = calculateChurnRisk(user.last_login_date, engagementScore);
                const retentionCategory = determineRetentionCategory(churnRisk, engagementScore);

                const aiRecommendation = findMatchingRecommendation(user, churnRisk, engagementScore);

                return {
                    ...user.toObject(),
                    number_of_logins: user.number_of_logins,
                    number_of_features_used: user.number_of_features_used,
                    time_spent_on_platform: user.time_spent_on_platform,
                    engagementScore,
                    retentionCategory,
                    churnRisk,
                    aiRecommendation,
                    last_login_date: user.last_login_date.toISOString().split("T")[0]
                };
            })
        );

        const collectiveEngagementScore = Math.round(processedUsers.reduce((total, user) => total + user.engagementScore, 0) / processedUsers.length);

        const overviewMetrics = {
            dailyActiveUsers: calculateActiveUsers(users, 1),
            weeklyActiveUsers: calculateActiveUsers(users, 7),
            monthlyActiveUsers: calculateActiveUsers(users, 30),
            retentionRate: calculateRetentionRate(users, 30),
            collectiveEngagementScore,
            churnPredictionList: processedUsers,
            totalUsers: users.length,
            activeUsers: calculateActiveUsers(users, 30),
            inactiveUsers: users.length - calculateActiveUsers(users, 30)
        };

        const { mostUsedFeatures, underperformingFeatures } = getFeatureUsageStats(users);

        const aiInsights = {
            mostUsedFeatures: ["Feature J", "Feature S", "Feature E"],
            underperformingFeatures: ["Feature R", "Feature M", "Feature C"],
            consolidatedRecommendations: "1. Enhance Underperforming Features: Focus on improving the user experience of Feature R, Feature M, and Feature C. Conduct user interviews or surveys to identify pain points and desired improvements. Allocate development resources to address these issues, potentially incorporating elements from the most used features (Feature J, Feature S, Feature E) to increase their appeal and usability. Aim for a targeted rollout of enhancements within the next quarter to regain user interest. 2. Implement Engagement Campaigns: Develop targeted engagement campaigns to re-engage the 293 users at risk. Utilize personalized email marketing or in-app notifications to highlight the benefits and updates of underperforming features. Introduce incentives such as exclusive access to new features or rewards for users who engage"
        };

        res.json({
            overviewMetrics,
            users: processedUsers,
            aiInsights
        });

    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
