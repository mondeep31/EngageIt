import dotenv from "dotenv";
dotenv.config();

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
const API_KEY = process.env.HUGGINGFACE_API_KEY;

interface HuggingFaceSuccessResponse {
    generated_text: string;
}

interface HuggingFaceErrorResponse {
    error: string;
}

type HuggingFaceResponse = HuggingFaceSuccessResponse[] | HuggingFaceErrorResponse;

export const generateAIRecommendation = async (user: any, churnRisk: boolean, engagementScore: number): Promise<string> => {
    try {
        const prompt = `[INST] User data:
- Name: ${user.name}
- Engagement Score: ${engagementScore}/100
- Features Used: ${user.features_used.join(", ")}
- Churn Risk: ${churnRisk ? "High" : "Low"}

Provide exactly 3 specific, high-impact actions to increase engagement. Be direct and concise. [/INST]`;

        const response = await fetch(HUGGINGFACE_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                inputs: prompt,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.7,
                    top_p: 0.95,
                    return_full_text: false
                }
            })
        });

        const data = (await response.json()) as HuggingFaceResponse;

        if ("error" in data) {
            console.error("❌ Hugging Face API Error:", data.error);
            return "AI service is currently unavailable. Please try again later.";
        }

        if (Array.isArray(data) && data.length > 0 && "generated_text" in data[0]) {
            // Extract only the generated response, removing the prompt
            let text = data[0].generated_text;
            
            // Remove the instruction tags and prompt using a more compatible regex
            text = text.replace(/\[INST\][\s\S]*?\[\/INST\]/, '');
            
            // Clean up the response
            text = text
                .replace(/\n+/g, ' ')  // Replace newlines with spaces
                .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                .trim();              // Remove leading/trailing spaces

            return text;
        }

        return "No recommendation available.";
    } catch (error) {
        console.error("❌ API Request Failed:", error);
        return "Error generating AI recommendation.";
    }
};