import { Gender, Heritage } from "../../models/avatar.js";
import { RNG } from "../../utils/prng.js";

export interface NameGenerator {
  generateGivenName(gender: Gender, heritage: Heritage, rng: RNG): string;
  generateSurname(gender: Gender, heritage: Heritage, rng: RNG): string;
  generateMononym(gender: Gender, heritage: Heritage, rng: RNG): string;
}
