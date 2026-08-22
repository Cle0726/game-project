export interface RegionLike {
  id: string;
}

export interface SceneRegionEntry<TRegion extends RegionLike> {
  sceneId: string;
  region: TRegion;
}

export interface RegionRegistry<TRegion extends RegionLike> {
  getRegion(regionId: string): TRegion | undefined;
  getSceneEntry(sceneId: string): SceneRegionEntry<TRegion> | undefined;
  getDefaultRegion(): TRegion;
  listRegions(): readonly TRegion[];
}

export function createRegionRegistry<TRegion extends RegionLike>(
  regions: readonly TRegion[],
  sceneEntries: readonly SceneRegionEntry<TRegion>[],
  defaultRegionId: string,
): RegionRegistry<TRegion> {
  const regionById = new Map(regions.map((region) => [region.id, region]));
  const entryBySceneId = new Map(sceneEntries.map((entry) => [entry.sceneId, entry]));
  const defaultRegion = regionById.get(defaultRegionId);

  if (!defaultRegion) {
    throw new Error(`createRegionRegistry(): unknown default region ${defaultRegionId}`);
  }

  return {
    getRegion(regionId) {
      return regionById.get(regionId);
    },
    getSceneEntry(sceneId) {
      return entryBySceneId.get(sceneId);
    },
    getDefaultRegion() {
      return defaultRegion;
    },
    listRegions() {
      return regions;
    },
  };
}
