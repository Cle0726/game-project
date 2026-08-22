import type { CommandValidationResult, GameCommand } from './GameCommand';

export type CommandGuard = (command: GameCommand) => CommandValidationResult;

function accepted(): CommandValidationResult {
  return { accepted: true };
}

export class CommandValidator {
  private globalGuards: CommandGuard[] = [];
  private guardsByType = new Map<string, CommandGuard[]>();

  addGlobalGuard(guard: CommandGuard): () => void {
    this.globalGuards.push(guard);
    return () => {
      this.globalGuards = this.globalGuards.filter((item) => item !== guard);
    };
  }

  addGuard(type: string, guard: CommandGuard): () => void {
    const guards = this.guardsByType.get(type) ?? [];
    guards.push(guard);
    this.guardsByType.set(type, guards);
    return () => {
      const next = (this.guardsByType.get(type) ?? []).filter((item) => item !== guard);
      if (next.length) this.guardsByType.set(type, next);
      else this.guardsByType.delete(type);
    };
  }

  validate(command: GameCommand): CommandValidationResult {
    if (!command.type.trim()) return { accepted: false, reason: 'missing_command_type' };
    if (!Number.isFinite(command.issuedAt)) {
      return { accepted: false, reason: 'invalid_issued_at' };
    }
    if (command.type.startsWith('actor.') && !command.actorId) {
      return { accepted: false, reason: 'actor_command_requires_actor_id' };
    }

    for (const guard of this.globalGuards) {
      const result = guard(command);
      if (!result.accepted) return result;
    }
    for (const guard of this.guardsByType.get(command.type) ?? []) {
      const result = guard(command);
      if (!result.accepted) return result;
    }
    return accepted();
  }
}
