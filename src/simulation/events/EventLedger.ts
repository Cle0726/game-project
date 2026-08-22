import {
  getOrCreateSimulationStateV1,
  mutateSimulationStateV1,
} from '../state/LegacyGameStateAdapter';
import { createWorldEvent, type WorldEvent, type WorldEventDraft } from './WorldEvent';

export function appendWorldEvent<TPayload>(
  draft: WorldEventDraft<TPayload>,
): WorldEvent<TPayload> {
  let created: WorldEvent<TPayload> | undefined;

  mutateSimulationStateV1((state) => {
    const sequence = state.eventCursor + 1;
    created = createWorldEvent(sequence, draft);
    state.eventCursor = sequence;
    state.eventLedger.push(created as WorldEvent);
  });

  if (!created) {
    throw new Error('appendWorldEvent(): failed to create event');
  }
  return created;
}

export function getWorldEventLedger(): readonly WorldEvent[] {
  return getOrCreateSimulationStateV1().eventLedger;
}
