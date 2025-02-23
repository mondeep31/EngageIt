import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ClipboardList,
} from "lucide-react";
import { AIInsights } from "@/types";
import { Badge } from "@/components/ui/badge";

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
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Most Used Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {aiInsights.mostUsedFeatures.map((feature, index) => (
                <Badge key={index} variant="success" className="text-black">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Underperforming Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {aiInsights.underperformingFeatures.map((feature, index) => (
                <Badge key={index} variant="danger" className="text-black">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-amber-500" />
            Recommendations
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {aiInsights.consolidatedRecommendations}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
