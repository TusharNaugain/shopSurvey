import { apiRequest } from "./queryClient";
import type { SurveyQuestion, SurveySession, SurveyResponse, InsertSurveySession, InsertSurveyResponse } from "@shared/schema";
import { nanoid } from "nanoid";

export const apiClient = {
  // Questions
  async getQuestions(): Promise<SurveyQuestion[]> {
    const response = await fetch('/api/questions');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return response.json();
  },

  // Sessions
  async createSession(totalQuestions: number): Promise<SurveySession> {
    const sessionData: InsertSurveySession = {
      id: `session_${Date.now()}_${nanoid(9)}`,
      totalQuestions,
      answeredQuestions: 0
    };
    
    const response = await apiRequest('POST', '/api/sessions', sessionData);
    return response.json();
  },

  async updateSession(sessionId: string, updates: Partial<SurveySession>): Promise<SurveySession> {
    const response = await apiRequest('PATCH', `/api/sessions/${sessionId}`, updates);
    return response.json();
  },

  // Responses
  async saveResponse(sessionId: string, questionId: string, answer: string | string[] | null | undefined): Promise<SurveyResponse> {
    const responseData: InsertSurveyResponse = {
      sessionId,
      questionId,
      answer
    };
    
    const response = await apiRequest('POST', '/api/responses', responseData);
    return response.json();
  },

  async getSessionResponses(sessionId: string): Promise<SurveyResponse[]> {
    const response = await fetch(`/api/sessions/${sessionId}/responses`);
    if (!response.ok) {
      throw new Error('Failed to fetch responses');
    }
    return response.json();
  },

  async getAllSessions(): Promise<SurveySession[]> {
    const response = await fetch('/api/sessions');
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    return response.json();
  },

  async getAllResponses(): Promise<SurveyResponse[]> {
    const response = await fetch('/api/responses');
    if (!response.ok) {
      throw new Error('Failed to fetch responses');
    }
    return response.json();
  }
};
