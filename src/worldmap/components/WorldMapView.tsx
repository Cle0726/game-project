import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { GameStateLike } from '../worldMapBridge';
import { isUnlockConditionMet } from '../worldMapBridge';
import worldMapOverviewSrc from '../../../assets/worldmap/map_world_overview_atlas_cover_v01.png';
import { WORLD_MAP_REGIONS } from '../worldMapData';
import type { LocationNode, WorldRegion } from '../worldMapTypes';
import { RegionRevealTransition } from './RegionRevealTransition';
import { RegionMapView } from './RegionMapView';
import { TruthFragmentCounter } from './TruthFragmentCounter';
import './WorldMap.css';

declare global {
  interface Window {
    GameState?: GameStateLike;
  }
}

export interface WorldMapViewProps {
  regions?: WorldRegion[];
  gameState?: GameStateLike;
  knownRegionIds?: string[];
  onEnterScene?: (sceneId: string, node: LocationNode, region: WorldRegion) => void;
  onRevisitScene?: (sceneId: string, node: LocationNode, region: WorldRegion) => void;
  onOpenTeaBreak?: (
    returnSceneId: string,
    node: LocationNode,
    region: WorldRegion,
    contextType: string
  ) => void;
}

function isRegionKnown(region: WorldRegion, knownRegionIds?: string[]): boolean {
  if (!region.isHidden) return true;
  return knownRegionIds?.includes(region.id) ?? false;
}

export function WorldMapView({
  regions = WORLD_MAP_REGIONS,
  gameState = window.GameState,
  knownRegionIds,
  onEnterScene,
  onRevisitScene,
  onOpenTeaBreak
}: WorldMapViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<WorldRegion | null>(null);
  const [lockedRegionId, setLockedRegionId] = useState<string | null>(null);
  const [revealingRegionIds, setRevealingRegionIds] = useState<string[]>([]);
  const [hintText, setHintText] = useState('');
  const unlockSnapshotRef = useRef<Record<string, boolean> | null>(null);

  const visibleRegions = useMemo(
    () => regions.filter((region) => isRegionKnown(region, knownRegionIds)),
    [regions, knownRegionIds]
  );

  const worldMapStyle = useMemo(
    () =>
      ({
        '--world-map-overview-image': `url(${worldMapOverviewSrc})`
      }) as CSSProperties,
    []
  );

  useEffect(() => {
    const nextSnapshot = Object.fromEntries(
      visibleRegions.map((region) => [region.id, isUnlockConditionMet(region.unlockCondition, gameState)])
    );

    if (!unlockSnapshotRef.current) {
      unlockSnapshotRef.current = nextSnapshot;
      return;
    }

    const newlyUnlockedRegionIds = visibleRegions
      .filter((region) => !unlockSnapshotRef.current?.[region.id] && nextSnapshot[region.id])
      .map((region) => region.id);

    unlockSnapshotRef.current = nextSnapshot;

    if (newlyUnlockedRegionIds.length === 0) return;

    setRevealingRegionIds((current) =>
      Array.from(new Set([...current, ...newlyUnlockedRegionIds]))
    );
  }, [gameState, visibleRegions]);

  function completeReveal(regionId: string): void {
    setRevealingRegionIds((current) => current.filter((id) => id !== regionId));
  }

  function selectRegion(region: WorldRegion): void {
    const isUnlocked = isUnlockConditionMet(region.unlockCondition, gameState);

    if (!isUnlocked) {
      setLockedRegionId(region.id);
      setHintText('这段旋律还未响起');
      window.setTimeout(() => setLockedRegionId(null), 420);
      window.setTimeout(() => setHintText(''), 1800);
      return;
    }

    setSelectedRegion(region);
  }

  if (selectedRegion) {
    return (
      <RegionMapView
        region={selectedRegion}
        onBackToWorld={() => setSelectedRegion(null)}
        onEnterScene={onEnterScene}
        onRevisitScene={onRevisitScene}
        onOpenTeaBreak={onOpenTeaBreak}
      />
    );
  }

  return (
    <section className="world-map" style={worldMapStyle} aria-label="世界地图">
      <div className="world-map__aura" />

      <header className="world-map__header">
        <p className="world-map__eyebrow">World Score</p>
        <h1>残响之途</h1>
        <span>七段旋律散落在白金手稿的暗纹之间</span>
      </header>

      <div className="world-map__region-grid" role="list">
        {visibleRegions.map((region, index) => {
          const isUnlocked = isUnlockConditionMet(region.unlockCondition, gameState);
          const isRevealing = revealingRegionIds.includes(region.id);
          const stateClassName = isUnlocked ? 'is-unlocked' : 'is-known-locked';

          return (
            <button
              key={region.id}
              type="button"
              role="listitem"
              className={[
                'region-card',
                stateClassName,
                isRevealing ? 'is-revealing' : '',
                lockedRegionId === region.id ? 'is-shaking' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                {
                  '--region-primary': region.colorTheme.primary,
                  '--region-secondary': region.colorTheme.secondary,
                  '--region-accent': region.colorTheme.accent,
                  '--region-card-tilt': `${index % 2 === 0 ? -1.5 : 1.5}deg`
                } as CSSProperties
              }
              onClick={() => selectRegion(region)}
            >
              <span className="region-card__scroll-cap region-card__scroll-cap--top" />
              <span className="region-card__image-wrap">
                <img src={region.thumbnailSrc} alt={`${region.name}区域地图缩略图`} />
                {!isUnlocked ? <span className="region-card__lock" aria-hidden="true" /> : null}
                <RegionRevealTransition
                  region={region}
                  isActive={isRevealing}
                  onComplete={completeReveal}
                />
              </span>
              <span className="region-card__content">
                <span className="region-card__name">{region.name}</span>
                <span className="region-card__subtitle">
                  {isUnlocked ? region.subtitle ?? region.musicEmotion : `${region.subtitle ?? region.musicEmotion} · 待章节推进`}
                </span>
              </span>
              <span className="region-card__scroll-cap region-card__scroll-cap--bottom" />
            </button>
          );
        })}
      </div>

      <TruthFragmentCounter regions={regions} gameState={gameState} />

      {hintText ? <div className="world-map__hint" role="status">{hintText}</div> : null}
    </section>
  );
}
