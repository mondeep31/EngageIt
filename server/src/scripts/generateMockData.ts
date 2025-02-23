import fs from 'fs'
import path from 'path'


const featuresList = Array.from({ length: 26 }, (_, i) => `Feature ${String.fromCharCode(65 + i)}`);


const getRandomDate = () => {
    const start = new Date("2024-08-01"); // Minimum date: Aug 1, 2024
    const end = new Date(); // Maximum date: Today
    const randomTimestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTimestamp);
    
    return randomDate.toISOString().split("T")[0]; // Return YYYY-MM-DD format
};


const mockUsers = [];

for (let i = 1; i <= 300; i++) {
    const user = {
        id: i,
        name: `User ${i}`,
        email: `user${i}@email.com`,
        last_login_date: getRandomDate(), 
        number_of_logins: Math.floor(Math.random() *151) + 50,  // Random between 50-200
        number_of_features_used: Math.floor(Math.random() * 26) + 1, // Random between 1-26
        time_spent_on_platform: Math.floor(Math.random() * 601) + 200,  // Random between 200-800 mins
        features_used: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => featuresList[Math.floor(Math.random() * featuresList.length)])
    };

    mockUsers.push(user);
}


const filePath = path.join(__dirname, "../data/initialData.json");
fs.writeFileSync(filePath, JSON.stringify(mockUsers, null, 4));

console.log(` Mock data generated successfully: ${filePath}`);
