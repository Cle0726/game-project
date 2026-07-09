# Project Agent Notes

## Character Sprite Rules

This is a visual-novel/story game. Every important recurring character must have six reusable sprite states before the character is considered production-ready:

- `default`
- `smile`
- `worried`
- `serious`
- `shocked`
- `special`

Use one six-panel mother sheet per important character whenever possible, then crop/export the six state sprites from that sheet. The six sprites must keep the same face shape, hairstyle, body proportions, outfit silhouette, and signature accessories. Do not use the mother sheet directly as an in-game standing sprite.

Current important-character guard:

```bash
npm run character:guard
```

The guard checks `assets/generated/character_states/character_state_manifest_v02.json`, confirms every required state file exists, and confirms the state sprites are wired in `game.js`. Update the manifest and guard together when a new important recurring character joins the main cast.

Detailed art and maintenance rules live in `docs/character_sprite_state_standard.md`.

## Gemini Web Video Assets

This project can generate video assets through the user's logged-in Gemini web page.
Use the browser automation script, not the Gemini API:

```bash
npm run video:gemini:login
npm run video:gemini:auto -- --manifest prompts/video/gemini-web-video-jobs.example.json
```

Important:
- The script is `scripts/gemini-web-video-assets.mjs`.
- It reuses the local browser profile at `.browser-profiles/gemini-video`.
- Do not store or request plaintext account passwords. Ask the user to log in once in the opened browser; Chrome keeps the session.
- Generated/downloaded video files go to `assets/generated/videos/gemini_web` by default.
- Edit or create manifest files under `prompts/video/` for batch jobs.
- Full usage guide: `docs/gemini_web_video_workflow.md`.
