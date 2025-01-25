"use client"; // Make sure this is marked as a client component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login when the component is mounted
    router.push("/login");
  }, [router]);

  return null; // Prevent rendering of the page content
}
