export interface WorldRegion {
  id: string;
  name: string;
  subtitle?: string;
  musicEmotion: string;
  colorTheme: WorldRegionColorTheme;
  thumbnailSrc: string;
  fullMapSrc: string;
  unlockCondition: UnlockCondition;
  isHidden: boolean;
  narrativeHook?: string;
  locationNodes: LocationNode[];
}

export interface WorldRegionColorTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface LocationNode {
  id: string;
  name: string;
  positionPercent: {
    x: number;
    y: number;
  };
  nodeType: LocationNodeType;
  isCompleted: boolean;
  isRevisitable: boolean;
  sublevels?: LocationNode[];
}

export type LocationNodeType =
  | 'story'
  | 'tuning_platform'
  | 'event_pool'
  | 'sublevel_entry';

export type UnlockCondition =
  | { type: 'always' }
  | { type: 'chapter_progress'; minChapter: number }
  | { type: 'event_triggered'; eventId: string }
  | { type: 'trust'; characterId: string; minValue: number }
  | { type: 'resonance'; characterId: string; minValue: number };
