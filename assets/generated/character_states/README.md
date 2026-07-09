# Character State Sprites

This folder stores production character state sprites for the visual-novel/story UI.

Important characters must have six reusable states:

- `default`
- `smile`
- `worried`
- `serious`
- `shocked`
- `special`

Current guarded characters:

- `atya` / 阿缇娅
- `milo` / 弥洛
- `anning` / 安柠
- `tiya` / 缇雅
- `ningsu` / 宁溯
- `shen_zhiwei` / 沈知微
- `juheng` / 珏衡

Folder layout:

- `sheets/`: six-panel mother sheets used to preserve character consistency
- `sprites/`: cropped single-state transparent PNG sprites used by the game
- `character_state_manifest_v02.json`: machine-readable state manifest

Important:

- Mother sheets are references only. Do not use a whole mother sheet as an in-game sprite.
- In-game dialogue must use cropped single-state sprites from `sprites/`.
- Keep face, hairstyle, body proportions, outfit silhouette, and signature accessories consistent across all six states.
- Do not use dark ruin-like backgrounds, panel borders, text, labels, or watermarks in character sprites.

Project-wide rules:

- `docs/character_sprite_state_standard.md`
- `AGENTS.md`

Validation:

```bash
npm run character:guard
```
