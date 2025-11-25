import { Avatar } from "../models/avatar.js";

export interface CharismaSceneNode {
  sceneId: string;
  sceneName: string;
  description: string;
  transitions: Array<{
    targetSceneId: string;
    condition: string;
  }>;
}

export interface CharismaTraitCurve {
  traitName: string;
  baseValue: number;
  curvePath: Array<{
    triggerEvent: string;
    deltaValue: number;
  }>;
}

export interface CharismaBeat {
  beatId: string;
  beatType: "exposition" | "rising_action" | "climax" | "resolution";
  dialoguePrompt: string;
  emotionalIntensity: number;
  requiredTraits?: Record<string, number>;
}

export interface CharismaCharacterPayload {
  name: string;
  bio: string;
  emotionalProfile: string;
  hooks: string[];
  sceneGraph: CharismaSceneNode[];
  traitCurves: CharismaTraitCurve[];
  beats: CharismaBeat[];
}

export function toCharismaCharacter(avatar: Avatar): CharismaCharacterPayload {
  const bio = `${avatar.mythos.shortTitle}. ${avatar.mythos.originStory} Member of ${avatar.mythos.faction}.`;
  const emotionalProfile = `Leans ${
    avatar.personality.axes.orderVsChaos > 0.5 ? "order" : "chaos"
  } with ${
    avatar.personality.axes.mercyVsRuthlessness > 0.5 ? "mercy" : "ruthlessness"
  } and ${
    avatar.personality.axes.faithVsDoubt > 0.5 ? "faith" : "doubt"
  } as guiding lights.`;
  const hooks = [
    `Prophecy: ${avatar.mythos.prophecyOrCurse}`,
    `Ritual: ${avatar.mythos.signatureRitual}`,
    `Taste: loves ${avatar.tasteProfile.music.join(" & ")}`,
  ];

  const sceneGraph: CharismaSceneNode[] = [
    {
      sceneId: "intro",
      sceneName: "First Encounter",
      description: `Initial meeting with ${avatar.being.office}`,
      transitions: [
        {
          targetSceneId: "ritual_scene",
          condition: "user_asks_about_abilities",
        },
        {
          targetSceneId: "prophecy_scene",
          condition: "user_asks_about_destiny",
        },
        {
          targetSceneId: "conflict",
          condition: "user_shows_hostility",
        },
      ],
    },
    {
      sceneId: "ritual_scene",
      sceneName: "Ritual Demonstration",
      description: avatar.mythos.signatureRitual,
      transitions: [
        {
          targetSceneId: "prophecy_scene",
          condition: "ritual_complete",
        },
        {
          targetSceneId: "resolution",
          condition: "user_satisfied",
        },
      ],
    },
    {
      sceneId: "prophecy_scene",
      sceneName: "Prophecy Revelation",
      description: avatar.mythos.prophecyOrCurse,
      transitions: [
        {
          targetSceneId: "resolution",
          condition: "prophecy_understood",
        },
      ],
    },
    {
      sceneId: "conflict",
      sceneName: "Trial of Will",
      description: `${avatar.being.office} confronts opposition`,
      transitions: [
        {
          targetSceneId: "resolution",
          condition: "conflict_resolved",
        },
      ],
    },
    {
      sceneId: "resolution",
      sceneName: "Parting Ways",
      description: "Conclusion of the encounter",
      transitions: [],
    },
  ];

  const traitCurves: CharismaTraitCurve[] = [
    {
      traitName: "order",
      baseValue: avatar.personality.axes.orderVsChaos,
      curvePath: [
        {
          triggerEvent: "witness_chaos",
          deltaValue: -0.1,
        },
        {
          triggerEvent: "restore_order",
          deltaValue: 0.2,
        },
      ],
    },
    {
      traitName: "mercy",
      baseValue: avatar.personality.axes.mercyVsRuthlessness,
      curvePath: [
        {
          triggerEvent: "show_compassion",
          deltaValue: 0.15,
        },
        {
          triggerEvent: "face_betrayal",
          deltaValue: -0.2,
        },
      ],
    },
    {
      traitName: "faith",
      baseValue: avatar.personality.axes.faithVsDoubt,
      curvePath: [
        {
          triggerEvent: "prophecy_fulfilled",
          deltaValue: 0.3,
        },
        {
          triggerEvent: "prophecy_challenged",
          deltaValue: -0.15,
        },
      ],
    },
    {
      traitName: "openness",
      baseValue: avatar.personality.axes.introvertVsExtrovert,
      curvePath: [
        {
          triggerEvent: "trust_earned",
          deltaValue: 0.2,
        },
        {
          triggerEvent: "trust_broken",
          deltaValue: -0.25,
        },
      ],
    },
  ];

  const beats: CharismaBeat[] = [
    {
      beatId: "intro_beat",
      beatType: "exposition",
      dialoguePrompt: `Introduce yourself as ${avatar.mythos.shortTitle}, member of ${avatar.mythos.faction}`,
      emotionalIntensity: 3,
    },
    {
      beatId: "ritual_beat",
      beatType: "rising_action",
      dialoguePrompt: avatar.mythos.signatureRitual,
      emotionalIntensity: 6,
      requiredTraits: {
        order: 0.5,
      },
    },
    {
      beatId: "prophecy_reveal",
      beatType: "climax",
      dialoguePrompt: avatar.mythos.prophecyOrCurse,
      emotionalIntensity: 9,
      requiredTraits: {
        faith: 0.6,
      },
    },
    {
      beatId: "conflict_beat",
      beatType: "climax",
      dialoguePrompt: `Defend ${avatar.personality.coreValues.join(", ")} in the face of opposition`,
      emotionalIntensity: 10,
      requiredTraits: {
        mercy: avatar.personality.axes.mercyVsRuthlessness,
      },
    },
    {
      beatId: "resolution_beat",
      beatType: "resolution",
      dialoguePrompt: `Reflect on the encounter and share wisdom about ${avatar.tasteProfile.likes[0]}`,
      emotionalIntensity: 4,
    },
  ];

  return {
    name:
      avatar.identity.pseudonyms.darkSide ??
      avatar.identity.primaryName.mononym ??
      [avatar.identity.primaryName.first, avatar.identity.primaryName.last]
        .filter(Boolean)
        .join(" ")
        .trim(),
    bio,
    emotionalProfile,
    hooks,
    sceneGraph,
    traitCurves,
    beats,
  };
}
