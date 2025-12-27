import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertProjectSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const DEFAULT_PROJECTS = [
  { name: "MiniPlay.studio", description: "Cognition gaming platform", highlight: "500K plays / 1 week", url: "https://miniplay.studio", sortOrder: 0 },
  { name: "nanoPay.live", description: "Digital financial utility", highlight: "3K+ wallets / 2 weeks", url: "https://nanopay.live", sortOrder: 1 },
  { name: "MaxFlow.one", description: "Signal computation engine", highlight: "91% avg retention", url: "https://maxflow.one", sortOrder: 2 },
  { name: "Tempos.bet", description: "Conviction markets", highlight: "Experiment", url: "https://tempos.bet", sortOrder: 3 },
  { name: "inspecTor.markets", description: "Tor network analysis", highlight: "Live", url: "https://inspector.markets", sortOrder: 4 },
  { name: "x4pp.xyz", description: "Attention-driven inbox", highlight: "Prototype", url: "https://x4pp.xyz", sortOrder: 5 },
  { name: "ProsperON.market", description: "Tokenomics utility OS", highlight: "Beta", url: "https://prosperon.market", sortOrder: 6 },
  { name: "TimeCapsule.news", description: "Time-bound content", highlight: "Live", url: "https://timecapsule.news", sortOrder: 7 },
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed projects on startup if empty
  const existingProjects = await storage.getAllProjects();
  if (existingProjects.length === 0) {
    for (const project of DEFAULT_PROJECTS) {
      await storage.createProject(project);
    }
    console.log("Seeded default projects");
  }
  
  // Submit interest form
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validated = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validated);
      res.status(201).json({ success: true, inquiry });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: validationError.message 
        });
      }
      console.error("Error creating inquiry:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to submit inquiry" 
      });
    }
  });

  // Get all inquiries (for internal review)
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json({ success: true, inquiries });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch inquiries" 
      });
    }
  });

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json({ success: true, projects });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ success: false, error: "Failed to fetch projects" });
    }
  });

  // Create a project
  app.post("/api/projects", async (req, res) => {
    try {
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated);
      res.status(201).json({ success: true, project });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ success: false, error: validationError.message });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ success: false, error: "Failed to create project" });
    }
  });

  // Update a project
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.updateProject(id, req.body);
      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }
      res.json({ success: true, project });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ success: false, error: "Failed to update project" });
    }
  });

  // Delete a project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ success: false, error: "Failed to delete project" });
    }
  });

  return httpServer;
}
