import { Avatar, PrimaryName } from "../models/avatar.js";

export interface InworldDialogueGoal {
  id: string;
  description: string;
  priority: number;
}

export interface InworldKnowledgeEntry {
  topic: string;
  facts: string[];
}

export interface InworldBehaviorNode {
  nodeType: "trigger" | "response" | "action";
  condition?: string;
  response?: string;
  nextNodeId?: string;
}

export interface InworldCharacterPayload {
  name: string;
  displayName: string;
  description: string;
  personalityPrompt: string;
  tags: string[];
  dialogueGoals: InworldDialogueGoal[];
  knowledgeGraph: InworldKnowledgeEntry[];
  behaviorTree: InworldBehaviorNode[];
}

export function toInworldCharacter(avatar: Avatar): InworldCharacterPayload {
  const baseName = formatPrimaryName(avatar.identity.primaryName);
  const lightName =
    avatar.identity.pseudonyms.lightSide ?? baseName;
  const description = `${avatar.personality.summary} Known as ${avatar.mythos.shortTitle}.`;
  const personalityPrompt = [
    avatar.mythos.originStory,
    avatar.mythos.prophecyOrCurse,
    `Signature ritual: ${avatar.mythos.signatureRitual}`,
    `Values: ${avatar.personality.coreValues.join(", ")}`,
  ].join(" ");
  const tags = [
    ...avatar.heritage.components.map((component) => component.culture),
    avatar.being.order,
    avatar.being.office,
    avatar.being.tarotArchetype,
  ];

  const dialogueGoals: InworldDialogueGoal[] = [
    {
      id: "prophecy_fulfillment",
      description: avatar.mythos.prophecyOrCurse,
      priority: 10,
    },
    {
      id: "faction_loyalty",
      description: `Serve the interests of ${avatar.mythos.faction}`,
      priority: 8,
    },
    {
      id: "ritual_practice",
      description: `Perform and teach: ${avatar.mythos.signatureRitual}`,
      priority: 6,
    },
  ];

  const knowledgeGraph: InworldKnowledgeEntry[] = [
    {
      topic: "heritage",
      facts: avatar.heritage.components.map(
        (c) => `${Math.round(c.weight * 100)}% ${c.culture} lineage`
      ),
    },
    {
      topic: "faction",
      facts: [
        `Member of ${avatar.mythos.faction}`,
        `Role: ${avatar.being.office}`,
      ],
    },
    {
      topic: "tastes",
      facts: [
        `Music: ${avatar.tasteProfile.music.join(", ")}`,
        `Fashion: ${avatar.tasteProfile.fashion.join(", ")}`,
        `Indulgences: ${avatar.tasteProfile.indulgences.join(", ")}`,
      ],
    },
    {
      topic: "values",
      facts: avatar.personality.coreValues,
    },
  ];

  const behaviorTree: InworldBehaviorNode[] = [
    {
      nodeType: "trigger",
      condition: "user_greets",
      response: `Greetings. I am ${lightName}, ${avatar.being.office} of ${avatar.mythos.faction}.`,
      nextNodeId: "assess_intent",
    },
    {
      nodeType: "trigger",
      condition: "user_asks_about_prophecy",
      response: avatar.mythos.prophecyOrCurse,
      nextNodeId: "discuss_fate",
    },
    {
      nodeType: "trigger",
      condition: "user_asks_about_ritual",
      response: avatar.mythos.signatureRitual,
      nextNodeId: "ritual_explanation",
    },
    {
      nodeType: "action",
      condition: "threatened",
      response:
        avatar.personality.axes.mercyVsRuthlessness > 0.5
          ? "I offer you mercy, but do not mistake it for weakness."
          : "Your defiance will be met with swift judgment.",
    },
  ];

  return {
    name: baseName,
    displayName: lightName,
    description,
    personalityPrompt,
    tags,
    dialogueGoals,
    knowledgeGraph,
    behaviorTree,
  };
}

function formatPrimaryName(primaryName: PrimaryName): string {
  if (primaryName.nameMode === "mononym") {
    const base = primaryName.mononym ?? "Nameless";
    return [primaryName.title, base].filter(Boolean).join(" ").trim();
  }
  const parts = [primaryName.first, primaryName.middle, primaryName.last]
    .filter(Boolean)
    .join(" ")
    .trim();
  const fallback = primaryName.mononym ?? "Nameless";
  const fullName = parts || fallback;
  return [primaryName.title, fullName].filter(Boolean).join(" ").trim();
}
