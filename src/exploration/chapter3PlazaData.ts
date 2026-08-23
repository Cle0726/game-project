import type { ExplorationRegionDefinition } from './explorationTypes';
import { PROTOTYPE_REGION } from './regionData';

/**
 * Canon-facing wrapper around the approved White Academy plaza slice.
 *
 * The old prototype originally returned to chapter3_white_start. In the current
 * route, chapter3_white_start must play first so it can present the chapter opening
 * and apply the hearing-state initialization before it advances to ch3_white_000.
 * This wrapper preserves the plaza geometry/content while returning the main door
 * to the exact canonical arrival scene instead of looping back through the chapter
 * entry node.
 */
export const CH3_WHITE_ACADEMY_PLAZA_REGION: ExplorationRegionDefinition = {
  ...PROTOTYPE_REGION,
  id: 'white_academy_plaza_ch3_canon',
  interactionZones: (PROTOTYPE_REGION.interactionZones ?? []).map((zone) =>
    zone.id === 'academy-main-door'
      ? {
          ...zone,
          storySceneId: 'ch3_white_000',
          statusText: '白谱院主阶就在眼前。进入后继续当前第三章抵达剧情。',
        }
      : zone,
  ),
};
