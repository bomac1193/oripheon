import express, { NextFunction, Request, Response } from "express";
import { createDatabase } from "./db/database.js";
import { SqliteAvatarRepository } from "./db/avatarRepository.js";
import { InMemoryNameGenerator } from "./services/names/inMemoryNameGenerator.js";
import { toNameDataForUI } from "./services/names/archetypes.js";
import { formatPrimaryName, generateNameCandidates, normalizeTraitIds } from "./services/names/nameForge.js";
import { AvatarService } from "./services/avatarService.js";
import { createAvatarRouter } from "./routes/avatarRoutes.js";
import { createRng } from "./utils/prng.js";
import type { NameMode } from "./models/avatar.js";

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
      nameData: "GET /name-data",
      names: {
        generate: "POST /names/generate",
      },
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

app.get("/name-data", (_req, res) => {
  res.json(toNameDataForUI());
});

app.post("/names/generate", (req, res) => {
  const body = typeof req.body === "object" && req.body ? (req.body as Record<string, unknown>) : {};
  const archetype = typeof body.archetype === "string" ? body.archetype : "";
  if (!archetype) {
    res.json({ names: [] });
    return;
  }

  const seed = typeof body.seed === "number" && Number.isFinite(body.seed) ? body.seed : undefined;
  const allowTitles = body.allowTitles !== false;
  const allowEpithets = body.allowEpithets === true;
  const traits = Array.isArray(body.traits) ? body.traits.map(String) : [];
  const style = typeof body.style === "string" ? body.style : "";

  const allowedNameModes: NameMode[] = ["mononym", "first_last", "first_middle_last", "fused_mononym"];
  const nameMode =
    typeof body.nameMode === "string" && (allowedNameModes as string[]).includes(body.nameMode)
      ? (body.nameMode as NameMode)
      : "mononym";

  const rng = createRng(seed ?? Math.floor(Math.random() * 10_000_000) + 1);
  const names = generateNameCandidates(rng, {
    archetype,
    traits: normalizeTraitIds(traits),
    style: style as any,
    allowTitles,
    allowEpithets,
    nameMode,
    candidates: 30,
    limit: 10,
  }).map(formatPrimaryName);

  res.json({ names });
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
