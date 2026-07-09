/* ───────────────────────────────────────────────────────────
   文件: event_pool_data.js
   功能: 旧版游戏入口使用的个人故事列表与章节地图事件池。
   说明: 必须在 game.js 之前加载，向 window 暴露 PERSONAL_STORIES / CHAPTER*_EVENT_POOL。
   ⚠️ 只放事件池静态数据；不要在这里添加运行时逻辑。
   ─────────────────────────────────────────────────────────── */

var PERSONAL_STORIES = [
  {
    id: "atya_01",
    character: "阿缇娅",
    chapter: 0,
    title: "暮星的空白",
    threshold: 30,
    resonanceKey: "阿缇娅共鸣",
    seenEvent: "story_seen:atya_01",
    sceneId: "story_atya_01"
  },
  {
    id: "milo_01",
    character: "弥洛",
    chapter: 0,
    title: "低音不说谎",
    threshold: 30,
    resonanceKey: "弥洛共鸣",
    seenEvent: "story_seen:milo_01",
    sceneId: "story_milo_01"
  },
  {
    id: "huaixu_01",
    character: "槐序",
    chapter: 1,
    title: "舞票背面的乐句",
    threshold: 30,
    resonanceKey: "槐序共鸣",
    seenEvent: "story_seen:huaixu_01",
    sceneId: "story_huaixu_01"
  },
  {
    id: "huaixu_02",
    character: "槐序",
    chapter: 2,
    title: "无人邀舞的夜晚",
    threshold: 60,
    resonanceKey: "槐序共鸣",
    seenEvent: "story_seen:huaixu_02",
    sceneId: "story_huaixu_02"
  },
  {
    id: "huaixu_03",
    character: "槐序",
    chapter: 3,
    title: "三拍与第一次失谐",
    threshold: 90,
    resonanceKey: "槐序共鸣",
    seenEvent: "story_seen:huaixu_03",
    sceneId: "story_huaixu_03"
  }
];

