import type { ExplorationRegionDefinition } from './explorationTypes';
import { PROTOTYPE_REGION } from './regionData';
import {
  WHITE_ACADEMY_ARCHIVE_ANNING_REGION,
  WHITE_ACADEMY_ARCHIVE_MILO_REGION,
} from './archiveRegionData';

export interface ExplorationSceneEntry {
  sceneId: string;
  region: ExplorationRegionDefinition;
}

const REGIONS = [
  PROTOTYPE_REGION,
  WHITE_ACADEMY_ARCHIVE_MILO_REGION,
  WHITE_ACADEMY_ARCHIVE_ANNING_REGION,
];

const REGION_BY_ID = new Map(REGIONS.map((region) => [region.id, region]));

const ENTRY_BY_SCENE_ID = new Map<string, ExplorationSceneEntry>([
  ['chapter3_white_start', { sceneId: 'chapter3_white_start', region: PROTOTYPE_REGION }],
  ['ch3_white_003', { sceneId: 'ch3_white_003', region: WHITE_ACADEMY_ARCHIVE_MILO_REGION }],
  ['ch3_white_004', { sceneId: 'ch3_white_004', region: WHITE_ACADEMY_ARCHIVE_ANNING_REGION }],
]);

export function getExplorationRegion(regionId: string): ExplorationRegionDefinition | undefined {
  return REGION_BY_ID.get(regionId);
}

export function getExplorationEntry(sceneId: string): ExplorationSceneEntry | undefined {
  return ENTRY_BY_SCENE_ID.get(sceneId);
}

export function getDefaultExplorationRegion(): ExplorationRegionDefinition {
  return PROTOTYPE_REGION;
}
