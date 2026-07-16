export type BattlePhase = 'entering' | 'active' | 'resolving' | 'leaving';

export type BattleSide = 'ally' | 'enemy';

export type BattleEnemyVisualState = 'idle' | 'hit' | 'defeated';

export type BattleMoodCue = 'dissonance' | 'highDamage';

export interface BattleCombatantVisual {
  id: string;
  name: string;
  side: BattleSide;
  imageSrc: string;
  role?: string;
  stance?: 'lead' | 'support' | 'heavy' | 'swarm';
  hpPercent?: number;
}

export interface BattleAction {
  id: string;
  gameActionKey?: string;
  label: string;
  detail: string;
  iconLabel: string;
  disabled?: boolean;
  danger?: boolean;
  ultimate?: boolean;
  actionPointCost?: number;
  healthCost?: number;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  tone?: 'normal' | 'cost' | 'warning' | 'result' | 'round';
}

export interface BattleViewState {
  id: string;
  title: string;
  enemyStatus: string;
  battlefieldImage?: string;
  battlefieldTone?: 'theater' | 'street' | 'ruins' | 'void';
  phase: BattlePhase;
  progressLabel: string;
  progressPercent: number;
  combatants: BattleCombatantVisual[];
  log: BattleLogEntry[];
  actions: BattleAction[];
}

export interface BattleMusicartState {
  id: string;
  name: string;
  characterId: string;
  fallbackImageSrc?: string;
  role: string;
  hpPercent?: number;
  moodCue?: BattleMoodCue;
  moodCueId?: string;
}

export interface BattleEnemyState {
  id: string;
  name: string;
  statusText: string;
  intentText: string;
  hpPercent: number;
  imageSrc: string;
  visualState: BattleEnemyVisualState;
}

export interface BattleResourceBars {
  objectiveLabel: string;
  objectivePercent: number;
  conductorHealthPercent: number;
}

export interface BattleScreenState {
  id: string;
  phase: BattlePhase;
  variant?: 'standard' | 'skirmish' | 'boss' | 'finale';
  enemy: BattleEnemyState;
  resources: BattleResourceBars;
  musicarts: [BattleMusicartState, BattleMusicartState] | BattleMusicartState[];
  activeMusicartId: string;
  log: BattleLogEntry[];
  skills: BattleAction[];
}

export interface BattleScreenProps {
  gamePhase?: string;
  state: BattleScreenState;
  onSelectMusicart?: (musicartId: string) => void;
  onSkill: (skillId: string) => void;
}

export interface BattleViewProps {
  state: BattleViewState;
  onAction: (actionId: string) => void;
}