var CHAPTER0_EVENT_POOL = [
  {
    id: "CH0_E001",
    title: "诺伊的无声旋律",
    eventType: "minigame",
    minigameType: "无声琴键",
    description: "诺伊坐在旧钢琴旁，把手悬在琴键上方。他不敢按下去，却又不愿离开。",
    choices: [
      { text: "教他半键下沉，不让琴槌敲响", effects: [{ type: "change", key: "诺伊希望", value: 3 }, { type: "event", value: "ch0_side_noi_silent_melody" }] },
      { text: "让他先记住四拍呼吸", effects: [{ type: "change", key: "城邦稳定度", value: 1 }, { type: "change", key: "诺伊希望", value: 1 }] }
    ]
  },
  {
    id: "CH0_E002",
    title: "安柠的健康检查",
    eventType: "narrative",
    description: "安柠把医疗箱摔在桌上，要求你把右腕伸出来。她不关心你是否像指挥家，她只关心你还能不能活过今晚。",
    choices: [
      { text: "配合检查，不逞强", effects: [{ type: "change", key: "奏者健康", value: 5 }, { type: "change", key: "安柠好感", value: 2 }] },
      { text: "说现在还有人等着救", effects: [{ type: "change", key: "奏者健康", value: -2 }, { type: "change", key: "安柠好感", value: 1 }, { type: "change", key: "阿缇娅压力", value: 2 }] }
    ]
  },
  {
    id: "CH0_E003",
    title: "阿缇娅看见旧裙子",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "ch0_contract_baton_unplayed" }],
    description: "阿缇娅站在后台旧裙子前，像在读取一段她不承认属于自己的记忆。",
    choices: [
      { text: "不说缇雅的名字，只问她看见了什么", effects: [{ type: "change", key: "阿缇娅信任", value: 3 }, { type: "change", key: "阿缇娅共鸣", value: 2 }] },
      { text: "说那是缇雅想穿的裙子", effects: [{ type: "change", key: "阿缇娅共鸣", value: 3 }, { type: "change", key: "阿缇娅压力", value: 4 }] }
    ]
  },
  {
    id: "CH0_E004",
    title: "弥洛的低音",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "黑色节拍器残片" }],
    description: "钟楼下方，弥洛用低鸣压住一段反复回弹的半拍。他说低音不该抢走主旋律。",
    choices: [
      { text: "承认他比你更早听见危险", effects: [{ type: "change", key: "弥洛信任", value: 3 }, { type: "change", key: "弥洛压力", value: -2 }] },
      { text: "要求他等你的手势", effects: [{ type: "change", key: "弥洛信任", value: 1 }, { type: "change", key: "弥洛压力", value: 3 }] }
    ]
  },
  {
    id: "CH0_E005",
    title: "唱片店里的刮痕",
    eventType: "minigame",
    minigameType: "波形修复",
    description: "乌鸦先生把一张刮花的黑胶放上唱机。噪声之下，似乎还藏着母亲留下的半句话。",
    choices: [
      { text: "从杂音里提取低频残片", effects: [{ type: "event", value: "母亲声音残片:低频" }, { type: "change", key: "世界观信息", value: 2 }] },
      { text: "先复制唱片，避免原件损坏", effects: [{ type: "change", key: "乌鸦先生信任", value: 2 }, { type: "change", key: "世界观信息", value: 1 }] }
    ]
  },
  {
    id: "CH0_E006",
    title: "白栖的封音项圈",
    eventType: "narrative",
    description: "白栖按住脖颈上的封音项圈。每当附近出现旋律残响，项圈都会像惩罚一样收紧。",
    choices: [
      { text: "让安柠检查项圈结构", effects: [{ type: "change", key: "安柠好感", value: 1 }, { type: "event", value: "线索:封音项圈结构" }] },
      { text: "告诉她害怕不等于背叛", effects: [{ type: "change", key: "白栖信任", value: 3 }, { type: "change", key: "镇民信任", value: 1 }] }
    ]
  },
  {
    id: "CH0_E007",
    title: "米拉奶奶的最后一张票",
    eventType: "narrative",
    description: "米拉奶奶从票夹里取出最后一张合法演出的票根。纸已经脆到快要碎了，她却仍把它夹得很平。",
    choices: [
      { text: "把票根夹进修理记录本", effects: [{ type: "event", value: "旧剧场最后票根" }, { type: "change", key: "世界观信息", value: 1 }] },
      { text: "答应替她看完那场演出", effects: [{ type: "change", key: "镇民希望", value: 3 }, { type: "event", value: "ch0_promised_last_performance" }] }
    ]
  },
  {
    id: "CH0_E008",
    title: "奥托的旧剧场灯光机关",
    eventType: "minigame",
    minigameType: "舞台灯调试",
    description: "失聪的老灯光师奥托摸着锈蚀灯架。他听不见音乐，却还记得哪一束灯该落在哪一个人身上。",
    choices: [
      { text: "把追光灯调到旧钢琴位置", effects: [{ type: "event", value: "ch0_spotlight_piano_ready" }, { type: "change", key: "城邦稳定度", value: 1 }] },
      { text: "把追光灯调到后台入口", effects: [{ type: "event", value: "ch0_spotlight_backstage_ready" }, { type: "change", key: "世界观信息", value: 1 }] }
    ]
  },
  {
    id: "CH0_E009",
    title: "静默署巡逻队",
    eventType: "narrative",
    description: "静默署巡逻队封锁了广场。他们不是来救镇民的，是来确认没有人把声音还给镇民。",
    choices: [
      { text: "让白栖替你们争取十分钟", effects: [{ type: "change", key: "白栖信任", value: 2 }, { type: "event", value: "ch0_patrol_delayed" }] },
      { text: "从地下排水道绕行", effects: [{ type: "change", key: "奏者健康", value: -2 }, { type: "change", key: "世界失谐度", value: 1 }] }
    ]
  },
  {
    id: "CH0_E010",
    title: "地下商人的残响诱饵",
    eventType: "narrative",
    description: "地下商人承认自己用乐器残响引来噬响体，再把残骸卖给静默署承包商。",
    choices: [
      { text: "没收诱饵，公开他的交易记录", effects: [{ type: "change", key: "镇民信任", value: 3 }, { type: "change", key: "世界失谐度", value: -2 }] },
      { text: "留下诱饵，反向追踪卡戎信号", effects: [{ type: "change", key: "世界观信息", value: 3 }, { type: "change", key: "世界失谐度", value: 2 }] }
    ]
  },
  {
    id: "CH0_E011",
    title: "静默猎犬的追迹",
    eventType: "battle",
    unlock: [{ operator: "includes", value: "ch0_contract_baton_unplayed" }],
    description: "雨水把广场上的脚印冲成黑色音符。静默猎犬低伏在封条之间，鼻腔里传出像消音器堵住的节拍声。",
    choices: [
      {
        text: "让弥洛压住犬吠，阿缇娅切断追迹",
        effects: [{ type: "event", value: "ch0_silence_hound_engaged" }],
        effect: () => startBattle("ch0_silence_hound", { selectedMusicarts: ["阿缇娅", "弥洛"] })
      },
      {
        text: "绕开追迹路线，保存奏者健康",
        effects: [{ type: "change", key: "奏者健康", value: 2 }, { type: "change", key: "镇民恐惧", value: 1 }, { type: "event", value: "ch0_silence_hound_avoided" }]
      }
    ]
  },
  {
    id: "CH0_E012",
    title: "霍尔特的湿文件",
    eventType: "narrative",
    description: "镇长代理霍尔特抱着一摞被雨泡开的登记表。他说自己只是按条例维持秩序，可手指一直按在失踪名单上。",
    choices: [
      { text: "帮他重新整理失声镇民名单", effects: [{ type: "change", key: "镇民信任", value: 2 }, { type: "change", key: "世界观信息", value: 1 }, { type: "event", value: "ch0_holt_voice_registry" }] },
      { text: "要求他公开静默署物资去向", effects: [{ type: "change", key: "镇民希望", value: 2 }, { type: "change", key: "白谱院声望值", value: -1 }, { type: "event", value: "线索:眠沙镇物资截流" }] }
    ]
  },
  {
    id: "CH0_E013",
    title: "琳与铃的残谱拼读",
    eventType: "minigame",
    minigameType: "残谱拼读",
    description: "废弃教室里，双胞胎琳与铃把被擦掉的歌词抄在窗雾上。一个不停说话，一个只用粉笔敲四拍。",
    choices: [
      { text: "让琳念节拍，铃负责补缺字", effects: [{ type: "change", key: "诺伊希望", value: 2 }, { type: "change", key: "镇民希望", value: 2 }, { type: "event", value: "ch0_twins_restored_fragment" }] },
      { text: "先带她们离开教室", effects: [{ type: "change", key: "镇民信任", value: 1 }, { type: "change", key: "世界失谐度", value: -1 }, { type: "event", value: "ch0_twins_evacuated" }] }
    ]
  },
  {
    id: "CH0_E014",
    title: "伊莱娜的临时盘查",
    eventType: "narrative",
    description: "静默署队长伊莱娜带队封住雨街。她不相信音乐无害，也不完全相信上级给她的报告。",
    choices: [
      { text: "让安柠出面交涉，争取十分钟", effects: [{ type: "change", key: "安柠好感", value: 1 }, { type: "change", key: "世界观信息", value: 1 }, { type: "event", value: "ch0_elena_negotiated_delay" }] },
      { text: "进入静默潜行，绕开封锁线", effects: [{ type: "change", key: "奏者健康", value: -1 }, { type: "change", key: "镇民信任", value: 1 }, { type: "event", value: "ch0_elena_stealth_route" }] },
      { text: "交出诱饵交易线索，换取暂缓追捕", effects: [{ type: "change", key: "白谱院声望值", value: -1 }, { type: "change", key: "世界失谐度", value: -1 }, { type: "event", value: "ch0_elena_suspicion_seed" }] }
    ]
  }
];

