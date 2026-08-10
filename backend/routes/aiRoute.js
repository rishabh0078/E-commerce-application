import express from "express";
import { handleChatRequest, syncVectorStore } from "../controllers/aiController.js";

const aiRouter = express.Router();

// Chat endpoint for AI Shopping Assistant
aiRouter.post("/chat", handleChatRequest);

// Vector database synchronization endpoint
aiRouter.post("/sync", syncVectorStore);

export default aiRouter;
