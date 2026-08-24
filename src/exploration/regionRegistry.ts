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
import { CH3_WHITE_ACADEMY_PLAZA_REGION } from './chapter3PlazaData';
import { CH3_ARCHIVE_CORRIDOR_APPROACH_REGION } from './chapter3ArchiveApproachData';
import { CH3_HEARING_CHAMBER_APPROACH_REGION } from './chapter3HearingApproachData';
import {
  CH4_AKA_FOLLOWUP_REGION,
  CH4_ALTAR_CARRIAGE_APPROACH_REGION,
  CH4_ARMORED_CONNECTOR_APPROACH_REGION,
  CH4_AUDIENCE_CAR_ENTRY_REGION,
  CH4_AUDIENCE_INVESTIGATION_REGION,
  CH4_QILAN_APPROACH_REGION,
} from './chapter4TrainData';
import {
  CH4_CORE_ORGAN_ENTRY_REGION,
  CH4_FINAL_BOSS_DAIS_APPROACH_REGION,
  CH4_POST_SELUOMI_CORE_APPROACH_REGION,
} from './chapter4CoreData';
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
  CH3_WHITE_ACADEMY_PLAZA_REGION,
  CH3_ARCHIVE_CORRIDOR_APPROACH_REGION,
  CH3_HEARING_CHAMBER_APPROACH_REGION,
  CH4_AUDIENCE_CAR_ENTRY_REGION,
  CH4_AUDIENCE_INVESTIGATION_REGION,
  CH4_AKA_FOLLOWUP_REGION,
  CH4_QILAN_APPROACH_REGION,
  CH4_ARMORED_CONNECTOR_APPROACH_REGION,
  CH4_ALTAR_CARRIAGE_APPROACH_REGION,
  CH4_POST_SELUOMI_CORE_APPROACH_REGION,
  CH4_CORE_ORGAN_ENTRY_REGION,
  CH4_FINAL_BOSS_DAIS_APPROACH_REGION,
  PROTOTYPE_REGION,
  WHITE_ACADEMY_ARCHIVE_MILO_REGION,
  WHITE_ACADEMY_ARCHIVE_ANNING_REGION,
] as const;

const SCENE_ENTRIES: ExplorationSceneEntry[] = [
  { sceneId: 'ch0_001_road_entrance', region: CH0_MIANSHA_ALLEY_REGION },
  { sceneId: 'ch0_002_silent_town', region: CH0_MIANSHA_PIANO_SQUARE_REGION },
  { sceneId: 'ch0_009_silent_school', region: CH0_MIANSHA_TOWN_HUB_SCHOOL_REGION },
  { sceneId: 'ch0_010_record_shop', region: CH0_MIANSHA_TOWN_HUB_RECORD_SHOP_REGION },
  { sceneId: 'ch0_011_backstage_dress', region: CH0_MIANSHA_TOWN_HUB_THEATER_REGION },
  { sceneId: 'ch0_012_clocktower', region: CH0_MIANSHA_TOWN_HUB_CLOCKTOWER_REGION },
  { sceneId: 'ch0_013_forbidden_performance', region: CH0_FORBIDDEN_PERFORMANCE_APPROACH_REGION },
  { sceneId: 'ch0_018_teabreak_not_tiya', region: CH0_POST_BATTLE_DINER_RETREAT_REGION },
  { sceneId: 'ch0_019_charron_revealed', region: CH0_RETURN_TO_CHARON_THEATER_REGION },

  { sceneId: 'ch1_black_001', region: CH1_MUJIAN_STATION_ARRIVAL_REGION },
  { sceneId: 'ch1_black_002', region: CH1_MUJIAN_FIND_ZHONG_REGION },
  { sceneId: 'ch1_black_003', region: CH1_MUJIAN_STATION_INN_REGION },
  { sceneId: 'ch1_black_005', region: CH1_MUJIAN_PLATFORM7_REGION },
  { sceneId: 'ch1_black_006', region: CH1_SEQUENCE04_AFTERMATH_REGION },
  { sceneId: 'ch1_black_008', region: CH1_SELUOMI_STANDOFF_APPROACH_REGION },
  { sceneId: 'ch1_black_014', region: CH1_MUJIAN_DEPARTURE_REGION },

  { sceneId: 'ch2_snow_002', region: CH2_OBSERVATORY_SNOW_APPROACH_REGION },
  { sceneId: 'ch2_snow_003', region: CH2_OBSERVATORY_MAIN_DOOR_REGION },
  { sceneId: 'ch2_snow_006', region: CH2_CRYSTAL_CORRIDOR_GUARDIAN_APPROACH_REGION },
  { sceneId: 'ch2_snow_008', region: CH2_CORE_DOOR_POST_BOSS_REGION },
  { sceneId: 'ch2_snow_011', region: CH2_CORE_RECORDER_APPROACH_REGION },
  { sceneId: 'ch2_snow_015', region: CH2_OBSERVATORY_DEPARTURE_REGION },

  { sceneId: 'ch3_white_000', region: CH3_WHITE_ACADEMY_PLAZA_REGION },
  { sceneId: 'ch3_white_003', region: WHITE_ACADEMY_ARCHIVE_MILO_REGION },
  { sceneId: 'ch3_white_004', region: WHITE_ACADEMY_ARCHIVE_ANNING_REGION },
  { sceneId: 'ch3_white_006', region: CH3_ARCHIVE_CORRIDOR_APPROACH_REGION },
  { sceneId: 'ch3_white_008', region: CH3_HEARING_CHAMBER_APPROACH_REGION },

  // Keep route setup, value initialization, and the moving-train infiltration authored.
  { sceneId: 'ch4_002', region: CH4_AUDIENCE_CAR_ENTRY_REGION },

  // ch4_002 resolves the first audience choice. Before ch4_003, expose the authored
  // E401/audience-identification content as physical optional investigations.
  { sceneId: 'ch4_003', region: CH4_AUDIENCE_INVESTIGATION_REGION },

  // ch4_004 resolves the soloist choice. Before the Sequence-04 wake-up scene, let the
  // player physically revisit Aka when that authored branch was chosen.
  { sceneId: 'ch4_005', region: CH4_AKA_FOLLOWUP_REGION },

  // Audience-car rescue choices apply before the rear-car traversal to Qilan.
  { sceneId: 'ch4_006', region: CH4_QILAN_APPROACH_REGION },

  // Qilan persuasion/battle and the optional Sequence-07 route converge here.
  { sceneId: 'ch4_008', region: CH4_ARMORED_CONNECTOR_APPROACH_REGION },

  // Elena's truth/affinity effects apply before the party advances to Seluomi.
  { sceneId: 'ch4_009', region: CH4_ALTAR_CARRIAGE_APPROACH_REGION },

  // Seluomi's final battle remains canonical. Its battle result enters 011, so the
  // post-battle distance from altar carriage to core-car exterior is physical first.
  { sceneId: 'ch4_011', region: CH4_POST_SELUOMI_CORE_APPROACH_REGION },

  // ch4_011 explains the organ binding and owns the explicit decision to enter.
  // After that choice, physically cross the core chamber before Charon's truth scene.
  { sceneId: 'ch4_012', region: CH4_CORE_ORGAN_ENTRY_REGION },

  // Charon's truth and the full-party prelude remain authored. Only the final approach
  // from ch4_013 to the organ dais becomes physical before the cinematic boss reveal.
  { sceneId: 'ch4_014', region: CH4_FINAL_BOSS_DAIS_APPROACH_REGION },
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
