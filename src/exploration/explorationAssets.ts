export const WHITE_ACADEMY_PLAZA_ASSETS = {
  backgroundSrc: '/assets/generated/exploration/white-academy-plaza/bg_white_academy_plaza_v01.webp',
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