var CHAPTER2_EVENT_POOL = [
  {
    id: "E201",
    title: "谱鸣静音挑战",
    eventType: "minigame",
    minigameType: "节奏潜行",
    description: "一段悬浮冰锥谱架密集的回廊挡住去路。每一步都可能把整座塔的警报敲醒。",
    choices: [
      { text: "按弥洛的低音节拍轻声通过", effects: [{ type: "event", value: "E201_success" }, { type: "change", key: "谱鸣共振", value: -10 }, { type: "change", key: "弥洛信任", value: 2 }], nextScene: "ch2_snow_006" },
      { text: "用阿缇娅的刀光切断一排共振冰锥", effects: [{ type: "change", key: "奏者健康", value: -4 }, { type: "change", key: "谱鸣共振", value: 6 }, { type: "event", value: "E201_force_cut" }] }
    ]
  },
  {
    id: "E202",
    title: "冻结档案室探索",
    eventType: "minigame",
    minigameType: "档案拼图",
    description: "档案室内封存着零号奏者计划的早期文件，冰层把残页按错误时间顺序冻结在半空。",
    choices: [
      { text: "按时间线拼回计划残页", effects: [{ type: "event", value: "E202_archive_timeline_complete" }, { type: "event", value: "安柠父亲名单线索" }, { type: "change", key: "世界观信息", value: 3 }] },
      { text: "只复制文件，不破坏冰封现场", effects: [{ type: "event", value: "E202_archive_copied" }, { type: "change", key: "安柠好感", value: 2 }] }
    ]
  },
  {
    id: "E203",
    title: "看塔仪的旧简报",
    eventType: "narrative",
    description: "漂浮的看塔仪反复播放二十三年前的阶段性简报。简报最后一栏永久损坏，只留下没有完成的停顿。",
    choices: [
      { text: "收集简报残片，拼出课题被封存前的最后一天", effects: [{ type: "event", value: "一个课题是如何一步步被辜负的" }, { type: "change", key: "世界观信息", value: 2 }] },
      { text: "关闭看塔仪外放，降低回廊共振", effects: [{ type: "change", key: "谱鸣共振", value: -6 }, { type: "change", key: "宁溯好感", value: 2 }] }
    ]
  },
  {
    id: "E204",
    title: "冰封回廊的无名律者",
    eventType: "narrative",
    description: "外围回廊深处，一具冰封残奏比其他个体保存得更完整，面容像被冻在即将醒来的前一秒。",
    choices: [
      { text: "让阿缇娅为它补上最后一拍", effects: [{ type: "event", value: "无名律者的谱线残片" }, { type: "change", key: "阿缇娅共鸣", value: 4 }, { type: "change", key: "奏者健康", value: -3 }] },
      { text: "只取谱线残片，留待之后分析", effects: [{ type: "event", value: "无名律者的谱线残片" }, { type: "change", key: "世界观信息", value: 1 }] }
    ]
  },
  {
    id: "E205",
    title: "宁溯的私人房间",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "ch2_ningsu_best_route" }],
    description: "宁溯的房间陈设极简，唯一的私人物品是一本手写日记，记录六年驻守期间她如何一点点把自责写成制度。",
    choices: [
      { text: "合上日记，只问她愿意说哪一页", effects: [{ type: "change", key: "宁溯好感", value: 5 }, { type: "event", value: "宁溯完整背景独白" }] },
      { text: "记录日记里的关键日期", effects: [{ type: "change", key: "世界观信息", value: 2 }, { type: "event", value: "宁溯举报卡戎日期" }] }
    ]
  }
];

