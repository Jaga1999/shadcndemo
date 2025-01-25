import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    username: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: { // Added name field to the schema
        type: String,
        required: true,
    },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
