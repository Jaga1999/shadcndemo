"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(""); // Only used in register mode
  const [isRegister, setIsRegister] = useState(false); // Track login/register mode
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiRoute = isRegister ? "/api/auth/register" : "/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (!isRegister) {
          router.push("/user");
        } else {
          // Automatically switch to login mode after successful registration
          setIsRegister(false);
          setEmail("");
          setPassword("");
          setName("");
          setError("Registration successful! Please login.");
        }
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to process the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isRegister ? "Register" : "Login"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Enter your details to create an account"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {isRegister && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? isRegister
                    ? "Registering..."
                    : "Logging in..."
                  : isRegister
                  ? "Register"
                  : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="underline underline-offset-4"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
