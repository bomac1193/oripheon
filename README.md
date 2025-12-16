# Oripheon - Mythic AI Avatar Generator

A powerful backend API and web interface for generating mythic AI avatars with rich personalities, heritage, and backstories. Built to export to multiple AI conversational platforms.

## Features

- 🎭 **Mythic Avatar Generation** - Create unique characters with deep personalities, heritage, and mythos
- 🌍 **Multi-Cultural Heritage** - Support for Yoruba, Igbo, Arabic, Celtic, Norse, and European lineages
- 👤 **Thirteen Orders** - Angels, Demons, Jinn, Humans, Titans, Fae, Yokai, Elementals, Nephilim, Archons, Dragonkin, Constructs, and Eldritch entities with unique offices and roles
- 🧠 **Guided Prompts** - Describe traits, duties, and favorite names to steer each avatar's identity
- ✨ **Name Forge (Office Box)** - Archetype → Traits (max 3) → Name Style, with optional Titles/Epithets and aesthetic scoring
- 📜 **Accurate Name Meanings** - Each chosen name resolves to a sourced etymology or mythic epithet, never a random phrase
- 🃏 **Tarot Archetypes** - 22 Major Arcana archetypes for personality depth
- 🎨 **Beautiful Web Interface** - Modern, responsive UI for easy avatar generation
- 💾 **SQLite Database** - Automatic persistence of all generated avatars
- 🔌 **AI Platform Adapters** - Export to Inworld, Convai, and Charisma.ai formats

## AI Platform Support

### Inworld Adapter
- Dialogue goals with priority system
- Knowledge graphs (heritage, faction, tastes, values)
- Behavior trees with triggers and responses

### Convai Adapter
- Actions with triggers
- Goals with related topics
- Core memories (episodic and semantic)
- Voice configuration (pitch, speed, emotion)

### Charisma.ai Adapter
- Scene graphs with transitions
- Trait curves with dynamic events
- Narrative beats (exposition, rising action, climax, resolution)

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open http://localhost:3333 in your browser.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server status

### Name Generation
- `GET /name-data` - Archetypes + trait metadata for the UI
- `POST /names/generate` - Generate top 10 names (seeded + aesthetic scoring)

### Avatar Management
- `POST /avatars/generate` - Generate new avatar
- `GET /avatars` - List all avatars (query: ?limit=N&offset=N)
- `GET /avatars/:id` - Get specific avatar
- `POST /avatars/:id/reroll` - Reroll avatar with optional locks

### AI Platform Adapters
- `GET /avatars/:id/inworld` - Export to Inworld format
- `GET /avatars/:id/convai` - Export to Convai format
- `GET /avatars/:id/charisma` - Export to Charisma.ai format

### API Info
- `GET /api` - Get API documentation

## Example Usage

### Generate Avatar via API

```javascript
fetch('http://localhost:3333/avatars/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seed: 42,
    identity: { gender: 'female' },
    being: { order: 'angel' }
  })
}).then(r => r.json()).then(console.log)
```

### Prompt Customization

Supply a `prompt` object to steer traits, duties, and preferred names:

```javascript
fetch('http://localhost:3333/avatars/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: {
      personaDescription: 'Solar tactician guarding nomad convoys',
      desiredTraits: ['Stoic', 'Strategic'],
      desiredSkills: ['Storm weaving', 'Battlefield medicine'],
      preferredNames: ['Astra', 'Kael'],

      // Name Forge (game-genre inspired, but original output)
      nameArchetype: 'ashen_seer',
      nameTraits: ['prophet', 'archivist'],
      nameStyle: 'eloquent',
      allowEpithets: true
    }
  })
}).then(r => r.json()).then(console.log)
```

Prompt fields:
- `personaDescription` – freeform sentence describing vibe or mission
- `desiredTraits` – array of adjectives or values to prioritize
- `desiredSkills` – array of duties or abilities to weave into mythos
- `preferredNames` – list of names to either use directly or match with the closest database entry
- `nameArchetype` – name-generation archetype (enables the Name Forge pipeline)
- `nameTraits` – up to 3 trait ids (e.g. `prophet`, `blacksmith`, `memelord`)
- `nameStyle` – optional style (`eloquent`, `harsh`, `noble`, `mystic`, `street`, `corporate`, `comic`)
- `allowEpithets` – whether to append epithets like “the Far‑Seeing” / “of Ash”

## Screenshots

![Office box: Archetype → Traits → Style](docs/screenshots/office-box.png)

![Name suggestions + selection](docs/screenshots/name-suggestions.png)

## Notes

The Name Forge is **game-genre inspired** (dark fantasy / space opera / urban chaos / occult / internet-comedy vibes), but it only produces **original** names and text.

### Generate Avatar via CLI

```bash
npm run cli -- generate --seed=42 --gender=female --order=angel
npm run cli -- list --limit=5
```

## Avatar Properties

### Identity
- Primary name (mononym, first/last, or first/middle/last)
- Title (optional)
- Light and dark side pseudonyms
- Gender (male, female, androgynous)

### Heritage
- Single or mixed cultural lineage
- Six cultures: Yoruba, Igbo, Arabic, Celtic, Norse, European

### Being
- Order: Angel, Demon, Jinn, Human, Titan, Fae, Yokai, Elemental, Nephilim, Archon, Dragonkin, Construct, Eldritch
- Office: Unique role within the order
- Tarot Archetype: One of 22 Major Arcana

### Appearance
- Age appearance
- Presentation style
- Key features (3 distinctive traits)

### Personality
- Four axes: Order/Chaos, Mercy/Ruthlessness, Introvert/Extrovert, Faith/Doubt
- Core values (3)
- Generated personality summary

### Mythos
- Short title
- Origin story
- Faction affiliation
- Prophecy or curse
- Signature ritual

### Taste Profile
- Music preferences
- Fashion style
- Indulgences
- Likes and dislikes

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with better-sqlite3
- **Name Generation**: In-memory culturally-aware generator
- **Randomization**: Seedable PRNG with seedrandom
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Project Structure

```
oripheon/
├── src/
│   ├── server.ts              # Main Express server
│   ├── models/
│   │   └── avatar.ts          # Avatar type definitions
│   ├── db/
│   │   ├── database.ts        # SQLite setup
│   │   └── avatarRepository.ts # Avatar CRUD operations
│   ├── services/
│   │   ├── avatarService.ts   # Business logic
│   │   ├── randomizer.ts      # Avatar generation
│   │   └── names/             # Name generation
│   ├── adapters/
│   │   ├── inworldAdapter.ts  # Inworld export
│   │   ├── convaiAdapter.ts   # Convai export
│   │   └── charismaAdapter.ts # Charisma export
│   ├── routes/
│   │   └── avatarRoutes.ts    # API routes
│   └── utils/
│       └── prng.ts            # Seeded random utilities
├── scripts/
│   └── cli.ts                 # CLI tool
├── public/
│   └── index.html             # Web interface
└── package.json
```

## License

ISC

## Credits

Inspired by SOMA Enner, Elektron Monomachine/Digitakt, SOMA Pulsar-23, and RAVE.

Built with Claude Code.
