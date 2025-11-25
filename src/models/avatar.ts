export type Gender = "male" | "female" | "androgynous";

export type HeritageCulture =
  | "african_yoruba"
  | "african_igbo"
  | "arabic"
  | "caucasian_european"
  | "celtic"
  | "norse_viking";

export type HeritageMode = "single" | "mixed";

export interface HeritageComponent {
  culture: HeritageCulture;
  weight: number; // 0.0 - 1.0
}

export interface Heritage {
  mode: HeritageMode;
  components: HeritageComponent[];
}

export type OrderType = "angel" | "demon" | "jinn" | "human";

export type TarotArchetype =
  | "fool"
  | "magician"
  | "high_priestess"
  | "empress"
  | "emperor"
  | "hierophant"
  | "lovers"
  | "chariot"
  | "strength"
  | "hermit"
  | "wheel_of_fortune"
  | "justice"
  | "hanged_man"
  | "death"
  | "temperance"
  | "devil"
  | "tower"
  | "star"
  | "moon"
  | "sun"
  | "judgement"
  | "world";

export type NameMode = "mononym" | "first_last" | "first_middle_last";

export interface PrimaryName {
  title: string | null;
  nameMode: NameMode;
  first: string | null;
  middle: string | null;
  last: string | null;
  mononym: string | null;
}

export interface Pseudonyms {
  lightSide?: string | null;
  darkSide?: string | null;
}

export interface Identity {
  primaryName: PrimaryName;
  pseudonyms: Pseudonyms;
  gender: Gender;
}

export interface Being {
  order: OrderType;
  office: string;
  tarotArchetype: TarotArchetype;
}

export interface Appearance {
  ageAppearance: string;
  presentation: string;
  keyFeatures: string[];
}

export interface PersonalityAxes {
  orderVsChaos: number;
  mercyVsRuthlessness: number;
  introvertVsExtrovert: number;
  faithVsDoubt: number;
}

export interface Personality {
  summary: string;
  axes: PersonalityAxes;
  coreValues: string[];
}

export interface Mythos {
  shortTitle: string;
  originStory: string;
  faction: string;
  prophecyOrCurse: string;
  signatureRitual: string;
}

export interface TasteProfile {
  music: string[];
  fashion: string[];
  indulgences: string[];
  likes: string[];
  dislikes: string[];
}

export interface Avatar {
  id: string;
  seed: number;
  identity: Identity;
  heritage: Heritage;
  being: Being;
  appearance: Appearance;
  personality: Personality;
  mythos: Mythos;
  tasteProfile: TasteProfile;
  createdAt: string;
}

export interface AvatarGenerationParams {
  seed?: number;
  identity?: {
    title?: string | null;
    nameMode?: NameMode;
    gender?: Gender;
  };
  heritage?: Heritage;
  being?: Partial<Being>;
  needPseudonyms?: boolean;
  locks?: string[];
}
