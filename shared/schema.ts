import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const surveyQuestions = pgTable("survey_questions", {
  id: varchar("id").primaryKey(),
  text: text("text").notNull(),
  type: varchar("type").notNull(), // 'rating_5', 'rating_10', 'text'
  required: integer("required").default(1), // 1 for true, 0 for false
  order: integer("order").notNull(),
});

export const surveyResponses = pgTable("survey_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  questionId: varchar("question_id").notNull(),
  answer: text("answer"), // stored as string for all types
  createdAt: timestamp("created_at").defaultNow(),
});

export const surveySessions = pgTable("survey_sessions", {
  id: varchar("id").primaryKey(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  totalQuestions: integer("total_questions").notNull(),
  answeredQuestions: integer("answered_questions").default(0),
});

export const insertSurveyQuestionSchema = createInsertSchema(surveyQuestions).omit({
  id: true,
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  createdAt: true,
});

export const insertSurveySessionSchema = createInsertSchema(surveySessions).omit({
  startedAt: true,
  completedAt: true,
});

export type SurveyQuestion = typeof surveyQuestions.$inferSelect;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type SurveySession = typeof surveySessions.$inferSelect;
export type InsertSurveyQuestion = z.infer<typeof insertSurveyQuestionSchema>;
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type InsertSurveySession = z.infer<typeof insertSurveySessionSchema>;
