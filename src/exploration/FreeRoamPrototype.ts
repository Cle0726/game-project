import { Application, Container, Graphics, Text } from 'pixi.js';
import { PROTOTYPE_REGION } from './regionData';
import type { ExplorationNpcDefinition, RectZone, Vec2 } from './explorationTypes';
import {
  advancePrototypeClock,
  formatMinuteOfDay,
  PROTOTYPE_DAY_START_MINUTE,
  resolveScheduleEntry,
} from './npcSchedule';
import { openStoryScene } from './storyBridge';

const PLAYER_RADIUS = 22;
const NPC_RADIUS = 24;
const MOVE_SPEED = 290;
const INTERACTION_DISTANCE = 110;

interface NpcRuntime {
  definition: ExplorationNpcDefinition;
  node: Container;
  position: Vec2;
  activityText: Text;
}

export class FreeRoamPrototype {
  private app = new Application();
  private world = new Container();
  private player = new Container();
  private playerPosition: Vec2 = { ...PROTOTYPE_REGION.playerSpawn };
  private keys = new Set<string>();
  private npcs: NpcRuntime[] = [];
  private clockMinute = PROTOTYPE_DAY_START_MINUTE;
  private prompt = new Text({ text: '', style: { fill: 0xffffff, fontSize: 18, fontFamily: 'sans-serif' } });
  private status = new Text({ text: '', style: { fill: 0xffffff, fontSize: 16, fontFamily: 'sans-serif' } });
  private clockText = new Text({ text: '', style: { fill: 0xcbd5e1, fontSize: 15, fontFamily: 'sans-serif' } });
  private nearbyNpc?: NpcRuntime;

  async mount(host: HTMLElement): Promise<void> {
    await this.app.init({
      resizeTo: host,
      background: '#111927',
      antialias: true,
    });

    host.appendChild(this.app.canvas);
    this.app.stage.addChild(this.world);
    this.buildWorld();
    this.buildHud();
    this.bindInput();
    this.app.ticker.add((ticker) => this.update(ticker.deltaMS / 1000));
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.app.destroy(true);
  }

  private buildWorld(): void {
    const floor = new Graphics()
      .rect(0, 0, PROTOTYPE_REGION.width, PROTOTYPE_REGION.height)
      .fill(0x1a2638);
    this.world.addChild(floor);

    const grid = new Graphics();
    for (let x = 0; x <= PROTOTYPE_REGION.width; x += 100) {
      grid.moveTo(x, 0).lineTo(x, PROTOTYPE_REGION.height);
    }
    for (let y = 0; y <= PROTOTYPE_REGION.height; y += 100) {
      grid.moveTo(0, y).lineTo(PROTOTYPE_REGION.width, y);
    }
    grid.stroke({ width: 1, color: 0x2a3b52, alpha: 0.55 });
    this.world.addChild(grid);

    for (const zone of PROTOTYPE_REGION.collisionZones) {
      const obstacle = new Graphics()
        .roundRect(zone.x, zone.y, zone.width, zone.height, 18)
        .fill(0x31435b)
        .stroke({ width: 3, color: 0x536e8e, alpha: 0.8 });
      this.world.addChild(obstacle);
    }

    this.player.addChild(new Graphics().circle(0, 0, PLAYER_RADIUS).fill(0xe5e7eb));
    this.player.addChild(new Graphics().circle(8, -5, 5).fill(0x111827));
    this.player.position.set(this.playerPosition.x, this.playerPosition.y);
    this.world.addChild(this.player);

    for (const definition of PROTOTYPE_REGION.npcs) {
      const node = new Container();
      const position = { ...definition.position };
      node.position.set(position.x, position.y);
      node.addChild(new Graphics().circle(0, 0, NPC_RADIUS).fill(0x9fb7d5));

      const label = new Text({
        text: definition.name,
        style: { fill: 0xffffff, fontSize: 18, fontFamily: 'sans-serif' },
      });
      label.anchor.set(0.5, 1);
      label.position.set(0, -34);
      node.addChild(label);

      const activityText = new Text({
        text: '',
        style: { fill: 0xb9c9dc, fontSize: 13, fontFamily: 'sans-serif' },
      });
      activityText.anchor.set(0.5, 0);
      activityText.position.set(0, 32);
      node.addChild(activityText);

      this.world.addChild(node);
      this.npcs.push({ definition, node, position, activityText });
    }
  }

  private buildHud(): void {
    const title = new Text({
      text: PROTOTYPE_REGION.name,
      style: { fill: 0xffffff, fontSize: 22, fontWeight: '600', fontFamily: 'sans-serif' },
    });
    title.position.set(24, 20);
    this.app.stage.addChild(title);

    const controls = new Text({
      text: 'WASD / 方向键移动 · E / 空格互动 · NPC 按日程自主移动',
      style: { fill: 0xcbd5e1, fontSize: 15, fontFamily: 'sans-serif' },
    });
    controls.position.set(24, 54);
    this.app.stage.addChild(controls);

    this.clockText.position.set(24, 84);
    this.app.stage.addChild(this.clockText);

    this.prompt.anchor.set(0.5, 1);
    this.app.stage.addChild(this.prompt);

    this.status.position.set(24, 112);
    this.app.stage.addChild(this.status);
  }

  private bindInput(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    this.keys.add(key);

    if ((key === 'e' || key === ' ') && !event.repeat) {
      event.preventDefault();
      this.interact();
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.key.toLowerCase());
  };

