import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { 
  yaDirectRequestSchema, 
  emailSocialRequestSchema, 
  loyaltyRequestSchema 
} from "@shared/schema";
import {
  generateTextYandex,
  buildYaDirectPrompt,
  buildEmailSocialPrompt,
  buildLoyaltyPrompt,
  parseYaDirectResponse,
  parseEmailSocialResponse,
  parseLoyaltyResponse,
  isRefusalResponse,
} from "./lib/yandexClient";
import {
  validateYaDirectAd,
  buildRefinementPrompt,
  parseRefinedAd,
} from "./lib/yaDirectValidation";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/generate/yadirect", async (req, res) => {
    try {
      const parsed = yaDirectRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Ошибка валидации", 
          details: parsed.error.errors 
        });
      }

      const prompt = buildYaDirectPrompt(parsed.data);
      const response = await generateTextYandex(prompt);
      let results = parseYaDirectResponse(response);

      if (results.length === 0) {
        // Check if YandexGPT refused to generate
        if (isRefusalResponse(response)) {
          return res.status(400).json({ 
            error: "Не удалось сгенерировать объявление",
            details: "Попробуйте изменить описание продукта или ключевые слова и повторить генерацию."
          });
        }
        
        const fallbackResults = [{
          title: "Результат генерации",
          text: response.trim()
        }];
        
        await storage.createGeneration({
          module: "yadirect",
          inputJson: JSON.stringify(parsed.data),
          outputText: response,
          isFavorite: false,
        });

        return res.json({ results: fallbackResults, raw: response });
      }

      const MAX_REFINEMENT_ATTEMPTS = 5;
      const refinedResults: Array<{ title: string; text: string }> = [];

      for (const result of results) {
        let currentTitle = result.title;
        let currentText = result.text;
        let attempts = 0;
        let lastValidation = validateYaDirectAd(
          currentTitle,
          currentText,
          parsed.data.keywords,
          parsed.data.usp || ""
        );

        while (!lastValidation.isValid && attempts < MAX_REFINEMENT_ATTEMPTS) {
          const allIssues = [...lastValidation.errors, ...lastValidation.warnings];
          
          const refinementPrompt = buildRefinementPrompt(
            currentTitle,
            currentText,
            allIssues,
            {
              product: parsed.data.product,
              keywords: parsed.data.keywords,
              usp: parsed.data.usp,
            }
          );

          try {
            const refinedResponse = await generateTextYandex(refinementPrompt);
            const refined = parseRefinedAd(refinedResponse);

            if (refined) {
              currentTitle = refined.title;
              currentText = refined.text;
              lastValidation = validateYaDirectAd(
                currentTitle,
                currentText,
                parsed.data.keywords,
                parsed.data.usp || ""
              );
            } else {
              break;
            }
          } catch (e) {
            console.error("Refinement attempt failed:", e);
            break;
          }

          attempts++;
        }

        refinedResults.push({ title: currentTitle, text: currentText });
      }

      await storage.createGeneration({
        module: "yadirect",
        inputJson: JSON.stringify(parsed.data),
        outputText: refinedResults.map(r => `${r.title}\n${r.text}`).join("\n\n"),
        isFavorite: false,
      });

      res.json({ results: refinedResults });
    } catch (error: any) {
      console.error("YaDirect generation error:", error);
      res.status(500).json({ 
        error: error.message || "Ошибка генерации. Попробуйте позже." 
      });
    }
  });

  app.post("/api/generate/email-social", async (req, res) => {
    try {
      const parsed = emailSocialRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Ошибка валидации", 
          details: parsed.error.errors 
        });
      }

      const prompt = buildEmailSocialPrompt(parsed.data);
      const response = await generateTextYandex(prompt);
      const results = parseEmailSocialResponse(response);

      if (results.length === 0) {
        const fallbackResults = [{
          text: response.trim(),
          imageIdea: ""
        }];
        
        await storage.createGeneration({
          module: "email_social",
          inputJson: JSON.stringify(parsed.data),
          outputText: response,
          isFavorite: false,
        });

        return res.json({ results: fallbackResults, raw: response });
      }

      await storage.createGeneration({
        module: "email_social",
        inputJson: JSON.stringify(parsed.data),
        outputText: results.map(r => `${r.text}\n\nИдея для картинки: ${r.imageIdea}`).join("\n\n---\n\n"),
        isFavorite: false,
      });

      res.json({ results });
    } catch (error: any) {
      console.error("Email/Social generation error:", error);
      res.status(500).json({ 
        error: error.message || "Ошибка генерации. Попробуйте позже." 
      });
    }
  });

  app.post("/api/generate/loyalty", async (req, res) => {
    try {
      const parsed = loyaltyRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Ошибка валидации", 
          details: parsed.error.errors 
        });
      }

      const prompt = buildLoyaltyPrompt(parsed.data);
      const response = await generateTextYandex(prompt);
      const results = parseLoyaltyResponse(response, parsed.data.customerName);

      if (results.length === 0) {
        const fallbackResults = [{ text: response.trim() }];
        
        await storage.createGeneration({
          module: "loyalty",
          inputJson: JSON.stringify(parsed.data),
          outputText: response,
          isFavorite: false,
        });

        return res.json({ results: fallbackResults, raw: response });
      }

      await storage.createGeneration({
        module: "loyalty",
        inputJson: JSON.stringify(parsed.data),
        outputText: results.map(r => r.text).join("\n\n---\n\n"),
        isFavorite: false,
      });

      res.json({ results });
    } catch (error: any) {
      console.error("Loyalty generation error:", error);
      res.status(500).json({ 
        error: error.message || "Ошибка генерации. Попробуйте позже." 
      });
    }
  });

  app.get("/api/history", async (req, res) => {
    try {
      const { module, search, favoritesOnly } = req.query;
      
      const generations = await storage.getGenerations({
        module: module as string | undefined,
        search: search as string | undefined,
        favoritesOnly: favoritesOnly === "true",
      });

      res.json({ generations });
    } catch (error: any) {
      console.error("History fetch error:", error);
      res.status(500).json({ error: "Ошибка загрузки истории" });
    }
  });

  app.patch("/api/history/:id/favorite", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.toggleFavorite(id);
      
      if (!updated) {
        return res.status(404).json({ error: "Запись не найдена" });
      }

      res.json({ generation: updated });
    } catch (error: any) {
      console.error("Toggle favorite error:", error);
      res.status(500).json({ error: "Ошибка обновления" });
    }
  });

  app.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGeneration(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Запись не найдена" });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete generation error:", error);
      res.status(500).json({ error: "Ошибка удаления" });
    }
  });

  return httpServer;
}
