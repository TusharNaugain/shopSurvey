import type { 
  SurveyQuestion, 
  SurveyResponse, 
  SurveySession,
  InsertSurveyQuestion,
  InsertSurveyResponse,
  InsertSurveySession
} from "@shared/schema";
import { getFirestore } from "firebase-admin/firestore";

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
    const db = getFirestore();
    const snapshot = await db.collection("survey_questions").orderBy("order").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<SurveyQuestion, "id">) }));
  }

  async getQuestionById(id: string): Promise<SurveyQuestion | undefined> {
    const db = getFirestore();
    const doc = await db.collection("survey_questions").doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...(doc.data() as Omit<SurveyQuestion, "id">) };
  }

  async createQuestion(question: InsertSurveyQuestion): Promise<SurveyQuestion> {
    const db = getFirestore();
    const ref = await db.collection("survey_questions").add(question as any);
    const doc = await ref.get();
    return { id: doc.id, ...(doc.data() as Omit<SurveyQuestion, "id">) };
  }

  async updateQuestion(id: string, question: Partial<InsertSurveyQuestion>): Promise<SurveyQuestion | undefined> {
    const db = getFirestore();
    const ref = db.collection("survey_questions").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return undefined;
    await ref.set(question, { merge: true });
    const updated = await ref.get();
    return { id: updated.id, ...(updated.data() as Omit<SurveyQuestion, "id">) };
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const db = getFirestore();
    const ref = db.collection("survey_questions").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return false;
    await ref.delete();
    return true;
  }

  // Sessions
  async createSession(session: InsertSurveySession): Promise<SurveySession> {
    const db = getFirestore();
    const ref = await db.collection("survey_sessions").add(session as any);
    const doc = await ref.get();
    return { id: doc.id, ...(doc.data() as Omit<SurveySession, "id">) };
  }

  async getSessionById(id: string): Promise<SurveySession | undefined> {
    const db = getFirestore();
    const doc = await db.collection("survey_sessions").doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...(doc.data() as Omit<SurveySession, "id">) };
  }

  async getAllSessions(): Promise<SurveySession[]> {
    const db = getFirestore();
    const snapshot = await db.collection("survey_sessions").orderBy("startedAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<SurveySession, "id">) }));
  }

  async updateSession(id: string, updates: Partial<SurveySession>): Promise<SurveySession | undefined> {
    const db = getFirestore();
    const ref = db.collection("survey_sessions").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return undefined;
    await ref.set(updates, { merge: true });
    const updated = await ref.get();
    return { id: updated.id, ...(updated.data() as Omit<SurveySession, "id">) };
  }

  // Responses
  async createResponse(response: InsertSurveyResponse): Promise<SurveyResponse> {
    const db = getFirestore();
    const ref = await db.collection("survey_responses").add({ ...response, createdAt: new Date() } as any);
    const doc = await ref.get();
    return { id: doc.id, ...(doc.data() as Omit<SurveyResponse, "id">) };
  }

  async getSessionResponses(sessionId: string): Promise<SurveyResponse[]> {
    const db = getFirestore();
    const snapshot = await db.collection("survey_responses").where("sessionId", "==", sessionId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<SurveyResponse, "id">) }));
  }

  async getAllResponses(): Promise<SurveyResponse[]> {
    const db = getFirestore();
    const snapshot = await db.collection("survey_responses").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<SurveyResponse, "id">) }));
  }
}

export const storage = new DbStorage();
