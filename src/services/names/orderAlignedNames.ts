import { OrderType, Gender } from "../../models/avatar.js";

/**
 * Order-aligned name data sourced from mythological and cultural references
 * Sources: Greek/Roman mythology, Celtic folklore, Japanese yokai traditions,
 * Biblical/apocryphal texts, Gnostic texts, elemental traditions
 */

export type OrderNameBuckets = {
  male: string[];
  female: string[];
  androgynous: string[];
  surnames: string[];
  mononyms?: string[];
};

export const ORDER_NAME_DATA: Record<OrderType, OrderNameBuckets> = {
  // Angels - Biblical, Enochian, and celestial names
  angel: {
    male: [
      "Azrael",
      "Cassiel",
      "Uriel",
      "Raphael",
      "Gabriel",
      "Michael",
      "Raziel",
      "Sariel",
      "Lumiel",
      "Oroniel",
      "Cyrionel",
      "Seraphel",
      "Vaeliel",
      "Elyon",
    ],
    female: [
      "Seraphina",
      "Celestia",
      "Auriel",
      "Evangeline",
      "Angelica",
      "Mercy",
      "Grace",
      "Luminara",
      "Eliora",
      "Serapha",
      "Caliel",
      "Solenne",
      "Aureline",
    ],
    androgynous: ["Ariel", "Jophiel", "Haniel", "Zadkiel", "Metatron", "Soliel", "Orisiel", "Luminael", "Cyrinel", "Vaelion"],
    surnames: ["Lightbringer", "Starborn", "Celestis", "Devoran", "Aetherwing", "Dawncrest", "HaloWard", "RadiantVale", "Aethercrown"],
    mononyms: ["Lux", "Seraph", "Herald", "Sanctus", "Radiant", "Beacon", "Halo", "Dawn", "Candescent"],
  },

  // Demons - Goetic, infernal, and chthonic names
  demon: {
    male: ["Belial", "Amon", "Asmodeus", "Bael", "Malphas", "Vassago", "Ronove", "Cain", "Zareth", "Khalzor", "Morvane", "Varek", "Drevan", "Nocthar"],
    female: ["Lilith", "Naamah", "Agrat", "Mahalath", "Proserpina", "Eisheth", "Jezebel", "Morra", "Velzara", "Nerissa", "Zorya", "Bellara", "Vexia"],
    androgynous: ["Baphomet", "Leviathan", "Abaddon", "Samael", "Azazel", "Beleth", "Umbriel", "Noctar", "Nyxar", "Grim", "Ruin"],
    surnames: ["Infernus", "Shadowmere", "Abyss", "Noctis", "Hellborn", "Darkthorn", "Ashveil", "Cinderpact", "Bloodsigil", "Nightthorn"],
    mononyms: ["Shade", "Nox", "Void", "Umbra", "Ater", "Cinder", "Hex", "Fang", "Ruin"],
  },

  // Jinn - Arabic/Islamic mythological spirits
  jinn: {
    male: ["Iblis", "Malik", "Ghul", "Marid", "Ifrit", "Qarin", "Zawba'ah", "Faris", "Rashid", "Nadir", "Zahir", "Samir", "Jalil"],
    female: ["Zara", "Shams", "Laila", "Qamar", "Nasim", "Samira", "Ruhina", "Nura", "Sahar", "Yasmin", "Farah", "Aaliyah", "Nadira"],
    androgynous: ["Shaitan", "Buraq", "Zephyr", "Simoom", "Haboob", "Khamsin", "Sirocco", "Sirr", "Rihab", "Sahra"],
    surnames: ["al-Sihr", "al-Noor", "al-Sahra", "al-Rih", "al-Nar", "al-Qamar", "al-Ramal", "al-Sirr", "al-Ashar"],
    mononyms: ["Djinn", "Smokeless", "Flame", "Mirage", "Sirocco", "Ember", "Whirl", "Dune", "Zephyr"],
  },

  // Humans - Various cultural heroes and legendary mortals
  human: {
    male: ["Arthur", "Odysseus", "Beowulf", "Gilgamesh", "Achilles", "Siegfried", "Roland", "Theseus", "Hector", "Aeneas", "Tristan", "Rollo"],
    female: ["Morgana", "Penelope", "Judith", "Boudica", "Mulan", "Joan", "Cleopatra", "Ariadne", "Isolde", "Freydis", "Sigrid", "Helena"],
    androgynous: ["Robin", "Merlin", "Sage", "Percival", "Morgan", "Lancelot", "Quinn", "Rowan", "Sasha", "Jules", "Avery"],
    surnames: ["Ironheart", "Vanguard", "Mortal", "Earthbound", "Legacy", "Chronicle", "Wayfarer", "Stonefield", "Brightwood", "Oathbound"],
    mononyms: ["Champion", "Wanderer", "Hero", "Seeker", "Survivor", "Pilgrim", "Artisan", "Vigil", "Outrider"],
  },

  // Titans - Greek primordial deities
  titan: {
    male: ["Atlas", "Prometheus", "Hyperion", "Kronos", "Oceanus", "Helios", "Coeus", "Iapetus", "Crius", "Astraeus", "Pallas", "Epimetheus"],
    female: ["Rhea", "Themis", "Phoebe", "Tethys", "Mnemosyne", "Theia", "Dione", "Clymene", "Eurybia", "Ananke", "Asteria", "Eos"],
    androgynous: ["Metis", "Leto", "Asteria", "Selene", "Eos", "Ananke", "Moira", "Nemesis", "Chrona"],
    surnames: ["Primordial", "Worldbearer", "Titanborn", "Olympian", "Gigantes", "Firstborn", "Skyforge", "Stonecrown", "Worldroot", "Firstfire"],
    mononyms: ["Colossus", "Elder", "Primeval", "Vast", "Ancient", "Behemoth", "Foundation", "Eon"],
  },

  // Fae - Celtic and European fairy folk
  fae: {
    male: ["Oberon", "Puck", "Finvarra", "Ailill", "Gwyn", "Pwyll", "Midir", "Arawn", "Ciaran", "Eogan", "Faolan", "Rhydderch"],
    female: ["Titania", "Mab", "Oonagh", "Niamh", "Aine", "Maeve", "Etain", "Deirdre", "Brigid", "Aoife", "Roisin", "Eithne"],
    androgynous: ["Gossamer", "Willow", "Thorn", "Bramble", "Elderwood", "Moonshade", "Foxglove", "Moss", "Silverleaf", "Echofern"],
    surnames: ["Wildwood", "Glamour", "Moonwhisper", "Dewdrop", "Starlight", "Thornheart", "Glimmerdew", "Mistbloom", "Fernwhorl", "Moonlace"],
    mononyms: ["Sprite", "Pixie", "Changeling", "Wisp", "Glimmer", "Glamour", "Moth", "Dew"],
  },

  // Yokai - Japanese supernatural entities
  yokai: {
    male: ["Tengu", "Kappa", "Oni", "Raijin", "Fujin", "Inugami", "Ryujin", "Akio", "Haruto", "Renji", "Kaito", "Shiro", "Daichi"],
    female: ["Kitsune", "Yuki-onna", "Jorogumo", "Futakuchi-onna", "Nure-onna", "Hone-onna", "Yumi", "Hina", "Akari", "Sakura", "Mai", "Reiko"],
    androgynous: ["Tanuki", "Kodama", "Nue", "Kirin", "Tsukumogami", "Bakeneko", "Rei", "Makoto", "Haru", "Sora", "Kaede"],
    surnames: ["Yokaido", "Ayakashi", "Mononoke", "Yurei", "Bakemono", "Kurogane", "Shirogami", "Tsukikage", "Kazehara"],
    mononyms: ["Obake", "Mujina", "Henge", "Yasha", "Kamikaze", "Kage", "Mask", "Whisper", "Foxfire"],
  },

  // Elementals - Nature spirits from various traditions
  elemental: {
    male: ["Ignis", "Aquilo", "Zephyrus", "Geo", "Vulcan", "Boreas", "Notus", "Aeris", "Pyrr", "Glacius", "Flint", "Cinder"],
    female: ["Undine", "Sylph", "Salamandra", "Terra", "Aura", "Marina", "Ember", "Astraea", "Brine", "Calyx", "Sirova", "Glacia"],
    androgynous: ["Gnome", "Ifrit", "Djinn", "Nymph", "Dryad", "Naiad", "Oread", "Zephyr", "Spark", "Stone", "Mist", "Current"],
    surnames: ["Stormborn", "Earthshaper", "Flameheart", "Tidecaller", "Windwalker", "Cinderwake", "Mistweaver", "Stonewhorl", "Brinewell", "Skycurrent"],
    mononyms: ["Blaze", "Torrent", "Gale", "Quake", "Tempest", "Ember", "Mist", "Spark"],
  },

  // Nephilim - Biblical giants/half-angels
  nephilim: {
    male: ["Anak", "Goliath", "Og", "Nimrod", "Samyaza", "Azazel", "Gadreel", "Azariel", "Serapion", "Ezekar", "Malkor", "Raguel"],
    female: ["Naarah", "Zillah", "Adah", "Nephira", "Anakiel", "Seraphel", "Seraphine", "Eliara", "Zeriel", "Marael", "Azaia"],
    androgynous: ["Enoch", "Jared", "Mahalalel", "Kenan", "Seth", "Noah", "Uri", "Zadok"],
    surnames: ["Giantborn", "Halfblood", "Skyfall", "Earthshaker", "Starkin", "Skyborne", "Stonegiant", "Dawnfall", "Starbridge", "Cloudward"],
    mononyms: ["Colossus", "Hybrid", "Fallen", "Towering", "Giant", "Skyborn", "Halfstar", "Riftwalker"],
  },

  // Archons - Gnostic cosmic rulers
  archon: {
    male: ["Sabaoth", "Ialdabaoth", "Saklas", "Samael", "Authades", "Yao", "Oronos", "Kalyptos", "Aionis", "Sideron"],
    female: ["Sophia", "Barbelo", "Zoe", "Pronoia", "Pistis", "Achamoth", "Eirene", "Noema", "Aletheia", "Thelma"],
    androgynous: ["Abraxas", "Nous", "Logos", "Pleroma", "Bythos", "Sige", "Axiom", "Mandate", "Cipher", "Ordinance"],
    surnames: ["Aeonborn", "Demiurge", "Cosmocrator", "Aetheric", "Primarch", "Lawweft", "VoidEdict", "StarScript", "Pleromic", "Axiarch"],
    mononyms: ["Ruler", "Archon", "Eon", "Cosmic", "Prime", "Edict", "Axiom", "Mandate"],
  },

  // Dragonkin - Draconic-blooded mystics and warriors
  dragonkin: {
    male: ["Fafnir", "Kaedros", "Vythor", "Aurelian", "Tharos", "Drakon", "Skaelor", "Pyrrhos", "Vermis", "Kharzun"],
    female: ["Tiamara", "Saphyra", "Kaida", "Lyraeth", "Nythria", "Emberlyn", "Dracona", "Cindara", "Aurelith", "Vyrra"],
    androgynous: ["Ashwyn", "Dracel", "Kirin", "Emberis", "Skael", "Talyn", "Wyrmlyn", "Cinderis", "Skywyr", "Scaleveil"],
    surnames: ["Flamecrest", "Scaleheart", "Stormtalon", "Wyrmguard", "Pyreblood", "Ashscale", "Goldfang", "Skyfire", "Embercrown", "Ridgewyrm"],
    mononyms: ["Pyre", "Ember", "Wyrm", "Cinder", "Aerie", "Scale", "Skyfire", "Fang"],
  },

  // Constructs - Clockwork and arcane-forged beings
  construct: {
    male: ["Ferrus", "Axion", "Talos", "Cobal", "Gideon", "Quirin", "Vectron", "Sprocket", "Axiom", "Chronos", "Boltar"],
    female: ["Seraphiel", "Auriga", "Kalyx", "Vespera", "Ilyra", "Ophiel", "Nyxelle", "Korrax", "Lumira", "Axioma"],
    androgynous: ["Cipher", "Alloy", "Vector", "Nexus", "Parallax", "Circuit", "Module", "Kernel", "Mnemonic", "Relay"],
    surnames: ["Gearheart", "Ironkeep", "Mnemonic", "Coilbound", "GildedWard", "Clockspire", "Pulseforge", "CircuitVault", "AxiomGate", "SteelArchive"],
    mononyms: ["Cog", "Pulse", "Glyph", "Prime", "Halo", "Relay", "Kernel", "Module"],
  },

  // Eldritch - Void-touched prophets and aberrant seers
  eldritch: {
    male: ["Azathor", "Nyraem", "Ultharic", "Kezroth", "Vorun", "Eldaros", "Xeroth", "Qorun", "Malthyr", "Serovoid"],
    female: ["Azelia", "Ythria", "Noctessa", "Isyra", "Velith", "Zenara", "Nyssara", "Vorael", "Elyth", "Zerith"],
    androgynous: ["Xhaos", "Voidra", "Serolith", "Quorin", "Mhyrr", "Abyl", "Nulla", "Chasmiel", "Echoform", "Riftborn"],
    surnames: ["Starwound", "Voidborn", "Dreamrend", "Horizonfall", "Nullsigil", "BlackOrbit", "Abyssal", "Starless", "FarChorus", "NightWeft"],
    mononyms: ["Null", "Chasm", "Echo", "Abyss", "Rift", "Hush", "Orbit", "Starless"],
  },

  // Tricksters - sacred clowns, trolls, and paradox jesters
  trickster: {
    male: ["Anansi", "Loki", "Till", "Coyote", "Harlequin", "Pierrot", "Jape", "Quillon", "Merry", "Puckster"],
    female: ["Coyol", "Mara", "Mischala", "Vexa", "Lira", "Bellatrix", "Jinx", "Tansy", "Capri", "Wink"],
    androgynous: ["Jester", "Fool", "Carnivale", "Riddle", "Mockery", "Satire", "Quip", "Bumble", "Doodle", "Fable"],
    surnames: ["Laughline", "Prankweaver", "Trolltongue", "Chaosmask", "Gallowsgrin", "Jestwind", "Gigglebrook", "Jingle", "Oddluck"],
    mononyms: ["Guffaw", "Cackle", "Snicker", "Grin", "Jinx", "Wink", "Quip", "Bumble"],
  },
};

/**
 * Get order-appropriate names for mixing with cultural heritage names
 */
export function getOrderNames(order: OrderType, gender: Gender): string[] {
  const buckets = ORDER_NAME_DATA[order];
  const names: string[] = [];

  if (gender === "male") {
    names.push(...buckets.male);
  } else if (gender === "female") {
    names.push(...buckets.female);
  }

  names.push(...buckets.androgynous);

  return names;
}

export function getOrderSurnames(order: OrderType): string[] {
  return ORDER_NAME_DATA[order].surnames;
}

export function getOrderMononyms(order: OrderType): string[] {
  return ORDER_NAME_DATA[order].mononyms || [];
}
