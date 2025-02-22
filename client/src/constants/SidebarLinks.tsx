import {
  IconBrandTabler,
  IconChartHistogram,
  IconUsers,
} from "@tabler/icons-react";

export const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "User Table",
    href: "/table",
    icon: (
      <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Charts and Graphs",
    href: "/charts",
    icon: (
      <IconChartHistogram className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];
