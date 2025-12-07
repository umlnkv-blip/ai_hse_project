import { type User, type InsertUser, type Generation, type InsertGeneration, users, generations } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGenerations(filters?: { module?: string; search?: string; favoritesOnly?: boolean }): Promise<Generation[]>;
  getGenerationById(id: string): Promise<Generation | undefined>;
  toggleFavorite(id: string): Promise<Generation | undefined>;
  deleteGeneration(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const [generation] = await db.insert(generations).values(insertGeneration).returning();
    return generation;
  }

  async getGenerations(filters?: { module?: string; search?: string; favoritesOnly?: boolean }): Promise<Generation[]> {
    let query = db.select().from(generations);
    
    const conditions: any[] = [];
    
    if (filters?.module && filters.module !== "all") {
      conditions.push(eq(generations.module, filters.module));
    }
    
    if (filters?.favoritesOnly) {
      conditions.push(eq(generations.isFavorite, true));
    }
    
    if (filters?.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(
        or(
          like(generations.inputJson, searchPattern),
          like(generations.outputText, searchPattern)
        )
      );
    }
    
    if (conditions.length > 0) {
      return db.select().from(generations).where(and(...conditions)).orderBy(desc(generations.createdAt));
    }
    
    return db.select().from(generations).orderBy(desc(generations.createdAt));
  }

  async getGenerationById(id: string): Promise<Generation | undefined> {
    const [generation] = await db.select().from(generations).where(eq(generations.id, id));
    return generation;
  }

  async toggleFavorite(id: string): Promise<Generation | undefined> {
    const existing = await this.getGenerationById(id);
    if (!existing) return undefined;
    
    const [updated] = await db
      .update(generations)
      .set({ isFavorite: !existing.isFavorite })
      .where(eq(generations.id, id))
      .returning();
    return updated;
  }

  async deleteGeneration(id: string): Promise<boolean> {
    const result = await db.delete(generations).where(eq(generations.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
