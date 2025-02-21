import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import connectDB from "../config/db";  
import User from "../models/User";

const filePath = path.join(__dirname, "../data/mockUsers.json");
const usersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const seedData = async () => {
    try {
        await connectDB(); 
        console.log("✅ MongoDB Connected");

        // console.log(usersData);
        // Clear existing data
        await User.deleteMany();
        // console.log("Old data removed");

        // Insert new data
        const result = await User.insertMany(usersData);
        console.log("✅ Inserted Users:", result.length);
        // console.log("120 Users Seeded Successfully");

        // Exit process after seeding
        process.exit(); 
    } catch (error) {
        console.error("Seeding Failed", error);
        process.exit(1);
    }
};

seedData();
