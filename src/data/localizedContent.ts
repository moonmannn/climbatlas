import type {
  Destination,
  DestinationLocalizedContent,
  Locale,
  LocalizedList,
  LocalizedText,
  RouteHighlight,
  RouteLocalizedContent
} from "@/types/destination";

type RouteCopyInput = {
  style: [string, string];
  summary: [string, string];
  bestFor: [string, string];
  decisionHint: [string, string];
  practiceFocus: [string[], string[]];
  editorialTips: [string[], string[]];
};

function text([en, zh]: [string, string]): LocalizedText {
  return { en, zh };
}

function list([en, zh]: [string[], string[]]): LocalizedList {
  return { en, zh };
}

function routeCopy(copy: RouteCopyInput): RouteLocalizedContent {
  return {
    style: text(copy.style),
    summary: text(copy.summary),
    bestFor: text(copy.bestFor),
    decisionHint: text(copy.decisionHint),
    practiceFocus: list(copy.practiceFocus),
    editorialTips: list(copy.editorialTips)
  };
}

export const destinationLocalizedContent: Record<
  string,
  DestinationLocalizedContent
> = {
  "yosemite-usa": {
    description: {
      en: "Yosemite is the big-wall daydream with granite teeth. Come here when you want history, patience, and a route choice that feels bigger than the number.",
      zh: "优胜美地像一本花岗岩大墙传说集。适合想要历史感、耐心和一点大目标气场的日子，不只是看难度数字。"
    }
  },
  "red-river-gorge-usa": {
    description: {
      en: "Red River Gorge is steep sandstone with a friendly pump timer. Pick it when you want movement, endurance, and a day that makes forearms negotiate politely.",
      zh: "红河峡谷是陡峭砂岩和前臂泵感的快乐实验室。想练耐力、节奏和连续动作时，它会很懂你。"
    }
  },
  "squamish-canada": {
    description: {
      en: "Squamish brings granite variety: cracks, slabs, big features, and forest-town energy. It is great when you want a route with texture and a story.",
      zh: "斯阔米什的花岗岩很会变花样：裂缝、板壁、大特征和森林小镇气质都有。适合想要路线有质感、有故事的日子。"
    }
  },
  "fontainebleau-france": {
    description: {
      en: "Fontainebleau is a sandstone puzzle garden. Choose it when you want footwork, body position, and the humbling joy of being outsmarted by a boulder.",
      zh: "枫丹白露像一座砂岩谜题花园。适合练脚法、身体位置，也适合接受一块石头比你更聪明这个事实。"
    }
  },
  "kalymnos-greece": {
    description: {
      en: "Kalymnos is sunny limestone with sea air and tufa imagination. It fits days when you want flow, endurance, and a little vacation brain in the best way.",
      zh: "卡林诺斯是阳光、海风和灰岩 tufas 的组合。适合想爬得流动一点、耐力一点，还带点假期脑袋的日子。"
    }
  },
  "joshua-tree-usa": {
    description: {
      en: "Joshua Tree is desert granite with attitude: short approaches in spirit, big lessons in movement. Pick it when you want style, friction, and a little sun-baked honesty.",
      zh: "约书亚树是很有脾气的沙漠花岗岩：看起来短小，动作课却很扎实。适合想练风格、摩擦和一点被太阳晒过的诚实。"
    }
  },
  "smith-rock-usa": {
    description: {
      en: "Smith Rock feels like sport-climbing history with desert edges. It suits days when you want technical movement, commitment, and routes that do not flatter sloppy footwork.",
      zh: "Smith Rock 像一段带沙漠边缘感的运动攀历史。适合想练技术动作、投入度，以及不被路线纵容脚法的一天。"
    }
  },
  "el-potrero-chico-mexico": {
    description: {
      en: "El Potrero Chico is limestone adventure in big friendly walls. Choose it when you want exposure, teamwork, and a route day that feels like a vertical road trip.",
      zh: "El Potrero Chico 是大块灰岩墙上的冒险感。适合想要暴露感、队伍配合，以及像垂直公路旅行一样的路线日。"
    }
  },
  "chamonix-france": {
    description: {
      en: "Chamonix is alpine climbing with a capital A. Come here when route choice depends on weather, headspace, and whether your ambition packed a warm jacket.",
      zh: "霞慕尼是大写的阿尔卑斯攀登。适合那些选线要看天气、心态，以及你的野心有没有带保暖层的日子。"
    }
  },
  "ceuse-france": {
    description: {
      en: "Ceüse is high limestone with a serious sport-climbing halo. Pick it when you want blue-sky endurance, finger discipline, and a route list that quietly raises the stakes.",
      zh: "Ceüse 是带光环的高处灰岩运动攀。适合想要蓝天耐力、手指纪律，以及一份会悄悄提高赌注的路线清单。"
    }
  },
  "dolomites-italy": {
    description: {
      en: "The Dolomites are limestone cathedrals with alpine history in the walls. Choose them when you want exposure, old stories, and a route day that feels carved into the sky.",
      zh: "多洛米蒂像一组石灰岩大教堂，墙里刻着阿尔卑斯历史。适合想要暴露感、老故事，以及像被刻进天空里的路线日。"
    }
  },
  "frankenjura-germany": {
    description: {
      en: "Frankenjura is pocketed limestone with compact power and deep sport-climbing DNA. Pick it when you want fingers, precision, and routes that waste no space.",
      zh: "弗兰肯尤拉是满布洞点的灰岩，短小、强力、运动攀基因很深。适合想练手指、精准和不浪费空间的路线。"
    }
  },
  "siurana-spain": {
    description: {
      en: "Siurana is steep Spanish limestone with a proud sport-climbing voice. Come here when you want endurance, history, and a route list that speaks in serious projects.",
      zh: "休拉纳是很有姿态的西班牙陡峭灰岩。适合想要耐力、历史感，以及一份说话很像认真项目的路线清单。"
    }
  },
  "margalef-spain": {
    description: {
      en: "Margalef is pockety conglomerate with playful brutality. Choose it when you want powerful sport climbing, finger puzzles, and routes that look friendly until they start counting.",
      zh: "马尔加莱夫是满是洞点的砾岩，带一点好玩的残酷。适合想要强力运动攀、手指谜题，以及看起来友好但会开始算账的路线。"
    }
  },
  "yangshuo-china": {
    description: {
      en: "Yangshuo is karst limestone with river scenery and relaxed climbing energy. Pick it when you want movement, travel mood, and a route day that feels bright without being empty.",
      zh: "阳朔是喀斯特灰岩、江景和轻松攀岩气质的组合。适合想要动作、旅行感，以及明亮但不空洞的路线日。"
    }
  },
  "liming-china": {
    description: {
      en: "Liming is sandstone crack country with adventure in the seams. Choose it when you want trad judgment, body craft, and routes that feel more like conversations than workouts.",
      zh: "黎明是砂岩裂缝的世界，冒险感藏在岩缝里。适合想练传统攀判断、身体技术，以及像对话而不只是训练的路线。"
    }
  },
  "long-dong-taiwan": {
    description: {
      en: "Long Dong is seaside sandstone with ocean air and route-choice honesty. Pick it when you want movement, exposure, and a climbing day that listens to the coast.",
      zh: "龙洞是海边砂岩、海风和诚实选线的组合。适合想要动作、暴露感，以及会听海岸说话的攀岩日。"
    }
  },
  "railay-tonsai-thailand": {
    description: {
      en: "Railay and Tonsai are tropical limestone with beach-day mischief and steep-route seriousness. Choose them when you want flow, heat, sea cliffs, and a little vacation chaos.",
      zh: "Railay 和 Tonsai 是热带灰岩、海滩玩心和陡线认真感的混合。适合想要流动、热度、海崖和一点假期混乱的人。"
    }
  },
  "grampians-australia": {
    description: {
      en: "The Grampians are sandstone with wild space, cave power, and source-check honesty. Pick them when you want style variety and a route list that admits what still needs verification.",
      zh: "Grampians 是砂岩、野性空间、洞穴力量和来源诚实感的组合。适合想要风格变化，也接受有些路线仍需补强核验的人。"
    }
  },
  "rocklands-south-africa": {
    description: {
      en: "Rocklands is orange sandstone bouldering with winter light and big-name gravity. Choose it when you want power, history, skin management, and problems that make short climbs feel enormous.",
      zh: "Rocklands 是橙色砂岩抱石、冬日光线和大名字重量的组合。适合想要力量、历史、皮肤管理，以及让短线路变得巨大的抱石。"
    }
  }
};

export const routeLocalizedContent: Record<string, RouteLocalizedContent> = {
  "the-nose-el-capitan": routeCopy({
    style: [
      "Historic granite big-wall climbing with a marathon mindset.",
      "历史感很重的花岗岩大墙，心态更像马拉松，不像短跑。"
    ],
    summary: [
      "The Nose is for the daydreamer who also owns a checklist. It asks for patience, systems, and enough curiosity to enjoy a very long story.",
      "The Nose 适合有大梦想、也愿意认真列清单的人。它考验耐心、系统感，以及愿不愿意读完一部长篇故事。"
    ],
    bestFor: [
      "Climbers drawn to iconic objectives and long-haul preparation.",
      "适合被经典大目标吸引，并愿意慢慢准备的攀岩者。"
    ],
    decisionHint: [
      "Pick it when the goal is the journey itself, not a quick tick.",
      "当你想要的是一段旅程，而不是快速打勾时，可以把它放进清单。"
    ],
    practiceFocus: [
      ["systems", "pacing", "big-wall mindset"],
      ["系统练习", "节奏管理", "大墙心态"]
    ],
    editorialTips: [
      [
        "Use smaller granite days to test your rhythm before dreaming too loudly.",
        "A big objective feels better when your systems feel boringly reliable."
      ],
      [
        "先用较小的花岗岩目标测试节奏，再把梦想音量调大。",
        "大目标真正舒服的时候，往往是你的系统已经稳定到有点无聊。"
      ]
    ]
  }),
  "regular-northwest-face-half-dome": routeCopy({
    style: [
      "Long granite wall climbing with classic Yosemite seriousness.",
      "经典优胜美地长墙风格，漂亮，也很认真。"
    ],
    summary: [
      "A route for climbers who like their adventures tall, famous, and not especially interested in your schedule.",
      "这条线适合喜欢高大、经典、并且不太听你时间安排的冒险的人。"
    ],
    bestFor: [
      "Experienced teams comparing long granite objectives.",
      "适合有经验的队伍比较长距离花岗岩目标。"
    ],
    decisionHint: [
      "Choose it when you want a full-value wall day and have the patience to match.",
      "当你想要一整天都很有分量，并且耐心也在线时，考虑它。"
    ],
    practiceFocus: [
      ["wall endurance", "team rhythm", "weather judgment"],
      ["长墙耐力", "队伍节奏", "天气判断"]
    ],
    editorialTips: [
      [
        "This is not a casual calendar filler; treat preparation as part of the climb.",
        "Good partner communication matters as much as fitness."
      ],
      [
        "它不是随便塞进行程的小项目；准备本身就是攀登的一部分。",
        "队友沟通和体能一样重要。"
      ]
    ]
  }),
  "snake-dike-half-dome": routeCopy({
    style: [
      "Moderate-feeling granite adventure with huge scenery energy.",
      "难度数字不夸张，但风景和冒险感很会放大音量。"
    ],
    summary: [
      "Snake Dike is the scenic choice for climbers who want a big day without pretending every minute must be max difficulty.",
      "Snake Dike 适合想要大场面，但不想每一分钟都在极限边缘的人。"
    ],
    bestFor: [
      "Climbers seeking exposure, movement, and a memorable setting.",
      "适合想体验暴露感、移动感和强烈场景记忆的攀岩者。"
    ],
    decisionHint: [
      "Pick it when your motivation is scenery plus composure.",
      "当你的关键词是风景和稳定心态时，它会很合适。"
    ],
    practiceFocus: [
      ["calm movement", "exposure comfort", "long-day pacing"],
      ["冷静移动", "暴露感适应", "长日节奏"]
    ],
    editorialTips: [
      [
        "A moderate grade can still ask for a grown-up day plan.",
        "Practice moving calmly when the view gets loud."
      ],
      [
        "难度适中不等于计划可以随便。",
        "当风景开始很有存在感时，练习保持动作安静。"
      ]
    ]
  }),
  "salathe-wall-el-capitan": routeCopy({
    style: [
      "A legendary El Capitan wall with endurance and history baked in.",
      "传奇 El Capitan 大墙，耐力和历史感都很浓。"
    ],
    summary: [
      "Salathe is for climbers who want an objective that feels like joining a long conversation with Yosemite history.",
      "Salathe 适合想加入优胜美地历史长谈的人，不只是想找一条路线。"
    ],
    bestFor: [
      "Advanced climbers studying classic big-wall progression.",
      "适合研究经典大墙进阶路线的高阶攀岩者。"
    ],
    decisionHint: [
      "Choose it when you want the old-school wall experience to be part of the point.",
      "当你想要老派大墙气质本身就是目标时，选它。"
    ],
    practiceFocus: [
      ["endurance", "wide comfort", "wall strategy"],
      ["耐力", "宽裂适应", "大墙策略"]
    ],
    editorialTips: [
      [
        "Train patience as a skill, not just strength.",
        "Classic does not mean convenient; let that be part of the charm."
      ],
      [
        "把耐心当成技能来练，不只是练力量。",
        "经典不代表方便，这反而是它的一部分魅力。"
      ]
    ]
  }),
  "steck-salathe-route-sentinel-rock": routeCopy({
    style: [
      "Physical old-school granite with a reputation for character.",
      "身体感很强的老派花岗岩，性格相当鲜明。"
    ],
    summary: [
      "This is the card for climbers who secretly enjoy routes that make them negotiate with awkwardness.",
      "这张卡适合那些其实有点喜欢和别扭地形谈判的人。"
    ],
    bestFor: [
      "Climbers building confidence in physical Yosemite terrain.",
      "适合想增强优胜美地身体型地形信心的人。"
    ],
    decisionHint: [
      "Pick it when you want technique, grit, and a little old-school mischief.",
      "当你想要技术、韧性和一点老派调皮时，可以考虑它。"
    ],
    practiceFocus: [
      ["body positioning", "wide movement", "grit"],
      ["身体位置", "宽裂移动", "韧性"]
    ],
    editorialTips: [
      [
        "If the style sounds awkward, that is useful information, not a warning label.",
        "Bring humility; old routes have excellent memory."
      ],
      [
        "如果风格听起来别扭，那是有用信息，不一定是劝退标签。",
        "带上谦虚；老路线的记性通常很好。"
      ]
    ]
  }),
  "royal-arches-route": routeCopy({
    style: [
      "Long moderate Yosemite terrain with big classic-route energy.",
      "长距离、相对温和，但经典气场很足的优胜美地路线。"
    ],
    summary: [
      "Royal Arches is a big-day sampler: not the hardest voice in the room, but it knows how to take up space.",
      "Royal Arches 像一份大日子体验拼盘：不是最难的声音，但存在感很强。"
    ],
    bestFor: [
      "Climbers stepping into longer Yosemite objectives.",
      "适合正在走向更长优胜美地目标的攀岩者。"
    ],
    decisionHint: [
      "Choose it when you want mileage, teamwork, and a classic setting.",
      "当你想要里程、队伍配合和经典场景时，选它。"
    ],
    practiceFocus: [
      ["efficiency", "team pacing", "long-route confidence"],
      ["效率", "队伍节奏", "长路线信心"]
    ],
    editorialTips: [
      [
        "Use it to learn how your team behaves after the novelty wears off.",
        "Long moderate routes reward calm transitions."
      ],
      [
        "用它观察新鲜感过去后，你和队友的节奏如何。",
        "长距离适中路线很奖励冷静转换。"
      ]
    ]
  }),
  "separate-reality": routeCopy({
    style: [
      "A compact, famous roof-crack idea with big poster energy.",
      "短小但很有名的屋檐裂缝意象，海报感拉满。"
    ],
    summary: [
      "Separate Reality is for days when you want intensity, history, and a route name that already sounds like a dare.",
      "Separate Reality 适合想要强度、历史感，以及一个听起来就像挑战书的路线名。"
    ],
    bestFor: [
      "Strong climbers drawn to iconic single-pitch history.",
      "适合被经典单段历史吸引的强力攀岩者。"
    ],
    decisionHint: [
      "Pick it when you feel fresh and want a sharp, memorable test.",
      "当你状态新鲜，想要一个尖锐又难忘的测试时，考虑它。"
    ],
    practiceFocus: [
      ["roof strength", "breathing", "composure"],
      ["屋檐力量", "呼吸", "镇定"]
    ],
    editorialTips: [
      [
        "This is a good reminder that short routes can still feel enormous.",
        "Save your best attempts for when your body and head agree."
      ],
      [
        "它提醒你：短路线也可以感觉很巨大。",
        "把最好的尝试留给身体和脑袋都点头的时候。"
      ]
    ]
  }),
  "midnight-lightning-camp-4": routeCopy({
    style: [
      "A Camp 4 boulder with more mythology than some mountains.",
      "Camp 4 的抱石传奇，神话浓度比很多山还高。"
    ],
    summary: [
      "Midnight Lightning is for climbers who want history under their fingertips and do not mind a crowd of ghosts watching politely.",
      "Midnight Lightning 适合想把历史摸在手上的人，也适合不介意一群传说在旁边礼貌围观的人。"
    ],
    bestFor: [
      "Boulderers chasing a cultural landmark as much as a grade.",
      "适合追求文化地标感，而不只是追数字的抱石者。"
    ],
    decisionHint: [
      "Choose it when the story matters as much as the send.",
      "当故事和完攀一样重要时，选它。"
    ],
    practiceFocus: [
      ["precision", "power", "history"],
      ["精准", "力量", "历史感"]
    ],
    editorialTips: [
      [
        "Let the legend inspire you, not rush you.",
        "A famous problem is still just a problem: breathe, look, try well."
      ],
      [
        "让传奇激励你，不要催你。",
        "再有名的抱石也还是一块石头：呼吸、观察、好好尝试。"
      ]
    ]
  })
};

