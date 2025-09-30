import { db } from "db";
import { surveyQuestions, surveyResponses, surveySessions } from "@shared/schema";
import type { 
  SurveyQuestion, 
  SurveyResponse, 
  SurveySession,
  InsertSurveyQuestion,
  InsertSurveyResponse,
  InsertSurveySession
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Questions
  getQuestions(): Promise<SurveyQuestion[]>;
  getQuestionById(id: string): Promise<SurveyQuestion | undefined>;
  createQuestion(question: InsertSurveyQuestion): Promise<SurveyQuestion>;
  updateQuestion(id: string, question: Partial<InsertSurveyQuestion>): Promise<SurveyQuestion | undefined>;
  deleteQuestion(id: string): Promise<boolean>;
  
  // Sessions
  createSession(session: InsertSurveySession): Promise<SurveySession>;
  getSessionById(id: string): Promise<SurveySession | undefined>;
  getAllSessions(): Promise<SurveySession[]>;
  updateSession(id: string, updates: Partial<SurveySession>): Promise<SurveySession | undefined>;
  
  // Responses
  createResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSessionResponses(sessionId: string): Promise<SurveyResponse[]>;
  getAllResponses(): Promise<SurveyResponse[]>;
}

export class DbStorage implements IStorage {
  // Questions
  async getQuestions(): Promise<SurveyQuestion[]> {
    const questions = await db.select().from(surveyQuestions).orderBy(surveyQuestions.order);
    return questions;
  }

  async getQuestionById(id: string): Promise<SurveyQuestion | undefined> {
    const [question] = await db.select().from(surveyQuestions).where(eq(surveyQuestions.id, id));
    return question;
  }

  async createQuestion(question: InsertSurveyQuestion): Promise<SurveyQuestion> {
    const id = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const [created] = await db.insert(surveyQuestions).values({ ...question, id }).returning();
    return created;
  }

  async updateQuestion(id: string, question: Partial<InsertSurveyQuestion>): Promise<SurveyQuestion | undefined> {
    const [updated] = await db.update(surveyQuestions)
      .set(question)
      .where(eq(surveyQuestions.id, id))
      .returning();
    return updated;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const result = await db.delete(surveyQuestions).where(eq(surveyQuestions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Sessions
  async createSession(session: InsertSurveySession): Promise<SurveySession> {
    const [created] = await db.insert(surveySessions).values(session).returning();
    return created;
  }

  async getSessionById(id: string): Promise<SurveySession | undefined> {
    const [session] = await db.select().from(surveySessions).where(eq(surveySessions.id, id));
    return session;
  }

  async getAllSessions(): Promise<SurveySession[]> {
    const sessions = await db.select().from(surveySessions).orderBy(desc(surveySessions.startedAt));
    return sessions;
  }

  async updateSession(id: string, updates: Partial<SurveySession>): Promise<SurveySession | undefined> {
    const [updated] = await db.update(surveySessions)
      .set(updates)
      .where(eq(surveySessions.id, id))
      .returning();
    return updated;
  }

  // Responses
  async createResponse(response: InsertSurveyResponse): Promise<SurveyResponse> {
    const [created] = await db.insert(surveyResponses).values(response).returning();
    return created;
  }

  async getSessionResponses(sessionId: string): Promise<SurveyResponse[]> {
    const responses = await db.select().from(surveyResponses).where(eq(surveyResponses.sessionId, sessionId));
    return responses;
  }

  async getAllResponses(): Promise<SurveyResponse[]> {
    const responses = await db.select().from(surveyResponses).orderBy(desc(surveyResponses.createdAt));
    return responses;
  }
}

export const storage = new DbStorage();
