import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Get the cookie store
    const cookieStore = await cookies();

    // Clear the JWT token cookie
    cookieStore.delete("token");

    // Respond with a success message
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
