import { Gender, Heritage, OrderType, TarotArchetype } from "../../models/avatar.js";
import { RNG } from "../../utils/prng.js";
import { NameGenerator } from "./nameGenerator.js";

export class ExternalApiNameGenerator implements NameGenerator {
  constructor(private baseUrl: string, private apiKey?: string) {}

  generateGivenName(
    _gender: Gender,
    _heritage: Heritage,
    _rng: RNG,
    _order?: OrderType,
    _tarotArchetype?: TarotArchetype
  ): string {
    throw new Error("External API generator not implemented");
  }

  generateSurname(
    _gender: Gender,
    _heritage: Heritage,
    _rng: RNG,
    _order?: OrderType,
    _tarotArchetype?: TarotArchetype
  ): string {
    throw new Error("External API generator not implemented");
  }

  generateMononym(
    _gender: Gender,
    _heritage: Heritage,
    _rng: RNG,
    _order?: OrderType,
    _tarotArchetype?: TarotArchetype
  ): string {
    throw new Error("External API generator not implemented");
  }
}
