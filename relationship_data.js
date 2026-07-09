/* ───────────────────────────────────────────────────────────
   文件: relationship_data.js
   功能: 旧版游戏入口使用的关系层级、判定规则与隐藏台词数据。
   说明: 必须在 game.js 之前加载，向 window 暴露 RELATIONSHIP_TIERS / RELATIONSHIP_DATA。
   ⚠️ 只放关系静态数据；不要在这里添加运行时逻辑。
   ─────────────────────────────────────────────────────────── */

var RELATIONSHIP_TIERS = {
  trust: [
    { id: "stranger", label: "陌生", min: 0, max: 29 },
    { id: "known", label: "认识", min: 30, max: 59 },
    { id: "trusted", label: "信任", min: 60, max: 79 },
    { id: "deepTrust", label: "深信", min: 80, max: 100 }
  ],
  resonance: [
    { id: "outsider", label: "陌生人", min: 0, max: 29 },
    { id: "companion", label: "同行者", min: 30, max: 59 },
    { id: "partner", label: "旅伴", min: 60, max: 79 },
    { id: "resonant", label: "共鸣者", min: 80, max: 100 }
  ],
  pressure: [
    { id: "stable", label: "稳定", min: 0, max: 39 },
    { id: "tense", label: "紧绷", min: 40, max: 69 },
    { id: "highPressure", label: "高压", min: 70, max: 89 },
    { id: "edge", label: "失调边缘", min: 90, max: 100 }
  ]
};

var RELATIONSHIP_DATA = {
  槐序: {
    trustKey: "槐序信任",
    resonanceKey: "槐序共鸣",
    pressureKey: "槐序压力",
    judgment: {
      resonancePlus: ["承认不确定", "保护无关者", "好奇但不追问", "失败后不归责"],
      resonanceMinus: ["强制服从", "只用结果评判", "拿她和别人比较"],
      trustPlus: ["高风险前征询意见", "说明选择理由"],
      pressurePlus: ["大量消耗体力", "价值观受挫", "触及创伤话题"]
    },
    hiddenLines: [
      { id: "huaixu_stop", text: "如果我停下来，不一定是不想走，也可能是那支曲子走不动了。", conditions: [{ key: "槐序共鸣", operator: ">=", value: 70 }] }
    ]
  },
  洛温: {
    trustKey: "洛温信任",
    resonanceKey: "洛温共鸣",
    pressureKey: "洛温压力",
    judgment: {
      resonancePlus: ["承认代价", "稳定推进", "不把低音当盾牌消耗"],
      resonanceMinus: ["过度依赖防守", "回避代价", "反复翻转决定"],
      trustPlus: ["保证队伍安全", "允许他说不", "压力高时安排休整"],
      pressurePlus: ["连续错误指令", "被当作消耗品"]
    },
    hiddenLines: [
      { id: "luowen_cost", text: "我不是怕代价。我怕你假装没看见代价。", conditions: [{ key: "洛温共鸣", operator: ">=", value: 70 }] }
    ]
  },
  阿缇娅: {
    trustKey: "阿缇娅信任",
    resonanceKey: "阿缇娅共鸣",
    pressureKey: "阿缇娅压力",
    judgment: {
      resonancePlus: ["承认她不是缇雅", "接纳非正规契约代价", "不把她当遗物"],
      resonanceMinus: ["强迫她承认缇雅身份", "只要求战斗效率", "否认健康代价"],
      trustPlus: ["清楚下达但不羞辱", "在危急时保护镇民声音"],
      pressurePlus: ["连续高健康消耗", "提及缇雅旧身份", "静默署默令干涉"]
    },
    hiddenLines: [
      { id: "atya_not_tiya", text: "我拥有她的残响，但我不是你失去的那个人。", conditions: [{ key: "阿缇娅共鸣", operator: ">=", value: 55 }] }
    ]
  },
  弥洛: {
    trustKey: "弥洛信任",
    resonanceKey: "弥洛共鸣",
    pressureKey: "弥洛压力",
    judgment: {
      resonancePlus: ["听见低频警告", "承认防线也会疲惫", "优先撤离平民"],
      resonanceMinus: ["轻视沉默判断", "把保护视为理所当然"],
      trustPlus: ["给出明确路线", "不强迫他解释创伤"],
      pressurePlus: ["无撤离计划开战", "连续让他硬抗"]
    },
    hiddenLines: [
      { id: "milo_low_hum", text: "低音不是不说话，它只是先替别人撑住地面。", conditions: [{ key: "弥洛共鸣", operator: ">=", value: 55 }] }
    ]
  },
  伊芙白: {
    trustKey: "伊芙白信任",
    resonanceKey: "伊芙白共鸣",
    pressureKey: "伊芙白压力",
    judgment: {
      resonancePlus: ["绕路探索", "帮助信息更少的一方", "看见她的疲惫"],
      resonanceMinus: ["只接受表面玩笑", "强迫解释"],
      trustPlus: ["不当众拆穿", "事后记得她的试探"],
      pressurePlus: ["连续出战", "要求给出唯一答案"]
    },
    hiddenLines: [
      { id: "yifubai_truth", text: "他们都是对的，这就是最糟糕的地方。", conditions: [{ key: "伊芙白共鸣", operator: ">=", value: 70 }] }
    ]
  },
  明弦: {
    trustKey: "明弦信任",
    resonanceKey: "明弦共鸣",
    pressureKey: "明弦压力",
    judgment: {
      resonancePlus: ["承担后果", "立场清晰", "面对强敌不退"],
      resonanceMinus: ["优柔寡断", "回避责任"],
      trustPlus: ["尊重战斗经验", "不质疑她的判断"],
      pressurePlus: ["被质疑能力", "队友拖后腿"]
    },
    hiddenLines: [
      { id: "mingxian_debt", text: "这条胳膊不是勋章，是债。", conditions: [{ key: "明弦共鸣", operator: ">=", value: 70 }] }
    ]
  }
};
