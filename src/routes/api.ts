import express, { Request, Response } from "express";
import { GeminiAIService } from "../services/GeminiAIService";
import { ElasticSearchService } from "../services/ElasticSearchService";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genaiModel = new GoogleGenerativeAI("AIzaSyBrKHtpXcR7GbYxGHjFG8GDF2RvQ_D8-_w").getGenerativeModel({ model: "gemini-1.0-pro" });
const geminiAIService: GeminiAIService = new GeminiAIService(genaiModel);
const elasticSearchService: ElasticSearchService = new ElasticSearchService();



router.post("/prompt", (req: Request, res: Response) => { geminiAIService.handlePrompts(req, res, elasticSearchService) });

export default router;