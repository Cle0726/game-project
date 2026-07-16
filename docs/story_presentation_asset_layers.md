# Story Presentation Asset Layers

The story UI uses four visual layers. They have different jobs and should not be substituted for one another.

1. `background`: reusable 16:9 environment without recognizable main characters.
2. `stage sprite`: transparent full-body character used for spatial presence and group staging.
3. `dialogue bust`: state-matched upper-body portrait used for the current speaker. Runtime falls back to a crop of the accepted stage sprite, while `ASSETS.dialoguePortraits` can override it with a dedicated portrait later.
4. `cinematic CG`: a scene-specific illustration for an irreversible reveal, contract, farewell, transformation, or route decision. Files under `keyvisuals/cg_*.png` automatically use cinematic presentation.

## Dialogue Bust Rules

- Use the same `default / smile / worried / serious / shocked / special` state key as the dialogue line.
- Preserve face, hair, outfit, eye design, beauty marks, and signature accessories from the accepted identity reference.
- Frame from head to waist or upper thigh. Keep both eyes and the main chest/shoulder costume motif readable.
- A dedicated bust may override the fallback crop, but must not introduce a second interpretation of the character.
- Inner monologue and system narration do not show a bust.

## Cinematic CG Rules

- One emotional action per image; do not turn a CG into a character sheet.
- Bind every recurring character to an identity reference before generation.
- Preserve chapter palette and architecture from `prompts/visual_bible/chapter_style_profiles_v01.json`.
- Keep the lower 22% quieter for dialogue UI unless the scene explicitly uses a full-screen reveal.
- Do not use damaged cutouts, green-fringed sprites, temporary repair outputs, or concept sheets as identity references.

## Runtime Contract

- `scene.backgroundImage` under `/keyvisuals/cg_` automatically activates cinematic mode.
- `scene.presentation: "cinematic"` can force cinematic mode for a differently named image.
- `ASSETS.dialoguePortraits[character][state]` is optional. If absent, the accepted state sprite is cropped at runtime.
- Dialogue data remains unchanged: `{ speaker, sprite, text }` controls both stage sprite and dialogue bust state.

