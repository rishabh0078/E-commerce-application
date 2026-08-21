import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { Pinecone } from "@pinecone-database/pinecone";
import productModel from "../models/productModel.js";

/**
 * Static Knowledge Base for Store Operational Policies
 */
const STORE_POLICIES = [
  {
    title: "Return & Exchange Policy",
    content: "We offer a 7-day easy return and exchange policy. Items must be unused, in original packaging with tags intact. Refund will be processed to original payment method or store credit within 5-7 business days."
  },
  {
    title: "Shipping & Delivery Policy",
    content: "Standard delivery charge is $10 across all orders. Delivery usually takes 3 to 5 business days depending on location. Free shipping promotions may apply during special store events."
  },
  {
    title: "Payment Methods",
    content: "We accept Cash on Delivery (COD), Stripe (Credit/Debit Card), and Razorpay payments. All transactions are 100% secure and encrypted."
  },
  {
    title: "Customer Support & Contact",
    content: "Customer support is available Monday through Friday, 9 AM - 6 PM EST. You can contact us via the Contact page or email support@forevercommerce.com."
  }
];

/**
 * Custom Lightweight Text Embedding Generator for Vector Representation
 * Creates a normalized 384-dimensional dense vector representation from text
 * ensuring deterministic similarity calculation without external paid embedding APIs.
 */
class CustomVectorEmbeddings {
  constructor(dimensions = 384) {
    this.dimensions = dimensions;
  }

  async embedQuery(text) {
    return this._generateEmbedding(text);
  }

  async embedDocuments(documents) {
    return documents.map((doc) => this._generateEmbedding(doc));
  }

  _generateEmbedding(text) {
    const vector = new Array(this.dimensions).fill(0);
    if (!text || typeof text !== "string") return vector;

    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const words = cleaned.split(/\s+/).filter(Boolean);

    if (words.length === 0) return vector;

    // Feature Hashing Trick for dense vector embeddings
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let hash = 0;
      for (let j = 0; j < word.length; j++) {
        hash = (hash << 5) - hash + word.charCodeAt(j);
        hash |= 0;
      }

      const index = Math.abs(hash) % this.dimensions;
      const weight = 1.0 / Math.sqrt(i + 1);
      vector[index] += weight;

      // Also encode character n-grams for semantic word stem matching
      if (word.length >= 3) {
        for (let k = 0; k < word.length - 2; k++) {
          const ngram = word.substring(k, k + 3);
          let nHash = 0;
          for (let n = 0; n < ngram.length; n++) {
            nHash = (nHash << 5) - nHash + ngram.charCodeAt(n);
            nHash |= 0;
          }
          const nIndex = Math.abs(nHash) % this.dimensions;
          vector[nIndex] += 0.25;
        }
      }
    }

    // L2 Vector Normalization
    let norm = 0;
    for (let v of vector) {
      norm += v * v;
    }
    norm = Math.sqrt(norm);

    if (norm > 0) {
      for (let i = 0; i < this.dimensions; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }
}

class AiRagEngine {
  constructor() {
    this.embeddings = new CustomVectorEmbeddings(384);
    this.pineconeClient = null;
    this.pineconeIndex = null;
    this.inMemoryVectorStore = [];
    this.isInitialized = false;
  }

