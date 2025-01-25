import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) return;

  try {
    const uri: string = process.env.MONGODB_URI as string;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as object;

    await mongoose.connect(uri, options);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to database');
  }
}
