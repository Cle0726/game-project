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

export interface ExplorationNpcScheduleEntry {
  minuteOfDay: number;
  position: Vec2;
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
}

export interface ExplorationRegionDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  playerSpawn: Vec2;
  collisionZones: RectZone[];
  npcs: ExplorationNpcDefinition[];
}
