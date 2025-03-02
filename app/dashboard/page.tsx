"use client";

import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";

// Define a TypeScript interface for a User
interface IUser {
  _id: string;
  name: string;
  email: string;
  username: string;
}

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

  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return now.toLocaleDateString("en-US", options);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const description = getCurrentDateTime();
      if (response.ok) {
        toast("LogOut successful!", {
          description,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        router.push("/login");
      } else {
        toast("Logout failed. Please try again", {
          description,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
      }
    } catch (err) {
      const description = getCurrentDateTime();
      console.error("Error:", err);
      toast("Logout failed. Please try again", {
        description,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
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
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center" style={{ backgroundColor: "var(--accent-color)" }}>
              <Button variant="outline" style={{ borderColor: "var(--accent-color)" }}>Button 1</Button>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
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