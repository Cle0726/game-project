# Project Structure Notes

This project currently has two runtime surfaces:

- `index.html` is the legacy/static game shell. It loads `style.css`, `responsive-overrides.css`, `game.js`, VFX scripts, audio, and the embedded React world map bridge.
- `worldmap-test.html` is the standalone Vite test entry for the React world map.

Keep these systems in place:

- `src/worldmap/` contains the React world map implementation.
- `src/worldmap-legacy-main.tsx` mounts the React world map into `index.html` through `#react-worldmap-root`.
- `assets/worldmap/` contains world map images and thumbnails.
- `game.js` owns the legacy game state and calls `openWorldMap()`, `setInterfaceMode("world_map")`, and `renderReactWorldMapScreen()`.
- `index.html` must keep `#world-map-area`, `#react-worldmap-root`, `#entry-worldmap-button`, `#entry-worldmap-top-button`, and `#quick-worldmap-button`.

CSS layout is now split as:

- `style.css`: base legacy UI, VFX styles, world map shell styles, and older component styles.
- `responsive-overrides.css`: final cascade layer for responsive layout and readability fixes. It is intentionally loaded after `style.css`.

Root scripts:

- `apply_hooks.js`, `update_style.js`, and `append_advanced_styles.js` are still kept at root because comments in source files reference them as historical maintenance scripts.
- One-off patch scripts that are not referenced by the runtime were moved to `scripts/legacy-patches/`.

Do not delete these generated/build folders without checking the current workflow:

- `dist/` is the Vite build output.
- `tmp/` contains screenshots and browser profiles from UI verification.
- `test-results/` contains automated visual/test output.

Recommended cleanup order from here:

1. Keep `game.js` behavior stable while extracting data tables into separate files.
2. Move legacy VFX maintenance scripts into a documented tools folder only after removing stale comments.
3. Gradually replace duplicate CSS sections with named layers, verifying desktop and mobile screenshots after each pass.
4. Keep world map files isolated under `src/worldmap/` and bridge only through the existing public functions/events.
