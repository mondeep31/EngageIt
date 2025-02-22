import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, CalendarCheck, UserCheck } from "lucide-react";
import { Metrics } from "@/types";

const MetricsOverview = ({ overviewMetrics }: { overviewMetrics: Metrics }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-4">
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Daily Active Users
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overviewMetrics.dailyActiveUsers.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+2.5% from yesterday</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Active Users
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overviewMetrics.weeklyActiveUsers.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+5.2% from last week</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Active Users
          </CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overviewMetrics.monthlyActiveUsers.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+8.1% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Retention Rate
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overviewMetrics.retentionRate}%
          </div>
          <p className="text-xs text-muted-foreground">+1.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOverview;
