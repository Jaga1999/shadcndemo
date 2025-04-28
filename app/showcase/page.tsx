"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  CartesianGrid, XAxis, YAxis, ComposedChart, ResponsiveContainer
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ModeToggle } from "@/components/mode-toggle";
import { AccentColorSwitcher } from "@/components/accent-color-switcher";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastMessage } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MOCK_TABLE_DATA = [
  { id: 1, name: "John Doe", role: "Developer", status: "Active", team: "Frontend", progress: 75 },
  { id: 2, name: "Jane Smith", role: "Designer", status: "In Meeting", team: "Design", progress: 63 },
  { id: 3, name: "Mike Johnson", role: "Manager", status: "Offline", team: "Management", progress: 89 },
  { id: 4, name: "Sarah Wilson", role: "Developer", status: "Active", team: "Backend", progress: 45 },
  { id: 5, name: "Tom Brown", role: "DevOps", status: "Active", team: "Operations", progress: 92 },
  { id: 6, name: "Emma Davis", role: "Designer", status: "In Meeting", team: "Design", progress: 58 },
  { id: 7, name: "James Miller", role: "Developer", status: "Active", team: "Frontend", progress: 71 },
  { id: 8, name: "Lisa Anderson", role: "Manager", status: "Offline", team: "Management", progress: 84 },
  { id: 9, name: "David Clark", role: "DevOps", status: "Active", team: "Operations", progress: 67 },
  { id: 10, name: "Amy White", role: "Developer", status: "Active", team: "Backend", progress: 95 },
];

interface SortConfig {
  key: keyof typeof MOCK_TABLE_DATA[0];
  direction: 'asc' | 'desc';
}