  /**
   * Initializes or refreshes the Vector Knowledge Base from MongoDB and Store Policies
   */
  async initializeKnowledgeBase() {
    try {
      console.log("🤖 [AI RAG] Fetching catalog and store policies...");

      // Fetch all products from database
      const products = await productModel.find({});

      const documents = [];

      // Index Store Policies
      STORE_POLICIES.forEach((policy, idx) => {
        documents.push({
          id: `policy-${idx}`,
          text: `Policy Title: ${policy.title}\nContent: ${policy.content}`,
          metadata: { type: "policy", title: policy.title }
        });
      });

      // Index Product Catalog
      products.forEach((p) => {
        const productText = `Product Name: ${p.name}\nID: ${p._id}\nCategory: ${p.category} -> ${p.subCategory}\nPrice: $${p.price}\nAvailable Sizes: ${Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes}\nDescription: ${p.description}\nBestseller Status: ${p.bestseller ? "Bestseller" : "Regular"}`;

        documents.push({
          id: `product-${p._id}`,
          text: productText,
          metadata: {
            type: "product",
            productId: p._id.toString(),
            name: p.name,
            price: p.price,
            category: p.category,
            subCategory: p.subCategory,
            image: p.image && p.image.length > 0 ? p.image[0] : "",
            sizes: p.sizes,
            bestseller: p.bestseller
          }
        });
      });

      // Compute Vector Embeddings for in-memory & Pinecone store
      this.inMemoryVectorStore = await Promise.all(
        documents.map(async (doc) => {
          const vector = await this.embeddings.embedQuery(doc.text);
          return { ...doc, vector };
        })
      );

      // Connect to Pinecone if credentials exist
      const pineconeKey = process.env.PINECONE_API_KEY;
      const pineconeIndexName = process.env.PINECONE_INDEX || "e-commerce-index";

      if (pineconeKey && pineconeKey !== "your_pinecone_api_key") {
        try {
          this.pineconeClient = new Pinecone({ apiKey: pineconeKey.trim() });
          this.pineconeIndex = this.pineconeClient.index(pineconeIndexName.trim());

          const pineconeRecords = this.inMemoryVectorStore.map((doc) => ({
            id: doc.id,
            values: doc.vector,
            metadata: {
              type: doc.metadata.type,
              text: doc.text.substring(0, 1000),
              ...(doc.metadata.productId ? { productId: doc.metadata.productId } : {}),
              name: doc.metadata.name || doc.metadata.title || ""
            }
          }));

          if (pineconeRecords.length > 0) {
            console.log(`🌲 [Pinecone] Upserting ${pineconeRecords.length} vector records to Pinecone index '${pineconeIndexName.trim()}'...`);
            try {
              await this.pineconeIndex.upsert({ records: pineconeRecords });
              console.log(`🌲 [Pinecone] Successfully indexed ${pineconeRecords.length} records into Pinecone!`);
            } catch (upsertErr) {
              console.warn("⚠️ [Pinecone Upsert Warning]:", upsertErr.message);
            }
          }
        } catch (pineconeError) {
          console.warn("⚠️ [Pinecone] Notice: Using fallback in-memory vector store due to Pinecone connection:", pineconeError.message);
        }
      }

      this.isInitialized = true;
      console.log(`✅ [AI RAG] Knowledge Base ready with ${documents.length} vectors.`);
    } catch (error) {
      console.error("❌ [AI RAG Engine] Error initializing knowledge base:", error.message);
    }
  }

  /**
   * Incremental Single Product Upsert (Ultra-fast, targeted to 1 item)
   */
  async upsertSingleProduct(p) {
    try {
      const productText = `Product Name: ${p.name}\nID: ${p._id}\nCategory: ${p.category} -> ${p.subCategory}\nPrice: $${p.price}\nAvailable Sizes: ${Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes}\nDescription: ${p.description}\nBestseller Status: ${p.bestseller ? "Bestseller" : "Regular"}`;

      const vector = await this.embeddings.embedQuery(productText);

      const record = {
        id: `product-${p._id}`,
        values: vector,
        metadata: {
          type: "product",
          productId: p._id.toString(),
          name: p.name,
          price: p.price,
          category: p.category,
          subCategory: p.subCategory,
          image: p.image && p.image.length > 0 ? (Array.isArray(p.image) ? p.image[0] : p.image) : "",
          sizes: p.sizes,
          bestseller: p.bestseller || false
        }
      };

      // Add/Update in memory store
      this.inMemoryVectorStore = this.inMemoryVectorStore.filter((d) => d.id !== record.id);
      this.inMemoryVectorStore.push({ ...record, text: productText });

      // Upsert single vector to Pinecone
      if (this.pineconeIndex) {
        await this.pineconeIndex.upsert({ records: [record] });
        console.log(`⚡ [Pinecone] Fast single-product vector added for: '${p.name}' (${p._id})`);
      }
    } catch (err) {
      console.warn("⚠️ [Pinecone Single Upsert Error]:", err.message);
    }
  }

