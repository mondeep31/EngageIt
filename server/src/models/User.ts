import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    id: number;  
    name: string;
    email: string;
    last_login_date: Date;
    number_of_logins: number;
    number_of_features_used: number;
    time_spent_on_platform: number;
    features_used: String[]
}

const UserSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true },
    last_login_date: { type: Date, required: true },
    number_of_logins: { type: Number, required: true },
    number_of_features_used: { type: Number, required: true },
    time_spent_on_platform: { type: Number, required: true },
    features_used: { type: [String], required: true },
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