// Add sorting function
const sortData = (data: typeof MOCK_TABLE_DATA, sortConfig: SortConfig | null) => {
  if (!sortConfig) return data;
  
  return [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Separate the Table component into its own component
function DataTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleSort = (key: keyof typeof MOCK_TABLE_DATA[0]) => {
    setSortConfig((current) => {
      if (current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key: 'id', direction: 'asc' };
    });
  };

  const handleFilter = (filter: string) => {
    setActiveFilters(current => 
      current.includes(filter) 
        ? current.filter(f => f !== filter)
        : [...current, filter]
    );
  };

  const filteredData = MOCK_TABLE_DATA.filter(item => {
    if (activeFilters.length === 0) return true;
    if (activeFilters.includes('active') && item.status !== 'Active') return false;
    if (activeFilters.includes('developers') && item.role !== 'Developer') return false;
    if (activeFilters.includes('managers') && item.role !== 'Manager') return false;
    return true;
  });

  const sortedData = sortData(filteredData, sortConfig);

  const renderSortIcon = (columnKey: keyof typeof MOCK_TABLE_DATA[0]) => {
    return sortConfig.key === columnKey ? (
      sortConfig.direction === 'asc' ? (
        <SortAsc className="h-4 w-4" />
      ) : (
        <SortDesc className="h-4 w-4" />
      )
    ) : (
      <SortAsc className="h-4 w-4 text-muted-foreground/50" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFilters.length > 0 && (
                <span className="ml-2 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => handleFilter('active')}>
              <Checkbox 
                id="active" 
                className="mr-2" 
                checked={activeFilters.includes('active')}
              />
              <label htmlFor="active">Active Only</label>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter('developers')}>
              <Checkbox 
                id="developers" 
                className="mr-2" 
                checked={activeFilters.includes('developers')}
              />
              <label htmlFor="developers">Developers</label>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter('managers')}>
              <Checkbox 
                id="managers" 
                className="mr-2" 
                checked={activeFilters.includes('managers')}
              />
              <label htmlFor="managers">Managers</label>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[100px] cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-2">
                  <span>ID</span>
                  {renderSortIcon('id')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                  {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center space-x-2">
                  <span>Role</span>
                  {renderSortIcon('role')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('team')}
              >
                <div className="flex items-center space-x-2">
                  <span>Team</span>
                  {renderSortIcon('team')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Progress</span>
                  {renderSortIcon('progress')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    item.status === 'In Meeting' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                    {item.status}
                  </div>
                </TableCell>
                <TableCell>{item.team}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{item.progress}%</span>
                    <div className="w-16 h-2 rounded-full bg-secondary">
                      <div 
                        className="h-full rounded-full bg-primary" 
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const COMPONENTS = [
  {
    name: "Charts",
    description: "A collection of interactive and responsive chart components using Recharts.",
    example: (
      <Card>
        <CardHeader>
          <CardTitle>Charts Gallery</CardTitle>
          <CardDescription>Various chart types for data visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="area" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="area">Area Chart</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
              <TabsTrigger value="composed">Combined</TabsTrigger>
            </TabsList>
            <TabsContent value="area" className="h-[400px]">
              <div className="h-full">
                <ChartContainer config={{ area: { theme: { light: "#0ea5e9", dark: "#38bdf8" } } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[

                      { month: "Jan", value: 2400 },
                      { month: "Feb", value: 1398 },
                      { month: "Mar", value: 9800 },
                      { month: "Apr", value: 3908 },
                      { month: "May", value: 4800 },
                      { month: "Jun", value: 3800 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Area type="monotone" dataKey="value" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
            <TabsContent value="bar" className="h-[400px]">
              <div className="h-full">
                <ChartContainer config={{ bar: { theme: { light: "#84cc16", dark: "#a3e635" } } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { category: "A", value: 4000 },
                      { category: "B", value: 3000 },
                      { category: "C", value: 2000 },
                      { category: "D", value: 2780 },
                      { category: "E", value: 1890 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
            <TabsContent value="line" className="h-[400px]">
              <div className="h-full">
                <ChartContainer config={{ line: { theme: { light: "#f43f5e", dark: "#fb7185" } } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: "Page A", value: 4000 },
                      { name: "Page B", value: 3000 },
                      { name: "Page C", value: 2000 },
                      { name: "Page D", value: 2780 },
                      { name: "Page E", value: 1890 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Line type="monotone" dataKey="value" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
            <TabsContent value="composed" className="h-[400px]">
              <div className="h-full">
                <ChartContainer config={{ 
                  bar: { theme: { light: "#84cc16", dark: "#a3e635" } },
                  line: { theme: { light: "#f43f5e", dark: "#fb7185" } }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={[
                      { name: "Q1", value1: 4000, value2: 2400 },
                      { name: "Q2", value1: 3000, value2: 1398 },
                      { name: "Q3", value1: 2000, value2: 9800 },
                      { name: "Q4", value1: 2780, value2: 3908 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="value1" />
                      <Line type="monotone" dataKey="value2" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    ),
  },
  {
    name: "Table",
    description: "A modern, filterable and sortable table component with rich features.",
    example: <DataTable />,
  },
  {
    name: "Form",
    description: "A collection of form examples with different input methods and layouts.",
    example: (
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Enter your basic personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter your address" />
                </div>
                <Button type="submit" className="w-full">Save Personal Info</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>Customize your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme Preference</Label>
                  <RadioGroup defaultValue="light" className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Light Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Dark Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">System Default</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-4">
                  <Label>Notification Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notif">Email Notifications</Label>
                      <Switch id="email-notif" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing">Marketing Emails</Label>
                      <Switch id="marketing" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="updates">Product Updates</Label>
                      <Switch id="updates" />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced account options.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="apiKey" type="password" />
                    <Button variant="outline">Generate</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook">Webhook URL</Label>
                  <Input id="webhook" placeholder="https://" />
                </div>
                <div className="space-y-4">
                  <Label>Access Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="readonly">Read Only</SelectItem>
                      <SelectItem value="readwrite">Read & Write</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">I agree to the Terms of Service</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full">Save Advanced Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    name: "Dialog",
    description: "A modal dialog with rich interactive features and animations.",
    example: (
      <div className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Advanced Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile settings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" defaultValue="John Doe" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input id="username" defaultValue="@johndoe" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="picture" className="text-right">Picture</Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
  {
    name: "Card",
    description: "Modern card components with various layouts and purposes.",
    example: (
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Project Statistics</CardTitle>
            <CardDescription>Your project overview for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[78%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tasks Completed</p>
                  <p className="text-2xl font-bold">156/200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Time Spent</p>
                  <p className="text-2xl font-bold">45h</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View Details</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Recent actions by team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/40?img=${i}`} />
                    <AvatarFallback>TM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Updated project settings</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    name: "Progress Indicators",
    description: "Various styles of progress indicators and loading states.",
    example: (
      <div className="space-y-8">
        <div className="space-y-2">
          <Label>Basic Progress</Label>
          <div className="h-2 w-full rounded-full bg-secondary">
            <div className="h-full w-2/3 rounded-full bg-primary transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Steps Progress</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${
                  step <= 2 ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step 2 of 4</p>
        </div>
        <div className="space-y-2">
          <Label>Circular Progress</Label>
          <div className="flex gap-4">
            {[25, 50, 75, 100].map((progress) => (
              <div key={progress} className="relative h-12 w-12">
                <svg className="h-12 w-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    className="text-secondary"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    className="text-primary"
                    strokeDasharray={`${progress * 1.25} 999`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Navigation Menu",
    description: "A responsive navigation menu with dropdowns and mobile support.",
    example: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                <div className="grid grid-cols-2 gap-4">
                  <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Introduction</span>
                      <span className="text-xs text-muted-foreground">
                        Learn the basics and get started quickly.
                      </span>
                    </div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Documentation</span>
                      <span className="text-xs text-muted-foreground">
                        Read the full documentation and API reference.
                      </span>
                    </div>
                  </NavigationMenuLink>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Components</span>
                      <span className="text-xs text-muted-foreground">
                        Explore all available components.
                      </span>
                    </div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Examples</span>
                      <span className="text-xs text-muted-foreground">
                        View example implementations and code.
                      </span>
                    </div>
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 w-[200px]">
                <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                  Blog
                </NavigationMenuLink>
                <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                  Showcase
                </NavigationMenuLink>
                <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                  GitHub
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
  },
  {
    name: "Interactive Controls",
    description: "Examples of interactive controls with tooltips and state management.",
    example: (
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tooltip Examples</h3>
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SortAsc className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort ascending</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter results</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Toggle Controls</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <RadioGroup defaultValue="comfortable" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="comfortable" />
                <Label htmlFor="comfortable">Comfortable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="compact" />
                <Label htmlFor="compact">Compact</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    ),
  }
];

export default function ShowcasePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const router = useRouter();

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

  const selectedComponentData = selectedComponent 
    ? COMPONENTS.find(c => c.name === selectedComponent)
    : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" onClick={() => setSelectedComponent(null)}>
                  Components
                </BreadcrumbLink>
              </BreadcrumbItem>
              {selectedComponent && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedComponent}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto relative flex items-center gap-4">
            <ModeToggle />
            <AccentColorSwitcher />
            <div onClick={() => setIsPopupOpen(!isPopupOpen)} className="cursor-pointer relative">
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
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {selectedComponent ? (
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{selectedComponent}</h1>
                  <p className="text-muted-foreground">
                    {selectedComponentData?.description}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedComponent(null)}>
                  Back to Components
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Live Example</h2>
                <div className="flex items-center justify-center p-10 bg-muted rounded-md">
                  {selectedComponentData?.example}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Components</h1>
                <p className="text-muted-foreground">
                  A collection of pre-built components using shadcn/ui.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COMPONENTS.map((component) => (
                  <div
                    key={component.name}
                    className="rounded-lg border bg-card p-6"
                  >
                    <h3 className="text-lg font-semibold">{component.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {component.description}
                    </p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={() => setSelectedComponent(component.name)}
                    >
                      View Example
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}