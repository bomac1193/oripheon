import { NameMode, PrimaryName } from "../../models/avatar.js";
import { RNG, randomChoice, randomInt, weightedRandomChoice } from "../../utils/prng.js";
import {
  ARCHETYPES,
  BASE_EPITHETS,
  BASE_SYLLABLES,
  BASE_TITLES,
  STYLES,
  TRAITS,
  type NameStyleId,
  type TraitId,
} from "./archetypes.js";

type NameForgeOptions = {
  archetype: string;
  traits?: TraitId[];
  style?: NameStyleId | "";
  allowTitles: boolean;
  allowEpithets: boolean;
  nameMode: NameMode;
  candidates?: number;
  limit?: number;
};

export function normalizeTraitIds(input: string[] | undefined, limit = 3): TraitId[] {
  if (!input?.length) return [];
  const unique: string[] = [];
  for (const raw of input) {
    const normalized = String(raw || "").trim().toLowerCase().replace(/\s+/g, "_");
    if (!normalized) continue;
    if (!unique.includes(normalized)) unique.push(normalized);
    if (unique.length >= limit) break;
  }
  return unique.filter((id): id is TraitId => id in TRAITS);
}

export function aestheticScore(name: string): number {
  const cleaned = name.toLowerCase().replace(/[^a-z\s.-]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return -Infinity;

  const words = cleaned.split(/\s+/g).filter(Boolean);
  const titleWords = new Set(["dr", "dr.", "saint", "st", "st.", "sister", "brother", "oracle", "professor"]);
  const coreWords = words.filter((w) => !titleWords.has(w));
  const core = coreWords.join("");
  const letters = core.replace(/[^a-z]/g, "");
  if (letters.length < 3) return -10;

  const vowels = letters.match(/[aeiouy]/g)?.length ?? 0;
  const consonants = letters.length - vowels;
  const vowelRatio = vowels / letters.length;

  let score = 0;

  // Penalize ugly clusters and hard-to-pronounce seams.
  const ugly = [
    /xq/,
    /q[^u]/,
    /ptkz/,
    /[bcdfghjklmnpqrstvwxyz]{4,}/,
    /(.)\1\1/, // triple repeated letters
  ];
  for (const re of ugly) {
    if (re.test(letters)) score -= 3;
  }

  // Reward readable length.
  if (letters.length >= 5 && letters.length <= 12) score += 2;
  if (letters.length > 16) score -= 2;

  // Prefer a balanced vowel/consonant flow.
  score += 3 - Math.abs(vowelRatio - 0.45) * 10;
  if (consonants > vowels * 2) score -= 2;

  // Penalize long consonant runs; reward alternating flow.
  const runs = letters.match(/[bcdfghjklmnpqrstvwxyz]{3,}/g);
  if (runs) score -= runs.length * 1.5;
  const alternation = letters.match(/[aeiouy][bcdfghjklmnpqrstvwxyz]|[bcdfghjklmnpqrstvwxyz][aeiouy]/g);
  score += Math.min(3, (alternation?.length ?? 0) / 3);

  // Bonus for pleasant endings.
  if (/[aeiouy]$/.test(letters)) score += 0.8;
  if (/[qwx]$/.test(letters)) score -= 1.2;

  // Alliteration across multi-word core names.
  const coreNameWords = words.filter((w) => !titleWords.has(w) && w !== "the" && w !== "of");
  if (coreNameWords.length >= 2) {
    const a = coreNameWords[0]![0];
    const b = coreNameWords[1]![0];
    if (a && b && a === b) score += 1.2;
  }

  // Assonance bonus: shared dominant vowel.
  const vowelCounts: Record<string, number> = {};
  for (const ch of letters) {
    if ("aeiouy".includes(ch)) vowelCounts[ch] = (vowelCounts[ch] ?? 0) + 1;
  }
  const dominantVowel = Object.entries(vowelCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (dominantVowel && coreWords.some((w) => w.includes(dominantVowel))) score += 0.5;

  return score;
}

export function generateNameCandidates(rng: RNG, options: NameForgeOptions): PrimaryName[] {
  const archetype = ARCHETYPES.find((a) => a.id === options.archetype);
  if (!archetype) return [];

  const traits = normalizeTraitIds(options.traits);
  const style = options.style ? STYLES[options.style as NameStyleId] : undefined;

  const syllableWeights = buildSyllableWeights(archetype, traits, style);
  const titlePool = buildTitlePool(archetype, traits);
  const epithetPool = buildEpithetPool(archetype, traits);

  const candidates = Number.isFinite(options.candidates) ? Math.max(10, options.candidates!) : 30;
  const limit = Number.isFinite(options.limit) ? Math.max(1, options.limit!) : 10;

  const generated: Array<{ name: PrimaryName; score: number; key: string }> = [];

  for (let i = 0; i < candidates; i += 1) {
    const primaryName = generatePrimaryName(rng, options, syllableWeights, titlePool, epithetPool, style);
    const display = formatPrimaryName(primaryName);
    const score = aestheticScore(display);
    generated.push({ name: primaryName, score, key: normalizeForDedupe(display) });
  }

  generated.sort((a, b) => {
    const diff = b.score - a.score;
    if (diff !== 0) return diff;
    const as = formatPrimaryName(a.name);
    const bs = formatPrimaryName(b.name);
    return as.localeCompare(bs);
  });

  const picked: PrimaryName[] = [];
  const seen = new Set<string>();
  for (const entry of generated) {
    if (picked.length >= limit) break;
    if (seen.has(entry.key)) continue;
    if (isNearDuplicate(entry.key, seen)) continue;
    seen.add(entry.key);
    picked.push(entry.name);
  }

  // If variety filter over-pruned, backfill.
  for (const entry of generated) {
    if (picked.length >= limit) break;
    if (picked.includes(entry.name)) continue;
    picked.push(entry.name);
  }

  return picked.slice(0, limit);
}

export function formatPrimaryName(primaryName: PrimaryName): string {
  const parts: string[] = [];
  if (primaryName.title) parts.push(primaryName.title);
  if (primaryName.mononym) {
    parts.push(primaryName.mononym);
    return parts.join(" ").trim();
  }
  if (primaryName.first) parts.push(primaryName.first);
  if (primaryName.middle) parts.push(primaryName.middle);
  if (primaryName.last) parts.push(primaryName.last);
  return parts.join(" ").trim();
}

function buildSyllableWeights(
  archetype: { syllableBoosts?: Record<string, number> },
  traits: TraitId[],
  style?: { syllableBoosts: Record<string, number> }
): Array<{ item: string; weight: number }> {
  const map = new Map<string, number>();
  for (const { item, weight } of BASE_SYLLABLES) {
    map.set(item, weight);
  }

  const apply = (boosts: Record<string, number> | undefined) => {
    if (!boosts) return;
    for (const [syllable, boost] of Object.entries(boosts)) {
      const key = syllable.toLowerCase();
      const current = map.get(key) ?? 0.25;
      map.set(key, Math.max(0.05, current + boost));
    }
  };

  apply(archetype.syllableBoosts);
  for (const id of traits) apply(TRAITS[id].syllableBoosts);
  apply(style?.syllableBoosts);

  return Array.from(map.entries()).map(([item, weight]) => ({ item, weight }));
}

function buildTitlePool(
  archetype: { titlePool?: string[] },
  traits: TraitId[]
): string[] {
  const pool = new Set<string>(BASE_TITLES);
  if (archetype.titlePool) archetype.titlePool.forEach((t) => pool.add(t));
  traits.forEach((id) => (TRAITS[id].titlePool ?? []).forEach((t) => pool.add(t)));
  return Array.from(pool);
}

function buildEpithetPool(
  archetype: { epithetPool?: string[] },
  traits: TraitId[]
): string[] {
  const pool = new Set<string>(BASE_EPITHETS);
  if (archetype.epithetPool) archetype.epithetPool.forEach((t) => pool.add(t));
  traits.forEach((id) => (TRAITS[id].epithetPool ?? []).forEach((t) => pool.add(t)));
  return Array.from(pool);
}

function generatePrimaryName(
  rng: RNG,
  options: NameForgeOptions,
  syllables: Array<{ item: string; weight: number }>,
  titlePool: string[],
  epithetPool: string[],
  style?: { minSyllables: number; maxSyllables: number; titleChance: number; epithetChance: number }
): PrimaryName {
  const titleChance = style?.titleChance ?? 0.25;
  const epithetChance = style?.epithetChance ?? 0.25;
  const minSyl = style?.minSyllables ?? 2;
  const maxSyl = style?.maxSyllables ?? 4;

  const title = options.allowTitles && rng() < titleChance ? randomChoice(rng, titlePool) : null;
  const wantsEpithet = options.allowEpithets && rng() < epithetChance;
  const epithet = wantsEpithet ? randomChoice(rng, epithetPool) : null;

  if (options.nameMode === "mononym") {
    const mononym = withEpithet(generateWord(rng, syllables, minSyl, maxSyl), epithet);
    return {
      title,
      nameMode: "mononym",
      first: null,
      middle: null,
      last: null,
      mononym,
    };
  }

  if (options.nameMode === "fused_mononym") {
    const first = generateWord(rng, syllables, minSyl, maxSyl);
    const last = generateWord(rng, syllables, minSyl, maxSyl);
    const mononym = withEpithet(fuseWords(rng, first, last), epithet);
    return {
      title,
      nameMode: "fused_mononym",
      first,
      middle: null,
      last,
      mononym,
    };
  }

  if (options.nameMode === "first_middle_last") {
    const first = generateWord(rng, syllables, minSyl, maxSyl);
    const middle = generateWord(rng, syllables, Math.max(2, minSyl - 1), Math.max(2, maxSyl - 1));
    const last = withEpithet(generateWord(rng, syllables, minSyl, maxSyl), epithet);
    return {
      title,
      nameMode: "first_middle_last",
      first,
      middle,
      last,
      mononym: null,
    };
  }

  // first_last
  const first = generateWord(rng, syllables, minSyl, maxSyl);
  const last = withEpithet(generateWord(rng, syllables, minSyl, maxSyl), epithet);
  return {
    title,
    nameMode: "first_last",
    first,
    middle: null,
    last,
    mononym: null,
  };
}

function withEpithet(base: string, epithet: string | null): string {
  if (!epithet) return base;
  const suffix = epithet.startsWith("the ") || epithet.startsWith("of ") ? epithet : `the ${epithet}`;
  return `${base} ${titleCaseWords(suffix)}`.trim();
}

function generateWord(
  rng: RNG,
  syllables: Array<{ item: string; weight: number }>,
  minSyllables: number,
  maxSyllables: number
): string {
  const count = randomInt(rng, minSyllables, maxSyllables);
  let word = "";
  let last = "";
  for (let i = 0; i < count; i += 1) {
    let next = weightedRandomChoice(rng, syllables);
    if (next === last) {
      next = weightedRandomChoice(rng, syllables);
    }
    word += next;
    last = next;
  }
  return titleCaseWord(cleanupWord(word));
}

function cleanupWord(word: string): string {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  return cleaned
    .replace(/(.)\1\1+/g, "$1$1")
    .replace(/([aeiouy])\1+/g, "$1")
    .replace(/q(?!u)/g, "qu")
    .slice(0, 14);
}

function titleCaseWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function titleCaseWords(phrase: string): string {
  return phrase
    .split(/\s+/g)
    .map((w) => (w.length <= 2 ? w.toLowerCase() : titleCaseWord(w.toLowerCase())))
    .join(" ");
}

function fuseWords(rng: RNG, first: string, last: string): string {
  const a = first.toLowerCase().replace(/[^a-z]/g, "");
  const b = last.toLowerCase().replace(/[^a-z]/g, "");
  if (!a) return titleCaseWord(b);
  if (!b) return titleCaseWord(a);

  const strategies: Array<() => string> = [
    () => a.slice(0, Math.max(2, Math.ceil(a.length * 0.6))) + b.slice(-Math.max(2, Math.floor(b.length * 0.5))),
    () => a.slice(0, Math.min(4, a.length)) + b.slice(Math.max(0, b.length - 3)),
    () => {
      for (let len = Math.min(3, a.length, b.length); len > 0; len -= 1) {
        const overlap = a.slice(-len);
        if (b.startsWith(overlap)) return a + b.slice(len);
      }
      return a + b;
    },
  ];
  const fused = strategies[randomInt(rng, 0, strategies.length - 1)]!();
  return titleCaseWord(cleanupWord(fused));
}

function normalizeForDedupe(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/[aeiouy]/g, "")
    .replace(/(.)\1+/g, "$1")
    .slice(0, 18);
}

function isNearDuplicate(key: string, seen: Set<string>): boolean {
  if (!key) return true;
  for (const existing of seen) {
    if (existing === key) return true;
    if (existing.startsWith(key.slice(0, 6)) || key.startsWith(existing.slice(0, 6))) return true;
  }
  return false;
}

