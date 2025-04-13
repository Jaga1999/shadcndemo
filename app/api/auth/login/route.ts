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
        // Create JWT token with user information including preferences
        const token = jwt.sign(
            { 
                email: user.email, 
                id: user._id,
                username: user.username,
                preferences: user.preferences
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        // Set cookie in the response
        const response = NextResponse.json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                preferences: user.preferences
            }
        }, { status: 200 });
        
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 3600,
            sameSite: 'strict'
        });

        return response;
    } catch (error) {
        console.error('Error in login route:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
