import { Request, Response } from "express";
import User from "../models/User";
import { generateAIRecommendation, generateConsolidatedRecommendations } from "../utils/aiRecommend";


const WEIGHTS = {
    loginCount: 0.2,
    featuresUsed: 0.3,
    recency: 0.5
};



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
    return daysSinceLastLogin(lastLoginDate) > 30 || engagementScore < 40;
};


const determineRetentionCategory = (churnRisk: boolean, engagementScore: number): string => {
    if (churnRisk) return "Low";
    if (engagementScore > 70) return "High";
    return "Medium";
};





const calculateActiveUsers = (users: any[], days: number): number => {
    return users.filter(user => daysSinceLastLogin(user.last_login_date) <= days).length;
};


const calculateRetentionRate = (users: any[], period: number): number => {
    const returningUsers = users.filter(user => daysSinceLastLogin(user.last_login_date) <= period).length;
    return Math.round((returningUsers / users.length) * 100);
};


const getFeatureUsageStats = (users: any[]) => {
    let featureUsage: Record<string, number> = {};
    users.forEach(user => {
        user.features_used?.forEach((feature: string) => {
            featureUsage[feature] = (featureUsage[feature] || 0) + 1;
        });
    });

    const sortedFeatures = Object.entries(featureUsage).sort((a, b) => b[1] - a[1]);
    return {
        mostUsedFeatures: sortedFeatures.slice(0, 3).map(([feature]) => feature),
        underperformingFeatures: sortedFeatures.slice(-3).map(([feature]) => feature),
    };
};


export const getUsers = async (req: Request, res: Response) => {
    try {
        let users = await User.find();


        const processedUsers = await Promise.all(
            users.map(async (user) => {
                const engagementScore = calculateEngagementScore(user);
                const churnRisk = calculateChurnRisk(user.last_login_date, engagementScore);
                const retentionCategory = determineRetentionCategory(churnRisk, engagementScore);


                let aiRecommendation;
                try {
                    aiRecommendation = await generateAIRecommendation(user, churnRisk, engagementScore);
                } catch (err) {
                    console.error(" AI Recommendation Failed for user:", user.name, err);
                    aiRecommendation = "Default recommendation: Increase engagement activities.";
                }

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

        // Calculate the collective engagement score
        const collectiveEngagementScore = Math.round(processedUsers.reduce((total, user) => total + user.engagementScore, 0) / processedUsers.length);

        const overviewMetrics = {
            dailyActiveUsers: calculateActiveUsers(users, 1),
            weeklyActiveUsers: calculateActiveUsers(users, 7),
            monthlyActiveUsers: calculateActiveUsers(users, 30),
            retentionRate: calculateRetentionRate(users, 30),
            collectiveEngagementScore,
            churnPredictionList: processedUsers.filter(user => user.churnRisk)
        };

        const { mostUsedFeatures, underperformingFeatures } = getFeatureUsageStats(users);

        const consolidatedRecommendations = await generateConsolidatedRecommendations(
            processedUsers,
            mostUsedFeatures,
            underperformingFeatures
        );
        
        res.json({
            overviewMetrics,
            users: processedUsers,
            aiInsights: {
                mostUsedFeatures,
                underperformingFeatures,
                consolidatedRecommendations
            }
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
