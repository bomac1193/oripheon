export type NameArchetypeGroup =
  | "Soulslike / Dark Fantasy"
  | "Sci-fi / Space Opera"
  | "Urban Chaos / Gangster Sandbox"
  | "Mythic / Occult"
  | "Comedy / Internet";

export type NameStyleId =
  | "eloquent"
  | "harsh"
  | "noble"
  | "mystic"
  | "street"
  | "corporate"
  | "comic";

export type TraitId =
  | "blacksmith"
  | "prophet"
  | "memelord"
  | "assassin"
  | "paladin"
  | "exile"
  | "techno_mage"
  | "bounty_hunter"
  | "archivist"
  | "street_saint";

export type SyllableWeights = Record<string, number>;

export interface NameArchetypeDefinition {
  id: string;
  label: string;
  group: NameArchetypeGroup;
  suggestedTraits: TraitId[];
  syllableBoosts?: SyllableWeights;
  titlePool?: string[];
  epithetPool?: string[];
}

export interface TraitDefinition {
  id: TraitId;
  label: string;
  syllableBoosts: SyllableWeights;
  titlePool?: string[];
  epithetPool?: string[];
}

export interface NameStyleDefinition {
  id: NameStyleId;
  label: string;
  syllableBoosts: SyllableWeights;
  minSyllables: number;
  maxSyllables: number;
  titleChance: number;
  epithetChance: number;
}

export const BASE_SYLLABLES: Array<{ item: string; weight: number }> = [
  { item: "a", weight: 1 },
  { item: "ae", weight: 0.8 },
  { item: "al", weight: 1 },
  { item: "an", weight: 1 },
  { item: "ar", weight: 1 },
  { item: "au", weight: 0.7 },
  { item: "bel", weight: 0.8 },
  { item: "ca", weight: 1 },
  { item: "cel", weight: 0.8 },
  { item: "cor", weight: 0.8 },
  { item: "da", weight: 1 },
  { item: "de", weight: 1 },
  { item: "del", weight: 0.9 },
  { item: "dra", weight: 0.9 },
  { item: "el", weight: 1.1 },
  { item: "en", weight: 1.1 },
  { item: "ene", weight: 0.9 },
  { item: "er", weight: 1 },
  { item: "eth", weight: 0.8 },
  { item: "fa", weight: 0.9 },
  { item: "fen", weight: 0.8 },
  { item: "fi", weight: 0.9 },
  { item: "for", weight: 0.7 },
  { item: "ga", weight: 0.9 },
  { item: "gal", weight: 0.9 },
  { item: "gi", weight: 0.8 },
  { item: "gra", weight: 0.7 },
  { item: "ha", weight: 0.8 },
  { item: "hel", weight: 0.9 },
  { item: "ia", weight: 0.8 },
  { item: "il", weight: 0.9 },
  { item: "in", weight: 0.9 },
  { item: "ion", weight: 0.8 },
  { item: "ir", weight: 0.9 },
  { item: "is", weight: 0.9 },
  { item: "ka", weight: 1 },
  { item: "kel", weight: 0.8 },
  { item: "ke", weight: 0.9 },
  { item: "ki", weight: 0.9 },
  { item: "la", weight: 1 },
  { item: "lan", weight: 0.9 },
  { item: "len", weight: 1 },
  { item: "li", weight: 1 },
  { item: "lin", weight: 1 },
  { item: "lo", weight: 0.9 },
  { item: "lu", weight: 0.8 },
  { item: "ly", weight: 0.7 },
  { item: "ma", weight: 1 },
  { item: "mal", weight: 0.8 },
  { item: "mir", weight: 0.8 },
  { item: "mo", weight: 0.9 },
  { item: "na", weight: 1 },
  { item: "ne", weight: 1 },
  { item: "nel", weight: 0.9 },
  { item: "ni", weight: 1 },
  { item: "no", weight: 0.9 },
  { item: "nor", weight: 0.7 },
  { item: "ny", weight: 0.7 },
  { item: "nyx", weight: 0.4 },
  { item: "oa", weight: 0.6 },
  { item: "ol", weight: 0.9 },
  { item: "on", weight: 1 },
  { item: "or", weight: 1 },
  { item: "ora", weight: 0.9 },
  { item: "os", weight: 0.8 },
  { item: "pha", weight: 0.6 },
  { item: "pro", weight: 0.6 },
  { item: "qua", weight: 0.5 },
  { item: "ra", weight: 1 },
  { item: "rav", weight: 0.6 },
  { item: "re", weight: 1 },
  { item: "ren", weight: 0.9 },
  { item: "ri", weight: 1 },
  { item: "rin", weight: 0.9 },
  { item: "ro", weight: 0.9 },
  { item: "sa", weight: 1 },
  { item: "san", weight: 0.8 },
  { item: "ser", weight: 0.8 },
  { item: "shi", weight: 0.5 },
  { item: "sib", weight: 0.5 },
  { item: "sil", weight: 0.6 },
  { item: "sin", weight: 0.6 },
  { item: "so", weight: 0.8 },
  { item: "sol", weight: 0.8 },
  { item: "sta", weight: 0.6 },
  { item: "stel", weight: 0.6 },
  { item: "syn", weight: 0.7 },
  { item: "sy", weight: 0.6 },
  { item: "ta", weight: 1 },
  { item: "tel", weight: 0.8 },
  { item: "tem", weight: 0.7 },
  { item: "tha", weight: 0.6 },
  { item: "the", weight: 0.5 },
  { item: "thon", weight: 0.5 },
  { item: "tri", weight: 0.6 },
  { item: "ul", weight: 0.6 },
  { item: "ur", weight: 0.7 },
  { item: "va", weight: 1 },
  { item: "val", weight: 0.9 },
  { item: "vel", weight: 0.9 },
  { item: "ven", weight: 0.8 },
  { item: "ver", weight: 0.8 },
  { item: "vi", weight: 0.9 },
  { item: "vor", weight: 0.6 },
  { item: "vox", weight: 0.5 },
  { item: "wa", weight: 0.6 },
  { item: "wyn", weight: 0.5 },
  { item: "xa", weight: 0.3 },
  { item: "xe", weight: 0.3 },
  { item: "za", weight: 0.4 },
  { item: "zen", weight: 0.6 },
];

