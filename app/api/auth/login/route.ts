import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await connectToDatabase();

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT token
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET as string, // Ensure you set this environment variable
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Set cookie in the response
        const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,  // Makes the cookie inaccessible to client-side JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            path: '/',       // Cookie is available for the entire site
            maxAge: 3600,    // Cookie expires in 1 hour
            sameSite: 'strict' // Prevent CSRF attacks
        });

        // Send token in the response
        return response;
    } catch (error) {
        console.error('Error in login route:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
