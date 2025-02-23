# Customer Engagement Dashboard

## Overview

The **Customer Engagement Dashboard** provides insights into user activity, engagement metrics, retention, and churn risk. It includes AI-powered recommendations and filtering options for improved analysis.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or using a cloud instance)
- [TypeScript](https://www.typescriptlang.org/) (`npm install -g typescript`)
- [Nodemon](https://nodemon.io/) (for development mode, `npm install -g nodemon`)

## Setup Instructions

1. **Clone the Repository**

   ```sh
   git clone https://github.com/your-repo/customer-engagement-dashboard.git
   cd customer-engagement-dashboard
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the project root and configure the following:

   ```env
   MONGO_URI=mongodb://localhost:27017/customer-engagement
   PORT=5000
   AI_API_KEY=your-ai-api-key
   ```

4. **Build the Project**

   ```sh
   npm run build
   ```

5. **Run the Project**

   - **Development Mode** (auto-restart on file changes)
     ```sh
     npm run dev
     ```
   - **Production Mode**
     ```sh
     npm run start
     ```

6. **Database Seeding** (Optional: Populate database with mock data)
   ```sh
   npm run mock-seed
   ```

## Available Scripts

| Script                  | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | Starts the server in development mode with Nodemon |
| `npm run start`         | Starts the server in production mode               |
| `npm run build`         | Compiles TypeScript to JavaScript                  |
| `npm run seed`          | Seeds the database with predefined data            |
| `npm run generate-mock` | Generates mock data for testing                    |
| `npm run mock-seed`     | Generates and seeds mock data                      |

## API Endpoints

Refer to the API documentation for details on available endpoints and their usage.

## Contributing

Feel free to open issues or submit pull requests to enhance the dashboard.

## License

This project is licensed under the MIT License.
