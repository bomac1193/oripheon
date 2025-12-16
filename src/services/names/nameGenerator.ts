import { Gender, Heritage, OrderType, TarotArchetype } from "../../models/avatar.js";
import { RNG } from "../../utils/prng.js";

export interface NameGenerator {
  generateGivenName(
    gender: Gender,
    heritage: Heritage,
    rng: RNG,
    order?: OrderType,
    tarotArchetype?: TarotArchetype
  ): string;
  generateSurname(
    gender: Gender,
    heritage: Heritage,
    rng: RNG,
    order?: OrderType,
    tarotArchetype?: TarotArchetype
  ): string;
  generateMononym(
    gender: Gender,
    heritage: Heritage,
    rng: RNG,
    order?: OrderType,
    tarotArchetype?: TarotArchetype
  ): string;
}
