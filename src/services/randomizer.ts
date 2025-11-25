import {
  Appearance,
  AvatarGenerationParams,
  Being,
  Gender,
  Heritage,
  HeritageCulture,
  Identity,
  Mythos,
  Personality,
  PersonalityAxes,
  PrimaryName,
  TasteProfile,
  TarotArchetype,
} from "../models/avatar.js";
import {
  RNG,
  createRng,
  randomBoolean,
  randomChoice,
  randomFloat,
  shuffle,
} from "../utils/prng.js";
import { NameGenerator } from "./names/index.js";

const GENDERS: Gender[] = ["male", "female", "androgynous"];
const NAME_MODES: PrimaryName["nameMode"][] = [
  "mononym",
  "first_last",
  "first_middle_last",
  "fused_mononym",
];
const TITLES = [
  null,
  "St.",
  "Dame",
  "Lord",
  "Lady",
  "Seraph",
  "Prophet",
  "Dr.",
  "Marshal",
];

const HERITAGE_CULTURES: HeritageCulture[] = [
  "african_yoruba",
  "african_igbo",
  "arabic",
  "caucasian_european",
  "celtic",
  "norse_viking",
];

const CULTURE_LABELS: Record<HeritageCulture, string> = {
  african_yoruba: "Yoruba",
  african_igbo: "Igbo",
  arabic: "Arabic",
  caucasian_european: "Continental European",
  celtic: "Celtic",
  norse_viking: "Norse",
};

const ORDER_OFFICES: Record<Being["order"], string[]> = {
  angel: [
    "shield-bearer",
    "prophet",
    "librarian of echoes",
    "witness of storms",
  ],
  demon: ["whisper broker", "bloodforger", "temptation smith", "night marshal"],
  jinn: ["sandseer", "memory merchant", "ember courier", "mirage tactician"],
  human: ["wayfinder", "blacksmith", "seer", "sky courier"],
};

const TAROT_ARCHETYPES: TarotArchetype[] = [
  "fool",
  "magician",
  "high_priestess",
  "empress",
  "emperor",
  "hierophant",
  "lovers",
  "chariot",
  "strength",
  "hermit",
  "wheel_of_fortune",
  "justice",
  "hanged_man",
  "death",
  "temperance",
  "devil",
  "tower",
  "star",
  "moon",
  "sun",
  "judgement",
  "world",
];

const AGE_APPEARANCES = [
  "early 20s",
  "late 20s",
  "mid 30s",
  "early 40s",
  "ageless",
];

const PRESENTATIONS = [
  "androgynous cyber mystic",
  "ornate desert paladin",
  "runed storm bard",
  "ashen shrine guardian",
  "chrome-plated oracle",
];

const FEATURES = [
  "eyes of liquid mercury",
  "sigil-tattooed palms",
  "voice with twin tones",
  "cloak woven from auroras",
  "braids tied with charms",
  "scar glowing ember-red",
  "floating prayer beads",
  "mechanical halo fragments",
];

const PERSONALITY_VALUES = [
  "loyalty",
  "vision",
  "sacred rebellion",
  "discipline",
  "secret compassion",
  "unyielding curiosity",
  "ritual precision",
  "protective fury",
  "strategic mercy",
];

const FACTIONS = [
  "Choir of Rust",
  "Sable Caravan",
  "Chronicle Wardens",
  "Gilded Rift",
  "Order of the Dust Choir",
];

const RITUAL_ACTIONS = [
  "etches sigils into the air",
  "sings coded hymns",
  "baptizes relics in embers",
  "unfurls mirrored banners",
];

const TASTE_MUSIC = [
  "polyphonic psalms",
  "desert blues",
  "glitch harps",
  "northern war chants",
  "cathedral jazz",
];

const TASTE_FASHION = [
  "tasseled armor",
  "mirror-lens veils",
  "geomantic robes",
  "feathered capes",
  "sleek flight leathers",
];

const TASTE_INDULGENCES = [
  "opalescent tea",
  "forbidden chronicles",
  "crystalized thunder honey",
  "holographic theater",
  "silent feasts",
];

const TASTE_LIKES = [
  "honest wagers",
  "sunrise duels",
  "archive dust",
  "storm watching",
  "quiet apprentices",
];

const TASTE_DISLIKES = [
  "false prophecies",
  "untuned choirs",
  "lawless portals",
  "rusted promises",
  "vacant thrones",
];

