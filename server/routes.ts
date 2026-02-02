import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertProjectSchema, metricsSchema } from "@shared/schema";
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

  // Verify admin password
  app.post("/api/admin/verify", async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return res.status(500).json({ success: false, error: "Admin password not configured" });
    }
    
    if (password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Invalid password" });
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

  // Fetch metrics from a project's external API and store snapshot
  app.post("/api/projects/:id/fetch-metrics", async (req, res) => {
    try {
      const { id } = req.params;
      const projects = await storage.getAllProjects();
      const project = projects.find(p => p.id === id);
      
      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }
      
      if (!project.metricsEndpoint) {
        return res.status(400).json({ success: false, error: "No metrics endpoint configured for this project" });
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (project.metricsApiKey) {
        headers["Authorization"] = `Bearer ${project.metricsApiKey}`;
      }

      const response = await fetch(project.metricsEndpoint, { headers });
      
      if (!response.ok) {
        return res.status(502).json({ success: false, error: `Failed to fetch metrics: ${response.status}` });
      }

      const data = await response.json();
      const validated = metricsSchema.safeParse(data);
      
      if (!validated.success) {
        return res.status(400).json({ success: false, error: "Invalid metrics format from external API", details: validated.error.issues });
      }

      const snapshot = await storage.createMetricsSnapshot({
        projectId: id,
        metrics: validated.data,
      });

      res.json({ success: true, snapshot });
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to fetch metrics" });
    }
  });

  // Get metrics history for a project
  app.get("/api/projects/:id/metrics", async (req, res) => {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;
      const snapshots = await storage.getMetricsSnapshots(id, limit);
      res.json({ success: true, snapshots });
    } catch (error) {
      console.error("Error fetching metrics history:", error);
      res.status(500).json({ success: false, error: "Failed to fetch metrics history" });
    }
  });

  // Get latest metrics for all projects
  app.get("/api/metrics/latest", async (req, res) => {
    try {
      const snapshots = await storage.getAllLatestMetrics();
      res.json({ success: true, snapshots });
    } catch (error) {
      console.error("Error fetching latest metrics:", error);
      res.status(500).json({ success: false, error: "Failed to fetch latest metrics" });
    }
  });

  // Get all historical metrics (for dashboard charts)
  app.get("/api/metrics/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const snapshots = await storage.getAllMetricsHistory(limit);
      res.json({ success: true, snapshots });
    } catch (error) {
      console.error("Error fetching metrics history:", error);
      res.status(500).json({ success: false, error: "Failed to fetch metrics history" });
    }
  });

  // Fetch metrics for all projects with configured endpoints
  app.post("/api/metrics/fetch-all", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      const results: { projectId: string; success: boolean; error?: string }[] = [];

      for (const project of projects) {
        if (!project.metricsEndpoint) continue;

        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };
          
          if (project.metricsApiKey) {
            headers["Authorization"] = `Bearer ${project.metricsApiKey}`;
          }

          const response = await fetch(project.metricsEndpoint, { headers });
          
          if (!response.ok) {
            results.push({ projectId: project.id, success: false, error: `HTTP ${response.status}` });
            continue;
          }

          const data = await response.json();
          const validated = metricsSchema.safeParse(data);
          
          if (!validated.success) {
            results.push({ projectId: project.id, success: false, error: "Invalid format" });
            continue;
          }

          await storage.createMetricsSnapshot({
            projectId: project.id,
            metrics: validated.data,
          });

          results.push({ projectId: project.id, success: true });
        } catch (err: any) {
          results.push({ projectId: project.id, success: false, error: err.message });
        }
      }

      res.json({ success: true, results });
    } catch (error) {
      console.error("Error fetching all metrics:", error);
      res.status(500).json({ success: false, error: "Failed to fetch metrics" });
    }
  });

  // Delete all metrics snapshots (reset)
  app.delete("/api/metrics", async (req, res) => {
    try {
      const deleted = await storage.deleteAllMetricsSnapshots();
      res.json({ success: true, deleted });
    } catch (error) {
      console.error("Error deleting metrics:", error);
      res.status(500).json({ success: false, error: "Failed to delete metrics" });
    }
  });

  return httpServer;
}
