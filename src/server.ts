import express, { NextFunction, Request, Response } from "express";
import { createDatabase } from "./db/database.js";
import { SqliteAvatarRepository } from "./db/avatarRepository.js";
import { InMemoryNameGenerator } from "./services/names/inMemoryNameGenerator.js";
import { AvatarService } from "./services/avatarService.js";
import { createAvatarRouter } from "./routes/avatarRoutes.js";

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static("public"));

// Enable CORS for browser access
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (_req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const db = createDatabase();
const repository = new SqliteAvatarRepository(db);
const nameGenerator = new InMemoryNameGenerator();
const avatarService = new AvatarService(nameGenerator, repository);

app.get("/api", (_req, res) => {
  res.json({
    name: "Oripheon API",
    version: "1.0.0",
    description: "Mythic AI avatar generator backend",
    endpoints: {
      health: "GET /health",
      avatars: {
        generate: "POST /avatars/generate",
        list: "GET /avatars?limit=N&offset=N",
        getById: "GET /avatars/:id",
        reroll: "POST /avatars/:id/reroll",
        adapters: {
          inworld: "GET /avatars/:id/inworld",
          convai: "GET /avatars/:id/convai",
          charisma: "GET /avatars/:id/charisma",
        },
      },
    },
    example: {
      generate: {
        method: "POST",
        url: "/avatars/generate",
        body: {
          seed: 42,
          identity: { gender: "female" },
          being: { order: "angel" },
        },
      },
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.use("/avatars", createAvatarRouter(avatarService));

app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unexpected error",
    });
  }
);

const port = Number(process.env.PORT ?? 3333);

app.listen(port, () => {
  console.log(`Oripheon API listening on http://localhost:${port}`);
});
