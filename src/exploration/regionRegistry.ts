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
import { CH0_FORBIDDEN_PERFORMANCE_APPROACH_REGION } from './chapter0TheaterApproachData';
import {
  CH0_POST_BATTLE_DINER_RETREAT_REGION,
  CH0_RETURN_TO_CHARON_THEATER_REGION,
} from './chapter0PostContractTravelData';
import {
  CH1_MUJIAN_FIND_ZHONG_REGION,
  CH1_MUJIAN_PLATFORM7_REGION,
  CH1_MUJIAN_STATION_ARRIVAL_REGION,
  CH1_MUJIAN_STATION_INN_REGION,
} from './chapter1StationData';
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
  CH0_FORBIDDEN_PERFORMANCE_APPROACH_REGION,
  CH0_POST_BATTLE_DINER_RETREAT_REGION,
  CH0_RETURN_TO_CHARON_THEATER_REGION,
  CH1_MUJIAN_STATION_ARRIVAL_REGION,
  CH1_MUJIAN_FIND_ZHONG_REGION,
  CH1_MUJIAN_STATION_INN_REGION,
  CH1_MUJIAN_PLATFORM7_REGION,
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

  // After the clocktower investigation, physically return to the old theater and walk
  // onto the stage before the canonical forbidden-performance scene begins.
  { sceneId: 'ch0_013_forbidden_performance', region: CH0_FORBIDDEN_PERFORMANCE_APPROACH_REGION },

  // Combat itself remains canonical. After the stage-crawler win, make the retreat to
  // the diner physical; after the tea-break choice, follow the knocking sound back to
  // the theater before Charron is canonically revealed.
  { sceneId: 'ch0_018_teabreak_not_tiya', region: CH0_POST_BATTLE_DINER_RETREAT_REGION },
  { sceneId: 'ch0_019_charron_revealed', region: CH0_RETURN_TO_CHARON_THEATER_REGION },

  // Chapter 1 keeps chapter1_start, ch1_black_000, and ch1_black_004 canonical. The
  // travel implied by those authored choices becomes physical on the next scene.
  { sceneId: 'ch1_black_001', region: CH1_MUJIAN_STATION_ARRIVAL_REGION },
  { sceneId: 'ch1_black_002', region: CH1_MUJIAN_FIND_ZHONG_REGION },
  { sceneId: 'ch1_black_003', region: CH1_MUJIAN_STATION_INN_REGION },
  { sceneId: 'ch1_black_005', region: CH1_MUJIAN_PLATFORM7_REGION },

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
