# Battle System Boundary

`src/battle/` owns the battle phase component tree.

Rules:

1. Battle phase must not import or render `SceneController`, `DialogueBox`, or `ChoicePanel`.
2. Battle UI may share only design tokens from `src/styles/design-tokens.css`.
3. Battle screens must render their own battlefield background layer through `BattleStage`.
4. Character visuals in battle are full battlefield figures, not dialogue avatars.
5. Narrative-to-battle transition must use `BattleTransitionOverlay` or an equivalent mode-shift animation.

Run `npm run battle:guard` before wiring new battle screens.
