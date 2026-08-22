import { Application, Container } from 'pixi.js';
import type { Sprite, Text } from 'pixi.js';
import type {
  ExplorationInteractionZone,
  ExplorationNpcDefinition,
  ExplorationQuestDefinition,
  ExplorationRegionDefinition,
  Vec2,
} from '../../exploration/explorationTypes';
import { openStoryScene } from '../../exploration/storyBridge';
import { getSimulationRuntime } from '../runtime/SimulationRuntime';
import {
  loadRegionExplorationSnapshot,
  saveRegionExplorationSnapshot,
  type RegionExplorationSnapshotV1,
} from '../state/SimulationPersistence';
import { completeQuest, findQuestById } from '../quest/QuestSystem';
import {
  createActorMotionState,
  stepActorMotion,
  type ActorMotionState,
} from './ActorMotionSystem';
import { ExplorationActorViewFactory } from './ExplorationActorViewFactory';
import {
  EXPLORATION_DIALOGUE_PANEL_HEIGHT,
  EXPLORATION_DIALOGUE_PANEL_WIDTH,
  ExplorationDialoguePresentation,
} from './ExplorationDialoguePresentation';
import { ExplorationHudPresentation } from './ExplorationHudPresentation';
import { ExplorationInputController } from './ExplorationInputController';
import { ExplorationLoop, type ExplorationLoopPort } from './ExplorationLoop';
import { planNpcFrame } from './ExplorationNpcController';
import { ExplorationObjectivePresentation } from './ExplorationObjectivePresentation';
import {
  computeCameraOffset,
  computeHudLayout,
  depthFromWorldY,
} from './ExplorationRenderer';
import { ExplorationWorldPresentation } from './ExplorationWorldPresentation';
import {
  evaluateQuestInteractionGate,
  findContainingInteractionZone,
  findNearestInteractionActor,
} from './InteractionSystem';
import { moveActorByDelta } from './MovementSystem';

const PLAYER_RADIUS = 24;
const NPC_RADIUS = 24;
const INTERACTION_DISTANCE = 120;
const NPC_CONVERSATION_PAUSE_DISTANCE = 105;
const DEFAULT_CLOCK_MINUTE = 8 * 60;

export interface ExplorationHostOptions {
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
  sprite?: Sprite;
  spriteBaseScale: number;
  motion: ActorMotionState;
  activeTargetWaypointId?: string;
  route: Vec2[];
}

/**
 * Direct Pixi exploration host. This is the Phase-A replacement for FreeRoamPrototype:
 * it composes deterministic simulation systems and presentation objects without any
 * LegacyFreeRoam adapter layer.
 */
export class ExplorationHost implements ExplorationLoopPort {
  private readonly app = new Application();
  private readonly world = new Container();
  private readonly input = new ExplorationInputController();
  private readonly loop = new ExplorationLoop(this.input);
  private readonly actorViews = new ExplorationActorViewFactory();

  private player = new Container();
  private playerPosition: Vec2;
  private playerSprite?: Sprite;
  private playerSpriteBaseScale = 1;
  private playerMotion = createActorMotionState();
  private npcs: NpcRuntime[] = [];

  private hud?: ExplorationHudPresentation;
  private dialogue?: ExplorationDialoguePresentation;
  private objective?: ExplorationObjectivePresentation;

  private nearbyNpc?: NpcRuntime;
  private nearbyZone?: ExplorationInteractionZone;
  private activeQuestId?: string;
  private completedQuestIds: string[] = [];
  private clockMinute = DEFAULT_CLOCK_MINUTE;
  private destroyed = false;
  private mounted = false;
  private readonly initialSnapshot?: RegionExplorationSnapshotV1;

