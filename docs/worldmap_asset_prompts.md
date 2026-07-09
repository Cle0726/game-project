# World Map Asset Prompts

Use these prompts for the world map system assets. Keep the base region prompt stable, then append the hidden-region modifier only when rendering a concealed or not-yet-unlocked variant.

## Maintenance Rule

When a future background, character, scene, region thumbnail, or full map asset has no prompt yet, write a new prompt from the established setting before generating art. Keep target elements consistent and reusable: stable subject name, viewpoint, core silhouette, palette role, material motifs, and readable identifiers should remain the same across style variants. Add style modifiers after the stable subject block instead of rewriting the subject from scratch.

## Echo Citadel

Target file name:

`map_echo_citadel_illuminated_manuscript_v01.png`

Prompt:

```text
antique illuminated manuscript map, aged ivory parchment texture,
gold leaf cartography, ornate opera house architecture illustrated
in bird's-eye perspective, staircase-tiered white marble city,
golden spire at center, musical staff lines as decorative border,
elegant hand-drawn map style, warm gold and ivory tones, no modern
elements, fantasy cartography illustration
```

## Ashen Corridor

Target file name:

`map_ashen_corridor_manuscript_v01.png`

Prompt:

```text
antique manuscript map, weathered parchment, faded dusty gold tones,
illustrated ruined colonnade corridor stretching across the map,
broken marble pillars, scattered sheet music motifs as decoration,
melancholic elegant cartography, bird's-eye perspective, aged paper
texture with subtle tears at edges, fantasy map illustration
```

## Hidden Region Modifier

Append this to any region prompt when generating its hidden, known-but-locked, or concealed-state version.

Target suffix:

`_hidden_sepia_v01.png`

Prompt addendum:

```text
desaturated sepia tones, heavily faded and obscured, mysterious
veiled atmosphere, low saturation muted grayscale-brown palette,
suggesting forgotten or hidden place
```

## World Map Overview Background

Target file name:

`map_world_overview_atlas_cover_v01.png`

Prompt:

```text
grand antique atlas cover page, dark aged leather and parchment
texture, ornate gold filigree border, musical staff lines woven
into decorative border pattern, mysterious and elegant, opera
house cartography collection, cinematic atmospheric lighting
```
