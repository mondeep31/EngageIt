import PageHeading from "@/components/layout/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Download,
  Ellipsis,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import IconChart from "@/components/icons/icon-chart";
import IconGoalFlag from "@/components/icons/icon-goal-flag";
import IconTrophy from "@/components/icons/icon-trophy";
import IconFile from "@/components/icons/icon-file";
import { dashboardcolumns } from "./custom/tables/dashboard-columns";
import { DailySalesBarChart } from "./custom/charts/daily-sales-bar-chart";
import { DistributionRadialStackedChart } from "./custom/charts/distribution-radial-stacked-chart";
import { OnlineSalesAreaChart } from "./custom/charts/online-sales-area-chart";
import { RadarAreaChart } from "./custom/charts/radar-area-chart";
import { DataTable } from "./custom/tables/data-table";
import { data } from "@/constants/DashboardData";

const Dashboard = () => {
  const [date, setDate] = useState<Date>();
  const [mainDate, setMainDate] = useState<Date>();

  return (
    <div className="relative space-y-4 p-8">
      <PageHeading heading={"Dashboard"} />

      <span className="absolute -left-4 -right-4 -top-8 -z-[1]">
        <img
          src="/images/home-bg.png"
          width={1180}
          height={200}
          alt="home-bg"
          className="h-52 w-full xl:h-auto"
        />
      </span>

      <div className="min-h-[calc(100vh_-_160px)] w-full">
        <div className="flex flex-col gap-4 font-semibold xl:flex-row">
          <Card className="col-span-3 w-full grow shadow-none">
            <CardContent className="flex h-full grow flex-col">
              <div className="flex grow flex-col gap-5 p-5 sm:flex-row sm:justify-between">
                <div className="shrink-0 space-y-5 sm:space-y-12">
                  <div className="space-y-5">
                    <h2 className="text-base/5 text-black">Sales Overview</h2>
                    <p className="!mt-1.5 text-xs/tight font-medium">
                      10 March 2024 - 10 April 2024
                    </p>
                    <div className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-2 text-xs/tight text-black transition hover:bg-gray-200">
                      <CalendarCheck className="size-4 shrink-0" />
                      <Popover>
                        <PopoverTrigger>
                          {date ? (
                            format(date, "PP")
                          ) : (
                            <span>10 Mar, 2024</span>
                          )}{" "}
                        </PopoverTrigger>
                        <PopoverContent className="!w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <span>-</span>
                      <Popover>
                        <PopoverTrigger>
                          {mainDate ? (
                            format(mainDate, "PPP")
                          ) : (
                            <span>10 Apr, 2024 </span>
                          )}
                        </PopoverTrigger>
                        <PopoverContent className="!w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={mainDate}
                            onSelect={setMainDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-lg p-5">
                    <h3 className="text-[26px]/8 text-black">$75,485.57</h3>
                    <div className="flex items-center gap-2.5">
                      <Badge
                        variant={"green"}
                        size={"small"}
                        className="rounded-lg font-semibold"
                      >
                        <TrendingUp />
                        15.15%
                      </Badge>
                      <span className="text-xs/tight">+ $150.48 Increased</span>
                    </div>
                  </div>
                </div>
                <div className="m-auto grow">
                  <RadarAreaChart
                    cardContentClassName="max-h-[354px]"
                    isShowTitle={false}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-300 border-t border-gray-300 sm:grid-cols-4 sm:divide-y-0">
                <div className="space-y-5 bg-gradient-to-b from-success/[2%] to-success/0 px-4 py-6 sm:px-[18px] sm:py-8">
                  <IconChart />
                  <p className="leading-tight">Avg. monthly growing</p>
                  <p className="!mt-3 text-xl/6 text-black">5.24%</p>
                </div>
                <div className="space-y-5 !border-t-0 bg-gradient-to-b from-danger/[2%] to-danger/0 px-4 py-6 sm:px-[18px] sm:py-8">
                  <IconGoalFlag />
                  <p className="leading-tight">Rebalance accuracy</p>
                  <p className="!mt-3 text-xl/6 text-black">75%</p>
                </div>
                <div className="space-y-5 bg-gradient-to-b from-warning/[2%] to-warning/0 px-4 py-6 sm:px-[18px] sm:py-8">
                  <IconTrophy />
                  <p className="leading-tight">Portfolio score</p>
                  <p className="!mt-3 text-xl/6 text-black">
                    87
                    <span className="text-base/5 text-gray-600">/100</span>
                  </p>
                </div>
                <div className="space-y-5 bg-gradient-to-b from-primary/[2%] to-primary/0 px-4 py-6 sm:px-[18px] sm:py-8">
                  <IconFile />
                  <p className="leading-tight">Resilience index</p>
                  <p className="!mt-3 text-xl/6 text-black">0.45</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid shrink-0 gap-4 sm:grid-cols-2 xl:w-[372px] xl:grid-cols-1">
            <OnlineSalesAreaChart isShowTitle={false} />

            <DailySalesBarChart isShowTitle={true} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <div className="space-y-5 p-4 font-semibold xl:p-5">
              <div className="flex items-center justify-between">
                <h3 className="leading-tight">Total Sales</h3>
                <Popover>
                  <PopoverTrigger>
                    <Ellipsis className="size-4 text-black transition hover:text-gray" />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-auto space-y-1.5 p-1.5"
                  >
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Edit Report
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Mark as done
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
              <h4 className="text-xl/6 font-bold text-black">$15,140.00</h4>
              <div className="flex items-center gap-2.5">
                <Badge
                  variant={"green"}
                  size={"small"}
                  className="rounded-lg font-semibold"
                >
                  <TrendingUp />
                  78.88%
                </Badge>
                <span className="text-xs/tight">+ 26% Today</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-b-lg bg-gray-200 px-4 py-4 xl:px-5">
              <a
                href="#"
                className="font-semibold leading-tight hover:text-black"
              >
                View Report
              </a>
              <a href="#">
                <ArrowRight className="size-[18px] shrink-0 text-black hover:text-gray" />
              </a>
            </div>
          </Card>
          <Card>
            <div className="space-y-5 p-4 font-semibold xl:p-5">
              <div className="flex items-center justify-between">
                <h3 className="leading-tight">Total Orders</h3>
                <Popover>
                  <PopoverTrigger>
                    <Ellipsis className="size-4 text-black transition hover:text-gray" />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-auto space-y-1.5 p-1.5"
                  >
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Edit Report
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Mark as done
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
              <h4 className="text-xl/6 font-bold text-black">24,576</h4>
              <div className="flex items-center gap-2.5">
                <Badge
                  variant={"red"}
                  size={"small"}
                  className="rounded-lg font-semibold"
                >
                  <TrendingDown />
                  47.10%
                </Badge>
                <span className="text-xs/tight">- 15,145 Today</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-b-lg bg-gray-200 px-4 py-4 xl:px-5">
              <a
                href="#"
                className="font-semibold leading-tight hover:text-black"
              >
                View Report
              </a>
              <a href="#">
                <ArrowRight className="size-[18px] shrink-0 text-black hover:text-gray" />
              </a>
            </div>
          </Card>
          <Card>
            <div className="space-y-5 p-4 font-semibold xl:p-5">
              <div className="flex items-center justify-between">
                <h3 className="leading-tight">Visitor</h3>
                <Popover>
                  <PopoverTrigger>
                    <Ellipsis className="size-4 text-black transition hover:text-gray" />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-auto space-y-1.5 p-1.5"
                  >
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Edit Report
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Mark as done
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
              <h4 className="text-xl/6 font-bold text-black">10,140</h4>
              <div className="flex items-center gap-2.5">
                <Badge
                  variant={"green"}
                  size={"small"}
                  className="rounded-lg font-semibold"
                >
                  <TrendingUp />
                  2.15%
                </Badge>
                <span className="text-xs/tight">+ 1,040 Today</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-b-lg bg-gray-200 px-4 py-4 xl:px-5">
              <a
                href="#"
                className="font-semibold leading-tight hover:text-black"
              >
                View Report
              </a>
              <a href="#">
                <ArrowRight className="size-[18px] shrink-0 text-black hover:text-gray" />
              </a>
            </div>
          </Card>
          <Card>
            <div className="space-y-5 p-4 font-semibold xl:p-5">
              <div className="flex items-center justify-between">
                <h3 className="leading-tight">Refunded</h3>
                <Popover>
                  <PopoverTrigger>
                    <Ellipsis className="size-4 text-black transition hover:text-gray" />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-auto space-y-1.5 p-1.5"
                  >
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Edit Report
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Mark as done
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
              <h4 className="text-xl/6 font-bold text-black">1,240</h4>
              <div className="flex items-center gap-2.5">
                <Badge
                  variant={"green"}
                  size={"small"}
                  className="rounded-lg font-semibold"
                >
                  <TrendingUp />
                  11.40%
                </Badge>
                <span className="text-xs/tight">+ 540 Today</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-b-lg bg-gray-200 px-4 py-4 xl:px-5">
              <a
                href="#"
                className="font-semibold leading-tight hover:text-black"
              >
                View Report
              </a>
              <a href="#">
                <ArrowRight className="size-[18px] shrink-0 text-black hover:text-gray" />
              </a>
            </div>
          </Card>
        </div>
        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          <Card className="grow overflow-x-auto shadow-sm">
            <CardHeader className="flex items-center justify-between px-5 py-3.5">
              <h2 className="whitespace-nowrap text-base/5 font-semibold text-black">
                Order List
              </h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <div id="search-table" hidden></div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant={"outline-general"}>
                      Last 30 Days
                      <ChevronDown />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto space-y-1.5 p-1.5">
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      Last 6 month
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs/tight font-medium text-black hover:bg-light-theme"
                    >
                      1 year ago
                    </button>
                  </PopoverContent>
                </Popover>
                <Button type="button" variant={"outline-general"}>
                  <Download />
                  <span className="hidden sm:block">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={dashboardcolumns}
                data={data}
                filterField={"sales_id"}
                isRemovePagination={false}
              />
            </CardContent>
          </Card>

          <DistributionRadialStackedChart
            isShowTitle={false}
            className="bg-gradient-to-b from-gray-300 to-gray-300/0 md:w-[372px]"
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
