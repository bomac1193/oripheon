#!/usr/bin/env node
import { createDatabase } from "../src/db/database.js";
import { SqliteAvatarRepository } from "../src/db/avatarRepository.js";
import { InMemoryNameGenerator } from "../src/services/names/inMemoryNameGenerator.js";
import { AvatarService } from "../src/services/avatarService.js";
import {
  AvatarGenerationParams,
  Gender,
  NameMode,
  OrderType,
  TarotArchetype,
} from "../src/models/avatar.js";

function parseArgs(argv: string[]): Record<string, string> {
  return argv.reduce<Record<string, string>>((acc, arg) => {
    if (arg.startsWith("--")) {
      const [key, value = "true"] = arg.replace(/^--/, "").split("=");
      acc[key] = value;
    }
    return acc;
  }, {});
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === "--help") {
    printHelp();
    return;
  }

  const args = parseArgs(rest);
  const service = createService();

  if (command === "generate") {
    const params = buildGenerationParams(args);
    const avatar = await service.generateAvatar(params);
    console.log(JSON.stringify(avatar, null, 2));
    return;
  }

  if (command === "list") {
    const limit = args.limit ? Number(args.limit) : 5;
    const avatars = await service.listAvatars(limit, 0);
    console.log(JSON.stringify(avatars, null, 2));
    return;
  }

  console.error(`Unknown command "${command}"`);
  printHelp();
}

function buildGenerationParams(args: Record<string, string>): AvatarGenerationParams {
  const params: AvatarGenerationParams = {};
  if (args.seed) {
    params.seed = Number(args.seed);
  }
  if (args.gender || args.nameMode || args.title) {
    params.identity = {
      ...(args.gender ? { gender: args.gender as Gender } : {}),
      ...(args.nameMode ? { nameMode: args.nameMode as NameMode } : {}),
      ...(args.title ? { title: args.title } : {}),
    };
  }
  if (args.order || args.office || args.tarot) {
    params.being = {
      ...(args.order ? { order: args.order as OrderType } : {}),
      ...(args.office ? { office: args.office } : {}),
      ...(args.tarot ? { tarotArchetype: args.tarot as TarotArchetype } : {}),
    };
  }
  return params;
}

function createService(): AvatarService {
  const db = createDatabase();
  const repository = new SqliteAvatarRepository(db);
  const nameGenerator = new InMemoryNameGenerator();
  return new AvatarService(nameGenerator, repository);
}

function printHelp() {
  console.log(`Oripheon CLI

Usage:
  npm run cli -- generate [--order=angel] [--gender=androgynous] [--tarot=high_priestess]
  npm run cli -- list [--limit=5]
`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
