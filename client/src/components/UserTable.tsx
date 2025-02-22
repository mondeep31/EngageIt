import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "./custom/tables/data-table";
import { User } from "@/types";

const UserTable = ({ users }: { users: User[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [retentionFilter, setRetentionFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRetention =
      retentionFilter === "all" ||
      user.retentionCategory.toLowerCase() === retentionFilter.toLowerCase();

    return matchesSearch && matchesRetention;
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
