import { appendWorldEvent } from './EventLedger';
import type { WorldEvent, WorldEventDraft } from './WorldEvent';

export type WorldEventListener = (event: WorldEvent) => void;

export class WorldEventBus {
  private listeners = new Map<string, Set<WorldEventListener>>();

  subscribe(type: string, listener: WorldEventListener): () => void {
    const bucket = this.listeners.get(type) ?? new Set<WorldEventListener>();
    bucket.add(listener);
    this.listeners.set(type, bucket);

    return () => {
      bucket.delete(listener);
      if (bucket.size === 0) this.listeners.delete(type);
    };
  }

  emit<TPayload>(draft: WorldEventDraft<TPayload>): WorldEvent<TPayload> {
    const event = appendWorldEvent(draft);
    this.notify(event);
    return event;
  }

  notify(event: WorldEvent): void {
    for (const listener of this.listeners.get(event.type) ?? []) listener(event);
    for (const listener of this.listeners.get('*') ?? []) listener(event);
  }

  clear(): void {
    this.listeners.clear();
  }
}
