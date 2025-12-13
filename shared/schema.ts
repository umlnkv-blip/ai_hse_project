import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generations = pgTable("generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  module: text("module").notNull(),
  inputJson: text("input_json").notNull(),
  outputText: text("output_text").notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGenerationSchema = createInsertSchema(generations).omit({
  id: true,
  createdAt: true,
});

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;

export const yaDirectRequestSchema = z.object({
  product: z.string().min(1, "Укажите продукт или услугу"),
  audience: z.string().min(1, "Укажите целевую аудиторию"),
  keywords: z.string().min(1, "Укажите ключевые слова"),
  usp: z.string().optional(),
  tone: z.enum(["neutral", "friendly", "expert", "emotional"]),
  count: z.number().min(1).max(10),
});

export type YaDirectRequest = z.infer<typeof yaDirectRequestSchema>;

export const emailSocialRequestSchema = z.object({
  channel: z.enum(["email", "instagram_post", "instagram_stories", "vk", "telegram"]),
  goal: z.enum(["welcome", "promo", "reactivation", "digest", "educational"]),
  customerProfile: z.string().min(1, "Укажите портрет клиента"),
  productDescription: z.string().min(1, "Укажите описание продукта"),
  tone: z.enum(["friendly", "expert", "inspiring", "provocative"]),
});

export type EmailSocialRequest = z.infer<typeof emailSocialRequestSchema>;

export const loyaltyRequestSchema = z.object({
  scenario: z.enum(["birthday", "personal_offer", "reactivation"]),
  customerName: z.string().min(1, "Укажите имя клиента"),
  purchaseHistory: z.string().optional(),
  offer: z.string().min(1, "Укажите предложение"),
  campaignGoal: z.string().optional(),
});

export type LoyaltyRequest = z.infer<typeof loyaltyRequestSchema>;
