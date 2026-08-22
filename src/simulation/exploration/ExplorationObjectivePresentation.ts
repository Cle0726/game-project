import { Container, Graphics, Text } from 'pixi.js';
import type {
  ExplorationInteractionZone,
  ExplorationQuestTarget,
  Vec2,
} from '../../exploration/explorationTypes';

export interface ObjectiveNpcPosition {
  id: string;
  position: Vec2;
}

export class ExplorationObjectivePresentation {
  readonly marker = new Container();
  readonly zoneHighlight = new Graphics();

  private targetKey = '';
  private pulse = 0;

  constructor(world: Container) {
    this.zoneHighlight.zIndex = 70;
    world.addChild(this.zoneHighlight);

    const markerCircle = new Graphics()
      .circle(0, 0, 18)
      .fill({ color: 0xd8bd70, alpha: 0.95 })
      .stroke({ width: 3, color: 0xffffff, alpha: 0.9 });
    const markerText = new Text({
      text: '!',
      style: {
        fill: 0x1b2432,
        fontSize: 22,
        fontWeight: '700',
        fontFamily: 'sans-serif',
      },
    });
    markerText.anchor.set(0.5, 0.5);
    markerText.position.set(0, -1);

    this.marker.addChild(markerCircle, markerText);
    this.marker.zIndex = 50000;
    this.marker.visible = false;
    world.addChild(this.marker);
  }

  refresh(): void {
    this.targetKey = '';
  }

  update(
    deltaSeconds: number,
    target: ExplorationQuestTarget | undefined,
    npcs: readonly ObjectiveNpcPosition[],
    zones: readonly ExplorationInteractionZone[] | undefined,
  ): void {
    this.pulse += Math.max(0, deltaSeconds);
    if (!target) {
      this.marker.visible = false;
      this.zoneHighlight.visible = false;
      this.targetKey = '';
      return;
    }

    const targetKey = `${target.type}:${target.id}`;
    if (targetKey !== this.targetKey) {
      this.targetKey = targetKey;
      this.rebuildZoneHighlight(target, zones);
    }

    if (target.type === 'npc') {
      const npc = npcs.find((item) => item.id === target.id);
      if (!npc) {
        this.marker.visible = false;
        return;
      }
      this.marker.visible = true;
      this.marker.position.set(npc.position.x, npc.position.y - 195);
    } else {
      const zone = zones?.find((item) => item.id === target.id);
      if (!zone) {
        this.marker.visible = false;
        return;
      }
      this.marker.visible = true;
      this.marker.position.set(
        zone.area.x + zone.area.width / 2,
        Math.max(32, zone.area.y - 24),
      );
    }

    const markerPulse = 1 + Math.sin(this.pulse * 4.8) * 0.08;
    this.marker.scale.set(markerPulse);
    this.marker.alpha = 0.88 + Math.sin(this.pulse * 4.8) * 0.1;
    if (this.zoneHighlight.visible) {
      this.zoneHighlight.alpha = 0.45 + Math.sin(this.pulse * 3.8) * 0.18;
    }
  }

  private rebuildZoneHighlight(
    target: ExplorationQuestTarget,
    zones: readonly ExplorationInteractionZone[] | undefined,
  ): void {
    this.zoneHighlight.clear();
    this.zoneHighlight.visible = false;
    if (target.type !== 'zone') return;

    const zone = zones?.find((item) => item.id === target.id);
    if (!zone) return;

    const padding = 10;
    this.zoneHighlight
      .roundRect(
        zone.area.x - padding,
        zone.area.y - padding,
        zone.area.width + padding * 2,
        zone.area.height + padding * 2,
        18,
      )
      .fill({ color: 0xd8bd70, alpha: 0.06 })
      .stroke({ width: 4, color: 0xf2d58a, alpha: 0.9 });
    this.zoneHighlight.visible = true;
  }
}
