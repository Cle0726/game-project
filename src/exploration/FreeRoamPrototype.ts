import { Application, Assets, Container, Graphics, Sprite, Text } from 'pixi.js';
import { PROTOTYPE_REGION } from './regionData';
import type {
  ExplorationDialogueLine,
  ExplorationInteractionZone,
  ExplorationNpcDefinition,
  ExplorationQuestDefinition,
  ExplorationQuestTarget,
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
import {
  createActorMotionState,
  updateActorMotion,
  type ActorMotionState,
} from './actorMotion';

const PLAYER_RADIUS = 24;
const NPC_RADIUS = 24;
const MOVE_SPEED = 290;
const INTERACTION_DISTANCE = 120;
const NPC_CONVERSATION_PAUSE_DISTANCE = 105;
const AUTOSAVE_SECONDS = 3;
const DIALOGUE_PANEL_WIDTH = 760;
const DIALOGUE_PANEL_HEIGHT = 128;

export interface FreeRoamPrototypeOptions {
  playerSpriteSrc?: string;
  debugNavigation?: boolean;
  onStoryScene?: (sceneId: string) => void;
  onExit?: () => void;
}

interface LoadedActorSprite {
  sprite: Sprite;
  baseScale: number;
}

interface NpcRuntime {
  definition: ExplorationNpcDefinition;
  node: Container;
  position: Vec2;
  activityText: Text;
  sprite?: Sprite;
  spriteBaseScale: number;
  motion: ActorMotionState;
  activeTargetWaypointId?: string;
  route: Vec2[];
}

export class FreeRoamPrototype {
  private app = new Application();
  private world = new Container();
  private player = new Container();
  private playerPosition: Vec2;
  private playerSprite?: Sprite;
  private playerSpriteBaseScale = 1;
  private playerMotion = createActorMotionState();
  private keys = new Set<string>();
  private npcs: NpcRuntime[] = [];
  private clockMinute = PROTOTYPE_DAY_START_MINUTE;

  private prompt = new Text({
    text: '',
    style: {
      fill: 0xffffff,
      fontSize: 18,
      fontFamily: 'sans-serif',
      stroke: { color: 0x020617, width: 5 },
    },
  });
  private status = new Text({
    text: '',
    style: {
      fill: 0xe7edf7,
      fontSize: 15,
      fontFamily: 'sans-serif',
      stroke: { color: 0x020617, width: 4 },
    },
  });
  private clockText = new Text({
    text: '',
    style: { fill: 0xd7e1ef, fontSize: 14, fontFamily: 'sans-serif' },
  });
  private questTitle = new Text({
    text: '',
    style: { fill: 0xf3e4b3, fontSize: 18, fontWeight: '600', fontFamily: 'sans-serif' },
  });
  private questDescription = new Text({
    text: '',
    style: {
      fill: 0xe2e8f0,
      fontSize: 14,
      fontFamily: 'sans-serif',
      wordWrap: true,
      wordWrapWidth: 340,
    },
  });

  private clockPanel?: Graphics;
  private controlsText?: Text;
  private nearbyNpc?: NpcRuntime;
  private nearbyZone?: ExplorationInteractionZone;
  private activeQuestId?: string;
  private completedQuestIds: string[] = [];
  private autosaveElapsed = 0;
  private destroyed = false;

  private objectiveMarker = new Container();
  private objectiveZoneHighlight = new Graphics();
  private objectiveTargetKey = '';
  private objectivePulse = 0;

  private dialoguePanel?: Container;
  private dialogueSpeaker?: Text;
  private dialogueBody?: Text;
  private dialogueLines: ExplorationDialogueLine[] = [];
  private dialogueIndex = 0;
  private dialogueNpcId?: string;
  private dialogueOnComplete?: () => void;

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
    this.buildObjectivePresentation();
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

    if (
      this.options.debugNavigation ||
      new URLSearchParams(window.location.search).get('debugNav') === '1'
    ) {
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
    } catch (error) {
      console.warn('[exploration] background failed to load; using debug floor', src, error);
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
    const loaded = await this.loadActorSprite(src, 165);
    if (loaded) {
      this.playerSprite = loaded.sprite;
      this.playerSpriteBaseScale = loaded.baseScale;
      this.player.addChild(loaded.sprite);
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

      node.addChild(
        new Graphics().ellipse(0, 0, 30, 12).fill({ color: 0x0b1220, alpha: 0.25 }),
      );

      const loaded = await this.loadActorSprite(definition.spriteSrc, 155);
      if (loaded) {
        node.addChild(loaded.sprite);
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
      this.npcs.push({
        definition,
        node,
        position,
        activityText,
        sprite: loaded?.sprite,
        spriteBaseScale: loaded?.baseScale ?? 1,
        motion: createActorMotionState(),
        route: [],
      });
    }
  }

  private async loadActorSprite(
    src: string | undefined,
    targetHeight: number,
  ): Promise<LoadedActorSprite | undefined> {
    if (!src) return undefined;

    try {
      const texture = await Assets.load(src);
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5, 1);
      const textureHeight = Math.max(1, sprite.texture.height);
      const baseScale = targetHeight / textureHeight;
      sprite.scale.set(baseScale);
      return { sprite, baseScale };
    } catch (error) {
      console.warn('[exploration] actor sprite failed to load', src, error);
      return undefined;
    }
  }

  private buildDebugOverlay(): void {
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

  private buildObjectivePresentation(): void {
    this.objectiveZoneHighlight.zIndex = 70;
    this.world.addChild(this.objectiveZoneHighlight);

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
    this.objectiveMarker.addChild(markerCircle, markerText);
    this.objectiveMarker.zIndex = 50000;
    this.objectiveMarker.visible = false;
    this.world.addChild(this.objectiveMarker);
    this.refreshObjectivePresentation();
  }

  private buildHud(): void {
    const questPanel = new Graphics()
      .roundRect(16, 16, 390, 136, 12)
      .fill({ color: 0x08111f, alpha: 0.72 })
      .stroke({ width: 1, color: 0xd7c28d, alpha: 0.5 });
    this.app.stage.addChild(questPanel);

    const title = new Text({
      text: this.region.name,
      style: {
        fill: 0xffffff,
        fontSize: 21,
        fontWeight: '600',
        fontFamily: 'sans-serif',
      },
    });
    title.position.set(30, 27);
    this.app.stage.addChild(title);

    this.questTitle.position.set(30, 62);
    this.questDescription.position.set(30, 91);
    this.app.stage.addChild(this.questTitle);
    this.app.stage.addChild(this.questDescription);

    this.clockPanel = new Graphics()
      .roundRect(0, 0, 190, 42, 10)
      .fill({ color: 0x08111f, alpha: 0.66 })
      .stroke({ width: 1, color: 0x9fb7d5, alpha: 0.35 });
    this.clockPanel.position.set(this.app.screen.width - 208, 16);
    this.app.stage.addChild(this.clockPanel);

    this.clockText.anchor.set(0.5, 0.5);
    this.clockText.position.set(this.app.screen.width - 113, 37);
    this.app.stage.addChild(this.clockText);

    this.controlsText = new Text({
      text: 'WASD / 方向键 移动   ·   E / 空格 交互   ·   ESC 返回',
      style: {
        fill: 0xf1f5f9,
        fontSize: 14,
        fontFamily: 'sans-serif',
        stroke: { color: 0x020617, width: 4 },
      },
    });
    this.controlsText.anchor.set(0.5, 1);
    this.controlsText.position.set(this.app.screen.width / 2, this.app.screen.height - 22);
    this.app.stage.addChild(this.controlsText);

    this.prompt.anchor.set(0.5, 1);
    this.app.stage.addChild(this.prompt);

    this.status.position.set(30, 164);
    this.app.stage.addChild(this.status);

    this.buildDialoguePanel();
    this.refreshQuestHud();
  }

  private buildDialoguePanel(): void {
    const panel = new Container();
    const background = new Graphics()
      .roundRect(0, 0, DIALOGUE_PANEL_WIDTH, DIALOGUE_PANEL_HEIGHT, 14)
      .fill({ color: 0x08111f, alpha: 0.94 })
      .stroke({ width: 2, color: 0xd7c28d, alpha: 0.65 });

    const speaker = new Text({
      text: '',
      style: {
        fill: 0xf3e4b3,
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'sans-serif',
      },
    });
    speaker.position.set(24, 18);

    const body = new Text({
      text: '',
      style: {
        fill: 0xf8fafc,
        fontSize: 17,
        fontFamily: 'sans-serif',
        wordWrap: true,
        wordWrapWidth: 690,
        lineHeight: 25,
      },
    });
    body.position.set(24, 48);

    const hint = new Text({
      text: 'E / 空格 继续',
      style: { fill: 0xbcc9d8, fontSize: 12, fontFamily: 'sans-serif' },
    });
    hint.anchor.set(1, 1);
    hint.position.set(DIALOGUE_PANEL_WIDTH - 20, DIALOGUE_PANEL_HEIGHT - 14);

    panel.addChild(background, speaker, body, hint);
    panel.visible = false;
    this.dialoguePanel = panel;
    this.dialogueSpeaker = speaker;
    this.dialogueBody = body;
    this.app.stage.addChild(panel);
    this.updateHudPositions();
  }

  private bindInput(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();

    if (this.isDialogueActive()) {
      if ((key === 'e' || key === ' ') && !event.repeat) {
        event.preventDefault();
        this.advanceDialogue();
      } else if (key === 'escape' && !event.repeat) {
        event.preventDefault();
        this.finishDialogue(false);
      }
      return;
    }

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
    if (!this.isDialogueActive()) {
      this.clockMinute = advancePrototypeClock(this.clockMinute, deltaSeconds);
    }
    this.updateNpcs(deltaSeconds);

    let inputX = 0;
    let inputY = 0;
    if (!this.isDialogueActive()) {
      if (this.keys.has('w') || this.keys.has('arrowup')) inputY -= 1;
      if (this.keys.has('s') || this.keys.has('arrowdown')) inputY += 1;
      if (this.keys.has('a') || this.keys.has('arrowleft')) inputX -= 1;
      if (this.keys.has('d') || this.keys.has('arrowright')) inputX += 1;
    }

    let playerMovement = { x: 0, y: 0 };
    if (inputX !== 0 || inputY !== 0) {
      const length = Math.hypot(inputX, inputY);
      const dx = (inputX / length) * MOVE_SPEED * deltaSeconds;
      const dy = (inputY / length) * MOVE_SPEED * deltaSeconds;
      playerMovement = this.tryMovePlayer(dx, dy);
    }

    updateActorMotion(this.playerSprite, this.playerMotion, {
      dx: playerMovement.x,
      dy: playerMovement.y,
      deltaSeconds,
      isMoving: Math.hypot(playerMovement.x, playerMovement.y) > 0.01,
      baseScale: this.playerSpriteBaseScale,
    });

    this.updateNearbyInteraction();
    this.updateCamera();
    this.updateHudPositions();
    this.updatePrompt();
    this.updateObjectivePresentation(deltaSeconds);
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
        this.setNpcIdle(npc, deltaSeconds);
        continue;
      }

      const playerDistance = Math.hypot(
        npc.position.x - this.playerPosition.x,
        npc.position.y - this.playerPosition.y,
      );
      const talkingToNpc = this.dialogueNpcId === npc.definition.id;

      if (talkingToNpc || playerDistance <= NPC_CONVERSATION_PAUSE_DISTANCE) {
        npc.activityText.text = talkingToNpc
          ? `${scheduleEntry.activity} · 交谈中`
          : `${scheduleEntry.activity} · 可交谈`;
        npc.motion.facingX = this.playerPosition.x < npc.position.x ? -1 : 1;
        this.setNpcIdle(npc, deltaSeconds);
        continue;
      }

      npc.activityText.text = scheduleEntry.activity;
      if (npc.activeTargetWaypointId !== scheduleEntry.targetWaypointId) {
        npc.activeTargetWaypointId = scheduleEntry.targetWaypointId;
        npc.route = findWaypointPath(
          this.region.waypoints,
          npc.position,
          scheduleEntry.targetWaypointId,
        );
      }

      const nextPoint = npc.route[0];
      if (!nextPoint) {
        this.setNpcIdle(npc, deltaSeconds);
        continue;
      }

      const dx = nextPoint.x - npc.position.x;
      const dy = nextPoint.y - npc.position.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 2) {
        npc.position.x = nextPoint.x;
        npc.position.y = nextPoint.y;
        npc.node.position.set(npc.position.x, npc.position.y);
        npc.node.zIndex = npc.position.y + 100;
        npc.route.shift();
        this.setNpcIdle(npc, deltaSeconds);
        continue;
      }

      const speed = npc.definition.speed ?? 100;
      const step = Math.min(speed * deltaSeconds, distance);
      const movement = this.tryMoveNpc(
        npc,
        (dx / distance) * step,
        (dy / distance) * step,
      );

      updateActorMotion(npc.sprite, npc.motion, {
        dx: movement.x,
        dy: movement.y,
        deltaSeconds,
        isMoving: Math.hypot(movement.x, movement.y) > 0.01,
        baseScale: npc.spriteBaseScale,
      });
    }
  }

  private setNpcIdle(npc: NpcRuntime, deltaSeconds: number): void {
    updateActorMotion(npc.sprite, npc.motion, {
      dx: 0,
      dy: 0,
      deltaSeconds,
      isMoving: false,
      baseScale: npc.spriteBaseScale,
    });
  }

  private tryMovePlayer(dx: number, dy: number): Vec2 {
    const before = { ...this.playerPosition };
    const nextX = this.clamp(
      this.playerPosition.x + dx,
      PLAYER_RADIUS,
      this.region.width - PLAYER_RADIUS,
    );
    if (!this.collidesCircle(nextX, this.playerPosition.y, PLAYER_RADIUS)) {
      this.playerPosition.x = nextX;
    }

    const nextY = this.clamp(
      this.playerPosition.y + dy,
      PLAYER_RADIUS,
      this.region.height - PLAYER_RADIUS,
    );
    if (!this.collidesCircle(this.playerPosition.x, nextY, PLAYER_RADIUS)) {
      this.playerPosition.y = nextY;
    }

    this.player.position.set(this.playerPosition.x, this.playerPosition.y);
    this.player.zIndex = this.playerPosition.y + 100;
    return {
      x: this.playerPosition.x - before.x,
      y: this.playerPosition.y - before.y,
    };
  }

  private tryMoveNpc(npc: NpcRuntime, dx: number, dy: number): Vec2 {
    const before = { ...npc.position };
    const nextX = this.clamp(
      npc.position.x + dx,
      NPC_RADIUS,
      this.region.width - NPC_RADIUS,
    );
    if (!this.collidesCircle(nextX, npc.position.y, NPC_RADIUS)) {
      npc.position.x = nextX;
    }

    const nextY = this.clamp(
      npc.position.y + dy,
      NPC_RADIUS,
      this.region.height - NPC_RADIUS,
    );
    if (!this.collidesCircle(npc.position.x, nextY, NPC_RADIUS)) {
      npc.position.y = nextY;
    }

    npc.node.position.set(npc.position.x, npc.position.y);
    npc.node.zIndex = npc.position.y + 100;
    return {
      x: npc.position.x - before.x,
      y: npc.position.y - before.y,
    };
  }

  private collidesCircle(x: number, y: number, radius: number): boolean {
    return this.region.collisionZones.some((zone) =>
      this.circleIntersectsRect(x, y, radius, zone),
    );
  }

  private circleIntersectsRect(
    cx: number,
    cy: number,
    radius: number,
    rect: RectZone,
  ): boolean {
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
    this.nearbyZone = this.region.interactionZones?.find((zone) =>
      this.pointInsideZone(this.playerPosition, zone),
    );
  }

  private pointInsideZone(position: Vec2, zone: ExplorationInteractionZone): boolean {
    const { x, y, width, height } = zone.area;
    return (
      position.x >= x &&
      position.x <= x + width &&
      position.y >= y &&
      position.y <= y + height
    );
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
    this.clockPanel?.position.set(this.app.screen.width - 208, 16);
    this.clockText.position.set(this.app.screen.width - 113, 37);
    this.controlsText?.position.set(
      this.app.screen.width / 2,
      this.app.screen.height - 22,
    );

    if (this.dialoguePanel) {
      const x = Math.max(16, (this.app.screen.width - DIALOGUE_PANEL_WIDTH) / 2);
      const y = Math.max(180, this.app.screen.height - DIALOGUE_PANEL_HEIGHT - 64);
      this.dialoguePanel.position.set(x, y);
    }
  }

  private updatePrompt(): void {
    this.prompt.position.set(this.app.screen.width / 2, this.app.screen.height - 54);
    if (this.isDialogueActive()) {
      this.prompt.text = '';
      return;
    }
    this.prompt.text =
      this.nearbyNpc?.definition.interactionText ??
      this.nearbyZone?.interactionText ??
      '';
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
    npc.motion.facingX = this.playerPosition.x < npc.position.x ? -1 : 1;
    this.setNpcIdle(npc, 1 / 60);

    if (definition.mapDialogue?.length) {
      this.startDialogue(definition.mapDialogue, definition.id, () => {
        const questChanged = this.tryCompleteQuest(definition.questCompleteId);
        if (!questChanged) {
          this.status.text = `${definition.name}：${activityText.text}。`;
        }
        if (definition.storySceneId) this.openStory(definition.storySceneId);
      });
      return;
    }

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
    if (
      zone.questCompleteId &&
      this.activeQuestId !== zone.questCompleteId &&
      !this.completedQuestIds.includes(zone.questCompleteId)
    ) {
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

  private startDialogue(
    lines: ExplorationDialogueLine[],
    npcId: string | undefined,
    onComplete?: () => void,
  ): void {
    if (!lines.length || !this.dialoguePanel || !this.dialogueSpeaker || !this.dialogueBody) return;
    this.keys.clear();
    this.dialogueLines = [...lines];
    this.dialogueIndex = 0;
    this.dialogueNpcId = npcId;
    this.dialogueOnComplete = onComplete;
    this.dialoguePanel.visible = true;
    this.renderDialogueLine();
  }

  private advanceDialogue(): void {
    if (!this.isDialogueActive()) return;
    if (this.dialogueIndex < this.dialogueLines.length - 1) {
      this.dialogueIndex += 1;
      this.renderDialogueLine();
      return;
    }
    this.finishDialogue(true);
  }

  private renderDialogueLine(): void {
    const line = this.dialogueLines[this.dialogueIndex];
    if (!line || !this.dialogueSpeaker || !this.dialogueBody) return;
    this.dialogueSpeaker.text = line.speaker;
    this.dialogueBody.text = line.text;
  }

  private finishDialogue(triggerComplete: boolean): void {
    const onComplete = this.dialogueOnComplete;
    this.dialogueLines = [];
    this.dialogueIndex = 0;
    this.dialogueNpcId = undefined;
    this.dialogueOnComplete = undefined;
    if (this.dialoguePanel) this.dialoguePanel.visible = false;
    if (triggerComplete) onComplete?.();
  }

  private isDialogueActive(): boolean {
    return this.dialogueLines.length > 0;
  }

  private tryCompleteQuest(questId: string | undefined): boolean {
    const result = completeQuest(
      this.region.quests,
      this.activeQuestId,
      this.completedQuestIds,
      questId,
    );
    if (!result.changed) return false;

    const completedQuest = findQuestById<ExplorationQuestDefinition>(
      this.region.quests,
      questId,
    );
    this.activeQuestId = result.activeQuestId;
    this.completedQuestIds = result.completedQuestIds;
    this.status.text = completedQuest?.completionText ?? '目标已完成。';
    this.refreshQuestHud();
    this.refreshObjectivePresentation();
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

  private refreshObjectivePresentation(): void {
    this.objectiveTargetKey = '';
    this.updateObjectivePresentation(0);
  }

  private updateObjectivePresentation(deltaSeconds: number): void {
    this.objectivePulse += deltaSeconds;
    const quest = findQuestById(this.region.quests, this.activeQuestId);
    const target = quest?.target;
    if (!target) {
      this.objectiveMarker.visible = false;
      this.objectiveZoneHighlight.visible = false;
      this.objectiveTargetKey = '';
      return;
    }

    const targetKey = `${target.type}:${target.id}`;
    if (targetKey !== this.objectiveTargetKey) {
      this.objectiveTargetKey = targetKey;
      this.rebuildObjectiveZoneHighlight(target);
    }

    if (target.type === 'npc') {
      const npc = this.npcs.find((item) => item.definition.id === target.id);
      if (!npc) {
        this.objectiveMarker.visible = false;
        return;
      }
      this.objectiveMarker.visible = true;
      this.objectiveMarker.position.set(npc.position.x, npc.position.y - 195);
    } else {
      const zone = this.region.interactionZones?.find((item) => item.id === target.id);
      if (!zone) {
        this.objectiveMarker.visible = false;
        return;
      }
      this.objectiveMarker.visible = true;
      this.objectiveMarker.position.set(
        zone.area.x + zone.area.width / 2,
        Math.max(32, zone.area.y - 24),
      );
    }

    const pulse = 1 + Math.sin(this.objectivePulse * 4.8) * 0.08;
    this.objectiveMarker.scale.set(pulse);
    this.objectiveMarker.alpha = 0.88 + Math.sin(this.objectivePulse * 4.8) * 0.1;
    if (this.objectiveZoneHighlight.visible) {
      this.objectiveZoneHighlight.alpha = 0.45 + Math.sin(this.objectivePulse * 3.8) * 0.18;
    }
  }

  private rebuildObjectiveZoneHighlight(target: ExplorationQuestTarget): void {
    this.objectiveZoneHighlight.clear();
    this.objectiveZoneHighlight.visible = false;
    if (target.type !== 'zone') return;

    const zone = this.region.interactionZones?.find((item) => item.id === target.id);
    if (!zone) return;
    const padding = 10;
    this.objectiveZoneHighlight
      .roundRect(
        zone.area.x - padding,
        zone.area.y - padding,
        zone.area.width + padding * 2,
        zone.area.height + padding * 2,
        18,
      )
      .fill({ color: 0xd8bd70, alpha: 0.06 })
      .stroke({ width: 4, color: 0xf2d58a, alpha: 0.9 });
    this.objectiveZoneHighlight.visible = true;
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
      this.npcs.map((npc) => [
        npc.definition.id,
        { x: npc.position.x, y: npc.position.y },
      ]),
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
