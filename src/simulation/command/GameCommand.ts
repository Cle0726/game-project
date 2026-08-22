export type GameCommandSource = 'player' | 'story' | 'agent' | 'world';

export interface GameCommand<TPayload = unknown> {
  id: string;
  type: string;
  source: GameCommandSource;
  actorId?: string;
  issuedAt: number;
  payload: TPayload;
}

export interface GameCommandDraft<TPayload = unknown> {
  type: string;
  source: GameCommandSource;
  actorId?: string;
  issuedAt: number;
  payload: TPayload;
}

export interface CommandValidationResult {
  accepted: boolean;
  reason?: string;
}

export function createGameCommand<TPayload>(
  sequence: number,
  draft: GameCommandDraft<TPayload>,
): GameCommand<TPayload> {
  return {
    ...draft,
    id: `cmd_${sequence}`,
  };
}
