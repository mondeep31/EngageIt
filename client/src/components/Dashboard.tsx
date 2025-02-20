import PageHeading from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Users,
  Activity,
  UserCheck,
  AlertTriangle,
  CalendarCheck,
  Search,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "./custom/tables/data-table";

// Mock data interfaces
interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  engagementScore: number;
  retentionCategory: "High" | "Medium" | "Low";
  totalSessions: number;
  averageSessionTime: string;
}

interface Metrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageEngagementScore: number;
  retentionRate: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    lastLogin: "2025-02-20",
    engagementScore: 85,
    retentionCategory: "High",
    totalSessions: 45,
    averageSessionTime: "25m",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    lastLogin: "2025-02-19",
    engagementScore: 65,
    retentionCategory: "Medium",
    totalSessions: 32,
    averageSessionTime: "18m",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    lastLogin: "2025-02-15",
    engagementScore: 45,
    retentionCategory: "Low",
    totalSessions: 12,
    averageSessionTime: "8m",
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice@example.com",
    lastLogin: "2025-02-20",
    engagementScore: 92,
    retentionCategory: "High",
    totalSessions: 56,
    averageSessionTime: "32m",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    lastLogin: "2025-02-18",
    engagementScore: 78,
    retentionCategory: "High",
    totalSessions: 38,
    averageSessionTime: "22m",
  },
  {
    id: "6",
    name: "Emma Davis",
    email: "emma@example.com",
    lastLogin: "2025-02-17",
    engagementScore: 58,
    retentionCategory: "Medium",
    totalSessions: 25,
    averageSessionTime: "15m",
  },
  {
    id: "7",
    name: "David Lee",
    email: "david@example.com",
    lastLogin: "2025-02-16",
    engagementScore: 35,
    retentionCategory: "Low",
    totalSessions: 8,
    averageSessionTime: "5m",
  },
  {
    id: "8",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    lastLogin: "2025-02-20",
    engagementScore: 88,
    retentionCategory: "High",
    totalSessions: 42,
    averageSessionTime: "28m",
  }
];

const mockMetrics: Metrics = {
  dailyActiveUsers: 1250,
  weeklyActiveUsers: 5600,
  monthlyActiveUsers: 15000,
  averageEngagementScore: 76,
  retentionRate: 85,
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [retentionFilter, setRetentionFilter] = useState<string>("all");

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
    },
    {
      accessorKey: "totalSessions",
      header: "Total Sessions",
    },
    {
      accessorKey: "averageSessionTime",
      header: "Avg. Session Time",
    },
    {
      accessorKey: "engagementScore",
      header: "Engagement Score",
      cell: ({ row }: any) => {
        const score = row.original.engagementScore;
        let variant: "success" | "pending" | "danger" = "danger";
        if (score > 70) variant = "success";
        else if (score > 50) variant = "pending";
        
        return (
          <div className="flex justify-center">
            <Badge 
              variant={variant}
              size="small"
              className="min-w-[60px] text-center text-black"
            >
              {score}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "retentionCategory",
      header: "Retention Category",
      cell: ({ row }: any) => {
        const category = row.original.retentionCategory;
        let variant: "success" | "pending" | "danger" = "danger";
        switch (category) {
          case "High":
            variant = "success";
            break;
          case "Medium":
            variant = "pending";
            break;
        }
        
        return (
          <div className="flex justify-center">
            <Badge 
              variant={variant}
              size="small"
              className="min-w-[80px] text-center text-black"
            >
              {category}
            </Badge>
          </div>
        );
      },
    },
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRetention = 
      retentionFilter === "all" || 
      user.retentionCategory.toLowerCase() === retentionFilter.toLowerCase();
    return matchesSearch && matchesRetention;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col gap-6 p-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <PageHeading heading="Customer Engagement Dashboard" />
          <p className="text-muted-foreground">
            Monitor user activity, engagement metrics, and retention insights
          </p>
        </div>

        {/* Visualization Chart Area */}
        <Card className="bg-white p-6 shadow-sm">
          <div className="h-[400px] w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50">
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-gray-500">Visualization Chart Area</p>
            </div>
          </div>
        </Card>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Daily Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.dailyActiveUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2.5% from yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.weeklyActiveUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+5.2% from last week</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Retention Rate</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.retentionRate}%</div>
              <p className="text-xs text-muted-foreground">+1.2% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Engagement Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.averageEngagementScore}</div>
              <p className="text-xs text-muted-foreground">+3.1% improvement</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* Main Content Area */}
          <div className="space-y-6 xl:col-span-3">
            {/* Filters */}
            <Card className="bg-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Select value={retentionFilter} onValueChange={setRetentionFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Retention Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="high">High Retention</SelectItem>
                        <SelectItem value="medium">Medium Retention</SelectItem>
                        <SelectItem value="low">Low Retention</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="min-w-[260px] justify-start text-left font-normal">
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="border-b border-gray-200 p-3">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Select Range</h4>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => {
                                  const today = new Date();
                                  setDateRange({
                                    from: today,
                                    to: addDays(today, 7),
                                  });
                                }}
                              >
                                Next 7 days
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => {
                                  const today = new Date();
                                  setDateRange({
                                    from: today,
                                    to: addDays(today, 30),
                                  });
                                }}
                              >
                                Next 30 days
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={(range: any) => {
                            if (range) {
                              setDateRange(range);
                            }
                          }}
                          numberOfMonths={2}
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Activity Table */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <DataTable
                    columns={columns}
                    data={filteredUsers}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Panel */}
          <Card className="h-fit bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="font-semibold text-red-600">Churn Risk Alert</h4>
                <p className="mt-2 text-sm text-gray-600">
                  5 users have shown decreased engagement in the last week. Consider sending personalized re-engagement emails.
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="font-semibold text-green-600">Feature Usage Insights</h4>
                <p className="mt-2 text-sm text-gray-600">
                  The "Analytics Dashboard" is our most-used feature (85% adoption), while "Custom Reports" shows lower engagement (35% adoption).
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="font-semibold text-blue-600">Retention Recommendations</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Consider offering a 20% discount to users with engagement scores below 50 to boost retention.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
