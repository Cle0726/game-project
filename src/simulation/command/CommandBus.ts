import type { WorldEventDraft } from '../events/WorldEvent';
import { WorldEventBus } from '../events/WorldEventBus';
import {
  createGameCommand,
  type GameCommand,
  type GameCommandDraft,
} from './GameCommand';
import { CommandValidator } from './CommandValidator';

export type CommandHandler = (
  command: GameCommand,
) => void | WorldEventDraft | WorldEventDraft[];

export interface CommandDispatchResult {
  accepted: boolean;
  command: GameCommand;
  reason?: string;
}

export class CommandBus {
  private sequence = 0;
  private handlers = new Map<string, CommandHandler>();

  constructor(
    readonly validator = new CommandValidator(),
    readonly events = new WorldEventBus(),
  ) {}

  register(type: string, handler: CommandHandler): () => void {
    this.handlers.set(type, handler);
    return () => {
      if (this.handlers.get(type) === handler) this.handlers.delete(type);
    };
  }

  dispatch<TPayload>(draft: GameCommandDraft<TPayload>): CommandDispatchResult {
    const command = createGameCommand(++this.sequence, draft);
    const validation = this.validator.validate(command);
    if (!validation.accepted) {
      return { accepted: false, command, reason: validation.reason };
    }

    const handler = this.handlers.get(command.type);
    if (!handler) {
      return { accepted: false, command, reason: 'unhandled_command' };
    }

    const result = handler(command);
    const eventDrafts = Array.isArray(result) ? result : result ? [result] : [];
    for (const event of eventDrafts) this.events.emit(event);

    return { accepted: true, command };
  }

  clear(): void {
    this.handlers.clear();
    this.events.clear();
  }
}
