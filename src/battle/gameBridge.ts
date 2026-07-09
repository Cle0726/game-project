declare global {
  interface Window {
    handleBattleAction?: (actionKey: string) => void;
    handleUltimateAction?: (musicartName: string) => void;
  }
}

export function dispatchBattleSkillToGame(actionKey: string): void {
  if (actionKey.startsWith('ultimate:') && typeof window.handleUltimateAction === 'function') {
    window.handleUltimateAction(actionKey.slice('ultimate:'.length));
    return;
  }

  if (typeof window.handleBattleAction === 'function') {
    window.handleBattleAction(actionKey);
    return;
  }

  window.dispatchEvent(new CustomEvent('battle:skill', { detail: { actionKey } }));
}
