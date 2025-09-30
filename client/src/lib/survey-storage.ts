import { SurveyQuestion, SurveyResponse, SurveySession } from "@shared/schema";

const STORAGE_KEYS = {
  QUESTIONS: 'survey_questions',
  RESPONSES: 'survey_responses',
  SESSIONS: 'survey_sessions',
  CURRENT_SESSION: 'current_session'
};

// Default questions as specified in the requirements
const DEFAULT_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'satisfaction_products',
    text: 'How satisfied are you with our products?',
    type: 'rating_5',
    required: 1,
    order: 1
  },
  {
    id: 'price_fairness',
    text: 'How fair are the prices compared to similar retailers?',
    type: 'rating_5',
    required: 1,
    order: 2
  },
  {
    id: 'value_money',
    text: 'How satisfied are you with the value for money of your purchase?',
    type: 'rating_5',
    required: 1,
    order: 3
  },
  {
    id: 'recommendation',
    text: 'On a scale of 1-10 how would you recommend us to your friends and family?',
    type: 'rating_10',
    required: 1,
    order: 4
  },
  {
    id: 'service_improvement',
    text: 'What could we do to improve our service?',
    type: 'text',
    required: 0,
    order: 5
  }
];

class SurveyStorage {
  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Questions management
  getQuestions(): SurveyQuestion[] {
    const questions = this.getFromStorage<SurveyQuestion[]>(STORAGE_KEYS.QUESTIONS, []);
    if (questions.length === 0) {
      this.saveToStorage(STORAGE_KEYS.QUESTIONS, DEFAULT_QUESTIONS);
      return DEFAULT_QUESTIONS;
    }
    return questions.sort((a, b) => a.order - b.order);
  }

  addQuestion(question: Omit<SurveyQuestion, 'id'>): SurveyQuestion {
    const questions = this.getQuestions();
    const newQuestion: SurveyQuestion = {
      ...question,
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    questions.push(newQuestion);
    this.saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
    return newQuestion;
  }

  // Sessions management
  createSession(): SurveySession {
    const questions = this.getQuestions();
    const session: SurveySession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startedAt: new Date(),
      completedAt: null,
      totalQuestions: questions.length,
      answeredQuestions: 0
    };

    const sessions = this.getFromStorage<SurveySession[]>(STORAGE_KEYS.SESSIONS, []);
    sessions.push(session);
    this.saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
    this.saveToStorage(STORAGE_KEYS.CURRENT_SESSION, session);
    
    return session;
  }

  getCurrentSession(): SurveySession | null {
    return this.getFromStorage<SurveySession | null>(STORAGE_KEYS.CURRENT_SESSION, null);
  }

  updateSession(sessionId: string, updates: Partial<SurveySession>): SurveySession | null {
    const sessions = this.getFromStorage<SurveySession[]>(STORAGE_KEYS.SESSIONS, []);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) return null;

    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
    this.saveToStorage(STORAGE_KEYS.SESSIONS, sessions);

    // Update current session if it's the one being updated
    const currentSession = this.getCurrentSession();
    if (currentSession?.id === sessionId) {
      this.saveToStorage(STORAGE_KEYS.CURRENT_SESSION, sessions[sessionIndex]);
    }

    return sessions[sessionIndex];
  }

  completeSession(sessionId: string): SurveySession | null {
    return this.updateSession(sessionId, { 
      completedAt: new Date(),
      answeredQuestions: this.getSessionResponses(sessionId).length
    });
  }

  clearCurrentSession(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  // Responses management
  saveResponse(response: Omit<SurveyResponse, 'id' | 'createdAt'>): SurveyResponse {
    const responses = this.getFromStorage<SurveyResponse[]>(STORAGE_KEYS.RESPONSES, []);
    
    // Remove existing response for this question in this session
    const filteredResponses = responses.filter(
      r => !(r.sessionId === response.sessionId && r.questionId === response.questionId)
    );

    const newResponse: SurveyResponse = {
      ...response,
      id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    filteredResponses.push(newResponse);
    this.saveToStorage(STORAGE_KEYS.RESPONSES, filteredResponses);
    
    return newResponse;
  }

  getSessionResponses(sessionId: string): SurveyResponse[] {
    const responses = this.getFromStorage<SurveyResponse[]>(STORAGE_KEYS.RESPONSES, []);
    return responses.filter(r => r.sessionId === sessionId);
  }

  getQuestionResponse(sessionId: string, questionId: string): SurveyResponse | null {
    const responses = this.getSessionResponses(sessionId);
    return responses.find(r => r.questionId === questionId) || null;
  }

  // Analytics and admin functions
  getAllSessions(): SurveySession[] {
    return this.getFromStorage<SurveySession[]>(STORAGE_KEYS.SESSIONS, []);
  }

  getAllResponses(): SurveyResponse[] {
    return this.getFromStorage<SurveyResponse[]>(STORAGE_KEYS.RESPONSES, []);
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const surveyStorage = new SurveyStorage();
