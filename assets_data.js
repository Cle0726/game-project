/* ═══════════════════════════════════════════════════════════════════
   文件: assets_data.js
   功能: 旧版游戏入口使用的全局资源引用表。
   说明: 必须在 game.js 之前加载，向 window 暴露 ASSETS。
   ⚠️ 只放静态资源路径；不要在这里添加运行时逻辑。
   ═══════════════════════════════════════════════════════════════════ */

var ASSETS = {
  characters: {
    "玛伦": {
      default: "assets/generated/characters/cutouts/char_maren_story_base_v01_cutout_v03.png"
    },
    "祁恩": {
      default: "assets/generated/characters/cutouts/char_qien_story_base_v01_cutout_v03.png"
    },
    "槐序": {
      default: "assets/generated/characters/cutouts/char_huaixu_guarded_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_huaixu_guarded_white_gold_v02_cutout_v03.png",
      guarded: "assets/generated/characters/cutouts/char_huaixu_guarded_white_gold_v02_cutout_v03.png",
      sarcastic: "assets/generated/characters/cutouts/char_huaixu_sarcastic_white_gold_v02_cutout_v03.png",
      dissonance: "assets/generated/characters/cutouts/char_huaixu_dissonance_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_huaixu_battle_white_gold_v02_cutout_v03.png"
    },
    "洛温": {
      default: "assets/generated/characters/cutouts/char_luowen_observing_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_luowen_observing_white_gold_v02_cutout_v03.png",
      burdened: "assets/generated/characters/cutouts/char_luowen_burdened_white_gold_v02_cutout_v03.png",
      observing: "assets/generated/characters/cutouts/char_luowen_observing_white_gold_v02_cutout_v03.png",
      guardian: "assets/generated/characters/cutouts/char_luowen_guardian_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_luowen_battle_white_gold_v02_cutout_v03.png"
    },
    "伊芙白": {
      default: "assets/generated/characters/cutouts/char_yifubai_falseCheer_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_yifubai_falseCheer_white_gold_v02_cutout_v03.png",
      tired: "assets/generated/characters/cutouts/char_yifubai_tired_white_gold_v02_cutout_v03.png",
      insight: "assets/generated/characters/cutouts/char_yifubai_insight_white_gold_v02_cutout_v03.png",
      falseCheer: "assets/generated/characters/cutouts/char_yifubai_falseCheer_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_yifubai_battle_white_gold_v02_cutout_v03.png"
    },
    "明弦": {
      default: "assets/generated/characters/cutouts/char_mingxian_default_white_gold_v02_cutout_v03.png",
      archiveFullbody: "assets/generated/characters/cutouts/char_mingxian_default_white_gold_v02_cutout_v03.png",
      challenge: "assets/generated/characters/cutouts/char_mingxian_challenge_white_gold_v02_cutout_v03.png",
      burdened: "assets/generated/characters/cutouts/char_mingxian_burdened_white_gold_v02_cutout_v03.png",
      battle: "assets/generated/characters/cutouts/char_mingxian_battle_white_gold_v02_cutout_v03.png"
    },
    "凛澈": {
      default: "assets/generated/characters/char_protagonist_rinche_male_default_v01.png",
      chapter0PreContract: "assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinche_sprite_pre_contract_v03.png",
      chapter0Mother: "assets/generated/chapter0/characters/char_ch0_protagonist_rinche_pre_contract_mother_v01.png"
    },
    "凛纱": {
      default: "assets/generated/characters/char_protagonist_rinsa_female_default_v01.png",
      chapter0PreContract: "assets/generated/chapter0/sprites/characters/char_ch0_protagonist_rinsa_sprite_pre_contract_v03.png",
      chapter0Mother: "assets/generated/chapter0/characters/char_ch0_protagonist_rinsa_pre_contract_mother_v01.png",
      preContract: "assets/generated/characters/char_protagonist_rinsa_pre_contract_v01.png",
      batonCatch: "assets/generated/characters/char_protagonist_rinsa_baton_catch_v01.png",
      battleConductor: "assets/generated/characters/char_protagonist_rinsa_battle_conductor_v01.png"
    },
    "缇雅": {
      default: "assets/generated/character_states/sprites/char_tiya_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_tiya_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_tiya_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_tiya_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_tiya_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_tiya_sprite_special_v02.png",
      farewell: "assets/generated/character_states/sprites/char_tiya_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter0/sprites/characters/char_ch0_tiya_sprite_default_ai_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_tiya_human_mother_v01.png"
    },
    "阿缇娅": {
      default: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_atya_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_atya_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_atya_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_atya_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_atya_sprite_special_v02.png",
      daily: "assets/generated/chapter1/sprites/characters/char_ch1_atya_daily_sprite_default_v01.png",
      transformed: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      battle: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      legacyDaily: "assets/generated/chapter1/sprites/characters/char_ch1_atya_daily_sprite_default_v01.png",
      legacyTransformed: "assets/generated/chapter0/sprites/characters/char_ch0_atya_sprite_transformed_ai_v01.png",
      eyeCloseup: "assets/generated/chapter0/characters/char_ch0_atya_eye_transformation_closeup_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_atya_musicart_mother_v01.png"
    },
    "弥洛": {
      default: "assets/generated/character_states/sprites/char_milo_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_milo_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_milo_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_milo_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_milo_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_milo_sprite_special_v02.png",
      battle: "assets/generated/character_states/sprites/char_milo_sprite_default_v04.png",
      legacyDefault: "assets/generated/chapter0/sprites/characters/char_ch0_milo_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_milo_low_hum_knight_mother_v01.png"
    },
    "安柠": {
      default: "assets/generated/character_states/sprites/char_anning_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_anning_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_anning_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_anning_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_anning_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_anning_sprite_special_v02.png",
      medic: "assets/generated/character_states/sprites/char_anning_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter0/sprites/characters/char_ch0_anning_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_anning_mechanic_mother_v01.png"
    },
    "诺伊": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_noi_echo_boy_mother_v01.png"
    },
    "卡戎": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_charon_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_charon_beatbreaker_mother_v01.png"
    },
    "瑟萝弥": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_serolomy_sprite_default_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_serolomy_black_mass_mother_v01.png"
    },
    "乌鸦先生": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_mr_crow_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_mr_crow_record_owner_mother_v01.png"
    },
    "米拉奶奶": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_grandma_mira_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_grandma_mira_ticket_seller_mother_v01.png"
    },
    "奥托": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_otto_sprite_default_v01.png"
    },
    "霍尔特": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_holt_sprite_default_v01.png"
    },
    "伊莱娜": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_elena_sprite_default_v01.png"
    },
    "琳": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_lin_sprite_default_v01.png"
    },
    "铃": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_ling_sprite_default_v01.png"
    },
    "白栖": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_baiqi_sprite_default_ai_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_baiqi_silence_patrol_mother_v01.png"
    },
    "母亲": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_mother_sprite_default_v02.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_mother_piano_tuner_mother_v01.png"
    },
    "母亲的残响": {
      default: "assets/generated/chapter2/sprites/characters/char_ch2_mother_echo_sprite_default_v01.png"
    },
    "宁溯": {
      default: "assets/generated/character_states/sprites/char_ningsu_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_ningsu_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_ningsu_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_ningsu_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_ningsu_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_ningsu_sprite_special_v02.png",
      battle: "assets/generated/character_states/sprites/char_ningsu_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter2/sprites/characters/char_ch2_ningsu_sprite_default_v01.png",
      legacyBattle: "assets/generated/chapter2/sprites/characters/char_ch2_ningsu_sprite_battle_v01.png"
    },
    "看塔仪": {
      default: "assets/generated/chapter2/sprites/characters/char_ch2_tower_orb_sprite_default_v01.png"
    },
    "沈知微": {
      default: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_special_v02.png",
      ally: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter3/sprites/characters/char_ch3_shen_zhiwei_sprite_default_v02.png"
    },
    "珏衡": {
      default: "assets/generated/character_states/sprites/char_juheng_sprite_default_v02.png",
      smile: "assets/generated/character_states/sprites/char_juheng_sprite_smile_v02.png",
      worried: "assets/generated/character_states/sprites/char_juheng_sprite_worried_v02.png",
      serious: "assets/generated/character_states/sprites/char_juheng_sprite_serious_v02.png",
      shocked: "assets/generated/character_states/sprites/char_juheng_sprite_shocked_v02.png",
      special: "assets/generated/character_states/sprites/char_juheng_sprite_special_v02.png",
      battle: "assets/generated/character_states/sprites/char_juheng_sprite_special_v02.png",
      legacyDefault: "assets/generated/chapter3/sprites/characters/char_ch3_juheng_sprite_default_v02.png",
      legacyBattle: "assets/generated/chapter3/sprites/characters/char_ch3_juheng_sprite_battle_v02.png"
    },
    "温别克": {
      default: "assets/generated/chapter3/sprites/characters/char_ch3_wenbeck_sprite_default_v02.png"
    },
    "柏舟": {
      default: "assets/generated/chapter3/sprites/characters/char_ch3_baizhou_sprite_default_v02.png"
    },
    "尤娜": {
      default: "assets/generated/chapter1/sprites/characters/char_ch1_yuna_sprite_default_v01.png",
      sequence07: "assets/generated/chapter1/sprites/characters/char_ch1_yuna_sequence07_sprite_default_v01.png"
    },
    "零四": {
      default: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_default_v01.png",
      smile: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_smile_v01.png",
      worried: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_worried_v01.png",
      serious: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_serious_v01.png",
      shocked: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_shocked_v01.png",
      special: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_special_v01.png",
      sourceMother: "assets/generated/chapter1/sprites/enemies/enemy_ch1_silent_sequence_04_sprite_default_v01.png"
    },
    "钟先生": {
      default: "assets/generated/chapter1/sprites/characters/char_ch1_zhong_sprite_default_v01.png"
    },
    "柯婆婆": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_grandma_mira_sprite_default_v02.png"
    },
    "老潘": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_otto_sprite_default_v01.png"
    },
    "祁雨": {
      default: "assets/generated/characters/cutouts/char_qiyu_story_base_v01_cutout_v03.png"
    },
    "洛塔": {
      default: "assets/generated/characters/cutouts/char_luota_concept_base_v01_cutout_v03.png"
    }
  },
  backgrounds: {
    prologueSilentStaff: "assets/images/opening_silent_staff_line_v01.png",
    prologueSilentBridge: "assets/images/title_city_silent_bridge_v01.png",
    ch0MianshaTownSquare: "assets/generated/chapter0/backgrounds/bg_ch0_miansha_town_square_piano_v01.png",
    ch0AbandonedTheaterStage: "assets/generated/chapter0/backgrounds/bg_ch0_abandoned_theater_stage_v01.png",
    ch0OldDinerShelter: "assets/generated/chapter0/backgrounds/bg_ch0_old_diner_shelter_v01.png",
    ch0RecordShopArchive: "assets/generated/chapter0/backgrounds/bg_ch0_record_shop_archive_v02.png",
    ch0ClocktowerMechanism: "assets/generated/chapter0/backgrounds/bg_ch0_clocktower_mechanism_v01.png",
    ch0AbandonedSchoolMusicRoom: "assets/generated/chapter0/backgrounds/bg_ch0_abandoned_school_music_room_v01.png",
    ch0TheaterBackstageDress: "assets/generated/chapter0/backgrounds/bg_ch0_theater_backstage_dress_v01.png",
    ch0ChildhoodSilentPianoRoom: "assets/generated/chapter0/backgrounds/bg_ch0_childhood_silent_piano_room_v01.png",
    ch0AtyaEyeCloseup: "assets/generated/chapter0/characters/char_ch0_atya_eye_transformation_closeup_v01.png",
    ch0BatonContract: "assets/generated/chapter0/keyvisuals/cg_ch0_baton_contract_v01.png",
    qixianPlaza: "assets/generated/backgrounds/bg_white_score_morning_bell_plaza_v02.png",
    echoCity: "assets/generated/backgrounds/bg_echo_city_white_gold_opera_v02.png",
    teaLounge: "assets/generated/backgrounds/bg_white_score_tea_lounge_v02.png",
    echoCouncil: "assets/generated/backgrounds/bg_echo_council_organ_chamber_v02.png",
    silentCore: "assets/generated/backgrounds/bg_silent_core_tuning_fork_v02.png",
    qixianTuningPlatform: "assets/generated/backgrounds/bg_white_score_tuning_hall_v02.png",
    qixianTuningRoom: "assets/generated/backgrounds/bg_white_score_tuning_hall_v02.png",
    daynightTroupeConvoy: "assets/generated/backgrounds/bg_daynight_touring_troupe_repair_convoy_v01.png",
    qixianLowerStreet: "assets/backgrounds/bg_qixian_lower_street_black_market_v01.png",
    graystringDay: "assets/generated/backgrounds/bg_graystring_gallery_v02.png",
    graystringDusk: "assets/generated/backgrounds/bg_graystring_gallery_v02.png",
    graystringBattle: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    brokenStringStage: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    graystringBossBridge: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    atiyaBatonContract: "assets/generated/backgrounds/cg_atiya_baton_contract_v01.png",
    fogportExterior: "assets/backgrounds/bg_fogport_old_theater_exterior_v01.png",
    fogportStage: "assets/generated/backgrounds/bg_broken_string_night_stage_v02.png",
    ch1MujianRoad: "assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png",
    ch1MujianStationPlatform: "assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png",
    ch1StationInnWarm: "assets/generated/chapter1/backgrounds/bg_ch1_station_inn_warm_v01.png",
    ch1Sequence04Confrontation: "assets/generated/chapter1/keyvisuals/cg_ch1_silent_sequence_04_confrontation_v01.png",
    ch1SeluomiStandoff: "assets/generated/chapter1/keyvisuals/cg_ch1_seluomi_platform_standoff_v01.png",
    ch2SnowfieldApproach: "assets/generated/chapter2/backgrounds/bg_ch2_snowfield_observatory_approach_v01.png",
    ch2ObservatoryExterior: "assets/generated/chapter2/backgrounds/bg_ch2_frost_score_observatory_exterior_v01.png",
    ch2CrystalCorridor: "assets/generated/chapter2/backgrounds/bg_ch2_crystal_resonance_corridor_v01.png",
    ch2ArchiveRoom: "assets/generated/chapter2/backgrounds/bg_ch2_frozen_archive_room_v01.png",
    ch2CoreChamber: "assets/generated/chapter2/backgrounds/bg_ch2_core_recording_chamber_v01.png",
    ch2BossChamber: "assets/generated/chapter2/keyvisuals/cg_ch2_scoreheart_guardian_battle_v01.png",
    ch2MotherEcho: "assets/generated/chapter2/keyvisuals/cg_ch2_mother_echo_manifest_v01.png",
    ch2Farewell: "assets/generated/chapter2/keyvisuals/cg_ch2_tower_farewell_v01.png",
    ch3WhiteScoreGate: "assets/generated/chapter3/keyvisuals/cg_ch3_white_score_main_v01.png",
    ch3ReceptionHall: "assets/generated/chapter3/backgrounds/bg_ch3_reception_hall_v01.png",
    ch3HearingChamber: "assets/generated/chapter3/backgrounds/bg_ch3_hearing_chamber_v01.png",
    ch3ArchiveCorridor: "assets/generated/chapter3/backgrounds/bg_ch3_archive_corridor_v01.png",
    ch3PortraitCorridor: "assets/generated/chapter3/backgrounds/bg_ch3_portrait_corridor_v01.png",
    ch3BossStandoff: "assets/generated/chapter3/keyvisuals/cg_ch3_juheng_boss_standoff_v01.png",
    ch3SecondFileDiscovery: "assets/generated/chapter3/keyvisuals/cg_ch3_second_file_discovery_v01.png",
    ch4MainKey: "assets/generated/chapter4/keyvisuals/cg_ch4_main_key_v01.png",
    ch4NightlessTrainCorridor: "assets/generated/chapter4/backgrounds/bg_ch4_nightless_train_corridor_v01.png",
    ch4AudienceCar: "assets/generated/chapter4/backgrounds/bg_ch4_audience_car_v01.png",
    ch4CoreOrganChamber: "assets/generated/chapter4/backgrounds/bg_ch4_core_organ_chamber_v01.png"
  },
  enemies: {
    soundMothSwarm: "assets/generated/enemies/enemy_sound_moth_swarm_v02.png",
    ch0MuteScoreMoth: "assets/generated/chapter0/sprites/enemies/enemy_ch0_mute_score_moth_sprite_default_v01.png",
    ch0StageCrawler: "assets/generated/chapter0/sprites/enemies/boss_ch0_stage_crawler_sprite_default_v01.png",
    ch0SoundStrippingOfficer: "assets/generated/chapter0/sprites/enemies/boss_ch0_sound_stripping_officer_sprite_default_v01.png",
    ch0BrokenBeatMarionette: "assets/generated/chapter0/sprites/enemies/enemy_ch0_broken_beat_marionette_sprite_default_v01.png",
    ch0SilenceHound: "assets/generated/chapter0/sprites/enemies/enemy_ch0_silence_hound_sprite_default_v01.png",
    ch0VoicelessChoir: "assets/generated/chapter0/sprites/enemies/enemy_ch0_voiceless_choir_sprite_default_v01.png",
    offbeatBeast: "assets/generated/enemies/enemy_broken_beat_puppet_v02.png",
    mirrorVoice: "assets/enemies/enemy_mirror_voice_humanoid_v01.png",
    silenceParasite: "assets/enemies/enemy_silence_parasite_v01.png",
    noBeatBoss: "assets/generated/enemies/boss_beatless_conductor_v02.png",
    ch1SilentSequence04: "assets/generated/chapter1/sprites/enemies/enemy_ch1_silent_sequence_04_sprite_default_v01.png",
    ch1EchoPatrol: "assets/generated/chapter0/sprites/enemies/boss_ch0_sound_stripping_officer_sprite_default_v01.png",
    ch1FogHowler: "assets/generated/chapter0/sprites/enemies/enemy_ch0_silence_hound_sprite_default_v01.png",
    ch2FrozenResidual: "assets/generated/chapter2/sprites/enemies/enemy_ch2_frozen_residual_sprite_default_v01.png",
    ch2TowerGuardian: "assets/generated/chapter2/sprites/enemies/enemy_ch2_tower_guardian_sprite_default_v01.png",
    ch2ScoreheartGuardian: "assets/generated/chapter2/sprites/enemies/boss_ch2_scoreheart_guardian_sprite_default_v01.png",
    ch3HallGuard: "assets/generated/chapter3/sprites/enemies/enemy_ch3_hall_guard_sprite_default_v02.png"
  },
  effects: {
    star: "assets/effects/kenney_star_01.png",
    spark: "assets/effects/kenney_spark_05.png",
    light: "assets/effects/kenney_light_02.png",
    trace: "assets/effects/kenney_trace_04.png"
  },
  icons: {
    cityStability: "assets/icons/icon_var_city_stability_v01.png",
    worldDissonance: "assets/icons/icon_var_world_dissonance_v01.png",
    foodMedicine: "assets/icons/icon_res_food_medicine_v01.png",
    soundCore: "assets/icons/icon_res_sound_core_v01.png",
    huaixuTrust: "assets/icons/icon_char_huaixu_trust_v01.png",
    huaixuPressure: "assets/icons/icon_char_huaixu_pressure_v01.png",
    whiteScoreReputation: "assets/icons/icon_faction_white_score_reputation_v01.png",
    melody: "assets/icons/icon_action_melody_mark_v01.png",
    harmony: "assets/icons/icon_action_harmony_guard_v01.png",
    rhythm: "assets/icons/icon_action_rhythm_delay_v01.png",
    timbre: "assets/icons/icon_action_timbre_rewrite_v01.png",
    silence: "assets/icons/icon_action_silence_seal_v01.png"
  }
};
