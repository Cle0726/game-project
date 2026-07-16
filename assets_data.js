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
      default: "assets/generated/character_states/sprites/char_tiya_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_tiya_sprite_smile_v04.png",
      worried: "assets/generated/character_states/sprites/char_tiya_sprite_worried_v04.png",
      serious: "assets/generated/character_states/sprites/char_tiya_sprite_serious_v04.png",
      shocked: "assets/generated/character_states/sprites/char_tiya_sprite_shocked_v04.png",
      special: "assets/generated/character_states/sprites/char_tiya_sprite_special_v04.png",
      farewell: "assets/generated/character_states/sprites/char_tiya_sprite_special_v04.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_tiya_human_mother_v01.png"
    },
    "阿缇娅": {
      default: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_atya_sprite_smile_v04.png",
      worried: "assets/generated/character_states/sprites/char_atya_sprite_worried_v04.png",
      serious: "assets/generated/character_states/sprites/char_atya_sprite_serious_v04.png",
      shocked: "assets/generated/character_states/sprites/char_atya_sprite_shocked_v04.png",
      special: "assets/generated/character_states/sprites/char_atya_sprite_special_v04.png",
      daily: "assets/generated/chapter1/sprites/characters/char_ch1_atya_daily_sprite_default_v01.png",
      transformed: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      battle: "assets/generated/character_states/sprites/char_atya_sprite_default_v04.png",
      eyeCloseup: "assets/generated/chapter0/characters/char_ch0_atya_eye_transformation_closeup_v01.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_atya_musicart_mother_v01.png"
    },
    "弥洛": {
      default: "assets/generated/character_states/sprites/char_milo_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_milo_sprite_smile_v04.png",
      worried: "assets/generated/character_states/sprites/char_milo_sprite_worried_v04.png",
      serious: "assets/generated/character_states/sprites/char_milo_sprite_serious_v04.png",
      shocked: "assets/generated/character_states/sprites/char_milo_sprite_shocked_v04.png",
      special: "assets/generated/character_states/sprites/char_milo_sprite_special_v04.png",
      battle: "assets/generated/character_states/sprites/char_milo_sprite_default_v04.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_milo_low_hum_knight_mother_v01.png"
    },
    "安柠": {
      default: "assets/generated/character_states/sprites/char_anning_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_anning_sprite_smile_v04.png",
      worried: "assets/generated/character_states/sprites/char_anning_sprite_worried_v04.png",
      serious: "assets/generated/character_states/sprites/char_anning_sprite_serious_v04.png",
      shocked: "assets/generated/character_states/sprites/char_anning_sprite_shocked_v04.png",
      special: "assets/generated/character_states/sprites/char_anning_sprite_special_v04.png",
      medic: "assets/generated/character_states/sprites/char_anning_sprite_special_v04.png",
      sourceMother: "assets/generated/chapter0/characters/char_ch0_anning_mechanic_mother_v01.png"
    },
    "诺伊": {
      default: "assets/generated/chapter0/sprites/characters/char_ch0_noi_sprite_default_v03.png",
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
      default: "assets/generated/character_states/sprites/char_ningsu_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_ningsu_sprite_smile_v04.png",
      worried: "assets/generated/character_states/sprites/char_ningsu_sprite_worried_v04.png",
      serious: "assets/generated/character_states/sprites/char_ningsu_sprite_serious_v04.png",
      shocked: "assets/generated/character_states/sprites/char_ningsu_sprite_shocked_v04.png",
      special: "assets/generated/character_states/sprites/char_ningsu_sprite_special_v04.png",
      battle: "assets/generated/character_states/sprites/char_ningsu_sprite_special_v04.png",
    },
    "看塔仪": {
      default: "assets/generated/chapter2/sprites/characters/char_ch2_tower_orb_sprite_default_v01.png"
    },
    "沈知微": {
      default: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_smile_v04.png",
      worried: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_worried_v04.png",
      serious: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_serious_v04.png",
      shocked: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_shocked_v04.png",
      special: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_special_v04.png",
      ally: "assets/generated/character_states/sprites/char_shen_zhiwei_sprite_special_v04.png",
    },
    "珏衡": {
      default: "assets/generated/character_states/sprites/char_juheng_sprite_default_v04.png",
      smile: "assets/generated/character_states/sprites/char_juheng_sprite_smile_v04.png",
      worried: "assets/generated/character_states/sprites/char_juheng_sprite_worried_v04.png",
      serious: "assets/generated/character_states/sprites/char_juheng_sprite_serious_v04.png",
      shocked: "assets/generated/character_states/sprites/char_juheng_sprite_shocked_v04.png",
      special: "assets/generated/character_states/sprites/char_juheng_sprite_special_v04.png",
      battle: "assets/generated/character_states/sprites/char_juheng_sprite_special_v04.png",
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
      battle: "assets/generated/chapter4/sprites/characters/char_ch4_sequence04_sprite_special_v01.png",
      sourceMother: "assets/generated/chapter1/sprites/enemies/enemy_ch1_silent_sequence_04_sprite_default_v01.png"
    },
    "零一": {
      default: "assets/generated/chapter5/sprites/enemies/boss_ch5_liuli_zero_one_sprite_default_v01.png",
      battle: "assets/generated/chapter5/sprites/enemies/boss_ch5_liuli_zero_one_sprite_default_v01.png"
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
    ,
    "\u6f84\u829c": {
      default: "assets/generated/chapter6/sprites/characters/char_ch6_chengwu_sprite_default_v01.png",
      smile: "assets/generated/chapter6/sprites/characters/char_ch6_chengwu_sprite_smile_v01.png",
      worried: "assets/generated/chapter6/sprites/characters/char_ch6_chengwu_sprite_worried_v01.png",
      serious: "assets/generated/chapter6/sprites/characters/char_ch6_chengwu_sprite_serious_v01.png",
      shocked: "assets/generated/chapter6/sprites/characters/char_ch6_chengwu_sprite_shocked_v01.png",
      special: "assets/generated/chapter6/sprites/characters/char_ch6_chengwu_sprite_special_v01.png",
      sourceMother: "assets/generated/chapter6/characters/char_ch6_chengwu_mother_v01_source_magenta.png"
    },
    "\u5c7f": {
      default: "assets/generated/chapter6/sprites/characters/char_ch6_yu_sprite_default_v01.png",
      smile: "assets/generated/chapter6/sprites/characters/char_ch6_yu_sprite_smile_v01.png",
      worried: "assets/generated/chapter6/sprites/characters/char_ch6_yu_sprite_worried_v01.png",
      serious: "assets/generated/chapter6/sprites/characters/char_ch6_yu_sprite_serious_v01.png",
      shocked: "assets/generated/chapter6/sprites/characters/char_ch6_yu_sprite_shocked_v01.png",
      special: "assets/generated/chapter6/sprites/characters/char_ch6_yu_sprite_special_v01.png",
      sourceMother: "assets/generated/chapter6/characters/char_ch6_yu_mother_v01_source_green.png"
    },
    "岐": {
      default: "assets/generated/chapter4/sprites/characters/char_ch4_qi_sprite_default_v01.png"
    },
    "岚": {
      default: "assets/generated/chapter4/sprites/characters/char_ch4_lan_sprite_default_v01.png"
    },
    "赤": {
      default: "assets/generated/chapter8/sprites/characters/char_ch8_chi_sprite_default_v01.png"
    },
    "沉月": {
      default: "assets/generated/chapter5/sprites/characters/char_ch5_chenyue_sprite_default_v01.png"
    },
    "小雀": {
      default: "assets/generated/chapter5/sprites/characters/char_ch5_xiaoque_sprite_default_v01.png"
    },
    "卓玛": {
      default: "assets/generated/chapter5/sprites/characters/char_ch5_zhuoma_sprite_default_v01.png"
    },
    "风铃": {
      default: "assets/generated/chapter5/sprites/characters/char_ch5_fengling_sprite_default_v01.png"
    },
    "崔敬": {
      default: "assets/generated/chapter7/sprites/characters/char_ch7_cuijing_sprite_default_v01.png"
    },
    "莫言书": {
      default: "assets/generated/chapter7/sprites/characters/char_ch7_moyanshu_sprite_default_v01.png"
    },
    "玄鸦": {
      default: "assets/generated/chapter9/sprites/characters/char_ch9_xuanyuan_sprite_default_v01.png"
    },
    "玄鸢": {
      default: "assets/generated/chapter9/sprites/characters/char_ch9_xuanyuan_sprite_default_v01.png"
    },
    "安娜": {
      default: "assets/generated/chapter9/sprites/characters/char_ch9_anna_sprite_daily_v01.png",
      daily: "assets/generated/chapter9/sprites/characters/char_ch9_anna_sprite_daily_v01.png",
      herrscher: "assets/generated/chapter9/sprites/characters/char_ch9_anna_sprite_herrscher_v01.png",
      transformed: "assets/generated/chapter9/sprites/characters/char_ch9_anna_sprite_herrscher_v01.png",
      special: "assets/generated/chapter9/sprites/characters/char_ch9_anna_sprite_herrscher_v01.png"
    },
    "辞照": {
      default: "assets/generated/chapter9/sprites/enemies/enemy_ch9_cizhao_sprite_default_v01.png",
      battle: "assets/generated/chapter9/sprites/enemies/enemy_ch9_cizhao_sprite_default_v01.png"
    },
    "破": {
      default: "assets/generated/chapter11/sprites/enemies/boss_ch11_po_sprite_default_v01.png",
      battle: "assets/generated/chapter11/sprites/enemies/boss_ch11_po_sprite_default_v01.png"
    },
    "老雪": {
      default: "assets/generated/chapter11/sprites/characters/char_ch11_laoxue_sprite_default_v01.png"
    },
    "苏婆": {
      default: "assets/generated/chapter11/sprites/characters/char_ch11_supo_sprite_default_v01.png"
    },
    "阿雁": {
      default: "assets/generated/chapter11/sprites/characters/char_ch11_ayan_sprite_default_v01.png"
    },
    "阿霜": {
      default: "assets/generated/chapter11/sprites/characters/char_ch11_ashuang_sprite_default_v01.png"
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
    ch0SilentPianoMemory: "assets/generated/chapter0/keyvisuals/cg_ch0_silent_piano_memory_v01.png",
    ch0HalfPressedSilentKeys: "assets/generated/chapter0/keyvisuals/cg_ch0_half-pressed_silent_keys_v01.png",
    ch0ContractMothSwarm: "assets/generated/chapter0/keyvisuals/cg_ch0_contract_moth_swarm_v01.png",
    ch0MianshaResidentialAlley: "assets/generated/chapter0/backgrounds/bg_ch0_miansha_residential_alley_v01.png",
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
    ch1MujianRoad: "assets/generated/chapter1/backgrounds/bg_ch1_mujian_road_rain_v01.png",
    ch1MujianStationPlatform: "assets/generated/chapter1/backgrounds/bg_ch1_mujian_station_platform_v01.png",
    ch1StationInnWarm: "assets/generated/chapter1/backgrounds/bg_ch1_station_inn_warm_v01.png",
    ch1StationInnDiningDawn: "assets/generated/chapter1/backgrounds/bg_ch1_station_inn_dining_dawn_v01.png",
    ch1DuetCoordination: "assets/generated/chapter1/keyvisuals/cg_ch1_duet_coordination_v01.png",
    ch1BroadcastPendantReveal: "assets/generated/chapter1/keyvisuals/cg_ch1_broadcast_pendant_reveal_v01.png",
    ch1ChoirOvertoneDetection: "assets/generated/chapter1/keyvisuals/cg_ch1_choir_overtone_detection_v01.png",
    ch1Sequence04Confrontation: "assets/generated/chapter1/keyvisuals/cg_ch1_silent_sequence_04_confrontation_v01.png",
    ch1SeluomiStandoff: "assets/generated/chapter1/keyvisuals/cg_ch1_seluomi_platform_standoff_v01.png",
    ch2SnowfieldApproach: "assets/generated/chapter2/backgrounds/bg_ch2_snowfield_observatory_approach_v01.png",
    ch2ObservatoryExterior: "assets/generated/chapter2/backgrounds/bg_ch2_frost_score_observatory_exterior_v01.png",
    ch2CrystalCorridor: "assets/generated/chapter2/backgrounds/bg_ch2_crystal_resonance_corridor_v01.png",
    ch2ArchiveRoom: "assets/generated/chapter2/backgrounds/bg_ch2_frozen_archive_room_v01.png",
    ch2CoreChamber: "assets/generated/chapter2/backgrounds/bg_ch2_core_recording_chamber_v01.png",
    ch2SnowCampNight: "assets/generated/chapter2/backgrounds/bg_ch2_snow_camp_night_v01.png",
    ch2AtyaNamelessScoreCamp: "assets/generated/chapter2/keyvisuals/cg_ch2_atya_nameless_score_camp_v01.png",
    ch2EchoCalibrationHands: "assets/generated/chapter2/keyvisuals/cg_ch2_echo_calibration_hands_v01.png",
    ch2FrozenResidualEncounter: "assets/generated/chapter2/keyvisuals/cg_ch2_frozen_residual_encounter_v01.png",
    ch2BossChamber: "assets/generated/chapter2/keyvisuals/cg_ch2_scoreheart_guardian_battle_v01.png",
    ch2MotherEcho: "assets/generated/chapter2/keyvisuals/cg_ch2_mother_echo_manifest_v01.png",
    ch2Farewell: "assets/generated/chapter2/keyvisuals/cg_ch2_tower_farewell_v01.png",
    ch3WhiteScoreGate: "assets/generated/chapter3/keyvisuals/cg_ch3_white_score_main_v01.png",
    ch3ReceptionHall: "assets/generated/chapter3/backgrounds/bg_ch3_reception_hall_v01.png",
    ch3HearingChamber: "assets/generated/chapter3/backgrounds/bg_ch3_hearing_chamber_v01.png",
    ch3ArchiveCorridor: "assets/generated/chapter3/backgrounds/bg_ch3_archive_corridor_v01.png",
    ch3PortraitCorridor: "assets/generated/chapter3/backgrounds/bg_ch3_portrait_corridor_v01.png",
    ch3AcademyArchiveReadingRoom: "assets/generated/chapter3/backgrounds/bg_ch3_academy_archive_reading_room_v01.png",
    ch3BossStandoff: "assets/generated/chapter3/keyvisuals/cg_ch3_juheng_boss_standoff_v01.png",
    ch3SecondFileDiscovery: "assets/generated/chapter3/keyvisuals/cg_ch3_second_file_discovery_v01.png",
    ch3JuhengVoluntaryOath: "assets/generated/chapter3/keyvisuals/cg_ch3_juheng_voluntary_oath_v01.png",
    ch4MainKey: "assets/generated/chapter4/keyvisuals/cg_ch4_main_key_v01.png",
    ch4NightlessTrainCorridor: "assets/generated/chapter4/backgrounds/bg_ch4_nightless_train_corridor_v01.png",
    ch4AudienceCar: "assets/generated/chapter4/backgrounds/bg_ch4_audience_car_v01.png",
    ch4CoreOrganChamber: "assets/generated/chapter4/backgrounds/bg_ch4_core_organ_chamber_v01.png",
    ch4FalseApplauseCollapse: "assets/generated/chapter4/keyvisuals/cg_ch4_false_applause_collapse_v01.png",
    ch4KaronOrganBossReveal: "assets/generated/chapter4/keyvisuals/cg_ch4_karon_organ_boss_reveal_v01.png",
    ch4TrainExteriorBoarding: "assets/generated/chapter4/backgrounds/bg_ch4_nightless_train_exterior_boarding_v01.png",
    ch4AltarCarriage: "assets/generated/chapter4/backgrounds/bg_ch4_altar_carriage_v01.png",
    ch4DawnStoppedTrain: "assets/generated/chapter4/backgrounds/bg_ch4_stopped_train_dawn_v01.png",
    ch5MainKey: "assets/generated/chapter5/keyvisuals/cg_ch5_floating_circus_main_key_v01.png",
    ch5FloatingCircusCamp: "assets/generated/chapter5/backgrounds/bg_ch5_floating_circus_camp_v01.png",
    ch5MainTentInterior: "assets/generated/chapter5/backgrounds/bg_ch5_main_tent_interior_v01.png",
    ch5TrapezeMoonStage: "assets/generated/chapter5/backgrounds/bg_ch5_trapeze_moon_stage_v01.png",
    ch5BackstagePropWorkshop: "assets/generated/chapter5/backgrounds/bg_ch5_backstage_prop_workshop_v01.png",
    ch5CircusRoofStarlight: "assets/generated/chapter5/backgrounds/bg_ch5_circus_roof_starlight_v01.png",
    ch5CircusFarewellMorning: "assets/generated/chapter5/backgrounds/bg_ch5_circus_farewell_morning_v01.png",
    ch5Sequence04ChestnutChoice: "assets/generated/chapter5/keyvisuals/cg_ch5_sequence04_chestnut_choice_v01.png",
    ch6MainKey: "assets/generated/chapter6/keyvisuals/cg_ch6_main_key_v01.png",
    ch6ShiguangVillageEstablishing: "assets/generated/chapter6/backgrounds/bg_ch6_shiguang_village_establishing_v01.png",
    ch6HotSpringTalk: "assets/generated/chapter6/backgrounds/bg_ch6_hot_spring_talk_v01.png",
    ch6HotSpringTeaPause: "assets/generated/chapter6/keyvisuals/cg_ch6_hot_spring_tea_pause_v01.png",
    ch6TerraceWaterwheelRepair: "assets/generated/chapter6/backgrounds/bg_ch6_terrace_waterwheel_repair_v01.png",
    ch6WaterwheelRepairShed: "assets/generated/chapter6/backgrounds/bg_ch6_waterwheel_repair_shed_v01.png",
    ch6AtyaAncientTreeMonologue: "assets/generated/chapter6/keyvisuals/cg_ch6_atya_ancient_tree_monologue_v01.png",
    ch6ChengwuSequence04HotSpringGuide: "assets/generated/chapter6/keyvisuals/cg_ch6_chengwu_sequence04_hot_spring_guide_v01.png",
    ch6YuBatonRecovery: "assets/generated/chapter6/keyvisuals/cg_ch6_yu_baton_recovery_v01.png",
    ch6YuSequence04TerraceTalk: "assets/generated/chapter6/keyvisuals/cg_ch6_yu_sequence04_terrace_talk_v01.png",
    ch6Sequence04LightBattle: "assets/generated/chapter6/keyvisuals/cg_ch6_sequence04_light_battle_v01.png",
    ch6ShiguangVillageFarewell: "assets/generated/chapter6/keyvisuals/cg_ch6_shiguang_village_farewell_v01.png",
    ch7MainKey: "assets/generated/chapter7/keyvisuals/cg_ch7_academy_reform_hearing_key_v01.png",
    ch7NightHall: "assets/generated/chapter7/backgrounds/bg_ch7_white_score_night_hall_v01.png",
    ch7HearingChamber: "assets/generated/chapter7/backgrounds/bg_ch7_admin_hearing_chamber_v01.png",
    ch7OldWoundPublicTestimony: "assets/generated/chapter7/keyvisuals/cg_ch7_old_wound_public_testimony_v01.png",
    ch7LivingCasesTestimony: "assets/generated/chapter7/keyvisuals/cg_ch7_living_cases_testimony_v01.png",
    ch7ArchiveSortingTable: "assets/generated/chapter7/backgrounds/bg_ch7_archive_sorting_table_v01.png",
    ch7OldPianoRoomNight: "assets/generated/chapter7/backgrounds/bg_ch7_old_piano_room_night_v01.png",
    ch7LibraryDeepStacksNight: "assets/generated/chapter7/backgrounds/bg_ch7_library_deep_stacks_night_v01.png",
    ch7PrivateStudyNight: "assets/generated/chapter7/backgrounds/bg_ch7_private_study_night_v01.png",
    ch7DiningHallWarm: "assets/generated/chapter7/backgrounds/bg_ch7_academy_dining_hall_warm_v01.png",
    ch8MainKey: "assets/generated/chapter8/keyvisuals/cg_ch8_yu_chi_new_contract_key_v01.png",
    ch8FallenDarkTourStation: "assets/generated/chapter8/backgrounds/bg_ch8_fallen_dark_tour_station_v01.png",
    ch8CampfireNight: "assets/generated/chapter8/backgrounds/bg_ch8_campfire_unspoken_night_v01.png",
    ch8TuningScoreRoom: "assets/generated/chapter8/backgrounds/bg_ch8_tuning_score_room_v01.png",
    ch8CollapsedWaitingHallRain: "assets/generated/chapter8/backgrounds/bg_ch8_collapsed_waiting_hall_rain_v01.png",
    ch8PocketWatchRepairShelter: "assets/generated/chapter8/backgrounds/bg_ch8_pocket_watch_repair_shelter_v01.png",
    ch8StationPlatformDawn: "assets/generated/chapter8/backgrounds/bg_ch8_station_platform_dawn_v01.png",
    ch8Sequence04AnningOpenHeart: "assets/generated/chapter8/keyvisuals/cg_ch8_sequence04_anning_open_heart_v01.png",
    ch9LanFarewellKey: "assets/generated/chapter9/keyvisuals/cg_ch9_lan_farewell_key_v02.png",
    ch9AbandonedOutpostArchive: "assets/generated/chapter9/backgrounds/bg_ch9_abandoned_outpost_archive_v01.png",
    ch9MotherInvitationClue: "assets/generated/chapter9/keyvisuals/cg_ch9_mother_invitation_clue_v01.png",
    ch9AnnaTransformationTeaserKey: "assets/generated/chapter9/keyvisuals/cg_ch9_anna_transformation_teaser_key_v01.png",
    ch9AnnaDailyArchiveStory: "assets/generated/chapter9/keyvisuals/cg_ch9_anna_daily_archive_story_v01.png",
    ch9YongjiCrystalHall: "assets/generated/chapter9/backgrounds/bg_ch9_yongji_crystal_hall_v01.png",
    ch9UnmailedLetterCamp: "assets/generated/chapter9/backgrounds/bg_ch9_unmailed_letter_camp_v01.png",
    ch9OutpostEntranceStillNight: "assets/generated/chapter9/backgrounds/bg_ch9_outpost_entrance_still_night_v01.png",
    ch9OutpostDawnAfterFarewell: "assets/generated/chapter9/backgrounds/bg_ch9_outpost_dawn_after_farewell_v01.png",
    ch9TempCampStrategy: "assets/generated/chapter9/keyvisuals/cg_ch9_temp_camp_strategy_v01.png",
    ch10OldResidenceKey: "assets/generated/chapter10/keyvisuals/cg_ch10_old_residence_main_key_v01.png",
    ch10MotherOldStudy: "assets/generated/chapter10/backgrounds/bg_ch10_mother_old_study_v01.png",
    ch10UnsentMotherLetter: "assets/generated/chapter10/keyvisuals/cg_ch10_unsent_mother_letter_v01.png",
    ch10YongjiCityTeaser: "assets/generated/chapter10/backgrounds/bg_ch10_yongji_city_teaser_v01.png",
    ch10NorthernClueMapTable: "assets/generated/chapter10/backgrounds/bg_ch10_northern_clue_map_table_v01.png",
    ch10AnnaIceBladeTeaser: "assets/generated/chapter10/keyvisuals/cg_ch10_anna_ice_blade_teaser_key_v01.png",
    ch10OldResidenceBattleRoom: "assets/generated/chapter10/backgrounds/bg_ch10_old_residence_battle_room_v01.png",
    ch10FatherMaintenanceFacility: "assets/generated/chapter10/backgrounds/bg_ch10_father_maintenance_facility_v01.png",
    ch10NorthboundTransitCamp: "assets/generated/chapter10/backgrounds/bg_ch10_northbound_transit_camp_v01.png",
    ch10OldResidenceDoorstepDusk: "assets/generated/chapter10/backgrounds/bg_ch10_old_residence_doorstep_dusk_v01.png",
    ch10AtyaAfterTacit: "assets/generated/chapter10/keyvisuals/cg_ch10_atya_after_tacit_v01.png",
    ch10MiloAfterTacit: "assets/generated/chapter10/keyvisuals/cg_ch10_milo_after_tacit_v01.png",
    ch11FrostpassTownKey: "assets/generated/chapter11/keyvisuals/cg_ch11_frostpass_town_main_key_v01.png",
    ch11SnowridgeAmbush: "assets/generated/chapter11/backgrounds/bg_ch11_snowridge_ambush_v01.png",
    ch11FrozenTravelExpanse: "assets/generated/chapter11/backgrounds/bg_ch11_frozen_travel_expanse_v01.png",
    ch11AmbushTracksAnalysis: "assets/generated/chapter11/keyvisuals/cg_ch11_ambush_tracks_analysis_v01.png",
    ch11HunterTwinsWarmMemory: "assets/generated/chapter11/keyvisuals/cg_ch11_hunter_twins_warm_memory_v01.png",
    ch11TradingPostInterior: "assets/generated/chapter11/backgrounds/bg_ch11_trading_post_interior_v01.png",
    ch11GuideStationInterior: "assets/generated/chapter11/backgrounds/bg_ch11_guide_station_interior_v01.png",
    ch11SmithyApothecaryLane: "assets/generated/chapter11/backgrounds/bg_ch11_smithy_apothecary_lane_v01.png",
    ch11TownSquareSnowPlay: "assets/generated/chapter11/backgrounds/bg_ch11_town_square_snow_play_v01.png",
    ch11TownGateFarewell: "assets/generated/chapter11/backgrounds/bg_ch11_town_gate_farewell_v01.png"
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
    ch1EchoPatrol: "assets/generated/chapter1/sprites/enemies/enemy_ch1_echo_patrol_sprite_default_v01.png",
    ch1FogHowler: "assets/generated/chapter1/sprites/enemies/enemy_ch1_fog_howler_sprite_default_v01.png",
    ch2FrozenResidual: "assets/generated/chapter2/sprites/enemies/enemy_ch2_frozen_residual_sprite_default_v02.png",
    ch2TowerGuardian: "assets/generated/chapter2/sprites/enemies/enemy_ch2_tower_guardian_sprite_default_v01.png",
    ch2ScoreheartGuardian: "assets/generated/chapter2/sprites/enemies/boss_ch2_scoreheart_guardian_sprite_default_v02.png",
    ch3HallGuard: "assets/generated/chapter3/sprites/enemies/enemy_ch3_hall_guard_sprite_default_v03.png",
    ch4QilanDuo: "assets/generated/chapter4/sprites/enemies/enemy_ch4_qilan_duo_sprite_default_v01.png",
    ch4SeluomiFinal: "assets/generated/chapter4/sprites/enemies/boss_ch4_seluomi_final_sprite_default_v01.png",
    ch4CharonOrganConductor: "assets/generated/chapter4/sprites/enemies/boss_ch4_charon_organ_conductor_sprite_default_v01.png",
    ch5LiuliZeroOne: "assets/generated/chapter5/sprites/enemies/boss_ch5_liuli_zero_one_sprite_default_v01.png",
    ch5CircusGuard: "assets/generated/chapter5/sprites/enemies/enemy_ch5_circus_guard_sprite_default_v01.png",
    ch7AcademyGuard: "assets/generated/chapter7/sprites/enemies/enemy_ch7_academy_guard_sprite_default_v01.png",
    ch6FieldDissonance: "assets/generated/chapter6/sprites/enemies/enemy_ch6_field_dissonance_sprite_default_v01.png",
    ch8DarkTourRemnants: "assets/generated/chapter8/sprites/enemies/enemy_ch8_dark_tour_remnants_sprite_default_v01.png",
    ch9Cizhao: "assets/generated/chapter9/sprites/enemies/enemy_ch9_cizhao_sprite_default_v01.png",
    ch10ResidualDissonance: "assets/generated/chapter10/sprites/enemies/enemy_ch10_residual_dissonance_sprite_default_v01.png",
    ch11SnowfieldRaiders: "assets/generated/chapter11/sprites/enemies/enemy_ch11_snowfield_raiders_sprite_default_v01.png",
    ch11Po: "assets/generated/chapter11/sprites/enemies/boss_ch11_po_sprite_default_v01.png"
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
