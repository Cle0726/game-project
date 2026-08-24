import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  getTeaBreakContextType,
  getWorldMapNodeAccess,
  goToMainStoryScene,
  openTeaBreakFromWorldMap,
  resolveMainStorySceneId
} from '../worldMapBridge';
import type { GameStateLike } from '../worldMapBridge';
import type { LocationNode, WorldRegion } from '../worldMapTypes';
import { getRevisitLines, RevisitPrompt } from './RevisitPrompt';
import './WorldMap.css';

export interface RegionMapViewProps {
  region: WorldRegion;
  gameState?: GameStateLike;
  nodes?: LocationNode[];
  layerTitle?: string;
  onBackToWorld?: () => void;
  onEnterScene?: (sceneId: string, node: LocationNode, region: WorldRegion) => void;
  onRevisitScene?: (sceneId: string, node: LocationNode, region: WorldRegion) => void;
  onOpenTeaBreak?: (
    returnSceneId: string,
    node: LocationNode,
    region: WorldRegion,
    contextType: string
  ) => void;
}

interface RegionLayer {
  title: string;
  nodes: LocationNode[];
}

function getNodeAriaLabel(node: LocationNode, isCompleted: boolean, isAccessible: boolean): string {
  const status = !isAccessible ? '尚未解锁' : isCompleted ? '已完成' : '可进入';
  return `${node.name}，${status}`;
}