  /**
   * Incremental Single Product Deletion
   */
  async deleteSingleProduct(productId) {
    try {
      const recordId = `product-${productId}`;
      this.inMemoryVectorStore = this.inMemoryVectorStore.filter((d) => d.id !== recordId);

      if (this.pineconeIndex) {
        await this.pineconeIndex.deleteOne(recordId);
        console.log(`⚡ [Pinecone] Vector deleted for product ID: ${productId}`);
      }
    } catch (err) {
      console.warn("⚠️ [Pinecone Delete Error]:", err.message);
    }
  }

  /**
   * Vector Similarity Search (Queries Pinecone or In-Memory Vector Store)
   */
  async retrieveContext(query, topK = 4) {
    if (!this.isInitialized || this.inMemoryVectorStore.length === 0) {
      await this.initializeKnowledgeBase();
    }

    const queryVector = await this.embeddings.embedQuery(query);

    // Try querying Pinecone first if available
    if (this.pineconeIndex) {
      try {
        const pineconeRes = await this.pineconeIndex.query({
          vector: queryVector,
          topK: topK,
          includeMetadata: true
        });

        if (pineconeRes && pineconeRes.matches && pineconeRes.matches.length > 0) {
          const matchedIds = pineconeRes.matches.map((m) => m.id);
          const retrievedDocs = this.inMemoryVectorStore.filter((doc) => matchedIds.includes(doc.id));
          if (retrievedDocs.length > 0) return retrievedDocs;
        }
      } catch (err) {
        console.warn("⚠️ [Pinecone Query] Fallback to vector search:", err.message);
      }
    }

    // Cosine similarity fallback over vector store
    const scoredDocs = this.inMemoryVectorStore.map((doc) => {
      let dotProduct = 0;
      for (let i = 0; i < doc.vector.length; i++) {
        dotProduct += doc.vector[i] * queryVector[i];
      }
      return { doc, score: dotProduct };
    });

    scoredDocs.sort((a, b) => b.score - a.score);
    return scoredDocs.slice(0, topK).map((item) => item.doc);
  }

  /**
   * Generates AI RAG response using LangChain & Groq API
   */
  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // 1. Retrieve RAG Context Documents
      const retrievedDocs = await this.retrieveContext(userMessage, 5);

      const contextText = retrievedDocs.map((d) => d.text).join("\n\n---\n\n");

      // Extract recommended products for UI rendering only when query is shopping/product related
      const productIntentRegex = /(product|cloth|shirt|pant|trouser|jacket|hoodie|t-shirt|topwear|bottomwear|winterwear|wear|recommend|suggest|buy|price|cost|collection|catalog|bestseller|size|men|item|looking for|show me|find me)/i;
      const isProductQuery = productIntentRegex.test(userMessage);

      const productDocs = retrievedDocs.filter((d) => d.metadata.type === "product");
      const recommendedProducts = isProductQuery
        ? productDocs.slice(0, 3).map((d) => ({
            _id: d.metadata.productId,
            name: d.metadata.name,
            price: d.metadata.price,
            category: d.metadata.category,
            subCategory: d.metadata.subCategory,
            image: Array.isArray(d.metadata.image) ? d.metadata.image : [d.metadata.image],
            sizes: d.metadata.sizes,
            bestseller: d.metadata.bestseller
          }))
        : [];

      // 2. Initialize Groq LLM via LangChain if key exists
      const groqKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : "";

