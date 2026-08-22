import { Application, Assets, Container, Graphics, Sprite, Text } from 'pixi.js';
import { PROTOTYPE_REGION } from './regionData';
import type {
  ExplorationInteractionZone,
  ExplorationNpcDefinition,
  ExplorationQuestDefinition,
  ExplorationRegionDefinition,
  RectZone,
  Vec2,
} from './explorationTypes';
import {
  advancePrototypeClock,
  formatMinuteOfDay,
  PROTOTYPE_DAY_START_MINUTE,
  resolveScheduleEntry,
} from './npcSchedule';
import { findWaypointPath } from './pathfinding';
import { openStoryScene } from './storyBridge';
import { completeQuest, findQuestById } from './questState';
import { loadExplorationSave, saveExplorationState } from './explorationSave';

const PLAYER_RADIUS = 24;
const NPC_RADIUS = 24;
const MOVE_SPEED = 290;
const INTERACTION_DISTANCE = 120;
const AUTOSAVE_SECONDS = 3;

export interface FreeRoamPrototypeOptions {
  playerSpriteSrc?: string;
  debugNavigation?: boolean;
  onStoryScene?: (sceneId: string) => void;
  onExit?: () => void;
}

interface NpcRuntime {
  definition: ExplorationNpcDefinition;
  node: Container;
  position: Vec2;
  activityText: Text;
  activeTargetWaypointId?: string;
  route: Vec2[];
}

export class FreeRoamPrototype {
  private app = new Application();
  private world = new Container();
  private player = new Container();
  private playerPosition: Vec2;
  private keys = new Set<string>();
  private npcs: NpcRuntime[] = [];
  private clockMinute = PROTOTYPE_DAY_START_MINUTE;
  private prompt = new Text({ text: '', style: { fill: 0xffffff, fontSize: 18, fontFamily: 'sans-serif' } });
  private status = new Text({ text: '', style: { fill: 0xe7edf7, fontSize: 15, fontFamily: 'sans-serif' } });
  private clockText = new Text({ text: '', style: { fill: 0xd7e1ef, fontSize: 14, fontFamily: 'sans-serif' } });
  private questTitle = new Text({ text: '', style: { fill: 0xf3e4b3, fontSize: 18, fontWeight: '600', fontFamily: 'sans-serif' } });
  private questDescription = new Text({
    text: '',
    style: { fill: 0xe2e8f0, fontSize: 14, fontFamily: 'sans-serif', wordWrap: true, wordWrapWidth: 340 },
  });
  private nearbyNpc?: NpcRuntime;
  private nearbyZone?: ExplorationInteractionZone;
  private activeQuestId?: string;
  private completedQuestIds: string[] = [];
  private autosaveElapsed = 0;
  private destroyed = false;

  constructor(
    private readonly region: ExplorationRegionDefinition = PROTOTYPE_REGION,
    private readonly options: FreeRoamPrototypeOptions = {},
  ) {
    this.playerPosition = { ...region.playerSpawn };
    this.activeQuestId = region.initialQuestId;

    const saved = typeof window !== 'undefined' ? loadExplorationSave(region.id) : undefined;
    if (saved) {
      this.playerPosition = { ...saved.playerPosition };
      this.clockMinute = saved.clockMinute;
      this.activeQuestId = saved.activeQuestId ?? region.initialQuestId;
      this.completedQuestIds = [...saved.completedQuestIds];
    }
  }

  async mount(host: HTMLElement): Promise<void> {
    this.destroyed = false;
    await this.app.init({
      resizeTo: host,
      background: '#111927',
      antialias: true,
    });

    host.appendChild(this.app.canvas);
    this.app.stage.addChild(this.world);
    await this.buildWorld();
    this.buildHud();
    this.bindInput();
    this.app.ticker.add((ticker) => this.update(ticker.deltaMS / 1000));
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.persistState();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.app.destroy(true);
  }

  private async buildWorld(): Promise<void> {
    this.world.sortableChildren = true;
    const backgroundLoaded = await this.addBackground();

    if (!backgroundLoaded) {
      const floor = new Graphics().rect(0, 0, this.region.width, this.region.height).fill(0x1a2638);
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

    if (this.options.debugNavigation || new URLSearchParams(window.location.search).get('debugNav') === '1') {
      this.buildDebugOverlay();
    }

    await this.buildPlayer();
    await this.buildNpcs();
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
    } catch {
      return false;
    }
  }