export class Randomizer {
  constructor(private rng: RNG, private nameGenerator: NameGenerator) {}

  static fromSeed(seed: number, nameGenerator: NameGenerator): Randomizer {
    return new Randomizer(createRng(seed), nameGenerator);
  }

  randomHeritage(mixedProbability = 0.4): Heritage {
    const useMixed = randomBoolean(this.rng, mixedProbability);
    const components: Heritage["components"] = [];
    const baseCulture = randomChoice(this.rng, HERITAGE_CULTURES);
    components.push({
      culture: baseCulture,
      weight: useMixed ? randomFloat(this.rng, 0.35, 0.7) : 1,
    });
    if (useMixed) {
      const remainingCultures = HERITAGE_CULTURES.filter(
        (culture) => culture !== baseCulture
      );
      const secondCulture = randomChoice(this.rng, remainingCultures);
      components.push({
        culture: secondCulture,
        weight: Number((1 - components[0]!.weight).toFixed(2)),
      });
      return { mode: "mixed", components };
    }
    components[0]!.weight = 1;
    return { mode: "single", components };
  }

  randomIdentity(
    heritage: Heritage,
    identityParams: AvatarGenerationParams["identity"] = undefined,
    needPseudonyms: boolean
  ): Identity {
    const gender =
      identityParams?.gender ??
      randomChoice(this.rng, GENDERS);
    const nameMode =
      identityParams?.nameMode ??
      randomChoice(this.rng, NAME_MODES);
    const title =
      identityParams?.title === undefined
        ? randomChoice(this.rng, TITLES)
        : identityParams.title;

    const primaryName: PrimaryName = {
      title,
      nameMode,
      first: null,
      middle: null,
      last: null,
      mononym: null,
    };

    if (nameMode === "mononym") {
      primaryName.mononym = this.nameGenerator.generateMononym(
        gender,
        heritage,
        this.rng
      );
    } else if (nameMode === "fused_mononym") {
      // Generate full name parts first
      const first = this.nameGenerator.generateGivenName(
        gender,
        heritage,
        this.rng
      );
      const last = this.nameGenerator.generateSurname(
        gender,
        heritage,
        this.rng
      );
      // Fuse title and name parts together
      const parts = [];
      if (title) parts.push(title);
      parts.push(first, last);
      primaryName.mononym = fuseNameParts(parts);
    } else {
      primaryName.first = this.nameGenerator.generateGivenName(
        gender,
        heritage,
        this.rng
      );
      primaryName.last = this.nameGenerator.generateSurname(
        gender,
        heritage,
        this.rng
      );
      if (nameMode === "first_middle_last") {
        primaryName.middle = this.nameGenerator.generateGivenName(
          "androgynous",
          heritage,
          this.rng
        );
      }
    }

    const pseudonyms = needPseudonyms
      ? {
          lightSide: `${describeHeritage(heritage)} Dawn`,
          darkSide: `${primaryName.mononym ?? primaryName.last ?? "Shade"} ${
            randomChoice(this.rng, ["Veil", "Thorn", "Cipher"])
          }`,
        }
      : {};

    return {
      primaryName,
      pseudonyms,
      gender,
      nameMeaning: "", // Will be filled in later after being is generated
    };
  }

  randomBeing(partial: Partial<Being> | undefined): Being {
    const order =
      partial?.order ?? randomChoice(this.rng, Object.keys(ORDER_OFFICES) as Being["order"][]);
    const office =
      partial?.office ??
      randomChoice(this.rng, ORDER_OFFICES[order]);
    const tarotArchetype =
      partial?.tarotArchetype ??
      randomChoice(this.rng, TAROT_ARCHETYPES);
    return { order, office, tarotArchetype };
  }

  randomAppearance(): Appearance {
    const keyFeatures = shuffle(this.rng, FEATURES).slice(0, 3);
    return {
      ageAppearance: randomChoice(this.rng, AGE_APPEARANCES),
      presentation: randomChoice(this.rng, PRESENTATIONS),
      keyFeatures,
    };
  }

