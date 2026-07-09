import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BattleScreen, dispatchBattleSkillToGame, type BattleScreenState } from './battle';

declare global {
  interface Window {
    renderReactBattleScreen?: (state: BattleScreenState) => void;
    clearReactBattleScreen?: () => void;
    __pendingReactBattleState?: BattleScreenState;
  }
}

let root: Root | null = null;

function getBattleRoot(): HTMLElement | null {
  const container = document.getElementById('react-battle-root');
  if (!container) return null;

  if (!root) {
    root = createRoot(container);
  }

  return container;
}

window.renderReactBattleScreen = (state: BattleScreenState) => {
  const container = getBattleRoot();
  if (!container) return;

  container.closest('#battle-area')?.classList.add('has-react-battle');
  root?.render(
    <React.StrictMode>
      <BattleScreen state={state} onSkill={dispatchBattleSkillToGame} />
    </React.StrictMode>,
  );
};

window.clearReactBattleScreen = () => {
  root?.render(null);
  document.getElementById('battle-area')?.classList.remove('has-react-battle');
};

if (window.__pendingReactBattleState) {
  window.renderReactBattleScreen(window.__pendingReactBattleState);
  window.__pendingReactBattleState = undefined;
}
