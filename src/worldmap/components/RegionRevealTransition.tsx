import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { WorldRegion } from '../worldMapTypes';

export interface RegionRevealTransitionProps {
  region: WorldRegion;
  isActive: boolean;
  onComplete?: (regionId: string) => void;
}

const REVEAL_DURATION_MS = 2500;
const PARTICLE_COUNT = 18;

export function RegionRevealTransition({
  region,
  isActive,
  onComplete
}: RegionRevealTransitionProps) {
  useEffect(() => {
    if (!isActive) return undefined;

    const timeoutId = window.setTimeout(() => {
      onComplete?.(region.id);
    }, REVEAL_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isActive, onComplete, region.id]);

  if (!isActive) return null;

  return (
    <span
      className="region-reveal"
      aria-live="polite"
      style={
        {
          '--region-primary': region.colorTheme.primary,
          '--region-secondary': region.colorTheme.secondary,
          '--region-accent': region.colorTheme.accent
        } as CSSProperties
      }
    >
      <svg className="region-reveal__outline" viewBox="0 0 100 100" aria-hidden="true">
        <path
          pathLength={1}
          d="M50 6 C72 8 91 25 94 47 C97 69 77 90 52 94 C27 98 7 80 6 54 C5 29 25 9 50 6 Z"
        />
      </svg>

      <span className="region-reveal__sweep" aria-hidden="true" />
      <span className="region-reveal__message">〔新的乐章之地已经响起〕</span>

      <span className="region-reveal__particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
          <span
            key={index}
            className="region-reveal__particle"
            style={
              {
                '--particle-angle': `${(360 / PARTICLE_COUNT) * index}deg`,
                '--particle-distance': `${34 + (index % 4) * 9}px`,
                '--particle-delay': `${0.78 + (index % 6) * 0.035}s`
              } as CSSProperties
            }
          />
        ))}
      </span>
    </span>
  );
}