var CHAPTER3_WHITE_EVENT_POOL = [
  {
    id: "E301",
    title: "待销毁柜的秘密",
    eventType: "minigame",
    minigameType: "文件分类",
    description: "档案室三层需要管理员权限验证。白谱院的文件系统死板、精确，也因此可以被预测。",
    choices: [
      { text: "完成部门/年份/密级三重归类", effects: [{ type: "event", value: "E301_file_sorting_success" }, { type: "change", key: "听证倾向值", value: 5 }, { type: "change", key: "沈知微好感", value: 2 }], nextScene: "ch3_white_012" },
      { text: "请柏舟协助取得临时权限", effects: [{ type: "event", value: "E301_baizhou_access_help" }, { type: "change", key: "听证倾向值", value: 3 }], nextScene: "ch3_white_012" }
    ]
  },
  {
    id: "E302",
    title: "肖像长廊的隐藏画像",
    eventType: "narrative",
    description: "历代指挥家肖像中，有一幅落款模糊的画像，构图习惯与主角母亲留下的手稿插图高度相似。",
    choices: [
      { text: "记录画像构图与母亲手稿的相似处", effects: [{ type: "event", value: "母亲可能曾以化名在此任教" }, { type: "change", key: "世界观信息", value: 2 }, { type: "change", key: "听证倾向值", value: 2 }] },
      { text: "询问温别克画像来源", effects: [{ type: "event", value: "温别克三十年前姑娘线索" }, { type: "change", key: "世界观信息", value: 3 }] }
    ]
  },
  {
    id: "E303",
    title: "学生食堂的闲谈",
    eventType: "narrative",
    description: "学生们小声讨论传说中的零号奏者计划，版本各异，夸张得像把历史嚼成了糖纸。",
    choices: [
      { text: "听完他们的误传，记下真实与传闻的差距", effects: [{ type: "event", value: "白谱院学生零号计划传闻" }, { type: "change", key: "世界观信息", value: 1 }] },
      { text: "用轻松话题缓和队伍压力", effects: [{ type: "change", key: "阿缇娅压力", value: -2 }, { type: "change", key: "弥洛压力", value: -2 }] }
    ]
  },
  {
    id: "E304",
    title: "弥洛的抉择：销毁还是留下",
    eventType: "relationship",
    unlock: [{ operator: "includes", value: "ch3_milo_archive_choice_seed" }],
    description: "弥洛拿着自己的早期实验档案，第一次不知道自由究竟该表现为保留，还是抹去。",
    choices: [
      { text: "留着它。你的过去不该被抹掉，也不该定义现在的你。", effects: [{ type: "event", value: "弥洛保留早期档案" }, { type: "change", key: "弥洛共鸣", value: 6 }, { type: "change", key: "听证倾向值", value: 3 }] },
      { text: "销毁它。有些账不用一直算下去。", effects: [{ type: "event", value: "弥洛销毁早期档案" }, { type: "change", key: "弥洛信任", value: 5 }] }
    ]
  },
  {
    id: "E305",
    title: "珏衡的休息室",
    eventType: "relationship",
    unlock: [{ operator: "includes", value: "珏衡现场观察报告" }],
    description: "战斗后，珏衡邀请队伍到休息室小坐。她的《自愿契约誓词》被夹在一本条例手册里，边角已经翻旧。",
    choices: [
      { text: "阅读她的自愿契约誓词", effects: [{ type: "event", value: "珏衡完整背景独白" }, { type: "change", key: "珏衡好感", value: 8 }], nextScene: "ch3_side_juheng_room" },
      { text: "只问她此刻怎么想", effects: [{ type: "event", value: "珏衡规则与成长独白" }, { type: "change", key: "珏衡好感", value: 6 }], nextScene: "ch3_side_juheng_room" }
    ]
  }
];

