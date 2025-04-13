"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  CartesianGrid, XAxis, YAxis, Legend, Treemap
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Chart Data
const areaData = [
  { month: "Jan", sales: 4000, profit: 2400 },
  { month: "Feb", sales: 3000, profit: 1398 },
  { month: "Mar", sales: 2000, profit: 9800 },
  { month: "Apr", sales: 2780, profit: 3908 },
  { month: "May", sales: 1890, profit: 4800 },
  { month: "Jun", sales: 2390, profit: 3800 },
];

const barData = [
  { category: "Electronics", sales: 4000, target: 3000 },
  { category: "Clothing", sales: 3000, target: 2800 },
  { category: "Books", sales: 2000, target: 2500 },
  { category: "Home", sales: 2780, target: 2600 },
  { category: "Sports", sales: 1890, target: 2000 },
];

const lineData = [
  { day: "Mon", traffic: 2400, users: 1200 },
  { day: "Tue", traffic: 1398, users: 900 },
  { day: "Wed", traffic: 9800, users: 1800 },
  { day: "Thu", traffic: 3908, users: 1400 },
  { day: "Fri", traffic: 4800, users: 2000 },
  { day: "Sat", traffic: 3800, users: 1700 },
  { day: "Sun", traffic: 4300, users: 1600 },
];

const treemapData = [
  {
    name: "Market Share",
    children: [
      { name: "Mobile", size: 4000, color: "var(--accent-color)" },
      { name: "Desktop", size: 3000, color: "hsl(var(--chart-2))" },
      { name: "Tablet", size: 2000, color: "hsl(var(--chart-3))" },
      { name: "Others", size: 1000, color: "hsl(var(--chart-4))" },
    ],
  },
];

// Chart Configurations
const areaConfig = {
  sales: {
    label: "Sales",
    color: "var(--accent-color)",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const barConfig = {
  sales: {
    label: "Actual Sales",
    color: "var(--accent-color)",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const lineConfig = {
  traffic: {
    label: "Traffic",
    color: "var(--accent-color)",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const treemapConfig = {
  value: {
    label: "Market Distribution",
    color: "var(--accent-color)",
  },
} satisfies ChartConfig;

export function DashboardV1() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Sales Trends</CardTitle>
          <CardDescription>Monthly Sales Overview</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={areaConfig}
            className="h-full w-full"
          >
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="sales"
                stackId="1"
                stroke="var(--accent-color)"
                fill="var(--accent-color)"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="2"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.3}
              />
              <Legend />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            20% growth in sales
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Month over month improvement
          </div>
        </CardFooter>
      </Card>

      <Card className="h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Sales vs Target</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={barConfig}
            className="h-full w-full"
          >
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="sales"
                fill="var(--accent-color)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="target"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
              />
              <Legend />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Electronics exceeds target
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Best performing category
          </div>
        </CardFooter>
      </Card>

      <Card className="h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Weekly Metrics</CardTitle>
          <CardDescription>Traffic and Users</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={lineConfig}
            className="h-full w-full"
          >
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="traffic"
                stroke="var(--accent-color)"
                strokeWidth={2}
                dot={{ fill: "var(--accent-color)" }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
              <Legend />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Highest user engagement
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Peak traffic on Wednesday
          </div>
        </CardFooter>
      </Card>

      <Card className="col-span-full h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Market Distribution</CardTitle>
          <CardDescription>Platform Usage Share</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={treemapConfig}
            className="h-full w-full"
          >
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
            >
              <ChartTooltip content={<ChartTooltipContent />} />
            </Treemap>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Mobile leads at 40%
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Highest platform share
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}