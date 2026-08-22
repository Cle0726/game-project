export interface SpatialPoint {
  x: number;
  y: number;
}

export interface CollisionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RegionBounds {
  width: number;
  height: number;
}

export interface NavigationWaypoint {
  id: string;
  position: SpatialPoint;
  links: string[];
}
