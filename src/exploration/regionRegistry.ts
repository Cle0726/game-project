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
  CH0_MIANSHA_TOWN_HUB_CLOCKTOWER_REGION,
  CH0_MIANSHA_TOWN_HUB_RECORD_SHOP_REGION,
  CH0_MIANSHA_TOWN_HUB_SCHOOL_REGION,
  CH0_MIANSHA_TOWN_HUB_THEATER_REGION,
} from './chapter0TownHubData';
import {
  createRegionRegistry,
  type SceneRegionEntry,
} from '../simulation/exploration/RegionSystem';

export type ExplorationSceneEntry = SceneRegionEntry<ExplorationRegionDefinition>;

const REGIONS = [
  CH0_MIANSHA_ALLEY_REGION,
  CH0_MIANSHA_PIANO_SQUARE_REGION,
  CH0_MIANSHA_TOWN_HUB_SCHOOL_REGION,
  CH0_MIANSHA_TOWN_HUB_RECORD_SHOP_REGION,
  CH0_MIANSHA_TOWN_HUB_THEATER_REGION,
  CH0_MIANSHA_TOWN_HUB_CLOCKTOWER_REGION,
  PROTOTYPE_REGION,
  WHITE_ACADEMY_ARCHIVE_MILO_REGION,
  WHITE_ACADEMY_ARCHIVE_ANNING_REGION,
] as const;

const SCENE_ENTRIES: ExplorationSceneEntry[] = [
  // Keep chapter0_start and all authored choices intact. Exploration replaces only
  // physical travel and investigation between canonical story nodes.
  { sceneId: 'ch0_001_road_entrance', region: CH0_MIANSHA_ALLEY_REGION },
  { sceneId: 'ch0_002_silent_town', region: CH0_MIANSHA_PIANO_SQUARE_REGION },

  // ch0_008_map_open itself remains canonical. Once a destination has been selected,
  // the matching next scene first becomes a real walk across the shared town-centre
  // hub; reaching the destination then opens the exact original scene.
  { sceneId: 'ch0_009_silent_school', region: CH0_MIANSHA_TOWN_HUB_SCHOOL_REGION },
  { sceneId: 'ch0_010_record_shop', region: CH0_MIANSHA_TOWN_HUB_RECORD_SHOP_REGION },
  { sceneId: 'ch0_011_backstage_dress', region: CH0_MIANSHA_TOWN_HUB_THEATER_REGION },
  { sceneId: 'ch0_012_clocktower', region: CH0_MIANSHA_TOWN_HUB_CLOCKTOWER_REGION },

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