  randomPersonality(): Personality {
    const axes: PersonalityAxes = {
      orderVsChaos: Number(randomFloat(this.rng, 0, 1).toFixed(2)),
      mercyVsRuthlessness: Number(randomFloat(this.rng, 0, 1).toFixed(2)),
      introvertVsExtrovert: Number(randomFloat(this.rng, 0, 1).toFixed(2)),
      faithVsDoubt: Number(randomFloat(this.rng, 0, 1).toFixed(2)),
    };
    const values = shuffle(this.rng, PERSONALITY_VALUES).slice(0, 3);
    const summary = `A ${
      axes.introvertVsExtrovert > 0.5 ? "outward" : "inward"
    }-facing force whose ${axes.orderVsChaos > 0.5 ? "discipline" : "improvisation"
    } balances ${
      axes.faithVsDoubt > 0.5 ? "faith" : "doubt"
    } with ${
      axes.mercyVsRuthlessness > 0.5 ? "mercy" : "unyielding verdicts"
    }.`;
    return {
      summary,
      axes,
      coreValues: values,
    };
  }

  randomMythos(being: Being, heritage: Heritage): Mythos {
    const heritageDescriptor = describeHeritage(heritage);
    const shortTitle = `The ${randomChoice(this.rng, [
      "Angel",
      "Shade",
      "Herald",
      "Seer",
      "Blade",
    ])} of ${randomChoice(this.rng, [
      "Chrome Rain",
      "Silent Embers",
      "Gilded Storms",
      "Forgotten Rivers",
    ])}`;

    const originStory = `Born of ${heritageDescriptor} lineages, this ${being.order} ${
      being.office
    } was tempered in cities that sleep beneath thunder. They bound ${
      being.tarotArchetype
    } sigils into their bones and swore service to wandering caravans. Their legend is whispered in cathedrals carved into dunes.`;

    const faction = randomChoice(this.rng, FACTIONS);

    const prophecyOrCurse = `Prophecy claims they will ${
      randomChoice(this.rng, [
        "ignite the last astral lighthouse",
        "untangle the twin moons",
        "silence a tyrant choir",
      ])
    } when the ${being.tarotArchetype.replace(/_/g, " ")} is drawn three times in one night.`;

    const signatureRitual = `${
      randomChoice(this.rng, RITUAL_ACTIONS)
    } while reciting the ${
      heritageDescriptor
    } canticles, anchoring allies to reality's seam.`;

    return {
      shortTitle,
      originStory,
      faction,
      prophecyOrCurse,
      signatureRitual,
    };
  }

  randomTasteProfile(_being: Being, _heritage: Heritage): TasteProfile {
    return {
      music: shuffle(this.rng, TASTE_MUSIC).slice(0, 2),
      fashion: shuffle(this.rng, TASTE_FASHION).slice(0, 2),
      indulgences: shuffle(this.rng, TASTE_INDULGENCES).slice(0, 2),
      likes: shuffle(this.rng, TASTE_LIKES).slice(0, 3),
      dislikes: shuffle(this.rng, TASTE_DISLIKES).slice(0, 2),
    };
  }

  generateNameMeaning(heritage: Heritage, being: Being): string {
    return generateNameMeaning("", heritage, being, this.rng);
  }
}

export function describeHeritage(heritage: Heritage): string {
  const names = heritage.components.map(
    (component) => CULTURE_LABELS[component.culture]
  );
  if (names.length === 1) {
    return names[0]!;
  }
  return `${names.slice(0, -1).join(", ")} and ${names.slice(-1)[0]}`;
}

export function generateNameMeaning(
  name: string,
  heritage: Heritage,
  being: Being,
  rng: RNG
): string {
  const primaryCulture = heritage.components[0]?.culture || "caucasian_european";

  const meaningPrefixes: Record<HeritageCulture, string[]> = {
    african_yoruba: ["child of", "gift of", "crowned by", "blessed with"],
    african_igbo: ["child of", "gift from", "protected by", "born with"],
    arabic: ["servant of", "gift of", "light of", "guided by"],
    caucasian_european: ["bearer of", "keeper of", "holder of", "one with"],
    celtic: ["child of", "born of", "marked by", "blessed with"],
    norse_viking: ["son/daughter of", "warrior of", "bearer of", "chosen by"],
  };

  const meaningSuffixes = [
    "wisdom", "strength", "honor", "light", "shadows", "storms",
    "grace", "fire", "water", "earth", "destiny", "prophecy",
    "justice", "mercy", "courage", "vision", "truth", "power"
  ];

  const orderThemes: Record<typeof being.order, string[]> = {
    angel: ["divine light", "celestial grace", "heavenly wisdom", "sacred duty"],
    demon: ["hidden truth", "forbidden knowledge", "dark power", "inner strength"],
    jinn: ["elemental force", "mystical energy", "shifting sands", "eternal flame"],
    human: ["mortal courage", "earthly wisdom", "steadfast resolve", "human spirit"],
  };

  const prefix = randomChoice(rng, meaningPrefixes[primaryCulture]);
  const theme = randomChoice(rng, orderThemes[being.order]);
  const suffix = randomChoice(rng, meaningSuffixes);

  const meanings = [
    `"${prefix} ${suffix}"`,
    `"${theme}"`,
    `"${prefix} ${theme}"`,
    `"one who carries ${suffix}"`,
  ];

  return randomChoice(rng, meanings);
}

