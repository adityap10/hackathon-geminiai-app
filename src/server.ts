import express, { Request, Response } from "express";
import apiroutes from "./routes/api";


const server = express();

server.use(express.json());
server.use("/api", apiroutes);

server.listen(3000, () => {console.log("GeminiAI Server listening on port 3000")});