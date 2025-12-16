import {
  Appearance,
  AvatarGenerationParams,
  AvatarPrompt,
  Being,
  Gender,
  Heritage,
  HeritageCulture,
  Identity,
  Mythos,
  OrderType,
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
  randomInt,
  shuffle,
} from "../utils/prng.js";
import { NameGenerator } from "./names/index.js";
import { generateNameCandidates, normalizeTraitIds } from "./names/nameForge.js";
import {
  getOrderMononyms,
  getOrderNames,
  getOrderSurnames,
} from "./names/orderAlignedNames.js";
import { NAME_MEANINGS } from "./names/nameMeanings.js";

const GENDERS: Gender[] = ["male", "female", "androgynous"];
const NAME_MODES: PrimaryName["nameMode"][] = [
  "mononym",
  "first_last",
  "first_middle_last",
  "fused_mononym",
];

function pickNameModeByLength(
  rng: RNG,
  preference?: "short" | "long"
): PrimaryName["nameMode"] {
  if (preference === "short") {
    return randomChoice(rng, ["mononym", "fused_mononym"]);
  }
  if (preference === "long") {
    return randomChoice(rng, ["first_last", "first_middle_last"]);
  }
  return randomChoice(rng, NAME_MODES);
}
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
  titan: ["world-shaper", "primordial keeper", "mountain sovereign", "epoch warden"],
  fae: ["thorn prince/princess", "moonweaver", "wild hunt master", "glamour artist"],
  yokai: ["spirit guardian", "shapeshifter sage", "storm herald", "boundary keeper"],
  elemental: ["flame warden", "tide caller", "earthshaker", "wind whisper"],
  nephilim: ["skyborn warrior", "giant-blood champion", "earth shaker", "star descendant"],
  archon: ["cosmic judge", "reality weaver", "demiurge", "plane overseer"],
  dragonkin: [
    "wyrm-bound emissary",
    "hoard augur",
    "skyfire tactician",
    "ember oathkeeper",
  ],
  construct: [
    "clockwork adjutant",
    "axiom engraver",
    "lattice sentinel",
    "memory ward",
  ],
  eldritch: [
    "void cantor",
    "dream fracture oracle",
    "horizon unravelist",
    "starless witness",
  ],
  trickster: ["clown", "troll", "jester", "prankster"],
};

