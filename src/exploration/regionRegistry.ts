import type { ExplorationRegionDefinition } from './explorationTypes';
import { PROTOTYPE_REGION } from './regionData';
import {
  WHITE_ACADEMY_ARCHIVE_ANNING_REGION,
  WHITE_ACADEMY_ARCHIVE_MILO_REGION,
} from './archiveRegionData';
import {
  CH0_MIANSHA_ALLEY_REGION,
  CH0_MIANSHA_PIANO_SQUARE_REGION,
} from './chapter0RegionData';
import {
  createRegionRegistry,
  type SceneRegionEntry,
} from '../simulation/exploration/RegionSystem';

export type ExplorationSceneEntry = SceneRegionEntry<ExplorationRegionDefinition>;

const REGIONS = [
  CH0_MIANSHA_ALLEY_REGION,
  CH0_MIANSHA_PIANO_SQUARE_REGION,
  PROTOTYPE_REGION,
  WHITE_ACADEMY_ARCHIVE_MILO_REGION,
  WHITE_ACADEMY_ARCHIVE_ANNING_REGION,
] as const;

const SCENE_ENTRIES: ExplorationSceneEntry[] = [
  // Chapter 0 keeps its authored opening cinematic. We intercept only the moments
  // where the canonical scene asks the player to physically investigate or travel.
  { sceneId: 'ch0_001', region: CH0_MIANSHA_ALLEY_REGION },
  { sceneId: 'ch0_003', region: CH0_MIANSHA_ALLEY_REGION },
  { sceneId: 'ch0_004', region: CH0_MIANSHA_PIANO_SQUARE_REGION },

  // Existing chapter-3 regression slices remain registered against the same runtime.
  { sceneId: 'chapter3_white_start', region: PROTOTYPE_REGION },
  { sceneId: 'ch3_white_003', region: WHITE_ACADEMY_ARCHIVE_MILO_REGION },
  { sceneId: 'ch3_white_004', region: WHITE_ACADEMY_ARCHIVE_ANNING_REGION },
];

const registry = createRegionRegistry(REGIONS, SCENE_ENTRIES, PROTOTYPE_REGION.id);

export function getExplorationRegion(regionId: string): ExplorationRegionDefinition | undefined {
  return registry.getRegion(regionId);
}

export function getExplorationEntry(sceneId: string): ExplorationSceneEntry | undefined {
  return registry.getSceneEntry(sceneId);
}

export function getDefaultExplorationRegion(): ExplorationRegionDefinition {
  return registry.getDefaultRegion();
}
