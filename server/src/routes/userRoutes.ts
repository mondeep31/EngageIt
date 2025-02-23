import express from "express";
import { getUsers } from "../controllers/userController";
import path from 'path';
import fs from 'fs';

const userRouter = express.Router();

// Get processed data
userRouter.get("/processed-data", async (req, res) => {
  try {
    const processedDataPath = path.join(__dirname, '..', 'data', 'processedData.json');
    const rawData = fs.readFileSync(processedDataPath, 'utf-8');
    const processedData = JSON.parse(rawData);
    res.json(processedData);
  } catch (error) {
    console.error('Error reading processed data:', error);
    res.status(500).json({ error: 'Failed to fetch processed data' });
  }
});

// Get all users
userRouter.get("/getUsers", getUsers);

export default userRouter;
