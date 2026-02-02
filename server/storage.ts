import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { inquiries, projects, metricsSnapshots, type Inquiry, type InsertInquiry, type Project, type InsertProject, type MetricsSnapshot, type InsertMetricsSnapshot } from "@shared/schema";

export interface IStorage {
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;
  createProject(project: InsertProject): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | null>;
  deleteProject(id: string): Promise<boolean>;
  createMetricsSnapshot(snapshot: InsertMetricsSnapshot): Promise<MetricsSnapshot>;
  getMetricsSnapshots(projectId: string, limit?: number): Promise<MetricsSnapshot[]>;
  getLatestMetricsSnapshot(projectId: string): Promise<MetricsSnapshot | null>;
  getAllLatestMetrics(): Promise<MetricsSnapshot[]>;
}

export class DatabaseStorage implements IStorage {
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return db.select().from(inquiries).orderBy(inquiries.createdAt);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(projects.sortOrder);
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | null> {
    const [updated] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updated || null;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async createMetricsSnapshot(snapshot: InsertMetricsSnapshot): Promise<MetricsSnapshot> {
    const [newSnapshot] = await db.insert(metricsSnapshots).values(snapshot).returning();
    return newSnapshot;
  }

  async getMetricsSnapshots(projectId: string, limit: number = 100): Promise<MetricsSnapshot[]> {
    return db.select().from(metricsSnapshots)
      .where(eq(metricsSnapshots.projectId, projectId))
      .orderBy(desc(metricsSnapshots.timestamp))
      .limit(limit);
  }

  async getLatestMetricsSnapshot(projectId: string): Promise<MetricsSnapshot | null> {
    const [snapshot] = await db.select().from(metricsSnapshots)
      .where(eq(metricsSnapshots.projectId, projectId))
      .orderBy(desc(metricsSnapshots.timestamp))
      .limit(1);
    return snapshot || null;
  }

  async getAllLatestMetrics(): Promise<MetricsSnapshot[]> {
    const allProjects = await this.getAllProjects();
    const snapshots: MetricsSnapshot[] = [];
    for (const project of allProjects) {
      const latest = await this.getLatestMetricsSnapshot(project.id);
      if (latest) snapshots.push(latest);
    }
    return snapshots;
  }
}

export const storage = new DatabaseStorage();
