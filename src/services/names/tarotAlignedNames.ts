import { Gender, TarotArchetype } from "../../models/avatar.js";

export type TarotNameBuckets = {
  male: string[];
  female: string[];
  androgynous: string[];
  surnames: string[];
  mononyms?: string[];
};

export const TAROT_NAME_DATA: Record<TarotArchetype, TarotNameBuckets> = {
  fool: {
    male: ["Pippin", "Jory", "Quillon", "Merry", "Tumble", "Bramble", "Jape", "Rascal"],
    female: ["Pippa", "Mira", "Lolly", "Rilla", "Tansy", "Bree", "Jinx", "Capri"],
    androgynous: ["Pip", "Quip", "Merri", "Bumble", "Doodle", "Skipper", "Wink", "Fable"],
    surnames: ["Jestwind", "Gigglebrook", "Tumblefoot", "Capers", "Brightfool", "Riddlewalk", "Jingle", "Oddluck"],
    mononyms: ["Jape", "Wink", "Quip", "Bumble", "Tumble", "Merri"],
  },
  magician: {
    male: ["Lucan", "Aurel", "Cassian", "Marcell", "Orion", "Severin", "Eldric", "Calder"],
    female: ["Aurelia", "Liora", "Seren", "Vespera", "Elowen", "Cassia", "Maris", "Ilyra"],
    androgynous: ["Aster", "Meridian", "Rune", "Caelum", "Sable", "Vail", "Oris", "Nyren"],
    surnames: ["Sigilwright", "Spellweaver", "Arcbound", "Cipherhand", "Runebrook", "Starcoil", "Veilkeeper", "Hexward"],
    mononyms: ["Rune", "Cipher", "Sigil", "Aster", "Vail", "Meridian"],
  },
  high_priestess: {
    male: ["Elias", "Solon", "Amonel", "Cassiel", "Noerian", "Theron", "Iovian", "Maloren"],
    female: ["Seloria", "Noema", "Elyra", "Isyra", "Seraphine", "Lunara", "Arielle", "Vaela"],
    androgynous: ["Sable", "Oracle", "Noiriel", "Halcyon", "Aster", "Eiren", "Vesper", "Lumen"],
    surnames: ["Veilborne", "Candlewatch", "Moonvigil", "QuietSeer", "Sanctuary", "WhisperNun", "Omenwell", "AshWarden"],
    mononyms: ["Oracle", "Lumen", "Vesper", "Halcyon", "Seer", "Noema"],
  },
  empress: {
    male: ["Aurelian", "Valerius", "Cassian", "Octavian", "Hadrian", "Marcellus", "Severus", "Dorian"],
    female: ["Aurelia", "Valeria", "Octavia", "Cassiana", "Sabina", "Helena", "Marcella", "Diona"],
    androgynous: ["Regent", "Aurel", "Valen", "Crown", "August", "Seren", "Civis", "Imperial"],
    surnames: ["Crownward", "GildedHouse", "Throneborne", "IvoryCourt", "Lionsigil", "GoldenMantle", "MarbleKeep", "VioletCrest"],
    mononyms: ["Regent", "Crown", "August", "Aurelia", "Valen", "Imperial"],
  },
  emperor: {
    male: ["Octavian", "Aurelian", "Cassian", "Valerian", "Hadrian", "Tiber", "Severin", "Marcell"],
    female: ["Octavia", "Aurelia", "Cassia", "Valeria", "Hadriana", "Sabine", "Severina", "Maris"],
    androgynous: ["Crown", "Regent", "Sovereign", "August", "Imperial", "Lionheart", "Throne", "Viceroy"],
    surnames: ["Throneward", "IronCrown", "CivicLaurel", "Imperius", "MarbleCourt", "LionStandard", "GildedBanner", "RoyalSigil"],
    mononyms: ["Sovereign", "Regent", "August", "Crown", "Throne", "Viceroy"],
  },
  hierophant: {
    male: ["Benedan", "Athan", "Calder", "Jerom", "Silvan", "Orrin", "Pontel", "Kyrion"],
    female: ["Benedetta", "Athenia", "Calindra", "Seraphia", "Maren", "Soline", "Kyria", "Elspeth"],
    androgynous: ["Cleric", "Abbess", "Scribe", "Cantor", "Vesper", "Lantern", "Hallow", "Covenant"],
    surnames: ["Hallowgate", "Covenant", "Chantwell", "Sanctum", "OathScript", "Reliquary", "Bellkeeper", "Templeward"],
    mononyms: ["Cantor", "Scribe", "Cleric", "Hallow", "Lantern", "Covenant"],
  },
  lovers: {
    male: ["Evan", "Lucian", "Soren", "Adrian", "Ronan", "Cass", "Elio", "Milan"],
    female: ["Elara", "Liora", "Vivienne", "Isolde", "Serena", "Amara", "Niamh", "Aine"],
    androgynous: ["Arden", "Rowan", "Quinn", "Jules", "Morgan", "Vale", "Ariel", "Noor"],
    surnames: ["Heartglen", "Roseveil", "Softwind", "Twinlight", "Everkind", "Bondwell", "Moonkiss", "Dawnlace"],
    mononyms: ["Vale", "Arden", "Rowan", "Liora", "Noor", "Quinn"],
  },
  chariot: {
    male: ["Kade", "Rourke", "Talon", "Darius", "Rex", "Sable", "Kael", "Jaxon"],
    female: ["Vera", "Rhea", "Lyra", "Thalia", "Kara", "Nova", "Bria", "Daria"],
    androgynous: ["Rider", "Vanguard", "Strider", "Arrow", "Steel", "Torque", "Riven", "Pace"],
    surnames: ["IronStride", "Stormcar", "BannerRun", "Roadmarshal", "Swiftward", "Spearwheel", "Trailguard", "Jetstream"],
    mononyms: ["Vanguard", "Strider", "Rider", "Arrow", "Pace", "Torque"],
  },
  strength: {
    male: ["Bryn", "Thorne", "Garron", "Stellan", "Torin", "Ragnar", "Bastian", "Calum"],
    female: ["Thora", "Brynna", "Astrid", "Freya", "Rowena", "Signe", "Eira", "Kaida"],
    androgynous: ["Stone", "Iron", "Vale", "Storm", "Atlas", "Sage", "Warden", "Frost"],
    surnames: ["Ironheart", "Stoneguard", "Bearmantle", "Stormhold", "Oakshield", "Wolfbinder", "Lionwrought", "Cinderarm"],
    mononyms: ["Stone", "Iron", "Warden", "Storm", "Atlas", "Frost"],
  },
  hermit: {
    male: ["Silas", "Erem", "Peregrin", "Rowan", "Orrin", "Talen", "Cael", "Nolan"],
    female: ["Eira", "Maren", "Sable", "Elowen", "Niamh", "Lina", "Seren", "Wren"],
    androgynous: ["Wren", "Sage", "Lantern", "Pilgrim", "Ash", "Vale", "Hollow", "Drift"],
    surnames: ["LanternKeep", "QuietRoad", "HollowVale", "AshWalker", "FarStone", "Driftwood", "Caveborn", "Solitary"],
    mononyms: ["Sage", "Pilgrim", "Lantern", "Ash", "Wren", "Drift"],
  },
  wheel_of_fortune: {
    male: ["Kismet", "Fortun", "Ravel", "Chance", "Lark", "Orris", "Talon", "Caius"],
    female: ["Fortuna", "Kisma", "Ravelle", "Seren", "Lark", "Mira", "Carys", "Astra"],
    androgynous: ["Chance", "Spindle", "Wheel", "Gamble", "Turner", "Kismet", "Riddle", "Orbit"],
    surnames: ["Turnwheel", "Spindlemark", "Coinflip", "GildedChance", "Fateweft", "Luckborne", "Orbitline", "RavelRoad"],
    mononyms: ["Kismet", "Chance", "Spindle", "Orbit", "Ravel", "Fortuna"],
  },
  justice: {
    male: ["Justan", "Dorian", "Verin", "Athan", "Calder", "Lucius", "Tiber", "Galen"],
    female: ["Justine", "Verity", "Doria", "Athenia", "Clara", "Lucia", "Sabina", "Galia"],
    androgynous: ["Verdict", "Balance", "Witness", "Vigil", "Scale", "Oath", "Law", "Merit"],
    surnames: ["Scalehold", "Oathkeeper", "VerdictHall", "Lawspire", "Meritstone", "Justicar", "WitnessGate", "BalanceLine"],
    mononyms: ["Verdict", "Vigil", "Scale", "Oath", "Merit", "Witness"],
  },
  hanged_man: {
    male: ["Talen", "Rowan", "Silas", "Peregrin", "Eldan", "Nolan", "Cael", "Orin"],
    female: ["Wren", "Maren", "Elara", "Seren", "Noemi", "Isolde", "Lina", "Eira"],
    androgynous: ["Reversal", "Still", "Sway", "Knot", "Hollow", "Aster", "Vail", "Drift"],
    surnames: ["Stillcord", "HangingBough", "Knotwise", "Swayline", "TurnedPath", "QuietBind", "Ropewalker", "Reversal"],
    mononyms: ["Still", "Sway", "Knot", "Drift", "Vail", "Hollow"],
  },
  death: {
    male: ["Morin", "Noctan", "Cinder", "Riven", "Vorin", "Thane", "Kezro", "Eldar"],
    female: ["Noctessa", "Cindra", "Mora", "Vespera", "Nyx", "Isyra", "Velith", "Zenara"],
    androgynous: ["Ash", "Ruin", "Cinder", "Null", "Shade", "Requiem", "Grave", "Hush"],
    surnames: ["Graveward", "Ashenveil", "Nightfall", "Cinderborne", "Requiem", "Hushkeep", "BlackRiver", "QuietGrave"],
    mononyms: ["Ash", "Shade", "Cinder", "Requiem", "Hush", "Grave"],
  },
  temperance: {
    male: ["Seren", "Calen", "Harmon", "Lucan", "Eiren", "Dorian", "Aurel", "Silvan"],
    female: ["Serena", "Calma", "Harmony", "Elara", "Eirene", "Clara", "Aurelia", "Selene"],
    androgynous: ["Balance", "Tide", "Stillwater", "Mingle", "Even", "Measure", "Quiet", "Hearth"],
    surnames: ["Stillwater", "Evenhand", "Hearthmeasure", "QuietTide", "Balancewell", "Softscale", "Calmriver", "Harmonic"],
    mononyms: ["Balance", "Even", "Measure", "Quiet", "Hearth", "Tide"],
  },
  devil: {
    male: ["Malach", "Vesper", "Asmode", "Belan", "Damon", "Ravik", "Samael", "Korrin"],
    female: ["Lilura", "Vespera", "Belara", "Damina", "Ravina", "Nyssa", "Seraxa", "Morrin"],
    androgynous: ["Tempt", "Chain", "Velvet", "Vow", "Gild", "Vice", "Shadow", "Hex"],
    surnames: ["Chainborne", "VelvetVow", "Vicegate", "GildedSin", "ShadowPact", "Hexbound", "NightContract", "Temptress"],
    mononyms: ["Vesper", "Hex", "Vice", "Chain", "Shadow", "Tempt"],
  },
  tower: {
    male: ["Riven", "Shard", "Krag", "Vorun", "Eldric", "Talon", "Brax", "Drevan"],
    female: ["Rivna", "Sharda", "Kara", "Vora", "Elyra", "Talia", "Brea", "Drava"],
    androgynous: ["Shatter", "Storm", "Ruin", "Crack", "Spire", "Fall", "Echo", "Ash"],
    surnames: ["Shatterspire", "Stormfall", "Ruinstone", "Cracklight", "BrokenCrest", "FellTower", "AshRampart", "EchoWall"],
    mononyms: ["Ruin", "Shatter", "Storm", "Echo", "Spire", "Fall"],
  },
  star: {
    male: ["Stellan", "Aster", "Lucan", "Orion", "Caelum", "Elio", "Novaen", "Solan"],
    female: ["Astra", "Liora", "Selene", "Elara", "Nova", "Aurora", "Lyra", "Solara"],
    androgynous: ["Lumen", "Aster", "Nova", "Halo", "Beacon", "Starlit", "Dawn", "Gleam"],
    surnames: ["Starborne", "Beaconwell", "Dawncrest", "HaloWard", "Skylight", "Aurorafield", "Gleamridge", "Starlace"],
    mononyms: ["Nova", "Lumen", "Halo", "Beacon", "Dawn", "Aster"],
  },
  moon: {
    male: ["Selan", "Lunor", "Noctan", "Orin", "Eldan", "Caelum", "Marek", "Vesper"],
    female: ["Selene", "Lunara", "Noctessa", "Eira", "Isolde", "Velith", "Maren", "Vespera"],
    androgynous: ["Moon", "Vail", "Noir", "Gloom", "Tide", "Hush", "Crescent", "Silver"],
    surnames: ["Moonveil", "CrescentHall", "SilverTide", "Noirwater", "Hushpond", "NightMirror", "Vailstone", "Lunarwatch"],
    mononyms: ["Vail", "Hush", "Crescent", "Silver", "Moon", "Noir"],
  },
  sun: {
    male: ["Helio", "Solan", "Aurel", "Lucan", "Rayan", "Dorian", "Caelum", "Stellan"],
    female: ["Solara", "Aurelia", "Lucia", "Elara", "Raya", "Doria", "Caela", "Stella"],
    androgynous: ["Radiant", "Dawn", "Lumen", "Gold", "Beacon", "Bright", "Halo", "Solar"],
    surnames: ["Suncrest", "Dawnward", "Goldray", "Brightwell", "Solaris", "HaloCrown", "RadiantVale", "Lumenfield"],
    mononyms: ["Dawn", "Lumen", "Radiant", "Halo", "Gold", "Solar"],
  },
  judgement: {
    male: ["Callan", "Verin", "Dorian", "Lucius", "Athan", "Galen", "Orin", "Severin"],
    female: ["Calla", "Verity", "Doria", "Lucia", "Athena", "Galia", "Oria", "Severina"],
    androgynous: ["Awaken", "Summons", "Witness", "Verdict", "Trumpet", "Rising", "Coda", "Reckon"],
    surnames: ["TrumpetCall", "RisingGate", "Reckoning", "VerdictDawn", "WitnessStone", "Summons", "Awakened", "CodaLine"],
    mononyms: ["Summons", "Rising", "Witness", "Reckon", "Coda", "Awaken"],
  },
  world: {
    male: ["Orbis", "Galen", "Atlas", "Caelum", "Dorian", "Silvan", "Eldan", "Taren"],
    female: ["Gaia", "Terra", "Selene", "Aurora", "Clara", "Serena", "Elara", "Liora"],
    androgynous: ["Whole", "Horizon", "Compass", "Axis", "Sphere", "Voyage", "Crown", "Bridge"],
    surnames: ["Horizonline", "Worldbridge", "Axisway", "Compassrose", "Spherehold", "Voyager", "Everpath", "Allroads"],
    mononyms: ["Horizon", "Compass", "Axis", "Sphere", "Voyage", "Bridge"],
  },
};

export function getTarotNames(archetype: TarotArchetype, gender: Gender): string[] {
  const buckets = TAROT_NAME_DATA[archetype];
  const names: string[] = [];

  if (gender === "male") {
    names.push(...buckets.male);
  } else if (gender === "female") {
    names.push(...buckets.female);
  }

  names.push(...buckets.androgynous);
  return names;
}

export function getTarotSurnames(archetype: TarotArchetype): string[] {
  return TAROT_NAME_DATA[archetype].surnames;
}

export function getTarotMononyms(archetype: TarotArchetype): string[] {
  return TAROT_NAME_DATA[archetype].mononyms || [];
}
