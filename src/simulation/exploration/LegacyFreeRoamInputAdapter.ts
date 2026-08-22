import type {
  FreeRoamPrototype,
  FreeRoamPrototypeOptions,
} from '../../exploration/FreeRoamPrototype';
import { ExplorationInputController } from './ExplorationInputController';

interface LegacyFreeRoamInputShape {
  options: FreeRoamPrototypeOptions;
  keys: Set<string>;
  bindInput(): void;
  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp: (event: KeyboardEvent) => void;
  isDialogueActive(): boolean;
  advanceDialogue(): void;
  finishDialogue(triggerComplete: boolean): void;
  interact(): void;
  persistState(): void;
}

/** Transitional bridge that moves keyboard state/semantics out of FreeRoamPrototype. */
export function wireLegacyFreeRoamInput(
  runtime: FreeRoamPrototype,
): ExplorationInputController {
  const legacy = runtime as unknown as LegacyFreeRoamInputShape;
  const input = new ExplorationInputController();
  legacy.keys = input.pressedKeys;

  legacy.onKeyDown = (event: KeyboardEvent) => {
    const key = input.normalizeKey(event.key);

    if (legacy.isDialogueActive()) {
      if (input.isInteractionKey(key) && !event.repeat) {
        event.preventDefault();
        legacy.advanceDialogue();
      } else if (input.isExitKey(key) && !event.repeat) {
        event.preventDefault();
        legacy.finishDialogue(false);
      }
      return;
    }

    input.press(key);

    if (input.isInteractionKey(key) && !event.repeat) {
      event.preventDefault();
      legacy.interact();
      return;
    }

    if (input.isExitKey(key) && !event.repeat && legacy.options.onExit) {
      event.preventDefault();
      legacy.persistState();
      legacy.options.onExit();
    }
  };

  legacy.onKeyUp = (event: KeyboardEvent) => {
    input.release(event.key);
  };

  legacy.bindInput = () => {
    window.addEventListener('keydown', legacy.onKeyDown);
    window.addEventListener('keyup', legacy.onKeyUp);
  };

  return input;
}
