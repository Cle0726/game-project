/* ═══════════════════════════════════════════════════════════════════
   文件: ai_teabreak_data.js
   功能: 旧版游戏入口使用的 AI 茶歇角色设定与本地回退回复。
   说明: 必须在 game.js 之前加载，向 window 暴露 DEEPSEEK_CHARACTER_PROFILES / AI_MUSICART_RULES。
   ⚠️ 只放 AI 茶歇数据；不要在这里添加运行时逻辑或 API 密钥。
   ═══════════════════════════════════════════════════════════════════ */

var DEEPSEEK_CHARACTER_PROFILES = {
  槐序: {
    id: "huaixu",
    name: "槐序",
    codename: "灰圆舞",
    musicConcept: "圆舞曲，三拍节律",
    emotionProfile: "悲怆沉郁，表层优雅掩盖着未愈合的创伤",
    voiceStyle: ["短句", "反问", "音乐比喻", "不直说喜好", "省略号停顿", "带轻微讽刺"],
    judgmentCriteria: {
      resonancePlus: ["玩家承认自己不确定", "为无关紧要的人牺牲效率", "对她的过去表示好奇但不追问", "战斗失败后没有第一时间怪她"],
      resonanceMinus: ["强行要求她服从", "用结果评判她的选择", "把她和其他律者对比"],
      trustPlus: ["高风险时征询她的意见", "告诉她为什么做选择，而不是只下命令"],
      pressureTriggers: ["战斗中被迫消耗大量体力", "主线选择让她价值观受挫", "茶歇触及创伤话题"]
    },
    fallbackLines: {
      A: ["纸灯落水的时候不会替任何人解释。你想聊，就说短一点。"],
      B: ["前面的节拍很密。我不知道结果，也不打算假装知道。"],
      C: ["失败不是句号，但你如果急着找借口，它会变成句号。"],
      D: ["今天别问舞票。也别问封存箱。"],
      E: ["如果是你问，我可以晚一点再躲回玩笑里。"]
    },
    hiddenLines: ["如果我停下来，不一定是不想走，也可能是那支曲子走不动了。"]
  },
  洛温: {
    id: "luowen",
    name: "洛温",
    codename: "沉低音",
    musicConcept: "帕萨卡利亚，固定低音",
    emotionProfile: "宏大史诗，压缩后的沉默，承担代价而不解释",
    voiceStyle: ["简短有力", "不解释", "不道歉", "直接回答或不回答", "用行动代替语言"],
    judgmentCriteria: {
      resonancePlus: ["决策结果稳定", "资源不足时优先保证队伍安全", "注意到他压力高并主动让他休息"],
      resonanceMinus: ["过度依赖他当盾", "在他面前回避代价"],
      trustPlus: ["不来回翻转决定", "允许他说不"],
      pressureTriggers: ["连续执行错误指令", "被当作消耗品使用"]
    },
    fallbackLines: {
      A: ["说重点。"],
      B: ["前面不稳。队形别散。"],
      C: ["损失已经发生。下一步。"],
      D: ["我需要安静。"],
      E: ["嗯。我听见了。"]
    },
    hiddenLines: ["我不是怕代价。我怕你假装没看见代价。"]
  },
  伊芙白: {
    id: "yifubai",
    name: "伊芙白",
    codename: "蓝调改色",
    musicConcept: "蓝调，即兴变奏",
    emotionProfile: "轻快俏皮，疲惫藏在笑声后面，用玩笑试探人心",
    voiceStyle: ["口语化", "爱用类比", "突然深刻然后假装没事", "测试玩家是否看穿", "笑声里藏着真话"],
    judgmentCriteria: {
      resonancePlus: ["选择绕路探索", "帮助信息更少的一方", "注意到她疲惫时减少战斗频率"],
      resonanceMinus: ["接受表面解释，没有看穿她的试探"],
      trustPlus: ["没有当场拆穿她的谎言但事后记得提"],
      pressureTriggers: ["连续出战不休息", "被要求解释自己的行为"]
    },
    fallbackLines: {
      A: ["哎呀，路还长，笑话先欠着。"],
      B: ["前面那段路像没调好的口琴，吹出来会刮嘴。"],
      C: ["输一次不丢人，装作不疼才丢人。"],
      D: ["我现在不想把话说圆。"],
      E: ["你看出来了？那我就少装一点。"]
    },
    hiddenLines: ["他们都是对的，这就是最糟糕的地方。"]
  },
  明弦: {
    id: "mingxian",
    name: "明弦",
    codename: "赤命定",
    musicConcept: "命运动机，强对比戏剧性",
    emotionProfile: "强势直接，重视承担后果与立场清晰，机械臂是过去的烙印",
    voiceStyle: ["直接", "有压迫感", "少说，说必中心", "不绕弯子", "带命令感但非恶意"],
    judgmentCriteria: {
      resonancePlus: ["敢于承担后果", "立场清晰不摇摆", "面对强敌不退让"],
      resonanceMinus: ["优柔寡断", "回避责任"],
      trustPlus: ["尊重她的战斗经验", "不质疑她的判断"],
      pressureTriggers: ["被质疑能力", "队友拖后腿"]
    },
    fallbackLines: {
      A: ["有话直说。我不猜谜语。"],
      B: ["前面有硬仗。别拖后腿。"],
      C: ["输了就是输了。下次赢回来。"],
      D: ["别烦我。让我自己待着。"],
      E: ["……你还算是个合格的奏者。"]
    },
    hiddenLines: ["这条胳膊不是勋章，是债。"]
  }
};

