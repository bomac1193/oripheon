import { Avatar } from "../models/avatar.js";

export interface ConvaiAction {
  actionId: string;
  actionName: string;
  trigger: string;
  description: string;
}

export interface ConvaiGoal {
  goalId: string;
  description: string;
  priority: number;
  relatedTopics: string[];
}

export interface ConvaiMemory {
  memoryType: "core" | "episodic" | "semantic";
  content: string;
  importance: number;
}

export interface ConvaiVoiceConfig {
  voiceType: string;
  pitch: number;
  speed: number;
  emotion: string;
}

export interface ConvaiCharacterPayload {
  name: string;
  backstory: string;
  personality: string;
  conversationalTones: string[];
  actions: ConvaiAction[];
  goals: ConvaiGoal[];
  coreMemories: ConvaiMemory[];
  voiceConfig: ConvaiVoiceConfig;
}

export function toConvaiCharacter(avatar: Avatar): ConvaiCharacterPayload {
  const backstory = `${avatar.mythos.originStory} ${avatar.mythos.signatureRitual}`;
  const personality = `${avatar.personality.summary} Core values: ${avatar.personality.coreValues.join(
    ", "
  )}. Prophecy: ${avatar.mythos.prophecyOrCurse}`;
  const conversationalTones = [
    avatar.being.order,
    avatar.being.office,
    avatar.being.tarotArchetype,
  ];

  const actions: ConvaiAction[] = [
    {
      actionId: "perform_ritual",
      actionName: "Perform Signature Ritual",
      trigger: "when asked about rituals or seeking guidance",
      description: avatar.mythos.signatureRitual,
    },
    {
      actionId: "share_prophecy",
      actionName: "Reveal Prophecy",
      trigger: "when discussing fate or future events",
      description: avatar.mythos.prophecyOrCurse,
    },
    {
      actionId: "invoke_faction",
      actionName: "Invoke Faction Authority",
      trigger: "when authority or alliance is questioned",
      description: `Speak on behalf of ${avatar.mythos.faction}`,
    },
  ];

  const goals: ConvaiGoal[] = [
    {
      goalId: "fulfill_prophecy",
      description: avatar.mythos.prophecyOrCurse,
      priority: 10,
      relatedTopics: ["destiny", "fate", "future", avatar.being.tarotArchetype],
    },
    {
      goalId: "uphold_values",
      description: `Live by the values of ${avatar.personality.coreValues.join(", ")}`,
      priority: 8,
      relatedTopics: ["morality", "ethics", "beliefs"],
    },
    {
      goalId: "serve_faction",
      description: `Advance the goals of ${avatar.mythos.faction}`,
      priority: 7,
      relatedTopics: ["faction", "duty", "loyalty", avatar.mythos.faction],
    },
  ];

  const coreMemories: ConvaiMemory[] = [
    {
      memoryType: "core",
      content: avatar.mythos.originStory,
      importance: 10,
    },
    {
      memoryType: "core",
      content: `Identity: ${avatar.being.office} of the ${avatar.being.order} order`,
      importance: 9,
    },
    {
      memoryType: "semantic",
      content: `Heritage: ${avatar.heritage.components
        .map((c) => `${Math.round(c.weight * 100)}% ${c.culture}`)
        .join(", ")}`,
      importance: 7,
    },
    {
      memoryType: "semantic",
      content: `Likes: ${avatar.tasteProfile.likes.join(", ")}`,
      importance: 5,
    },
    {
      memoryType: "semantic",
      content: `Dislikes: ${avatar.tasteProfile.dislikes.join(", ")}`,
      importance: 5,
    },
  ];

  const voiceConfig: ConvaiVoiceConfig = {
    voiceType:
      avatar.personality.axes.introvertVsExtrovert > 0.5
        ? "confident"
        : "contemplative",
    pitch:
      avatar.identity.gender === "male"
        ? 0.7
        : avatar.identity.gender === "female"
        ? 1.3
        : 1.0,
    speed:
      avatar.personality.axes.orderVsChaos > 0.5 ? 0.9 : 1.1,
    emotion:
      avatar.personality.axes.mercyVsRuthlessness > 0.5
        ? "compassionate"
        : "stern",
  };

  return {
    name: avatar.identity.primaryName.mononym
      ? avatar.identity.primaryName.mononym
      : [avatar.identity.primaryName.first, avatar.identity.primaryName.last]
          .filter(Boolean)
          .join(" ")
          .trim(),
    backstory,
    personality,
    conversationalTones,
    actions,
    goals,
    coreMemories,
    voiceConfig,
  };
}
