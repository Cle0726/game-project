import type { MovementInput } from './MovementSystem';

const INTERACTION_KEYS = new Set(['e', ' ']);

export class ExplorationInputController {
  readonly pressedKeys = new Set<string>();

  normalizeKey(key: string): string {
    return key.toLowerCase();
  }

  press(key: string): string {
    const normalized = this.normalizeKey(key);
    this.pressedKeys.add(normalized);
    return normalized;
  }

  release(key: string): string {
    const normalized = this.normalizeKey(key);
    this.pressedKeys.delete(normalized);
    return normalized;
  }

  clear(): void {
    this.pressedKeys.clear();
  }

  isInteractionKey(key: string): boolean {
    return INTERACTION_KEYS.has(this.normalizeKey(key));
  }

  isExitKey(key: string): boolean {
    return this.normalizeKey(key) === 'escape';
  }

  movementInput(enabled = true): MovementInput {
    if (!enabled) return { x: 0, y: 0 };

    let x = 0;
    let y = 0;
    if (this.pressedKeys.has('w') || this.pressedKeys.has('arrowup')) y -= 1;
    if (this.pressedKeys.has('s') || this.pressedKeys.has('arrowdown')) y += 1;
    if (this.pressedKeys.has('a') || this.pressedKeys.has('arrowleft')) x -= 1;
    if (this.pressedKeys.has('d') || this.pressedKeys.has('arrowright')) x += 1;
    return { x, y };
  }
}
