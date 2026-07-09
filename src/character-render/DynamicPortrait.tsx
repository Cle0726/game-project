import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  applyMoodAnimation,
  calcPortraitDisplayHeight,
  createPortraitRuntime,
  disposePortraitRuntime,
  setPortraitTalking,
  type PortraitRuntime,
} from './portraitAnimation';
import type { DynamicPortraitProps, PortraitHandle } from './portraitAnimationTypes';

const DEFAULT_WIDTH = 300;

/**
 * 分层立绘动态组件（完整 mood 响应）
 *
 * 图层规格：所有 PNG 均为统一画布（1200×1600），代码侧 (0,0) 叠放。
 */
export const DynamicPortrait = forwardRef<PortraitHandle, DynamicPortraitProps>(
  function DynamicPortrait(
    { characterId, currentMood, width = DEFAULT_WIDTH, battleStance = false, className },
    ref,
  ) {
    const mountRef = useRef<HTMLDivElement>(null);
    const runtimeRef = useRef<PortraitRuntime | null>(null);
    const moodRef = useRef(currentMood);
    const displayHeight = calcPortraitDisplayHeight(width);

    useImperativeHandle(ref, () => ({
      setTalking(isTalking: boolean) {
        const runtime = runtimeRef.current;
        if (runtime) {
          setPortraitTalking(runtime, isTalking);
        }
      },
    }));

    useEffect(() => {
      const mountEl = mountRef.current;
      if (!mountEl) return;

      let cancelled = false;

      void (async () => {
        const runtime = await createPortraitRuntime(characterId, width, mountEl);
        if (cancelled) {
          disposePortraitRuntime(runtime);
          return;
        }

        runtimeRef.current = runtime;
        applyMoodAnimation(runtime, moodRef.current);
      })();

      return () => {
        cancelled = true;
        if (runtimeRef.current) {
          disposePortraitRuntime(runtimeRef.current);
          runtimeRef.current = null;
        }
      };
    }, [characterId, width]);

    useEffect(() => {
      moodRef.current = currentMood;
      const runtime = runtimeRef.current;
      if (runtime) {
        applyMoodAnimation(runtime, currentMood);
      }
    }, [currentMood]);

    return (
      <div
        ref={mountRef}
        className={[
          'dynamic-portrait',
          battleStance ? 'dynamic-portrait--battle-stance' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-battle-stance={battleStance ? 'true' : undefined}
        style={{
          width,
          height: displayHeight,
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-hidden
      />
    );
  },
);

DynamicPortrait.displayName = 'DynamicPortrait';
