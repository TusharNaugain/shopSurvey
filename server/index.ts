import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize Firebase Admin SDK
  const { initializeApp, applicationDefault, cert } = await import("firebase-admin/app");
  try {
    if (!globalThis.__FIREBASE_INITIALIZED__) {
      const firestoreProjectId = process.env.FIRESTORE_PROJECT_ID;
      const firestoreClientEmail = process.env.FIRESTORE_CLIENT_EMAIL;
      const firestorePrivateKey = process.env.FIRESTORE_PRIVATE_KEY;

      if (firestoreProjectId && firestoreClientEmail && firestorePrivateKey) {
        const privateKey = firestorePrivateKey.replace(/\\n/g, '\n');
        const credential = {
          projectId: firestoreProjectId,
          clientEmail: firestoreClientEmail,
          privateKey,
        };
        initializeApp({ credential: cert(credential), projectId: firestoreProjectId });
      } else {
        const jsonEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        const b64Env = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
        const pathEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const fallbackProjectId = process.env.FIREBASE_PROJECT_ID;

        if (jsonEnv) {
          const json = JSON.parse(jsonEnv);
          const projectId = json.project_id || fallbackProjectId;
          if (projectId && !process.env.GOOGLE_CLOUD_PROJECT) process.env.GOOGLE_CLOUD_PROJECT = projectId;
          initializeApp({ credential: cert(json) as any, projectId });
        } else if (b64Env) {
          const decoded = Buffer.from(b64Env, "base64").toString("utf-8");
          const json = JSON.parse(decoded);
          const projectId = json.project_id || fallbackProjectId;
          if (projectId && !process.env.GOOGLE_CLOUD_PROJECT) process.env.GOOGLE_CLOUD_PROJECT = projectId;
          initializeApp({ credential: cert(json) as any, projectId });
        } else if (pathEnv) {
          const fs = await import("fs");
          const raw = fs.readFileSync(pathEnv, "utf-8");
          const json = JSON.parse(raw);
          const projectId = json.project_id || fallbackProjectId;
          if (projectId && !process.env.GOOGLE_CLOUD_PROJECT) process.env.GOOGLE_CLOUD_PROJECT = projectId;
          initializeApp({ credential: cert(json) as any, projectId });
        } else {
          const projectId = fallbackProjectId;
          if (projectId && !process.env.GOOGLE_CLOUD_PROJECT) process.env.GOOGLE_CLOUD_PROJECT = projectId;
          initializeApp({ credential: applicationDefault(), projectId });
        }
      }
      // @ts-ignore
      globalThis.__FIREBASE_INITIALIZED__ = true;
    }
  } catch (e) {
    console.error("Failed to initialize Firebase Admin SDK", e);
    throw e;
  }

  await seedDatabase();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "127.0.0.1",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