Object.assign(routeLocalizedContent, {
  "pure-imagination-red-river-gorge": routeCopy({
    style: ["Steep sandstone endurance with a famous name and a friendly pump alarm.", "陡峭砂岩耐力线，名字很梦幻，前臂提醒很现实。"],
    summary: ["Pure Imagination is the route-finder pick for climbers who want flow, pump, and a little golden-ticket energy.", "Pure Imagination 适合想要流动感、泵感和一点金票气质的攀岩者。"],
    bestFor: ["Sport climbers who like sustained movement and clear project rhythm.", "适合喜欢连续动作和清晰项目节奏的运动攀岩者。"],
    decisionHint: ["Pick it when endurance sounds fun instead of suspicious.", "当耐力听起来像乐趣，而不是可疑安排时，选它。"],
    practiceFocus: [["pump management", "route rhythm", "rest discipline"], ["泵感管理", "路线节奏", "休息纪律"]],
    editorialTips: [["Treat the pump like a conversation, not an emergency.", "Good rests are part of the style, not a pause in the story."], ["把泵感当成对话，不要当成警报。", "好的休息是风格的一部分，不是故事暂停。"]]
  }),
  "golden-ticket-red-river-gorge": routeCopy({
    style: ["Hard Red sport climbing with milestone sparkle.", "红河峡谷硬运动线，带一点里程碑的金色闪光。"],
    summary: ["Golden Ticket is for climbers who want a route that feels like a headline and a training plan at the same time.", "Golden Ticket 适合想要一条既像标题新闻、又像训练计划的路线。"],
    bestFor: ["Advanced sport climbers comparing high-end Red River Gorge goals.", "适合比较红河峡谷高端目标的进阶运动攀岩者。"],
    decisionHint: ["Choose it when you want a hard objective with a clear story hook.", "当你想要一个很硬、也很有故事钩子的目标时，选它。"],
    practiceFocus: [["power endurance", "project patience", "confidence"], ["力量耐力", "项目耐心", "信心"]],
    editorialTips: [["Let the name be fun, but let your pacing be boringly smart.", "Hard routes reward repeatable routines."], ["名字可以很有趣，节奏最好聪明到有点朴素。", "硬路线很奖励可重复的流程。"]]
  }),
  "southern-smoke-direct-red-river-gorge": routeCopy({
    style: ["A sharper version of Red River Gorge endurance and power.", "更尖锐的红河峡谷耐力与力量组合。"],
    summary: ["This is the choice when regular pump sounds too polite and you want the direct version of the conversation.", "当普通泵感听起来太客气，你想直接进入重点时，可以看它。"],
    bestFor: ["Strong climbers who want a serious, physical sport objective.", "适合想要认真、身体参与感强的运动攀目标的强力攀岩者。"],
    decisionHint: ["Pick it when you feel strong and want the route to know it.", "当你状态很强，也想让路线知道这件事时，选它。"],
    practiceFocus: [["limit endurance", "try quality", "mental reset"], ["极限耐力", "尝试质量", "心理重启"]],
    editorialTips: [["Do fewer attempts if it keeps them meaningful.", "Power endurance is still endurance; respect recovery."], ["如果能保证质量，就少做几次尝试。", "力量耐力也是耐力，请尊重恢复。"]]
  }),
  "southern-smoke-red-river-gorge": routeCopy({
    style: ["Classic steep Red River Gorge sport style with plenty of pump drama.", "经典红河峡谷陡壁运动风格，泵感戏份很足。"],
    summary: ["Southern Smoke is for climbers who want a famous steep line without pretending endurance is a side quest.", "Southern Smoke 适合想爬知名陡线，并承认耐力就是主线任务的人。"],
    bestFor: ["Sport climbers building confidence on sustained sandstone.", "适合在连续砂岩线路上建立信心的运动攀岩者。"],
    decisionHint: ["Choose it when you want a recognizable classic with real forearm stakes.", "当你想要一条知名经典，并且愿意让前臂参与投票时，选它。"],
    practiceFocus: [["forearm endurance", "movement economy", "calm pacing"], ["前臂耐力", "动作经济性", "冷静节奏"]],
    editorialTips: [["Efficiency is the quiet superpower here.", "If you climb like every move is urgent, the route will believe you."], ["效率是这里的安静超能力。", "如果每个动作都像紧急情况，路线会认真配合你。"]]
  }),
  "lucifer-red-river-gorge": routeCopy({
    style: ["Steep, serious Red sport climbing with a dramatic name.", "陡峭又认真的红河运动线，名字自带戏剧灯光。"],
    summary: ["Lucifer is a good pick when you want intensity and do not mind your route card sounding slightly theatrical.", "Lucifer 适合想要强度，也不介意路线卡听起来有点戏剧化的人。"],
    bestFor: ["Climbers who like powerful endurance challenges.", "适合喜欢力量耐力挑战的攀岩者。"],
    decisionHint: ["Pick it when you want a route that feels spicy before you even tie in.", "当你还没开始就想要一点辣味时，选它。"],
    practiceFocus: [["power endurance", "commitment", "breathing"], ["力量耐力", "投入度", "呼吸"]],
    editorialTips: [["Do not let a dramatic name make you climb dramatically.", "Stay boring, breathe well, and let the route be the theatrical one."], ["不要因为名字戏剧化，动作也跟着戏剧化。", "你负责稳定呼吸，让路线负责演出。"]]
  }),
  "twenty-four-karats-red-river-gorge": routeCopy({
    style: ["Friendly classic Red River Gorge sport flavor with golden-name charm.", "亲切的红河峡谷经典运动风味，名字也很会发光。"],
    summary: ["Twenty Four Karats is the warm, confidence-building side of the Red: still real climbing, just less grumpy.", "Twenty Four Karats 是红河更温暖、更建立信心的一面：依然认真，但没那么臭脸。"],
    bestFor: ["Climbers looking for a classic-feeling sport day.", "适合想要经典感运动攀一日的攀岩者。"],
    decisionHint: ["Choose it when you want quality movement without turning the day into a courtroom drama.", "当你想要好动作，但不想让今天变成审判现场时，选它。"],
    practiceFocus: [["lead rhythm", "confidence", "flow"], ["先锋节奏", "信心", "流动感"]],
    editorialTips: [["Use this kind of route to build calm mileage.", "Confidence grows faster when you are not fighting every decision."], ["用这类路线积累冷静里程。", "不用每个决定都打架时，信心长得更快。"]]
  }),
  "fifty-words-for-pump-red-river-gorge": routeCopy({
    style: ["A Red River Gorge endurance name that tells on itself.", "红河峡谷耐力线，名字已经把泵感剧透了。"],
    summary: ["This card is for climbers who want to practice making peace with the pump before it starts writing poetry.", "这张卡适合想在泵感开始写诗前，先学会和它和平相处的人。"],
    bestFor: ["Climbers training endurance and pacing in a playful way.", "适合用轻松方式练耐力和节奏的人。"],
    decisionHint: ["Pick it when your goal is to manage pump, not pretend it will skip you.", "当目标是管理泵感，而不是假装它会放过你时，选它。"],
    practiceFocus: [["pump awareness", "pacing", "humor"], ["泵感觉察", "节奏", "幽默感"]],
    editorialTips: [["Name your pump, then keep climbing thoughtfully.", "A little humor can keep a hard session from becoming heavy."], ["给泵感取个名字，然后继续聪明地爬。", "一点幽默能让艰难 session 不那么沉。"]]
  }),
  "omaha-beach-red-river-gorge": routeCopy({
    style: ["A widely known Red route card for approachable sport mileage.", "一张红河经典运动攀里程卡，适合更亲近的目标。"],
    summary: ["Omaha Beach is useful when you want the Red River Gorge feeling without immediately volunteering your forearms for a trial by fire.", "Omaha Beach 适合想体验红河风格，但不想马上把前臂送去火焰审判的人。"],
    bestFor: ["Climbers building sport confidence and movement rhythm.", "适合建立运动攀信心和动作节奏的攀岩者。"],
    decisionHint: ["Choose it when you want a friendlier entry into the Red's route menu.", "当你想用更友好的方式进入红河路线菜单时，选它。"],
    practiceFocus: [["confidence", "movement economy", "lead rhythm"], ["信心", "动作经济性", "先锋节奏"]],
    editorialTips: [["Let approachable routes teach you efficiency before harder ones demand it.", "Good mileage is not filler; it is training with better scenery."], ["先让亲近路线教你效率，再让难路线来考试。", "好的里程不是填空，是风景更好的训练。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "cobra-crack-squamish": routeCopy({
    style: ["A hard granite crack benchmark with global reputation.", "世界级名声的硬花岗岩裂缝标杆。"],
    summary: ["Cobra Crack is the choice when your fingers feel brave and your ego has signed the waiver.", "Cobra Crack 适合手指很勇、 ego 也已经签好免责书的时候。"],
    bestFor: ["Elite crack climbers and hard-trad history nerds.", "适合精英裂缝攀岩者，以及硬 trad 历史爱好者。"],
    decisionHint: ["Pick it when you want a single route to feel like a whole research project.", "当你想让一条路线像一整个研究项目时，选它。"],
    practiceFocus: [["finger strength", "crack craft", "patience"], ["手指力量", "裂缝技术", "耐心"]],
    editorialTips: [["Respect skin, conditions, and recovery like they are part of the grade.", "A famous crack does not care how famous it is."], ["像尊重难度一样尊重皮肤、条件和恢复。", "有名的裂缝并不会因为自己有名就变好说话。"]]
  }),
  "grand-wall-squamish": routeCopy({
    style: ["A big Squamish granite experience with route-story gravity.", "很有路线故事重量的斯阔米什花岗岩大体验。"],
    summary: ["The Grand Wall is for teams who want the Chief to feel like a real chapter, not just a backdrop.", "Grand Wall 适合想让 Chief 成为一整章，而不只是背景板的队伍。"],
    bestFor: ["Experienced climbers comparing long Squamish classics.", "适合比较斯阔米什长线经典的有经验攀岩者。"],
    decisionHint: ["Choose it when you want a route day with size, variety, and memory.", "当你想要有规模、有变化、也有记忆点的一天时，选它。"],
    practiceFocus: [["team rhythm", "granite variety", "endurance"], ["队伍节奏", "花岗岩变化", "耐力"]],
    editorialTips: [["A long classic rewards calm organization.", "Let the route be grand; your systems can stay simple."], ["长线经典很奖励冷静组织。", "路线可以宏大，你的系统最好简单。"]]
  }),
  "banana-peel-squamish": routeCopy({
    style: ["Moderate Squamish granite with a friendly classic feel.", "较亲切的斯阔米什花岗岩经典风格。"],
    summary: ["Banana Peel is a good day when you want granite mileage without turning the outing into a personality test.", "Banana Peel 适合想要花岗岩里程，但不想让今天变成人格测试的时候。"],
    bestFor: ["Climbers building confidence on multi-pitch granite.", "适合在多段花岗岩上建立信心的人。"],
    decisionHint: ["Pick it when you want approachable classic mileage.", "当你想要亲近、经典、能积累经验的里程时，选它。"],
    practiceFocus: [["confidence", "movement flow", "team basics"], ["信心", "动作流动", "队伍基础"]],
    editorialTips: [["Use friendlier classics to make systems feel natural.", "A relaxed route day can still teach a lot."], ["用亲切经典让系统变得自然。", "轻松一点的路线日也能教很多东西。"]]
  }),
  "split-pillar-squamish": routeCopy({
    style: ["A striking granite crack feature with classic Squamish texture.", "很有辨识度的花岗岩裂缝特征，斯阔米什质感很强。"],
    summary: ["Split Pillar is for climbers who like their objectives obvious, proud, and a little intimidating in the best way.", "Split Pillar 适合喜欢目标清楚、线条骄傲、并且有点健康压迫感的人。"],
    bestFor: ["Crack climbers drawn to memorable granite features.", "适合被明显花岗岩特征吸引的裂缝攀岩者。"],
    decisionHint: ["Choose it when the feature itself makes you want to tie in.", "当岩壁特征本身就让你想开始时，选它。"],
    practiceFocus: [["crack rhythm", "composure", "feature reading"], ["裂缝节奏", "镇定", "特征阅读"]],
    editorialTips: [["Big features can make you rush; slow down enough to read them.", "Let the shape guide the mood, not your nerves."], ["大特征容易让人急，慢下来读它。", "让形状带节奏，不要让紧张带节奏。"]]
  }),
  "rutabaga-squamish": routeCopy({
    style: ["A lower-grade Squamish reference for technical granite practice.", "较低难度的斯阔米什花岗岩技术练习参考。"],
    summary: ["Rutabaga is the humble vegetable of the route list: not flashy, very useful, and probably better than your ego expected.", "Rutabaga 像路线菜单里的朴素蔬菜：不炫，但有用，可能比你的 ego 预期更好。"],
    bestFor: ["Climbers who want technique practice without high drama.", "适合想练技术但不想戏剧化的一天。"],
    decisionHint: ["Pick it when you want useful mileage over bragging rights.", "当你想要有用里程胜过炫耀资本时，选它。"],
    practiceFocus: [["footwork", "confidence", "granite basics"], ["脚法", "信心", "花岗岩基础"]],
    editorialTips: [["Small objectives can fix big habits.", "This is a good card for learning, not proving."], ["小目标可以修正大习惯。", "这张卡适合学习，不是证明自己。"]]
  }),
  "tom-egan-memorial-route-squamish": routeCopy({
    style: ["A hard Squamish reference with memorial-route seriousness.", "一条带纪念意义的斯阔米什高难参考线。"],
    summary: ["This card is for climbers who want a demanding objective with a name that asks for respect before excitement.", "这张卡适合想要高要求目标，并且愿意先带上尊重、再带上兴奋的人。"],
    bestFor: ["Advanced climbers studying Squamish hard-route history.", "适合研究斯阔米什高难路线历史的进阶攀岩者。"],
    decisionHint: ["Choose it when seriousness is part of the attraction.", "当认真本身就是吸引力的一部分时，选它。"],
    practiceFocus: [["technical power", "project patience", "respect"], ["技术力量", "项目耐心", "尊重"]],
    editorialTips: [["Let the name set the tone: focused, patient, and thoughtful.", "Hard routes are better approached with fewer fantasies and better habits."], ["让名字定调：专注、耐心、认真。", "面对硬路线，少一点幻想，多一点好习惯。"]]
  }),
  "split-tailed-beaver-squamish": routeCopy({
    style: ["A playful-name Squamish route card with real granite usefulness.", "名字很玩，但花岗岩练习价值很实在的斯阔米什路线卡。"],
    summary: ["Split-Tailed Beaver keeps the list from taking itself too seriously while still pointing toward useful movement practice.", "Split-Tailed Beaver 让路线清单别太严肃，同时仍然指向有用的动作练习。"],
    bestFor: ["Climbers looking for style variety and lighter project energy.", "适合想要风格变化和轻一点项目气氛的人。"],
    decisionHint: ["Pick it when the day needs granite, not solemn ceremony.", "当今天需要花岗岩，而不是庄重仪式时，选它。"],
    practiceFocus: [["movement variety", "confidence", "granite reading"], ["动作变化", "信心", "花岗岩阅读"]],
    editorialTips: [["A funny name does not mean throwaway climbing.", "Use lower-pressure routes to notice details."], ["名字有趣不代表攀登可以随便。", "用低压力路线观察细节。"]]
  }),
  "shock-wall-squamish": routeCopy({
    style: ["A Squamish hard-route reference with sharp technical energy.", "带尖锐技术感的斯阔米什高难参考线。"],
    summary: ["Shock Wall is for days when you want the route finder to point toward something crisp, difficult, and not especially forgiving.", "Shock Wall 适合想让路线推荐指向清晰、很难、而且不太会放水的目标。"],
    bestFor: ["Strong climbers comparing harder Squamish candidates.", "适合比较斯阔米什较难目标的强力攀岩者。"],
    decisionHint: ["Choose it when you want a serious technical challenge.", "当你想要认真技术挑战时，选它。"],
    practiceFocus: [["precision", "strength", "try quality"], ["精准", "力量", "尝试质量"]],
    editorialTips: [["Let difficulty sharpen your attention instead of your panic.", "Quality attempts matter more than collecting tries."], ["让难度提高注意力，不要提高恐慌。", "高质量尝试比收集次数更重要。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "la-marie-rose-fontainebleau": routeCopy({
    style: ["A historic Fontainebleau slab/technical classic with old-school charm.", "带老派魅力的枫丹白露历史技术经典。"],
    summary: ["La Marie-Rose is a reminder that a boulder can be famous without needing to shout.", "La Marie-Rose 提醒你：一块抱石可以很有名，却不需要大声嚷嚷。"],
    bestFor: ["Climbers curious about Fontainebleau history and movement quality.", "适合对枫丹白露历史和动作质量感兴趣的人。"],
    decisionHint: ["Pick it when you want a classic lesson in quiet precision.", "当你想上一堂安静精准的经典课时，选它。"],
    practiceFocus: [["footwork", "balance", "history"], ["脚法", "平衡", "历史感"]],
    editorialTips: [["Do not underestimate old classics; they have excellent manners and sharp elbows.", "Let your feet do more talking than your arms."], ["不要小看老经典；它们很有礼貌，也很会用手肘。", "让脚比手说更多话。"]]
  }),
  "labattoir-fontainebleau": routeCopy({
    style: ["A compact Fontainebleau power-and-position puzzle.", "短小但很考位置和力量的枫丹抱石谜题。"],
    summary: ["L'Abattoir is for days when you want a classic that feels direct, physical, and blunt in a useful way.", "L'Abattoir 适合想要直接、身体参与感强、而且不客气但很有用的经典。"],
    bestFor: ["Boulderers practicing commitment on short classic problems.", "适合在短经典上练投入度的抱石者。"],
    decisionHint: ["Choose it when you want a clear little test, not a long negotiation.", "当你想要一个清楚的小测试，而不是长谈判时，选它。"],
    practiceFocus: [["body tension", "commitment", "precision"], ["身体张力", "投入度", "精准"]],
    editorialTips: [["Short does not mean simple; give the problem full attention.", "A good attempt starts before your hands leave the ground."], ["短不代表简单，请给它完整注意力。", "好的尝试在手离地前就开始了。"]]
  }),
  "le-joker-fontainebleau": routeCopy({
    style: ["A Fontainebleau classic with playful technical character.", "带一点顽皮技术感的枫丹白露经典。"],
    summary: ["Le Joker feels like a raised eyebrow in route form: fun, famous, and not here to do the work for you.", "Le Joker 像一张会挑眉的路线卡：有趣、有名，但不会替你把活干了。"],
    bestFor: ["Climbers who enjoy solving movement rather than forcing it.", "适合喜欢解动作，而不是硬拽过去的人。"],
    decisionHint: ["Pick it when you want technique with a grin.", "当你想要带一点笑意的技术题时，选它。"],
    practiceFocus: [["movement reading", "body position", "play"], ["动作阅读", "身体位置", "玩心"]],
    editorialTips: [["If it feels silly, check whether the silly idea is actually correct.", "Fontainebleau often rewards curiosity before force."], ["如果动作感觉有点傻，先看看它是不是其实很对。", "枫丹常常先奖励好奇心，再奖励力量。"]]
  }),
  "le-carnage-fontainebleau": routeCopy({
    style: ["A hard Fontainebleau benchmark with sharp bouldering focus.", "高难枫丹标杆，抱石专注度很高。"],
    summary: ["Le Carnage is for climbers who want the forest to stop whispering and start asking difficult questions.", "Le Carnage 适合想让森林停止低语、开始问难题的人。"],
    bestFor: ["Strong boulderers comparing historic hard Fontainebleau lines.", "适合比较枫丹历史高难线的强力抱石者。"],
    decisionHint: ["Choose it when you want a serious power-and-precision target.", "当你想要认真力量加精准目标时，选它。"],
    practiceFocus: [["power", "precision", "session control"], ["力量", "精准", "session 控制"]],
    editorialTips: [["Hard classics reward calm repetition, not dramatic suffering.", "Protect your skin and attention equally."], ["高难经典奖励冷静重复，不奖励戏剧化受苦。", "同等保护皮肤和注意力。"]]
  }),
  "labbe-resina-fontainebleau": routeCopy({
    style: ["A Fontainebleau high-end reference with history in the holds.", "一条手点里带着历史感的枫丹高端参考线。"],
    summary: ["L'Abbe Resina is for climbers who like their boulders famous, difficult, and quietly judgmental.", "L'Abbe Resina 适合喜欢有名、困难、还安静评判你的抱石的人。"],
    bestFor: ["Advanced boulderers studying Fontainebleau difficulty history.", "适合研究枫丹难度历史的进阶抱石者。"],
    decisionHint: ["Pick it when you want a hard classic with a deep forest mood.", "当你想要一条森林气息很深的高难经典时，选它。"],
    practiceFocus: [["finger strength", "body tension", "patience"], ["手指力量", "身体张力", "耐心"]],
    editorialTips: [["Let the history motivate you, not rush you.", "A hard forest problem is a conversation across sessions."], ["让历史激励你，不要催你。", "高难森林抱石通常是跨 session 的对话。"]]
  }),
  "c-etait-demain-fontainebleau": routeCopy({
    style: ["A futuristic Fontainebleau classic with technical imagination.", "带未来感的枫丹经典，很考动作想象力。"],
    summary: ["C'etait Demain is for climbers who enjoy the moment when a strange idea suddenly becomes the obvious one.", "C'etait Demain 适合喜欢那种“奇怪想法突然变成正确答案”的人。"],
    bestFor: ["Boulderers who want technical creativity and classic status.", "适合想要技术创造力和经典地位兼具的抱石者。"],
    decisionHint: ["Choose it when you want to think with your whole body.", "当你想用整个身体思考时，选它。"],
    practiceFocus: [["creativity", "footwork", "body puzzle"], ["创造力", "脚法", "身体谜题"]],
    editorialTips: [["Try smarter before trying harder.", "Fontainebleau problems often reward the idea you almost dismissed."], ["先试着更聪明，再试着更用力。", "枫丹经常奖励那个你差点忽略的想法。"]]
  }),
  "the-big-island-fontainebleau": routeCopy({
    style: ["A modern hard Fontainebleau line with big-stage bouldering energy.", "现代高难枫丹线，抱石舞台感很强。"],
    summary: ["The Big Island is for climbers who want the forest to feel like a world cup final, but with more sand.", "The Big Island 适合想让森林有点像世界杯决赛、只是沙子更多的人。"],
    bestFor: ["Elite boulderers tracking modern Fontainebleau benchmarks.", "适合关注现代枫丹标杆的精英抱石者。"],
    decisionHint: ["Pick it when limit bouldering is the whole plan.", "当极限抱石就是全部计划时，选它。"],
    practiceFocus: [["limit power", "conditions", "attempt quality"], ["极限力量", "条件", "尝试质量"]],
    editorialTips: [["Conditions and timing can be part of the difficulty.", "Do not confuse more tries with better tries."], ["条件和时机也可能是难度的一部分。", "不要把更多尝试误认为更好尝试。"]]
  }),
  "soudain-seul-fontainebleau": routeCopy({
    style: ["An elite Fontainebleau boulder with modern grade-discussion gravity.", "带现代难度讨论重量的精英枫丹抱石。"],
    summary: ["Soudain Seul is the card for when inspiration is useful even if the route is not today's realistic plan.", "Soudain Seul 适合当作灵感卡，即使它不一定是今天的现实计划。"],
    bestFor: ["Elite climbers and readers tracking the top end of bouldering.", "适合精英攀岩者和关注抱石顶端发展的读者。"],
    decisionHint: ["Choose it as inspiration unless your current season truly points there.", "除非你的当前周期真的指向它，否则先把它当灵感。"],
    practiceFocus: [["elite power", "grade perspective", "long-term vision"], ["精英力量", "难度判断", "长期视角"]],
    editorialTips: [["Aspirational routes are useful when they clarify training, not when they inflate ego.", "Let the grade discussion stay honest and flexible."], ["灵感路线的价值在于明确训练，不是膨胀 ego。", "让难度讨论保持诚实和弹性。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "spartacus-kalymnos": routeCopy({
    style: ["Sunny Kalymnos limestone endurance with vacation-brain temptation.", "阳光卡林诺斯灰岩耐力线，很容易诱发假期脑袋。"],
    summary: ["Spartacus is for climbers who want the island mood but still want their forearms to have a meaningful day.", "Spartacus 适合想要海岛心情，同时也想让前臂过得有意义的人。"],
    bestFor: ["Sport climbers chasing flow, tufas, and steady effort.", "适合追求流动感、tufas 和稳定输出的运动攀岩者。"],
    decisionHint: ["Pick it when you want fun to include a real pump.", "当你希望快乐里包含真实泵感时，选它。"],
    practiceFocus: [["tufa rhythm", "endurance", "breathing"], ["tufa 节奏", "耐力", "呼吸"]],
    editorialTips: [["Do not let the sea view talk you into skipping warm-up discipline.", "Flow comes faster when you climb less frantically."], ["不要让海景说服你跳过热身纪律。", "不慌的时候，流动感来得更快。"]]
  }),
  "priapios-kalymnos": routeCopy({
    style: ["Steep limestone power-endurance with classic Kalymnos flavor.", "陡峭灰岩力量耐力，卡林诺斯味道很足。"],
    summary: ["Priapios is a good choice when you want the island to stop being only pretty and start being athletic.", "Priapios 适合当你希望海岛不只是漂亮，也开始有运动强度的时候。"],
    bestFor: ["Climbers who like steep sport routes with memorable movement.", "适合喜欢陡峭运动线和有记忆点动作的人。"],
    decisionHint: ["Choose it when you feel ready for the fun to get physical.", "当你准备好让快乐变得更身体化时，选它。"],
    practiceFocus: [["power endurance", "steep movement", "confidence"], ["力量耐力", "陡壁移动", "信心"]],
    editorialTips: [["Keep the mood light, but the pacing smart.", "Steep limestone likes climbers who rest before they are desperate."], ["心情可以轻，节奏要聪明。", "陡灰岩喜欢还没绝望就会休息的人。"]]
  }),
  "dna-kalymnos": routeCopy({
    style: ["Approachable Kalymnos limestone for movement confidence.", "更亲近的卡林诺斯灰岩，适合建立动作信心。"],
    summary: ["DNA is a friendly strand in the Kalymnos route genome: useful, sunny, and not trying to ruin lunch.", "DNA 是卡林诺斯路线基因里比较友好的一段：有用、阳光，也不打算毁掉午餐。"],
    bestFor: ["Climbers building limestone rhythm and lead confidence.", "适合建立灰岩节奏和先锋信心的人。"],
    decisionHint: ["Pick it when you want a confidence route with real style practice.", "当你想要有风格练习的信心路线时，选它。"],
    practiceFocus: [["confidence", "limestone basics", "flow"], ["信心", "灰岩基础", "流动感"]],
    editorialTips: [["Good moderate routes are where better habits get installed.", "Use the easier day to notice how you move."], ["好的适中路线最适合安装好习惯。", "用轻松一点的日子观察自己怎么移动。"]]
  }),
  "aegialis-kalymnos": routeCopy({
    style: ["Sea-air limestone style with steady sport climbing rhythm.", "带海风气息的灰岩运动节奏。"],
    summary: ["Aegialis fits the day when you want to climb, breathe, look around, and remember this is supposed to be fun.", "Aegialis 适合想爬、想呼吸、想看看周围，并记得攀岩本该有趣的日子。"],
    bestFor: ["Climbers seeking flow and lower-pressure mileage.", "适合寻找流动感和低压力里程的人。"],
    decisionHint: ["Choose it when the goal is rhythm over drama.", "当目标是节奏，而不是戏剧冲突时，选它。"],
    practiceFocus: [["flow", "lead rhythm", "relaxed focus"], ["流动", "先锋节奏", "放松专注"]],
    editorialTips: [["Let a friendly route teach you to climb smoothly.", "If the day feels easy, practice making it elegant."], ["让亲切路线教你爬得顺。", "如果今天感觉轻松，就练习爬得漂亮。"]]
  }),
  "trella-kalymnos": routeCopy({
    style: ["Kalymnos sport climbing with playful, energetic character.", "有玩心和能量感的卡林诺斯运动线。"],
    summary: ["Trella is for climbers who want the route list to smile a bit while still giving them something to work on.", "Trella 适合想让路线清单笑一笑，同时也给自己一点练习目标的人。"],
    bestFor: ["Sport climbers mixing fun, confidence, and effort.", "适合把乐趣、信心和努力混在一起的运动攀岩者。"],
    decisionHint: ["Pick it when the day wants energy, not solemnity.", "当今天需要能量，而不是庄严感时，选它。"],
    practiceFocus: [["confidence", "movement flow", "energy"], ["信心", "动作流动", "能量"]],
    editorialTips: [["Playful does not mean careless.", "Use fun routes to practice staying relaxed under effort."], ["有玩心不代表随便。", "用有趣路线练习在出力时保持放松。"]]
  }),
  "fun-de-chichunne-kalymnos": routeCopy({
    style: ["A Kalymnos route card that says the quiet part out loud: have fun.", "一张把重点说出来的卡林诺斯路线卡：好好玩。"],
    summary: ["Fun de Chichunne is for days when you want your climbing to feel like movement practice with sunlight on it.", "Fun de Chichunne 适合想让攀岩像晒着太阳的动作练习一样的日子。"],
    bestFor: ["Climbers choosing lighthearted limestone mileage.", "适合选择轻松灰岩里程的人。"],
    decisionHint: ["Choose it when joy is the training plan.", "当快乐就是训练计划时，选它。"],
    practiceFocus: [["joy", "flow", "confidence"], ["乐趣", "流动感", "信心"]],
    editorialTips: [["A fun day can still build real skill.", "Notice what changes when you stop trying to impress the route."], ["有趣的一天也能建立真实技能。", "当你不再试图给路线留下深刻印象时，观察会发生什么。"]]
  }),
  "joggel-and-toggel-kalymnos": routeCopy({
    style: ["Kalymnos limestone with a silly-name, useful-mileage personality.", "名字可爱、里程实用的卡林诺斯灰岩路线。"],
    summary: ["Joggel and Toggel is for climbers who understand that silly route names can still teach good habits.", "Joggel and Toggel 适合明白可爱路线名也能教好习惯的人。"],
    bestFor: ["Climbers practicing smooth sport climbing without heavy pressure.", "适合无重压练习顺畅运动攀的人。"],
    decisionHint: ["Pick it when you want useful practice with a grin.", "当你想带着笑练有用技能时，选它。"],
    practiceFocus: [["smooth movement", "confidence", "breathing"], ["顺畅移动", "信心", "呼吸"]],
    editorialTips: [["Take the climbing seriously, not yourself.", "Light pressure is great for learning movement details."], ["认真对待攀岩，不必太认真对待自己。", "低压力很适合学习动作细节。"]]
  }),
  "monahiki-elia-kalymnos": routeCopy({
    style: ["A Kalymnos limestone line for steady sport-climbing rhythm.", "适合稳定运动攀节奏的卡林诺斯灰岩线。"],
    summary: ["Monahiki Elia is a useful route-finder pick when you want the island mood with enough structure to call it training.", "Monahiki Elia 适合想要海岛氛围，同时又想让它像训练的一天。"],
    bestFor: ["Climbers seeking balanced movement and confidence mileage.", "适合寻找平衡动作和信心里程的人。"],
    decisionHint: ["Choose it when you want a calm, productive climbing day.", "当你想要平静又有产出的一天时，选它。"],
    practiceFocus: [["rhythm", "confidence", "movement economy"], ["节奏", "信心", "动作经济性"]],
    editorialTips: [["A balanced day is still a good day.", "Use steady routes to make your baseline stronger."], ["平衡的一天依然是好日子。", "用稳定路线把基础线抬高。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "double-cross-joshua-tree": routeCopy({
    style: ["Classic desert crack climbing with old-school charm.", "老派气质很足的沙漠裂缝经典。"],
    summary: ["Double Cross is a good pick when you want Joshua Tree history in a compact, no-nonsense package.", "Double Cross 适合想用紧凑方式体验约书亚树历史感的人。"],
    bestFor: ["Climbers who want classic trad flavor and steady movement.", "适合想要经典 trad 味道和稳定动作的人。"],
    decisionHint: ["Pick it when you want a short route that still has a long memory.", "当你想要一条短，但很有记忆点的路线时，选它。"],
    practiceFocus: [["crack basics", "calm movement", "desert footwork"], ["裂缝基础", "冷静移动", "沙漠脚法"]],
    editorialTips: [["Let the classic status sharpen your attention, not your nerves.", "Desert cracks reward rhythm more than drama."], ["让经典地位提高注意力，不要提高紧张感。", "沙漠裂缝奖励节奏，不奖励戏剧化。"]]
  }),
  "equinox-joshua-tree": routeCopy({
    style: ["Hard desert crack power with benchmark energy.", "很硬的沙漠裂缝力量线，标杆感明显。"],
    summary: ["Equinox is for climbers who want a clean, serious crack objective that does not waste many words.", "Equinox 适合想要干净、认真、废话不多的裂缝目标的人。"],
    bestFor: ["Strong crack climbers looking for a high-end desert test.", "适合寻找高端沙漠测试的强力裂缝攀岩者。"],
    decisionHint: ["Choose it when your fingers feel ready for a focused conversation.", "当你的手指准备好认真谈话时，考虑它。"],
    practiceFocus: [["finger strength", "crack power", "composure"], ["手指力量", "裂缝力量", "镇定"]],
    editorialTips: [["A hard crack is not impressed by hype.", "Save your best attempts for your freshest head and skin."], ["硬裂缝不会被气势打动。", "把最好的尝试留给脑袋和皮肤都新鲜的时候。"]]
  }),
  "planet-x-joshua-tree": routeCopy({
    style: ["Desert bouldering style with body tension and commitment.", "带身体张力和投入感的沙漠抱石风格。"],
    summary: ["Planet X is the route-list oddball for days when you want your movement to feel slightly otherworldly.", "Planet X 适合想让动作有点外星感的日子。"],
    bestFor: ["Boulderers who like focused movement problems in a desert setting.", "适合喜欢沙漠场景中专注动作题的抱石者。"],
    decisionHint: ["Pick it when you want a compact problem with personality.", "当你想要一块短小但有性格的抱石时，选它。"],
    practiceFocus: [["body tension", "precision", "commitment"], ["身体张力", "精准", "投入度"]],
    editorialTips: [["Short problems can still ask big questions.", "Use the desert quiet to notice small body-position changes."], ["短问题也会问大问题。", "利用沙漠的安静观察身体位置的小变化。"]]
  }),
  "so-high-joshua-tree": routeCopy({
    style: ["A famous Joshua Tree highball with mental weight.", "约书亚树知名高球抱石，心理分量很足。"],
    summary: ["So High is for climbers who understand that height can change the entire flavor of a grade.", "So High 适合明白高度会改变整个难度味道的人。"],
    bestFor: ["Experienced boulderers thinking carefully about headspace.", "适合认真评估心理状态的有经验抱石者。"],
    decisionHint: ["Choose it when mental readiness is the main reason, not an afterthought.", "当心理准备是核心理由，而不是事后补充时，才考虑它。"],
    practiceFocus: [["highball judgment", "calm movement", "risk honesty"], ["高球判断", "冷静移动", "风险诚实"]],
    editorialTips: [["If the height is the point, respect the height.", "A brave choice can also be choosing something else today."], ["如果高度就是重点，请尊重高度。", "勇敢有时也包括今天选择别的目标。"]]
  }),
  "illusion-dweller-joshua-tree": routeCopy({
    style: ["Joshua Tree crack and face climbing with classic desert texture.", "带经典沙漠质感的约书亚树裂缝与面攀风格。"],
    summary: ["Illusion Dweller is for climbers who want a real Joshua Tree experience without only chasing the biggest names.", "Illusion Dweller 适合想要真实约书亚树体验，而不只是追最大名气的人。"],
    bestFor: ["Climbers practicing trad composure and desert movement.", "适合练 trad 镇定和沙漠移动的人。"],
    decisionHint: ["Pick it when you want style mileage with a classic feel.", "当你想要有经典感的风格里程时，选它。"],
    practiceFocus: [["trad composure", "crack technique", "desert movement"], ["trad 镇定", "裂缝技术", "沙漠移动"]],
    editorialTips: [["Let the route teach patience before intensity.", "Desert style often rewards quiet feet and quieter ego."], ["先让路线教耐心，再谈强度。", "沙漠风格常奖励安静的脚和更安静的 ego。"]]
  }),
  "figures-on-a-landscape-joshua-tree": routeCopy({
    style: ["Technical desert face climbing with visual drama.", "画面感很强的沙漠技术面攀。"],
    summary: ["Figures on a Landscape is for days when you want a route that feels drawn onto the desert rather than merely listed in it.", "Figures on a Landscape 适合想爬一条像画在沙漠上，而不只是写在清单里的路线。"],
    bestFor: ["Climbers drawn to precision, friction, and a memorable setting.", "适合被精准、摩擦和强场景感吸引的人。"],
    decisionHint: ["Choose it when movement quality matters more than brute force.", "当动作质量比蛮力更重要时，选它。"],
    practiceFocus: [["face climbing", "foot precision", "mental composure"], ["面攀", "脚点精准", "心理镇定"]],
    editorialTips: [["Treat the route like a drawing: read the lines before adding force.", "Good footwork makes the desert feel less mysterious."], ["把路线当成一幅画：先读线，再发力。", "好脚法会让沙漠少一点神秘。"]]
  }),
  "sail-away-joshua-tree": routeCopy({
    style: ["Friendly classic desert trad with confidence-building energy.", "比较友好的沙漠 trad 经典，适合建立信心。"],
    summary: ["Sail Away is for climbers who want a classic day that feels more like catching wind than fighting weather.", "Sail Away 适合想要一条像顺风而行，而不是跟天气打架的经典路线。"],
    bestFor: ["Climbers building moderate trad flow.", "适合建立适中 trad 流动感的人。"],
    decisionHint: ["Pick it when you want useful mileage with a lighter mood.", "当你想要有用里程，同时心情轻一点时，选它。"],
    practiceFocus: [["moderate trad flow", "footwork", "confidence"], ["适中 trad 节奏", "脚法", "信心"]],
    editorialTips: [["Good moderate routes are where calm systems become habits.", "Enjoy the ease without turning your brain off."], ["好的适中路线最适合把冷静系统变成习惯。", "享受轻松，但不要关掉脑袋。"]]
  }),
  "white-rastafarian-joshua-tree": routeCopy({
    style: ["A well-known Joshua Tree bouldering reference with desert grit.", "约书亚树知名抱石参考线，沙漠颗粒感很强。"],
    summary: ["White Rastafarian is a good card when you want Joshua Tree bouldering to feel historic, physical, and a little sun-baked.", "White Rastafarian 适合想让约书亚树抱石有历史感、身体感和一点晒太阳味道的时候。"],
    bestFor: ["Boulderers comparing classic desert problems.", "适合比较经典沙漠抱石的人。"],
    decisionHint: ["Choose it when you want a boulder problem with cultural weight.", "当你想要一块有文化分量的抱石时，选它。"],
    practiceFocus: [["bouldering movement", "body position", "friction"], ["抱石动作", "身体位置", "摩擦"]],
    editorialTips: [["Classic boulders are not museum pieces; climb them with attention.", "Let texture and timing guide your effort."], ["经典抱石不是博物馆展品；认真地爬它。", "让岩面质感和时机带着你出力。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "to-bolt-or-not-to-be-smith-rock": routeCopy({
    style: ["Smith Rock sport history with technical bite.", "带技术锋利感的 Smith Rock 运动攀历史线。"],
    summary: ["To Bolt or Not to Be is for climbers who want the route card to feel like a history lesson with forearm consequences.", "To Bolt or Not to Be 适合想上一堂带前臂后果的攀岩历史课的人。"],
    bestFor: ["Sport climbers drawn to technical classics and milestone routes.", "适合被技术经典和里程碑路线吸引的运动攀岩者。"],
    decisionHint: ["Pick it when the story is part of the motivation.", "当故事本身就是动力的一部分时，选它。"],
    practiceFocus: [["sport history", "technical power", "project patience"], ["运动攀历史", "技术力量", "项目耐心"]],
    editorialTips: [["Let the history inspire better preparation, not louder ego.", "Technical routes notice sloppy confidence very quickly."], ["让历史激励更好的准备，而不是更响的 ego。", "技术路线很快就会发现潦草的自信。"]]
  }),
  "chain-reaction-smith-rock": routeCopy({
    style: ["Iconic Smith Rock sport climbing with poster-level recognition.", "海报级辨识度的 Smith Rock 运动攀经典。"],
    summary: ["Chain Reaction is for days when you want the shape, the story, and the feeling of touching a famous chapter.", "Chain Reaction 适合想要形状、故事和触碰名篇感觉的一天。"],
    bestFor: ["Climbers who want a famous route with real movement demands.", "适合想要知名路线，也愿意面对真实动作要求的人。"],
    decisionHint: ["Choose it when iconic is useful fuel, not distracting noise.", "当经典名气是燃料，而不是干扰噪音时，选它。"],
    practiceFocus: [["power endurance", "composure", "route reading"], ["力量耐力", "镇定", "读线"]],
    editorialTips: [["Famous does not mean automatic; stay curious.", "A recognizable route still deserves a fresh read."], ["有名不等于自动完成；保持好奇。", "辨识度高的路线也值得重新阅读。"]]
  }),
  "just-do-it-smith-rock": routeCopy({
    style: ["A high-end Smith Rock sport benchmark with serious intent.", "高端 Smith Rock 运动攀标杆，态度很认真。"],
    summary: ["Just Do It is the card for climbers who want a route name that sounds simple and a process that definitely is not.", "Just Do It 适合想要一个听起来简单、过程绝不简单的目标。"],
    bestFor: ["Advanced sport climbers studying hard-route progression.", "适合研究高难运动攀进阶的高级攀岩者。"],
    decisionHint: ["Pick it when you want a long-view project, not instant motivation merch.", "当你想要长期项目，而不是一句口号时，选它。"],
    practiceFocus: [["elite endurance", "discipline", "mental reset"], ["精英耐力", "纪律", "心理重启"]],
    editorialTips: [["A slogan is not a strategy.", "Hard projects reward boring consistency more than big speeches."], ["口号不是策略。", "硬项目奖励无聊但稳定的坚持，而不是豪言壮语。"]]
  }),
  "heinous-cling-smith-rock": routeCopy({
    style: ["Technical Smith Rock sport climbing with finger-endurance flavor.", "带手指耐力味道的 Smith Rock 技术运动线。"],
    summary: ["Heinous Cling is for climbers who enjoy routes that sound rude but teach useful precision.", "Heinous Cling 适合喜欢名字有点不客气、但能教精准的人。"],
    bestFor: ["Climbers practicing technical power and sustained focus.", "适合练技术力量和持续专注的人。"],
    decisionHint: ["Choose it when you want your fingers and feet in the same meeting.", "当你想让手指和脚一起开会时，选它。"],
    practiceFocus: [["finger endurance", "precision", "sport pacing"], ["手指耐力", "精准", "运动攀节奏"]],
    editorialTips: [["Let small holds make you quieter, not frantic.", "If the name sounds dramatic, your climbing does not have to be."], ["让小点让你更安静，不要更慌。", "名字可以戏剧化，你的动作不用。"]]
  }),
  "west-face-variation-smith-rock": routeCopy({
    style: ["Classic Smith Rock multi-pitch feel with moderate confidence energy.", "带 Smith Rock 经典多段感觉的信心路线。"],
    summary: ["West Face Variation is a useful choice when you want height, rhythm, and less headline pressure.", "West Face Variation 适合想要高度、节奏，但不想背负太多头条压力的人。"],
    bestFor: ["Climbers building multi-pitch comfort at Smith Rock.", "适合在 Smith Rock 建立多段舒适度的人。"],
    decisionHint: ["Pick it when you want practice that still feels like a real outing.", "当你想要练习，同时仍像一次真正出行时，选它。"],
    practiceFocus: [["exposure", "systems practice", "route judgment"], ["暴露感", "系统练习", "路线判断"]],
    editorialTips: [["Moderate multi-pitch days are excellent classrooms.", "Use lower pressure to make transitions smoother."], ["适中的多段路线是很好的课堂。", "用低一点压力把转换练得更顺。"]]
  }),
  "five-gallon-buckets-smith-rock": routeCopy({
    style: ["Friendly Smith Rock sport climbing with confidence-building holds.", "较友好的 Smith Rock 运动线，适合建立信心。"],
    summary: ["Five Gallon Buckets is for days when you want the route to offer a few handshakes instead of only exams.", "Five Gallon Buckets 适合想让路线给几个握手，而不只是考试的一天。"],
    bestFor: ["Climbers building sport rhythm and outdoor confidence.", "适合建立运动攀节奏和户外信心的人。"],
    decisionHint: ["Choose it when useful confidence is the goal.", "当目标是有用的信心时，选它。"],
    practiceFocus: [["lead rhythm", "confidence", "movement economy"], ["先锋节奏", "信心", "动作经济性"]],
    editorialTips: [["Friendly routes are perfect for practicing clean habits.", "Do not waste good holds by rushing past the lesson."], ["亲切路线很适合练干净习惯。", "不要因为点好就匆忙跳过课程。"]]
  }),
  "superslab-smith-rock": routeCopy({
    style: ["Smith Rock slab practice with calm-footwork emphasis.", "强调冷静脚法的 Smith Rock 板壁练习。"],
    summary: ["Superslab is the reminder that easy-looking angles can still ask very honest questions.", "Superslab 提醒你：看起来不陡的角度也会问很诚实的问题。"],
    bestFor: ["Climbers practicing foot trust and steady movement.", "适合练脚点信任和稳定移动的人。"],
    decisionHint: ["Pick it when you want technique to be the main character.", "当你想让技术当主角时，选它。"],
    practiceFocus: [["slab movement", "foot trust", "calm pacing"], ["板壁移动", "脚点信任", "冷静节奏"]],
    editorialTips: [["Slab rewards quiet confidence, not loud effort.", "If your feet are nervous, slow the whole system down."], ["板壁奖励安静自信，不奖励大声用力。", "如果脚很紧张，就把整个系统放慢。"]]
  }),
  "wherever-i-may-roam-smith-rock": routeCopy({
    style: ["Smith Rock multi-pitch style with roaming-day personality.", "带游走感的 Smith Rock 多段风格。"],
    summary: ["Wherever I May Roam is for climbers who want a route day that feels like moving through a small desert chapter.", "Wherever I May Roam 适合想让路线日像穿过一小章沙漠故事的人。"],
    bestFor: ["Climbers seeking multi-pitch rhythm and moderate adventure.", "适合寻找多段节奏和适中冒险感的人。"],
    decisionHint: ["Choose it when you want movement, view, and team rhythm in one package.", "当你想把动作、风景和队伍节奏打包在一起时，选它。"],
    practiceFocus: [["multi-pitch rhythm", "endurance", "team pacing"], ["多段节奏", "耐力", "队伍配合"]],
    editorialTips: [["A roaming day still likes tidy systems.", "Let the route feel adventurous while your process stays calm."], ["游走感的一天也喜欢整洁系统。", "让路线有冒险感，让流程保持冷静。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "el-sendero-luminoso-potrero-chico": routeCopy({
    style: ["Huge limestone multi-pitch endurance with headline exposure.", "巨大灰岩多段耐力线，暴露感很有头条气质。"],
    summary: ["El Sendero Luminoso is for climbers who want the day to feel tall, bright, and slightly unbelievable.", "El Sendero Luminoso 适合想让一天变得很高、很亮、还有点不真实的人。"],
    bestFor: ["Experienced teams drawn to big limestone objectives.", "适合被大型灰岩目标吸引的有经验队伍。"],
    decisionHint: ["Pick it when exposure and endurance are the attraction, not background noise.", "当暴露感和耐力就是吸引力，而不是背景噪音时，选它。"],
    practiceFocus: [["long-route endurance", "team rhythm", "exposure comfort"], ["长路线耐力", "队伍节奏", "暴露感适应"]],
    editorialTips: [["Big walls reward boringly clear team habits.", "Keep the adventure feeling, but do not romanticize fatigue."], ["大墙奖励清楚到有点无聊的队伍习惯。", "保留冒险感，但不要浪漫化疲劳。"]]
  }),
  "time-wave-zero-potrero-chico": routeCopy({
    style: ["Very long Potrero limestone with steady multi-pitch rhythm.", "非常长的 Potrero 灰岩线，节奏稳定的多段风格。"],
    summary: ["Time Wave Zero is the route card for climbers who hear long day and do not immediately close the tab.", "Time Wave Zero 适合听到长日子不会马上关掉页面的人。"],
    bestFor: ["Teams practicing endurance, efficiency, and calm communication.", "适合练耐力、效率和冷静沟通的队伍。"],
    decisionHint: ["Choose it when mileage and teamwork are the main goals.", "当里程和队伍配合是主要目标时，选它。"],
    practiceFocus: [["endurance", "team pacing", "long-day preparation"], ["耐力", "队伍节奏", "长日准备"]],
    editorialTips: [["Long routes are won by small habits repeated well.", "If the day is long, your mood management matters too."], ["长路线靠重复做好小习惯赢下来。", "如果日子很长，情绪管理也算技术。"]]
  }),
  "estrellita-potrero-chico": routeCopy({
    style: ["Approachable Potrero multi-pitch with confidence-building charm.", "亲近的 Potrero 多段线，适合建立信心。"],
    summary: ["Estrellita is for climbers who want height and sunshine without asking the day to become epic.", "Estrellita 适合想要高度和阳光，但不想让一天变史诗的人。"],
    bestFor: ["Climbers building multi-pitch confidence in Potrero style.", "适合用 Potrero 风格建立多段信心的人。"],
    decisionHint: ["Pick it when you want friendly exposure and useful practice.", "当你想要友好的暴露感和有用练习时，选它。"],
    practiceFocus: [["multi-pitch basics", "confidence", "limestone movement"], ["多段基础", "信心", "灰岩移动"]],
    editorialTips: [["Approachable does not mean automatic.", "Use friendlier routes to make your systems smoother."], ["亲近不代表自动完成。", "用友好路线把系统练得更顺。"]]
  }),
  "yankee-clipper-potrero-chico": routeCopy({
    style: ["Potrero limestone sport-multi-pitch with clean route-day energy.", "Potrero 灰岩运动多段风格，路线日气质很清楚。"],
    summary: ["Yankee Clipper is a useful pick when you want the Potrero feeling in a balanced, steady package.", "Yankee Clipper 适合想用平衡稳定的方式体验 Potrero 的人。"],
    bestFor: ["Climbers seeking multi-pitch mileage and sport rhythm.", "适合寻找多段里程和运动攀节奏的人。"],
    decisionHint: ["Choose it when you want a productive day rather than a dramatic one.", "当你想要有产出，而不是很戏剧化的一天时，选它。"],
    practiceFocus: [["sport endurance", "partner communication", "steady pacing"], ["运动攀耐力", "队友沟通", "稳定节奏"]],
    editorialTips: [["Balanced routes are great for testing team rhythm.", "A calm day still teaches a lot."], ["平衡路线很适合测试队伍节奏。", "平静的一天也能教很多。"]]
  }),
  "space-boyz-potrero-chico": routeCopy({
    style: ["Playful Potrero limestone with multi-pitch space-day flavor.", "带一点太空日味道的 Potrero 灰岩多段线。"],
    summary: ["Space Boyz is for teams who want a route name that smiles while the wall still asks for attention.", "Space Boyz 适合喜欢路线名会笑，但岩壁仍要求专注的队伍。"],
    bestFor: ["Climbers mixing fun, mileage, and teamwork.", "适合把乐趣、里程和队伍合作混在一起的人。"],
    decisionHint: ["Pick it when the day wants lightness without carelessness.", "当今天想轻一点，但不是随便一点时，选它。"],
    practiceFocus: [["movement economy", "sport systems", "team flow"], ["动作经济性", "运动攀系统", "队伍流动"]],
    editorialTips: [["A funny name is not a reason to switch off.", "Keep the vibe playful and the process tidy."], ["名字有趣不是关掉脑袋的理由。", "气氛可以轻松，流程要整洁。"]]
  }),
  "snot-girlz-potrero-chico": routeCopy({
    style: ["Moderate Potrero limestone for confidence and team rhythm.", "适合信心和队伍节奏的 Potrero 适中灰岩线。"],
    summary: ["Snot Girlz is a good route-finder card when you want a lighter objective that still feels like a real route day.", "Snot Girlz 适合想要较轻目标，但仍像真正路线日的人。"],
    bestFor: ["Climbers building calm multi-pitch mileage.", "适合积累冷静多段里程的人。"],
    decisionHint: ["Choose it when confidence and rhythm matter most.", "当信心和节奏最重要时，选它。"],
    practiceFocus: [["endurance basics", "calm transitions", "confidence"], ["耐力基础", "冷静转换", "信心"]],
    editorialTips: [["Moderate mileage is not filler; it is where habits are built.", "Let the day be useful without making it heavy."], ["适中里程不是填空；习惯就是在这里建立。", "让这一天有用，但不必沉重。"]]
  }),
  "treasure-of-the-sierra-madre-potrero-chico": routeCopy({
    style: ["Potrero multi-pitch adventure with treasure-map personality.", "带藏宝图气质的 Potrero 多段冒险线。"],
    summary: ["Treasure of the Sierra Madre is for climbers who want the route list to feel like a quest without turning into a guidebook.", "Treasure of the Sierra Madre 适合想让路线清单像任务，但不变成路书的人。"],
    bestFor: ["Teams looking for adventure mood and steady limestone movement.", "适合寻找冒险氛围和稳定灰岩移动的队伍。"],
    decisionHint: ["Pick it when story energy is part of your route choice.", "当故事感是你选线的一部分时，选它。"],
    practiceFocus: [["multi-pitch pacing", "confidence", "route selection"], ["多段节奏", "信心", "选线判断"]],
    editorialTips: [["Let the name add flavor, not fantasy.", "Adventure feels better when the team process is calm."], ["让名字增加味道，不要增加幻想。", "队伍流程冷静时，冒险感更舒服。"]]
  }),
  "will-the-wolf-survive-potrero-chico": routeCopy({
    style: ["Sharper Potrero limestone sport style with project energy.", "更尖锐的 Potrero 灰岩运动风格，项目感更强。"],
    summary: ["Will the Wolf Survive is for days when you want Potrero to feel less like mileage and more like a focused test.", "Will the Wolf Survive 适合想让 Potrero 不只是里程，而是更像专注测试的一天。"],
    bestFor: ["Climbers wanting harder sport-style focus in the Potrero menu.", "适合在 Potrero 菜单里寻找更硬运动攀焦点的人。"],
    decisionHint: ["Choose it when you want the day to have teeth.", "当你想让今天有点牙齿时，选它。"],
    practiceFocus: [["power endurance", "finger strength", "redpoint discipline"], ["力量耐力", "手指力量", "redpoint 纪律"]],
    editorialTips: [["Harder days need cleaner rest and expectation management.", "Do not let the name make the plan dramatic."], ["更硬的日子需要更干净的休息和预期管理。", "不要让名字把计划变得戏剧化。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "cosmiques-ridge-aiguille-du-midi": routeCopy({
    style: ["Chamonix alpine ridge climbing with classic skyline energy.", "带经典天际线气质的霞慕尼阿尔卑斯山脊攀登。"],
    summary: ["Cosmiques Ridge is for climbers who want a compact alpine taste that still asks for real mountain attention.", "Cosmiques Ridge 适合想要紧凑阿尔卑斯体验，同时仍认真对待山地判断的人。"],
    bestFor: ["Climbers seeking alpine flavor, exposure, and movement variety.", "适合寻找阿尔卑斯味道、暴露感和动作变化的人。"],
    decisionHint: ["Pick it when you want a mountain day with a clear edge.", "当你想要一条轮廓清楚的山地路线日时，选它。"],
    practiceFocus: [["alpine rhythm", "exposure comfort", "weather judgment"], ["阿尔卑斯节奏", "暴露感适应", "天气判断"]],
    editorialTips: [["Compact alpine routes still live in real mountains.", "Let conditions, not excitement, set the final mood."], ["紧凑阿尔卑斯路线依然在真实山里。", "让条件决定最终心情，不要让兴奋决定。"]]
  }),
  "midi-plan-traverse-chamonix": routeCopy({
    style: ["High alpine traverse with Chamonix skyline seriousness.", "带霞慕尼天际线严肃感的高山穿越。"],
    summary: ["Midi Plan Traverse is for climbers who want the route choice to feel like movement through weather, space, and judgment.", "Midi Plan Traverse 适合想让路线选择变成穿过天气、空间和判断的人。"],
    bestFor: ["Experienced alpinists comparing classic Chamonix traverses.", "适合比较霞慕尼经典穿越的有经验登山攀登者。"],
    decisionHint: ["Choose it when alpine judgment is part of the appeal.", "当阿尔卑斯判断本身就是吸引力时，选它。"],
    practiceFocus: [["alpine endurance", "route judgment", "team pacing"], ["阿尔卑斯耐力", "路线判断", "队伍节奏"]],
    editorialTips: [["A traverse rewards teams that think ahead.", "Weather windows are part of the route choice, not admin."], ["穿越路线奖励会提前思考的队伍。", "天气窗口是选线的一部分，不是行政事项。"]]
  }),
  "trois-monts-route-mont-blanc": routeCopy({
    style: ["Mont Blanc alpine objective with endurance and weather stakes.", "带耐力和天气赌注的勃朗峰阿尔卑斯目标。"],
    summary: ["Trois Monts is for climbers who want a big mountain objective where patience is not optional equipment.", "Trois Monts 适合想要大山目标，并明白耐心不是可选装备的人。"],
    bestFor: ["Alpine climbers considering major Mont Blanc routes.", "适合考虑勃朗峰主要路线的阿尔卑斯攀登者。"],
    decisionHint: ["Pick it when your mountain systems feel calm, not improvised.", "当你的山地系统感觉冷静，而不是临时拼凑时，考虑它。"],
    practiceFocus: [["endurance", "weather judgment", "mountain pacing"], ["耐力", "天气判断", "山地节奏"]],
    editorialTips: [["Big snowy objectives amplify small decisions.", "Ambition should arrive with clear judgment."], ["大型雪山目标会放大小决定。", "野心最好和清醒判断一起到场。"]]
  }),
  "gouter-route-mont-blanc": routeCopy({
    style: ["Classic Mont Blanc ascent style with serious mountain logistics.", "经典勃朗峰登顶风格，山地后勤很认真。"],
    summary: ["Gouter Route is a reminder that popular does not mean casual, especially when the mountain is doing the talking.", "Gouter Route 提醒你：热门不等于随便，尤其当山本身在说话。"],
    bestFor: ["Climbers comparing standard Mont Blanc-style objectives.", "适合比较标准勃朗峰目标的攀登者。"],
    decisionHint: ["Choose it when preparation and conditions both say yes.", "当准备和条件都点头时，才选它。"],
    practiceFocus: [["mountain endurance", "systems", "decision discipline"], ["山地耐力", "系统", "决策纪律"]],
    editorialTips: [["Popularity can hide seriousness; do not let it.", "A standard route still deserves non-standard attention."], ["热门会掩盖严肃性，不要让它发生。", "标准路线也值得非标准的注意力。"]]
  }),
  "grands-mulets-route-mont-blanc": routeCopy({
    style: ["Historic Mont Blanc route context with glacier-minded decision making.", "带历史感的勃朗峰路线语境，强调冰川判断。"],
    summary: ["Grands Mulets is for climbers who like history, big terrain, and the kind of planning that does not fit in a caption.", "Grands Mulets 适合喜欢历史、大地形，以及无法塞进一句说明里的计划的人。"],
    bestFor: ["Experienced mountain teams comparing Mont Blanc options.", "适合比较勃朗峰路线选项的有经验山地队伍。"],
    decisionHint: ["Pick it when current conditions are the main character.", "当当前条件是主角时，才考虑它。"],
    practiceFocus: [["glacier awareness", "weather timing", "history"], ["冰川意识", "天气时机", "历史感"]],
    editorialTips: [["Historic routes still change with conditions.", "Let the source trail guide research, not replace judgment."], ["历史路线仍会随条件变化。", "让来源线索引导研究，不要替代判断。"]]
  }),
  "aiguilles-grises-route-mont-blanc": routeCopy({
    style: ["Italian-side Mont Blanc approach with remote alpine flavor.", "勃朗峰意大利侧路线，带更远一点的阿尔卑斯味道。"],
    summary: ["Aiguilles Grises is for climbers who want the mountain to feel less like a queue and more like a journey.", "Aiguilles Grises 适合想让大山更像旅程，而不只是排队的人。"],
    bestFor: ["Alpine climbers seeking a broader Mont Blanc perspective.", "适合想从更宽视角理解勃朗峰的阿尔卑斯攀登者。"],
    decisionHint: ["Choose it when the journey quality matters as much as the summit idea.", "当旅程质量和登顶想法一样重要时，选它。"],
    practiceFocus: [["remote pacing", "team planning", "alpine endurance"], ["远程节奏", "队伍计划", "阿尔卑斯耐力"]],
    editorialTips: [["Less obvious routes can ask for more thoughtful planning.", "A quieter option is not automatically an easier one."], ["没那么显眼的路线可能需要更细的计划。", "更安静的选择不自动等于更简单。"]]
  }),
  "miage-bionnassay-mont-blanc-crossing": routeCopy({
    style: ["Aesthetic alpine crossing with ridge and endurance personality.", "很有美感的阿尔卑斯穿越，山脊和耐力性格明显。"],
    summary: ["Miage Bionnassay is for climbers who want the route to feel elegant, committing, and bigger than a single summit box.", "Miage Bionnassay 适合想要优雅、投入，并超过一个登顶勾选框的人。"],
    bestFor: ["Experienced alpinists drawn to skyline crossings.", "适合被天际线穿越吸引的有经验阿尔卑斯攀登者。"],
    decisionHint: ["Pick it when movement through the mountains is the real goal.", "当穿行山间本身才是真目标时，选它。"],
    practiceFocus: [["ridge composure", "endurance", "team pacing"], ["山脊镇定", "耐力", "队伍节奏"]],
    editorialTips: [["Elegant routes can still be stern teachers.", "Do not let beauty soften your decision standards."], ["优雅路线也可以是严厉老师。", "不要让美感降低你的判断标准。"]]
  }),
  "north-west-face-mont-blanc-du-tacul": routeCopy({
    style: ["Serious alpine face objective with condition-sensitive character.", "严肃的阿尔卑斯面攀目标，对条件很敏感。"],
    summary: ["North West Face of Mont Blanc du Tacul is for climbers who want Chamonix to feel technical, cold, and very real.", "Mont Blanc du Tacul 西北面适合想让霞慕尼变得技术、寒冷、也非常真实的人。"],
    bestFor: ["Experienced alpine climbers comparing technical high-mountain routes.", "适合比较技术型高山路线的有经验阿尔卑斯攀登者。"],
    decisionHint: ["Choose it when conditions, skill, and judgment all line up.", "当条件、能力和判断都排成一线时，才考虑它。"],
    practiceFocus: [["technical alpine movement", "conditions", "commitment"], ["技术型阿尔卑斯移动", "条件", "投入度"]],
    editorialTips: [["This is inspiration plus source trail, not a casual suggestion.", "Let conditions veto ambition when needed."], ["这是灵感加来源线索，不是随手建议。", "需要时，让条件否决野心。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "realization-biographie-ceuse": routeCopy({
    style: ["Ceüse sport-climbing history with world-class endurance pressure.", "Ceüse 运动攀历史线，世界级耐力压力很明显。"],
    summary: ["Realization Biographie is for climbers who want a route card that feels like opening a chapter of modern sport climbing.", "Realization Biographie 适合想打开现代运动攀一章的人。"],
    bestFor: ["Elite sport climbers and readers tracking grade history.", "适合精英运动攀者和关注难度历史的读者。"],
    decisionHint: ["Pick it when history, endurance, and long-view preparation all matter.", "当历史、耐力和长期准备都重要时，选它。"],
    practiceFocus: [["elite endurance", "project discipline", "history"], ["精英耐力", "项目纪律", "历史感"]],
    editorialTips: [["Use the legend to clarify training, not inflate urgency.", "Historic routes deserve honest language about consensus and context."], ["用传奇明确训练，不要放大焦虑。", "历史路线值得对共识和语境保持诚实。"]]
  }),
  "bibliographie-ceuse": routeCopy({
    style: ["Modern Ceüse hard sport climbing with grade-discussion gravity.", "现代 Ceüse 高难运动攀，带难度讨论的重量。"],
    summary: ["Bibliographie is for days when inspiration sits at the edge of what sport climbing currently asks from people.", "Bibliographie 适合把灵感放在运动攀当前极限边缘来看的日子。"],
    bestFor: ["Elite climbers and readers following top-end sport progression.", "适合关注运动攀顶端发展的精英攀岩者和读者。"],
    decisionHint: ["Choose it as a serious inspiration card unless your season truly points there.", "除非你的周期真的指向它，否则先把它当认真灵感卡。"],
    practiceFocus: [["top-end endurance", "grade perspective", "long-term planning"], ["顶端耐力", "难度判断", "长期计划"]],
    editorialTips: [["Extreme grades are conversations, not decorations.", "Let source strength guide how confidently the card speaks."], ["极限难度是对话，不是装饰。", "让来源强度决定卡片说话的确定程度。"]]
  }),
  "three-degrees-of-separation-ceuse": routeCopy({
    style: ["Hard Ceüse sport climbing with expressive route-name energy.", "高难 Ceüse 运动线，名字很有表达感。"],
    summary: ["Three Degrees of Separation is for climbers who want a hard route with a name that already feels like a puzzle.", "Three Degrees of Separation 适合想要一条名字本身就像谜题的硬路线。"],
    bestFor: ["Advanced sport climbers comparing difficult Ceüse objectives.", "适合比较 Ceüse 高难目标的进阶运动攀岩者。"],
    decisionHint: ["Pick it when you want power endurance with a story hook.", "当你想要带故事钩子的力量耐力时，选它。"],
    practiceFocus: [["power endurance", "project patience", "route reading"], ["力量耐力", "项目耐心", "读线"]],
    editorialTips: [["Hard routes often reveal what your training actually trained.", "Use the story as motivation, not as a shortcut."], ["硬路线常会揭示你的训练到底练了什么。", "把故事当动力，不要当捷径。"]]
  }),
  "jungle-boogie-ceuse": routeCopy({
    style: ["Ceüse sport endurance with playful name and serious pump.", "名字很会玩，但泵感认真的 Ceüse 运动耐力线。"],
    summary: ["Jungle Boogie is for climbers who want the route list to dance a little while forearms keep the tempo honest.", "Jungle Boogie 适合想让路线清单跳一点舞，同时让前臂负责诚实打拍子的人。"],
    bestFor: ["Sport climbers practicing endurance and movement rhythm.", "适合练耐力和动作节奏的运动攀岩者。"],
    decisionHint: ["Choose it when you want fun with a real pump budget.", "当你想要快乐，但也接受真实泵感预算时，选它。"],
    practiceFocus: [["route endurance", "pump management", "mental reset"], ["路线耐力", "泵感管理", "心理重启"]],
    editorialTips: [["A playful name can still require very adult pacing.", "Make the rhythm smooth before making it heroic."], ["名字有趣也可能需要很成熟的节奏。", "先顺起来，再谈英勇。"]]
  }),
  "letrange-ivresse-des-lenteurs-ceuse": routeCopy({
    style: ["Technical Ceüse limestone with poetic slow-burn personality.", "带诗意慢热性格的 Ceüse 技术灰岩线。"],
    summary: ["L'Etrange Ivresse des Lenteurs is for climbers who enjoy a route name that tells them to slow down before they even start.", "L'Etrange Ivresse des Lenteurs 适合喜欢路线名还没开始就提醒你慢一点的人。"],
    bestFor: ["Climbers who like technical movement and patient pacing.", "适合喜欢技术动作和耐心节奏的人。"],
    decisionHint: ["Pick it when slow precision sounds better than rushing strength.", "当缓慢精准比急着用力更诱人时，选它。"],
    practiceFocus: [["technical movement", "route reading", "patience"], ["技术动作", "读线", "耐心"]],
    editorialTips: [["Some routes reward the climber who waits well.", "Let slowness be a tactic, not a failure."], ["有些路线奖励会等待的人。", "让慢成为策略，而不是失败。"]]
  }),
  "dures-limites-ceuse": routeCopy({
    style: ["Ceüse sport climbing with hard-limit training energy.", "带硬边界训练感的 Ceüse 运动线。"],
    summary: ["Dures Limites is for climbers who want a route card that says the limit is real, but not necessarily unfriendly.", "Dures Limites 适合想听路线说边界真实存在，但不一定不友好的人。"],
    bestFor: ["Climbers practicing confidence and disciplined effort.", "适合练信心和有纪律输出的人。"],
    decisionHint: ["Choose it when you want a useful limit check.", "当你想要一次有用的边界检查时，选它。"],
    practiceFocus: [["confidence", "movement economy", "limit awareness"], ["信心", "动作经济性", "边界觉察"]],
    editorialTips: [["A limit route can be a teacher, not just a scoreboard.", "Notice what breaks first: breath, feet, or belief."], ["边界路线可以是老师，不只是记分牌。", "观察先崩的是呼吸、脚法还是信念。"]]
  }),
  "larcademicien-ceuse": routeCopy({
    style: ["Classic Ceüse sport style with technical learning value.", "有技术学习价值的 Ceüse 经典运动风格。"],
    summary: ["L'Arcadémicien is a good pick when you want Ceüse to feel like a classroom with better views.", "L'Arcadémicien 适合想让 Ceüse 像一间风景更好的课堂。"],
    bestFor: ["Sport climbers building technical limestone confidence.", "适合建立技术灰岩信心的运动攀岩者。"],
    decisionHint: ["Pick it when you want learning to be the point.", "当学习本身就是重点时，选它。"],
    practiceFocus: [["technical flow", "confidence", "limestone reading"], ["技术流动", "信心", "灰岩阅读"]],
    editorialTips: [["Good learning routes are not lesser routes.", "Use the day to make future hard routes less mysterious."], ["好的学习路线不是次等路线。", "用这一天让未来硬路线少一点神秘。"]]
  }),
  "mirage-ceuse": routeCopy({
    style: ["Ceüse sport climbing with sunny, deceptive-lightness energy.", "带阳光和轻盈错觉的 Ceüse 运动线。"],
    summary: ["Mirage is for climbers who enjoy routes that look like a dream but still expect real attention.", "Mirage 适合喜欢看起来像梦，但仍要求认真注意力的路线的人。"],
    bestFor: ["Climbers seeking sport endurance and clean movement.", "适合寻找运动攀耐力和干净动作的人。"],
    decisionHint: ["Choose it when the style feels inviting but you still want substance.", "当风格很邀请你，同时你也想要实际内容时，选它。"],
    practiceFocus: [["sport endurance", "movement economy", "focus"], ["运动攀耐力", "动作经济性", "专注"]],
    editorialTips: [["A mirage is still useful if it makes you look carefully.", "Let beauty sharpen attention instead of softening it."], ["海市蜃楼也有用，如果它让你看得更仔细。", "让美感提高注意力，而不是降低注意力。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "comici-dimai-cima-grande": routeCopy({
    style: ["Historic Dolomites limestone wall climbing with old alpine stature.", "带老派阿尔卑斯气质的多洛米蒂历史石灰岩大墙。"],
    summary: ["Comici-Dimai is for climbers who want a route card that feels like opening a sepia-toned chapter of vertical history.", "Comici-Dimai 适合想打开一章泛黄垂直历史的人。"],
    bestFor: ["Climbers drawn to classic alpine wall stories and exposure.", "适合被经典阿尔卑斯大墙故事和暴露感吸引的人。"],
    decisionHint: ["Pick it when history and atmosphere matter as much as movement.", "当历史和氛围与动作一样重要时，选它。"],
    practiceFocus: [["alpine composure", "exposure", "history"], ["阿尔卑斯镇定", "暴露感", "历史感"]],
    editorialTips: [["Old wall routes reward respect before enthusiasm.", "Let the history slow you down in a useful way."], ["老大墙路线先奖励尊重，再奖励热情。", "让历史用有用的方式让你慢下来。"]]
  }),
  "brandler-hasse-cima-grande": routeCopy({
    style: ["Serious Dolomites wall climbing with commitment and reputation.", "严肃的多洛米蒂大墙路线，投入度和名气都很重。"],
    summary: ["Brandler-Hasse is for climbers who want the Dolomites to feel proud, stern, and very much awake.", "Brandler-Hasse 适合想让多洛米蒂显得骄傲、严厉、并且非常清醒的人。"],
    bestFor: ["Experienced climbers comparing major Dolomites wall objectives.", "适合比较多洛米蒂主要大墙目标的有经验攀岩者。"],
    decisionHint: ["Choose it when seriousness is part of the attraction.", "当认真本身就是吸引力的一部分时，选它。"],
    practiceFocus: [["commitment", "wall endurance", "route judgment"], ["投入度", "大墙耐力", "路线判断"]],
    editorialTips: [["A famous wall does not owe you an easy day.", "Keep ambition tied to current skill, not just admiration."], ["名墙不欠你轻松的一天。", "让野心和当前能力相连，而不只是和仰慕相连。"]]
  }),
  "cassin-ratti-cima-ovest": routeCopy({
    style: ["Dolomites north-face history with alpine seriousness.", "带北壁历史感的多洛米蒂阿尔卑斯严肃路线。"],
    summary: ["Cassin-Ratti is for climbers who want their route choice to carry a strong historical shadow.", "Cassin-Ratti 适合想让选线带着强烈历史影子的人。"],
    bestFor: ["Climbers studying classic Dolomites progression and wall character.", "适合研究多洛米蒂经典进阶和大墙性格的人。"],
    decisionHint: ["Pick it when you want a route with weight, not just length.", "当你想要有分量，而不只是有长度的路线时，选它。"],
    practiceFocus: [["alpine history", "endurance", "mental pacing"], ["阿尔卑斯历史", "耐力", "心理节奏"]],
    editorialTips: [["Let reputation guide preparation, not intimidation.", "Historic routes are best approached with clear eyes."], ["让名声指导准备，不要制造恐吓。", "面对历史路线，清醒比兴奋更有用。"]]
  }),
  "spigolo-giallo-cima-piccola": routeCopy({
    style: ["A proud Dolomites arete-style classic with skyline personality.", "带天际线性格的多洛米蒂经典棱线风格。"],
    summary: ["Spigolo Giallo is for days when you want the route itself to look like a line drawn by a confident hand.", "Spigolo Giallo 适合想爬一条像被自信手笔画出来的线。"],
    bestFor: ["Climbers who love shape, exposure, and classic alpine style.", "适合喜欢线条、暴露感和经典阿尔卑斯风格的人。"],
    decisionHint: ["Choose it when aesthetics are part of your route choice.", "当美感是你选线理由的一部分时，选它。"],
    practiceFocus: [["exposure comfort", "movement flow", "alpine style"], ["暴露感适应", "动作流动", "阿尔卑斯风格"]],
    editorialTips: [["A beautiful line still asks for practical judgment.", "Let the shape inspire calm, not rushing."], ["漂亮线条依然要求实际判断。", "让线条激发冷静，不要激发匆忙。"]]
  }),
  "pan-aroma-cima-ovest": routeCopy({
    style: ["Modern hard Dolomites big-wall free climbing with panoramic drama.", "现代高难多洛米蒂大墙自由攀，景观戏剧感很强。"],
    summary: ["Pan Aroma is for climbers who want inspiration at the intersection of huge walls, hard free climbing, and ridiculous scenery.", "Pan Aroma 适合想在巨大岩壁、高难自由攀和夸张风景交汇处找灵感的人。"],
    bestFor: ["Elite climbers and readers tracking modern Dolomites free-climbing history.", "适合关注现代多洛米蒂自由攀历史的精英攀岩者和读者。"],
    decisionHint: ["Pick it as a serious inspiration card unless your season truly points there.", "除非你的周期真的指向它，否则先把它当认真灵感卡。"],
    practiceFocus: [["elite endurance", "big-wall focus", "long-term vision"], ["精英耐力", "大墙专注", "长期视角"]],
    editorialTips: [["Huge inspiration is useful when it clarifies training.", "Do not let big scenery blur honest readiness."], ["巨大的灵感在能明确训练时才有用。", "不要让大风景模糊真实准备度。"]]
  }),
  "bellavista-cima-ovest": routeCopy({
    style: ["Hard Dolomites free climbing with alpine wall commitment.", "带阿尔卑斯大墙投入感的高难多洛米蒂自由攀。"],
    summary: ["Bellavista is for climbers who want a route name that promises a beautiful view and then asks for very serious effort.", "Bellavista 适合想要一个承诺美景、然后要求认真付出的路线名。"],
    bestFor: ["Advanced readers and elite climbers comparing hard alpine free routes.", "适合比较高难阿尔卑斯自由攀的读者和精英攀岩者。"],
    decisionHint: ["Choose it when beauty and difficulty both belong in the plan.", "当美感和难度都属于计划的一部分时，选它。"],
    practiceFocus: [["hard free climbing", "wall patience", "conditions"], ["高难自由攀", "大墙耐心", "条件"]],
    editorialTips: [["A beautiful name is not a soft objective.", "Let admiration become structured preparation."], ["漂亮名字不代表温柔目标。", "让仰慕变成有结构的准备。"]]
  }),
  "normal-route-cima-grande": routeCopy({
    style: ["Classic Dolomites summit-route energy with accessible historical context.", "带经典登顶路线气质和历史语境的多洛米蒂路线。"],
    summary: ["Normal Route on Cima Grande is a useful card when you want the mountain story without jumping straight to the hardest walls.", "Cima Grande 普通路线适合想进入山的故事，但不想直接跳到最硬大墙的人。"],
    bestFor: ["Climbers seeking classic Dolomites context and confidence.", "适合寻找多洛米蒂经典语境和信心的人。"],
    decisionHint: ["Pick it when context and mountain feel matter most.", "当语境和山地感最重要时，选它。"],
    practiceFocus: [["mountain rhythm", "confidence", "route context"], ["山地节奏", "信心", "路线语境"]],
    editorialTips: [["Normal does not mean meaningless.", "Foundational routes help you read the bigger walls better."], ["普通不代表没意义。", "基础路线会帮助你更好读懂大墙。"]]
  }),
  "spigolo-dibona-cima-grande": routeCopy({
    style: ["Dolomites arete classic with airy movement and old-route charm.", "带空中感动作和老路线魅力的多洛米蒂经典棱线。"],
    summary: ["Spigolo Dibona is for climbers who want a proud line that feels more like a drawn edge than a checklist item.", "Spigolo Dibona 适合想要一条骄傲线条，而不只是清单项目的人。"],
    bestFor: ["Climbers who like exposure, shape, and classic alpine movement.", "适合喜欢暴露感、线条和经典阿尔卑斯动作的人。"],
    decisionHint: ["Choose it when the line itself makes the decision easier.", "当线条本身让选择变简单时，选它。"],
    practiceFocus: [["arete movement", "exposure", "calm pacing"], ["棱线移动", "暴露感", "冷静节奏"]],
    editorialTips: [["Proud lines reward proud preparation.", "Let the exposure sharpen your calm rather than steal it."], ["骄傲的线条奖励骄傲的准备。", "让暴露感磨亮冷静，而不是偷走它。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "action-directe-frankenjura": routeCopy({
    style: ["Frankenjura pocket power with landmark sport-climbing status.", "带里程碑地位的弗兰肯尤拉洞点力量线。"],
    summary: ["Action Directe is for climbers who want a route card that feels like a lightning bolt in sport-climbing history.", "Action Directe 适合想要一张像运动攀历史闪电的路线卡。"],
    bestFor: ["Elite climbers and readers tracking hard sport-climbing milestones.", "适合关注高难运动攀里程碑的精英攀岩者和读者。"],
    decisionHint: ["Pick it when pocket power and history are the whole point.", "当洞点力量和历史感就是重点时，选它。"],
    practiceFocus: [["pocket power", "precision", "history"], ["洞点力量", "精准", "历史感"]],
    editorialTips: [["A milestone route is inspiration, not a shortcut.", "Treat finger intensity with respect and patience."], ["里程碑路线是灵感，不是捷径。", "尊重手指强度，也尊重耐心。"]]
  }),
  "wallstreet-frankenjura": routeCopy({
    style: ["Historic Frankenjura limestone with sport-climbing progression weight.", "带运动攀进阶重量的弗兰肯尤拉历史灰岩线。"],
    summary: ["Wallstreet is for climbers who want a route with a strong place in the story of hard sport climbing.", "Wallstreet 适合想爬一条在高难运动攀故事里很有位置的路线。"],
    bestFor: ["Climbers studying grade progression and compact limestone style.", "适合研究难度进阶和紧凑灰岩风格的人。"],
    decisionHint: ["Choose it when history adds useful gravity to the goal.", "当历史能给目标增加有用重量时，选它。"],
    practiceFocus: [["finger endurance", "sport history", "movement precision"], ["手指耐力", "运动攀历史", "动作精准"]],
    editorialTips: [["Historic grades still ask for current readiness.", "Let the route's role sharpen your preparation."], ["历史难度仍然要求当前准备度。", "让路线的地位提高你的准备质量。"]]
  }),
  "kanal-im-ruecken-frankenjura": routeCopy({
    style: ["Compact Frankenjura pocket climbing with technical body position.", "紧凑的弗兰肯尤拉洞点攀，考身体位置。"],
    summary: ["Kanal im Rücken is a good pick when you want the Frankenjura feeling in a concentrated dose.", "Kanal im Rücken 适合想用浓缩方式体验弗兰肯尤拉风格的人。"],
    bestFor: ["Climbers practicing pockets, precision, and compact power.", "适合练洞点、精准和短强度的人。"],
    decisionHint: ["Pick it when you want a small route that asks exact questions.", "当你想要一条小而精准提问的路线时，选它。"],
    practiceFocus: [["pockets", "body position", "specific power"], ["洞点", "身体位置", "专项力量"]],
    editorialTips: [["Compact routes punish vague movement.", "Better body position can feel like finding extra strength."], ["紧凑路线不喜欢模糊动作。", "更好的身体位置有时像找到额外力量。"]]
  }),
  "ghettoblaster-frankenjura": routeCopy({
    style: ["Hard Frankenjura sport climbing with punchy pocket character.", "强烈洞点性格的高难弗兰肯尤拉运动线。"],
    summary: ["Ghettoblaster is for climbers who want the route to turn up the volume without becoming sloppy.", "Ghettoblaster 适合想把音量调高，但不想动作变乱的人。"],
    bestFor: ["Strong climbers comparing hard pocket routes.", "适合比较高难洞点路线的强力攀岩者。"],
    decisionHint: ["Choose it when you want intensity with precision.", "当你想要强度和精准同时在线时，选它。"],
    practiceFocus: [["pocket strength", "contact power", "try quality"], ["洞点力量", "接触力量", "尝试质量"]],
    editorialTips: [["High volume energy still needs quiet fingers.", "Do not let the name make the session chaotic."], ["高音量能量也需要安静的手指。", "不要让名字把 session 变混乱。"]]
  }),
  "level-42-frankenjura": routeCopy({
    style: ["Frankenjura hard sport reference with technical power demands.", "要求技术力量的弗兰肯尤拉高难参考线。"],
    summary: ["Level 42 is a route-finder card for climbers who want a hard objective that sounds like a game stage and climbs like a real test.", "Level 42 适合想要一条听起来像游戏关卡、爬起来像真实测试的路线。"],
    bestFor: ["Advanced sport climbers comparing Frankenjura difficulty.", "适合比较弗兰肯尤拉难度的进阶运动攀岩者。"],
    decisionHint: ["Pick it when you want a focused hard-route checkpoint.", "当你想要一个专注的高难检查点时，选它。"],
    practiceFocus: [["technical power", "finger strength", "project rhythm"], ["技术力量", "手指力量", "项目节奏"]],
    editorialTips: [["Treat hard routes like systems, not moods.", "Track what improves, not only what fails."], ["把硬路线当系统，不要只当心情。", "记录进步的点，不只是失败的点。"]]
  }),
  "amadeus-schwarzenegger-frankenjura": routeCopy({
    style: ["Playful-name Frankenjura pocket climbing with serious training value.", "名字有玩心，但训练价值认真的弗兰肯尤拉洞点线。"],
    summary: ["Amadeus Schwarzenegger is for climbers who appreciate a route name with theater and a style that still asks for discipline.", "Amadeus Schwarzenegger 适合喜欢路线名有戏剧感，同时仍接受风格要求纪律的人。"],
    bestFor: ["Climbers mixing pocket practice with a lighter mood.", "适合把洞点练习和轻松心情混在一起的人。"],
    decisionHint: ["Choose it when you want intensity without losing humor.", "当你想要强度，但不想丢掉幽默感时，选它。"],
    practiceFocus: [["pocket control", "power", "session discipline"], ["洞点控制", "力量", "session 纪律"]],
    editorialTips: [["A funny route name can still train serious habits.", "Keep the joke in the name, not in your warm-up."], ["有趣路线名也能训练认真习惯。", "笑点留在名字里，别放进热身里。"]]
  }),
  "supernova-frankenjura": routeCopy({
    style: ["Modern Frankenjura hard sport climbing with explosive-name energy.", "带爆发名字气质的现代弗兰肯尤拉高难运动线。"],
    summary: ["Supernova is for climbers who want high-end pocket inspiration with a name that already glows.", "Supernova 适合想要高端洞点灵感，而且名字已经发光的人。"],
    bestFor: ["Elite climbers and readers tracking modern Frankenjura progression.", "适合关注现代弗兰肯尤拉进阶的精英攀岩者和读者。"],
    decisionHint: ["Pick it as inspiration when your training needs a bright north star.", "当你的训练需要一个明亮北极星时，把它当灵感。"],
    practiceFocus: [["elite power", "pocket discipline", "long-term planning"], ["精英力量", "洞点纪律", "长期计划"]],
    editorialTips: [["Aspirational routes are best when they clarify the next small step.", "Let the grade inspire honesty, not fantasy."], ["灵感路线最好能明确下一个小步骤。", "让难度激发诚实，不要激发幻想。"]]
  }),
  "modified-frankenjura": routeCopy({
    style: ["Frankenjura hard-route card for focused power and refinement.", "强调专注力量和细化调整的弗兰肯尤拉高难路线卡。"],
    summary: ["Modified is a useful reminder that hard sport climbing often improves through small edits, not dramatic reinvention.", "Modified 提醒你：高难运动攀常常靠小修改进步，而不是戏剧化重塑。"],
    bestFor: ["Climbers who like precise project tuning.", "适合喜欢精确调整项目的人。"],
    decisionHint: ["Choose it when you want a route that rewards refinement.", "当你想要一条奖励细化调整的路线时，选它。"],
    practiceFocus: [["project tracking", "movement refinement", "finger strength"], ["项目记录", "动作细化", "手指力量"]],
    editorialTips: [["Small improvements count when the route is hard enough.", "Do not chase drama if better notes would help more."], ["路线够难时，小改进也算数。", "如果更好的记录更有用，就别追求戏剧性。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "la-rambla-siurana": routeCopy({
    style: ["Siurana endurance sport climbing with landmark status.", "带里程碑地位的休拉纳耐力运动线。"],
    summary: ["La Rambla is for climbers who want a route name that carries modern sport-climbing gravity.", "La Rambla 适合想要一个承载现代运动攀重量的路线名。"],
    bestFor: ["Elite sport climbers and readers studying major 9a+ history.", "适合研究重要 9a+ 历史的精英运动攀者和读者。"],
    decisionHint: ["Pick it when endurance, history, and project discipline are the appeal.", "当耐力、历史和项目纪律都是吸引力时，选它。"],
    practiceFocus: [["sustained endurance", "project discipline", "history"], ["持续耐力", "项目纪律", "历史感"]],
    editorialTips: [["Let iconic status sharpen preparation, not pressure.", "Hard endurance routes reward calm repetition."], ["让标志性地位提高准备质量，不要增加压力。", "高难耐力路线奖励冷静重复。"]]
  }),
  "golpe-de-estado-siurana": routeCopy({
    style: ["Hard Siurana sport climbing with political-name drama and real difficulty.", "名字有戏剧感、难度很真实的高难休拉纳运动线。"],
    summary: ["Golpe de Estado is for climbers who want a serious objective with a name that already raises the room temperature.", "Golpe de Estado 适合想要认真目标，而且名字已经让空气升温的人。"],
    bestFor: ["Elite climbers comparing top-end Siurana routes.", "适合比较休拉纳顶端路线的精英攀岩者。"],
    decisionHint: ["Choose it when you want a high-stakes project card.", "当你想要一张高赌注项目卡时，选它。"],
    practiceFocus: [["elite power endurance", "mental reset", "source honesty"], ["精英力量耐力", "心理重启", "来源诚实"]],
    editorialTips: [["A dramatic name does not replace quiet preparation.", "Keep grade discussions clear and conservative."], ["戏剧化名字不能替代安静准备。", "让难度讨论保持清楚和保守。"]]
  }),
  "estado-critico-siurana": routeCopy({
    style: ["Siurana hard sport climbing with critical-project intensity.", "带临界项目强度的休拉纳高难运动攀。"],
    summary: ["Estado Crítico is for climbers who want the route card to admit that the margin is small and the focus must be large.", "Estado Crítico 适合想承认余量很小、专注必须很大的人。"],
    bestFor: ["Advanced sport climbers tracking difficult Siurana objectives.", "适合追踪休拉纳高难目标的进阶运动攀岩者。"],
    decisionHint: ["Pick it when a precise hard project sounds motivating.", "当精准的高难项目听起来有动力时，选它。"],
    practiceFocus: [["power endurance", "focus", "project tracking"], ["力量耐力", "专注", "项目记录"]],
    editorialTips: [["Critical does not mean chaotic.", "A hard project improves when feedback gets specific."], ["临界不等于混乱。", "反馈越具体，高难项目越会进步。"]]
  }),
  "sleeping-lion-siurana": routeCopy({
    style: ["Modern Siurana hard sport route with sleeping-lion pressure.", "像狮子一样安静但有压迫感的现代休拉纳高难运动线。"],
    summary: ["Sleeping Lion is for climbers who like inspiration that looks calm until it opens one eye.", "Sleeping Lion 适合喜欢那种看起来很安静、直到睁开一只眼的灵感。"],
    bestFor: ["Elite climbers and readers following modern sport-climbing progression.", "适合关注现代运动攀发展的精英攀岩者和读者。"],
    decisionHint: ["Choose it as a long-view inspiration card.", "把它当成长期视角的灵感卡。"],
    practiceFocus: [["elite endurance", "grade perspective", "long-term vision"], ["精英耐力", "难度判断", "长期视角"]],
    editorialTips: [["Use elite routes to clarify direction, not inflate urgency.", "Let repeat history shape how confidently you speak about grades."], ["用精英路线明确方向，不要放大焦虑。", "让重复历史决定你谈难度的确定程度。"]]
  }),
  "king-capella-siurana": routeCopy({
    style: ["Siurana high-end sport climbing with regal project energy.", "带王冠气质的休拉纳高端运动攀项目。"],
    summary: ["King Capella is for climbers who want a route card that feels crowned, difficult, and not especially interested in shortcuts.", "King Capella 适合想要一张戴着王冠、很难、并且不关心捷径的路线卡。"],
    bestFor: ["Elite climbers comparing the top end of Siurana sport climbing.", "适合比较休拉纳运动攀顶端目标的精英攀岩者。"],
    decisionHint: ["Pick it when long-term project discipline is the story.", "当长期项目纪律就是故事时，选它。"],
    practiceFocus: [["elite power endurance", "discipline", "patience"], ["精英力量耐力", "纪律", "耐心"]],
    editorialTips: [["A royal name still wants ordinary work done well.", "Keep the fantasy big and the process practical."], ["王者名字依然需要普通工作做扎实。", "幻想可以大，流程要实际。"]]
  }),
  "la-capella-siurana": routeCopy({
    style: ["Siurana chapel-sector hard sport style with concentrated effort.", "休拉纳教堂区域的高难运动风格，输出很集中。"],
    summary: ["La Capella is for climbers who want a compact hard-route arena with a strong sense of place.", "La Capella 适合想要一个场地感强、集中的高难路线舞台的人。"],
    bestFor: ["Advanced climbers comparing Siurana hard-route options.", "适合比较休拉纳高难路线选项的进阶攀岩者。"],
    decisionHint: ["Choose it when you want hard sport climbing in a focused setting.", "当你想在很集中的环境里进行高难运动攀时，选它。"],
    practiceFocus: [["power endurance", "route reading", "session discipline"], ["力量耐力", "读线", "session 纪律"]],
    editorialTips: [["Focused sectors can make focus easier, but not automatic.", "Track recovery as carefully as attempts."], ["集中的岩区会帮助专注，但不会自动专注。", "像记录尝试一样认真记录恢复。"]]
  }),
  "la-furia-de-jabali-siurana": routeCopy({
    style: ["Siurana sport climbing with wild-name intensity.", "名字很野、强度也在线的休拉纳运动线。"],
    summary: ["La Furia de Jabali is for days when you want the route list to growl a little without becoming reckless.", "La Furia de Jabali 适合想让路线清单低吼一下，但不想变鲁莽的日子。"],
    bestFor: ["Climbers seeking power endurance and spicy motivation.", "适合寻找力量耐力和一点辣味动力的人。"],
    decisionHint: ["Pick it when intensity sounds useful, not chaotic.", "当强度听起来有用，而不是混乱时，选它。"],
    practiceFocus: [["power endurance", "confidence", "emotional control"], ["力量耐力", "信心", "情绪控制"]],
    editorialTips: [["Let wild energy become good attempts.", "Do not confuse aggression with precision."], ["让野性能量变成好尝试。", "不要把攻击性和精准混为一谈。"]]
  }),
  "la-reina-mora-siurana": routeCopy({
    style: ["Classic Siurana sport route with graceful endurance character.", "带优雅耐力性格的休拉纳经典运动线。"],
    summary: ["La Reina Mora is for climbers who want a route that feels stately without needing to be the hardest thing on the wall.", "La Reina Mora 适合想要有仪态的路线，而不一定要墙上最难的人。"],
    bestFor: ["Climbers building Siurana confidence and sport-climbing rhythm.", "适合建立休拉纳信心和运动攀节奏的人。"],
    decisionHint: ["Choose it when you want classic feeling with manageable ambition.", "当你想要经典感，同时野心可管理时，选它。"],
    practiceFocus: [["endurance", "movement economy", "confidence"], ["耐力", "动作经济性", "信心"]],
    editorialTips: [["Not every good route needs to be a world headline.", "Use classics to build repeatable calm."], ["好路线不一定都要是世界头条。", "用经典路线建立可重复的冷静。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "perfecto-mundo-margalef": routeCopy({
    style: ["Margalef hard pocket climbing with global headline energy.", "带全球头条气质的马尔加莱夫高难洞点线。"],
    summary: ["Perfecto Mundo is for climbers who want inspiration that feels polished, brutal, and very much at the top end.", "Perfecto Mundo 适合想要看起来精致、实际残酷、并且非常顶端的灵感。"],
    bestFor: ["Elite climbers and readers following top sport-climbing progression.", "适合关注顶端运动攀进展的精英攀岩者和读者。"],
    decisionHint: ["Pick it as a serious inspiration card unless your training truly points there.", "除非你的训练真的指向它，否则先把它当认真灵感卡。"],
    practiceFocus: [["elite pocket power", "project discipline", "grade perspective"], ["精英洞点力量", "项目纪律", "难度判断"]],
    editorialTips: [["Perfect names still come with imperfect sessions.", "Let elite inspiration clarify the next practical step."], ["完美名字也会有不完美 session。", "让精英灵感明确下一步该怎么练。"]]
  }),
  "first-round-first-minute-margalef": routeCopy({
    style: ["Short, powerful Margalef pocket climbing with knockout personality.", "短强度马尔加莱夫洞点线，名字自带击倒感。"],
    summary: ["First Round First Minute is for climbers who want a route name that says intensity before the warm-up is even over.", "First Round First Minute 适合喜欢路线名在热身还没结束前就说出强度的人。"],
    bestFor: ["Strong sport climbers drawn to bouldery pocket power.", "适合被抱石感洞点力量吸引的强力运动攀岩者。"],
    decisionHint: ["Choose it when you want a sharp physical test.", "当你想要一个尖锐身体测试时，选它。"],
    practiceFocus: [["power", "pocket contact", "try quality"], ["力量", "洞点接触", "尝试质量"]],
    editorialTips: [["Short intensity still needs long patience.", "Do not let the name rush your session."], ["短强度仍需要长耐心。", "不要让名字催促你的 session。"]]
  }),
  "first-ley-margalef": routeCopy({
    style: ["Margalef hard pocket climbing with rulebook energy.", "带规则书气质的马尔加莱夫高难洞点线。"],
    summary: ["First Ley is for climbers who like the idea that a route can feel like a law of physics with smaller holds.", "First Ley 适合喜欢路线像一条小点版本物理定律的人。"],
    bestFor: ["Advanced climbers comparing hard Margalef pocket objectives.", "适合比较马尔加莱夫高难洞点目标的进阶攀岩者。"],
    decisionHint: ["Pick it when precision and strength both need to show up.", "当精准和力量都必须到场时，选它。"],
    practiceFocus: [["finger strength", "precision", "project tracking"], ["手指力量", "精准", "项目记录"]],
    editorialTips: [["Pocket routes reward exactness before drama.", "Small holds make honest notes very useful."], ["洞点路线先奖励准确，再奖励戏剧性。", "小点会让诚实记录非常有用。"]]
  }),
  "demencia-senil-margalef": routeCopy({
    style: ["Margalef pocket endurance with hard-route reputation.", "带高难名声的马尔加莱夫洞点耐力线。"],
    summary: ["Demencia Senil is for climbers who want a serious Margalef project with a name that does not try to sound polite.", "Demencia Senil 适合想要认真马尔加莱夫项目，而且不要求名字很客气的人。"],
    bestFor: ["Climbers practicing hard pocket endurance and session control.", "适合练高难洞点耐力和 session 控制的人。"],
    decisionHint: ["Choose it when you want a demanding project rhythm.", "当你想要一个要求很高的项目节奏时，选它。"],
    practiceFocus: [["pocket endurance", "session discipline", "mental reset"], ["洞点耐力", "session 纪律", "心理重启"]],
    editorialTips: [["Hard endurance improves through repeatable structure.", "Let the route be intense; keep your process calm."], ["高难耐力靠可重复结构进步。", "路线可以强烈，流程保持冷静。"]]
  }),
  "era-vella-margalef": routeCopy({
    style: ["Long Margalef endurance with major sport-climbing history.", "带重要运动攀历史的长距离马尔加莱夫耐力线。"],
    summary: ["Era Vella is for climbers who want a route that feels like a sustained conversation with Margalef's harder side.", "Era Vella 适合想和马尔加莱夫更难的一面进行持续对话的人。"],
    bestFor: ["Advanced sport climbers building long-route endurance.", "适合建立长路线耐力的进阶运动攀岩者。"],
    decisionHint: ["Pick it when pacing is the project, not a side note.", "当节奏就是项目，而不是旁注时，选它。"],
    practiceFocus: [["route endurance", "pacing", "recovery"], ["路线耐力", "节奏", "恢复"]],
    editorialTips: [["Long resistance routes reward climbers who spend effort wisely.", "A good rest can be a move you do not see on paper."], ["长耐力路线奖励会聪明花力气的人。", "好的休息可能是纸面上看不到的动作。"]]
  }),
  "mejorando-imagen-margalef": routeCopy({
    style: ["Margalef sport climbing with image-improving humor and real training value.", "名字有自我形象幽默，但训练价值真实的马尔加莱夫运动线。"],
    summary: ["Mejorando Imagen is for climbers who want to improve the day, the movement, and maybe the self-image just a little.", "Mejorando Imagen 适合想改善今天、改善动作，也顺便改善一点自我形象的人。"],
    bestFor: ["Climbers looking for useful pocket practice with lighter pressure.", "适合寻找有用洞点练习、压力稍轻的人。"],
    decisionHint: ["Choose it when you want progress without making the day too heavy.", "当你想要进步，但不想让今天太沉时，选它。"],
    practiceFocus: [["confidence", "pocket basics", "movement economy"], ["信心", "洞点基础", "动作经济性"]],
    editorialTips: [["Progress routes are not filler.", "Use easier-feeling days to notice better habits."], ["进步路线不是填空。", "用感觉较轻的日子观察更好的习惯。"]]
  }),
  "the-full-journey-margalef": routeCopy({
    style: ["Margalef endurance card with long-view project personality.", "带长期项目性格的马尔加莱夫耐力路线卡。"],
    summary: ["The Full Journey is for climbers who understand that some routes are named after the process, not just the finish.", "The Full Journey 适合明白有些路线名说的是过程，而不只是终点的人。"],
    bestFor: ["Climbers who want sustained practice and project patience.", "适合想要持续练习和项目耐心的人。"],
    decisionHint: ["Pick it when you are ready to value the whole process.", "当你准备好重视整个过程时，选它。"],
    practiceFocus: [["endurance", "patience", "project notes"], ["耐力", "耐心", "项目记录"]],
    editorialTips: [["A journey route asks for honest logging.", "Celebrate useful information, not only sends."], ["旅程型路线要求诚实记录。", "庆祝有用信息，不只庆祝完攀。"]]
  }),
  "gancho-perfecto-margalef": routeCopy({
    style: ["Margalef pocket route with compact hook-and-hold imagination.", "带钩点想象力的紧凑马尔加莱夫洞点线。"],
    summary: ["Gancho Perfecto is for climbers who like the idea of a perfect hook, then accept that perfection takes practice.", "Gancho Perfecto 适合喜欢完美钩点这个想法，并接受完美需要练习的人。"],
    bestFor: ["Climbers working on pocket accuracy and body position.", "适合练洞点准确性和身体位置的人。"],
    decisionHint: ["Choose it when precision sounds more interesting than volume.", "当精准比堆量更有吸引力时，选它。"],
    practiceFocus: [["pocket accuracy", "body position", "confidence"], ["洞点准确", "身体位置", "信心"]],
    editorialTips: [["Perfect is built from many imperfect attempts.", "Use each try to learn one cleaner detail."], ["完美是由很多不完美尝试搭出来的。", "每次尝试学到一个更干净的细节。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "moonwalker-yangshuo": routeCopy({
    style: ["Yangshuo limestone with moon-gate scenery and sport-climbing flow.", "带月亮门风景和运动攀流动感的阳朔灰岩线。"],
    summary: ["Moonwalker is for climbers who want Yangshuo to feel scenic, playful, and still like real climbing.", "Moonwalker 适合想让阳朔既有风景、又有玩心、同时仍像真实攀岩的人。"],
    bestFor: ["Climbers seeking flow and travel-day climbing energy.", "适合寻找流动感和旅行日攀岩能量的人。"],
    decisionHint: ["Pick it when you want movement with a little postcard magic.", "当你想要动作里带一点明信片魔法时，选它。"],
    practiceFocus: [["limestone flow", "confidence", "travel rhythm"], ["灰岩流动", "信心", "旅行节奏"]],
    editorialTips: [["Scenic routes still reward good habits.", "Let the view lift your mood, not distract your feet."], ["风景路线依然奖励好习惯。", "让风景提起心情，不要分散脚法。"]]
  }),
  "over-the-moon-yangshuo": routeCopy({
    style: ["Yangshuo limestone with cheerful route-name energy.", "带开心路线名气质的阳朔灰岩线。"],
    summary: ["Over the Moon is a good card when you want climbing to feel bright without becoming shallow.", "Over the Moon 适合想让攀岩感觉明亮，但不只是好看的人。"],
    bestFor: ["Climbers mixing confidence, flow, and a travel mood.", "适合把信心、流动感和旅行心情混在一起的人。"],
    decisionHint: ["Choose it when joy is useful fuel.", "当快乐是有用燃料时，选它。"],
    practiceFocus: [["confidence", "movement flow", "breathing"], ["信心", "动作流动", "呼吸"]],
    editorialTips: [["A happy route can still teach serious movement.", "Keep the mood light and the climbing attentive."], ["快乐路线也能教认真动作。", "心情保持轻，攀登保持专注。"]]
  }),
  "the-egg-yangshuo": routeCopy({
    style: ["Yangshuo limestone route card with approachable, rounded personality.", "带亲近圆润性格的阳朔灰岩路线卡。"],
    summary: ["The Egg is for climbers who want a friendly objective that still helps hatch better habits.", "The Egg 适合想要友好目标，同时孵出更好习惯的人。"],
    bestFor: ["Climbers building limestone basics and confidence.", "适合建立灰岩基础和信心的人。"],
    decisionHint: ["Pick it when a softer day still needs purpose.", "当轻一点的一天仍然需要目标时，选它。"],
    practiceFocus: [["limestone basics", "confidence", "movement economy"], ["灰岩基础", "信心", "动作经济性"]],
    editorialTips: [["Friendly routes are great for installing better rhythm.", "Do not rush past the lesson because the mood feels easy."], ["友好路线很适合安装更好的节奏。", "不要因为气氛轻松就跳过课程。"]]
  }),
  "spicy-noodle-yangshuo": routeCopy({
    style: ["Yangshuo sport climbing with playful heat and limestone movement.", "带玩心辣味和灰岩动作的阳朔运动线。"],
    summary: ["Spicy Noodle is for days when you want the route list to grin, then give you a little kick.", "Spicy Noodle 适合想让路线清单先笑一下，然后给你一点辣味的一天。"],
    bestFor: ["Climbers wanting fun, effort, and memorable movement.", "适合想要乐趣、努力和记忆点动作的人。"],
    decisionHint: ["Choose it when playful intensity sounds right.", "当有玩心的强度听起来正合适时，选它。"],
    practiceFocus: [["power endurance", "confidence", "fun"], ["力量耐力", "信心", "乐趣"]],
    editorialTips: [["A spicy day still needs smart pacing.", "Enjoy the flavor without letting the session get sloppy."], ["有辣味的一天也需要聪明节奏。", "享受味道，但别让 session 变乱。"]]
  }),
  "lizard-king-yangshuo": routeCopy({
    style: ["Yangshuo limestone with playful-name authority and technical flavor.", "名字有玩心权威感、动作有技术味道的阳朔灰岩线。"],
    summary: ["Lizard King is for climbers who want a route with character, a little swagger, and enough movement to stay honest.", "Lizard King 适合想要有性格、有一点 swagger，也有足够动作让人诚实的路线。"],
    bestFor: ["Climbers who like style, movement reading, and lighthearted focus.", "适合喜欢风格、读线和轻松专注的人。"],
    decisionHint: ["Pick it when personality is part of the motivation.", "当路线性格也是动力的一部分时，选它。"],
    practiceFocus: [["route reading", "technical movement", "confidence"], ["读线", "技术动作", "信心"]],
    editorialTips: [["Let the fun name invite focus, not carelessness.", "Good style is usually quiet before it looks cool."], ["让有趣名字邀请专注，不要邀请随便。", "好风格通常先是安静，然后才显得酷。"]]
  }),
  "single-life-yangshuo": routeCopy({
    style: ["Yangshuo limestone with steady sport-climbing rhythm.", "节奏稳定的阳朔灰岩运动线。"],
    summary: ["Single Life is for climbers who want a clear, manageable route day with enough personality to remember.", "Single Life 适合想要清楚、可管理，同时有记忆点路线日的人。"],
    bestFor: ["Climbers building lead rhythm and movement confidence.", "适合建立先锋节奏和动作信心的人。"],
    decisionHint: ["Choose it when steady progress is the goal.", "当稳定进步是目标时，选它。"],
    practiceFocus: [["lead rhythm", "confidence", "movement economy"], ["先锋节奏", "信心", "动作经济性"]],
    editorialTips: [["Steady routes are where useful confidence gets built.", "Practice noticing when you climb smoothly."], ["稳定路线是建立有用信心的地方。", "练习注意自己什么时候爬得顺。"]]
  }),
  "red-dragon-yangshuo": routeCopy({
    style: ["Yangshuo limestone with mythic-name energy and sport-climbing bite.", "带神话名字气质和运动攀咬合感的阳朔灰岩线。"],
    summary: ["Red Dragon is for climbers who want a route card that feels vivid without pretending to be a legend by default.", "Red Dragon 适合想要鲜明路线卡，但不默认把它神话化的人。"],
    bestFor: ["Climbers seeking style, energy, and a focused sport objective.", "适合寻找风格、能量和专注运动目标的人。"],
    decisionHint: ["Pick it when the day wants color and commitment.", "当今天需要一点颜色和投入时，选它。"],
    practiceFocus: [["power endurance", "focus", "route reading"], ["力量耐力", "专注", "读线"]],
    editorialTips: [["A dramatic name can be motivating if your plan stays practical.", "Let the route be vivid; keep your decisions plain."], ["戏剧化名字可以激励你，只要计划保持实际。", "让路线鲜明，让决定朴素。"]]
  }),
  "white-mountain-lines-yangshuo": routeCopy({
    style: ["Yangshuo area-context limestone card for broad style comparison.", "用于广泛风格比较的阳朔区域灰岩路线卡。"],
    summary: ["White Mountain Lines is a useful placeholder-style card for comparing Yangshuo limestone movement while stronger route-specific sources are added.", "White Mountain Lines 是一张有用的区域风格卡，用来比较阳朔灰岩动作，之后还需要补更强路线来源。"],
    bestFor: ["Climbers using ClimbAtlas to compare Yangshuo styles before deeper research.", "适合先用 ClimbAtlas 比较阳朔风格，再继续深入查证的人。"],
    decisionHint: ["Choose it as a research prompt, not a finished route recommendation.", "把它当研究提示，而不是完成版路线推荐。"],
    practiceFocus: [["source review", "limestone reading", "style comparison"], ["来源复核", "灰岩阅读", "风格比较"]],
    editorialTips: [["A transparent placeholder is better than confident fiction.", "Use this card to guide future verification, not final planning."], ["透明的占位内容胜过自信的虚构。", "用这张卡指导后续核验，不要直接用于最终计划。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "air-china-liming": routeCopy({
    style: ["Liming sandstone crack style with adventurous trad character.", "带冒险 trad 性格的黎明砂岩裂缝风格。"],
    summary: ["Air China is a Liming card for climbers who want crack climbing to feel like travel, technique, and a little altitude in the imagination.", "Air China 适合想让裂缝攀变成旅行、技术和一点想象高度的人。"],
    bestFor: ["Trad climbers comparing Liming's crack-climbing personality.", "适合比较黎明裂缝攀风格的传统攀岩者。"],
    decisionHint: ["Pick it when crack technique is the main reason you opened the atlas.", "当裂缝技术是你打开地图的主要理由时，选它。"],
    practiceFocus: [["crack technique", "trad composure", "sandstone movement"], ["裂缝技术", "trad 镇定", "砂岩移动"]],
    editorialTips: [["A crack route asks for craft before force.", "Use this card for style choice, not logistics."], ["裂缝路线先要求手艺，再要求力量。", "用这张卡选风格，不要当后勤信息。"]]
  }),
  "the-guardian-liming": routeCopy({
    style: ["Liming sandstone trad style with watchful, adventurous energy.", "带守望感和冒险气质的黎明砂岩 trad 风格。"],
    summary: ["The Guardian is for climbers who want a route name that sounds like it will check your systems before letting you pass.", "The Guardian 适合喜欢路线名像会先检查你系统再放行的人。"],
    bestFor: ["Climbers practicing trad judgment and movement control.", "适合练 trad 判断和动作控制的人。"],
    decisionHint: ["Choose it when you want the day to feel careful and grounded.", "当你想让今天谨慎、踏实一点时，选它。"],
    practiceFocus: [["trad judgment", "movement control", "crack basics"], ["trad 判断", "动作控制", "裂缝基础"]],
    editorialTips: [["Let the guardian idea remind you to be organized.", "Adventure feels better when your basics are quiet and solid."], ["让守护者这个意象提醒你保持有序。", "基础安静扎实时，冒险感更舒服。"]]
  }),
  "faraway-corner-liming": routeCopy({
    style: ["Moderate Liming sandstone crack flavor with distant-corner charm.", "带远方角落魅力的黎明适中砂岩裂缝风格。"],
    summary: ["Faraway Corner is for days when you want Liming to feel curious, approachable, and slightly off the obvious path.", "Faraway Corner 适合想让黎明显得好奇、亲近、又稍微偏离明显路线的人。"],
    bestFor: ["Climbers building crack rhythm and confidence.", "适合建立裂缝节奏和信心的人。"],
    decisionHint: ["Pick it when a friendlier crack day still sounds useful.", "当更友好的裂缝日仍然很有用时，选它。"],
    practiceFocus: [["crack rhythm", "confidence", "footwork"], ["裂缝节奏", "信心", "脚法"]],
    editorialTips: [["Moderate cracks are excellent technique teachers.", "Let curiosity lead, but keep judgment in the room."], ["适中裂缝是很好的技术老师。", "让好奇心带路，但让判断力留在房间里。"]]
  }),
  "kung-fu-fighter-liming": routeCopy({
    style: ["Physical Liming sandstone crack card with playful martial energy.", "带一点武术玩心的黎明身体型砂岩裂缝卡。"],
    summary: ["Kung Fu Fighter is for climbers who want movement to feel physical, focused, and maybe just theatrical enough to smile.", "Kung Fu Fighter 适合想让动作有身体感、专注感，并且刚好戏剧到能笑一下的人。"],
    bestFor: ["Trad climbers who like power, body tension, and style variety.", "适合喜欢力量、身体张力和风格变化的传统攀岩者。"],
    decisionHint: ["Choose it when you want a sharper crack-climbing recommendation.", "当你想要更尖锐一点的裂缝推荐时，选它。"],
    practiceFocus: [["body tension", "crack power", "mental pacing"], ["身体张力", "裂缝力量", "心理节奏"]],
    editorialTips: [["Playful names can still train serious control.", "Do not turn physical climbing into frantic climbing."], ["有玩心的名字也能训练认真控制。", "不要把身体型攀登变成慌乱型攀登。"]]
  }),
  "japanese-cowboy-liming": routeCopy({
    style: ["Liming sandstone crack style with road-movie personality.", "带公路电影气质的黎明砂岩裂缝风格。"],
    summary: ["Japanese Cowboy is for climbers who like a route name with odd charm and a style that still asks for clean habits.", "Japanese Cowboy 适合喜欢路线名有奇妙魅力，同时仍接受干净习惯要求的人。"],
    bestFor: ["Climbers comparing Liming's approachable crack routes.", "适合比较黎明较亲近裂缝路线的人。"],
    decisionHint: ["Pick it when you want a balanced crack-climbing card.", "当你想要一张平衡裂缝攀路线卡时，选它。"],
    practiceFocus: [["crack basics", "movement flow", "trad confidence"], ["裂缝基础", "动作流动", "trad 信心"]],
    editorialTips: [["Let the name be quirky; let the process be tidy.", "Good crack days are built from repeatable basics."], ["名字可以古怪，流程要整洁。", "好的裂缝日由可重复基础搭出来。"]]
  }),
  "pillar-of-dreams-liming": routeCopy({
    style: ["Liming sandstone multi-pitch/adventure flavor with big-name mood.", "带大名字氛围的黎明砂岩多段/冒险风格。"],
    summary: ["Pillar of Dreams is for climbers who want the route list to feel taller, slower, and more imaginative.", "Pillar of Dreams 适合想让路线清单更高、更慢、更有想象力的人。"],
    bestFor: ["Climbers drawn to adventure mindset and longer trad objectives.", "适合被冒险心态和较长 trad 目标吸引的人。"],
    decisionHint: ["Choose it when the dream is useful fuel, not a replacement for planning.", "当梦想是有用燃料，而不是计划替代品时，选它。"],
    practiceFocus: [["multi-pitch judgment", "trad systems", "exposure management"], ["多段判断", "trad 系统", "暴露感管理"]],
    editorialTips: [["Dreamy names still need practical pacing.", "Let the route inspire preparation, not shortcuts."], ["梦幻名字依然需要实际节奏。", "让路线激发准备，不要激发捷径。"]]
  }),
  "climb-like-a-girl-liming": routeCopy({
    style: ["Moderate Liming sandstone crack style with confidence energy.", "带信心能量的黎明适中砂岩裂缝风格。"],
    summary: ["Climb Like a Girl is a useful confidence card: good for movement, identity, and remembering strength has many styles.", "Climb Like a Girl 是一张很有用的信心卡：适合动作、身份感，也提醒你力量有很多风格。"],
    bestFor: ["Climbers building crack rhythm and positive momentum.", "适合建立裂缝节奏和积极动能的人。"],
    decisionHint: ["Pick it when confidence and clean movement are the goals.", "当信心和干净动作是目标时，选它。"],
    practiceFocus: [["confidence", "crack rhythm", "efficient feet"], ["信心", "裂缝节奏", "高效脚法"]],
    editorialTips: [["Use confidence routes to make better habits stick.", "Strength does not have to look loud to be real."], ["用信心路线让好习惯留下来。", "真实力量不一定要很大声。"]]
  }),
  "lightning-crack-liming": routeCopy({
    style: ["Liming sandstone crack style with sharp physical emphasis.", "身体感更尖锐的黎明砂岩裂缝风格。"],
    summary: ["Lightning Crack is for climbers who want a crack route card that feels quick, bright, and a little demanding.", "Lightning Crack 适合想要一张快速、明亮、也有点要求的裂缝路线卡。"],
    bestFor: ["Experienced trad climbers comparing physical Liming crack styles.", "适合比较黎明身体型裂缝风格的有经验 trad 攀岩者。"],
    decisionHint: ["Choose it when you want sharper crack-climbing focus.", "当你想要更尖锐的裂缝攀焦点时，选它。"],
    practiceFocus: [["finger crack strength", "body position", "calm effort"], ["指缝力量", "身体位置", "冷静出力"]],
    editorialTips: [["Sharp routes reward calm effort more than sudden panic.", "Let the name be fast; let your pacing be patient."], ["尖锐路线奖励冷静出力，不奖励突然恐慌。", "名字可以快，你的节奏要耐心。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "school-gate-route-line-long-dong": routeCopy({
    style: ["Long Dong seaside sandstone entry-style route context.", "龙洞海边砂岩入门风格路线语境。"],
    summary: ["School Gate is a transparent route-line card for climbers comparing Long Dong's approachable seaside movement.", "School Gate 是一张透明的路线线索卡，用来比较龙洞较亲近的海边动作风格。"],
    bestFor: ["Climbers using the atlas to understand Long Dong style before deeper source checks.", "适合先用地图理解龙洞风格，再继续做来源核验的人。"],
    decisionHint: ["Pick it as a style prompt, not a finished guidebook entry.", "把它当风格提示，不要当完成版路书条目。"],
    practiceFocus: [["seaside movement", "confidence", "sandstone footwork"], ["海边移动", "信心", "砂岩脚法"]],
    editorialTips: [["Transparent placeholders are better than fake confidence.", "Use this card to guide future verification."], ["透明占位胜过虚假自信。", "用这张卡指导后续核验。"]]
  }),
  "golden-valley-route-line-long-dong": routeCopy({
    style: ["Long Dong sandstone route-line context with trad-minded flavor.", "带 trad 气质的龙洞砂岩路线线索语境。"],
    summary: ["Golden Valley is for climbers comparing Long Dong's adventurous side while keeping the source strength honest.", "Golden Valley 适合比较龙洞更冒险的一面，同时保持来源强度诚实的人。"],
    bestFor: ["Climbers interested in Long Dong trad character and area context.", "适合对龙洞 trad 性格和区域语境感兴趣的人。"],
    decisionHint: ["Choose it as a research card for adventurous seaside style.", "把它当研究卡，用来理解海边冒险风格。"],
    practiceFocus: [["trad judgment", "movement control", "ocean exposure"], ["trad 判断", "动作控制", "海边暴露感"]],
    editorialTips: [["Area-context cards should stay cautious.", "Do not turn weak metadata into confident advice."], ["区域语境卡要保持克制。", "不要把弱元数据写成自信建议。"]]
  }),
  "back-door-route-line-long-dong": routeCopy({
    style: ["Long Dong sandstone route-line context for style comparison.", "用于风格比较的龙洞砂岩路线线索。"],
    summary: ["Back Door is a cautious seed card for comparing Long Dong movement without pretending the source pack is complete.", "Back Door 是一张谨慎 seed 卡，用来比较龙洞动作风格，不假装来源包已经完整。"],
    bestFor: ["Climbers building a Long Dong shortlist for future verification.", "适合为后续核验建立龙洞候选清单的人。"],
    decisionHint: ["Pick it when you want a research prompt with clear limits.", "当你想要一张边界清楚的研究提示卡时，选它。"],
    practiceFocus: [["route judgment", "sandstone technique", "confidence"], ["路线判断", "砂岩技术", "信心"]],
    editorialTips: [["A good placeholder names uncertainty clearly.", "Future source work should decide how this card grows."], ["好的占位会清楚说出不确定性。", "未来来源工作会决定这张卡怎么成长。"]]
  }),
  "music-hall-route-line-long-dong": routeCopy({
    style: ["Long Dong seaside sandstone with playful venue-name energy.", "带场馆名字玩心的龙洞海边砂岩风格。"],
    summary: ["Music Hall is for climbers who want the area to feel lively, technical, and still honestly marked as a route-line placeholder.", "Music Hall 适合想让区域显得有活力、有技术味，同时仍诚实标注为路线线索的人。"],
    bestFor: ["Climbers comparing Long Dong's varied seaside sectors.", "适合比较龙洞不同海边区域风格的人。"],
    decisionHint: ["Choose it as a style sampler for future source strengthening.", "把它当未来补强来源前的风格样本。"],
    practiceFocus: [["technical footwork", "route reading", "lead rhythm"], ["技术脚法", "读线", "先锋节奏"]],
    editorialTips: [["Let the name add color, not false certainty.", "Keep the card useful by keeping it honest."], ["让名字增加色彩，不要增加虚假确定性。", "保持诚实，这张卡才有用。"]]
  }),
  "grand-auditorium-route-line-long-dong": routeCopy({
    style: ["Long Dong sandstone route-line context with big-space personality.", "带大空间感的龙洞砂岩路线线索语境。"],
    summary: ["Grand Auditorium is a broad style card for climbers who want Long Dong to feel open, coastal, and source-aware.", "Grand Auditorium 是一张宽风格卡，适合想理解龙洞开阔、海岸和来源状态的人。"],
    bestFor: ["Climbers comparing area personality before exact route verification.", "适合在精确路线核验前比较区域性格的人。"],
    decisionHint: ["Pick it when you want coastal exposure as part of the style picture.", "当海岸暴露感是风格图景的一部分时，选它。"],
    practiceFocus: [["exposure management", "sandstone movement", "trad composure"], ["暴露感管理", "砂岩移动", "trad 镇定"]],
    editorialTips: [["Big names can make placeholders sound finished; this one is not.", "Use it to organize questions for stronger sources."], ["大名字会让占位听起来完成了；这张还没有。", "用它整理之后要向强来源确认的问题。"]]
  }),
  "first-cave-route-line-long-dong": routeCopy({
    style: ["Long Dong sandstone cave-context card for confidence mileage.", "用于信心里程的龙洞砂岩洞穴语境卡。"],
    summary: ["First Cave is for climbers who want a lighter Long Dong style card while stronger route-level facts are still being gathered.", "First Cave 适合想要较轻龙洞风格卡，同时等待更强路线事实补充的人。"],
    bestFor: ["Climbers seeking approachable seaside sandstone context.", "适合寻找较亲近海边砂岩语境的人。"],
    decisionHint: ["Choose it when confidence and style comparison are the goals.", "当目标是信心和风格比较时，选它。"],
    practiceFocus: [["confidence", "movement economy", "sandstone basics"], ["信心", "动作经济性", "砂岩基础"]],
    editorialTips: [["Lower-pressure cards are useful if they stay transparent.", "Do not use this as logistical route information."], ["低压力卡只要透明就很有用。", "不要把它当路线后勤信息。"]]
  }),
  "second-cave-route-line-long-dong": routeCopy({
    style: ["Long Dong sandstone cave-style route-line context.", "龙洞砂岩洞穴风格路线线索语境。"],
    summary: ["Second Cave helps compare Long Dong's seaside movement palette without overclaiming exact route detail.", "Second Cave 用来比较龙洞海边动作调色盘，同时不夸大精确路线细节。"],
    bestFor: ["Climbers preparing a research shortlist for Long Dong.", "适合为龙洞建立研究候选清单的人。"],
    decisionHint: ["Pick it when you want a style card that admits its limits.", "当你想要一张承认边界的风格卡时，选它。"],
    practiceFocus: [["technical movement", "foot precision", "route flow"], ["技术动作", "脚点精准", "路线流动"]],
    editorialTips: [["Source-light cards should make you more curious, not more certain.", "Future community notes can improve this without inventing reviews."], ["来源轻的卡片应该让你更好奇，而不是更确定。", "未来社区笔记可以改善它，但不能编评价。"]]
  }),
  "clocktower-route-line-long-dong": routeCopy({
    style: ["Long Dong sandstone route-line context with classic landmark mood.", "带地标感的龙洞砂岩路线线索语境。"],
    summary: ["Clocktower is for climbers who want a memorable Long Dong reference point while keeping route-level certainty clearly labeled.", "Clocktower 适合想要一个有记忆点的龙洞参考，同时清楚标注路线级确定性的人。"],
    bestFor: ["Climbers comparing Long Dong sectors and future verification priorities.", "适合比较龙洞区域和未来核验优先级的人。"],
    decisionHint: ["Choose it as a research marker, not final route advice.", "把它当研究标记，不要当最终路线建议。"],
    practiceFocus: [["trad composure", "technical power", "ocean exposure"], ["trad 镇定", "技术力量", "海边暴露感"]],
    editorialTips: [["A landmark card is useful when it points to better research.", "Keep the social layer for real user notes later."], ["地标卡在能指向更好研究时很有用。", "社区层以后要留给真实用户笔记。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "humanality-railay-tonsai": routeCopy({
    style: ["Tropical limestone multi-pitch with beach-and-exposure personality.", "带海滩和暴露感性格的热带灰岩多段路线。"],
    summary: ["Humanality is for climbers who want Railay/Tonsai to feel vertical, scenic, and a little unreal in the best way.", "Humanality 适合想让 Railay/Tonsai 变得垂直、有风景、并且好得有点不真实的人。"],
    bestFor: ["Climbers drawn to limestone exposure and tropical atmosphere.", "适合被灰岩暴露感和热带氛围吸引的人。"],
    decisionHint: ["Pick it when scenery and height are part of the motivation.", "当风景和高度都是动力的一部分时，选它。"],
    practiceFocus: [["multi-pitch rhythm", "limestone movement", "exposure comfort"], ["多段节奏", "灰岩移动", "暴露感适应"]],
    editorialTips: [["Beautiful settings still need calm systems.", "Let the beach mood lift the day, not loosen your attention."], ["漂亮环境依然需要冷静系统。", "让海滩气氛提起心情，不要放松注意力。"]]
  }),
  "lord-of-the-thais-railay-tonsai": routeCopy({
    style: ["Steep tropical limestone with classic hard-route energy.", "带经典高难气质的热带陡灰岩线。"],
    summary: ["Lord of the Thais is for climbers who want the route list to bow politely, then demand power endurance.", "Lord of the Thais 适合想让路线清单先礼貌鞠躬，然后要求力量耐力的人。"],
    bestFor: ["Sport climbers comparing harder Railay/Tonsai limestone routes.", "适合比较 Railay/Tonsai 较难灰岩路线的运动攀岩者。"],
    decisionHint: ["Choose it when you want tropical scenery plus serious effort.", "当你想要热带风景加认真输出时，选它。"],
    practiceFocus: [["power endurance", "steep limestone", "project pacing"], ["力量耐力", "陡灰岩", "项目节奏"]],
    editorialTips: [["Vacation energy and project discipline can coexist.", "Do not let heat make your pacing sloppy."], ["假期能量和项目纪律可以共存。", "不要让热度把节奏弄乱。"]]
  }),
  "groove-tube-railay-tonsai": routeCopy({
    style: ["Railay/Tonsai limestone with friendly groove and flow energy.", "带亲切 groove 和流动感的 Railay/Tonsai 灰岩线。"],
    summary: ["Groove Tube is for days when you want limestone movement to feel rhythmic rather than dramatic.", "Groove Tube 适合想让灰岩动作更有节奏，而不是更戏剧化的一天。"],
    bestFor: ["Climbers building confidence and limestone rhythm.", "适合建立信心和灰岩节奏的人。"],
    decisionHint: ["Pick it when flow sounds more useful than intensity.", "当流动感比强度更有用时，选它。"],
    practiceFocus: [["confidence", "limestone basics", "lead rhythm"], ["信心", "灰岩基础", "先锋节奏"]],
    editorialTips: [["Good rhythm is real training.", "Let friendly climbing teach smoother decisions."], ["好节奏是真训练。", "让友好攀登教你更顺的决定。"]]
  }),
  "defile-exit-railay-tonsai": routeCopy({
    style: ["Railay/Tonsai limestone with warm-weather pacing and route-flow character.", "强调热带节奏和路线流动的 Railay/Tonsai 灰岩风格。"],
    summary: ["Defile Exit is for climbers who want a route card that says keep moving, keep thinking, and maybe drink water.", "Defile Exit 适合想要一张提醒你继续移动、继续思考、也许喝点水的路线卡。"],
    bestFor: ["Climbers seeking moderate limestone movement and travel-day flow.", "适合寻找适中灰岩动作和旅行日流动感的人。"],
    decisionHint: ["Choose it when the day wants movement without becoming heavy.", "当今天想要动作，但不想变沉时，选它。"],
    practiceFocus: [["movement flow", "confidence", "warm-weather pacing"], ["动作流动", "信心", "热带节奏"]],
    editorialTips: [["Heat changes effort; pace like you noticed.", "A lighter route can still build good habits."], ["热度会改变输出；请像注意到了这件事一样安排节奏。", "轻一点的路线也能建立好习惯。"]]
  }),
  "the-king-and-i-railay-tonsai": routeCopy({
    style: ["Tropical limestone sport climbing with theatrical-name charm.", "带戏剧名字魅力的热带灰岩运动线。"],
    summary: ["The King and I is for climbers who want a route name with stage presence and climbing that still asks for attention.", "The King and I 适合喜欢路线名有舞台感，同时攀登仍要求注意力的人。"],
    bestFor: ["Climbers mixing fun, confidence, and limestone reading.", "适合把乐趣、信心和灰岩阅读混在一起的人。"],
    decisionHint: ["Pick it when the route personality helps you get excited.", "当路线性格能帮你兴奋起来时，选它。"],
    practiceFocus: [["power endurance", "route reading", "confidence"], ["力量耐力", "读线", "信心"]],
    editorialTips: [["Let the name be theatrical; let your pacing be practical.", "Fun routes still deserve clean choices."], ["名字可以戏剧化，节奏要实际。", "有趣路线也值得干净选择。"]]
  }),
  "massage-secrets-railay-tonsai": routeCopy({
    style: ["Railay/Tonsai limestone with playful recovery-day personality.", "带玩心和恢复日气质的 Railay/Tonsai 灰岩线。"],
    summary: ["Massage Secrets is for climbers who want the route list to admit that rest, skin, and mood are part of climbing too.", "Massage Secrets 适合想让路线清单承认休息、皮肤和心情也是攀岩一部分的人。"],
    bestFor: ["Climbers choosing lighter limestone mileage with a smile.", "适合带着笑选择较轻灰岩里程的人。"],
    decisionHint: ["Choose it when the day wants useful movement and lower pressure.", "当今天需要有用动作和低一点压力时，选它。"],
    practiceFocus: [["lead rhythm", "confidence", "movement economy"], ["先锋节奏", "信心", "动作经济性"]],
    editorialTips: [["A low-pressure route can still improve your climbing.", "Recovery-minded days are not wasted days."], ["低压力路线依然能让你进步。", "带恢复意识的一天不是浪费。"]]
  }),
  "make-a-way-railay-tonsai": routeCopy({
    style: ["Railay/Tonsai limestone with problem-solving sport rhythm.", "带解题感运动节奏的 Railay/Tonsai 灰岩线。"],
    summary: ["Make a Way is for climbers who like routes that sound optimistic while still asking them to solve the movement.", "Make a Way 适合喜欢路线名很乐观，但仍要求你解动作的人。"],
    bestFor: ["Climbers practicing technical movement and confidence.", "适合练技术动作和信心的人。"],
    decisionHint: ["Pick it when you want a constructive, forward-moving day.", "当你想要建设性、向前走的一天时，选它。"],
    practiceFocus: [["route flow", "technical movement", "confidence"], ["路线流动", "技术动作", "信心"]],
    editorialTips: [["Optimism works best with specific practice.", "Find one cleaner decision each attempt."], ["乐观和具体练习搭配最好。", "每次尝试找一个更干净的决定。"]]
  }),
  "wee-s-present-wall-route-line-railay-tonsai": routeCopy({
    style: ["Railay/Tonsai wall-style placeholder for broad limestone comparison.", "用于广泛灰岩比较的 Railay/Tonsai 墙面风格占位卡。"],
    summary: ["Wee's Present Wall route line is a transparent style card until stronger exact route metadata is added.", "Wee's Present Wall route line 是一张透明风格卡，直到补充更强的精确路线元数据。"],
    bestFor: ["Climbers comparing Railay/Tonsai wall styles before route-level verification.", "适合在路线级核验前比较 Railay/Tonsai 墙面风格的人。"],
    decisionHint: ["Choose it as a research prompt, not a final route recommendation.", "把它当研究提示，不要当最终路线推荐。"],
    practiceFocus: [["route selection", "limestone reading", "confidence"], ["选线", "灰岩阅读", "信心"]],
    editorialTips: [["Honest placeholders keep the atlas trustworthy.", "Future sources should decide how this card becomes more specific."], ["诚实占位让地图保持可信。", "未来来源会决定这张卡如何变得更具体。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "the-wheel-of-life-grampians": routeCopy({
    style: ["Long Grampians cave link-up with bouldering power and route-style endurance.", "结合抱石力量和路线式耐力的 Grampians 长洞穴连接线。"],
    summary: ["The Wheel of Life is for climbers who want a problem that feels less like a single move and more like a weather system.", "The Wheel of Life 适合想要一条不像单个动作、更像一套天气系统的抱石的人。"],
    bestFor: ["Elite climbers comparing long roof links and grade-history context.", "适合比较长屋檐连接和难度历史语境的精英攀岩者。"],
    decisionHint: ["Pick it when endurance, patience, and grade honesty are the whole point.", "当耐力、耐心和清醒看待难度就是重点时，选它。"],
    practiceFocus: [["long power-endurance", "rest strategy", "mental pacing"], ["长力量耐力", "休息策略", "心理节奏"]],
    editorialTips: [["Long boulders reward patience that looks almost unreasonable.", "Use the grade discussion as context, not a promise."], ["长抱石奖励看起来几乎不合理的耐心。", "把难度讨论当语境，不要当承诺。"]]
  }),
  "sleepy-rave-grampians": routeCopy({
    style: ["Grampians cave link-up with hard bouldering and grade-discussion character.", "带高难抱石和难度讨论性格的 Grampians 洞穴连接线。"],
    summary: ["Sleepy Rave is for climbers who want cave energy, sustained effort, and a route card that does not pretend grades are always tidy.", "Sleepy Rave 适合想要洞穴能量、持续输出，并接受难度并不总整齐的人。"],
    bestFor: ["Advanced boulderers interested in hard cave links and history.", "适合对高难洞穴连接和历史感兴趣的进阶抱石者。"],
    decisionHint: ["Choose it when effort management sounds as interesting as pure power.", "当输出管理和纯力量一样有意思时，选它。"],
    practiceFocus: [["link-up stamina", "composure", "power recovery"], ["连接耐力", "镇定", "力量恢复"]],
    editorialTips: [["A link-up can feel like a campaign in miniature.", "Treat grade debate as useful context, not noise."], ["连接线可能像一场缩小版战役。", "把难度争议当有用语境，不要当噪音。"]]
  }),
  "sleepy-hollow-grampians": routeCopy({
    style: ["Hollow Mountain Cave component problem with roof-body-tension focus.", "Hollow Mountain Cave 组件问题，强调屋檐身体张力。"],
    summary: ["Sleepy Hollow is a focused cave card for climbers who want the Grampians roof story in a sharper piece.", "Sleepy Hollow 是一张更集中的洞穴卡，适合想用更小片段理解 Grampians 屋檐故事的人。"],
    bestFor: ["Strong boulderers comparing cave components before bigger links.", "适合在更大连接线前比较洞穴组件的强力抱石者。"],
    decisionHint: ["Pick it when you want a hard cave objective with a clearer frame.", "当你想要一个框架更清楚的高难洞穴目标时，选它。"],
    practiceFocus: [["roof body tension", "specific power", "section rehearsal"], ["屋檐身体张力", "专项力量", "分段练习"]],
    editorialTips: [["Component problems are useful maps of a bigger style.", "This card still needs stronger source depth, so keep it cautious."], ["组成线路有助于理解更大的风格。", "这张卡仍需要更强来源，所以表达要克制。"]]
  }),
  "cave-man-grampians": routeCopy({
    style: ["Grampians cave problem with approachable roof-style reference value.", "具有较亲近屋檐风格参考价值的 Grampians 洞穴问题。"],
    summary: ["Cave Man is for climbers who want a cave reference point without jumping straight to the most mythical links.", "Cave Man 适合想要一个洞穴参考点，但不直接跳到最神话连接线的人。"],
    bestFor: ["Boulderers building roof movement familiarity.", "适合建立屋檐动作熟悉度的抱石者。"],
    decisionHint: ["Choose it when you want cave style with a more approachable frame.", "当你想要洞穴风格，但框架更亲近时，选它。"],
    practiceFocus: [["roof movement", "precision", "attempt pacing"], ["屋檐移动", "精准", "尝试节奏"]],
    editorialTips: [["Useful style markers do not need to be the hardest line.", "Keep the card as metadata until stronger sources are added."], ["有用风格标记不一定要是最难线。", "在补强来源前，把这张卡当元数据使用。"]]
  }),
  "dead-cant-dance-grampians": routeCopy({
    style: ["Hard Grampians cave component with contact-strength emphasis.", "强调接触力量的 Grampians 高难洞穴组件。"],
    summary: ["Dead Can't Dance is for climbers who want the cave to feel sharp, physical, and focused rather than sprawling.", "Dead Can't Dance 适合想要尖锐、身体参与感强、而且更集中的洞穴路线的人。"],
    bestFor: ["Advanced boulderers comparing named cave components.", "适合比较有名洞穴组件的进阶抱石者。"],
    decisionHint: ["Pick it when focused cave power is the goal.", "当目标是集中的洞穴力量时，选它。"],
    practiceFocus: [["contact strength", "try quality", "fatigue control"], ["接触力量", "尝试质量", "疲劳控制"]],
    editorialTips: [["Few good attempts can beat many tired ones.", "Single-source cards should stay clearly marked until improved."], ["少量好尝试胜过很多疲惫尝试。", "单一来源卡在补强前要清楚标注。"]]
  }),
  "rave-heart-grampians": routeCopy({
    style: ["Grampians cave-style card with lower-grade entry energy.", "带较低难度入口气质的 Grampians 洞穴风格卡。"],
    summary: ["Rave Heart is for climbers who want a recognizable cave-flavor card without making the whole day elite-only.", "Rave Heart 适合想要可识别洞穴风味，但不想让全天都变成精英限定的人。"],
    bestFor: ["Boulderers comparing cave movement and confidence-building options.", "适合比较洞穴动作和信心选项的抱石者。"],
    decisionHint: ["Choose it when style exposure matters more than maximum difficulty.", "当风格接触比最大难度更重要时，选它。"],
    practiceFocus: [["movement confidence", "roof pacing", "skin management"], ["动作信心", "屋檐节奏", "皮肤管理"]],
    editorialTips: [["Entry points are useful in serious areas.", "Use lower-pressure cave problems to learn the room."], ["严肃区域里的入口点很有用。", "用低压力洞穴问题熟悉环境。"]]
  }),
  "groove-train-grampians": routeCopy({
    style: ["Hard Grampians sport reference beyond the bouldering story.", "超出抱石叙事的 Grampians 高难运动攀参考线。"],
    summary: ["Groove Train is a useful reminder that the Grampians route menu is broader than cave bouldering.", "Groove Train 提醒你：Grampians 的路线菜单不只有洞穴抱石。"],
    bestFor: ["Sport climbers comparing high-end Grampians candidates.", "适合比较 Grampians 高端候选线的运动攀岩者。"],
    decisionHint: ["Pick it as a roped-climbing research marker until sources grow stronger.", "在来源补强前，把它当绳攀研究标记。"],
    practiceFocus: [["technical endurance", "outdoor composure", "project judgment"], ["技术耐力", "户外镇定", "项目判断"]],
    editorialTips: [["Area-level sources are useful, but not enough for rich detail.", "Keep the card focused on decision context."], ["区域级来源有用，但不足以写丰富细节。", "让卡片专注于决策语境。"]]
  }),
  "serpentine-grampians": routeCopy({
    style: ["Low-trust Grampians sport placeholder with technical-endurance flavor.", "低来源强度的 Grampians 运动攀占位卡，带技术耐力味道。"],
    summary: ["Serpentine is a transparent research card: useful for style comparison, not yet strong enough for confident route storytelling.", "Serpentine 是一张透明研究卡：适合风格比较，但还不足以自信讲路线故事。"],
    bestFor: ["Climbers organizing future Grampians source review.", "适合整理未来 Grampians 来源复核的人。"],
    decisionHint: ["Choose it only as a source-strengthening prompt for now.", "目前只把它当来源补强提示来选。"],
    practiceFocus: [["source review", "technical endurance", "style comparison"], ["来源复核", "技术耐力", "风格比较"]],
    editorialTips: [["Low-trust cards should say so plainly.", "Do not let an interesting name become invented confidence."], ["低信任卡应该直接说明。", "不要让有趣名字变成虚构自信。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "monkey-wedding-rocklands": routeCopy({
    style: ["Historic Rocklands bouldering benchmark with milestone gravity.", "带里程碑重量的 Rocklands 历史抱石标杆。"],
    summary: ["Monkey Wedding is for climbers who want a problem that carries history, pressure, and orange-sandstone intensity.", "Monkey Wedding 适合想要一块承载历史、压力和橙色砂岩强度的抱石的人。"],
    bestFor: ["Elite boulderers comparing famous 8C milestones.", "适合比较著名 8C 里程碑的精英抱石者。"],
    decisionHint: ["Pick it when historical weight is part of the motivation.", "当历史重量是动力的一部分时，选它。"],
    practiceFocus: [["limit bouldering", "attempt discipline", "historical context"], ["极限抱石", "尝试纪律", "历史语境"]],
    editorialTips: [["Milestone problems reward patience as much as power.", "Let the history sharpen preparation, not pressure."], ["里程碑抱石奖励耐心，也奖励力量。", "让历史提高准备质量，不要增加压力。"]]
  }),
  "black-eagle-sds-rocklands": routeCopy({
    style: ["Rocklands sit-start power benchmark with early 8C history.", "带早期 8C 历史的 Rocklands 坐起力量标杆。"],
    summary: ["Black Eagle SDS is for climbers who want compact intensity and a route card with real milestone shadow.", "Black Eagle SDS 适合想要紧凑强度和真实里程碑影子的人。"],
    bestFor: ["Elite boulderers comparing hard sit-start problems.", "适合比较高难坐起抱石的精英抱石者。"],
    decisionHint: ["Choose it when start power and history both matter.", "当起步力量和历史都重要时，选它。"],
    practiceFocus: [["start power", "tension", "high-quality rests"], ["起步力量", "张力", "高质量休息"]],
    editorialTips: [["Sit-start benchmarks reward freshness.", "Keep attempts few enough to stay meaningful."], ["坐起标杆奖励新鲜状态。", "控制尝试次数，让每次都有意义。"]]
  }),
  "livin-large-rocklands": routeCopy({
    style: ["Rocklands highball with grade discussion and serious headspace.", "带难度讨论和严肃心理空间的 Rocklands 高球抱石。"],
    summary: ["Livin' Large is for climbers who understand that sometimes the hardest part is not only the holds.", "Livin' Large 适合明白有时候最难的不只是手点的人。"],
    bestFor: ["Experienced highball boulderers thinking carefully about risk and readiness.", "适合认真考虑风险和准备度的有经验高球抱石者。"],
    decisionHint: ["Pick it when mental readiness is the main attraction, not a footnote.", "当心理准备是主要吸引力，而不是脚注时，选它。"],
    practiceFocus: [["highball composure", "risk judgment", "grade perspective"], ["高球镇定", "风险判断", "难度判断"]],
    editorialTips: [["A highball card should never sound casual.", "Choosing a lower-consequence objective can be excellent judgment."], ["高球卡永远不该听起来随便。", "选择后果更低的目标也可以是优秀判断。"]]
  }),
  "golden-shadow-rocklands": routeCopy({
    style: ["Hard Rocklands sandstone with classic benchmark personality.", "带经典标杆性格的 Rocklands 高难砂岩抱石。"],
    summary: ["Golden Shadow is for climbers who want a famous hard Rocklands line that sits just outside the loudest headlines.", "Golden Shadow 适合想要著名高难 Rocklands 线，但不一定追最大头条的人。"],
    bestFor: ["Advanced boulderers comparing 8B+ Rocklands targets.", "适合比较 Rocklands 8B+ 目标的进阶抱石者。"],
    decisionHint: ["Choose it when you want serious project energy with slightly less mythology.", "当你想要认真项目感，但神话压力稍低时，选它。"],
    practiceFocus: [["precision", "finger strength", "project pacing"], ["精准", "手指力量", "项目节奏"]],
    editorialTips: [["A source-light classic still deserves honest labeling.", "Let the project rhythm matter more than the reputation."], ["来源较轻的经典仍需要诚实标注。", "让项目节奏比名气更重要。"]]
  }),
  "amandla-rocklands": routeCopy({
    style: ["Rocklands hard sandstone card with source-strengthening needs.", "需要补强来源的 Rocklands 高难砂岩卡。"],
    summary: ["Amandla is useful as a serious Rocklands candidate while the source pack grows stronger.", "Amandla 适合作为认真 Rocklands 候选线，同时等待来源包补强。"],
    bestFor: ["Advanced boulderers building a hard Rocklands shortlist.", "适合建立高难 Rocklands 清单的进阶抱石者。"],
    decisionHint: ["Pick it as a research-backed candidate, not a fully finished story.", "把它当有研究依据的候选，而不是完整故事。"],
    practiceFocus: [["specific strength", "patience", "conditions awareness"], ["专项力量", "耐心", "条件意识"]],
    editorialTips: [["Thin source packs should stay visible.", "A good shortlist can include uncertainty if it labels it well."], ["薄来源包应该保持可见。", "好的候选清单可以包含不确定性，只要标注清楚。"]]
  }),
  "mooiste-maise-rocklands": routeCopy({
    style: ["Hard Rocklands sandstone with wishlist-candidate energy.", "带想爬清单气质的 Rocklands 高难砂岩抱石。"],
    summary: ["Mooiste Maise is for climbers comparing hard Rocklands problems while keeping source depth in view.", "Mooiste Maise 适合比较 Rocklands 高难抱石，同时把来源深度放在视野里的人。"],
    bestFor: ["Boulderers organizing serious Rocklands project ideas.", "适合整理认真 Rocklands 项目想法的抱石者。"],
    decisionHint: ["Choose it when comparison and future verification are the goals.", "当目标是比较和后续核验时，选它。"],
    practiceFocus: [["finger recruitment", "session planning", "confidence"], ["手指招募", "session 计划", "信心"]],
    editorialTips: [["Wishlist cards are useful before they are complete.", "Do not let missing sources become invented certainty."], ["想爬清单卡在完整前也有用。", "不要让缺失来源变成虚构确定性。"]]
  }),
  "madiba-rocklands": routeCopy({
    style: ["Rocklands hard sandstone shortlist card with source-light status.", "来源较轻的 Rocklands 高难砂岩候选卡。"],
    summary: ["Madiba is a comparison card for climbers mapping Rocklands hard problems without pretending every detail is settled.", "Madiba 是一张比较卡，适合整理 Rocklands 高难抱石，同时不假装所有细节都已确定的人。"],
    bestFor: ["Advanced climbers narrowing Rocklands project options.", "适合缩小 Rocklands 项目选项的进阶攀岩者。"],
    decisionHint: ["Pick it when you want a transparent project shortlist item.", "当你想要一个透明项目候选项时，选它。"],
    practiceFocus: [["project selection", "power maintenance", "skin care"], ["项目选择", "力量维持", "皮肤管理"]],
    editorialTips: [["Source-light does not mean useless; it means label carefully.", "Future community notes should be real, not invented."], ["来源轻不代表没用；意思是要小心标注。", "未来社区笔记必须真实，不能编。"]]
  }),
  "oliphants-dawn-rocklands": routeCopy({
    style: ["Earlier Rocklands hard-boulder benchmark with history-thread value.", "带历史线索价值的早期 Rocklands 高难抱石标杆。"],
    summary: ["Oliphants Dawn is for climbers who want the Rocklands story to include earlier benchmarks, not only the loudest names.", "Oliphants Dawn 适合想让 Rocklands 故事包含早期标杆，而不只是最大名字的人。"],
    bestFor: ["Boulderers who like development-history context and hard sandstone.", "适合喜欢发展历史语境和高难砂岩的人。"],
    decisionHint: ["Choose it when historical comparison matters more than headline chasing.", "当历史比较比追头条更重要时，选它。"],
    practiceFocus: [["history awareness", "movement variety", "project patience"], ["历史意识", "动作变化", "项目耐心"]],
    editorialTips: [["Older benchmarks help explain a region's shape.", "Keep the card honest until the source pack grows."], ["早期标杆能帮助解释一个区域的形状。", "在来源包成长前保持诚实。"]]
  })
});

Object.assign(routeLocalizedContent, {
  "astroman-washington-column": routeCopy({
    style: ["Steep Yosemite granite with old-school legend energy.", "陡峭的优胜美地花岗岩，带着老派传奇能量。"],
    summary: ["Astroman is for climbers who want history to feel physical. It asks for craft, systems, and a calm head when the route starts sounding famous.", "Astroman 适合想让历史变得很具体的人。它要求技术、系统和一种在名气面前仍然冷静的脑袋。"],
    bestFor: ["Experienced trad climbers comparing serious Yosemite free-climbing objectives.", "适合有经验的传统攀者比较严肃的优胜美地自由攀目标。"],
    decisionHint: ["Pick it when preparation feels exciting, not annoying.", "当准备工作本身也让你兴奋，而不是烦躁时，可以考虑它。"],
    practiceFocus: [["sustained crack movement", "systems", "composure"], ["持续裂缝动作", "系统感", "冷静度"]],
    editorialTips: [["Let the legend sharpen your process, not inflate the drama.", "If smaller crack days feel messy, keep this as training direction first."], ["让传奇感提高你的流程质量，不要提高戏剧性。", "如果小裂缝日还很混乱，先把它当训练方向。"]]
  }),
  "rostrum-north-face-yosemite": routeCopy({
    style: ["Clean, concentrated Yosemite crack climbing.", "干净、集中的优胜美地裂缝攀登。"],
    summary: ["The Rostrum feels like a crack exam with good handwriting: focused, classic, and not interested in excuses.", "The Rostrum 像一张字迹很清楚的裂缝考试卷：集中、经典，而且不太听借口。"],
    bestFor: ["Trad climbers who want sustained crack rhythm without a full big-wall campaign.", "适合想要持续裂缝节奏，但不想直接进入完整大墙战役的传统攀者。"],
    decisionHint: ["Choose it when tidy systems sound as satisfying as the climbing.", "当整洁系统和攀登本身一样有吸引力时，选它。"],
    practiceFocus: [["crack endurance", "pitch rhythm", "gear organization"], ["裂缝耐力", "段落节奏", "装备组织"]],
    editorialTips: [["A compact classic still deserves full attention.", "Practice clean transitions before using the route to test them."], ["紧凑经典也值得完整注意力。", "先练干净转换，再用路线检验它。"]]
  }),
  "east-buttress-middle-cathedral-yosemite": routeCopy({
    style: ["Varied Yosemite multi-pitch climbing with classic mileage.", "变化丰富、有经典里程感的优胜美地多段路线。"],
    summary: ["East Buttress is a practical classic: enough Yosemite flavor to feel real, enough structure to teach without shouting.", "East Buttress 是一条实际的经典：有足够优胜美地味道，也有足够结构让你学习，而不是被吼。"],
    bestFor: ["Teams building confidence before more committing Valley objectives.", "适合在更严肃山谷目标前建立信心的队伍。"],
    decisionHint: ["Pick it when you want a real route day that still feels like learning.", "当你想要真实路线日，但核心仍是学习时，选它。"],
    practiceFocus: [["varied cracks", "route pacing", "team communication"], ["变化裂缝", "路线节奏", "队伍沟通"]],
    editorialTips: [["Classic mileage is not filler; it installs habits.", "Let this route make your team rhythm quieter."], ["经典里程不是填空，它会安装习惯。", "让这条线把队伍节奏变安静。"]]
  }),
  "the-phoenix-yosemite": routeCopy({
    style: ["Short hard crack climbing with milestone gravity.", "短而硬的裂缝线，带着里程碑重量。"],
    summary: ["The Phoenix is small in distance and large in reputation. Use it as a precision compass, not a casual grade comparison.", "The Phoenix 距离很短，名声很大。把它当精准指南针，不要当随手比较难度的尺子。"],
    bestFor: ["Strong crack climbers studying Yosemite's hard free-climbing arc.", "适合研究优胜美地高难自由攀脉络的强裂缝攀者。"],
    decisionHint: ["Choose it as inspiration when a hard crack goal would make training clearer.", "当一个硬裂缝目标能让训练更清楚时，把它当灵感。"],
    practiceFocus: [["finger crack precision", "fresh attempts", "mental reset"], ["手指裂缝精准度", "新鲜尝试", "心理重置"]],
    editorialTips: [["Short routes can still ask for long patience.", "Save your best attempts for your freshest attention."], ["短路线也可能要求很长的耐心。", "把最好的尝试留给注意力最新鲜的时候。"]]
  }),
  "thanatopsis-red-river-gorge": routeCopy({
    style: ["High-end Red River endurance with a serious project mood.", "高端红河峡谷耐力线，带严肃项目气质。"],
    summary: ["Thanatopsis is a training compass in route form: it points toward power endurance, recovery, and patience.", "Thanatopsis 像一枚路线形态的训练指南针：指向力量耐力、恢复和耐心。"],
    bestFor: ["Advanced sport climbers comparing hard Red benchmarks.", "适合比较红河峡谷高难标杆的进阶运动攀者。"],
    decisionHint: ["Pick it when you want your training plan to become more honest.", "当你想让训练计划变得更诚实时，选它。"],
    practiceFocus: [["power endurance", "redpoint patience", "recovery"], ["力量耐力", "红点耐心", "恢复"]],
    editorialTips: [["Do not chase tired attempts just because the route is famous.", "Good notes beat dramatic suffering."], ["不要因为路线有名就追疲惫尝试。", "好记录胜过戏剧化受苦。"]]
  }),
  "gods-own-stone-red-river-gorge": routeCopy({
    style: ["Steep sandstone with dramatic-name energy.", "陡峭砂岩，名字自带戏剧感。"],
    summary: ["God's Own Stone has a big title, but it still rewards small, practical habits.", "God's Own Stone 名字很大，但依旧奖励小而实际的好习惯。"],
    bestFor: ["Sport climbers building a serious Red River project shortlist.", "适合建立严肃红河峡谷项目清单的运动攀者。"],
    decisionHint: ["Choose it when you can keep the plan calmer than the name.", "当你的计划能比路线名更冷静时，选它。"],
    practiceFocus: [["steep power", "attempt structure", "resetting"], ["陡壁力量", "尝试结构", "重置"]],
    editorialTips: [["Let the title be dramatic; keep your climbing plain and useful.", "Track one improvement per session."], ["让名字负责戏剧性，你负责朴素有效。", "每个 session 记录一个进步点。"]]
  }),
  "transworld-depravity-red-river-gorge": routeCopy({
    style: ["Sustained hard sandstone with project-list personality.", "持续高难砂岩，很适合进入项目清单。"],
    summary: ["Transworld Depravity is a lively hard-route card: useful for making training specific without making the day heavy.", "Transworld Depravity 是一张很有性格的高难卡：能让训练更具体，又不必把一天变沉。"],
    bestFor: ["Experienced sport climbers who like hard goals with character.", "适合喜欢有性格高难目标的有经验运动攀者。"],
    decisionHint: ["Pick it when your notes need details, not just motivation.", "当你的记录需要细节，而不只是打气时，选它。"],
    practiceFocus: [["endurance intervals", "movement economy", "session notes"], ["耐力间歇", "动作经济性", "session 记录"]],
    editorialTips: [["Specific feedback makes hard routes less mysterious.", "Do not let a wild name create a wild warm-up."], ["具体反馈会让高难路线没那么神秘。", "不要让狂野名字制造狂野热身。"]]
  }),
  "swingline-red-river-gorge": routeCopy({
    style: ["Power-endurance sandstone with bridge-route usefulness.", "力量耐力砂岩，很适合作为进阶桥梁。"],
    summary: ["Swingline is still hard, but it reads like a useful bridge between ambitious and outrageous.", "Swingline 依然很硬，但读起来像从有野心走向很夸张之间的一座实用桥。"],
    bestFor: ["Climbers seeking a demanding Red goal below the loudest headline grades.", "适合想要高要求红河目标，但暂时不追最大标题难度的人。"],
    decisionHint: ["Choose it when you want challenge with a clear training purpose.", "当你想要挑战，同时训练目的很清楚时，选它。"],
    practiceFocus: [["power endurance", "confidence pacing", "movement economy"], ["力量耐力", "自信节奏", "动作经济性"]],
    editorialTips: [["Bridge routes are where good habits become automatic.", "Pacing is the skill, not the backup plan."], ["桥梁路线最适合把好习惯自动化。", "节奏是核心技能，不是备用方案。"]]
  }),
  "dreamcatcher-squamish": routeCopy({
    style: ["Elite Squamish sport climbing with modern legend status.", "现代传奇级别的斯夸米什精英运动攀。"],
    summary: ["Dreamcatcher is a bright red pin on the atlas: mostly inspiration, unless elite projects are already your normal weather.", "Dreamcatcher 像地图上一枚亮红色图钉：大多数时候是灵感，除非精英项目已经是你的日常天气。"],
    bestFor: ["Elite climbers and curious fans studying Squamish's hardest side.", "适合精英攀者和想了解斯夸米什最硬一面的人。"],
    decisionHint: ["Pick it as a long-term compass, not a weekend suggestion.", "把它当长期指南针，不要当周末建议。"],
    practiceFocus: [["limit power", "precision", "long-term patience"], ["极限力量", "精准度", "长期耐心"]],
    editorialTips: [["Elite inspiration should make the next small step clearer.", "Do not confuse admiration with readiness."], ["精英灵感应该让下一个小步骤更清楚。", "不要把仰慕误认为准备好了。"]]
  }),
  "university-wall-squamish": routeCopy({
    style: ["Serious Chief granite with professor energy.", "严肃的 Chief 花岗岩，有教授感。"],
    summary: ["University Wall has a funny name and a serious tone. It suits teams who enjoy doing their homework.", "University Wall 名字有趣，语气严肃。它适合喜欢做功课的队伍。"],
    bestFor: ["Experienced teams comparing serious Squamish wall objectives.", "适合比较严肃斯夸米什大墙目标的有经验队伍。"],
    decisionHint: ["Pick it when quiet competence sounds appealing.", "当安静的胜任感很有吸引力时，选它。"],
    practiceFocus: [["granite precision", "team rhythm", "wall endurance"], ["花岗岩精准度", "队伍节奏", "大墙耐力"]],
    editorialTips: [["If the plan is fuzzy, choose a clearer route first.", "Serious classics improve preparation habits."], ["如果计划很模糊，先选更清楚的目标。", "严肃经典会改善准备习惯。"]]
  }),
  "freeway-squamish": routeCopy({
    style: ["Long Squamish granite with steady-route energy.", "长距离斯夸米什花岗岩，节奏稳定。"],
    summary: ["Freeway is for climbers who want a full-value Chief day built from rhythm rather than fireworks.", "Freeway 适合想要完整 Chief 路线日的人：靠节奏组成，而不是靠烟火。"],
    bestFor: ["Teams ready for longer granite mileage and cleaner transitions.", "适合准备好更长花岗岩里程和更干净转换的队伍。"],
    decisionHint: ["Choose it when sustained competence is the point.", "当持续胜任感就是重点时，选它。"],
    practiceFocus: [["multi-pitch stamina", "transitions", "granite confidence"], ["多段耐力", "转换", "花岗岩信心"]],
    editorialTips: [["Beautiful long routes still reward boring systems.", "Let the basics become invisible before chasing drama."], ["漂亮长线依然奖励朴素系统。", "先让基础隐形，再追戏剧性。"]]
  }),
  "exasperator-squamish": routeCopy({
    style: ["Compact Squamish crack climbing with technique value.", "紧凑斯夸米什裂缝线，很有技术价值。"],
    summary: ["Exasperator is a satisfying crack lesson without asking the whole day to become a saga.", "Exasperator 是一堂让人满足的裂缝课，不要求整天变成长篇史诗。"],
    bestFor: ["Trad climbers wanting focused crack practice before bigger objectives.", "适合在更大目标前想做集中裂缝练习的传统攀者。"],
    decisionHint: ["Pick it when you want a clean technique day with room left in the notebook.", "当你想要干净技术日，而且笔记本还留有空间时，选它。"],
    practiceFocus: [["hand crack rhythm", "footwork", "calm gear systems"], ["手裂节奏", "脚法", "冷静装备系统"]],
    editorialTips: [["Compact classics can teach faster than giant plans.", "Good crack climbing usually looks calmer than it feels at first."], ["紧凑经典有时比巨大计划教得更快。", "好的裂缝攀登通常比初学时感觉更冷静。"]]
  }),
  "l-angle-allain-fontainebleau": routeCopy({
    style: ["Historic arete movement with elegant footwork.", "历史感棱线动作，脚法很优雅。"],
    summary: ["L'Angle Allain proves that Fontainebleau history can be gentle in grade and sharp in lesson.", "L'Angle Allain 证明枫丹历史可以难度温和，但课程锋利。"],
    bestFor: ["Visitors who want a historical movement lesson before harder chasing.", "适合在追更难之前，先上一堂历史动作课的访客。"],
    decisionHint: ["Choose it when you want old-school cleverness over ego noise.", "当你想要老派聪明，而不是 ego 噪音时，选它。"],
    practiceFocus: [["foot precision", "body position", "quiet attempts"], ["脚法精准", "身体位置", "安静尝试"]],
    editorialTips: [["Let easier classics make you smarter.", "Friendly grades can still teach serious movement."], ["让容易经典把你变聪明。", "友好难度也能教认真动作。"]]
  }),
  "fissure-des-alpinistes-fontainebleau": routeCopy({
    style: ["Low-pressure historical Fontainebleau movement.", "低压力的枫丹历史动作。"],
    summary: ["Fissure des Alpinistes is a small door into the forest's older climbing culture.", "Fissure des Alpinistes 是进入这片森林早期攀岩文化的一扇小门。"],
    bestFor: ["First-time visitors who want history without high pressure.", "适合想低压力感受历史的第一次来访者。"],
    decisionHint: ["Pick it when the day should start with curiosity.", "当今天应该从好奇心开始时，选它。"],
    practiceFocus: [["movement curiosity", "foot trust", "easy mileage"], ["动作好奇心", "信任脚", "轻松里程"]],
    editorialTips: [["Simple-looking shapes still deserve attention.", "History routes are useful even when they are not intimidating."], ["看起来简单的形状也值得注意。", "历史线不吓人也很有用。"]]
  }),
  "duel-fontainebleau": routeCopy({
    style: ["Hard forest precision with focused session pressure.", "高难森林精准线，session 压力很集中。"],
    summary: ["Duel is a problem for thoughtful attempts. It rewards climbers who can stay curious while trying hard.", "Duel 适合认真思考的尝试。它奖励在很用力时仍能保持好奇的人。"],
    bestFor: ["Experienced boulderers comparing high-end Fontainebleau classics.", "适合比较枫丹高端经典的有经验抱石者。"],
    decisionHint: ["Pick it when every attempt can stay meaningful.", "当每次尝试都能保持有意义时，选它。"],
    practiceFocus: [["precision", "skin management", "attempt quality"], ["精准度", "皮肤管理", "尝试质量"]],
    editorialTips: [["Hard forest problems reward sharper attempts, not more noise.", "Protect attention as carefully as skin."], ["高难森林问题奖励更锋利的尝试，而不是更多噪音。", "像保护皮肤一样保护注意力。"]]
  }),
  "karma-fontainebleau": routeCopy({
    style: ["Aspirational Fontainebleau benchmark with modern bite.", "现代感很强的枫丹灵感标杆。"],
    summary: ["Karma is a dream with teeth. Use it to clarify training, not to rush the story.", "Karma 是一个有牙齿的梦想。用它明确训练，不要催剧情。"],
    bestFor: ["Strong boulderers studying the forest's harder references.", "适合研究枫丹更高难参照的强抱石者。"],
    decisionHint: ["Choose it when a hard idea helps you plan the next practical step.", "当一个高难想法能帮你规划下一步练什么时，选它。"],
    practiceFocus: [["limit bouldering", "body tension", "patience"], ["极限抱石", "身体张力", "耐心"]],
    editorialTips: [["Keep the dream vivid and the session practical.", "Aspirational routes are useful when they create honest questions."], ["让梦想鲜明，让 session 实际。", "灵感路线在能提出诚实问题时最有用。"]]
  }),
  "gaia-kalymnos": routeCopy({
    style: ["Serious sunny tufa endurance.", "阳光下的严肃 tufa 耐力。"],
    summary: ["Gaia shows the project side of Kalymnos: beautiful setting, real pump, and zero need for messy climbing.", "Gaia 展示卡林诺斯的项目面：环境漂亮，泵感真实，也完全不需要乱爬。"],
    bestFor: ["Advanced sport climbers looking for a high-end island reference.", "适合寻找高端岛屿参照的进阶运动攀者。"],
    decisionHint: ["Pick it when vacation energy can become disciplined effort.", "当度假能量能变成有纪律输出时，选它。"],
    practiceFocus: [["tufa endurance", "rest strategy", "redpoint patience"], ["tufa 耐力", "休息策略", "红点耐心"]],
    editorialTips: [["Do not let sea views weaken pacing.", "Rest before desperation, not after it."], ["不要让海景削弱节奏。", "在绝望前休息，不是在绝望后。"]]
  }),
  "inshallah-kalymnos": routeCopy({
    style: ["Flowing limestone with memorable trip energy.", "流动灰岩线，很有旅行记忆点。"],
    summary: ["Inshallah is hard enough to focus and friendly enough to keep the day bright.", "Inshallah 难到足以让人专注，也友好到能让一天保持明亮。"],
    bestFor: ["Sport climbers who want a memorable Kalymnos route below elite grades.", "适合想要有记忆点、但不追精英难度的卡林诺斯运动攀者。"],
    decisionHint: ["Choose it when you want fun to still teach something.", "当你想要有趣，同时仍能学到东西时，选它。"],
    practiceFocus: [["flow", "rest timing", "pump control"], ["流动感", "休息时机", "泵感控制"]],
    editorialTips: [["Fun routes are great teachers if you stay attentive.", "Keep the mood light and the pacing smart."], ["有趣路线只要你保持注意，就是好老师。", "心情轻一点，节奏聪明一点。"]]
  }),
  "tufantastic-kalymnos": routeCopy({
    style: ["Playful tufa climbing with real efficiency lessons.", "有玩心的 tufa 攀登，但效率课程很真实。"],
    summary: ["Tufantastic sounds like a joke and behaves like a useful coach.", "Tufantastic 听起来像玩笑，表现得像一个有用教练。"],
    bestFor: ["Climbers who want a fun route with training value.", "适合想要有趣路线，同时也想有训练价值的人。"],
    decisionHint: ["Pick it when relaxed climbing is the practice goal.", "当放松攀登就是练习目标时，选它。"],
    practiceFocus: [["tufa movement", "efficiency", "relaxed power"], ["tufa 动作", "效率", "放松发力"]],
    editorialTips: [["Funny names do not replace footwork.", "Efficiency is more useful than theatrics."], ["有趣名字不能替代脚法。", "效率比戏剧性更有用。"]]
  }),
  "los-revolucionarios-kalymnos": routeCopy({
    style: ["Elite Kalymnos sport climbing at the far end of the spectrum.", "卡林诺斯光谱最远端的精英运动攀。"],
    summary: ["Los Revolucionarios is a research marker first and a practical recommendation only for very few climbers.", "Los Revolucionarios 首先是研究标记，只有极少数攀岩者会把它当现实推荐。"],
    bestFor: ["Elite climbers and route-history nerds studying the island's hardest end.", "适合研究岛上最硬一端的精英攀者和路线历史爱好者。"],
    decisionHint: ["Choose it as inspiration unless elite projects are already your normal life.", "除非精英项目已经是你的日常，否则把它当灵感。"],
    practiceFocus: [["elite endurance", "long-term planning", "recovery discipline"], ["精英耐力", "长期计划", "恢复纪律"]],
    editorialTips: [["Elite cards should clarify direction, not create panic.", "Let the grade ask honest training questions."], ["精英卡应该明确方向，不是制造恐慌。", "让难度提出诚实训练问题。"]]
  })
});

export function getLocalizedText(
  localizedText: LocalizedText | undefined,
  locale: Locale,
  fallback: string
) {
  return localizedText?.[locale] ?? localizedText?.en ?? fallback;
}

export function getLocalizedList(
  localizedList: LocalizedList | undefined,
  locale: Locale,
  fallback: string[]
) {
  return localizedList?.[locale] ?? localizedList?.en ?? fallback;
}

export function getDestinationLocalizedContent(destination: Destination) {
  return destination.localizedContent ?? destinationLocalizedContent[destination.slug];
}

export function getRouteLocalizedContent(route: RouteHighlight) {
  return route.localizedContent ?? routeLocalizedContent[route.id];
}

export function getDestinationDescription(destination: Destination, locale: Locale) {
  return getLocalizedText(
    getDestinationLocalizedContent(destination)?.description,
    locale,
    destination.description
  );
}

export function getRouteStyle(route: RouteHighlight, locale: Locale) {
  return getLocalizedText(getRouteLocalizedContent(route)?.style, locale, route.style);
}

export function getRouteSummary(route: RouteHighlight, locale: Locale) {
  return getLocalizedText(getRouteLocalizedContent(route)?.summary, locale, route.summary);
}

export function getRouteBestFor(route: RouteHighlight, locale: Locale) {
  return getLocalizedText(getRouteLocalizedContent(route)?.bestFor, locale, route.bestFor);
}

export function getRouteDecisionHint(route: RouteHighlight, locale: Locale) {
  return getLocalizedText(
    getRouteLocalizedContent(route)?.decisionHint,
    locale,
    route.decisionHint ?? ""
  );
}

export function getRoutePracticeFocus(route: RouteHighlight, locale: Locale) {
  return getLocalizedList(
    getRouteLocalizedContent(route)?.practiceFocus,
    locale,
    route.practiceFocus
  );
}

export function getRouteEditorialTips(route: RouteHighlight, locale: Locale) {
  return getLocalizedList(
    getRouteLocalizedContent(route)?.editorialTips,
    locale,
    route.editorialTips
  );
}

export function getDestinationSearchText(destination: Destination) {
  const localized = getDestinationLocalizedContent(destination);

  return [
    destination.name,
    destination.country,
    destination.rockType,
    destination.description,
    localized?.description?.en,
    localized?.description?.zh,
    destination.guideContent?.history.en,
    destination.guideContent?.history.zh,
    destination.guideContent?.atmosphere.en,
    destination.guideContent?.atmosphere.zh,
    ...(destination.guideContent?.classicThemes.en ?? []),
    ...(destination.guideContent?.classicThemes.zh ?? []),
    ...(destination.guideContent?.funFacts.en ?? []),
    ...(destination.guideContent?.funFacts.zh ?? []),
    ...(destination.guideContent?.firstVisitTips.en ?? []),
    ...(destination.guideContent?.firstVisitTips.zh ?? []),
    ...(destination.externalResources ?? []).flatMap((resource) => [
      resource.title,
      resource.type,
      resource.description.en,
      resource.description.zh
    ]),
    destination.difficultyRange,
    ...destination.climbingTypes,
    ...destination.bestSeasons
  ]
    .filter(Boolean)
    .join(" ");
}

export function getRouteSearchText(route: RouteHighlight) {
  const localized = getRouteLocalizedContent(route);

  return [
    route.name,
    route.grade,
    route.type,
    route.length,
    route.style,
    route.summary,
    route.bestFor,
    route.decisionHint ?? "",
    route.historicalNotes?.en,
    route.historicalNotes?.zh,
    ...(route.notableAscents ?? []).flatMap((ascent) => [
      ascent.climber,
      ascent.note.en,
      ascent.note.zh,
      ascent.sourceLabel
    ]),
    ...(route.externalResources ?? []).flatMap((resource) => [
      resource.title,
      resource.url,
      resource.type,
      resource.linkStatus,
      resource.description.en,
      resource.description.zh
    ]),
    localized?.style?.en,
    localized?.style?.zh,
    localized?.summary?.en,
    localized?.summary?.zh,
    localized?.bestFor?.en,
    localized?.bestFor?.zh,
    localized?.decisionHint?.en,
    localized?.decisionHint?.zh,
    ...(localized?.practiceFocus?.en ?? []),
    ...(localized?.practiceFocus?.zh ?? []),
    ...(localized?.editorialTips?.en ?? []),
    ...(localized?.editorialTips?.zh ?? []),
    ...(route.personalityTags ?? []),
    ...route.practiceFocus,
    ...route.editorialTips,
    ...route.images.flatMap((image) => [
      image.caption,
      image.credit,
      image.license,
      image.imageType
    ]),
    ...route.sources.flatMap((source) => [
      source.sourceLabel,
      source.type,
      source.trustLevel,
      source.notes,
      ...source.verifies
    ])
  ]
    .filter(Boolean)
    .join(" ");
}
