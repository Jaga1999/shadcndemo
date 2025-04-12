"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, CartesianGrid, XAxis } from "recharts";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ModeToggle } from "@/components/mode-toggle";
import { AccentColorSwitcher } from "@/components/accent-color-switcher";
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
import { toastMessage } from "@/lib/utils";

// Define a TypeScript interface for a User
interface IUser {
  _id: string;
  name: string;
  email: string;
  username: string;
}

// Add pie chart data
const pieData = [
  { name: "Desktop", value: 850, color: "hsl(var(--chart-1))" },
  { name: "Tablet", value: 300, color: "hsl(var(--chart-2))" },
  { name: "Mobile", value: 430, color: "hsl(var(--chart-3))" }
];

// Add bar chart data for the third card
const barChartData = [
  { name: "Mon", value: 420 },
  { name: "Tue", value: 380 },
  { name: "Wed", value: 650 },
  { name: "Thu", value: 540 },
  { name: "Fri", value: 720 },
  { name: "Sat", value: 620 },
  { name: "Sun", value: 450 },
];

const barChartConfig = {
  value: {
    label: "Daily Traffic",
    color: "var(--accent-color)",
  },
} satisfies ChartConfig;

const areaChartData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 800 },
  { name: "Apr", total: 1600 },
  { name: "May", total: 900 },
  { name: "Jun", total: 1700 },
  { name: "Jul", total: 2200 },
];

const lineChartData = [
  { name: "Week 1", value: 400 },
  { name: "Week 2", value: 300 },
  { name: "Week 3", value: 500 },
  { name: "Week 4", value: 280 },
  { name: "Week 5", value: 590 },
  { name: "Week 6", value: 320 },
];

const areaChartConfig = {
  total: {
    label: "Total Revenue",
    color: "var(--accent-color)",
  },
} satisfies ChartConfig;

const lineChartConfig = {
  value: {
    label: "Weekly Trend",
    color: "var(--accent-color)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-2))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function Page() {
  const [users, setUsers] = useState<IUser[]>([]); // Specify the type of users as IUser[]
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        toastMessage("LogOut successful!");
        router.push("/login");
      } else {
        toastMessage("Logout failed. Please try again", "error");
      }
    } catch (err) {
      console.error("Error:", err);
      toastMessage("Logout failed. Please try again", "error");
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto relative flex items-center gap-4">
            <ModeToggle />
            <AccentColorSwitcher />
            <div onClick={togglePopup} className="cursor-pointer relative">
              <Avatar>
                <AvatarImage src="https://randomuser.me/api/portraits/men/75.jpg" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {isPopupOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10">
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card className="aspect-video">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly Revenue Trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={areaChartConfig} className="min-h-[200px] w-full">
                  <AreaChart data={areaChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="var(--accent-color)"
                      fill="var(--accent-color)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Revenue increased by 15% <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Monthly revenue performance
                </div>
              </CardFooter>
            </Card>
            <Card className="aspect-video">
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>User Access by Device Type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={pieChartConfig} className="min-h-[200px] w-full flex items-center justify-center">
                  <PieChart width={300} height={200}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Desktop dominates with 54% share
                </div>
                <div className="leading-none text-muted-foreground">
                  Distribution of users across different devices
                </div>
              </CardFooter>
            </Card>
            <Card className="aspect-video">
              <CardHeader>
                <CardTitle>Daily Traffic</CardTitle>
                <CardDescription>Visitors per Day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
                  <AreaChart data={barChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--accent-color)"
                      fill="var(--accent-color)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Highest traffic on Fridays <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Daily visitor traffic analysis
                </div>
              </CardFooter>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Detailed weekly trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="min-h-[300px] w-full">
                <LineChart data={lineChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--accent-color)"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "var(--accent-color)",
                      strokeWidth: 2,
                      stroke: "var(--accent-color)"
                    }}
                    activeDot={{
                      r: 6,
                      fill: "var(--accent-color)",
                      strokeWidth: 2,
                      stroke: "var(--accent-color)"
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Peak performance in Week 5 <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Weekly performance metrics with detailed trends
              </div>
            </CardFooter>
          </Card>
          <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min overflow-auto">
            {loading ? (
              <p>Loading...</p>
            ) : users.length > 0 ? (
              <Table className="border w-full h-full" style={{ borderColor: "var(--accent-color)" }}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}