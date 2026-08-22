export const WHITE_ACADEMY_PLAZA_ASSETS = {
  // The live branch uses an existing chapter-3 visual so the normal game never falls
  // back to a programmer grid. Replace only this path when the dedicated walkable
  // 白谱院前广场 background asset is committed; exploration code stays unchanged.
  backgroundSrc: '/assets/generated/chapter3/keyvisuals/cg_ch3_white_score_main_v01.png',
  generatedBackgroundTarget: '/assets/generated/exploration/white-academy-plaza/bg_white_academy_plaza_v01.webp',
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