export const TRAITS: Record<TraitId, TraitDefinition> = {
  blacksmith: {
    id: "blacksmith",
    label: "Blacksmith",
    syllableBoosts: {
      khar: 1.2,
      bryn: 1.0,
      gald: 0.9,
      thon: 0.7,
      keld: 0.8,
      tem: 0.6,
      for: 0.6,
    },
    titlePool: ["Master", "Artificer", "Forgewright"],
    epithetPool: ["the Tempered", "of Emberforge", "of Quiet Cinders", "the Hearth-Bound"],
  },
  prophet: {
    id: "prophet",
    label: "Prophet",
    syllableBoosts: {
      sy: 1.4,
      sib: 1.2,
      bel: 1.2,
      lin: 1.1,
      ene: 1.0,
      el: 1.1,
      ora: 0.8,
    },
    titlePool: ["Oracle", "Saint", "Sister", "Brother", "Dr.", "Prophet"],
    epithetPool: ["the Far-Seeing", "of Candlelight", "the Veil-Blessed", "of Quiet Storms"],
  },
  memelord: {
    id: "memelord",
    label: "Memelord",
    syllableBoosts: {
      kek: 1.6,
      meme: 1.2,
      bop: 1.0,
      zoop: 0.9,
      snark: 0.8,
      wub: 0.8,
    },
    titlePool: ["Lord", "Mod", "Poster", "Dr."],
    epithetPool: ["the Upvoted", "of Infinite Threads", "the Unhinged", "of Glorious Lag"],
  },
  assassin: {
    id: "assassin",
    label: "Assassin",
    syllableBoosts: { sil: 1.1, nyx: 1.0, vor: 0.8, kry: 0.9, sin: 0.7, shi: 0.8 },
    titlePool: ["Shade", "Agent", "Wraith"],
    epithetPool: ["of the Thin Veil", "the Unseen", "of Last Light"],
  },
  paladin: {
    id: "paladin",
    label: "Paladin",
    syllableBoosts: { val: 1.2, aur: 0.8, ser: 0.9, gal: 0.8, ren: 0.8, el: 0.5 },
    titlePool: ["Sir", "Dame", "Knight", "Saint"],
    epithetPool: ["of the Dawn Oath", "the Radiant", "of Gold Vows"],
  },
  exile: {
    id: "exile",
    label: "Exile",
    syllableBoosts: { sol: 0.9, ash: 1.0, wan: 0.8, nor: 0.7, drift: 0.8, ren: 0.4 },
    titlePool: ["Wanderer", "Outcast"],
    epithetPool: ["of Ash Roads", "the Unmoored", "of Silent Borders"],
  },
  techno_mage: {
    id: "techno_mage",
    label: "Techno‑Mage",
    syllableBoosts: { neo: 1.1, syn: 1.0, qua: 0.8, cor: 0.6, byte: 0.7, arc: 0.8 },
    titlePool: ["Arcanist", "Engineer", "Cipher"],
    epithetPool: ["of Neon Sigils", "the Circuit-Seer", "of Quantum Runes"],
  },
  bounty_hunter: {
    id: "bounty_hunter",
    label: "Bounty Hunter",
    syllableBoosts: { vex: 1.0, jax: 0.9, rin: 0.6, gra: 0.5, vox: 0.6, hunt: 0.8 },
    titlePool: ["Captain", "Ranger", "Warden"],
    epithetPool: ["of Broken Warrants", "the Red-Handed", "of Dust Contracts"],
  },
  archivist: {
    id: "archivist",
    label: "Archivist",
    syllableBoosts: { lex: 1.0, cod: 0.9, arc: 0.9, lin: 0.6, cer: 0.6, vel: 0.5 },
    titlePool: ["Scribe", "Curator", "Archivist", "Professor"],
    epithetPool: ["of the Hidden Index", "the Page-Bound", "of Quiet Vaults"],
  },
  street_saint: {
    id: "street_saint",
    label: "Street Saint",
    syllableBoosts: { san: 1.0, sol: 0.8, vox: 0.6, ri: 0.4, jax: 0.8, la: 0.4 },
    titlePool: ["Saint", "Sister", "Brother"],
    epithetPool: ["of Side-Street Altars", "the Graffiti-Blessed", "of Neon Mercy"],
  },
};

