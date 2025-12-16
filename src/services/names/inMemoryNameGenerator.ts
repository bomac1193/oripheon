import {
  Gender,
  Heritage,
  HeritageCulture,
  OrderType,
  TarotArchetype,
} from "../../models/avatar.js";
import { RNG, randomChoice, weightedRandomChoice } from "../../utils/prng.js";
import { NameGenerator } from "./nameGenerator.js";
import {
  getOrderNames,
  getOrderSurnames,
  getOrderMononyms,
} from "./orderAlignedNames.js";
import { getTarotMononyms, getTarotNames, getTarotSurnames } from "./tarotAlignedNames.js";

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

type NameSource = "order" | "tarot" | "culture";

function safePick(rng: RNG, list: string[]): string | null {
  if (!list.length) return null;
  return randomChoice(rng, list);
}

export class InMemoryNameGenerator implements NameGenerator {
  generateGivenName(
    gender: Gender,
    heritage: Heritage,
    rng: RNG,
    order?: OrderType,
    tarotArchetype?: TarotArchetype
  ): string {
    const culture = pickCulture(rng, heritage);
    const buckets = CULTURE_NAME_DATA[culture];

    const isHuman = order === "human";
    const sources: Array<{ item: NameSource; weight: number }> = [];
    if (order && tarotArchetype) {
      sources.push({ item: "order", weight: isHuman ? 45 : 55 });
      sources.push({ item: "tarot", weight: isHuman ? 35 : 40 });
      sources.push({ item: "culture", weight: isHuman ? 20 : 5 });
    } else if (order) {
      sources.push({ item: "order", weight: isHuman ? 60 : 90 });
      sources.push({ item: "culture", weight: isHuman ? 40 : 10 });
    } else if (tarotArchetype) {
      sources.push({ item: "tarot", weight: 75 });
      sources.push({ item: "culture", weight: 25 });
    } else {
      sources.push({ item: "culture", weight: 100 });
    }

    const pickers: Record<NameSource, () => string | null> = {
      order: () => (order ? safePick(rng, getOrderNames(order, gender)) : null),
      tarot: () =>
        tarotArchetype ? safePick(rng, getTarotNames(tarotArchetype, gender)) : null,
      culture: () => pickNameFromBucket(gender, buckets, rng),
    };

    const chosen = weightedRandomChoice(rng, sources);
    const attemptOrder: NameSource[] = [chosen, "order", "tarot", "culture"].filter(
      (value, index, array) => array.indexOf(value) === index
    ) as NameSource[];
    for (const source of attemptOrder) {
      const value = pickers[source]();
      if (value) return value;
    }

    return pickNameFromBucket(gender, buckets, rng);
  }

  generateSurname(
    gender: Gender,
    heritage: Heritage,
    rng: RNG,
    order?: OrderType,
    tarotArchetype?: TarotArchetype
  ): string {
    const culture = pickCulture(rng, heritage);
    const buckets = CULTURE_NAME_DATA[culture];

    const isHuman = order === "human";
    const sources: Array<{ item: NameSource; weight: number }> = [];
    if (order && tarotArchetype) {
      sources.push({ item: "order", weight: isHuman ? 40 : 50 });
      sources.push({ item: "tarot", weight: isHuman ? 35 : 45 });
      sources.push({ item: "culture", weight: isHuman ? 25 : 5 });
    } else if (order) {
      sources.push({ item: "order", weight: isHuman ? 50 : 85 });
      sources.push({ item: "culture", weight: isHuman ? 50 : 15 });
    } else if (tarotArchetype) {
      sources.push({ item: "tarot", weight: 60 });
      sources.push({ item: "culture", weight: 40 });
    } else {
      sources.push({ item: "culture", weight: 100 });
    }

    const pickers: Record<NameSource, () => string | null> = {
      order: () => (order ? safePick(rng, getOrderSurnames(order)) : null),
      tarot: () => (tarotArchetype ? safePick(rng, getTarotSurnames(tarotArchetype)) : null),
      culture: () => pickSurnameFromBucket(buckets, rng),
    };

    const chosen = weightedRandomChoice(rng, sources);
    const attemptOrder: NameSource[] = [chosen, "order", "tarot", "culture"].filter(
      (value, index, array) => array.indexOf(value) === index
    ) as NameSource[];
    for (const source of attemptOrder) {
      const value = pickers[source]();
      if (value) return value;
    }

    return pickSurnameFromBucket(buckets, rng);
  }

  generateMononym(
    gender: Gender,
    heritage: Heritage,
    rng: RNG,
    order?: OrderType,
    tarotArchetype?: TarotArchetype
  ): string {
    const culture = pickCulture(rng, heritage);
    const buckets = CULTURE_NAME_DATA[culture];

    const isHuman = order === "human";
    const sources: Array<{ item: NameSource; weight: number }> = [];
    if (order && tarotArchetype) {
      sources.push({ item: "order", weight: isHuman ? 45 : 55 });
      sources.push({ item: "tarot", weight: isHuman ? 45 : 40 });
      sources.push({ item: "culture", weight: isHuman ? 10 : 5 });
    } else if (order) {
      sources.push({ item: "order", weight: isHuman ? 70 : 95 });
      sources.push({ item: "culture", weight: isHuman ? 30 : 5 });
    } else if (tarotArchetype) {
      sources.push({ item: "tarot", weight: 80 });
      sources.push({ item: "culture", weight: 20 });
    } else {
      sources.push({ item: "culture", weight: 100 });
    }

    const pickers: Record<NameSource, () => string | null> = {
      order: () => {
        if (!order) return null;
        const orderMononyms = getOrderMononyms(order);
        if (orderMononyms.length > 0) return safePick(rng, orderMononyms);
        return safePick(rng, getOrderNames(order, gender));
      },
      tarot: () => {
        if (!tarotArchetype) return null;
        const tarotMononyms = getTarotMononyms(tarotArchetype);
        if (tarotMononyms.length > 0) return safePick(rng, tarotMononyms);
        return safePick(rng, getTarotNames(tarotArchetype, gender));
      },
      culture: () => {
        const cultureMononyms = buckets.mononyms ?? [];
        if (cultureMononyms.length > 0 && rng() < 0.7) {
          const picked = safePick(rng, cultureMononyms);
          if (picked) return picked;
        }
        return pickNameFromBucket(gender, buckets, rng);
      },
    };

    const chosen = weightedRandomChoice(rng, sources);
    const attemptOrder: NameSource[] = [chosen, "order", "tarot", "culture"].filter(
      (value, index, array) => array.indexOf(value) === index
    ) as NameSource[];
    for (const source of attemptOrder) {
      const value = pickers[source]();
      if (value) return value;
    }

    return pickNameFromBucket(gender, buckets, rng);
  }
}
