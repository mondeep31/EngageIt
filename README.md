# Customer Engagement Dashboard

## Overview

The **Customer Engagement Dashboard** provides insights into user activity, engagement metrics, retention, and churn risk. It includes AI-powered recommendations and filtering options for improved analysis.

#### Notes

Screenshots are attached in the EngageIt.pdf

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

# API Documentation

## Base URL

```
http://localhost:PORT/api/user
```

## Endpoints

### 1. Get Processed Data

**Endpoint:**

```
GET /api/user/processed-data
```

**Description:**
Retrieves pre-processed user engagement data stored in `processedData.json`. This includes calculated engagement scores, churn risk, retention category, and AI-generated individual and collective recommendations.

**Response:**

```json
{
  "overviewMetrics": {
    "dailyActiveUsers": 0,
    "weeklyActiveUsers": 9,
    "monthlyActiveUsers": 38,
    "retentionRate": 13,
    "collectiveEngagementScore": 29,
    "churnPredictionList": [
      {
        "id": 1,
        "name": "User 1",
        "email": "user1@email.com",
        "last_login_date": "2024-12-26",
        "engagementScore": 31,
        "retentionCategory": "Low",
        "churnRisk": true,
        "aiRecommendation": "Personalized Onboarding Session, Incentivized Feature Exploration, Regular Check-Ins."
      }
    ]
  }
}
```

**Errors:**

- `500 Internal Server Error`: If processed data cannot be read.

---

### 2. Get All Users

**Endpoint:**

```
GET /api/user/getUsers
```

**Description:**
Fetches all users along with calculated engagement metrics, retention categories, churn risk, and AI-generated recommendations. The response is enriched with insights based on user activity from `initialData.json`.

**Response:**

```json
{
  "overviewMetrics": {
    "dailyActiveUsers": 0,
    "weeklyActiveUsers": 9,
    "monthlyActiveUsers": 38,
    "retentionRate": 13,
    "collectiveEngagementScore": 29,
    "churnPredictionList": [
      {
        "id": 1,
        "name": "User 1",
        "email": "user1@email.com",
        "last_login_date": "2024-12-26",
        "engagementScore": 31,
        "retentionCategory": "Low",
        "churnRisk": true,
        "aiRecommendation": "Personalized Onboarding Session, Incentivized Feature Exploration, Regular Check-Ins."
      }
    ]
  },
  "users": [
    {
      "id": 1,
      "name": "User 1",
      "email": "user1@email.com",
      "last_login_date": "2024-12-26",
      "number_of_logins": 152,
      "number_of_features_used": 2,
      "time_spent_on_platform": 487,
      "features_used": ["Feature N", "Feature N", "Feature R"],
      "engagementScore": 31,
      "retentionCategory": "Low",
      "churnRisk": true,
      "aiRecommendation": "Personalized Onboarding Session, Incentivized Feature Exploration, Regular Check-Ins."
    }
  ]
}
```

**Errors:**

- `500 Internal Server Error`: If there is an issue fetching user data.

---

## Data Processing Logic

### Engagement Score Calculation

- `engagementScore = (logins * 0.2) + (featuresUsed * 0.3) + (recencyScore * 0.5)`
- Score capped between `0` and `100`.

### Churn Risk Calculation

- Users who haven't logged in for **30+ days** and have **engagementScore < 40** are marked as at-risk.

### Retention Categories

- `High` → Engagement Score > 70
- `Medium` → Engagement Score > 40
- `Low` → Engagement Score <= 40

### AI Recommendations

- AI-generated recommendations are based on engagement scores, feature usage, and churn risk analysis.

## Error Handling

| Error Code | Meaning                            |
| ---------- | ---------------------------------- |
| 500        | Internal Server Error              |
| 404        | Resource Not Found (if applicable) |

---

## Contributing

Feel free to open issues or submit pull requests to enhance the dashboard.

## License

This project is licensed under the MIT License.
