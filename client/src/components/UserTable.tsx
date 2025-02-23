import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "./custom/tables/data-table";
import { User } from "@/types";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ITEMS_PER_PAGE = 10;

const UserTable = ({ users }: { users: User[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [retentionFilter, setRetentionFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [dialogStates, setDialogStates] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(0);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
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
  }, [users, searchTerm, retentionFilter, fromDate, toDate]);

  const handleViewDetails = (user: User) => {
    setActiveUser(user);
    setDialogStates(prev => ({
      ...prev,
      [user.email]: true
    }));
  };

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
      cell: ({ row }: any) => {
        const dialogId = `user-${row.original.id}-details`;
        const user = row.original;
        
        return (
          <Dialog
            open={dialogStates[user.email] || false}
            onOpenChange={(open) => {
              setDialogStates(prev => ({
                ...prev,
                [user.email]: open
              }));
              if (!open) {
                setActiveUser(null);
              }
            }}
          >
            <DialogTrigger
              onClick={() => handleViewDetails(user)}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              View Details
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl"
              aria-describedby={dialogId}
            >
              <DialogHeader>
                <DialogTitle>{user.name}'s Details</DialogTitle>
                <DialogDescription id={dialogId}>
                  Detailed information about {user.name}'s platform usage and engagement metrics.
                </DialogDescription>
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
        );
      },
    },
  ];

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const currentPageNumber = currentPage + 1;

    if (totalPages <= 5) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always add first page
      pageNumbers.push(1);

      // Add ellipsis or number after first page
      if (currentPageNumber <= 3) {
        pageNumbers.push(2, 3, 4, '...', totalPages);
      } else if (currentPageNumber >= totalPages - 2) {
        pageNumbers.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          '...',
          currentPageNumber - 1,
          currentPageNumber,
          currentPageNumber + 1,
          '...',
          totalPages
        );
      }
    }

    return pageNumbers;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="w-[200px]">
            <Select
              value={retentionFilter}
              onValueChange={setRetentionFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by retention" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[200px]">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {fromDate && toDate
                      ? `${format(fromDate, "MMM d")} - ${format(
                          toDate,
                          "MMM d"
                        )}`
                      : "Select dates"}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={{
                    from: fromDate,
                    to: toDate,
                  }}
                  onSelect={(range) => {
                    setFromDate(range?.from);
                    setToDate(range?.to);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DataTable columns={columns} data={filteredUsers.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)} />
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
          </div>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, idx) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-1 text-sm text-gray-700">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setCurrentPage(Number(pageNum) - 1)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === Number(pageNum) - 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;
