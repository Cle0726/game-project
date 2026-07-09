import { StaticPortraitStack } from '../character-render/StaticPortraitStack';
import { HUAIXU_PORTRAIT } from '../character-render/portraitData';

/**
 * 第一阶段验收页：静态叠层是否正确对齐。
 * 启动：npm run portrait:test
 */
export function PortraitStackTestPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px',
        background: '#12121a',
        color: '#e8e4dc',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 600 }}>
        静态立绘叠层测试 · 槐序
      </h1>
      <p style={{ margin: '0 0 24px', opacity: 0.65, fontSize: '0.875rem' }}>
        验收标准：与 PS 完整立绘一致，无错位、无露白。资源路径：
        <code style={{ marginLeft: 6 }}>/assets/characters/huaixu/</code>
      </p>

      <div
        style={{
          display: 'inline-block',
          padding: '16px',
          background: '#1e1e2a',
          borderRadius: '8px',
          border: '1px solid #2a2a3a',
        }}
      >
        <StaticPortraitStack layerSet={HUAIXU_PORTRAIT} width={360} />
      </div>

      <p style={{ marginTop: '24px', opacity: 0.5, fontSize: '0.75rem' }}>
        画布 {HUAIXU_PORTRAIT.canvasWidth}×{HUAIXU_PORTRAIT.canvasHeight} · 显示宽度 360px
      </p>
    </div>
  );
}
