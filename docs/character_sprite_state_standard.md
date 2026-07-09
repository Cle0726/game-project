# Character Sprite State Standard

This project is a visual-novel/story RPG. Character sprites are not decorative assets; they are the main emotional interface for the story. Important recurring characters must have a stable six-state sprite set.

## Required Six States

Every important recurring character must provide these six states:

- `default`: neutral readable pose for normal dialogue
- `smile`: trust, relief, warmth, teasing, or brief ease
- `worried`: fear, guilt, concern, pain, or vulnerability
- `serious`: anger, resolve, judgment, enforcement, or battle focus
- `shocked`: surprise, emotional rupture, revelation, or near-death realization
- `special`: transformation, resonance, job mode, battle mode, or chapter-specific highlight

These state names are permanent API keys for the game. Do not invent one-off names such as `sad2`, `angryFinal`, or `battleNew` for important characters. If a scene needs a special alias, map it back to one of the six states in `game.js`.

## Important Character Rule

A character is important and must have six states if any of these are true:

- They are playable, a Musicart, a boss, or a long-term companion.
- They appear across multiple chapters.
- They have relationship values, trust/resonance/pressure values, affection values, or route impact.
- They carry a major emotional line, mystery line, faction line, or ending branch.
- They are used as a recurring speaker in map events, tea breaks, hearings, battles, or chapter hubs.

Minor NPCs may use one default sprite, but once they become recurring or route-relevant, they must be promoted to the six-state standard.

## Current Completed Important Characters

The current guarded set is:

- `atya` / 阿缇娅
- `milo` / 弥洛
- `anning` / 安柠
- `tiya` / 缇雅
- `ningsu` / 宁溯
- `shen_zhiwei` / 沈知微
- `juheng` / 珏衡

## Asset Locations

- Mother sheets: `assets/generated/character_states/sheets/`
- Cropped sprites: `assets/generated/character_states/sprites/`
- Manifest: `assets/generated/character_states/character_state_manifest_v02.json`
- Runtime wiring: `game.js` under `ASSETS.characters`

## Mother Sheet Rule

Use one six-panel mother sheet per important character whenever possible. The mother sheet exists only to preserve consistency across generated variants.

The in-game sprite must be a cropped single-state sprite. Do not use the whole mother sheet as an in-game sprite.

All six states must keep:

- same face shape
- same eye design
- same hairstyle
- same body proportions
- same outfit silhouette
- same signature accessories
- same character-specific color language

Only these may change between states:

- expression
- hand pose
- emotional posture
- small prop usage
- state-specific visual effects for `special`

## Visual Quality Rules

Character sprites must be generated on a flat chroma-key or clean removable background, then cropped into single-character sprites.

Avoid:

- dark ruin backgrounds behind character sprites
- visible panel borders
- white-page leftovers from concept sheets
- half-cut feet, hair, weapons, or hands
- multiple characters in one sprite
- changing the face, outfit, or silhouette between states
- using a mother sheet directly in dialogue UI
- adding text, logos, labels, or watermarks into the sprite image

## Runtime Rule

Dialogue should select sprite states through the existing `sprite` field:

```js
{ speaker: "阿缇娅", sprite: "worried", text: "..." }
```

If no `sprite` is specified, the game uses `default`.

Aliases such as `daily`, `transformed`, `battle`, `medic`, or `ally` are allowed only when they map back to one of the six standard states.

## Guard Command

Run this before finishing any chapter or adding a major character:

```bash
npm run character:guard
```

The guard verifies:

- every guarded important character exists in the manifest
- every guarded character has exactly the six required states
- every state file exists on disk
- every state file is wired in `game.js`

When adding a new important recurring character, update all three places together:

- `assets/generated/character_states/character_state_manifest_v02.json`
- `game.js`
- `scripts/assert-character-state-sprites.mjs`

Then run:

```bash
npm run character:guard
npm run portrait:build
```
