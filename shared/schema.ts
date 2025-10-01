import { z } from "zod";

export const surveyQuestionSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  type: z.enum(["rating_5", "rating_10", "text"]),
  required: z.number().int().default(1),
  order: z.number().int(),
});

export const surveyResponseSchema = z.object({
  id: z.string().optional(),
  sessionId: z.string(),
  questionId: z.string(),
  answer: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  createdAt: z.date().optional(),
});

export const surveySessionSchema = z.object({
  id: z.string().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional().nullable(),
  totalQuestions: z.number().int(),
  answeredQuestions: z.number().int().default(0),
});

export const insertSurveyQuestionSchema = surveyQuestionSchema.omit({ id: true });
export const insertSurveyResponseSchema = surveyResponseSchema.omit({ id: true, createdAt: true });
export const insertSurveySessionSchema = surveySessionSchema.omit({ startedAt: true, completedAt: true });

export type SurveyQuestion = z.infer<typeof surveyQuestionSchema> & { id: string };
export type SurveyResponse = z.infer<typeof surveyResponseSchema> & { id: string };
export type SurveySession = z.infer<typeof surveySessionSchema> & { id: string };
export type InsertSurveyQuestion = z.infer<typeof insertSurveyQuestionSchema>;
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type InsertSurveySession = z.infer<typeof insertSurveySessionSchema>;
