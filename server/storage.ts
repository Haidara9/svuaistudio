import {
  users,
  documents,
  flashcards,
  studySessions,
  aiConversations,
  type User,
  type UpsertUser,
  type Document,
  type InsertDocument,
  type Flashcard,
  type InsertFlashcard,
  type StudySession,
  type InsertStudySession,
  type AiConversation,
  type InsertAiConversation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getUserDocuments(userId: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  
  // Flashcard operations
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  getUserFlashcards(userId: string): Promise<Flashcard[]>;
  getDocumentFlashcards(documentId: string): Promise<Flashcard[]>;
  updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard>;
  deleteFlashcard(id: string): Promise<void>;
  getFlashcardsDueForReview(userId: string): Promise<Flashcard[]>;
  
  // Study session operations
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getUserStudySessions(userId: string): Promise<StudySession[]>;
  updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession>;
  deleteStudySession(id: string): Promise<void>;
  
  // AI conversation operations
  createAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  getUserAiConversations(userId: string, limit?: number): Promise<AiConversation[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: "premium",
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [doc] = await db.insert(documents).values(document).returning();
    return doc;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const [doc] = await db
      .update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return doc;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Flashcard operations
  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [card] = await db.insert(flashcards).values(flashcard).returning();
    return card;
  }

  async getUserFlashcards(userId: string): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.userId, userId))
      .orderBy(desc(flashcards.createdAt));
  }

  async getDocumentFlashcards(documentId: string): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.documentId, documentId))
      .orderBy(desc(flashcards.createdAt));
  }

  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
    const [card] = await db
      .update(flashcards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(flashcards.id, id))
      .returning();
    return card;
  }

  async deleteFlashcard(id: string): Promise<void> {
    await db.delete(flashcards).where(eq(flashcards.id, id));
  }

  async getFlashcardsDueForReview(userId: string): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(
        and(
          eq(flashcards.userId, userId),
          gte(new Date(), flashcards.nextReview)
        )
      )
      .orderBy(flashcards.nextReview);
  }

  // Study session operations
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [studySession] = await db.insert(studySessions).values(session).returning();
    return studySession;
  }

  async getUserStudySessions(userId: string): Promise<StudySession[]> {
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.scheduledAt));
  }

  async updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession> {
    const [session] = await db
      .update(studySessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(studySessions.id, id))
      .returning();
    return session;
  }

  async deleteStudySession(id: string): Promise<void> {
    await db.delete(studySessions).where(eq(studySessions.id, id));
  }

  // AI conversation operations
  async createAiConversation(conversation: InsertAiConversation): Promise<AiConversation> {
    const [conv] = await db.insert(aiConversations).values(conversation).returning();
    return conv;
  }

  async getUserAiConversations(userId: string, limit: number = 50): Promise<AiConversation[]> {
    return await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
