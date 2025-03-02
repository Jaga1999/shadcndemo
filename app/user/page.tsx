"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";

// Define a TypeScript interface for a User
interface IUser {
  _id: string;
  name: string;
  email: string;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]); // Specify the type of users as IUser[]
  const [loading, setLoading] = useState(true);
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
  const handleDashboardRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button onClick={handleDashboardRedirect} variant="outline">
            Dashboard
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>ID</TableHead> */}
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                {/* <TableCell>{user._id}</TableCell> */}
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
  );
}
