export const WHITE_ACADEMY_PLAZA_ASSETS = {
  // Dedicated walkable plaza background generated for the live exploration slice.
  // The SVG embeds a compressed copy of the approved concept so the current GitHub
  // connector can commit it as UTF-8 text. A full-resolution WebP can replace this
  // path later without changing exploration runtime code.
  backgroundSrc: '/assets/generated/exploration/white-academy-plaza/bg_white_academy_plaza_v01.svg',
  fullResolutionTarget: '/assets/generated/exploration/white-academy-plaza/bg_white_academy_plaza_v01.webp',
  protagonistMaleSrc: '/assets/generated/characters/char_protagonist_rinche_male_default_v01.png',
  protagonistFemaleSrc: '/assets/generated/characters/char_protagonist_rinsa_female_default_v01.png',
  protagonistFallbackSrc: '/assets/generated/characters/char_protagonist_initial_traveler_v01.png',
  atyaSrc: '/assets/generated/character_states/sprites/char_atya_sprite_default_v04.png',
  miloSrc: '/assets/generated/character_states/sprites/char_milo_sprite_default_v04.png',
} as const;

export function resolveProtagonistExplorationSprite(gender: unknown): string {
  if (gender === '男') return WHITE_ACADEMY_PLAZA_ASSETS.protagonistMaleSrc;
  if (gender === '女') return WHITE_ACADEMY_PLAZA_ASSETS.protagonistFemaleSrc;
  return WHITE_ACADEMY_PLAZA_ASSETS.protagonistFallbackSrc;
}
