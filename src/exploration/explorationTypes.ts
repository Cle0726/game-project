export interface Vec2 {
  x: number;
  y: number;
}

export interface RectZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExplorationWaypoint {
  id: string;
  position: Vec2;
  links: string[];
}

export interface ExplorationNpcScheduleEntry {
  minuteOfDay: number;
  targetWaypointId: string;
  activity: string;
}

export interface ExplorationDialogueLine {
  speaker: string;
  text: string;
}

export interface ExplorationQuestTarget {
  type: 'npc' | 'zone';
  id: string;
}

export interface ExplorationNpcDefinition {
  id: string;
  name: string;
  position: Vec2;
  speed?: number;
  storySceneId?: string;
  interactionText: string;
  schedule?: ExplorationNpcScheduleEntry[];
  spriteSrc?: string;
  questCompleteId?: string;
  mapDialogue?: ExplorationDialogueLine[];
}

export interface ExplorationInteractionZone {
  id: string;
  name: string;
  area: Omit<RectZone, 'id'>;
  interactionText: string;
  storySceneId?: string;
  statusText?: string;
  questCompleteId?: string;
  /** Show this zone only after the authored legacy event has happened. */
  requiredGameEvent?: string;
  /** Show this zone after any one of the authored legacy events has happened. */
  requiredAnyGameEvents?: string[];
  /** Consume this physical interaction after one successful use in the region snapshot. */
  once?: boolean;
}

export interface ExplorationQuestDefinition {
  id: string;
  title: string;
  description: string;
  completionText: string;
  nextQuestId?: string;
  target?: ExplorationQuestTarget;
}

export interface ExplorationPlayerSpriteVariants {
  male?: string;
  female?: string;
  fallback?: string;
}

export interface ExplorationRegionAssets {
  backgroundSrc?: string;
  playerSpriteSrc?: string;
  /** Optional chapter/region-specific actor state, e.g. chapter-0 pre-contract art. */
  playerSpriteVariants?: ExplorationPlayerSpriteVariants;
}

export interface ExplorationRegionDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  playerSpawn: Vec2;
  collisionZones: RectZone[];
  waypoints: ExplorationWaypoint[];
  npcs: ExplorationNpcDefinition[];
  interactionZones?: ExplorationInteractionZone[];
  quests?: ExplorationQuestDefinition[];
  initialQuestId?: string;
  assets?: ExplorationRegionAssets;
}
