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