  constructor(
    readonly region: ExplorationRegionDefinition,
    private readonly options: ExplorationHostOptions = {},
  ) {
    this.playerPosition = { ...region.playerSpawn };
    this.activeQuestId = region.initialQuestId;

    if (typeof window !== 'undefined') {
      this.initialSnapshot = loadRegionExplorationSnapshot(region.id);
      if (this.initialSnapshot) {
        this.playerPosition = { ...this.initialSnapshot.playerPosition };
        this.clockMinute = this.initialSnapshot.clockMinute;
        this.activeQuestId = this.initialSnapshot.activeQuestId ?? region.initialQuestId;
        this.completedQuestIds = [...this.initialSnapshot.completedQuestIds];
      }
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

    const debugNavigation =
      this.options.debugNavigation === true ||
      new URLSearchParams(window.location.search).get('debugNav') === '1';
    await new ExplorationWorldPresentation(this.world, this.region).buildEnvironment(
      debugNavigation,
    );

    await this.buildPlayer();
    await this.buildNpcs();

    this.objective = new ExplorationObjectivePresentation(this.world);
    this.hud = new ExplorationHudPresentation(this.app.stage, this.region.name);
    this.dialogue = new ExplorationDialoguePresentation(this.app.stage);
    this.refreshQuestHud();
    this.updateHudPositions();
    this.updateNearbyInteraction();
    this.updatePrompt();
    this.updateObjectivePresentation(0);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.app.ticker.add(this.onTick);
    this.mounted = true;
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.mounted) this.persistState();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.app.ticker.remove(this.onTick);
    this.app.destroy(true);
    this.mounted = false;
  }

  isPaused(): boolean {
    return this.dialogue?.active ?? false;
  }

  getClockMinute(): number {
    return this.clockMinute;
  }

  setClockMinute(minute: number): void {
    this.clockMinute = minute;
  }

  updateNpcs(deltaSeconds: number): void {
    for (const npc of this.npcs) {
      const plan = planNpcFrame(npc.definition, npc, {
        clockMinute: this.clockMinute,
        playerPosition: this.playerPosition,
        dialogueNpcId: this.dialogue?.activeNpcId,
        waypoints: this.region.waypoints,
        deltaSeconds,
        conversationPauseDistance: NPC_CONVERSATION_PAUSE_DISTANCE,
      });

      npc.activityText.text = plan.activityText;

      if (plan.kind === 'idle') {
        if (plan.facePlayer) {
          npc.motion.facingX = this.playerPosition.x < npc.position.x ? -1 : 1;
        }
        this.applyActorMotion(npc.sprite, npc.motion, npc.spriteBaseScale, { x: 0, y: 0 }, deltaSeconds);
        continue;
      }

      if (plan.kind === 'snap') {
        npc.position.x = plan.target.x;
        npc.position.y = plan.target.y;
        npc.node.position.set(npc.position.x, npc.position.y);
        npc.node.zIndex = depthFromWorldY(npc.position.y);
        this.applyActorMotion(npc.sprite, npc.motion, npc.spriteBaseScale, { x: 0, y: 0 }, deltaSeconds);
        continue;
      }

      const movement = this.moveNpc(npc, plan.delta);
      this.applyActorMotion(npc.sprite, npc.motion, npc.spriteBaseScale, movement, deltaSeconds);
    }
  }

  movePlayer(delta: Vec2): Vec2 {
    const result = moveActorByDelta(this.playerPosition, delta, {
      radius: PLAYER_RADIUS,
      bounds: { width: this.region.width, height: this.region.height },
      collisionZones: this.region.collisionZones,
    });
    this.playerPosition.x = result.position.x;
    this.playerPosition.y = result.position.y;
    this.player.position.set(this.playerPosition.x, this.playerPosition.y);
    this.player.zIndex = depthFromWorldY(this.playerPosition.y);
    return result.movement;
  }

  updatePlayerMotion(movement: Vec2, deltaSeconds: number): void {
    this.applyActorMotion(
      this.playerSprite,
      this.playerMotion,
      this.playerSpriteBaseScale,
      movement,
      deltaSeconds,
    );
  }

  updateNearbyInteraction(): void {
    this.nearbyNpc = findNearestInteractionActor(
      this.npcs,
      this.playerPosition,
      INTERACTION_DISTANCE,
    );
    this.nearbyZone = findContainingInteractionZone(
      this.region.interactionZones,
      this.playerPosition,
    );
  }

  updateCamera(): void {
    const camera = computeCameraOffset({
      screen: this.app.screen,
      region: { width: this.region.width, height: this.region.height },
      focus: this.playerPosition,
    });
    this.world.position.set(camera.x, camera.y);
  }

  updateHudPositions(): void {
    if (!this.hud || !this.dialogue) return;
    const layout = computeHudLayout(this.app.screen, {
      width: EXPLORATION_DIALOGUE_PANEL_WIDTH,
      height: EXPLORATION_DIALOGUE_PANEL_HEIGHT,
    });
    this.hud.clockPanel.position.set(layout.clockPanel.x, layout.clockPanel.y);
    this.hud.clockText.position.set(layout.clockText.x, layout.clockText.y);
    this.hud.controlsText.position.set(layout.controls.x, layout.controls.y);
    this.hud.prompt.position.set(layout.prompt.x, layout.prompt.y);
    this.dialogue.setPosition(layout.dialogue.x, layout.dialogue.y);
  }

