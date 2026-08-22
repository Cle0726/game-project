export type WorldEventSource = 'player' | 'story' | 'agent' | 'world' | 'system';

export interface WorldEvent<TPayload = unknown> {
  id: string;
  sequence: number;
  type: string;
  source: WorldEventSource;
  gameTime: number;
  regionId?: string;
  actorIds: string[];
  targetIds: string[];
  importance: number;
  tags: string[];
  payload: TPayload;
}

export type WorldEventDraft<TPayload = unknown> = Omit<
  WorldEvent<TPayload>,
  'id' | 'sequence'
>;

export function createWorldEvent<TPayload>(
  sequence: number,
  draft: WorldEventDraft<TPayload>,
): WorldEvent<TPayload> {
  return {
    ...draft,
    id: `evt_${sequence}`,
    sequence,
    actorIds: [...draft.actorIds],
    targetIds: [...draft.targetIds],
    tags: [...draft.tags],
  };
}
