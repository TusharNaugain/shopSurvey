import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSurveyQuestionSchema, 
  insertSurveyResponseSchema, 
  insertSurveySessionSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Questions endpoints
  app.get("/api/questions", async (_req, res) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const validatedData = insertSurveyQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(validatedData);
      res.status(201).json(question);
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(400).json({ error: "Invalid question data" });
    }
  });

  app.put("/api/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertSurveyQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuestion(id, validatedData);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(400).json({ error: "Invalid question data" });
    }
  });

  app.delete("/api/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteQuestion(id);
      if (!success) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ error: "Failed to delete question" });
    }
  });

  // Sessions endpoints
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSurveySessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateSession(id, req.body);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error('Error updating session:', error);
      res.status(400).json({ error: "Failed to update session" });
    }
  });

  // Responses endpoints
  app.post("/api/responses", async (req, res) => {
    try {
      const validatedData = insertSurveyResponseSchema.parse(req.body);
      const response = await storage.createResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating response:', error);
      res.status(400).json({ error: "Invalid response data" });
    }
  });

  app.get("/api/responses", async (_req, res) => {
    try {
      const responses = await storage.getAllResponses();
      res.json(responses);
    } catch (error) {
      console.error('Error fetching responses:', error);
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  });

  app.get("/api/sessions/:id/responses", async (req, res) => {
    try {
      const { id } = req.params;
      const responses = await storage.getSessionResponses(id);
      res.json(responses);
    } catch (error) {
      console.error('Error fetching session responses:', error);
      res.status(500).json({ error: "Failed to fetch session responses" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
