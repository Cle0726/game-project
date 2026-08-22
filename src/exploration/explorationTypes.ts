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
}

export interface ExplorationInteractionZone {
  id: string;
  name: string;
  area: Omit<RectZone, 'id'>;
  interactionText: string;
  storySceneId?: string;
  statusText?: string;
  questCompleteId?: string;
}

export interface ExplorationQuestDefinition {
  id: string;
  title: string;
  description: string;
  completionText: string;
  nextQuestId?: string;
}

export interface ExplorationRegionAssets {
  backgroundSrc?: string;
  playerSpriteSrc?: string;
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
