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

export interface ExplorationNpcDefinition {
  id: string;
  name: string;
  position: Vec2;
  storySceneId?: string;
  interactionText: string;
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
