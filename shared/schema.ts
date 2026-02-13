import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  highlight: text("highlight").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  metricsEndpoint: text("metrics_endpoint"),
  metricsApiKey: text("metrics_api_key"),
  showUsersMetrics: boolean("show_users_metrics").notNull().default(true),
  showEngagementMetrics: boolean("show_engagement_metrics").notNull().default(true),
  showRevenueMetrics: boolean("show_revenue_metrics").notNull().default(true),
  showOnchainMetrics: boolean("show_onchain_metrics").notNull().default(true),
  showOnLandingPage: boolean("show_on_landing_page").notNull().default(true),
  chartColor: text("chart_color"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const metricsSnapshots = pgTable("metrics_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metrics: jsonb("metrics").notNull(),
});

export const insertMetricsSnapshotSchema = createInsertSchema(metricsSnapshots).omit({
  id: true,
  timestamp: true,
});

export type InsertMetricsSnapshot = z.infer<typeof insertMetricsSnapshotSchema>;
export type MetricsSnapshot = typeof metricsSnapshots.$inferSelect;

export const metricsSchema = z.object({
  app: z.string(),
  timestamp: z.string(),
  users: z.object({
    total: z.number(),
    daily_active: z.number(),
    weekly_active: z.number(),
    monthly_active: z.number(),
    paying: z.number(),
  }),
  engagement: z.object({
    key_actions: z.number(),
    sessions_today: z.number(),
  }),
  revenue: z.object({
    total_payments: z.number(),
    net_income: z.number(),
    currency: z.string(),
  }),
  onchain: z.object({
    transactions: z.number(),
    volume: z.number(),
  }),
});

export type Metrics = z.infer<typeof metricsSchema>;

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: varchar("role", { length: 50 }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization"),
  exploring: text("exploring").notNull(),
  links: text("links"),
  consent: text("consent").notNull().default("true"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
