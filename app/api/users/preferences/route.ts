import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        
        const { preferences } = await request.json();
        await connectToDatabase();

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { $set: { preferences } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ preferences: user.preferences });
    } catch (error) {
        console.error("Update preferences error:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}