export const WHITE_ACADEMY_PLAZA_ASSETS = {
  // Live-game fallback that already exists in the repository. The dedicated walkable
  // plaza painting can replace this path later without changing exploration logic.
  backgroundSrc: '/assets/generated/chapter3/keyvisuals/cg_ch3_white_score_main_v01.png',
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
