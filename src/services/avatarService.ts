import { randomInt, randomUUID } from "crypto";
import { Avatar, AvatarGenerationParams } from "../models/avatar.js";
import { AvatarRepository } from "../db/avatarRepository.js";
import { NameGenerator } from "./names/index.js";
import { Randomizer } from "./randomizer.js";

type AvatarCore = Omit<Avatar, "id" | "createdAt">;

export class AvatarService {
  constructor(
    private readonly nameGenerator: NameGenerator,
    private readonly repository: AvatarRepository
  ) {}

  async generateAvatar(params: AvatarGenerationParams = {}): Promise<Avatar> {
    const seed = params.seed ?? randomInt(1, 10_000_000);
    const core = this.assembleAvatar(seed, params);
    const avatar: Avatar = {
      ...core,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.repository.create(avatar);
    return avatar;
  }

  async rerollAvatar(
    id: string,
    params: AvatarGenerationParams = {}
  ): Promise<Avatar> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Avatar not found");
    }
    const hints = applyLockHints(existing, params);
    const seed = hints.seed ?? randomInt(1, 10_000_000);
    const core = this.assembleAvatar(seed, hints);
    const updated: Avatar = {
      ...core,
      id: existing.id,
      createdAt: existing.createdAt,
    };
    const finalAvatar = applyLocks(existing, updated, params.locks ?? []);
    await this.repository.update(id, finalAvatar);
    return finalAvatar;
  }

  async getAvatar(id: string): Promise<Avatar | null> {
    return this.repository.findById(id);
  }

  async listAvatars(limit = 20, offset = 0): Promise<Avatar[]> {
    return this.repository.list(limit, offset);
  }

  private assembleAvatar(
    seed: number,
    params: AvatarGenerationParams
  ): AvatarCore {
    const randomizer = Randomizer.fromSeed(seed, this.nameGenerator);
    const heritage = params.heritage ?? randomizer.randomHeritage();
    const identity = randomizer.randomIdentity(
      heritage,
      params.identity,
      params.needPseudonyms ?? true
    );
    const being = randomizer.randomBeing(params.being ?? {});
    const appearance = randomizer.randomAppearance();
    const personality = randomizer.randomPersonality();
    const mythos = randomizer.randomMythos(being, heritage);
    const tasteProfile = randomizer.randomTasteProfile(being, heritage);
    return {
      seed,
      identity,
      heritage,
      being,
      appearance,
      personality,
      mythos,
      tasteProfile,
    };
  }
}

function applyLockHints(
  existing: Avatar,
  params: AvatarGenerationParams
): AvatarGenerationParams {
  if (!params.locks?.length) {
    return params;
  }
  const hints: AvatarGenerationParams = { ...params };
  const hasLock = (target: string): boolean =>
    params.locks!.some((lock) => lock === target || lock.startsWith(`${target}.`));

  if (hasLock("seed")) {
    hints.seed = existing.seed;
  }
  if (hasLock("heritage")) {
    hints.heritage = existing.heritage;
  }
  if (hasLock("being")) {
    hints.being = existing.being;
  } else {
    if (hasLock("being.order") || hasLock("being")) {
      hints.being = { ...(hints.being ?? {}), order: existing.being.order };
    }
    if (hasLock("being.office")) {
      hints.being = { ...(hints.being ?? {}), office: existing.being.office };
    }
    if (hasLock("being.tarotArchetype")) {
      hints.being = {
        ...(hints.being ?? {}),
        tarotArchetype: existing.being.tarotArchetype,
      };
    }
  }

  if (hasLock("identity")) {
    hints.identity = {
      title: existing.identity.primaryName.title,
      nameMode: existing.identity.primaryName.nameMode,
      gender: existing.identity.gender,
    };
  } else {
    if (hasLock("identity.gender")) {
      hints.identity = {
        ...(hints.identity ?? {}),
        gender: existing.identity.gender,
      };
    }
    if (hasLock("identity.primaryName.title")) {
      hints.identity = {
        ...(hints.identity ?? {}),
        title: existing.identity.primaryName.title,
      };
    }
    if (hasLock("identity.primaryName.nameMode")) {
      hints.identity = {
        ...(hints.identity ?? {}),
        nameMode: existing.identity.primaryName.nameMode,
      };
    }
  }

  return hints;
}

function applyLocks(
  original: Avatar,
  candidate: Avatar,
  locks: string[]
): Avatar {
  if (!locks.length) {
    return candidate;
  }
  const cloned = deepClone(candidate);
  for (const lock of locks) {
    const value = getValueByPath(original, lock);
    if (value !== undefined) {
      setValueByPath(cloned, lock, deepClone(value));
    }
  }
  return cloned;
}

function getValueByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) {
      return undefined;
    }
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function setValueByPath(obj: unknown, path: string, value: unknown): void {
  const segments = path.split(".");
  let cursor = obj as Record<string, unknown>;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const key = segments[i]!;
    if (
      cursor[key] === undefined ||
      cursor[key] === null ||
      typeof cursor[key] !== "object"
    ) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[segments[segments.length - 1]!] = value;
}

function deepClone<T>(value: T): T {
  if (value === undefined) {
    return value;
  }
  return JSON.parse(JSON.stringify(value));
}
