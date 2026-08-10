import aiRagEngine from "../services/aiRagEngine.js";

/**
 * Controller for handling AI Chatbot queries
 */
export const handleChatRequest = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message string is required."
      });
    }

    const response = await aiRagEngine.generateResponse(message.trim(), history || []);

    return res.json({
      success: true,
      reply: response.reply,
      recommendedProducts: response.recommendedProducts || []
    });
  } catch (error) {
    console.error("❌ [AI Controller Error]:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your AI request."
    });
  }
};

/**
 * Controller for re-syncing product catalog vectors to Pinecone
 */
export const syncVectorStore = async (req, res) => {
  try {
    await aiRagEngine.initializeKnowledgeBase();
    return res.json({
      success: true,
      message: "Vector Store Knowledge Base synchronized successfully!"
    });
  } catch (error) {
    console.error("❌ [AI Controller Sync Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync vector knowledge base."
    });
  }
};