  updatePrompt(): void {
    if (!this.hud) return;
    if (this.isPaused()) {
      this.hud.setPrompt('');
      return;
    }
    this.hud.setPrompt(
      this.nearbyNpc?.definition.interactionText ?? this.nearbyZone?.interactionText ?? '',
    );
  }

  updateObjectivePresentation(deltaSeconds: number): void {
    const quest = findQuestById(this.region.quests, this.activeQuestId);
    this.objective?.update(
      deltaSeconds,
      quest?.target,
      this.npcs.map((npc) => ({ id: npc.definition.id, position: npc.position })),
      this.region.interactionZones,
    );
  }

  updateClockLabel(label: string): void {
    if (this.hud) this.hud.clockText.text = `${label} · ${this.region.name}`;
  }

  persistState(): void {
    const newlyCompletedQuestIds = saveRegionExplorationSnapshot({
      regionId: this.region.id,
      playerPosition: { ...this.playerPosition },
      clockMinute: this.clockMinute,
      activeQuestId: this.activeQuestId,
      completedQuestIds: [...this.completedQuestIds],
      npcPositions: Object.fromEntries(
        this.npcs.map((npc) => [npc.definition.id, { ...npc.position }]),
      ),
    });

    if (!newlyCompletedQuestIds.length) return;
    const runtime = getSimulationRuntime();
    const state = runtime.start();
    const issuedAt = Math.max(0, state.clock.day - 1) * 1440 + state.clock.minuteOfDay;
    for (const questId of newlyCompletedQuestIds) {
      runtime.commands.dispatch({
        type: 'quest.complete',
        source: 'player',
        actorId: 'player',
        issuedAt,
        payload: { questId },
      });
    }
  }

