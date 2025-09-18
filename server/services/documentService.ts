import fs from "fs";
import path from "path";
import { storage } from "../storage";
import { aiService } from "./aiService";

export class DocumentService {
  async processDocument(documentId: string): Promise<void> {
    try {
      const document = await storage.getDocument(documentId);
      if (!document) {
        throw new Error("Document not found");
      }

      // Extract text from file
      const text = await this.extractTextFromFile(document.filePath, document.fileType);
      
      if (text) {
        // Generate summary
        const summary = await aiService.summarizeText(text, "ar");
        
        // Generate flashcards
        const flashcardsData = await aiService.generateFlashcards(text, "ar");
        
        // Update document with extracted content and summary
        await storage.updateDocument(documentId, {
          content: text,
          summary,
          isProcessed: true,
        });

        // Create flashcards
        for (const cardData of flashcardsData) {
          await storage.createFlashcard({
            userId: document.userId,
            documentId: document.id,
            question: cardData.question,
            answer: cardData.answer,
            difficulty: "medium",
          });
        }
      }
    } catch (error) {
      console.error("Error processing document:", error);
      // Mark as processed even if failed to avoid infinite retry
      await storage.updateDocument(documentId, {
        isProcessed: true,
      });
    }
  }

  private async extractTextFromFile(filePath: string, fileType: string): Promise<string> {
    try {
      if (fileType === "application/pdf") {
        const buffer = fs.readFileSync(filePath);
        // Dynamically import pdf-parse to avoid startup issues
        const pdfParse = await import("pdf-parse");
        const pdf = pdfParse.default || pdfParse;
        const data = await pdf(buffer);
        return data.text;
      } else if (fileType === "text/plain") {
        return fs.readFileSync(filePath, "utf-8");
      } else if (fileType.includes("document") || fileType.includes("docx")) {
        // For DOCX files, you would need a library like mammoth
        // For now, return empty string and handle in future iteration
        return "";
      }
      
      return "";
    } catch (error) {
      console.error("Error extracting text from file:", error);
      return "";
    }
  }
}

export const documentService = new DocumentService();
