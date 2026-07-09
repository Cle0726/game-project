# Legacy Patch Scripts

These scripts were moved out of the project root during the 2026-07-03 cleanup.

They appear to be one-off migration or patch helpers and are not referenced by `package.json`, `index.html`, or the current Vite entries.

Kept at project root for now:

- `apply_hooks.js`
- `update_style.js`
- `append_advanced_styles.js`

Those root scripts are still referenced by comments in `game.js`, `style.css`, `vfx.js`, or documentation. Move them only after the source comments and maintenance flow are updated.