      if (groqKey && groqKey !== "your_groq_api_key") {
        const candidateModels = [
          "openai/gpt-oss-120b",
          "openai/gpt-oss-20b",
          "qwen/qwen3.6-27b",
          "groq/compound"
        ];

        for (const modelName of candidateModels) {
          try {
            const chatModel = new ChatGroq({
              apiKey: groqKey,
              model: modelName,
              modelName: modelName,
              temperature: 0.5,
              maxTokens: 1000
            });

            const systemPrompt = PromptTemplate.fromTemplate(
              `You are Smarty AI, the official AI Shopping Assistant and personal stylist for 'AURA', an elite luxury menswear and apparel brand.
Your personality is friendly, warm, polite, and helpful.

RELEVANT STORE & CATALOG CONTEXT:
--------------------------------
{context}
--------------------------------

CONVERSATION HISTORY:
{history}

USER MESSAGE: {question}

GUIDELINES:
1. If the user greets you or makes small talk (e.g. "hi", "what are you doing", "who are you", "how are you"), respond warmly and naturally in character, and politely offer to help them find outfits or answer questions.
2. If the user asks about products, recommendations, or style suggestions, recommend relevant items from the catalog context, mentioning price ($), category, and available sizes.
3. If the user asks about shipping, returns, delivery time, or payment options, explain the store policy accurately.
4. Keep answers clean, stylish, concise, and formatted with markdown bullet points when helpful.

RESPONSE:`
            );

            const historyString = conversationHistory
              .map((msg) => `${msg.sender.toUpperCase()}: ${msg.text}`)
              .join("\n");

            const formattedPrompt = await systemPrompt.format({
              context: contextText,
              history: historyString || "None",
              question: userMessage
            });

            const response = await chatModel.invoke(formattedPrompt);
            const replyText = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

            return {
              reply: replyText,
              recommendedProducts
            };
          } catch (groqError) {
            console.warn(`⚠️ [Groq LangChain (${modelName}) Warning]: ${groqError.message}. Trying next model...`);
          }
        }
      }

      // Intelligent Fallback Generator if Groq Key is missing
      const fallbackReply = this._generateSmartFallback(userMessage, retrievedDocs);

      return {
        reply: fallbackReply,
        recommendedProducts
      };
    } catch (error) {
      console.error("❌ [AI RAG Engine Response Error]:", error);
      return {
        reply: "I'm having a brief issue connecting to my intelligence engine. Please ask me about our latest clothing collections, bestsellers, or shipping policy!",
        recommendedProducts: []
      };
    }
  }

  /**
   * Smart rule-based contextual generator when API key is pending
   */
  _generateSmartFallback(query, docs) {
    const qLower = query.toLowerCase();

    if (
      qLower.includes("hi") ||
      qLower.includes("hello") ||
      qLower.includes("hey") ||
      qLower.includes("what r u doing") ||
      qLower.includes("what are you doing") ||
      qLower.includes("who are you") ||
      qLower.includes("how are you")
    ) {
      return "👋 Hi there! I'm **Smarty AI**, your personal shopping assistant for **AURA**.\n\nI'm ready to help you browse our premium collections, find the perfect size, check prices, or answer any questions about our return policy and shipping fees. What can I help you find today?";
    }

    if (qLower.includes("return") || qLower.includes("refund") || qLower.includes("exchange")) {
      return "📦 **Return & Refund Policy**:\nWe offer a **7-day easy return & exchange policy**! Items should be unused with original tags intact. Refunds are processed within 5-7 business days back to your original payment method or store credit.";
    }

    if (qLower.includes("shipping") || qLower.includes("delivery") || qLower.includes("fee")) {
      return "🚚 **Shipping Details**:\nStandard delivery takes **3 to 5 business days**, with a flat rate delivery charge of **$10** across all orders!";
    }

    if (qLower.includes("payment") || qLower.includes("card") || qLower.includes("stripe") || qLower.includes("razorpay") || qLower.includes("cod")) {
      return "💳 **Payment Options**:\nWe accept **Cash on Delivery (COD)**, **Stripe** (Credit/Debit cards), and **Razorpay**. All checkout methods are 100% safe and secure.";
    }

    const products = docs.filter((d) => d.metadata.type === "product");

    if (products.length > 0) {
      let reply = `Here are the top matches I found in our store catalog for **"${query}"**:\n\n`;
      products.slice(0, 3).forEach((p, idx) => {
        reply += `${idx + 1}. **${p.metadata.name}** - **$${p.metadata.price}**\n   - Category: ${p.metadata.category} (${p.metadata.subCategory})\n   - Sizes: ${Array.isArray(p.metadata.sizes) ? p.metadata.sizes.join(", ") : p.metadata.sizes}\n\n`;
      });
      reply += "You can click on any product card below to view details and order!";
      return reply;
    }

    return `Welcome to **AURA**! I'm **Smarty AI**, your personal shopping assistant. I can help you search for clothes, recommend bestsellers, and answer questions about shipping, returns, or payment options. How can I assist you today?`;
  }
}

const aiRagEngine = new AiRagEngine();
export default aiRagEngine;
