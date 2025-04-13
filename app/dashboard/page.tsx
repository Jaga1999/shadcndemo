"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toastMessage } from "@/lib/utils";
import { DashboardV1 } from "@/components/dashboard/dashboard-v1";
import { DashboardV2 } from "@/components/dashboard/dashboard-v2";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Page() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
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
        <div className="flex-1 p-4">
          <div className="dashboard-container">
            <Tabs defaultValue="dashboard-v1" className="w-full">
              <TabsList>
                <TabsTrigger value="dashboard-v1">Dashboard V1</TabsTrigger>
                <TabsTrigger value="dashboard-v2">Dashboard V2</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard-v1">
                <DashboardV1 />
              </TabsContent>
              <TabsContent value="dashboard-v2">
                <DashboardV2 />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}