export const STYLES: Record<NameStyleId, NameStyleDefinition> = {
  eloquent: {
    id: "eloquent",
    label: "Eloquent",
    syllableBoosts: { el: 1.0, ene: 0.6, ia: 0.6, au: 0.5, vel: 0.7, lin: 0.4 },
    minSyllables: 3,
    maxSyllables: 4,
    titleChance: 0.35,
    epithetChance: 0.25,
  },
  harsh: {
    id: "harsh",
    label: "Harsh",
    syllableBoosts: { gra: 0.8, dra: 0.8, thon: 0.7, vor: 0.7, za: 0.5 },
    minSyllables: 2,
    maxSyllables: 3,
    titleChance: 0.2,
    epithetChance: 0.15,
  },
  noble: {
    id: "noble",
    label: "Noble",
    syllableBoosts: { val: 0.9, ren: 0.8, gal: 0.7, aur: 0.6, ion: 0.5 },
    minSyllables: 3,
    maxSyllables: 4,
    titleChance: 0.45,
    epithetChance: 0.35,
  },
  mystic: {
    id: "mystic",
    label: "Mystic",
    syllableBoosts: { nyx: 0.8, ora: 0.9, sy: 0.6, ae: 0.5, eth: 0.6 },
    minSyllables: 3,
    maxSyllables: 4,
    titleChance: 0.35,
    epithetChance: 0.35,
  },
  street: {
    id: "street",
    label: "Street",
    syllableBoosts: { jax: 0.9, vox: 0.7, za: 0.6, ri: 0.4, de: 0.5 },
    minSyllables: 2,
    maxSyllables: 3,
    titleChance: 0.15,
    epithetChance: 0.2,
  },
  corporate: {
    id: "corporate",
    label: "Corporate",
    syllableBoosts: { cor: 1.0, syn: 0.9, qua: 0.7, lex: 0.7, ion: 0.6 },
    minSyllables: 2,
    maxSyllables: 3,
    titleChance: 0.25,
    epithetChance: 0.15,
  },
  comic: {
    id: "comic",
    label: "Comic",
    syllableBoosts: { bop: 1.0, kek: 0.8, meme: 0.6, zoop: 0.6, wub: 0.6 },
    minSyllables: 2,
    maxSyllables: 4,
    titleChance: 0.3,
    epithetChance: 0.3,
  },
};

