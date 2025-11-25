import seedrandom from "seedrandom";

export type RNG = () => number;

export function createRng(seed: number): RNG {
  const rng = seedrandom(String(seed));
  return () => rng();
}

export function randomInt(rng: RNG, min: number, max: number): number {
  const value = rng();
  return Math.floor(value * (max - min + 1)) + min;
}

export function randomFloat(rng: RNG, min = 0, max = 1): number {
  return rng() * (max - min) + min;
}

export function randomChoice<T>(rng: RNG, list: T[]): T {
  if (list.length === 0) {
    throw new Error("Cannot choose from empty list");
  }
  const index = Math.floor(rng() * list.length);
  return list[index];
}

export function randomBoolean(rng: RNG, probability = 0.5): boolean {
  return rng() < probability;
}

export function weightedRandomChoice<T>(
  rng: RNG,
  weights: Array<{ item: T; weight: number }>
): T {
  const totalWeight = weights.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight === 0) {
    return weights[weights.length - 1]?.item;
  }
  const threshold = rng() * totalWeight;
  let cumulative = 0;
  for (const entry of weights) {
    cumulative += entry.weight;
    if (threshold <= cumulative) {
      return entry.item;
    }
  }
  return weights[weights.length - 1]!.item;
}

export function shuffle<T>(rng: RNG, list: T[]): T[] {
  const clone = [...list];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}
