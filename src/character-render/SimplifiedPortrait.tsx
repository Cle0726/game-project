import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  applyNeutralIdleAnimation,
  calcPortraitDisplayHeight,
  createPortraitRuntime,
  disposePortraitRuntime,
  setPortraitTalking,
  type PortraitRuntime,
} from './portraitAnimation';
import type { PortraitHandle, SimplifiedPortraitProps } from './portraitAnimationTypes';

const DEFAULT_WIDTH = 300;

/** 主线对话框头像简化版：仅呼吸 + 眨眼 + 口型，不响应 mood */
export const SimplifiedPortrait = forwardRef<PortraitHandle, SimplifiedPortraitProps>(
  function SimplifiedPortrait({ characterId, width = DEFAULT_WIDTH }, ref) {
    const mountRef = useRef<HTMLDivElement>(null);
    const runtimeRef = useRef<PortraitRuntime | null>(null);
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
        applyNeutralIdleAnimation(runtime);
      })();

      return () => {
        cancelled = true;
        if (runtimeRef.current) {
          disposePortraitRuntime(runtimeRef.current);
          runtimeRef.current = null;
        }
      };
    }, [characterId, width]);

    return (
      <div
        ref={mountRef}
        className="simplified-portrait"
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

SimplifiedPortrait.displayName = 'SimplifiedPortrait';
