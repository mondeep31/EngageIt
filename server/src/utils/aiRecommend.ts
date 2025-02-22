// import dotenv from "dotenv";
// dotenv.config();

// const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
// const API_KEY = process.env.HUGGINGFACE_API_KEY;

// interface HuggingFaceSuccessResponse {
//     generated_text: string;
// }

// interface HuggingFaceErrorResponse {
//     error: string;
// }

// type HuggingFaceResponse = HuggingFaceSuccessResponse[] | HuggingFaceErrorResponse;

// export const generateConsolidatedRecommendations = async (
//     users: any[],
//     mostUsedFeatures: string[],
//     underperformingFeatures: string[]
// ): Promise<string> => {
//     try {
//         const prompt = `[INST] Platform Analytics Summary:
//     - Most Used Features: ${mostUsedFeatures.join(", ")}
//     - Underperforming Features: ${underperformingFeatures.join(", ")}
//     - Total Users: ${users.length}
//     - Users at Risk: ${users.filter(u => u.churnRisk).length}
//     - Average Engagement: ${users.reduce((acc, u) => acc + u.engagementScore, 0) / users.length}

//     Based on this platform-wide data, provide exactly 2 high-impact strategic recommendations to improve overall user engagement and retention. Be specific and concise. [/INST]`;

//         const response = await fetch(HUGGINGFACE_API_URL, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${API_KEY}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ 
//                 inputs: prompt,
//                 parameters: {
//                     max_new_tokens: 150,
//                     temperature: 0.7,
//                     top_p: 0.95,
//                     return_full_text: false
//                 }
//             })
//         });

//         const data = (await response.json()) as HuggingFaceResponse;

//         if ("error" in data) {
//             console.error(" Hugging Face API Error:", data.error);
//             return "AI service is currently unavailable. Please try again later.";
//         }

//         if (Array.isArray(data) && data.length > 0 && "generated_text" in data[0]) {
//             let text = data[0].generated_text;
//             text = text.replace(/\[INST\][\s\S]*?\[\/INST\]/, '');
//             text = text
//                 .replace(/\n+/g, ' ')
//                 .replace(/\s+/g, ' ')
//                 .trim();

//             return text;
//         }

//         return "No consolidated recommendations available.";
//     } catch (error) {
//         console.error(" API Request Failed:", error);
//         return "Error generating consolidated recommendations.";
//     }
// };


// export const generateAIRecommendation = async (user: any, churnRisk: boolean, engagementScore: number): Promise<string> => {
//     try {
//         const prompt = `[INST] User data:
//     - Name: ${user.name}
//     - Engagement Score: ${engagementScore}/100
//     - Features Used: ${user.features_used.join(", ")}
//     - Churn Risk: ${churnRisk ? "High" : "Low"}

//     Provide exactly 3 specific, high-impact actions to increase engagement. Be direct and concise. [/INST]`;

//         const response = await fetch(HUGGINGFACE_API_URL, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${API_KEY}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ 
//                 inputs: prompt,
//                 parameters: {
//                     max_new_tokens: 150,
//                     temperature: 0.7,
//                     top_p: 0.95,
//                     return_full_text: false
//                 }
//             })
//         });

//         const data = (await response.json()) as HuggingFaceResponse;

//         if ("error" in data) {
//             console.error(" Hugging Face API Error:", data.error);
//             return "AI service is currently unavailable. Please try again later.";
//         }

//         if (Array.isArray(data) && data.length > 0 && "generated_text" in data[0]) {
//             // extract the response without the prompt
//             let text = data[0].generated_text;
            
  
//             text = text.replace(/\[INST\][\s\S]*?\[\/INST\]/, '');
            
//             // Clean up the response
//             text = text
//                 .replace(/\n+/g, ' ')  // Replace newlines with spaces
//                 .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
//                 .trim();              // Remove leading/trailing spaces

//             return text;
//         }

//         return "No recommendation available.";
//     } catch (error) {
//         console.error(" API Request Failed:", error);
//         return "Error generating AI recommendation.";
//     }
// };


import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });
// console.log("Current env:", process.env.OPENAI_API_KEY);
const openai = new OpenAI({
    apiKey: "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"
});

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
        const prompt = `Platform Analytics Summary:
    - Most Used Features: ${mostUsedFeatures.join(", ")}
    - Underperforming Features: ${underperformingFeatures.join(", ")}
    - Total Users: ${users.length}
    - Users at Risk: ${users.filter(u => u.churnRisk).length}
    - Average Engagement: ${users.reduce((acc, u) => acc + u.engagementScore, 0) / users.length}

    Based on this platform-wide data, provide exactly 2 high-impact strategic recommendations to improve overall user engagement and retention. Be specific and concise.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a product analytics expert who provides clear, actionable recommendations based on user data. Your responses should be direct and specific."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
            top_p: 0.95
        });

        if (response.choices[0]?.message?.content) {
            return cleanAIResponse(response.choices[0].message.content);
        }

        return "No consolidated recommendations available.";
    } catch (error) {
        console.error("OpenAI API Request Failed:", error);
        return "Error generating consolidated recommendations.";
    }
};

export const generateAIRecommendation = async (
    user: any,
    churnRisk: boolean,
    engagementScore: number
): Promise<string> => {
    try {
        const prompt = `User data:
    - Name: ${user.name}
    - Engagement Score: ${engagementScore}/100
    - Features Used: ${user.features_used.join(", ")}
    - Churn Risk: ${churnRisk ? "High" : "Low"}

    Provide exactly 3 specific, high-impact actions to increase engagement. Be direct and concise.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a user engagement specialist who provides personalized, actionable recommendations. Your responses should be specific and implementable."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
            top_p: 0.95
        });

        if (response.choices[0]?.message?.content) {
            return cleanAIResponse(response.choices[0].message.content);
        }

        return "No recommendation available.";
    } catch (error) {
        console.error("OpenAI API Request Failed:", error);
        return "Error generating AI recommendation.";
    }
};