  private update(deltaSeconds: number): void {
    this.clockMinute = advancePrototypeClock(this.clockMinute, deltaSeconds);
    this.updateNpcs(deltaSeconds);

    let dx = 0;
    let dy = 0;

    if (this.keys.has('w') || this.keys.has('arrowup')) dy -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) dy += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) dx -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy);
      dx = (dx / length) * MOVE_SPEED * deltaSeconds;
      dy = (dy / length) * MOVE_SPEED * deltaSeconds;
      this.tryMovePlayer(dx, dy);
    }

    this.updateNearbyNpc();
    this.updateCamera();
    this.updatePrompt();
    this.clockText.text = `模拟时间 ${formatMinuteOfDay(this.clockMinute)} · 1 秒 = 20 游戏分钟`;
  }

  private updateNpcs(deltaSeconds: number): void {
    for (const npc of this.npcs) {
      const scheduleEntry = resolveScheduleEntry(npc.definition.schedule, this.clockMinute);
      if (!scheduleEntry) {
        npc.activityText.text = '自由行动';
        continue;
      }

      npc.activityText.text = scheduleEntry.activity;
      const dx = scheduleEntry.position.x - npc.position.x;
      const dy = scheduleEntry.position.y - npc.position.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 2) continue;

      const speed = npc.definition.speed ?? 100;
      const step = Math.min(speed * deltaSeconds, distance);
      this.tryMoveNpc(npc, (dx / distance) * step, (dy / distance) * step);
    }
  }

  private tryMovePlayer(dx: number, dy: number): void {
    const nextX = this.clamp(this.playerPosition.x + dx, PLAYER_RADIUS, PROTOTYPE_REGION.width - PLAYER_RADIUS);
    if (!this.collidesCircle(nextX, this.playerPosition.y, PLAYER_RADIUS)) {
      this.playerPosition.x = nextX;
    }

    const nextY = this.clamp(this.playerPosition.y + dy, PLAYER_RADIUS, PROTOTYPE_REGION.height - PLAYER_RADIUS);
    if (!this.collidesCircle(this.playerPosition.x, nextY, PLAYER_RADIUS)) {
      this.playerPosition.y = nextY;
    }

    this.player.position.set(this.playerPosition.x, this.playerPosition.y);
  }

  private tryMoveNpc(npc: NpcRuntime, dx: number, dy: number): void {
    const nextX = this.clamp(npc.position.x + dx, NPC_RADIUS, PROTOTYPE_REGION.width - NPC_RADIUS);
    if (!this.collidesCircle(nextX, npc.position.y, NPC_RADIUS)) {
      npc.position.x = nextX;
    }

    const nextY = this.clamp(npc.position.y + dy, NPC_RADIUS, PROTOTYPE_REGION.height - NPC_RADIUS);
    if (!this.collidesCircle(npc.position.x, nextY, NPC_RADIUS)) {
      npc.position.y = nextY;
    }

    npc.node.position.set(npc.position.x, npc.position.y);
  }

  private collidesCircle(x: number, y: number, radius: number): boolean {
    return PROTOTYPE_REGION.collisionZones.some((zone) => this.circleIntersectsRect(x, y, radius, zone));
  }

  private circleIntersectsRect(cx: number, cy: number, radius: number, rect: RectZone): boolean {
    const closestX = this.clamp(cx, rect.x, rect.x + rect.width);
    const closestY = this.clamp(cy, rect.y, rect.y + rect.height);
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy < radius * radius;
  }

  private updateNearbyNpc(): void {
    let nearest: NpcRuntime | undefined;
    let nearestDistance = INTERACTION_DISTANCE;

    for (const npc of this.npcs) {
      const distance = Math.hypot(
        npc.position.x - this.playerPosition.x,
        npc.position.y - this.playerPosition.y,
      );
      if (distance < nearestDistance) {
        nearest = npc;
        nearestDistance = distance;
      }
    }

    this.nearbyNpc = nearest;
  }

  private updateCamera(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;
    const targetX = screenWidth / 2 - this.playerPosition.x;
    const targetY = screenHeight / 2 - this.playerPosition.y;
    const minX = Math.min(0, screenWidth - PROTOTYPE_REGION.width);
    const minY = Math.min(0, screenHeight - PROTOTYPE_REGION.height);

    this.world.x = this.clamp(targetX, minX, 0);
    this.world.y = this.clamp(targetY, minY, 0);
  }

  private updatePrompt(): void {
    this.prompt.position.set(this.app.screen.width / 2, this.app.screen.height - 26);
    this.prompt.text = this.nearbyNpc?.definition.interactionText ?? '';
  }

  private interact(): void {
    if (!this.nearbyNpc) return;

    const { definition, activityText } = this.nearbyNpc;
    if (!definition.storySceneId) {
      this.status.text = `${definition.name}：${activityText.text}。自由探索对话接口已触发。`;
      return;
    }

    const result = openStoryScene(definition.storySceneId);
    this.status.text = result === 'opened'
      ? `已进入剧情：${definition.storySceneId}`
      : `已触发剧情桥接：${definition.storySceneId}（独立测试页未加载 game.js）`;
  }

  private clamp(value: number, min: number, max: number): number {
    if (max < min) return min;
    return Math.max(min, Math.min(max, value));
  }
}