  private async buildPlayer(): Promise<void> {
    const shadow = new Graphics()
      .ellipse(0, 0, 34, 14)
      .fill({ color: 0x0b1220, alpha: 0.3 })
      .stroke({ width: 2, color: 0x9ed7ff, alpha: 0.7 });
    this.player.addChild(shadow);

    const src = this.options.playerSpriteSrc ?? this.region.assets?.playerSpriteSrc;
    const sprite = await this.loadActorSprite(src, 165);
    if (sprite) {
      this.player.addChild(sprite);
    } else {
      this.player.addChild(new Graphics().circle(0, -24, PLAYER_RADIUS).fill(0xe5e7eb));
    }

    this.player.position.set(this.playerPosition.x, this.playerPosition.y);
    this.player.zIndex = this.playerPosition.y + 100;
    this.world.addChild(this.player);
  }

  private async buildNpcs(): Promise<void> {
    const saved = loadExplorationSave(this.region.id);

    for (const definition of this.region.npcs) {
      const node = new Container();
      const restoredPosition = saved?.npcPositions[definition.id];
      const position = restoredPosition ? { ...restoredPosition } : { ...definition.position };
      node.position.set(position.x, position.y);
      node.zIndex = position.y + 100;

      node.addChild(new Graphics().ellipse(0, 0, 30, 12).fill({ color: 0x0b1220, alpha: 0.25 }));
      const sprite = await this.loadActorSprite(definition.spriteSrc, 155);
      if (sprite) {
        node.addChild(sprite);
      } else {
        node.addChild(new Graphics().circle(0, -22, NPC_RADIUS).fill(0x9fb7d5));
      }

      const label = new Text({
        text: definition.name,
        style: {
          fill: 0xffffff,
          fontSize: 16,
          fontWeight: '600',
          fontFamily: 'sans-serif',
          stroke: { color: 0x111827, width: 4 },
        },
      });
      label.anchor.set(0.5, 1);
      label.position.set(0, -164);
      node.addChild(label);

      const activityText = new Text({
        text: '',
        style: {
          fill: 0xe5edf7,
          fontSize: 12,
          fontFamily: 'sans-serif',
          stroke: { color: 0x111827, width: 3 },
        },
      });
      activityText.anchor.set(0.5, 0);
      activityText.position.set(0, 8);
      node.addChild(activityText);

      this.world.addChild(node);
      this.npcs.push({ definition, node, position, activityText, route: [] });
    }
  }