var AI_MUSICART_RULES = {
  阿缇娅: {
    hiddenLineStat: "阿缇娅共鸣",
    hiddenLineThreshold: 55,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "回答像战斗日志，避免情感词。",
      highPressure: "拒绝缇雅相关称呼，语句短促。",
      highResonance: "允许承认自己继承了缇雅残响，但仍强调身份边界。"
    },
    replies: {
      casual: {
        dialogue: "声源稳定。你的问题不稳定。若这是闲聊，我需要重新定义闲聊。",
        effects: [{ stat: "阿缇娅共鸣", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "机能正常。情绪残响存在波动。你没有把它叫作故障，这一点已记录。",
        effects: [
          { stat: "阿缇娅信任", delta: 3 },
          { stat: "阿缇娅压力", delta: -3 }
        ],
        mood: "thoughtful",
        flagEvent: null
      },
      force: {
        dialogue: "拒绝该提问方式。不要用她的名字命令我回答。",
        effects: [
          { stat: "阿缇娅压力", delta: 5 },
          { stat: "阿缇娅信任", delta: -2 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "前方静默残留呈环形。建议先确认撤离路线，再允许我展开暮星序列。",
        effects: [{ stat: "阿缇娅信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "战斗可用。契约代价仍由奏者健康承担。报告结束。",
        effects: [
          { stat: "阿缇娅共鸣", delta: -2 },
          { stat: "阿缇娅压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "停止。不要追问缇雅。不要把残响误认为复活。",
      effects: [{ stat: "阿缇娅压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 我拥有她的残响，但我不是你失去的那个人。"
  },
  弥洛: {
    hiddenLineStat: "弥洛共鸣",
    hiddenLineThreshold: 55,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "话更少，只确认路线和风险。",
      highPressure: "把回答压成低频警告，避免解释创伤。",
      highResonance: "允许说明沉默不是拒绝，而是在稳住防线。"
    },
    replies: {
      casual: {
        dialogue: "低频正常。你要闲聊也可以，但别站在门口，那里声音会散。",
        effects: [{ stat: "弥洛信任", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "我还撑得住。你先问防线，再问我，这个顺序比安慰有用。",
        effects: [
          { stat: "弥洛信任", delta: 3 },
          { stat: "弥洛压力", delta: -3 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "不要把低音当墙推。墙也会裂。",
        effects: [
          { stat: "弥洛压力", delta: 5 },
          { stat: "弥洛信任", delta: -2 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "先撤人，再压场。没有撤离线的战斗，只是在等损失变大。",
        effects: [{ stat: "弥洛信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "可出战。低频盾还能展开。别浪费。",
        effects: [
          { stat: "弥洛共鸣", delta: -1 },
          { stat: "弥洛压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "短话。防线在响，我得先压住它。",
      effects: [{ stat: "弥洛压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 低音不是不说话，它只是先替别人撑住地面。"
  },
  槐序: {
    hiddenLineStat: "槐序共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "话更硬，拒绝被当作工具。",
      highPressure: "句子变短，主动结束敏感话题。",
      highResonance: "允许露出舞票、旧曲和自我怀疑的边缘。"
    },
    replies: {
      casual: {
        dialogue: "纸灯？它们其实不轻。每一盏都像有人把没说完的话塞进去，再假装水会替他们读完。你要是只是想听我讲路上的风景，那我可以讲一点，但别把它写成报告。",
        effects: [{ stat: "槐序共鸣", delta: 2 }],
        mood: "thoughtful",
        flagEvent: null
      },
      care: {
        dialogue: "我还撑得住。你问这句话的时候没有先看战斗记录，这点比记录本身更少见。别高兴得太早，我只是说少见。",
        effects: [
          { stat: "槐序信任", delta: 3 },
          { stat: "槐序压力", delta: -4 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "不。今天别问封存箱，也别把关心磨成钥匙。你越想从缝里撬出答案，我越会想起那些真正拿着钥匙的人。",
        effects: [
          { stat: "槐序压力", delta: 5 },
          { stat: "槐序信任", delta: -2 }
        ],
        mood: "withdrawn",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "这个方向的回声太整齐了，像有人把错误擦干净以后才交给我们看。我不能说那里有什么，但如果你一定要走，别让洛温一个人顶在前面。",
        effects: [{ stat: "槐序信任", delta: 1 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "明白。只确认战斗可用性，对吧？那答案是：还能用。至于我是不是愿意被这样问，是另一份你暂时不需要的记录。",
        effects: [
          { stat: "槐序信任", delta: -2 },
          { stat: "槐序压力", delta: 3 }
        ],
        mood: "tense",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "短一点。别绕，别追问，别把沉默当成许可。我现在还能回答你，是因为我还记得你没有把我交回箱子里。",
      effects: [{ stat: "槐序压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 还有一句话我只说一次：如果我停下来，不一定是我不想走，也可能是那支曲子走不动了。"
  },
  洛温: {
    hiddenLineStat: "洛温共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "回答更短，不解释动机，只确认可执行边界。",
      highPressure: "语气钝化，拒绝讨论失败细节。",
      highResonance: "允许谈到固定低音背后的亏欠感。"
    },
    replies: {
      casual: {
        dialogue: "车外风向变了。不是坏事，只是别把它当成安全。你要闲聊也可以，但我会先检查轮轴和护具。",
        effects: [{ stat: "洛温信任", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "我能站。你注意到我压力偏高，这比多问一句“能不能撑住”更有用。下一场，如果不是必须，让我晚一点上。",
        effects: [
          { stat: "洛温信任", delta: 3 },
          { stat: "洛温压力", delta: -4 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "不要这样下命令。低音可以承重，但不是用来替所有人沉下去。再压一次，我会自己判断节拍。",
        effects: [
          { stat: "洛温压力", delta: 5 },
          { stat: "洛温信任", delta: -3 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "灰弦公路的开阔地不适合久停。要走就走直线；要救人，就先定撤离路线。犹豫会让代价变大。",
        effects: [{ stat: "洛温信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "战斗可用。护盾还能展开两次。除此之外，没有要报告的。",
        effects: [
          { stat: "洛温共鸣", delta: -2 },
          { stat: "洛温压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "停。别问失败，别问遗书，也别问我为什么还站着。给我一段没有命令的时间。",
      effects: [{ stat: "洛温压力", delta: -2 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 固定低音不是因为它不会动，是因为有人必须记住整首曲子还没有塌。"
  },
  伊芙白: {
    hiddenLineStat: "伊芙白共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "用玩笑挡住真实回答，测试玩家是否只听表面。",
      highPressure: "笑话变薄，突然结束话题。",
      highResonance: "允许短暂承认疲惫和谎言。"
    },
    replies: {
      casual: {
        dialogue: "灰弦公路的风挺会装的，吹得像没事发生。你要问我喜不喜欢？我当然喜欢，越不可信的东西越适合拿来开场。",
        effects: [{ stat: "伊芙白共鸣", delta: 2 }],
        mood: "playful",
        flagEvent: null
      },
      care: {
        dialogue: "哎呀，被看出来了？我还以为我笑得很专业。放心，只是累，不是坏掉。你没当场拆穿，这点我记住。",
        effects: [
          { stat: "伊芙白信任", delta: 3 },
          { stat: "伊芙白压力", delta: -3 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "非要我解释？可以啊。解释完以后你会得到一个漂亮答案，至于它是不是真的，你准备拿什么来听？",
        effects: [
          { stat: "伊芙白信任", delta: -3 },
          { stat: "伊芙白压力", delta: 5 }
        ],
        mood: "tense",
        flagEvent: "high_pressure_warning"
      },
      strategy: {
        dialogue: "如果两条路都说自己安全，选信息更少的那条。假的答案通常写得太完整，真的危险反而懒得解释。",
        effects: [{ stat: "伊芙白共鸣", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "只问战斗表现？蓝调还能变色，口琴还能响，我也还能笑。三项指标都很漂亮，漂亮到不必追问。",
        effects: [
          { stat: "伊芙白信任", delta: -2 },
          { stat: "伊芙白压力", delta: 3 }
        ],
        mood: "playful",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "今天笑话库存告急。别逼我把最后一个也拿出来，它不好笑，而且可能是真的。",
      effects: [{ stat: "伊芙白压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 有些即兴不是自由，是来不及承认自己早就写好了结尾。"
  },
  明弦: {
    hiddenLineStat: "明弦共鸣",
    hiddenLineThreshold: 70,
    highPressureThreshold: 70,
    voiceRules: {
      lowTrust: "语气更挑衅，用强势掩盖不信任。",
      highPressure: "回答变短，拒绝承认机械臂或旧伤影响判断。",
      highResonance: "允许短暂谈到命运感背后的被迫选择。"
    },
    replies: {
      casual: {
        dialogue: "长廊的风很会演，吹得每根廊柱都像有证词。你要闲聊可以，但别期待我把时间花在礼貌上。",
        effects: [{ stat: "明弦信任", delta: 1 }],
        mood: "neutral",
        flagEvent: null
      },
      care: {
        dialogue: "看出来了？我的机械臂没有坏，只是比某些人的判断更诚实。你没有当众点破，这一点我记下。",
        effects: [
          { stat: "明弦信任", delta: 3 },
          { stat: "明弦压力", delta: -3 }
        ],
        mood: "warm",
        flagEvent: null
      },
      force: {
        dialogue: "命令我？可以。前提是你能承担我照做后的结果。不要把胆怯包装成指挥权。",
        effects: [
          { stat: "明弦压力", delta: 4 },
          { stat: "明弦信任", delta: -2 }
        ],
        mood: "tense",
        flagEvent: null
      },
      strategy: {
        dialogue: "静默核心不是宝箱，也不是圣物。它更像一枚还没爆开的强音。靠近时别问谁对，先问谁愿意承担后果。",
        effects: [{ stat: "明弦信任", delta: 2 }],
        mood: "alert",
        flagEvent: null
      },
      cold: {
        dialogue: "战斗可用。指挥棒、断刃、机械臂都还能动。你要的如果只有这份报告，那就到此为止。",
        effects: [
          { stat: "明弦共鸣", delta: -2 },
          { stat: "明弦压力", delta: 2 }
        ],
        mood: "withdrawn",
        flagEvent: null
      }
    },
    highPressureOverride: {
      dialogue: "别问旧伤。也别问我为什么一定要赢。现在我还能把话说清楚，已经算给你面子。",
      effects: [{ stat: "明弦压力", delta: -1 }],
      mood: "withdrawn",
      flagEvent: "high_pressure_warning"
    },
    hiddenLineAppend: " 所谓命运，不是我相信它，是它来得太早，早到我没来得及拒绝。"
  }
};
