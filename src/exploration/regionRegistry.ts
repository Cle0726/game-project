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
import { CH1_SEQUENCE04_AFTERMATH_REGION } from './chapter1AftermathData';
import { CH1_SELUOMI_STANDOFF_APPROACH_REGION } from './chapter1SeluomiApproachData';
import { CH1_MUJIAN_DEPARTURE_REGION } from './chapter1DepartureData';
import {
  CH2_CRYSTAL_CORRIDOR_GUARDIAN_APPROACH_REGION,
  CH2_OBSERVATORY_MAIN_DOOR_REGION,
  CH2_OBSERVATORY_SNOW_APPROACH_REGION,
} from './chapter2ObservatoryData';
import {
  CH2_CORE_DOOR_POST_BOSS_REGION,
  CH2_CORE_RECORDER_APPROACH_REGION,
  CH2_OBSERVATORY_DEPARTURE_REGION,
} from './chapter2CoreData';
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
  CH1_SEQUENCE04_AFTERMATH_REGION,
  CH1_SELUOMI_STANDOFF_APPROACH_REGION,
  CH1_MUJIAN_DEPARTURE_REGION,
  CH2_OBSERVATORY_SNOW_APPROACH_REGION,
  CH2_OBSERVATORY_MAIN_DOOR_REGION,
  CH2_CRYSTAL_CORRIDOR_GUARDIAN_APPROACH_REGION,
  CH2_CORE_DOOR_POST_BOSS_REGION,
  CH2_CORE_RECORDER_APPROACH_REGION,
  CH2_OBSERVATORY_DEPARTURE_REGION,
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

  // Sequence-04 battle resolution stays in the authored Battle definition. Once it
  // routes to ch1_black_006, inspect the two already-canonical traces in-world before
  // handing control back to the original analysis dialogue.
  { sceneId: 'ch1_black_006', region: CH1_SEQUENCE04_AFTERMATH_REGION },

  // After Yuna's authored night conversation, walk from the station inn back toward
  // Platform 7 and follow the abnormal low-frequency resonance. Seluomi herself is
  // revealed only when the exact original ch1_black_008 presentation starts.
  { sceneId: 'ch1_black_008', region: CH1_SELUOMI_STANDOFF_APPROACH_REGION },

  // The three chapter-1 outcomes and optional tea breaks still converge on the authored
  // ch1_black_013 epilogue. Only after the player chooses to leave do we make the walk
  // to the station exit physical; the original ch1_black_014 broadcast then plays.
  { sceneId: 'ch1_black_014', region: CH1_MUJIAN_DEPARTURE_REGION },

  // Chapter 2 keeps the route opening and snow-trek dialogue canonical. The final snow
  // approach becomes physical before ch2_snow_002. Its authored exterior choice effects
  // then apply before a second physical walk reaches the main door and ch2_snow_003.
  { sceneId: 'ch2_snow_002', region: CH2_OBSERVATORY_SNOW_APPROACH_REGION },
  { sceneId: 'ch2_snow_003', region: CH2_OBSERVATORY_MAIN_DOOR_REGION },

  // ch2_snow_005 remains the canonical exploration/minigame menu. Every preparation
  // route converges on ch2_snow_006, so only that deeper corridor traversal is physical.
  { sceneId: 'ch2_snow_006', region: CH2_CRYSTAL_CORRIDOR_GUARDIAN_APPROACH_REGION },

  // Scoreheart Guardian remains a canonical boss. Its result routes to ch2_snow_008;
  // physically approach the core door before the authored Ningsu reveal starts.
  { sceneId: 'ch2_snow_008', region: CH2_CORE_DOOR_POST_BOSS_REGION },

  // All three Ningsu-resolution scenes converge on ch2_snow_011 after their authored
  // effects. Walk through the now-open core chamber to the residual recorder first.
  { sceneId: 'ch2_snow_011', region: CH2_CORE_RECORDER_APPROACH_REGION },

  // ch2_snow_014 owns the farewell, companion choice, tea breaks and frost training.
  // Once a route leaves the tower, make the downhill leg physical before ch2_snow_015.
  { sceneId: 'ch2_snow_015', region: CH2_OBSERVATORY_DEPARTURE_REGION },

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
