import { Request, Response } from "express";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { ElasticSearchService } from "./ElasticSearchService";

// const genai = new GoogleGenerativeAI("AIzaSyBrKHtpXcR7GbYxGHjFG8GDF2RvQ_D8-_w").getGenerativeModel({ model: "gemini-1.0-pro" });

export class GeminiAIService {

    constructor (private genai: GenerativeModel) { }

    public async handlePrompts(req: Request, res: Response, elasticSearchService: ElasticSearchService): Promise<void> {
        const prompt = req.body.prompt;
        try {
            // Generate content based on the user prompt
            const promptResult1 = await this.genai.generateContent(prompt);
            const interpretedPrompt = promptResult1.response.text().trim();

            // Generate content for the Elasticsearch query
            const promptResult2 = await this.genai.generateContent(`Determine the elasticsearch query for user prompt: "${interpretedPrompt}" and provide me with the best elasticsearch query result to get the appropriate data.`);
            let queryResult = promptResult2.response.text().trim();

            // Clean up the response string
            queryResult = queryResult.replace(/```/g, '').trim(); // Remove backticks and extra whitespace

            // Check for any additional non-JSON content and clean it
            const jsonString = queryResult.split('\n').filter(line => line.trim() !== '' && !line.startsWith('**')).join('\n');

            // Parse the cleaned JSON string
            try {
                const jsonResponse = JSON.parse(jsonString);
                console.log(jsonResponse);
                res.json(jsonResponse);
            } catch (parseError) {
                console.error("Failed to parse JSON response: ", parseError);
                res.status(500).json({ error: "Failed to parse JSON response." });
            }
        } catch (error) {
            console.error("Error encountered while processing the prompt: ", error);
            res.status(500).json({ error: "An error occurred while processing the request." });
        }
    }
}
