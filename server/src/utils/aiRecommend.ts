import fs from 'fs';
import path from 'path';

// Load the pre-processed data
const processedDataPath = path.join(__dirname, '../data/processedData.json');
const processedData = JSON.parse(fs.readFileSync(processedDataPath, 'utf-8'));

const cleanAIResponse = (text: string): string => {
    return text
        .replace(/\*\*/g, '') // Remove markdown bold
        .replace(/\n+/g, ' ') // Replace multiple newlines with single space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing whitespace
};

export const generateConsolidatedRecommendations = async (
    users: any[],
    mostUsedFeatures: string[],
    underperformingFeatures: string[]
): Promise<string> => {
    try { 
        // Find matching recommendations from processed data
        const matchingUsers = processedData.churnPredictionList.filter((user: any) => {
            const userFeatures = new Set(user.features_used);
            return mostUsedFeatures.some(f => userFeatures.has(f)) ||
                   underperformingFeatures.some(f => userFeatures.has(f));
        });

        if (matchingUsers.length > 0) {
            // Get the most relevant recommendation
            const recommendation = matchingUsers[0].aiRecommendation;
            return cleanAIResponse(recommendation);
        }

        return "No consolidated recommendations available for this combination of features.";
    } catch (error) {
        console.error("Error retrieving recommendation from processed data:", error);
        return "Error generating consolidated recommendations.";
    }
};

export const generateAIRecommendation = async (
    user: any,
    churnRisk: boolean,
    engagementScore: number
): Promise<string> => {
    try {
        // Find matching user in processed data
        const matchingUser = processedData.churnPredictionList.find((u: any) => {
            return u.name === user.name && 
                   Math.abs(u.engagementScore - engagementScore) <= 5 && // Allow small difference in engagement score
                   u.churnRisk === churnRisk;
        });

        if (matchingUser) {
            return cleanAIResponse(matchingUser.aiRecommendation);
        }

        // If no exact match, find similar user based on features and engagement score
        const similarUser = processedData.churnPredictionList.find((u: any) => {
            const userFeatures = new Set(user.features_used);
            const uFeatures = new Set(u.features_used);
            const commonFeatures = [...userFeatures].filter(f => uFeatures.has(f));
            return commonFeatures.length >= Math.min(2, user.features_used.length) && 
                   Math.abs(u.engagementScore - engagementScore) <= 10;
        });

        if (similarUser) {
            return cleanAIResponse(similarUser.aiRecommendation);
        }

        return "No personalized recommendation available for this user profile.";
    } catch (error) {
        console.error("Error retrieving recommendation from processed data:", error);
        return "Error generating AI recommendation.";
    }
};