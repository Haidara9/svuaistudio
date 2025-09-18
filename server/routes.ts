import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { aiService } from "./services/aiService";
import { documentService } from "./services/documentService";
import { insertDocumentSchema, insertFlashcardSchema, insertStudySessionSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".docx", ".doc", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Document routes
  app.post("/api/documents/upload", isAuthenticated, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const { title } = req.body;

      // Create document record
      const documentData = insertDocumentSchema.parse({
        userId,
        title: title || req.file.originalname,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      });

      const document = await storage.createDocument(documentData);

      // Process document in background
      documentService.processDocument(document.id);

      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.get("/api/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDocument(id);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Flashcard routes
  app.get("/api/flashcards", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const flashcards = await storage.getUserFlashcards(userId);
      res.json(flashcards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      res.status(500).json({ message: "Failed to fetch flashcards" });
    }
  });

  app.get("/api/flashcards/due", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const flashcards = await storage.getFlashcardsDueForReview(userId);
      res.json(flashcards);
    } catch (error) {
      console.error("Error fetching due flashcards:", error);
      res.status(500).json({ message: "Failed to fetch due flashcards" });
    }
  });

  app.post("/api/flashcards", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const flashcardData = insertFlashcardSchema.parse({
        ...req.body,
        userId,
      });

      const flashcard = await storage.createFlashcard(flashcardData);
      res.json(flashcard);
    } catch (error) {
      console.error("Error creating flashcard:", error);
      res.status(500).json({ message: "Failed to create flashcard" });
    }
  });

  app.put("/api/flashcards/:id/review", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { correct } = req.body;

      const flashcard = await storage.updateFlashcard(id, {
        reviewCount: (await storage.getUserFlashcards(req.user.claims.sub)).find(f => f.id === id)?.reviewCount || 0 + 1,
        correctCount: correct ? ((await storage.getUserFlashcards(req.user.claims.sub)).find(f => f.id === id)?.correctCount || 0) + 1 : undefined,
        nextReview: new Date(Date.now() + (correct ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000)), // 24h if correct, 1h if incorrect
      });

      res.json(flashcard);
    } catch (error) {
      console.error("Error updating flashcard review:", error);
      res.status(500).json({ message: "Failed to update flashcard review" });
    }
  });

  // Study session routes
  app.get("/api/study-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserStudySessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.post("/api/study-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertStudySessionSchema.parse({
        ...req.body,
        userId,
      });

      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(500).json({ message: "Failed to create study session" });
    }
  });

  // AI assistant routes
  app.post("/api/ai/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, language = "ar" } = req.body;

      const response = await aiService.chatWithAssistant(message, language);

      // Save conversation
      await storage.createAiConversation({
        userId,
        message,
        response,
        language,
      });

      res.json({ response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  app.get("/api/ai/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getUserAiConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching AI conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Plagiarism check route
  app.post("/api/plagiarism/check", isAuthenticated, async (req: any, res) => {
    try {
      const { text } = req.body;
      const result = await aiService.checkPlagiarism(text);
      res.json(result);
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      res.status(500).json({ message: "Failed to check plagiarism" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
