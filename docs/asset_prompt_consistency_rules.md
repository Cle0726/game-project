# Asset Prompt Consistency Rules

Use this rule set whenever a game background, character, scene, prop, world map, region map, thumbnail, enemy, UI illustration, or event CG has no existing prompt.

## Required Workflow

1. Read the current setting, region, character, and narrative purpose before writing the prompt.
2. Write a stable subject block first. This block defines what must stay consistent across future style variants.
3. Add style, rendering, lighting, and mood modifiers after the stable subject block.
4. If the asset is a hidden or locked-state variant, append the relevant hidden-state modifier instead of rewriting the whole prompt.
5. Save the prompt in the appropriate prompt document before generating or importing the image.

## Stable Subject Block

Every prompt should preserve these target elements:

- Asset id and intended file name.
- Subject name and asset role.
- Viewpoint or camera angle.
- Core silhouette and major shapes.
- Required motifs from the setting.
- Primary palette role, not just exact colors.
- Materials and surface language.
- What the image must communicate narratively.
- Negative constraints that prevent style drift.

## Prompt Template

```text
[asset role], [stable subject name], [viewpoint/camera],
[core silhouette and major shapes],
[setting-specific motifs],
[materials and surface language],
[primary palette role],
[narrative purpose],
[style/rendering modifiers],
[lighting and mood],
[negative constraints]
```

## Maintenance Principle

Do not create a new prompt by only describing a mood. The target element must remain identifiable after future style changes. For example, "灰弦长廊" must remain a ruined colonnade corridor with broken marble pillars and sheet music motifs even if its style changes from manuscript map to battle background or event CG.

## Protagonist Face And Outfit Lock

For all protagonist images, use the project reference masters before writing prompts:

- Male protagonist / 凛澈: `assets/references/protagonists/ref_rinche_face_outfit_lock_v01.png`
- Female protagonist / 凛纱: `assets/references/protagonists/ref_rinsa_face_outfit_lock_v01.png`

Prompts must explicitly preserve the reference face, hairstyle, outfit, bandaged right wrist, music repair props, and pre-contract no-baton rule. Do not rely on vague tags such as "black hair, golden eyes" alone.

Negative constraints must include: different face, different hairstyle, different outfit, long coat, cape, luxury conductor uniform, military epaulettes, formal tuxedo, idol costume, cyberpunk armor, weapon, gun, sword, baton before transformation.
