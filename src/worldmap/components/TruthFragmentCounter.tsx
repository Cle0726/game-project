import type { GameStateLike } from '../worldMapBridge';
import { isUnlockConditionMet } from '../worldMapBridge';
import type { WorldRegion } from '../worldMapTypes';

export interface TruthFragmentCounterProps {
  regions: WorldRegion[];
  gameState?: GameStateLike;
  total?: number;
}

const DEFAULT_TOTAL_TRUTH_FRAGMENTS = 7;

function isTruthFragmentRegion(region: WorldRegion): boolean {
  return region.id === 'ashen_corridor' || region.id.startsWith('truth_fragment_');
}

export function TruthFragmentCounter({
  regions,
  gameState,
  total = DEFAULT_TOTAL_TRUTH_FRAGMENTS
}: TruthFragmentCounterProps) {
  const unlockedCount = regions.filter(
    (region) => isTruthFragmentRegion(region) && isUnlockConditionMet(region.unlockCondition, gameState)
  ).length;

  return (
    <aside className="truth-fragment-counter" aria-label="七分之一真相进度">
      <span className="truth-fragment-counter__label">真相碎片</span>
      <strong>
        {unlockedCount}/{total}
      </strong>
    </aside>
  );
}
