import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertProjectSchema, metricsSchema, type MetricsSnapshot } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

type MetricsData = z.infer<typeof metricsSchema>;

function isEmptyMetrics(metrics: MetricsData): boolean {
  return (
    metrics.users.total === 0 &&
    metrics.users.paying === 0 &&
    metrics.users.daily_active === 0 &&
    metrics.users.weekly_active === 0 &&
    metrics.users.monthly_active === 0 &&
    metrics.onchain.transactions === 0 &&
    metrics.onchain.volume === 0 &&
    metrics.engagement.key_actions === 0 &&
    metrics.engagement.sessions_today === 0 &&
    metrics.revenue.net_income === 0 &&
    metrics.revenue.total_payments === 0
  );
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

function validateMetricsData(metrics: MetricsData, previousSnapshot?: MetricsSnapshot | null): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for negative values where they shouldn't be
  if (metrics.users.total < 0) errors.push("Total users cannot be negative");
  if (metrics.users.daily_active < 0) errors.push("DAU cannot be negative");
  if (metrics.users.weekly_active < 0) errors.push("WAU cannot be negative");
  if (metrics.users.monthly_active < 0) errors.push("MAU cannot be negative");
  if (metrics.users.paying < 0) errors.push("Paying users cannot be negative");
  if (metrics.engagement.key_actions < 0) errors.push("Key actions cannot be negative");
  if (metrics.engagement.sessions_today < 0) errors.push("Sessions today cannot be negative");
  if (metrics.revenue.total_payments < 0) errors.push("Total payments cannot be negative");
  if (metrics.revenue.net_income < 0) errors.push("Net income cannot be negative");
  if (metrics.onchain.transactions < 0) errors.push("Transactions cannot be negative");
  if (metrics.onchain.volume < 0) errors.push("Volume cannot be negative");

  // Logical consistency checks
  if (metrics.users.daily_active > metrics.users.total) {
    warnings.push(`DAU (${metrics.users.daily_active}) exceeds total users (${metrics.users.total})`);
  }
  if (metrics.users.weekly_active > metrics.users.total) {
    warnings.push(`WAU (${metrics.users.weekly_active}) exceeds total users (${metrics.users.total})`);
  }
  if (metrics.users.monthly_active > metrics.users.total) {
    warnings.push(`MAU (${metrics.users.monthly_active}) exceeds total users (${metrics.users.total})`);
  }
  if (metrics.users.paying > metrics.users.total) {
    warnings.push(`Paying users (${metrics.users.paying}) exceeds total users (${metrics.users.total})`);
  }

  // Check for dramatic changes compared to previous snapshot
  if (previousSnapshot) {
    const prev = previousSnapshot.metrics as MetricsData;
    
    // Check for cumulative metrics decreasing (shouldn't happen for lifetime totals)
    if (metrics.users.total < prev.users.total) {
      warnings.push(`Total users decreased from ${prev.users.total} to ${metrics.users.total}`);
    }
    if (metrics.revenue.total_payments < prev.revenue.total_payments) {
      warnings.push(`Total payments decreased from ${prev.revenue.total_payments} to ${metrics.revenue.total_payments}`);
    }
    if (metrics.revenue.net_income < prev.revenue.net_income) {
      warnings.push(`Net income decreased from $${prev.revenue.net_income} to $${metrics.revenue.net_income}`);
    }
    if (metrics.onchain.transactions < prev.onchain.transactions) {
      warnings.push(`Transactions decreased from ${prev.onchain.transactions} to ${metrics.onchain.transactions}`);
    }

    // Check for dramatic increases (>500% in one snapshot)
    const checkDramaticIncrease = (name: string, current: number, previous: number) => {
      if (previous > 0 && current > previous * 6) {
        warnings.push(`${name} increased dramatically: ${previous} → ${current} (${Math.round((current / previous - 1) * 100)}%)`);
      }
    };

    checkDramaticIncrease("Total users", metrics.users.total, prev.users.total);
    checkDramaticIncrease("DAU", metrics.users.daily_active, prev.users.daily_active);
    checkDramaticIncrease("Revenue", metrics.revenue.net_income, prev.revenue.net_income);
    checkDramaticIncrease("Transactions", metrics.onchain.transactions, prev.onchain.transactions);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

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

      if (isEmptyMetrics(validated.data)) {
        return res.status(400).json({ success: false, error: "Skipped: all metrics are zero" });
      }

      // Get previous snapshot for comparison
      const previousSnapshot = await storage.getLatestMetricsSnapshot(id);
      const validation = validateMetricsData(validated.data, previousSnapshot);

      // Block if there are hard errors (like negative values)
      if (!validation.isValid) {
        return res.status(400).json({ 
          success: false, 
          error: "Metrics data validation failed", 
          errors: validation.errors,
          warnings: validation.warnings
        });
      }

      const snapshot = await storage.createMetricsSnapshot({
        projectId: id,
        metrics: validated.data,
      });

      // Return success with any warnings
      res.json({ 
        success: true, 
        snapshot, 
        warnings: validation.warnings.length > 0 ? validation.warnings : undefined 
      });
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
      const results: { projectId: string; success: boolean; error?: string; warnings?: string[] }[] = [];

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

          if (isEmptyMetrics(validated.data)) {
            results.push({ projectId: project.id, success: false, error: "Skipped: all metrics are zero" });
            continue;
          }

          // Get previous snapshot for comparison
          const previousSnapshot = await storage.getLatestMetricsSnapshot(project.id);
          const validation = validateMetricsData(validated.data, previousSnapshot);

          // Block if there are hard errors
          if (!validation.isValid) {
            results.push({ 
              projectId: project.id, 
              success: false, 
              error: `Validation failed: ${validation.errors.join(", ")}`,
              warnings: validation.warnings
            });
            continue;
          }

          await storage.createMetricsSnapshot({
            projectId: project.id,
            metrics: validated.data,
          });

          results.push({ 
            projectId: project.id, 
            success: true,
            warnings: validation.warnings.length > 0 ? validation.warnings : undefined
          });
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

  app.post("/api/metrics/fetch/:projectId", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }
      if (!project.metricsEndpoint) {
        return res.status(400).json({ success: false, error: "No metrics endpoint configured" });
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (project.metricsApiKey) {
        headers["Authorization"] = `Bearer ${project.metricsApiKey}`;
      }

      const response = await fetch(project.metricsEndpoint, { headers });
      if (!response.ok) {
        return res.json({ success: false, projectId: project.id, error: `HTTP ${response.status}` });
      }

      const data = await response.json();
      const validated = metricsSchema.safeParse(data);
      if (!validated.success) {
        return res.json({ success: false, projectId: project.id, error: "Invalid format" });
      }

      if (isEmptyMetrics(validated.data)) {
        return res.json({ success: false, projectId: project.id, error: "Skipped: all metrics are zero" });
      }

      const previousSnapshot = await storage.getLatestMetricsSnapshot(project.id);
      const validation = validateMetricsData(validated.data, previousSnapshot);

      if (!validation.isValid) {
        return res.json({
          success: false,
          projectId: project.id,
          error: `Validation failed: ${validation.errors.join(", ")}`,
          warnings: validation.warnings,
        });
      }

      await storage.createMetricsSnapshot({
        projectId: project.id,
        metrics: validated.data,
      });

      res.json({
        success: true,
        projectId: project.id,
        warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
      });
    } catch (error: any) {
      res.json({ success: false, projectId: req.params.projectId, error: error.message });
    }
  });

  // Public metrics endpoint (aggregated stats for landing page)
  app.get("/api/public-metrics", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      const trackedProjects = projects.filter(p => p.metricsEndpoint);
      const trackedProjectIds = new Set(trackedProjects.map(p => p.id));
      
      const latestSnapshots = await storage.getAllLatestMetrics();
      
      let totalUsers = 0;
      let totalTransactions = 0;
      
      for (const snapshot of latestSnapshots) {
        const metrics = snapshot.metrics as any;
        if (metrics) {
          totalUsers += metrics.users?.total || 0;
          totalTransactions += metrics.onchain?.transactions || 0;
        }
      }
      
      res.json({
        success: true,
        metrics: {
          totalUsers,
          trackedApps: trackedProjects.length,
          totalTransactions,
          trackedProjectIds: Array.from(trackedProjectIds),
        }
      });
    } catch (error) {
      console.error("Error fetching public metrics:", error);
      res.status(500).json({ success: false, error: "Failed to fetch public metrics" });
    }
  });

  // Delete a single metrics snapshot by ID
  app.delete("/api/metrics/snapshot/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMetricsSnapshot(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, error: "Snapshot not found" });
      }
    } catch (error) {
      console.error("Error deleting snapshot:", error);
      res.status(500).json({ success: false, error: "Failed to delete snapshot" });
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
