declare global {
  interface Window {
    openStoryFromExploration?: (sceneId: string) => boolean;
  }
}

export type StoryBridgeResult = 'opened' | 'unavailable';

export function openStoryScene(sceneId: string): StoryBridgeResult {
  window.gamePhase = 'main_story';

  if (typeof window.openStoryFromExploration === 'function') {
    return window.openStoryFromExploration(sceneId) ? 'opened' : 'unavailable';
  }

  if (typeof window.goToScene === 'function') {
    window.goToScene(sceneId);
    return 'opened';
  }

  if (typeof window.showScene === 'function') {
    window.showScene(sceneId);
    return 'opened';
  }

  return 'unavailable';
}
