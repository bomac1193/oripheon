import test from "node:test";
import assert from "node:assert/strict";

import { createRng } from "../../utils/prng.js";
import {
  aestheticScore,
  formatPrimaryName,
  generateNameCandidates,
  normalizeTraitIds,
} from "./nameForge.js";

test("trait selection limit = 3", () => {
  const traits = normalizeTraitIds([
    "prophet",
    "blacksmith",
    "memelord",
    "assassin",
  ]);
  assert.equal(traits.length, 3);
  assert.deepEqual(traits, ["prophet", "blacksmith", "memelord"]);
});

test("deterministic output with seed", () => {
  const options = {
    archetype: "ashen_seer",
    traits: normalizeTraitIds(["prophet", "archivist", "street_saint"]),
    style: "eloquent" as const,
    allowTitles: true,
    allowEpithets: true,
    nameMode: "first_last" as const,
    candidates: 30,
    limit: 10,
  };

  const namesA = generateNameCandidates(createRng(42), options).map(formatPrimaryName);
  const namesB = generateNameCandidates(createRng(42), options).map(formatPrimaryName);

  assert.deepEqual(namesA, namesB);
});

test("aestheticScore penalizes ugly clusters", () => {
  const ugly = aestheticScore("Xqptkz");
  const pretty = aestheticScore("Aeloria");
  assert.ok(pretty > ugly);
});

