"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ComposedChart, CartesianGrid, XAxis, YAxis, 
  Legend, Bar, Line, FunnelChart, Funnel, LabelList
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
const radarData = [
  { metric: "Speed", value: 120, benchmark: 100 },
  { metric: "Quality", value: 98, benchmark: 95 },
  { metric: "Service", value: 86, benchmark: 90 },
  { metric: "Support", value: 99, benchmark: 85 },
  { metric: "Cost", value: 85, benchmark: 88 },
];

const scatterData = [
  { satisfaction: 85, responseTime: 20, size: 100 },
  { satisfaction: 90, responseTime: 15, size: 150 },
  { satisfaction: 70, responseTime: 45, size: 80 },
  { satisfaction: 95, responseTime: 10, size: 200 },
  { satisfaction: 60, responseTime: 60, size: 60 },
  { satisfaction: 80, responseTime: 30, size: 120 },
];

const composedData = [
  { month: "Jan", revenue: 800, users: 400, growth: 15 },
  { month: "Feb", revenue: 967, users: 506, growth: 20 },
  { month: "Mar", revenue: 1098, users: 689, growth: 25 },
  { month: "Apr", revenue: 1200, users: 800, growth: 28 },
  { month: "May", revenue: 1108, users: 680, growth: 22 },
  { month: "Jun", revenue: 1200, users: 750, growth: 30 },
];

const funnelData = [
  { value: 100, name: "Visits", fill: "hsl(var(--chart-1))" },
  { value: 80, name: "Cart", fill: "hsl(var(--chart-2))" },
  { value: 50, name: "Checkout", fill: "hsl(var(--chart-3))" },
  { value: 30, name: "Purchase", fill: "var(--accent-color)" },
];

// Chart Configurations
const radarConfig = {
  value: {
    label: "Current",
    color: "var(--accent-color)",
  },
  benchmark: {
    label: "Benchmark",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const scatterConfig = {
  satisfaction: {
    label: "Customer Satisfaction",
    color: "var(--accent-color)",
  },
} satisfies ChartConfig;

const composedConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--accent-color)",
  },
  growth: {
    label: "Growth",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const funnelConfig = {
  value: {
    label: "Conversion Steps",
    color: "var(--accent-color)",
  },
} satisfies ChartConfig;

export function DashboardV2() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-[14px]">
      <Card className="h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Performance Matrix</CardTitle>
          <CardDescription>KPI Analysis</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={radarConfig}
            className="h-full w-full"
          >
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--accent-color)" />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar
                name="Current"
                dataKey="value"
                stroke="var(--accent-color)"
                fill="var(--accent-color)"
                fillOpacity={0.5}
              />
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.5}
              />
              <Legend />
            </RadarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Above benchmark in 4/5 metrics
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Exceeding performance goals
          </div>
        </CardFooter>
      </Card>

      <Card className="h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Customer Analysis</CardTitle>
          <CardDescription>Satisfaction Correlation</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={scatterConfig}
            className="h-full w-full"
          >
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="responseTime" name="Response Time" />
              <YAxis type="number" dataKey="satisfaction" name="Satisfaction" />
              <ChartTooltip content={<ChartTooltipContent />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Metrics"
                data={scatterData}
                fill="var(--accent-color)"
              />
              <Legend />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Quick response = High satisfaction
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Response time correlation
          </div>
        </CardFooter>
      </Card>

      <Card className="h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Composite Analysis</CardTitle>
          <CardDescription>Revenue Growth Trends</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={composedConfig}
            className="h-full w-full"
          >
            <ComposedChart data={composedData}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="revenue"
                barSize={20}
                fill="var(--accent-color)"
              />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
              <Legend />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            30% growth achieved
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Revenue growth correlation
          </div>
        </CardFooter>
      </Card>

      <Card className="col-span-full h-[320px]">
        <CardHeader className="min-h-[70px]">
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Sales Pipeline Stages</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer 
            config={funnelConfig}
            className="h-full w-full"
          >
            <FunnelChart>
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </Funnel>
            </FunnelChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            30% conversion rate
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Visit to purchase ratio
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}