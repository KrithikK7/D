import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChapterSchema, insertSectionSchema, insertPageSchema, insertReadingProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Chapter routes
  app.get("/api/chapters", async (req, res) => {
    try {
      const allChapters = await storage.getChapters();
      res.json(allChapters);
    } catch (error) {
      console.error("Get chapters error:", error);
      res.status(500).json({ error: "Failed to fetch chapters" });
    }
  });

  app.get("/api/chapters/:id", async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.id);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      console.error("Get chapter error:", error);
      res.status(500).json({ error: "Failed to fetch chapter" });
    }
  });

  app.post("/api/chapters", async (req, res) => {
    try {
      const validatedData = insertChapterSchema.parse(req.body);
      const chapter = await storage.createChapter(validatedData);
      res.status(201).json(chapter);
    } catch (error) {
      console.error("Create chapter error:", error);
      res.status(400).json({ error: "Invalid chapter data" });
    }
  });

  app.patch("/api/chapters/:id", async (req, res) => {
    try {
      const chapter = await storage.updateChapter(req.params.id, req.body);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      console.error("Update chapter error:", error);
      res.status(500).json({ error: "Failed to update chapter" });
    }
  });

  app.delete("/api/chapters/:id", async (req, res) => {
    try {
      await storage.deleteChapter(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Delete chapter error:", error);
      res.status(500).json({ error: "Failed to delete chapter" });
    }
  });

  // Section routes
  app.get("/api/chapters/:chapterId/sections", async (req, res) => {
    try {
      const allSections = await storage.getSectionsByChapter(req.params.chapterId);
      res.json(allSections);
    } catch (error) {
      console.error("Get sections error:", error);
      res.status(500).json({ error: "Failed to fetch sections" });
    }
  });

  app.get("/api/sections/:id", async (req, res) => {
    try {
      const section = await storage.getSection(req.params.id);
      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Get section error:", error);
      res.status(500).json({ error: "Failed to fetch section" });
    }
  });

  app.post("/api/sections", async (req, res) => {
    try {
      const validatedData = insertSectionSchema.parse(req.body);
      const section = await storage.createSection(validatedData);
      res.status(201).json(section);
    } catch (error) {
      console.error("Create section error:", error);
      res.status(400).json({ error: "Invalid section data" });
    }
  });

  app.patch("/api/sections/:id", async (req, res) => {
    try {
      const section = await storage.updateSection(req.params.id, req.body);
      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Update section error:", error);
      res.status(500).json({ error: "Failed to update section" });
    }
  });

  app.delete("/api/sections/:id", async (req, res) => {
    try {
      await storage.deleteSection(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Delete section error:", error);
      res.status(500).json({ error: "Failed to delete section" });
    }
  });

  // Page routes
  app.get("/api/sections/:sectionId/pages", async (req, res) => {
    try {
      const allPages = await storage.getPagesBySection(req.params.sectionId);
      res.json(allPages);
    } catch (error) {
      console.error("Get pages error:", error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/pages/:id", async (req, res) => {
    try {
      const page = await storage.getPage(req.params.id);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Get page error:", error);
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.post("/api/pages", async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(validatedData);
      res.status(201).json(page);
    } catch (error) {
      console.error("Create page error:", error);
      res.status(400).json({ error: "Invalid page data" });
    }
  });

  app.patch("/api/pages/:id", async (req, res) => {
    try {
      const page = await storage.updatePage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Update page error:", error);
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/pages/:id", async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Delete page error:", error);
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // Reading progress routes
  app.get("/api/reading-progress", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const progress = await storage.getUserReadingProgress(userId || null);
      res.json(progress);
    } catch (error) {
      console.error("Get reading progress error:", error);
      res.status(500).json({ error: "Failed to fetch reading progress" });
    }
  });

  app.get("/api/reading-progress/last", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const progress = await storage.getLastReadSection(userId || null);
      res.json(progress || null);
    } catch (error) {
      console.error("Get last read error:", error);
      res.status(500).json({ error: "Failed to fetch last read section" });
    }
  });

  app.post("/api/reading-progress", async (req, res) => {
    try {
      const validatedData = insertReadingProgressSchema.parse(req.body);
      const progress = await storage.upsertReadingProgress(validatedData);
      res.json(progress);
    } catch (error) {
      console.error("Save reading progress error:", error);
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