function fuseNameParts(parts: string[]): string {
  if (parts.length === 0) return "Nameless";
  if (parts.length === 1) return parts[0]!;

  // Clean and lowercase parts
  const cleaned = parts.map(p => p.toLowerCase().replace(/[^a-z]/g, ''));
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

  // Find syllable-like chunks (consonant cluster + vowel(s))
  function extractSyllables(word: string): string[] {
    const syllables: string[] = [];
    let current = '';

    for (let i = 0; i < word.length; i++) {
      const char = word[i]!;
      current += char;

      // If we hit a vowel and next is consonant (or end), that's a syllable
      if (vowels.has(char)) {
        if (i === word.length - 1 || !vowels.has(word[i + 1]!)) {
          syllables.push(current);
          current = '';
        }
      }
    }

    if (current) syllables.push(current);
    return syllables.filter(s => s.length > 0);
  }

  // Different fusion strategies that maintain pronounceability
  const strategies = [
    // First syllable(s) of first + last syllable(s) of last
    () => {
      const first = cleaned[0]!;
      const last = cleaned[cleaned.length - 1]!;
      const firstSyllables = extractSyllables(first);
      const lastSyllables = extractSyllables(last);

      if (firstSyllables.length === 0 || lastSyllables.length === 0) {
        return first.slice(0, 3) + last.slice(-3);
      }

      // Take first 1-2 syllables of first word
      const firstPart = firstSyllables.slice(0, Math.min(2, firstSyllables.length)).join('');
      // Take last 1-2 syllables of last word
      const lastPart = lastSyllables.slice(-Math.min(2, lastSyllables.length)).join('');

      return firstPart + lastPart;
    },

    // Blend at vowel boundary
    () => {
      const first = cleaned[0]!;
      const last = cleaned[cleaned.length - 1]!;

      // Find last vowel in first word
      let splitPoint = first.length;
      for (let i = first.length - 1; i >= 0; i--) {
        if (vowels.has(first[i]!)) {
          splitPoint = i + 1;
          break;
        }
      }

      // Find first vowel in last word
      let startPoint = 0;
      for (let i = 0; i < last.length; i++) {
        if (vowels.has(last[i]!)) {
          startPoint = i;
          break;
        }
      }

      return first.slice(0, splitPoint) + last.slice(startPoint);
    },

    // Portmanteau style - overlap common sounds
    () => {
      const first = cleaned[0]!;
      const last = cleaned[cleaned.length - 1]!;

      // Try to find overlap
      for (let len = Math.min(3, first.length, last.length); len > 0; len--) {
        const ending = first.slice(-len);
        const beginning = last.slice(0, len);
        if (ending === beginning) {
          return first + last.slice(len);
        }
      }

      // No overlap, just take 2/3 of each
      const cutFirst = Math.ceil(first.length * 0.6);
      const cutLast = Math.floor(last.length * 0.4);
      return first.slice(0, cutFirst) + last.slice(-cutLast);
    },

    // Simple clean blend
    () => {
      const first = cleaned[0]!;
      const last = cleaned[cleaned.length - 1]!;

      // Take most of first, end of last
      const firstPart = first.slice(0, Math.min(4, Math.ceil(first.length * 0.7)));
      const lastPart = last.slice(-Math.min(3, Math.ceil(last.length * 0.5)));

      return firstPart + lastPart;
    },
  ];

  // Pick a random strategy
  const strategy = strategies[Math.floor(Math.random() * strategies.length)]!;
  let fused = strategy();

  // Ensure it's not too long
  if (fused.length > 10) {
    fused = fused.slice(0, 10);
  }

  // Ensure it's not too short
  if (fused.length < 3) {
    fused = cleaned.join('').slice(0, 6);
  }

  // Capitalize first letter
  return fused.charAt(0).toUpperCase() + fused.slice(1);
}
