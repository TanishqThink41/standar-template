import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// File schema
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(), // pending, processing, converted, error
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
});

// Workflow schema
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
});

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users);
export const insertFileSchema = createInsertSchema(files);
export const insertWorkflowSchema = createInsertSchema(workflows);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;
