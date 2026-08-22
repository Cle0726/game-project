import type { NavigationWaypoint, SpatialPoint } from './SpatialTypes';

export function findNearestWaypoint(
  waypoints: readonly NavigationWaypoint[],
  position: SpatialPoint,
): NavigationWaypoint | undefined {
  let nearest: NavigationWaypoint | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const waypoint of waypoints) {
    const distance = Math.hypot(
      waypoint.position.x - position.x,
      waypoint.position.y - position.y,
    );
    if (distance < nearestDistance) {
      nearest = waypoint;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function findNavigationPath(
  waypoints: readonly NavigationWaypoint[],
  startPosition: SpatialPoint,
  targetWaypointId: string,
): SpatialPoint[] {
  const target = waypoints.find((waypoint) => waypoint.id === targetWaypointId);
  const start = findNearestWaypoint(waypoints, startPosition);
  if (!target || !start) return [];
  if (start.id === target.id) return [{ ...target.position }];

  const waypointMap = new Map(waypoints.map((waypoint) => [waypoint.id, waypoint]));
  const queue: string[] = [start.id];
  const visited = new Set<string>([start.id]);
  const previous = new Map<string, string>();

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) break;
    if (currentId === target.id) break;

    const current = waypointMap.get(currentId);
    if (!current) continue;

    for (const linkedId of current.links) {
      if (visited.has(linkedId) || !waypointMap.has(linkedId)) continue;
      visited.add(linkedId);
      previous.set(linkedId, currentId);
      queue.push(linkedId);
    }
  }

  if (!visited.has(target.id)) return [];

  const pathIds: string[] = [];
  let cursor = target.id;
  while (cursor !== start.id) {
    pathIds.push(cursor);
    const previousId = previous.get(cursor);
    if (!previousId) return [];
    cursor = previousId;
  }

  pathIds.reverse();
  return pathIds
    .map((id) => waypointMap.get(id))
    .filter((waypoint): waypoint is NavigationWaypoint => Boolean(waypoint))
    .map((waypoint) => ({ ...waypoint.position }));
}

export function hasNavigationPath(
  waypoints: readonly NavigationWaypoint[],
  startPosition: SpatialPoint,
  targetWaypointId: string,
): boolean {
  return findNavigationPath(waypoints, startPosition, targetWaypointId).length > 0;
}
