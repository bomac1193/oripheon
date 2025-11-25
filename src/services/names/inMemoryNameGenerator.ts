import {
  Gender,
  Heritage,
  HeritageCulture,
} from "../../models/avatar.js";
import { RNG, weightedRandomChoice } from "../../utils/prng.js";
import { NameGenerator } from "./nameGenerator.js";

type NameBuckets = {
  male: string[];
  female: string[];
  androgynous: string[];
  surnames: string[];
  mononyms?: string[];
};

const CULTURE_NAME_DATA: Record<HeritageCulture, NameBuckets> = {
  african_yoruba: {
    male: ["Adeyemi", "Babatunde", "Olujinmi", "Kayode"],
    female: ["Amara", "Yetunde", "Folake", "Temitope"],
    androgynous: ["Ola", "Taiwo", "Ayodele"],
    surnames: ["Adebayo", "Ogunleye", "Okoya", "Oshodi"],
    mononyms: ["Oba", "Ori", "Yemo"],
  },
  african_igbo: {
    male: ["Chinedu", "Obinna", "Emeka", "Ugochukwu"],
    female: ["Adaeze", "Ngozi", "Chimaka", "Oluchi"],
    androgynous: ["Kelechi", "Ife", "Damili"],
    surnames: ["Okafor", "Nwosu", "Eze", "Madu"],
    mononyms: ["Nma", "Udo"],
  },
  arabic: {
    male: ["Idris", "Jibril", "Zayd", "Karim"],
    female: ["Layla", "Mariam", "Soraya", "Zahra"],
    androgynous: ["Noor", "Amani", "Raf", "Azar"],
    surnames: ["al-Harith", "Rahman", "Sarif", "Mirza"],
    mononyms: ["Nur", "Haqq"],
  },
  caucasian_european: {
    male: ["Lucian", "Matthias", "Sebastian", "Rene"],
    female: ["Elara", "Vivienne", "Isolde", "Rowena"],
    androgynous: ["Jules", "Adrian", "Sasha"],
    surnames: ["Kingsley", "Vaughn", "Sinclair", "Bellerose"],
    mononyms: ["Rune", "Vale"],
  },
  celtic: {
    male: ["Finnian", "Cormac", "Ronan", "Aeron"],
    female: ["Eira", "Niamh", "Siobhan", "Rhiannon"],
    androgynous: ["Quinn", "Morgan", "Dilys"],
    surnames: ["MacCrae", "O'Connell", "Kavanagh", "Rowntree"],
    mononyms: ["Bryn", "Thorne"],
  },
  norse_viking: {
    male: ["Bjorn", "Leif", "Soren", "Eirik"],
    female: ["Astrid", "Freya", "Signe", "Liv"],
    androgynous: ["Skadi", "Storm", "Nika"],
    surnames: ["Stormguard", "Ulfrik", "Ragnarsson", "Skeld"],
    mononyms: ["Frost", "Drake"],
  },
};

function pickCulture(rng: RNG, heritage: Heritage): HeritageCulture {
  const weights = heritage.components.map((component) => ({
    item: component.culture,
    weight: component.weight,
  }));
  return weightedRandomChoice(rng, weights);
}

function pickNameFromBucket(
  gender: Gender,
  buckets: NameBuckets,
  rng: RNG
): string {
  const pools: string[][] = [];
  if (gender === "male") pools.push(buckets.male);
  if (gender === "female") pools.push(buckets.female);
  pools.push(buckets.androgynous);
  const flattened = pools.flat().filter(Boolean);
  if (flattened.length === 0) {
    return "Unnamed";
  }
  return flattened[Math.floor(rng() * flattened.length)];
}

function pickSurnameFromBucket(buckets: NameBuckets, rng: RNG): string {
  if (buckets.surnames.length === 0) {
    return "of_No_House";
  }
  return buckets.surnames[Math.floor(rng() * buckets.surnames.length)];
}

export class InMemoryNameGenerator implements NameGenerator {
  generateGivenName(gender: Gender, heritage: Heritage, rng: RNG): string {
    const culture = pickCulture(rng, heritage);
    const buckets = CULTURE_NAME_DATA[culture];
    return pickNameFromBucket(gender, buckets, rng);
  }

  generateSurname(gender: Gender, heritage: Heritage, rng: RNG): string {
    const culture = pickCulture(rng, heritage);
    const buckets = CULTURE_NAME_DATA[culture];
    return pickSurnameFromBucket(buckets, rng);
  }

  generateMononym(gender: Gender, heritage: Heritage, rng: RNG): string {
    const culture = pickCulture(rng, heritage);
    const buckets = CULTURE_NAME_DATA[culture];
    const pool = [
      ...(buckets.mononyms ?? []),
      pickNameFromBucket(gender, buckets, rng),
    ];
    return pool[Math.floor(rng() * pool.length)];
  }
}
