import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "./custom/tables/data-table";
import { User } from "@/types";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const UserTable = ({ users }: { users: User[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [retentionFilter, setRetentionFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [userCache, setUserCache] = useState<Record<string, User>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Background loading of user details
  useEffect(() => {
    let isMounted = true;

    const loadUserDetails = async () => {
      for (const user of users) {
        if (!userCache[user.email]) {
          // Simulate loading delay to prevent overwhelming
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (isMounted) {
            setUserCache((prev) => ({
              ...prev,
              [user.email]: user,
            }));
          }
        }
      }
    };

    loadUserDetails();

    return () => {
      isMounted = false;
    };
  }, [users]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRetention =
      retentionFilter === "all" ||
      user.retentionCategory.toLowerCase() === retentionFilter.toLowerCase();

    const matchesDateRange =
      (!fromDate || new Date(user.last_login_date) >= fromDate) &&
      (!toDate || new Date(user.last_login_date) <= toDate);

    return matchesSearch && matchesRetention && matchesDateRange;
  });

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "last_login_date", header: "Last Login" },
    { accessorKey: "number_of_logins", header: "Total Logins" },
    { accessorKey: "number_of_features_used", header: "Features Used" },
    { accessorKey: "time_spent_on_platform", header: "Time Spent (min)" },
    {
      accessorKey: "engagementScore",
      header: "Engagement Score",
      cell: ({ row }: any) => {
        const score = row.original.engagementScore;
        let variant: "success" | "pending" | "danger" = "danger";
        if (score > 70) variant = "success";
        else if (score > 50) variant = "pending";

        return (
          <Badge
            variant={variant}
            className="min-w-[60px] text-center text-black"
          >
            {score}
          </Badge>
        );
      },
    },
    {
      accessorKey: "retentionCategory",
      header: "Retention Category",
      cell: ({ row }: any) => {
        const category = row.original.retentionCategory;
        let variant: "success" | "pending" | "danger" = "danger";
        if (category === "High") variant = "success";
        if (category === "Medium") variant = "pending";

        return (
          <Badge
            variant={variant}
            className="min-w-[80px] text-center text-black"
          >
            {category}
          </Badge>
        );
      },
    },
    {
      header: "View Details",
      cell: ({ row }: any) => (
        <Dialog
          open={isDialogOpen && activeUser?.email === row.original.email}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setActiveUser(null);
          }}
        >
          <DialogTrigger
            onClick={() => {
              setActiveUser(userCache[row.original.email] || row.original);
              setIsDialogOpen(true);
            }}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            View Details
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{row.original.name}'s Details</DialogTitle>
            </DialogHeader>
            {activeUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">Login Statistics</p>
                    <div className="text-sm space-y-1">
                      <p>Total Logins: {activeUser.number_of_logins}</p>
                      <p>Features Used: {activeUser.number_of_features_used}</p>
                      <p>
                        Time Spent: {activeUser.time_spent_on_platform} minutes
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Engagement Metrics</p>
                    <div className="text-sm space-y-1">
                      <p>Engagement Score: {activeUser.engagementScore}</p>
                      <p>Retention Category: {activeUser.retentionCategory}</p>
                      <p>Churn Risk: {activeUser.churnRisk ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Features Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {activeUser.features_used &&
                    activeUser.features_used.length > 0 ? (
                      activeUser.features_used.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No features used</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">AI Recommendation:</p>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {activeUser.aiRecommendation}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <div>
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

            <Popover>
              <PopoverTrigger className="border rounded px-3 py-2 flex items-center gap-2 pr-8">
                <CalendarIcon className="w-4 h-4" />
                {fromDate ? format(fromDate, "yyyy-MM-dd") : "From Date"}
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger className="border rounded px-3 py-2 flex items-center gap-2 pr-8">
                <CalendarIcon className="w-4 h-4" />
                {toDate ? format(toDate, "yyyy-MM-dd") : "To Date"}
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                />
              </PopoverContent>
            </Popover>
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
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm mt-4">
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredUsers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTable;