export function RegionMapView({
  region,
  gameState = window.GameState,
  nodes,
  layerTitle,
  onBackToWorld,
  onEnterScene,
  onRevisitScene,
  onOpenTeaBreak
}: RegionMapViewProps) {
  const [layerStack, setLayerStack] = useState<RegionLayer[]>([]);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [revisitNode, setRevisitNode] = useState<LocationNode | null>(null);

  const activeLayer = layerStack.length > 0 ? layerStack[layerStack.length - 1] : undefined;
  const activeNodes = activeLayer?.nodes ?? nodes ?? region.locationNodes;
  const activeTitle = activeLayer?.title ?? layerTitle ?? region.name;

  const mapStyle = useMemo(
    () =>
      ({
        '--region-primary': region.colorTheme.primary,
        '--region-secondary': region.colorTheme.secondary,
        '--region-accent': region.colorTheme.accent,
        '--region-map-image': `url(${region.fullMapSrc})`
      }) as CSSProperties,
    [region]
  );

  function enterMainStoryNode(node: LocationNode): void {
    const sceneId = resolveMainStorySceneId(node.id);
    window.dispatchEvent(
      new CustomEvent('worldmap:enter-scene', {
        detail: {
          mode: 'main_story',
          sceneId,
          sourceNodeId: node.id,
          node,
          region
        }
      })
    );

    if (onEnterScene) {
      onEnterScene(sceneId, node, region);
      return;
    }

    goToMainStoryScene(sceneId);
  }

  function enterNode(node: LocationNode): void {
    const access = getWorldMapNodeAccess(node, region, gameState);
    if (!access.isAccessible) return;

    const effectiveNode = access.isCompleted === node.isCompleted
      ? node
      : { ...node, isCompleted: access.isCompleted };

    if (effectiveNode.nodeType === 'sublevel_entry' && effectiveNode.sublevels?.length) {
      setLayerStack((current) => [
        ...current,
        { title: effectiveNode.name, nodes: effectiveNode.sublevels ?? [] }
      ]);
      return;
    }

    if (effectiveNode.nodeType === 'tuning_platform') {
      enterTeaBreakNode(effectiveNode);
      return;
    }

    if (effectiveNode.nodeType === 'story' && effectiveNode.isCompleted && effectiveNode.isRevisitable) {
      setRevisitNode(effectiveNode);
      return;
    }

    enterMainStoryNode(effectiveNode);
  }

  function enterTeaBreakNode(node: LocationNode): void {
    const returnSceneId = resolveMainStorySceneId(node.id);
    const contextType = getTeaBreakContextType(node, region);

    window.dispatchEvent(
      new CustomEvent('worldmap:open-tea-break-node', {
        detail: {
          returnSceneId,
          contextType,
          sourceNodeId: node.id,
          node,
          region
        }
      })
    );

    if (onOpenTeaBreak) {
      onOpenTeaBreak(returnSceneId, node, region, contextType);
      return;
    }

    openTeaBreakFromWorldMap({
      returnSceneId,
      contextType,
      sourceNodeId: node.id,
      regionId: region.id
    });
  }

  function confirmRevisit(node: LocationNode): void {
    const sceneId = resolveMainStorySceneId(node.id);
    const lines = getRevisitLines(node, region);

    window.dispatchEvent(
      new CustomEvent('worldmap:revisit-scene', {
        detail: {
          mode: 'revisit',
          sceneId,
          sourceNodeId: node.id,
          node,
          region,
          lines
        }
      })
    );

    onRevisitScene?.(sceneId, node, region);
    setRevisitNode(null);
  }

  function leaveLayer(): void {
    if (layerStack.length > 0) {
      setLayerStack((current) => current.slice(0, -1));
      return;
    }

    onBackToWorld?.();
  }

  return (
    <section className="region-map" style={mapStyle} aria-label={`${region.name}详细地图`}>
      <div className="region-map__backdrop" />

      <header className="region-map__header">
        <button className="worldmap-button worldmap-button--ghost" type="button" onClick={leaveLayer}>
          <span className="worldmap-button__icon" aria-hidden="true">‹</span>
          {layerStack.length > 0 ? '返回上一层' : '返回世界地图'}
        </button>

        <div className="region-map__title-block">
          <p className="region-map__eyebrow">{region.musicEmotion}</p>
          <h1>{activeTitle}</h1>
          {activeTitle !== region.name ? <span>{region.name}</span> : <span>{region.subtitle}</span>}
        </div>
      </header>

      <div className="region-map__stage">
        {activeNodes.map((node) => {
          const access = getWorldMapNodeAccess(node, region, gameState);
          return (
            <button
              key={node.id}
              type="button"
              disabled={!access.isAccessible}
              className={[
                'location-node',
                `location-node--${node.nodeType}`,
                access.isCompleted ? 'is-completed' : 'is-unfinished',
                !access.isAccessible ? 'is-locked' : '',
                node.sublevels?.length ? 'has-sublevels' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                {
                  '--node-x': `${node.positionPercent.x}%`,
                  '--node-y': `${node.positionPercent.y}%`
                } as CSSProperties
              }
              aria-label={getNodeAriaLabel(node, access.isCompleted, access.isAccessible)}
              onClick={() => enterNode(node)}
            >
              <span className="location-node__marker">
                <span className="location-node__core" />
                {node.sublevels?.length ? <span className="location-node__expand">›</span> : null}
              </span>
              <span className="location-node__banner">{node.name}</span>
            </button>
          );
        })}
      </div>

      <aside className={`region-minimap ${isOverviewOpen ? 'is-open' : ''}`}>
        <button
          className="region-minimap__toggle"
          type="button"
          aria-expanded={isOverviewOpen}
          onClick={() => setIsOverviewOpen((open) => !open)}
        >
          <span className="region-minimap__scroll" aria-hidden="true" />
          <span>区域缩略图</span>
        </button>
        {isOverviewOpen ? (
          <div className="region-minimap__panel">
            <div className="region-minimap__image">
              {activeNodes.map((node) => (
                <span
                  key={node.id}
                  className="region-minimap__dot"
                  style={
                    {
                      '--node-x': `${node.positionPercent.x}%`,
                      '--node-y': `${node.positionPercent.y}%`
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <p>{activeTitle}</p>
          </div>
        ) : null}
      </aside>

      {revisitNode ? (
        <RevisitPrompt
          node={revisitNode}
          region={region}
          onConfirm={() => confirmRevisit(revisitNode)}
          onCancel={() => setRevisitNode(null)}
        />
      ) : null}
    </section>
  );
}