var CHAPTER3_EVENT_POOL = [
  {
    id: "E301",
    title: "无拍者的残响",
    eventType: "narrative",
    description: "战斗结束后，原地发现一小片未消散的黑银粒子。它像一枚没有重量的乐谱灰烬，靠近时会短暂传出模糊的旧时代广播。",
    choices: [
      { text: "记录下来交给玛伦研究", effects: [{ type: "change", key: "世界观信息", value: 2 }, { type: "event", value: "线索:无拍者残响" }] },
      { text: "让槐序来听", effects: [{ type: "change", key: "槐序压力", value: 5 }, { type: "event", value: "槐序听见无拍者残响" }] }
    ]
  },
  {
    id: "E302",
    title: "议会的问责",
    eventType: "narrative",
    description: "回声议会就和声盛典的损失召开质询会，要求队伍出席说明。礼仪厅的灯光很亮，亮到每一句话都像被放在谱架上审阅。",
    choices: [
      { text: "如实陈述", effects: [{ type: "event", value: "诚实陈述盛典之夜" }] },
      { text: "强调战斗的不可抗力", effects: [{ type: "change", key: "回声议会声望值", value: 3 }, { type: "event", value: "避重就轻" }] }
    ]
  },
  {
    id: "E303",
    title: "居民的感谢信",
    eventType: "narrative",
    description: "被保护撤离的居民送来感谢信和自制点心。纸张边缘有些皱，却比盛典请柬更像真实的掌声。",
    choices: [
      { text: "和队伍一起拆开感谢信", effects: [{ type: "change", key: "槐序压力", value: -3 }, { type: "change", key: "洛温压力", value: -3 }, { type: "change", key: "明弦压力", value: -3 }] }
    ]
  },
  {
    id: "E304",
    title: "明弦的过去碎片",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "明弦正式加入队伍" }],
    description: "茶歇时，明弦无意间提到自己机械臂的来历，又迅速转移话题。她说得太快，像怕那句话追上自己。",
    choices: [
      { text: "追问", effects: [{ type: "change", key: "明弦压力", value: 5 }, { type: "event", value: "明弦个人故事伏笔" }] },
      { text: "不追问，转移话题陪她聊别的", effects: [{ type: "change", key: "明弦共鸣", value: 4 }] }
    ]
  },
  {
    id: "E305",
    title: "槐序与明弦的和解契机",
    eventType: "narrative",
    unlock: [{ operator: "includes", value: "明弦已登场" }],
    description: "槐序与明弦难得单独交谈了几句。你没有听见全部内容，但她们离开时，气氛比长廊入口那一次缓和不少。",
    choices: [
      { text: "不打扰，旁观即可", effects: [{ type: "change", key: "槐序信任", value: 2 }, { type: "change", key: "明弦信任", value: 2 }, { type: "event", value: "槐序明弦关系缓和" }] }
    ]
  }
];
