import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs'; // Use Node.js runtime

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with default preferences
        const newUser = await User.create({ 
            email, 
            password: hashedPassword, 
            username: name,
            preferences: {
                theme: 'system',
                accentColor: '#0000FF'
            }
        });
        
        console.log('Created User:', newUser);
        return NextResponse.json({ 
            message: 'User registered successfully', 
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                preferences: newUser.preferences
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error in register route:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
