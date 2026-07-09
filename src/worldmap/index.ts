export { WORLD_MAP_REGION_BY_ID, WORLD_MAP_REGIONS } from './worldMapData';
export {
  WORLD_MAP_PHASES,
  getRelationshipValue,
  getTeaBreakContextType,
  goToMainStoryScene,
  inferChapterProgress,
  isUnlockConditionMet,
  openTeaBreakFromWorldMap,
  resolveMainStorySceneId
} from './worldMapBridge';
export { RegionMapView } from './components/RegionMapView';
export { RegionRevealTransition } from './components/RegionRevealTransition';
export { RevisitPrompt, getRevisitLines } from './components/RevisitPrompt';
export { TruthFragmentCounter } from './components/TruthFragmentCounter';
export { WorldMapView } from './components/WorldMapView';
export type { GamePhase, GameStateLike, TeaBreakContextType, WorldMapPhase } from './worldMapBridge';
export type { RevisitLine } from './components/RevisitPrompt';
export type {
  LocationNode,
  LocationNodeType,
  UnlockCondition,
  WorldRegion,
  WorldRegionColorTheme
} from './worldMapTypes';
