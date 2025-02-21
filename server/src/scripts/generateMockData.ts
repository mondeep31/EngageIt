import fs from 'fs'
import path from 'path'

// Generate features from "Feature A" to "Feature Z"
const featuresList = Array.from({ length: 26 }, (_, i) => `Feature ${String.fromCharCode(65 + i)}`);

// Function to generate a random date in the last 6 months (from August 2024 to today)
const getRandomDate = () => {
    const start = new Date("2024-08-01"); // Minimum date: Aug 1, 2024
    const end = new Date(); // Maximum date: Today
    const randomTimestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTimestamp);
    
    return randomDate.toISOString().split("T")[0]; // Return YYYY-MM-DD format
};

// Generate 100 mock users
const mockUsers = [];

for (let i = 1; i <= 100; i++) {
    const user = {
        id: i,
        name: `User ${i}`,
        email: `user${i}@email.com`,
        last_login_date: getRandomDate(), // Ensure recent login date
        number_of_logins: Math.floor(Math.random() * 96) + 5,  // Random between 5-100
        number_of_features_used: Math.floor(Math.random() * 191) + 10, // Random between 10-200
        time_spent_on_platform: Math.floor(Math.random() * 551) + 50,  // Random between 50-600 minutes
        features_used: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => featuresList[Math.floor(Math.random() * featuresList.length)])
    };

    mockUsers.push(user);
}

// Define the path for saving the file
const filePath = path.join(__dirname, "../data/mockUsers.json");
fs.writeFileSync(filePath, JSON.stringify(mockUsers, null, 4));

console.log(`✅ Mock data generated successfully: ${filePath}`);