export const ARCHETYPES: NameArchetypeDefinition[] = [
  {
    id: "dusk_knight",
    label: "Dusk Knight",
    group: "Soulslike / Dark Fantasy",
    suggestedTraits: ["paladin", "exile", "assassin"],
    syllableBoosts: { dusk: 0.9, dra: 0.4, mor: 0.5, ren: 0.4, vel: 0.3 },
    epithetPool: ["of Ash", "the Hollow-True", "of Dusk Vows"],
  },
  {
    id: "ashen_seer",
    label: "Ashen Seer",
    group: "Soulslike / Dark Fantasy",
    suggestedTraits: ["prophet", "exile", "archivist"],
    syllableBoosts: { ash: 1.0, sy: 0.4, bel: 0.4, lin: 0.4, ora: 0.4 },
    titlePool: ["Oracle", "Seer", "Saint"],
    epithetPool: ["the Far-Seeing", "of Candle Ash", "of Quiet Storms"],
  },
  {
    id: "grave_warden",
    label: "Grave Warden",
    group: "Soulslike / Dark Fantasy",
    suggestedTraits: ["assassin", "paladin", "exile"],
    syllableBoosts: { gra: 0.9, vor: 0.5, thon: 0.4, ren: 0.3 },
    titlePool: ["Warden", "Knight"],
    epithetPool: ["of Stone Quiet", "the Night-Bound", "of Last Light"],
  },
  {
    id: "void_captain",
    label: "Void Captain",
    group: "Sci-fi / Space Opera",
    suggestedTraits: ["bounty_hunter", "techno_mage", "archivist"],
    syllableBoosts: { vox: 0.6, neo: 0.7, syn: 0.6, xa: 0.3, zen: 0.4 },
    titlePool: ["Captain", "Commander"],
    epithetPool: ["of Deep Orbits", "the Star-Quiet", "of Black Signals"],
  },
  {
    id: "neon_technomancer",
    label: "Neon Technomancer",
    group: "Sci-fi / Space Opera",
    suggestedTraits: ["techno_mage", "prophet", "archivist"],
    syllableBoosts: { neo: 1.0, syn: 0.8, ora: 0.4, ae: 0.3, ion: 0.3 },
    titlePool: ["Arcanist", "Cipher", "Oracle"],
    epithetPool: ["of Neon Sigils", "the Circuit-Seer", "of Quantum Runes"],
  },
  {
    id: "star_archivist",
    label: "Star Archivist",
    group: "Sci-fi / Space Opera",
    suggestedTraits: ["archivist", "exile", "techno_mage"],
    syllableBoosts: { stel: 0.8, lex: 0.8, cor: 0.4, lin: 0.3 },
    titlePool: ["Archivist", "Curator", "Professor"],
    epithetPool: ["of the Hidden Index", "the Page-Bound", "of Quiet Vaults"],
  },
  {
    id: "alley_oracle",
    label: "Alley Oracle",
    group: "Urban Chaos / Gangster Sandbox",
    suggestedTraits: ["street_saint", "prophet", "assassin"],
    syllableBoosts: { jax: 0.6, vox: 0.6, sy: 0.4, rin: 0.3, za: 0.4 },
    titlePool: ["Oracle", "Sister", "Brother"],
    epithetPool: ["of Side-Street Altars", "the Graffiti-Blessed", "of Neon Mercy"],
  },
  {
    id: "chrome_hustler",
    label: "Chrome Hustler",
    group: "Urban Chaos / Gangster Sandbox",
    suggestedTraits: ["bounty_hunter", "memelord", "exile"],
    syllableBoosts: { cor: 0.6, vox: 0.5, zoop: 0.3, bop: 0.3, ren: 0.3 },
    titlePool: ["Captain", "Boss"],
    epithetPool: ["the Upvoted", "of Glorious Lag", "of Dust Contracts"],
  },
  {
    id: "night_runner",
    label: "Night Runner",
    group: "Urban Chaos / Gangster Sandbox",
    suggestedTraits: ["assassin", "bounty_hunter", "techno_mage"],
    syllableBoosts: { nyx: 0.6, rin: 0.6, vox: 0.4, syn: 0.4 },
    titlePool: ["Agent", "Runner"],
    epithetPool: ["of Last Light", "the Unseen", "of Broken Warrants"],
  },
  {
    id: "sigil_scribe",
    label: "Sigil Scribe",
    group: "Mythic / Occult",
    suggestedTraits: ["archivist", "prophet", "techno_mage"],
    syllableBoosts: { sig: 0.9, sy: 0.5, lex: 0.4, eth: 0.5, ora: 0.4 },
    titlePool: ["Scribe", "Oracle", "Curator"],
    epithetPool: ["of Quiet Vaults", "the Veil-Blessed", "of Candlelight"],
  },
  {
    id: "temple_assassin",
    label: "Temple Assassin",
    group: "Mythic / Occult",
    suggestedTraits: ["assassin", "paladin", "exile"],
    syllableBoosts: { tha: 0.5, sil: 0.6, nyx: 0.4, val: 0.3 },
    titlePool: ["Wraith", "Knight"],
    epithetPool: ["of the Thin Veil", "of Gold Vows", "the Unseen"],
  },
  {
    id: "rift_blacksmith",
    label: "Rift Blacksmith",
    group: "Mythic / Occult",
    suggestedTraits: ["blacksmith", "techno_mage", "exile"],
    syllableBoosts: { khar: 0.8, tem: 0.6, syn: 0.4, vel: 0.3 },
    titlePool: ["Forgewright", "Artificer"],
    epithetPool: ["of Emberforge", "the Tempered", "of Quiet Cinders"],
  },
  {
    id: "thread_prophet",
    label: "Thread Prophet",
    group: "Comedy / Internet",
    suggestedTraits: ["memelord", "prophet", "street_saint"],
    syllableBoosts: { kek: 0.6, meme: 0.5, sy: 0.5, lin: 0.3, vox: 0.3 },
    titlePool: ["Oracle", "Mod", "Saint"],
    epithetPool: ["of Infinite Threads", "the Upvoted", "of Side-Street Altars"],
  },
  {
    id: "emoji_saint",
    label: "Emoji Saint",
    group: "Comedy / Internet",
    suggestedTraits: ["street_saint", "memelord", "archivist"],
    syllableBoosts: { meme: 0.4, san: 0.5, lex: 0.3, bop: 0.4, el: 0.2 },
    titlePool: ["Saint", "Sister", "Brother"],
    epithetPool: ["the Graffiti-Blessed", "of Glorious Lag", "of Neon Mercy"],
  },
  {
    id: "copypasta_archivist",
    label: "Copypasta Archivist",
    group: "Comedy / Internet",
    suggestedTraits: ["archivist", "memelord", "techno_mage"],
    syllableBoosts: { lex: 0.6, cor: 0.4, syn: 0.4, kek: 0.3, meme: 0.3 },
    titlePool: ["Archivist", "Curator", "Poster"],
    epithetPool: ["of Infinite Threads", "the Page-Bound", "of Glorious Lag"],
  },
];

export const BASE_TITLES = [
  "Dr.",
  "Saint",
  "Sister",
  "Brother",
  "Oracle",
  "Professor",
  "Captain",
  "Sir",
  "Dame",
];

export const BASE_EPITHETS = [
  "the Far-Seeing",
  "the Radiant",
  "the Unseen",
  "the Unbroken",
  "of Ash",
  "of Candlelight",
  "of Quiet Vaults",
  "of Neon Mercy",
  "of Last Light",
];

export function toNameDataForUI(): {
  archetypes: Record<string, { label: string; group: NameArchetypeGroup; suggestedTraits: TraitId[] }>;
  traits: Record<TraitId, { label: string }>;
} {
  const archetypes = Object.fromEntries(
    ARCHETYPES.map((a) => [
      a.id,
      { label: a.label, group: a.group, suggestedTraits: a.suggestedTraits },
    ])
  );
  const traits = Object.fromEntries(
    (Object.keys(TRAITS) as TraitId[]).map((id) => [id, { label: TRAITS[id].label }])
  ) as Record<TraitId, { label: string }>;
  return { archetypes, traits };
}