  private async loadActorSprite(src: string | undefined, targetHeight: number): Promise<Sprite | undefined> {
    if (!src) return undefined;

    try {
      const texture = await Assets.load(src);
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5, 1);
      const textureHeight = Math.max(1, sprite.texture.height);
      const scale = targetHeight / textureHeight;
      sprite.scale.set(scale);
      return sprite;
    } catch {
      return undefined;
    }
  }

  private buildDebugOverlay(): void {
    const overlay = new Graphics();
    const waypointMap = new Map(this.region.waypoints.map((waypoint) => [waypoint.id, waypoint]));
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
        overlay.moveTo(waypoint.position.x, waypoint.position.y).lineTo(linked.position.x, linked.position.y);
      }
    }
    overlay.stroke({ width: 3, color: 0x8ac7ff, alpha: 0.48 });

    for (const waypoint of this.region.waypoints) {
      overlay.circle(waypoint.position.x, waypoint.position.y, 7).fill({ color: 0xcde9ff, alpha: 0.7 });
    }

    overlay.zIndex = 50;
    this.world.addChild(overlay);
  }

  private buildHud(): void {
    const questPanel = new Graphics()
      .roundRect(16, 16, 390, 136, 12)
      .fill({ color: 0x08111f, alpha: 0.72 })
      .stroke({ width: 1, color: 0xd7c28d, alpha: 0.5 });
    this.app.stage.addChild(questPanel);

    const title = new Text({
      text: this.region.name,
      style: { fill: 0xffffff, fontSize: 21, fontWeight: '600', fontFamily: 'sans-serif' },
    });
    title.position.set(30, 27);
    this.app.stage.addChild(title);

    this.questTitle.position.set(30, 62);
    this.questDescription.position.set(30, 91);
    this.app.stage.addChild(this.questTitle);
    this.app.stage.addChild(this.questDescription);

    const clockPanel = new Graphics()
      .roundRect(0, 0, 190, 42, 10)
      .fill({ color: 0x08111f, alpha: 0.66 })
      .stroke({ width: 1, color: 0x9fb7d5, alpha: 0.35 });
    clockPanel.position.set(this.app.screen.width - 208, 16);
    clockPanel.label = 'clock-panel';
    this.app.stage.addChild(clockPanel);

    this.clockText.anchor.set(0.5, 0.5);
    this.clockText.position.set(this.app.screen.width - 113, 37);
    this.app.stage.addChild(this.clockText);

    const controls = new Text({
      text: 'WASD / 方向键 移动   ·   E / 空格 交互   ·   ESC 返回',
      style: {
        fill: 0xf1f5f9,
        fontSize: 14,
        fontFamily: 'sans-serif',
        stroke: { color: 0x020617, width: 4 },
      },
    });
    controls.anchor.set(0.5, 1);
    controls.position.set(this.app.screen.width / 2, this.app.screen.height - 22);
    controls.label = 'controls';
    this.app.stage.addChild(controls);

    this.prompt.anchor.set(0.5, 1);
    this.prompt.style.stroke = { color: 0x020617, width: 5 };
    this.app.stage.addChild(this.prompt);

    this.status.position.set(30, 164);
    this.status.style.stroke = { color: 0x020617, width: 4 };
    this.app.stage.addChild(this.status);
    this.refreshQuestHud();
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
      return;
    }

    if (key === 'escape' && !event.repeat && this.options.onExit) {
      event.preventDefault();
      this.persistState();
      this.options.onExit();
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

    this.updateNearbyInteraction();
    this.updateCamera();
    this.updateHudPositions();
    this.updatePrompt();
    this.clockText.text = `${formatMinuteOfDay(this.clockMinute)} · 白谱院`;

    this.autosaveElapsed += deltaSeconds;
    if (this.autosaveElapsed >= AUTOSAVE_SECONDS) {
      this.autosaveElapsed = 0;
      this.persistState();
    }
  }

  private updateNpcs(deltaSeconds: number): void {
    for (const npc of this.npcs) {
      const scheduleEntry = resolveScheduleEntry(npc.definition.schedule, this.clockMinute);
      if (!scheduleEntry) {
        npc.activityText.text = '自由行动';
        continue;
      }

      npc.activityText.text = scheduleEntry.activity;
      if (npc.activeTargetWaypointId !== scheduleEntry.targetWaypointId) {
        npc.activeTargetWaypointId = scheduleEntry.targetWaypointId;
        npc.route = findWaypointPath(this.region.waypoints, npc.position, scheduleEntry.targetWaypointId);
      }

      const nextPoint = npc.route[0];
      if (!nextPoint) continue;

      const dx = nextPoint.x - npc.position.x;
      const dy = nextPoint.y - npc.position.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 2) {
        npc.position.x = nextPoint.x;
        npc.position.y = nextPoint.y;
        npc.node.position.set(npc.position.x, npc.position.y);
        npc.node.zIndex = npc.position.y + 100;
        npc.route.shift();
        continue;
      }

      const speed = npc.definition.speed ?? 100;
      const step = Math.min(speed * deltaSeconds, distance);
      this.tryMoveNpc(npc, (dx / distance) * step, (dy / distance) * step);
    }
  }

  private tryMovePlayer(dx: number, dy: number): void {
    const nextX = this.clamp(this.playerPosition.x + dx, PLAYER_RADIUS, this.region.width - PLAYER_RADIUS);
    if (!this.collidesCircle(nextX, this.playerPosition.y, PLAYER_RADIUS)) {
      this.playerPosition.x = nextX;
    }

    const nextY = this.clamp(this.playerPosition.y + dy, PLAYER_RADIUS, this.region.height - PLAYER_RADIUS);
    if (!this.collidesCircle(this.playerPosition.x, nextY, PLAYER_RADIUS)) {
      this.playerPosition.y = nextY;
    }

    this.player.position.set(this.playerPosition.x, this.playerPosition.y);
    this.player.zIndex = this.playerPosition.y + 100;
  }

  private tryMoveNpc(npc: NpcRuntime, dx: number, dy: number): void {
    const nextX = this.clamp(npc.position.x + dx, NPC_RADIUS, this.region.width - NPC_RADIUS);
    if (!this.collidesCircle(nextX, npc.position.y, NPC_RADIUS)) {
      npc.position.x = nextX;
    }

    const nextY = this.clamp(npc.position.y + dy, NPC_RADIUS, this.region.height - NPC_RADIUS);
    if (!this.collidesCircle(npc.position.x, nextY, NPC_RADIUS)) {
      npc.position.y = nextY;
    }

    npc.node.position.set(npc.position.x, npc.position.y);
    npc.node.zIndex = npc.position.y + 100;
  }

  private collidesCircle(x: number, y: number, radius: number): boolean {
    return this.region.collisionZones.some((zone) => this.circleIntersectsRect(x, y, radius, zone));
  }

  private circleIntersectsRect(cx: number, cy: number, radius: number, rect: RectZone): boolean {
    const closestX = this.clamp(cx, rect.x, rect.x + rect.width);
    const closestY = this.clamp(cy, rect.y, rect.y + rect.height);
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy < radius * radius;
  }

  private updateNearbyInteraction(): void {
    let nearest: NpcRuntime | undefined;
    let nearestDistance = INTERACTION_DISTANCE;

    for (const npc of this.npcs) {
      const distance = Math.hypot(npc.position.x - this.playerPosition.x, npc.position.y - this.playerPosition.y);
      if (distance < nearestDistance) {
        nearest = npc;
        nearestDistance = distance;
      }
    }

    this.nearbyNpc = nearest;
    this.nearbyZone = this.region.interactionZones?.find((zone) => this.pointInsideZone(this.playerPosition, zone));
  }

  private pointInsideZone(position: Vec2, zone: ExplorationInteractionZone): boolean {
    const { x, y, width, height } = zone.area;
    return position.x >= x && position.x <= x + width && position.y >= y && position.y <= y + height;
  }

  private updateCamera(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;
    const targetX = screenWidth / 2 - this.playerPosition.x;
    const targetY = screenHeight / 2 - this.playerPosition.y;
    const minX = Math.min(0, screenWidth - this.region.width);
    const minY = Math.min(0, screenHeight - this.region.height);

    this.world.x = this.clamp(targetX, minX, 0);
    this.world.y = this.clamp(targetY, minY, 0);
  }

  private updateHudPositions(): void {
    const clockPanel = this.app.stage.getChildByLabel<Graphics>('clock-panel');
    if (clockPanel) clockPanel.position.set(this.app.screen.width - 208, 16);
    this.clockText.position.set(this.app.screen.width - 113, 37);

    const controls = this.app.stage.getChildByLabel<Text>('controls');
    if (controls) controls.position.set(this.app.screen.width / 2, this.app.screen.height - 22);
  }

  private updatePrompt(): void {
    this.prompt.position.set(this.app.screen.width / 2, this.app.screen.height - 54);
    this.prompt.text = this.nearbyNpc?.definition.interactionText ?? this.nearbyZone?.interactionText ?? '';
  }

  private interact(): void {
    if (this.nearbyNpc) {
      this.interactWithNpc(this.nearbyNpc);
      return;
    }

    if (this.nearbyZone) {
      this.interactWithZone(this.nearbyZone);
    }
  }

  private interactWithNpc(npc: NpcRuntime): void {
    const { definition, activityText } = npc;
    const questChanged = this.tryCompleteQuest(definition.questCompleteId);

    if (!definition.storySceneId) {
      if (!questChanged) {
        this.status.text = `${definition.name}：${activityText.text}。`;
      }
      return;
    }

    this.openStory(definition.storySceneId);
  }

  private interactWithZone(zone: ExplorationInteractionZone): void {
    if (zone.questCompleteId && this.activeQuestId !== zone.questCompleteId && !this.completedQuestIds.includes(zone.questCompleteId)) {
      const currentQuest = findQuestById(this.region.quests, this.activeQuestId);
      this.status.text = currentQuest
        ? `当前目标：${currentQuest.title}。完成后再前往${zone.name}。`
        : `现在还不能进入${zone.name}。`;
      return;
    }

    this.tryCompleteQuest(zone.questCompleteId);
    if (zone.statusText) this.status.text = zone.statusText;
    if (zone.storySceneId) this.openStory(zone.storySceneId);
  }

  private tryCompleteQuest(questId: string | undefined): boolean {
    const result = completeQuest(this.region.quests, this.activeQuestId, this.completedQuestIds, questId);
    if (!result.changed) return false;

    const completedQuest = findQuestById<ExplorationQuestDefinition>(this.region.quests, questId);
    this.activeQuestId = result.activeQuestId;
    this.completedQuestIds = result.completedQuestIds;
    this.status.text = completedQuest?.completionText ?? '目标已完成。';
    this.refreshQuestHud();
    this.persistState();
    return true;
  }

  private refreshQuestHud(): void {
    const quest = findQuestById(this.region.quests, this.activeQuestId);
    if (!quest) {
      this.questTitle.text = '探索目标已完成';
      this.questDescription.text = '继续探索，或进入白谱院推进主线。';
      return;
    }

    this.questTitle.text = `◆ ${quest.title}`;
    this.questDescription.text = quest.description;
  }

  private openStory(sceneId: string): void {
    this.persistState();
    if (this.options.onStoryScene) {
      this.options.onStoryScene(sceneId);
      return;
    }
    openStoryScene(sceneId);
  }

  private persistState(): void {
    const npcPositions = Object.fromEntries(
      this.npcs.map((npc) => [npc.definition.id, { x: npc.position.x, y: npc.position.y }]),
    );

    saveExplorationState({
      version: 1,
      regionId: this.region.id,
      playerPosition: { ...this.playerPosition },
      clockMinute: this.clockMinute,
      activeQuestId: this.activeQuestId,
      completedQuestIds: [...this.completedQuestIds],
      npcPositions,
    });
  }

  private clamp(value: number, min: number, max: number): number {
    if (max < min) return min;
    return Math.max(min, Math.min(max, value));
  }
}