const ORDER_MEANING_THEMES: Record<OrderType, string> = {
  angel: "celestial guardianship and sacred duty",
  demon: "forbidden compacts and hidden power",
  jinn: "desert winds, whispers, and smokeless flame",
  human: "mortal ingenuity and resilient courage",
  titan: "primordial strength that steadies worlds",
  fae: "wild glamour and moonlit intrigue",
  yokai: "spirit realms where shapes shift and teach",
  elemental: "the raw chorus of earth, air, fire, and water",
  nephilim: "sky-born might that bridges mortal and divine",
  archon: "cosmic law and the architecture of reality",
  dragonkin: "wyrmfire covenants and hoarded wisdom",
  construct: "axiomatic purpose and timeless vigilance",
  eldritch: "starless insight etched along the void",
  trickster: "blasphemous mirth marrying sacred vows to chaotic pranks",
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

const SIGIL_BLOOM_MODE_NAME = "Sigil Bloom";
const TRIANGLE_GLYPHS = ["▲", "△", "▴", "▵", "▼", "▽"];
const CROSS_GLYPHS = ["†", "✝", "✠", "☥", "☨"];
const ORNATE_GLYPHS = [
  "◈",
  "✶",
  "✷",
  "✸",
  "✹",
  "✺",
  "✦",
  ...TRIANGLE_GLYPHS,
  ...CROSS_GLYPHS,
];

const DIACRITIC_MAP: Record<string, string[]> = {
  a: ["á", "à", "â", "ä", "å", "æ"],
  e: ["é", "è", "ê", "ë"],
  i: ["í", "ì", "î", "ï"],
  o: ["ó", "ò", "ô", "ö", "õ", "ø"],
  u: ["ú", "ù", "û", "ü"],
  y: ["ý", "ÿ"],
  c: ["ç"],
  n: ["ñ"],
  s: ["ś", "š"],
  t: ["ŧ"],
  d: ["ð"],
};

const CLASH_SACRED_TITLES = [
  "St.",
  "Saint",
  "Holy",
  "Blessed",
  "Divine",
  "Seraphic",
  "Mother Superior",
  "Archangel",
  "Radiant",
  "Prophet",
  "High Priest",
];

const CLASH_SACRED_ECHOES = [
  "Seraph",
  "Angel",
  "Oracle",
  "Temple",
  "Cathedral",
  "Gospel",
  "Hymn",
  "Sanctum",
  "Halo",
  "Reliquary",
  "Meme",
  "Prompt",
  "Thread",
  "Emoji",
  "Mod",
  "Server",
  "Moderator",
];

const CLASH_PROFANE_CORES = [
  "Madman",
  "Dying God",
  "Clown Prince",
  "Void Jester",
  "Troll Herald",
  "Profane Lamb",
  "Grinning Plague",
  "Blasphemer",
  "Laughing Abyss",
  "Rotting Cherub",
  "Rust Messiah",
  "Goat Meme",
  "Betty Meme",
  "Shitpost Archon",
  "Copypasta King",
  "Prompt Gremlin",
  "Thread Goblin",
  "Meme Revenant",
  "Emoji Wraith",
  "Giga Chad",
  "Reddit Oracle",
  "Prompt Pastor",
];
const CLASH_PROFANE_TRAILS = [
  "Laughter",
  "Carnival",
  "Jester",
  "Chaos",
  "Neon",
  "Joke",
  "Grave",
  "Nonsense",
  "Bruise",
  "Blasphemy",
  "Mainframe",
  "404",
  "Shitpost",
  "Copium",
  "Lag",
  "Latency",
  "Algorithm",
  "Promptstorm",
  "Upvote",
  "Downvote",
  "Doomscroll",
  "Bandwidth",
  "Cache",
];


const CLASH_INTERNET_HANDLES = [
  "Betty Meme",
  "Goat Meme",
  "UwU Prophet",
  "Copypasta Oracle",
  "Thread Gremlin",
  "Emoji Pope",
  "AI Prompt",
  "Server Goblin",
  "Doomscroll Saint",
  "Meme Witch",
  "Reddit Oracle",
  "Hashtag Halo",
  "Prompt Storm",
];
export interface SigilBloomContext {
  modeName: string;
  intensity: number; // 0 - 1 normalized intensity
}

type RandomIdentityResult = {
  identity: Identity;
  basePrimaryName: PrimaryName;
  stylization?: SigilBloomContext;
};

export class Randomizer {
  constructor(
    private rng: RNG,
    private nameGenerator: NameGenerator,
    private prompt?: AvatarPrompt
  ) {}

  static fromSeed(
    seed: number,
    nameGenerator: NameGenerator,
    prompt?: AvatarPrompt
  ): Randomizer {
    return new Randomizer(createRng(seed), nameGenerator, prompt);
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
    needPseudonyms: boolean,
    order?: OrderType,
    tarotArchetype?: TarotArchetype
  ): RandomIdentityResult {
    const gender =
      identityParams?.gender ??
      randomChoice(this.rng, GENDERS);
    const nameMode =
      identityParams?.nameMode ??
      pickNameModeByLength(this.rng, identityParams?.lengthPreference);
    const titleHint = identityParams?.title;
    const allowTitles = titleHint !== null;
    const forcedTitle = typeof titleHint === "string" ? titleHint : null;

    let primaryName: PrimaryName | null = null;
    const forgeArchetype = this.prompt?.nameArchetype?.trim();
    if (forgeArchetype) {
      const forged = generateNameCandidates(this.rng, {
        archetype: forgeArchetype,
        traits: normalizeTraitIds(this.prompt?.nameTraits),
        style: (this.prompt?.nameStyle as any) ?? "",
        allowTitles,
        allowEpithets: Boolean(this.prompt?.allowEpithets),
        nameMode,
        candidates: 30,
        limit: 10,
      });
      if (forged.length > 0) {
        primaryName = forged[0]!;
        if (!allowTitles) primaryName.title = null;
        if (forcedTitle) primaryName.title = forcedTitle;
      }
    }

    if (!primaryName) {
      const title =
        titleHint === undefined
          ? randomChoice(this.rng, TITLES)
          : titleHint;

      primaryName = {
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
          this.rng,
          order,
          tarotArchetype
        );
      } else if (nameMode === "fused_mononym") {
        const first = this.nameGenerator.generateGivenName(
          gender,
          heritage,
          this.rng,
          order,
          tarotArchetype
        );
        const last = this.nameGenerator.generateSurname(
          gender,
          heritage,
          this.rng,
          order,
          tarotArchetype
        );
        primaryName.mononym = fuseNameParts([first, last], this.rng);
        primaryName.first = first;
        primaryName.last = last;
      } else {
        primaryName.first = this.nameGenerator.generateGivenName(
          gender,
          heritage,
          this.rng,
          order,
          tarotArchetype
        );
        primaryName.last = this.nameGenerator.generateSurname(
          gender,
          heritage,
          this.rng,
          order,
          tarotArchetype
        );
        if (nameMode === "first_middle_last") {
          primaryName.middle = this.nameGenerator.generateGivenName(
            "androgynous",
            heritage,
            this.rng,
            order,
            tarotArchetype
          );
        }
      }
    }

    this.applyPreferredNames(primaryName, gender, order);
    const wantsClash = identityParams?.clashNames ?? false;
    if (wantsClash || order === "trickster") {
      applyAnachronisticClash(primaryName, this.rng, identityParams?.lengthPreference);
    }

    const basePrimaryName = clonePrimaryName(primaryName);
    const stylization = this.applySigilBloomIfNeeded(primaryName);

    const pseudonyms = needPseudonyms
      ? {
          lightSide: `${describeHeritage(heritage)} Dawn`,
          darkSide: `${
            basePrimaryName.mononym ??
            basePrimaryName.last ??
            primaryName.mononym ??
            primaryName.last ??
            "Shade"
          } ${
            randomChoice(this.rng, ["Veil", "Thorn", "Cipher"])
          }`,
        }
      : {};

    return {
      identity: {
        primaryName,
        pseudonyms,
        gender,
        nameMeaning: "", // Will be filled in later after being is generated
      },
      basePrimaryName,
      stylization,
    };
  }

  private applySigilBloomIfNeeded(primaryName: PrimaryName): SigilBloomContext | undefined {
    const settings = this.prompt?.sigilBloom;
    if (!settings?.enabled) {
      return undefined;
    }
    const normalized = clamp01((settings.intensity ?? 0) / 100);
    if (normalized <= 0) {
      return undefined;
    }
    return applySigilBloom(primaryName, normalized, this.rng);
  }

  private applyPreferredNames(
    primaryName: PrimaryName,
    gender: Gender,
    order?: OrderType
  ): void {
    const preferences = this.prompt?.preferredNames?.map((name) => name.trim()).filter(Boolean);
    if (!preferences?.length) {
      return;
    }

    const parsed = preferences
      .map((raw) => raw.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .map((raw) => {
        const parts = raw.split(" ").filter(Boolean);
        return {
          raw: capitalizeWords(raw),
          first: parts[0] ? capitalizeWords(parts[0]!) : undefined,
          last:
            parts.length > 1 ? capitalizeWords(parts[parts.length - 1]!) : undefined,
          middle:
            parts.length > 2
              ? parts.slice(1, -1).map((segment) => capitalizeWords(segment))
              : [],
        };
      });

    if (!parsed.length) {
      return;
    }

    const mononymCandidates = parsed.map((entry) => entry.raw);
    if (primaryName.nameMode === "mononym") {
      const resolvedMononym = this.resolveNamePreference(
        mononymCandidates,
        order ? getOrderMononyms(order) : undefined
      );
      if (resolvedMononym) {
        primaryName.mononym = resolvedMononym;
      }
      return;
    }

    const givenCandidates = parsed
      .map((entry) => entry.first)
      .filter((value): value is string => Boolean(value));
    const surnameCandidates = parsed
      .map((entry) => entry.last)
      .filter((value): value is string => Boolean(value));
    const middleCandidates = parsed.flatMap((entry) => entry.middle ?? []);

    const orderNamePool = order ? getOrderNames(order, gender) : undefined;
    const orderSurnamePool = order ? getOrderSurnames(order) : undefined;

    const resolvedFirst = this.resolveNamePreference(
      givenCandidates.length ? givenCandidates : mononymCandidates,
      orderNamePool
    );
    if (resolvedFirst) {
      primaryName.first = resolvedFirst;
    }

    if (primaryName.nameMode === "first_middle_last") {
      const resolvedMiddle = this.resolveNamePreference(
        middleCandidates.length ? middleCandidates : mononymCandidates,
        orderNamePool
      );
      if (resolvedMiddle) {
        primaryName.middle = resolvedMiddle;
      }
    }

    const resolvedLast = this.resolveNamePreference(
      surnameCandidates.length ? surnameCandidates : mononymCandidates,
      orderSurnamePool
    );
    if (resolvedLast) {
      primaryName.last = resolvedLast;
    }

    if (primaryName.nameMode === "fused_mononym") {
      const fusedParts: string[] = [];
      if (primaryName.first) fusedParts.push(primaryName.first);
      if (primaryName.last) fusedParts.push(primaryName.last);
      if (fusedParts.length) {
        primaryName.mononym = fuseNameParts(fusedParts, this.rng);
      }
    }
  }

  private resolveNamePreference(
    preferences: string[],
    candidatePool?: string[]
  ): string | undefined {
    const cleaned = preferences
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    if (!cleaned.length) {
      return undefined;
    }

    if (!candidatePool || candidatePool.length === 0) {
      return capitalizeWords(cleaned[0]!);
    }

    const normalizedCandidates = candidatePool.map((candidate) => candidate.trim());

    for (const pref of cleaned) {
      const exactMatch = normalizedCandidates.find(
        (candidate) => candidate.toLowerCase() === pref.toLowerCase()
      );
      if (exactMatch) {
        return exactMatch;
      }
    }

    let bestCandidate: string | undefined;
    let bestScore = Infinity;
    let sourceLength = cleaned[0]!.length;
    for (const pref of cleaned) {
      const normalizedPref = pref.toLowerCase();
      for (const candidate of normalizedCandidates) {
        const score = levenshteinDistance(normalizedPref, candidate.toLowerCase());
        if (score < bestScore) {
          bestScore = score;
          bestCandidate = candidate;
          sourceLength = pref.length;
        }
      }
    }

    if (bestCandidate && bestScore <= Math.max(2, Math.floor(sourceLength * 0.5))) {
      return bestCandidate;
    }

    return capitalizeWords(cleaned[0]!);
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
    const promptTraits = this.prompt?.desiredTraits?.map(capitalizeWords) ?? [];
    const promptSkills = this.prompt?.desiredSkills?.map(capitalizeWords) ?? [];
    const randomValues = shuffle(this.rng, PERSONALITY_VALUES).slice(0, 3);
    const values = dedupeStrings([...promptTraits, ...randomValues]).slice(0, 3);

    const defaultSummary = `A ${
      axes.introvertVsExtrovert > 0.5 ? "outward" : "inward"
    }-facing force whose ${axes.orderVsChaos > 0.5 ? "discipline" : "improvisation"
    } balances ${
      axes.faithVsDoubt > 0.5 ? "faith" : "doubt"
    } with ${
      axes.mercyVsRuthlessness > 0.5 ? "mercy" : "unyielding verdicts"
    }.`;

    let summary = defaultSummary;
    if (this.prompt?.personaDescription?.trim()) {
      summary = ensureSentence(this.prompt.personaDescription.trim());
    } else if (promptTraits.length || promptSkills.length) {
      const fragments: string[] = [];
      if (promptTraits.length) {
        fragments.push(`Guided by ${formatList(promptTraits)}`);
      }
      if (promptSkills.length) {
        fragments.push(`devoted to ${formatList(promptSkills)}`);
      }
      summary = ensureSentence(fragments.join(" and "));
    }

    return {
      summary,
      axes,
      coreValues: values,
    };
  }

  randomMythos(being: Being, heritage: Heritage): Mythos {
    const heritageDescriptor = describeHeritage(heritage);
    const promptTraits = this.prompt?.desiredTraits?.map(capitalizeWords) ?? [];
    const promptSkills = this.prompt?.desiredSkills?.map(capitalizeWords) ?? [];
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

    let originStory = `Born of ${heritageDescriptor} lineages, this ${being.order} ${
      being.office
    } was tempered in cities that sleep beneath thunder. They bound ${
      being.tarotArchetype
    } sigils into their bones and swore service to wandering caravans. Their legend is whispered in cathedrals carved into dunes.`;
    const originFragments: string[] = [];
    if (this.prompt?.personaDescription?.trim()) {
      originFragments.push(ensureSentence(this.prompt.personaDescription.trim()));
    }
    if (promptTraits.length) {
      originFragments.push(`They embody ${formatList(promptTraits)} ideals.`);
    }
    if (promptSkills.length) {
      originFragments.push(`Their craft centers on ${formatList(promptSkills)}.`);
    }
    if (originFragments.length) {
      originStory = `${originStory} ${originFragments.join(" ")}`;
    }

    const faction = randomChoice(this.rng, FACTIONS);

    const prophecyFocus = promptSkills[0]
      ? `awaken the age of ${promptSkills[0]}`
      : randomChoice(this.rng, [
          "ignite the last astral lighthouse",
          "untangle the twin moons",
          "silence a tyrant choir",
        ]);

    const prophecyOrCurse = `Prophecy claims they will ${prophecyFocus} when the ${being.tarotArchetype.replace(
      /_/g,
      " "
    )} is drawn three times in one night.`;

    const ritualAction = randomChoice(this.rng, RITUAL_ACTIONS);
    const ritualTail = promptSkills.length
      ? `interweaving ${formatList(promptSkills)} with every breath`
      : `anchoring allies to reality's seam`;
    const signatureRitual = `${ritualAction} while reciting the ${heritageDescriptor} canticles, ${ritualTail}.`;

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

  generateNameMeaning(
    primaryName: PrimaryName,
    heritage: Heritage,
    being: Being,
    options?: {
      basePrimaryName?: PrimaryName;
      stylization?: SigilBloomContext;
    }
  ): string {
    return generateNameMeaning(primaryName, heritage, being, options);
  }
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function clonePrimaryName(primaryName: PrimaryName): PrimaryName {
  return JSON.parse(JSON.stringify(primaryName));
}

function applySigilBloom(
  primaryName: PrimaryName,
  intensity: number,
  rng: RNG
): SigilBloomContext {
  if (primaryName.mononym) {
    primaryName.mononym = stylizeSegment(primaryName.mononym, intensity, rng, true);
  }
  if (primaryName.first) {
    primaryName.first = stylizeSegment(primaryName.first, intensity, rng);
  }
  if (primaryName.middle) {
    primaryName.middle = stylizeSegment(primaryName.middle, intensity, rng);
  }
  if (primaryName.last) {
    primaryName.last = stylizeSegment(primaryName.last, intensity, rng);
  }

  return {
    modeName: SIGIL_BLOOM_MODE_NAME,
    intensity,
  };
}

function applyAnachronisticClash(
  primaryName: PrimaryName,
  rng: RNG,
  lengthPreference?: "short" | "long"
): void {
  const sacred = randomChoice(rng, CLASH_SACRED_TITLES);
  const profaneSeed = randomChoice(rng, CLASH_PROFANE_CORES);
  const sanitize = (value: string) =>
    value
      .replace(/[^A-Za-z0-9\s\-'\+]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const baseCandidates = [
    primaryName.mononym,
    primaryName.first,
    primaryName.middle,
    primaryName.last,
  ]
    .filter((value): value is string => Boolean(value))
    .map(sanitize)
    .filter(Boolean);

  const anchorPool = [
    ...baseCandidates,
    ...CLASH_SACRED_ECHOES,
    ...CLASH_PROFANE_TRAILS,
    ...CLASH_INTERNET_HANDLES,
  ];
  const getAnchor = () => sanitize(randomChoice(rng, anchorPool));

  const desireShort = lengthPreference === "short";
  const desireLong = lengthPreference === "long";

  const buildShort = () => {
    const seedToken = profaneSeed.split(" ")[0];
    if (!anchorPool.length || rng() < 0.4) {
      return sanitize(seedToken);
    }
    const anchor = getAnchor().split(" ")[0];
    return sanitize(`${seedToken} ${anchor}`);
  };

  const buildLong = () => {
    const anchor = getAnchor();
    const extraAnchors: string[] = [];
    if (rng() < 0.7) extraAnchors.push(getAnchor());
    if (rng() < 0.4) extraAnchors.push(getAnchor());
    const patternGenerators: Array<(p: string, a: string) => string> = [
      (p, a) => `${p} ${a}`,
      (p, a) => `${p}-${a}`,
      (p, a) => `${p} of ${a}`,
      (p, a) => `${p} the ${a}`,
      (p, a) => `${p} of the ${a}`,
      (p, a) => `${p} + ${a}`,
    ];
    let result = randomChoice(rng, patternGenerators)(profaneSeed, anchor);
    for (const extra of extraAnchors) {
      result = `${result} ${randomChoice(rng, ["of", "and", "+"])} ${extra}`;
    }
    return sanitize(result);
  };

  let profane = desireLong ? buildLong() : buildShort();
  if (!desireLong && !desireShort && rng() < 0.5) {
    profane = buildLong();
  }

  primaryName.title = sacred;
  primaryName.nameMode = "mononym";
  primaryName.first = null;
  primaryName.middle = null;
  primaryName.last = null;
  primaryName.mononym = profane || `${profaneSeed} ${getAnchor()}`;
}

function stylizeSegment(
  value: string,
  intensity: number,
  rng: RNG,
  allowFrame = false
): string {
  if (!value || intensity <= 0) {
    return value;
  }

  let result = applyDiacriticsToValue(value, intensity, rng);
  result = adornWithGlyphs(result, intensity, rng, allowFrame ? 1.3 : 1);
  if (allowFrame && intensity > 0.1) {
    result = wrapWithSigilFrame(result, intensity, rng);
  }
  return result;
}

function applyDiacriticsToValue(value: string, intensity: number, rng: RNG): string {
  const characters = value.split("");
  const accentable = characters
    .map((char, index) => ({
      index,
      lower: char.toLowerCase(),
      isUpper: char === char.toUpperCase() && char !== char.toLowerCase(),
    }))
    .filter((entry) => DIACRITIC_MAP[entry.lower]);

  if (!accentable.length) {
    return value;
  }

  const replacements = Math.min(
    accentable.length,
    Math.max(1, Math.round(accentable.length * clamp01(intensity + 0.1)))
  );

  const candidates = [...accentable];
  for (let i = 0; i < replacements && candidates.length; i += 1) {
    const pickIndex = Math.floor(rng() * candidates.length);
    const target = candidates.splice(pickIndex, 1)[0]!;
    const glyph = randomChoice(rng, DIACRITIC_MAP[target.lower]);
    const resolvedGlyph = target.isUpper ? glyph.toUpperCase() : glyph;
    characters[target.index] = resolvedGlyph;
  }

  return characters.join("");
}

function adornWithGlyphs(
  value: string,
  intensity: number,
  rng: RNG,
  weight = 1
): string {
  if (intensity <= 0.2) {
    return value;
  }
  const clusterSize = Math.max(1, Math.round(intensity * 3 * weight));
  const suffix = createGlyphCluster(clusterSize, rng, ORNATE_GLYPHS);
  if (!suffix) {
    return value;
  }
  if (intensity > 0.55) {
    const prefix = createGlyphCluster(clusterSize, rng, ORNATE_GLYPHS);
    return `${prefix} ${value} ${suffix}`.replace(/\s+/g, " ").trim();
  }
  return `${value} ${suffix}`.trim();
}

function wrapWithSigilFrame(value: string, intensity: number, rng: RNG): string {
  const baseSize = Math.max(2, Math.round(intensity * 6));
  const left = createFrameCluster(baseSize, rng);
  const right = createFrameCluster(baseSize, rng);
  return `${left} ${value} ${right}`.replace(/\s+/g, " ").trim();
}

function createFrameCluster(size: number, rng: RNG): string {
  const glyphs: string[] = [];
  for (let i = 0; i < size; i += 1) {
    const pool = i % 2 === 0 ? TRIANGLE_GLYPHS : CROSS_GLYPHS;
    glyphs.push(randomChoice(rng, pool));
  }
  return glyphs.join("");
}

function createGlyphCluster(
  size: number,
  rng: RNG,
  glyphPool: string[] = ORNATE_GLYPHS
): string {
  if (size <= 0) {
    return "";
  }
  let cluster = "";
  for (let i = 0; i < size; i += 1) {
    cluster += randomChoice(rng, glyphPool);
  }
  return cluster;
}

function resolvePrimaryName(primaryName: PrimaryName): string {
  if (!primaryName) {
    return "";
  }
  const resolved =
    primaryName.first ??
    primaryName.mononym ??
    primaryName.last ??
    primaryName.middle ??
    "";
  return resolved ? resolved.toString().trim() : "";
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function ensureSentence(text: string): string {
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function formatList(values: string[], conjunction = "and"): string {
  const filtered = values.filter(Boolean);
  if (filtered.length === 0) return "";
  if (filtered.length === 1) return filtered[0]!;
  if (filtered.length === 2) {
    return `${filtered[0]} ${conjunction} ${filtered[1]}`;
  }
  return `${filtered.slice(0, -1).join(", ")}, ${conjunction} ${filtered.slice(-1)[0]}`;
}

function capitalizeWords(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ");
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i += 1) {
    matrix[i]![0] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j - 1]! + 1
        );
      }
    }
  }

  return matrix[a.length]![b.length]!;
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
  primaryName: PrimaryName,
  heritage: Heritage,
  being: Being,
  options?: {
    basePrimaryName?: PrimaryName;
    stylization?: SigilBloomContext;
  }
): string {
  const basePrimary = options?.basePrimaryName ?? primaryName;
  const resolvedBaseName = resolvePrimaryName(basePrimary);
  const targetName = resolvedBaseName.trim();

  let finalMeaning = buildCompoundMeaning(basePrimary, heritage, being);
  if (!finalMeaning) {
    const heritageDescriptor = describeHeritage(heritage);
    const orderTheme = ORDER_MEANING_THEMES[being.order];
    finalMeaning = targetName
      ? `${targetName} is a ${heritageDescriptor} name associated with ${orderTheme} among the ${being.order} order.`
      : `Nameless avatar of the ${being.order} order, honored for ${orderTheme}.`;
  }
  finalMeaning = ensureSentence(finalMeaning);

  return finalMeaning;
}

function buildCompoundMeaning(
  basePrimary: PrimaryName,
  heritage: Heritage,
  being: Being
): string {
  const components = extractNameComponents(basePrimary);
  if (!components.length) {
    return "";
  }

  const componentMeanings = components.map((name) => ({
    name,
    meaning: describeComponentMeaning(name, heritage, being),
  }));

  if (componentMeanings.length === 1) {
    const { name, meaning } = componentMeanings[0]!;
    return `${name}: ${meaning}`;
  }

  const compact = componentMeanings
    .map(({ name, meaning }) => `${name} (${meaning})`)
    .join("; ");

  const combinedName = components.join(" ");
  const orderTheme = ORDER_MEANING_THEMES[being.order];
  return `${compact}. Combined, ${combinedName} forms a single mantle of ${orderTheme}.`;
}

function extractNameComponents(primary: PrimaryName): string[] {
  const parts: string[] = [];

  const push = (value: string | null | undefined) => {
    if (value && value.trim().length > 0) {
      parts.push(value.trim());
    }
  };

  push(primary.title);
  push(primary.first);
  push(primary.middle);
  push(primary.last);

  const shouldIncludeMononym =
    primary.mononym &&
    (parts.length === 0 || primary.nameMode === "mononym");
  if (shouldIncludeMononym && primary.mononym) {
    const tokens = primary.mononym
      .split(/[\s_-]+/)
      .map((token) => token.trim())
      .filter(Boolean);
    if (tokens.length) {
      parts.push(...tokens);
    }
  }

  return parts;
}

function describeComponentMeaning(
  name: string,
  heritage: Heritage,
  being: Being
): string {
  const entry = NAME_MEANINGS[name.toLowerCase()];
  if (entry) {
    return entry;
  }
  const heritageDescriptor = describeHeritage(heritage);
  const orderTheme = ORDER_MEANING_THEMES[being.order];
  return `a ${heritageDescriptor} epithet aligned with ${orderTheme}.`;
}

function fuseNameParts(parts: string[], rng: RNG): string {
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
  const strategy = strategies[randomInt(rng, 0, strategies.length - 1)]!;
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