  private readonly onTick = (ticker: { deltaMS: number }): void => {
    this.loop.tick(ticker.deltaMS / 1000, this);
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const key = this.input.normalizeKey(event.key);

    if (this.dialogue?.active) {
      if (this.input.isInteractionKey(key) && !event.repeat) {
        event.preventDefault();
        this.dialogue.advance();
      } else if (this.input.isExitKey(key) && !event.repeat) {
        event.preventDefault();
        this.dialogue.finish(false);
      }
      return;
    }

    this.input.press(key);

    if (this.input.isInteractionKey(key) && !event.repeat) {
      event.preventDefault();
      this.interact();
      return;
    }

    if (this.input.isExitKey(key) && !event.repeat && this.options.onExit) {
      event.preventDefault();
      this.persistState();
      this.options.onExit();
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.input.release(event.key);
  };

  private async buildPlayer(): Promise<void> {
    const view = await this.actorViews.createPlayer(
      this.options.playerSpriteSrc ?? this.region.assets?.playerSpriteSrc,
    );
    this.player = view.node;
    this.playerSprite = view.sprite;
    this.playerSpriteBaseScale = view.baseScale;
    this.player.position.set(this.playerPosition.x, this.playerPosition.y);
    this.player.zIndex = depthFromWorldY(this.playerPosition.y);
    this.world.addChild(this.player);
  }

  private async buildNpcs(): Promise<void> {
    for (const definition of this.region.npcs) {
      const view = await this.actorViews.createNpc(definition);
      const restoredPosition = this.initialSnapshot?.npcPositions[definition.id];
      const position = restoredPosition ? { ...restoredPosition } : { ...definition.position };
      view.node.position.set(position.x, position.y);
      view.node.zIndex = depthFromWorldY(position.y);
      this.world.addChild(view.node);
      this.npcs.push({
        definition,
        node: view.node,
        position,
        activityText: view.activityText,
        sprite: view.sprite,
        spriteBaseScale: view.baseScale,
        motion: createActorMotionState(),
        route: [],
      });
    }
  }

  private moveNpc(npc: NpcRuntime, delta: Vec2): Vec2 {
    const result = moveActorByDelta(npc.position, delta, {
      radius: NPC_RADIUS,
      bounds: { width: this.region.width, height: this.region.height },
      collisionZones: this.region.collisionZones,
    });
    npc.position.x = result.position.x;
    npc.position.y = result.position.y;
    npc.node.position.set(npc.position.x, npc.position.y);
    npc.node.zIndex = depthFromWorldY(npc.position.y);
    return result.movement;
  }

  private applyActorMotion(
    sprite: Sprite | undefined,
    state: ActorMotionState,
    baseScale: number,
    movement: Vec2,
    deltaSeconds: number,
  ): void {
    const isMoving = Math.hypot(movement.x, movement.y) > 0.01;
    const pose = stepActorMotion(state, {
      dx: movement.x,
      dy: movement.y,
      deltaSeconds,
      isMoving,
    });
    if (!sprite) return;

    if (isMoving) {
      sprite.y = pose.offsetY;
      sprite.rotation = pose.rotation;
    } else {
      const smoothing = Math.min(1, Math.max(0, deltaSeconds) * 12);
      sprite.y += (pose.offsetY - sprite.y) * smoothing;
      sprite.rotation += (pose.rotation - sprite.rotation) * smoothing;
    }
    sprite.scale.set(
      baseScale * pose.scaleXFactor,
      baseScale * pose.scaleYFactor,
    );
  }

  private interact(): void {
    if (this.nearbyNpc) {
      this.interactWithNpc(this.nearbyNpc);
      return;
    }
    if (this.nearbyZone) this.interactWithZone(this.nearbyZone);
  }

  private interactWithNpc(npc: NpcRuntime): void {
    npc.motion.facingX = this.playerPosition.x < npc.position.x ? -1 : 1;
    this.applyActorMotion(npc.sprite, npc.motion, npc.spriteBaseScale, { x: 0, y: 0 }, 1 / 60);

    const definition = npc.definition;
    if (definition.mapDialogue?.length && this.dialogue) {
      this.input.clear();
      this.dialogue.start(definition.mapDialogue, definition.id, () => {
        const questChanged = this.tryCompleteQuest(definition.questCompleteId);
        if (!questChanged && this.hud) {
          this.hud.status.text = `${definition.name}：${npc.activityText.text}。`;
        }
        if (definition.storySceneId) this.openStory(definition.storySceneId);
      });
      return;
    }

    const questChanged = this.tryCompleteQuest(definition.questCompleteId);
    if (!definition.storySceneId) {
      if (!questChanged && this.hud) {
        this.hud.status.text = `${definition.name}：${npc.activityText.text}。`;
      }
      return;
    }
    this.openStory(definition.storySceneId);
  }

  private interactWithZone(zone: ExplorationInteractionZone): void {
    const gate = evaluateQuestInteractionGate({
      requiredQuestId: zone.questCompleteId,
      activeQuestId: this.activeQuestId,
      completedQuestIds: this.completedQuestIds,
    });

    if (!gate.allowed) {
      const currentQuest = findQuestById<ExplorationQuestDefinition>(
        this.region.quests,
        this.activeQuestId,
      );
      if (this.hud) {
        this.hud.status.text = currentQuest
          ? `当前目标：${currentQuest.title}。完成后再前往${zone.name}。`
          : `现在还不能进入${zone.name}。`;
      }
      return;
    }

    this.tryCompleteQuest(zone.questCompleteId);
    if (zone.statusText && this.hud) this.hud.status.text = zone.statusText;
    if (zone.storySceneId) this.openStory(zone.storySceneId);
  }

  private tryCompleteQuest(questId: string | undefined): boolean {
    const result = completeQuest(
      this.region.quests,
      {
        activeQuestId: this.activeQuestId,
        completedQuestIds: this.completedQuestIds,
      },
      questId,
    );
    if (!result.changed) return false;

    const completedQuest = findQuestById<ExplorationQuestDefinition>(
      this.region.quests,
      questId,
    );
    this.activeQuestId = result.activeQuestId;
    this.completedQuestIds = result.completedQuestIds;
    if (this.hud) {
      this.hud.status.text = completedQuest?.completionText ?? '目标已完成。';
    }
    this.refreshQuestHud();
    this.objective?.refresh();
    this.updateObjectivePresentation(0);
    this.persistState();
    return true;
  }

  private refreshQuestHud(): void {
    if (!this.hud) return;
    const quest = findQuestById(this.region.quests, this.activeQuestId);
    if (!quest) {
      this.hud.setQuest('探索目标已完成', '继续探索，或前往主线目标。');
      return;
    }
    this.hud.setQuest(`◆ ${quest.title}`, quest.description);
  }

  private openStory(sceneId: string): void {
    this.persistState();
    if (this.options.onStoryScene) {
      this.options.onStoryScene(sceneId);
      return;
    }
    openStoryScene(sceneId);
  }
}
