import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs"; // Use Node.js runtime

export async function GET() {
    try {
        // Extract JWT token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            console.log("Decoded Token:", decoded);
        } catch (err) {
            console.error("Invalid JWT token:", err);
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Connect to the database
        await connectToDatabase();

        // Fetch all users and exclude the password field
        const users = await User.find({}, { password: 0 });

        if (!users || users.length === 0) {
            return NextResponse.json({ message: "No users found" }, { status: 404 });
        }

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
