import { Assets, Container, Graphics, Sprite } from 'pixi.js';
import type { ExplorationRegionDefinition } from '../../exploration/explorationTypes';

export class ExplorationWorldPresentation {
  constructor(
    private readonly world: Container,
    private readonly region: ExplorationRegionDefinition,
  ) {}

  async buildEnvironment(debugNavigation = false): Promise<void> {
    this.world.sortableChildren = true;
    const backgroundLoaded = await this.addBackground();
    if (!backgroundLoaded) this.addFallbackFloor();
    if (debugNavigation) this.addDebugNavigationOverlay();
  }

  private async addBackground(): Promise<boolean> {
    const src = this.region.assets?.backgroundSrc;
    if (!src) return false;

    try {
      const texture = await Assets.load(src);
      const background = new Sprite(texture);
      background.position.set(0, 0);
      background.width = this.region.width;
      background.height = this.region.height;
      background.zIndex = 0;
      this.world.addChild(background);
      return true;
    } catch (error) {
      console.warn('[exploration] background failed to load; using debug floor', src, error);
      return false;
    }
  }

  private addFallbackFloor(): void {
    const floor = new Graphics()
      .rect(0, 0, this.region.width, this.region.height)
      .fill(0x1a2638);
    floor.zIndex = 0;
    this.world.addChild(floor);

    const grid = new Graphics();
    for (let x = 0; x <= this.region.width; x += 100) {
      grid.moveTo(x, 0).lineTo(x, this.region.height);
    }
    for (let y = 0; y <= this.region.height; y += 100) {
      grid.moveTo(0, y).lineTo(this.region.width, y);
    }
    grid.stroke({ width: 1, color: 0x2a3b52, alpha: 0.45 });
    grid.zIndex = 1;
    this.world.addChild(grid);
  }

  private addDebugNavigationOverlay(): void {
    const overlay = new Graphics();
    const waypointMap = new Map(
      this.region.waypoints.map((waypoint) => [waypoint.id, waypoint]),
    );
    const drawnEdges = new Set<string>();

    for (const zone of this.region.collisionZones) {
      overlay
        .rect(zone.x, zone.y, zone.width, zone.height)
        .fill({ color: 0xe11d48, alpha: 0.14 })
        .stroke({ width: 2, color: 0xfb7185, alpha: 0.55 });
    }

    for (const waypoint of this.region.waypoints) {
      for (const linkedId of waypoint.links) {
        const linked = waypointMap.get(linkedId);
        if (!linked) continue;
        const edgeKey = [waypoint.id, linked.id].sort().join('::');
        if (drawnEdges.has(edgeKey)) continue;
        drawnEdges.add(edgeKey);
        overlay
          .moveTo(waypoint.position.x, waypoint.position.y)
          .lineTo(linked.position.x, linked.position.y);
      }
    }
    overlay.stroke({ width: 3, color: 0x8ac7ff, alpha: 0.48 });

    for (const waypoint of this.region.waypoints) {
      overlay
        .circle(waypoint.position.x, waypoint.position.y, 7)
        .fill({ color: 0xcde9ff, alpha: 0.7 });
    }

    overlay.zIndex = 50;
    this.world.addChild(overlay);
  }
}
