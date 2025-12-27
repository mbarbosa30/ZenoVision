import { db } from "./db";
import { eq } from "drizzle-orm";
import { inquiries, projects, type Inquiry, type InsertInquiry, type Project, type InsertProject } from "@shared/schema";

export interface IStorage {
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;
  createProject(project: InsertProject): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | null>;
  deleteProject(id: string): Promise<boolean>;
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
}

export const storage = new DatabaseStorage();
