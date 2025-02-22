import { generateAIRecommendation } from "./aiRecommend";


// Sample user data for testing
const testUser = {
    name: "Test User",
    features_used: ["Dashboard", "Reports", "Analytics"],
};

// Simple test function
async function testAIModel() {
    try {
        console.log("Testing AI Model...");
        
        const recommendation = await generateAIRecommendation(
            testUser,
            true, // churnRisk
            45    // engagementScore
        );
        
        console.log("\nAI Recommendation Result:");
        console.log("------------------------");
        console.log(recommendation);
        
    } catch (error) {
        console.error("Test failed:", error);
    }
}

// Run the test
testAIModel();