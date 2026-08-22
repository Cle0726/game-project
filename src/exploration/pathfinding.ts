import type { ExplorationWaypoint, Vec2 } from './explorationTypes';
import { findNavigationPath } from '../simulation/exploration/NavigationSystem';

/**
 * Legacy compatibility wrapper.
 * New navigation rules live under src/simulation/exploration/NavigationSystem.ts.
 */
export function findWaypointPath(
  waypoints: ExplorationWaypoint[],
  startPosition: Vec2,
  targetWaypointId: string,
): Vec2[] {
  return findNavigationPath(waypoints, startPosition, targetWaypointId);
}
