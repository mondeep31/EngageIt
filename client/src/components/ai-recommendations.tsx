import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { AIInsights } from "@/types";

interface AIRecommendationsProps {
  aiInsights: AIInsights;
}

const AIRecommendations = ({ aiInsights }: AIRecommendationsProps) => {
  return (
    <Card className="h-fit bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{aiInsights.consolidatedRecommendations}</p>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
