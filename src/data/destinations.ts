import type {
  Destination,
  ExternalLinkStatus,
  ExternalResource,
  RouteHighlight
} from "@/types/destination";
import { metadataRoutesByDestination } from "@/data/generatedRouteMetadata";
import { resolveRouteId } from "@/lib/routeAliases";

const lastChecked = "2026-06-10";

const popularDestinationGuides: Record<
  string,
  NonNullable<Destination["guideContent"]>
> = {
  "yosemite-usa": {
    history: {
      en: "Yosemite climbing grew from adventurous wall craft into a global stage for free climbing, big-wall systems, and bouldering culture. Big walls, free-climbing testpieces, and influential boulders all share that historical context.",
      zh: "优胜美地的攀岩历史，从早期大墙探险逐渐发展成自由攀、大墙系统和抱石文化的重要舞台。大墙、自由攀经典线和具有影响力的抱石共同构成了这里的历史背景。"
    },
    atmosphere: {
      "en": "The Valley can feel memorable and crowded at the same time. Weather, access, and day-to-day logistics still shape what makes sense to climb.",
      "zh": "山谷既令人难忘，也可能十分拥挤。天气、开放情况和当天的行程安排，都会影响什么路线更适合。"
    },
    classicThemes: {
      en: [
        "Big-wall icons for patient systems people.",
        "Old-school cracks and chimneys that reward craft over hype.",
        "Boulder problems with more cultural weight than their size suggests."
      ],
      zh: [
        "适合系统控和耐心型攀岩者的大墙标志线。",
        "老派裂缝和烟囱，奖励技术而不是气势。",
        "看起来不高，却很有文化重量的经典抱石。"
      ]
    },
    funFacts: {
      en: [
        "A Yosemite route name can sound mythic and still require very ordinary logistics.",
        "Some short Yosemite climbs shaped climbing culture as much as enormous walls."
      ],
      zh: [
        "优胜美地的路线名可能听起来像神话，但准备工作往往非常朴素。",
        "有些很短的路线，对攀岩文化的影响不比大墙小。"
      ]
    },
    firstVisitTips: {
      en: [
        "Choose one style goal, not five.",
        "Let weather and crowds shape the day.",
        "Use classics for learning, not proving."
      ],
      zh: [
        "第一次先选一种风格目标，不要一次想要五种。",
        "让天气和人流参与决定。",
        "把经典线当学习，不要当证明。"
      ]
    }
  },
  "red-river-gorge-usa": {
    history: {
      en: "Red River Gorge became a modern sport-climbing magnet through steep sandstone, dense route development, and strong access culture. Its hard routes are famous, but the real personality is pump with a grin.",
      zh: "红河峡谷凭借陡峭砂岩、密集开发和强烈的准入文化，成为现代运动攀热门地。这里硬线很出名，但真正的性格是带着笑意的泵感。"
    },
    atmosphere: {
      "en": "Friendly woods, steep walls, and plenty of forearm negotiation. It is a good place to learn how endurance and tactics work together.",
      "zh": "友好的树林、陡墙，还有大量和前臂谈判的时刻。这里很适合理解耐力和策略如何配合。"
    },
    classicThemes: {
      en: [
        "Endurance sport routes where rests are part of the personality.",
        "Pocket and edge sequences that ask for calm pacing.",
        "Hard benchmarks that help climbers understand power endurance."
      ],
      zh: [
        "休息点本身就是性格的一部分的耐力运动线。",
        "洞点和小边组成的序列，要求冷静节奏。",
        "帮助理解力量耐力的硬线标杆。"
      ]
    },
    funFacts: {
      en: [
        "Some route names sound playful until your forearms start reading them literally.",
        "A good Red day often feels less like fighting and more like budgeting."
      ],
      zh: [
        "有些路线名听起来很好玩，直到你的前臂开始认真理解它。",
        "红河峡谷的好日子不像打架，更像做预算。"
      ]
    },
    firstVisitTips: {
      en: [
        "Pick routes by style and angle, not only grade.",
        "Save energy for the second half.",
        "Respect access rules and local stewardship."
      ],
      zh: [
        "按风格和角度选线，不只看难度。",
        "给后半天留电量。",
        "尊重准入规则和本地维护。"
      ]
    }
  },
  "squamish-canada": {
    history: {
      en: "Squamish grew around granite, forest, and a town that treats climbing as part of daily weather. The Chief holds cracks, slabs, walls, and modern testpieces in one compact skyline.",
      zh: "斯夸米什围绕花岗岩、森林和把攀岩当日常天气的小镇气质成长起来。The Chief 在同一片天际线里放下裂缝、板壁、大墙和现代测试线。"
    },
    atmosphere: {
      en: "Forest-town energy meets serious granite. It can be casual at breakfast and very precise by the first pitch.",
      zh: "森林小镇的轻松感遇上严肃花岗岩。早餐时可以很随意，第一段开始就需要非常精确。"
    },
    classicThemes: {
      en: [
        "Granite cracks for technique nerds.",
        "Long routes for teams who enjoy rhythm.",
        "Hard single objectives that make power and precision shake hands."
      ],
      zh: [
        "给技术控的花岗岩裂缝。",
        "给喜欢节奏的队伍的长线。",
        "让力量和精准握手的高难单目标。"
      ]
    },
    funFacts: {
      en: [
        "Squamish can make one climber pack crack gloves, slab shoes, and project snacks in the same bag.",
        "The Chief looks like one wall from town, then turns into many moods up close."
      ],
      zh: [
        "斯夸米什会让一个人把裂缝手套、板壁鞋和项目零食塞进同一个包。",
        "The Chief 从镇上看像一面墙，走近后会变成很多种心情。"
      ]
    },
    firstVisitTips: {
      en: [
        "Match the route to your granite skill, not your indoor grade.",
        "Have a rainy-day backup.",
        "Use easier classics to learn the local texture."
      ],
      zh: [
        "按花岗岩能力选线，不只按室内难度。",
        "准备雨天备选。",
        "用亲切经典熟悉当地岩感。"
      ]
    }
  },
  "fontainebleau-france": {
    history: {
      "en": "Fontainebleau helped shape bouldering long before crash pads made the game look modern. Its classics are movement puzzles, slices of history, and gentle reminders not to get too confident.",
      "zh": "在抱石垫让抱石看起来现代之前，枫丹白露早就在塑造抱石文化。这里的经典线既是动作谜题，也是历史切片，也会很温柔地提醒你别太自信。"
    },
    atmosphere: {
      en: "A forest full of small problems with large opinions. The grades matter, but the body-position lesson usually speaks first.",
      zh: "一片充满小问题和大主见的森林。难度当然重要，但身体位置的课程通常先开口。"
    },
    classicThemes: {
      en: [
        "Historic low-grade classics that still feel clever.",
        "Technical slabs and aretes where feet do the talking.",
        "Hard modern benchmarks that reward patient sessions."
      ],
      zh: [
        "历史悠久、难度不高但依旧聪明的经典。",
        "让脚来讲话的技术板壁和棱线。",
        "奖励耐心 session 的现代硬线标杆。"
      ]
    },
    funFacts: {
      en: [
        "Fontainebleau can make a warm-up feel like a philosophy quiz.",
        "The forest is very good at making strong people try stranger ideas."
      ],
      zh: [
        "枫丹白露能把热身变成哲学小测验。",
        "这片森林很擅长让强壮的人尝试更奇怪的想法。"
      ]
    },
    firstVisitTips: {
      "en": [
        "Start easier than your confidence suggests.",
        "Let footwork choose the grade for the day.",
        "Protect skin like it is part of the itinerary."
      ],
      "zh": [
        "从比自信心建议更容易的线开始。",
        "让脚法决定当天难度。",
        "像安排日程一样管理皮肤。"
      ]
    }
  },
  "kalymnos-greece": {
    history: {
      en: "Kalymnos became a sport-climbing travel dream through steep limestone, tufas, sea views, and a route density that makes rest days suspiciously difficult.",
      zh: "卡林诺斯凭借陡峭灰岩、tufa、海景和让休息日变得可疑困难的路线密度，成为运动攀旅行梦。"
    },
    atmosphere: {
      "en": "Sunny, social, and still serious when the pump arrives. Kalymnos is vacation energy with a very real forearm cost.",
      "zh": "阳光、社交，但泵感一到依旧很认真。卡林诺斯很有度假感，但前臂会认真收账。"
    },
    classicThemes: {
      en: [
        "Tufa endurance routes with playful movement.",
        "Seaside crags where scenery can trick you into skipping discipline.",
        "Project routes that reward pacing more than drama."
      ],
      zh: [
        "带有玩心动作的 tufa 耐力线。",
        "风景很容易诱惑你跳过纪律的海边岩壁。",
        "奖励节奏而不是戏剧性的项目线。"
      ]
    },
    funFacts: {
      en: [
        "The view can make everything feel easy until the route politely disagrees.",
        "A Kalymnos rest day often requires more willpower than a climbing day."
      ],
      zh: [
        "海景会让一切看起来容易，直到路线礼貌地不同意。",
        "卡林诺斯的休息日常常比攀岩日更需要意志力。"
      ]
    },
    firstVisitTips: {
      en: [
        "Warm up like you are not on vacation.",
        "Choose shade and conditions carefully.",
        "Use fun routes to practice clean pacing."
      ],
      zh: [
        "像不是在度假一样认真热身。",
        "认真选择阴影和条件。",
        "用有趣路线练干净节奏。"
      ]
    }
  },
  "joshua-tree-usa": {
    history: {
      en: "Joshua Tree climbing grew from desert exploration, Stonemaster-era boldness, and a huge collection of short granite formations. It is less about one giant wall and more about learning how many moods a small piece of stone can have.",
      zh: "Joshua Tree 的攀岩气质来自沙漠探索、Stonemaster 时代的大胆风格，以及大量短小但很有性格的花岗岩地形。这里不是靠一面巨墙取胜，而是让你发现一小块石头也能有很多脾气。"
    },
    atmosphere: {
      "en": "Dry air, strange trees, rough granite, and routes that look simple until they ask for very honest feet. The place feels playful, but the desert remembers every detail.",
      "zh": "干燥空气、奇特树影、粗糙花岗岩，还有那些看起来简单、实际上很考验脚法的线路。这里很有玩心，但沙漠会把细节记得很清楚。"
    },
    classicThemes: {
      en: [
        "Short trad classics where technique matters more than height.",
        "Desert boulders that turn skin, friction, and pacing into the main story.",
        "Old-school face climbs that reward calm movement and honest judgment."
      ],
      zh: [
        "短小传统经典，技术比高度更重要。",
        "沙漠抱石会把皮肤、摩擦和节奏变成主角。",
        "老派面攀线路奖励冷静动作和诚实判断。"
      ]
    },
    funFacts: {
      en: [
        "Joshua Tree can make a one-pitch day feel like a full personality test.",
        "The rock often looks friendly from the ground and more opinionated once you start climbing."
      ],
      zh: [
        "Joshua Tree 能把一段短线路变成完整的性格测试。",
        "岩石在地面看起来很友好，真正开始爬之后就会变得很有主见。"
      ]
    },
    firstVisitTips: {
      en: [
        "Start with style, not numbers.",
        "Treat friction, skin, and sun as part of the plan.",
        "Use easier routes to learn the desert before chasing famous names."
      ],
      zh: [
        "第一次先按风格选，不要只看数字。",
        "把摩擦、皮肤和日晒都算进计划里。",
        "先用更友好的线路认识沙漠，再去追热门名字。"
      ]
    }
  },
  "smith-rock-usa": {
    history: {
      en: "Smith Rock helped define modern American sport climbing, while still keeping trad corners, towers, and multi-pitch routes in the conversation. Its history is a mix of bolts, boldness, and very visible canyon drama.",
      zh: "Smith Rock 对现代美国运动攀的发展很重要，但它并不只有运动线：裂缝角落、塔形线路和多段路线也一直在场。它的历史混合了挂片、胆量和非常上镜的峡谷戏剧感。"
    },
    atmosphere: {
      en: "A compact canyon with a big-stage feeling. You can compare a historic sport testpiece, a moderate multi-pitch, and a tower adventure without mentally leaving the same landscape.",
      zh: "这是一个很紧凑、但舞台感很强的峡谷。你可以在同一片风景里比较历史级运动测试线、适中的多段路线和塔形小冒险。"
    },
    classicThemes: {
      en: [
        "Sport milestones that still shape route-choice conversations.",
        "Moderate multi-pitch routes for learning team rhythm.",
        "Tower and corner climbs that keep Smith from feeling one-dimensional."
      ],
      zh: [
        "仍然影响选线讨论的运动攀里程碑。",
        "适合练习队伍节奏的中等多段路线。",
        "塔形和角落线路让 Smith Rock 不只是单一风格。"
      ]
    },
    funFacts: {
      en: [
        "Smith Rock is small enough to feel readable and big enough to humble your plan.",
        "A route name here can sound like a joke and still be a serious history lesson."
      ],
      zh: [
        "Smith Rock 小到让人觉得能读懂，大到足够教育你的计划。",
        "这里的路线名可能听起来像玩笑，但背后常常是严肃的攀岩史。"
      ]
    },
    firstVisitTips: {
      en: [
        "Pick one theme: sport history, tower adventure, or moderate mileage.",
        "Mind sun, wind, and crowds when choosing the day.",
        "Use easier classics to learn the rock before chasing benchmarks."
      ],
      zh: [
        "先选一个主题：运动攀历史、塔形冒险，或中等里程。",
        "选线时把太阳、风和人流都考虑进去。",
        "先用更容易的经典线熟悉岩石，再追标杆线路。"
      ]
    }
  },
  "el-potrero-chico-mexico": {
    history: {
      en: "El Potrero Chico became famous because it makes long limestone sport climbing feel unusually accessible. The cliff scale is huge, but the route-choice question is often practical: how much adventure do you want today?",
      zh: "El Potrero Chico 出名，是因为它把长距离灰岩运动攀做得异常亲近。岩壁尺度很大，但选线问题常常很现实：你今天想要多少冒险感？"
    },
    atmosphere: {
      en: "Sunny limestone walls, travel energy, and many routes that turn a normal climbing day into a vertical outing. It feels social, but long routes still reward organized teams.",
      zh: "阳光、灰岩大墙、旅行气氛，还有很多会把普通攀岩日变成垂直出游的线路。这里很社交，但长线依然奖励有组织的队伍。"
    },
    classicThemes: {
      en: [
        "Long bolted limestone routes for team pacing.",
        "Friendly multi-pitch mileage that still needs systems.",
        "Shorter sport routes for tuning movement between bigger days."
      ],
      zh: [
        "适合练队伍节奏的长距离灰岩挂片线。",
        "相对友好的多段里程，但仍然需要系统。",
        "较短运动线可以在大目标之间调整动作状态。"
      ]
    },
    funFacts: {
      en: [
        "Potrero can make a big route feel vacation-friendly, which is exactly why planning still matters.",
        "A relaxed base-camp mood does not automatically make a long route casual."
      ],
      zh: [
        "Potrero 会让大路线看起来很有度假感，这也正是为什么计划仍然重要。",
        "轻松的营地气氛，不代表长线路就可以随便对待。"
      ]
    },
    firstVisitTips: {
      en: [
        "Choose route length before choosing grade.",
        "Practice transitions on easier objectives first.",
        "Keep a short-route option for lighter or windy days."
      ],
      zh: [
        "先选长度，再选难度。",
        "先在更容易的目标上练转换和配合。",
        "给轻松日或大风天留一个短线备选。"
      ]
    }
  },
  "chamonix-france": {
    history: {
      en: "Chamonix is one of the great alpine climbing capitals: granite, glaciers, cable-car access, and a long tradition of mountain guiding and serious route history. Here, route choice is inseparable from conditions and judgment.",
      zh: "Chamonix 是重要的阿尔卑斯攀登中心之一：花岗岩、冰川、缆车通道、悠久的向导传统和严肃的线路历史都在这里交织。这里选线永远离不开条件和判断。"
    },
    atmosphere: {
      en: "It can feel glamorous in town and very real above the lift station. Chamonix is inspiring, efficient, and completely uninterested in your indoor grade if the mountain context is wrong.",
      zh: "镇上可以很有度假感，缆车站以上却会立刻变得真实。Chamonix 让人兴奋，也很高效，但如果山地语境不对，它完全不关心你的室内难度。"
    },
    classicThemes: {
      en: [
        "High-alpine granite routes where rock climbing meets mountain judgment.",
        "Historic ridges and faces that require current condition checks.",
        "Objectives that are better treated as research cards before plans."
      ],
      zh: [
        "岩石攀登和山地判断相遇的高山花岗岩线路。",
        "需要最新条件检查的历史山脊和大面。",
        "很多目标应该先当研究卡片，再变成真实计划。"
      ]
    },
    funFacts: {
      en: [
        "Chamonix can make an approach feel short and the consequences feel large.",
        "Cable-car convenience is not the same thing as low commitment."
      ],
      zh: [
        "Chamonix 可以让接近变短，却让后果变大。",
        "缆车方便不等于承诺度低。"
      ]
    },
    firstVisitTips: {
      en: [
        "Pick objectives by conditions first, ambition second.",
        "Use guidebooks, huts, official notices, and local advice together.",
        "Start with routes that leave margin for weather and altitude."
      ],
      zh: [
        "先按条件选，再按野心选。",
        "把路书、山屋、官方公告和当地建议一起看。",
        "第一次从能给天气和海拔留余地的目标开始。"
      ]
    }
  },
  "ceuse-france": {
    history: {
      en: "Ceuse sits high above the valley as one of sport climbing's iconic limestone cliffs. Its reputation comes from sustained movement, famous hard routes, and a feeling that the cliff makes you earn the view.",
      zh: "Céüse 高高挂在山谷上方，是运动攀中很有标志性的灰岩岩壁。它的名声来自持续性动作、著名高难线路，以及那种“风景也要靠努力换”的感觉。"
    },
    atmosphere: {
      en: "Big views, long walks, blue limestone, and routes that prefer patience over noise. Ceuse feels dreamy, but the climbing is not sleepy.",
      zh: "开阔视野、长距离进入、蓝灰色灰岩，以及更喜欢耐心而不是吵闹的线路。Céüse 很梦幻，但攀爬一点也不困。"
    },
    classicThemes: {
      en: [
        "Sustained sport routes where pacing matters as much as strength.",
        "Historic hard lines that shaped global sport-climbing imagination.",
        "Moderate-to-hard classics for learning how Ceuse limestone reads."
      ],
      zh: [
        "节奏和力量同样重要的持续性运动线。",
        "塑造全球运动攀想象的历史高难线路。",
        "适合学习 Céüse 灰岩阅读方式的中高难经典。"
      ]
    },
    funFacts: {
      en: [
        "Ceuse can make a route feel like a pilgrimage before the first move.",
        "The view is generous; the pump is less generous."
      ],
      zh: [
        "在第一个动作之前，Céüse 就能让一条线路像一次朝圣。",
        "风景很慷慨，泵感没那么慷慨。"
      ]
    },
    firstVisitTips: {
      en: [
        "Choose by sector energy and endurance profile, not only grade.",
        "Respect the walk-in and save enough attention for the climb.",
        "Use classic mid-range routes to learn the stone before chasing headlines."
      ],
      zh: [
        "按扇区气质和耐力类型选，不要只看难度。",
        "尊重进入过程，给攀爬本身留下足够注意力。",
        "先用中高难经典理解岩石，再追头条级线路。"
      ]
    }
  },
  "dolomites-italy": {
    history: {
      en: "The Dolomites are one of Europe's great alpine climbing landscapes: pale towers, long faces, and a history where classic mountaineering and modern free climbing sit in the same skyline.",
      zh: "多洛米蒂是欧洲重要的阿尔卑斯攀登景观之一：苍白塔峰、巨大岩壁，以及传统登山和现代自由攀在同一片天际线里并存的历史。"
    },
    atmosphere: {
      en: "Big scenery, big weather, and routes that often feel like old expedition stories with better coffee nearby. The mood is romantic, but the terrain is serious.",
      zh: "风景很大，天气也很大，很多路线像老派探险故事，只是附近咖啡更好喝。氛围很浪漫，但地形很严肃。"
    },
    classicThemes: {
      en: [
        "Historic big-wall classics where route choice starts with commitment.",
        "Moderate ridges and corners for learning alpine rhythm.",
        "Modern hard routes that show how far free climbing has pushed the old walls."
      ],
      zh: [
        "历史级大墙经典，选线从承诺度开始。",
        "适合学习阿尔卑斯节奏的中等山脊和角落。",
        "现代高难线展示自由攀怎样推进老岩壁的边界。"
      ]
    },
    funFacts: {
      en: [
        "A Dolomites grade can look gentle until the wall reminds you how long the day is.",
        "Many routes feel like climbing through a black-and-white mountaineering photo that learned color."
      ],
      zh: [
        "多洛米蒂的难度数字可能看起来温和，直到岩壁提醒你今天有多长。",
        "很多路线像是在一张学会了彩色的黑白登山老照片里攀爬。"
      ]
    },
    firstVisitTips: {
      en: [
        "Choose commitment level before grade.",
        "Treat weather, descent, and route length as part of the climb.",
        "Use classic moderates to learn the rock before chasing famous walls."
      ],
      zh: [
        "先选承诺度，再选难度。",
        "把天气、下降和线路长度都当作攀登本身的一部分。",
        "先用经典中等线路熟悉岩石，再追名墙。"
      ]
    }
  },
  "frankenjura-germany": {
    history: {
      en: "Frankenjura shaped sport climbing through short, powerful limestone routes and milestone ascents by climbers like Wolfgang Gullich. It is compact, forested, and historically loud for such quiet crags.",
      zh: "Frankenjura 通过短促、有力的灰岩线路，以及 Wolfgang Güllich 等人的里程碑攀登，深刻影响了运动攀。这里紧凑、林间安静，却在攀岩史上声音很大。"
    },
    atmosphere: {
      en: "Pocketed limestone, shaded woods, tiny crags, and routes that can feel like a strength exam written by someone with a dry sense of humor.",
      zh: "洞点灰岩、阴凉树林、小型岩场，还有那些像是由冷幽默老师出的力量考试一样的线路。"
    },
    classicThemes: {
      en: [
        "Historic power routes that changed grade conversations.",
        "Short pocket climbs where fingers and timing matter.",
        "Forest crags that make one pitch feel like a complete training block."
      ],
      zh: [
        "改变难度讨论的历史级力量线路。",
        "手指和时机都很重要的短洞点线。",
        "一段线路就像完整训练模块的林间岩场。"
      ]
    },
    funFacts: {
      en: [
        "Frankenjura can make a short route feel longer than your warm-up plan.",
        "The forest looks calm; the pockets have other ideas."
      ],
      zh: [
        "Frankenjura 能让一条短线比你的热身计划还漫长。",
        "树林看起来很平静，洞点却另有想法。"
      ]
    },
    firstVisitTips: {
      en: [
        "Warm up patiently; short does not mean gentle.",
        "Choose by hold style and power profile, not only grade.",
        "Give fingers and skin more respect than your schedule wants."
      ],
      zh: [
        "耐心热身；短不代表温柔。",
        "按点型和力量类型选，不要只看难度。",
        "给手指和皮肤比行程表更多尊重。"
      ]
    }
  },
  "siurana-spain": {
    history: {
      en: "Siurana became a global sport-climbing reference through technical limestone, famous hard routes, and a village-cliff setting that makes performance feel oddly scenic.",
      zh: "Siurana 凭借技术型灰岩、著名高难线路，以及村庄和岩壁相互映照的地貌，成为全球运动攀的重要参照。"
    },
    atmosphere: {
      en: "Sun, edges, pockets, and routes that reward clean feet before loud effort. Siurana is beautiful, but it does not hand out easy confidence.",
      zh: "阳光、边点、洞点，以及那些先奖励干净脚法、再考虑蛮力的线路。Siurana 很美，但不会轻易送你自信。"
    },
    classicThemes: {
      en: [
        "Technical sport routes where precision matters early.",
        "Hard benchmarks that give the area its global reputation.",
        "Mid-to-hard classics for learning how Siurana limestone reads."
      ],
      zh: [
        "很早就要求精确度的技术型运动线。",
        "让这个区域享有全球名声的高难标杆。",
        "帮助理解 Siurana 灰岩阅读方式的中高难经典。"
      ]
    },
    funFacts: {
      en: [
        "Siurana can make a beautiful rest stance feel like a negotiation.",
        "The cliff is scenic enough to distract you and technical enough to punish distraction."
      ],
      zh: [
        "Siurana 能把一个漂亮的休息位变成谈判现场。",
        "岩壁美到会分散注意力，也技术到会惩罚分心。"
      ]
    },
    firstVisitTips: {
      en: [
        "Pick style before headline grade.",
        "Use easier technical routes to calibrate footwork.",
        "Save skin and attention for the second route, not only the first."
      ],
      zh: [
        "先选风格，再看头条难度。",
        "用更容易的技术线校准脚法。",
        "把皮肤和注意力留给第二条线，不要第一条就花光。"
      ]
    }
  },
  "margalef-spain": {
    history: {
      en: "Margalef built its reputation on steep conglomerate, pockets, and a modern sport-climbing scene where huge grades sit beside surprisingly useful mileage.",
      zh: "Margalef 的名声来自陡峭砾岩、洞点，以及一个现代运动攀场景：顶级难度和很有训练价值的里程并排存在。"
    },
    atmosphere: {
      "en": "Pocket mathematics, sunny walls, and a project-town mood. It can feel friendly from the road and very specific once your fingers start objecting.",
      "zh": "洞点数学、阳光岩壁和项目小镇气质。从路边看很友好，等手指开始抗议后，就会变得非常具体。"
    },
    classicThemes: {
      en: [
        "Pocket endurance routes for climbers who like measurable progress.",
        "Elite projects that make the area famous.",
        "Friendlier sectors for learning how conglomerate movement feels."
      ],
      zh: [
        "适合喜欢可量化进步的洞点耐力线。",
        "让这里出名的精英级项目。",
        "更友好的扇区可以帮助理解砾岩动作感。"
      ]
    },
    funFacts: {
      en: [
        "Margalef can make a single pocket feel like a business meeting.",
        "The grade may be the headline, but the finger position often writes the article."
      ],
      zh: [
        "Margalef 能让一个洞点像一次商务会议。",
        "难度可能是标题，但手指位置才常常是真正文案。"
      ]
    },
    firstVisitTips: {
      en: [
        "Choose by angle and pocket size, not only number.",
        "Plan skin and finger recovery like real logistics.",
        "Balance famous routes with mileage that teaches the rock."
      ],
      zh: [
        "按角度和洞点大小选，不要只看数字。",
        "像安排真实后勤一样安排皮肤和手指恢复。",
        "把热门线路和真正教你岩石风格的里程搭配起来。"
      ]
    }
  },
  "grampians-australia": {
    history: {
      en: "The Grampians, also known as Gariwerd, are central to Australian climbing culture: sandstone caves, hard boulders, bold sport routes, and important cultural-landscape responsibilities all overlap here.",
      zh: "Grampians，也叫 Gariwerd，是澳大利亚攀岩文化的重要区域：砂岩洞穴、高难抱石、大胆运动线，以及重要的文化景观责任都在这里重叠。"
    },
    atmosphere: {
      "en": "Wild sandstone, big views, and a route-selection question that includes access, culture, and conditions. The climbing can be powerful; access and cultural context deserve equal respect.",
      "zh": "野性的砂岩、开阔视野，以及一个同时包含准入、文化和条件的选线问题。这里的攀爬可以很有力量，背后的准入和文化背景也需要同等尊重。"
    },
    classicThemes: {
      en: [
        "Hard cave bouldering where links and endurance blur together.",
        "Sport routes on striking sandstone walls.",
        "Access-sensitive climbing where current information matters."
      ],
      zh: [
        "洞穴高难抱石里，连接段和耐力常常模糊成一件事。",
        "醒目砂岩墙上的运动线路。",
        "准入敏感区域，最新信息非常重要。"
      ]
    },
    funFacts: {
      en: [
        "Some Grampians boulders are long enough to make the word boulder feel negotiable.",
        "The landscape is beautiful, but access context is not background decoration."
      ],
      zh: [
        "有些 Grampians 抱石长到让“抱石”这个词都变得可以商量。",
        "风景很美，但准入语境不是背景装饰。"
      ]
    },
    firstVisitTips: {
      en: [
        "Check current access information before choosing routes.",
        "Choose by cave endurance, wall style, and conditions.",
        "Treat cultural and ecological restrictions as part of the route decision."
      ],
      zh: [
        "选线前先查最新准入信息。",
        "按洞穴耐力、岩壁风格和条件来选。",
        "把文化和生态限制当作选线本身的一部分。"
      ]
    }
  },
  "yangshuo-china": {
    history: {
      en: "Yangshuo grew into a Chinese sport-climbing hub through karst towers, travel culture, and international route development around cliffs such as Moon Hill and other limestone crags.",
      zh: "阳朔凭借喀斯特塔峰、旅行文化，以及围绕月亮山等灰岩岩场的国际化开发，逐渐成为中国重要的运动攀目的地。"
    },
    atmosphere: {
      en: "River scenery, limestone towers, scooters, food, and routes that can feel both adventurous and relaxed. It is travel climbing with real outdoor decisions underneath.",
      zh: "河流风景、灰岩塔峰、电动车、美食，以及既有冒险感又有轻松感的线路。这里像旅行攀岩，但底下仍然是真实户外判断。"
    },
    classicThemes: {
      en: [
        "Karst limestone sport routes with travel-day energy.",
        "Moon Hill context routes that mix scenery and climbing history.",
        "Crag-hopping days where logistics shape the climbing mood."
      ],
      zh: [
        "带旅行日气质的喀斯特灰岩运动线。",
        "月亮山语境下，风景和攀岩历史交织的路线。",
        "岩场之间移动的日子，后勤会影响攀爬心情。"
      ]
    },
    funFacts: {
      en: [
        "Yangshuo can make a climbing day feel like a small travel story with limestone punctuation.",
        "The scenery is relaxed; route choice still deserves attention."
      ],
      zh: [
        "阳朔能让一个攀岩日像一篇带灰岩标点的小旅行故事。",
        "风景很松弛，选线仍然值得认真。"
      ]
    },
    firstVisitTips: {
      en: [
        "Choose by crag logistics and shade before chasing grades.",
        "Use Moon Hill and other major crags as orientation points, not beta substitutes.",
        "Keep travel rhythm, weather, and partner energy in the route decision."
      ],
      zh: [
        "先按岩场后勤和阴影选，再追难度。",
        "把月亮山和其他主要岩场当作定位点，不要当 beta 替代品。",
        "把旅行节奏、天气和搭档状态都放进选线决策。"
      ]
    }
  }
,
  "liming-china": {
    "history": {
      "en": "Liming is best understood as China's sandstone crack classroom: a remote-feeling valley where route choice is about crack craft, partner systems, and comfort with traditional climbing decisions.",
      "zh": "黎明更像中国的砂岩裂缝课堂：一个有远行感的山谷，选线重点是裂缝技术、搭档系统，以及对传统攀决策的舒适度。"
    },
    "atmosphere": {
      "en": "Red sandstone, quiet walls, and routes that make technique feel wonderfully specific. It is not a place to bluff your crack skills, but it is a good place to build them honestly.",
      "zh": "红色砂岩、安静岩壁，还有那些让技术变得非常具体的线路。这里不适合假装会裂缝技术，但很适合诚实地把它练出来。"
    },
    "classicThemes": {
      "en": [
        "Crack systems for learning hands, feet, and body position.",
        "Longer trad routes where team rhythm matters.",
        "Adventure-style sandstone climbing that rewards preparation."
      ],
      "zh": [
        "适合学习手、脚和身体位置的裂缝系统。",
        "需要队伍节奏的较长传统线路。",
        "奖励准备工作的冒险型砂岩攀爬。"
      ]
    },
    "funFacts": {
      "en": [
        "Liming can make a single crack feel like a whole vocabulary lesson.",
        "The rock looks sculpted; your footwork still has to write clearly."
      ],
      "zh": [
        "黎明能让一条裂缝像一整堂词汇课。",
        "岩石看起来像雕刻出来的，但你的脚法仍然要写得清楚。"
      ]
    },
    "firstVisitTips": {
      "en": [
        "Choose by crack style before grade.",
        "Practice systems on simpler routes first.",
        "Keep route cards as decision prompts, not guidebook instructions."
      ],
      "zh": [
        "先按裂缝类型选，再看难度。",
        "先在更简单线路上练系统。",
        "把路线卡当选线提示，不要当路书说明。"
      ]
    }
  },
  "long-dong-taiwan": {
    "history": {
      "en": "Long Dong is Taiwan's best-known sea-cliff climbing area, with sandstone walls, sector-based exploration, and a long local climbing culture shaped by ocean weather.",
      "zh": "龙洞是台湾最知名的海边岩场之一，有砂岩海崖、按区域探索的攀登方式，以及被海风和天气塑造的本地攀岩文化。"
    },
    "atmosphere": {
      "en": "Ocean views, sandstone texture, wind, humidity, and a route-choice mood that can change with conditions. It is scenic, but not a postcard you climb casually.",
      "zh": "海景、砂岩质感、风和湿度都会影响选线。这里很美，但不是可以随便攀爬的明信片。"
    },
    "classicThemes": {
      "en": [
        "Sea-cliff sandstone with mixed sport and trad character.",
        "Sector-based days where conditions shape the plan.",
        "Moderate routes for learning outdoor judgment."
      ],
      "zh": [
        "兼具运动和传统气质的海崖砂岩。",
        "按区域安排、受条件影响很大的攀岩日。",
        "适合学习户外判断的中等线路。"
      ]
    },
    "funFacts": {
      "en": [
        "Long Dong can make weather feel like an extra climbing partner.",
        "The sea view is generous; the sandstone still asks for respect."
      ],
      "zh": [
        "龙洞能让天气像多出来的一个搭档。",
        "海景很慷慨，砂岩仍然要求尊重。"
      ]
    },
    "firstVisitTips": {
      "en": [
        "Check conditions and access before picking a sector.",
        "Choose route style by comfort with seaside exposure.",
        "Use sector cards for orientation, not exact beta."
      ],
      "zh": [
        "选区域前先查条件和准入。",
        "按自己对海崖暴露感的舒适度选风格。",
        "把区域卡当定位，不要当精确 beta。"
      ]
    }
  },
  "railay-tonsai-thailand": {
    "history": {
      "en": "Railay and Tonsai grew into a tropical sport-climbing classic through steep limestone, beach access, and a long flow of traveling climbers building a shared route culture.",
      "zh": "Railay 和 Tonsai 凭借陡峭灰岩、海滩进入方式，以及一代代旅行攀岩者形成的共同线路文化，成为热带运动攀经典目的地。"
    },
    "atmosphere": {
      "en": "Beach sand, humid limestone, boats, coastal noise, and routes that can feel vacation-friendly until the pump arrives. Fun is real; conditions are real too.",
      "zh": "沙滩、潮湿灰岩、长尾船、海边声音，还有那些在泵感出现前很像度假的线路。快乐是真的，条件也是真的。"
    },
    "classicThemes": {
      "en": [
        "Limestone sport routes with tropical travel energy.",
        "Sea-view multi-pitch routes for organized teams.",
        "Steep walls where humidity and shade change the decision."
      ],
      "zh": [
        "带热带旅行感的灰岩运动线。",
        "适合有组织队伍的海景多段线路。",
        "湿度和阴影会影响选择的陡壁。"
      ]
    },
    "funFacts": {
      "en": [
        "Railay can make a climbing day feel like a beach day with a forearm cost.",
        "The approach may involve sand, but the route still deserves focus."
      ],
      "zh": [
        "Railay 能让攀岩日像沙滩日，只是最后前臂会收账。",
        "接近路可能是沙子，但线路仍然值得专注。"
      ]
    },
    "firstVisitTips": {
      "en": [
        "Choose shade and conditions before grade.",
        "Keep a humid-day backup.",
        "Use classics for style learning, not for skipping local updates."
      ],
      "zh": [
        "先选阴影和条件，再选难度。",
        "给潮湿日留备用方案。",
        "用经典线学习风格，不要跳过当地更新。"
      ]
    }
  },
  "rocklands-south-africa": {
    "history": {
      "en": "Rocklands became a global bouldering destination through orange sandstone, crisp winter conditions, and a huge spread of problems from friendly movement puzzles to elite testpieces.",
      "zh": "Rocklands 凭借橙色砂岩、清爽冬季条件，以及从友好动作谜题到精英测试线的大量问题，成为全球抱石目的地。"
    },
    "atmosphere": {
      "en": "Open skies, sharp friction, long circuits, and boulders that make skin management feel like trip planning. It is dreamy, but very good at spending your skin budget.",
      "zh": "开阔天空、锋利摩擦、长线路串联，还有会让皮肤管理变成旅行计划的抱石。这里很梦幻，也很会花掉你的皮肤预算。"
    },
    "classicThemes": {
      "en": [
        "Sandstone compression and edges with crisp winter bite.",
        "Hard boulders that reward session discipline.",
        "Mileage days where skin and conditions decide the plan."
      ],
      "zh": [
        "带清爽冬季摩擦的砂岩压缩和边点。",
        "奖励 session 纪律的高难抱石。",
        "由皮肤和条件决定计划的里程日。"
      ]
    },
    "funFacts": {
      "en": [
        "Rocklands can make a rest day feel like a strategic masterpiece.",
        "The best problem may be the one your skin can still enjoy tomorrow."
      ],
      "zh": [
        "Rocklands 能让休息日像战略杰作。",
        "最好的问题也许是明天你的皮肤仍然能享受的那一条。"
      ]
    },
    "firstVisitTips": {
      "en": [
        "Choose by skin budget, shade, and style.",
        "Balance famous hard problems with quality easier mileage.",
        "Keep rest days honest."
      ],
      "zh": [
        "按皮肤预算、阴影和风格来选。",
        "把著名高难线和高质量轻松里程搭配起来。",
        "认真对待休息日。"
      ]
    }
  }
};

function source(
  sourceLabel: string,
  sourceUrl: string,
  type: RouteHighlight["sources"][number]["type"],
  trustLevel: RouteHighlight["sources"][number]["trustLevel"],
  verifies: string[],
  notes: string
): RouteHighlight["sources"][number] {
  return {
    sourceLabel,
    sourceUrl,
    lastChecked,
    type,
    trustLevel,
    verifies,
    notes
  };
}

function localizedRouteCopy(copy: {
  style: [string, string];
  summary: [string, string];
  bestFor: [string, string];
  decisionHint: [string, string];
  practiceFocus: [string[], string[]];
  editorialTips: [string[], string[]];
}): NonNullable<RouteHighlight["localizedContent"]> {
  return {
    style: { en: copy.style[0], zh: copy.style[1] },
    summary: { en: copy.summary[0], zh: copy.summary[1] },
    bestFor: { en: copy.bestFor[0], zh: copy.bestFor[1] },
    decisionHint: { en: copy.decisionHint[0], zh: copy.decisionHint[1] },
    practiceFocus: { en: copy.practiceFocus[0], zh: copy.practiceFocus[1] },
    editorialTips: { en: copy.editorialTips[0], zh: copy.editorialTips[1] }
  };
}

function routeAddition(route: Omit<RouteHighlight, "images" | "communityStatus">): RouteHighlight {
  return {
    ...route,
    images: [],
    communityStatus: "coming-soon"
  };
}

const expansionSourcePacks: Record<string, RouteHighlight["sources"]> = {
  "joshua-tree-usa": [
    source(
      "Mountain Project: Joshua Tree National Park",
      "https://www.mountainproject.com/area/105720495/joshua-tree-national-park",
      "route-database-metadata",
      "medium",
      ["route metadata", "area context"],
      "External route-database entry point; ClimbAtlas does not copy descriptions, beta, ratings, or comments."
    ),
    source(
      "National Park Service: Joshua Tree climbing",
      "https://www.nps.gov/jotr/planyourvisit/climbing.htm",
      "official",
      "high",
      ["access context", "area rules"],
      "Official park source for access and safety context, not route beta."
    )
  ],
  "smith-rock-usa": [
    source(
      "Wikipedia: Smith Rock State Park",
      "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
      "open-encyclopedia",
      "medium",
      ["area context", "route-name context"],
      "Open encyclopedia context for Smith Rock areas and notable routes; not a route guide."
    ),
    source(
      "Mountain Project: Smith Rock",
      "https://www.mountainproject.com/area/105788989/smith-rock",
      "route-database-metadata",
      "medium",
      ["route metadata", "area context"],
      "External route-database entry point; no descriptions, beta, ratings, or comments are copied."
    )
  ],
  "el-potrero-chico-mexico": [
    source(
      "Wikipedia: Potrero Chico",
      "https://en.wikipedia.org/wiki/Potrero_Chico",
      "open-encyclopedia",
      "medium",
      ["area context", "climbing style"],
      "Open encyclopedia context for the limestone climbing area."
    ),
    source(
      "Mountain Project: El Potrero Chico",
      "https://www.mountainproject.com/area/105910764/el-potrero-chico",
      "route-database-metadata",
      "medium",
      ["route metadata", "area context"],
      "External route-database entry point; ClimbAtlas only uses metadata, not route descriptions or comments."
    )
  ],
  "chamonix-france": [
    source(
      "Wikipedia: Aiguille du Midi",
      "https://en.wikipedia.org/wiki/Aiguille_du_Midi",
      "open-encyclopedia",
      "medium",
      ["area context", "route history"],
      "Open encyclopedia context for Aiguille du Midi and Chamonix alpine routes."
    ),
    source(
      "French Wikipedia: Aiguille du Midi alpinisme",
      "https://fr.wikipedia.org/wiki/Aiguille_du_Midi",
      "open-encyclopedia",
      "medium",
      ["route names", "first-ascent context"],
      "French open encyclopedia context; not a topo or current conditions source."
    )
  ],
  "ceuse-france": [
    source(
      "Italian Wikipedia: Ceuse climbing routes",
      "https://it.wikipedia.org/wiki/C%C3%A9%C3%BCse",
      "open-encyclopedia",
      "medium",
      ["route names", "grades", "area context"],
      "Open encyclopedia route list and area context; not a route guide."
    ),
    source(
      "Wikipedia: Ceuse",
      "https://en.wikipedia.org/wiki/C%C3%A9%C3%BCse",
      "open-encyclopedia",
      "medium",
      ["area context", "rock type", "climbing style"],
      "Open encyclopedia context for Ceuse's limestone cliff and sport-climbing style."
    )
  ],
  "dolomites-italy": [
    source(
      "Wikipedia: Dolomites",
      "https://en.wikipedia.org/wiki/Dolomites",
      "open-encyclopedia",
      "medium",
      ["area context", "rock type", "mountain context"],
      "Open encyclopedia context for the mountain region; not a route guide."
    ),
    source(
      "PlanetMountain: Dolomites climbing",
      "https://www.planetmountain.com/en/news/climbing/climbing-in-the-dolomites.html",
      "climbing-media",
      "medium",
      ["route metadata", "area context"],
      "Climbing media entry point for Dolomites route research; ClimbAtlas does not copy topo or beta."
    )
  ],
  "frankenjura-germany": [
    source(
      "Wikipedia: Wolfgang Gullich",
      "https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich",
      "open-encyclopedia",
      "medium",
      ["history", "route-name context"],
      "Open encyclopedia context for Frankenjura milestones and climbing history."
    ),
    source(
      "Mountain Project: Frankenjura",
      "https://www.mountainproject.com/area/106172652/frankenjura",
      "route-database-metadata",
      "medium",
      ["route metadata", "area context"],
      "External route-database entry point; no descriptions, beta, comments, or ratings are copied."
    )
  ],
  "siurana-spain": [
    source(
      "Wikipedia: La Rambla",
      "https://en.wikipedia.org/wiki/La_Rambla_(climb)",
      "open-encyclopedia",
      "medium",
      ["area context", "hard-route history"],
      "Open encyclopedia context for Siurana's high-end sport-climbing history."
    ),
    source(
      "Mountain Project: Siurana",
      "https://www.mountainproject.com/area/106624710/siurana",
      "route-database-metadata",
      "medium",
      ["route metadata", "area context"],
      "External metadata source only; no route descriptions, beta, or comments are copied."
    )
  ],
  "margalef-spain": [
    source(
      "PlanetMountain: Perfecto Mundo interview",
      "https://www.planetmountain.com/en/news/interviews/alexander-megos-perfecto-mundo-margalef-9b-plus-interview.html",
      "climbing-media",
      "medium",
      ["area context", "hard-route history"],
      "Climbing-media context for Perfecto Mundo and modern high-end sport climbing in Margalef."
    ),
    source(
      "Mountain Project: Margalef",
      "https://www.mountainproject.com/area/106631762/margalef",
      "route-database-metadata",
      "medium",
      ["route metadata", "area context"],
      "External route-database entry point; ClimbAtlas uses metadata only."
    )
  ],
  "grampians-australia": [
    source(
      "Parks Victoria: Grampians Gariwerd National Park",
      "https://www.parks.vic.gov.au/places-to-see/parks/grampians-national-park",
      "official",
      "high",
      ["access context", "area context"],
      "Official park source for current visitor and access context, not route beta."
    ),
    source(
      "Mountain Project: Grampians",
      "https://www.mountainproject.com/area/105907768/the-grampians",
      "route-database-metadata",
      "medium",
      ["route metadata", "area context"],
      "External metadata source only; no beta, photos, comments, or ratings are copied."
    )
  ]
,
  "yangshuo-china": [
    source("Wikipedia: Yangshuo County", "https://en.wikipedia.org/wiki/Yangshuo_County", "open-encyclopedia", "medium", ["area context", "karst landscape"], "Open encyclopedia context for Yangshuo's landscape and travel setting; not a route guide."),
    source("Wikipedia: Moon Hill", "https://en.wikipedia.org/wiki/Moon_Hill", "open-encyclopedia", "medium", ["landmark context", "area context"], "Open context for one of Yangshuo's best-known limestone landmarks.")
  ],
  "liming-china": [
    source("Mountain Project: Liming", "https://www.mountainproject.com/area/108397346/liming", "route-database-metadata", "medium", ["route metadata", "area context"], "External metadata source only; no beta, comments, ratings, or photos are copied."),
    source("ClimbAtlas metadata policy", "https://en.wikipedia.org/wiki/Traditional_climbing", "open-encyclopedia", "low", ["style context"], "General traditional-climbing context; not route beta or a route database.")
  ],
  "long-dong-taiwan": [
    source("Chinese Wikipedia: Long Dong climbing area", "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4", "open-encyclopedia", "medium", ["area context", "sector context"], "Open encyclopedia context for Long Dong sectors; not a route guide."),
    source("Mountain Project: Long Dong", "https://www.mountainproject.com/area/106594934/long-dong-dragon-cave", "route-database-metadata", "medium", ["route metadata", "area context"], "External metadata source only; no beta, comments, ratings, or photos are copied.")
  ],
  "railay-tonsai-thailand": [
    source("Wikipedia: Railay Beach", "https://en.wikipedia.org/wiki/Railay_Beach", "open-encyclopedia", "medium", ["area context", "limestone setting"], "Open context for the Railay peninsula and limestone climbing setting."),
    source("Mountain Project: Railay and Tonsai", "https://www.mountainproject.com/area/105894664/laem-phra-nang-railay-tonsai", "route-database-metadata", "medium", ["route metadata", "area context"], "External metadata source only; no beta, comments, ratings, or photos are copied.")
  ],
  "rocklands-south-africa": [
    source("Wikipedia: Rocklands", "https://en.wikipedia.org/wiki/Rocklands", "open-encyclopedia", "medium", ["area context", "bouldering context"], "Open encyclopedia context for Rocklands bouldering."),
    source("Mountain Project: Rocklands", "https://www.mountainproject.com/area/108874793/rocklands", "route-database-metadata", "medium", ["route metadata", "area context"], "External metadata source only; no beta, comments, ratings, or photos are copied.")
  ]
};

const popularDestinationResources: Record<
  string,
  NonNullable<Destination["externalResources"]>
> = {
  "yosemite-usa": [
    {
      title: "Yosemite National Park: climbing information",
      url: "https://www.nps.gov/yose/planyourvisit/climbing.htm",
      type: "official",
      description: {
        en: "Official park information for current rules, closures, permits, and stewardship notes.",
        zh: "官方公园信息，用于查看最新规则、关闭、许可和保护要求。"
      }
    },
    {
      title: "Yosemite Climbing Association",
      url: "https://www.yosemiteclimbing.org/",
      type: "history/article",
      description: {
        en: "Local history and stewardship context, not route beta.",
        zh: "本地历史和维护语境，不是路线 beta。"
      }
    }
  ],
  "red-river-gorge-usa": [
    {
      title: "Red River Gorge Climbers' Coalition",
      url: "https://rrgcc.org/",
      type: "official",
      description: {
        en: "Access, stewardship, and local climbing community information.",
        zh: "准入、维护和本地攀岩社区信息。"
      }
    },
    {
      title: "Mountain Project: Red River Gorge area",
      url: "https://www.mountainproject.com/area/105841134/red-river-gorge",
      type: "route-database",
      description: {
        en: "Route-database metadata entry point. Use externally for current route pages and community updates.",
        zh: "路线数据库入口。请在外部查看最新路线页面和社区更新。"
      }
    }
  ],
  "squamish-canada": [
    {
      title: "Stawamus Chief Provincial Park",
      url: "https://bcparks.ca/stawamus-chief-park/",
      type: "official",
      description: {
        en: "Official park context for access and visitor planning.",
        zh: "官方公园语境，用于查看准入和旅行安排。"
      }
    },
    {
      title: "Mountain Project: Squamish area",
      url: "https://www.mountainproject.com/area/105798167/squamish",
      type: "route-database",
      description: {
        en: "Route-database metadata entry point for Squamish routes.",
        zh: "斯夸米什路线数据库入口。"
      }
    }
  ],
  "fontainebleau-france": [
    {
      title: "Wikipedia: Fontainebleau rock climbing",
      url: "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
      type: "history/article",
      description: {
        en: "Open encyclopedia context for the forest's bouldering history.",
        zh: "开放百科中的枫丹白露抱石历史语境。"
      }
    },
    {
      title: "bleau.info",
      url: "https://bleau.info/",
      type: "route-database",
      description: {
        en: "Fontainebleau route-database entry point for external route research.",
        zh: "枫丹白露路线数据库入口，用于外部路线研究。"
      }
    }
  ],
  "kalymnos-greece": [
    {
      title: "TheCrag: Kalymnos",
      url: "https://www.thecrag.com/en/climbing/greece/kalymnos",
      type: "route-database",
      description: {
        en: "Route-database metadata entry point for Kalymnos sectors and routes.",
        zh: "卡林诺斯岩区和路线数据库入口。"
      }
    },
    {
      title: "Kalymnos Climbing Guidebook",
      url: "https://climbkalymnos.com/guidebook/",
      type: "guidebook/resource",
      description: {
        en: "Guidebook resource from the local guidebook team. ClimbAtlas links out without copying guidebook content.",
        zh: "当地路书团队提供的路书资源页。ClimbAtlas 仅提供外链，不复制路书内容。"
      }
    }
  ],
  "joshua-tree-usa": [
    {
      title: "Joshua Tree National Park: climbing",
      url: "https://www.nps.gov/jotr/planyourvisit/climbing.htm",
      type: "official",
      description: {
        en: "Official park climbing information for access, safety, closures, and current rules.",
        zh: "官方公园攀岩信息，用于查看准入、安全、关闭和当前规则。"
      }
    },
    {
      title: "Mountain Project: Joshua Tree National Park",
      url: "https://www.mountainproject.com/area/105720495/joshua-tree-national-park",
      type: "route-database",
      description: {
        en: "External route-database entry point for current metadata and community updates.",
        zh: "外部路线数据库入口，用于查看当前元数据和社区更新。"
      }
    }
  ],
  "smith-rock-usa": [
    {
      title: "Oregon State Parks: Smith Rock",
      url: "https://stateparks.oregon.gov/index.cfm?do=park.profile&parkId=36",
      type: "official",
      description: {
        en: "Official park page for visitor planning, rules, and access context.",
        zh: "官方公园页面，用于查看旅行计划、规则和准入背景。"
      }
    },
    {
      title: "Mountain Project: Smith Rock",
      url: "https://www.mountainproject.com/area/105788989/smith-rock",
      type: "route-database",
      description: {
        en: "External route-database entry point. ClimbAtlas does not copy beta, ratings, comments, or photos.",
        zh: "外部路线数据库入口。ClimbAtlas 不复制 beta、评分、评论或图片。"
      }
    }
  ],
  "el-potrero-chico-mexico": [
    {
      title: "Wikipedia: Potrero Chico",
      url: "https://en.wikipedia.org/wiki/Potrero_Chico",
      type: "history/article",
      description: {
        en: "Open encyclopedia context for the limestone canyon and climbing area.",
        zh: "关于灰岩峡谷和攀岩区域的开放百科背景。"
      }
    },
    {
      title: "Mountain Project: El Potrero Chico",
      url: "https://www.mountainproject.com/area/105910764/el-potrero-chico",
      type: "route-database",
      description: {
        en: "External route-database entry point for route pages and current community updates.",
        zh: "外部路线数据库入口，用于查看路线页面和当前社区更新。"
      }
    }
  ],
  "chamonix-france": [
    {
      title: "Chamonix Mont-Blanc tourism",
      url: "https://www.chamonix.com/",
      type: "official",
      description: {
        en: "Official destination site for current visitor planning, lift, and valley information.",
        zh: "官方目的地网站，用于查看当前旅行、缆车和山谷信息。"
      }
    },
    {
      title: "Wikipedia: Aiguille du Midi",
      url: "https://en.wikipedia.org/wiki/Aiguille_du_Midi",
      type: "history/article",
      description: {
        en: "Open encyclopedia context for one of the main Chamonix alpine access points.",
        zh: "关于 Chamonix 重要高山入口 Aiguille du Midi 的开放百科背景。"
      }
    }
  ],
  "ceuse-france": [
    {
      title: "Wikipedia: Ceuse",
      url: "https://en.wikipedia.org/wiki/C%C3%A9%C3%BCse",
      type: "history/article",
      description: {
        en: "Open encyclopedia context for the limestone cliff and sport-climbing area.",
        zh: "关于这片灰岩岩壁和运动攀区域的开放百科背景。"
      }
    },
    {
      title: "Mountain Project: Ceuse",
      url: "https://www.mountainproject.com/area/106603287/ceuse",
      type: "route-database",
      description: {
        en: "External route-database entry point for route metadata and current updates.",
        zh: "外部路线数据库入口，用于查看路线元数据和当前更新。"
      }
    }
  ],
  "dolomites-italy": [
    {
      title: "PlanetMountain: Dolomites climbing",
      url: "https://www.planetmountain.com/en/news/climbing/climbing-in-the-dolomites.html",
      type: "history/article",
      description: {
        en: "Climbing media entry point for Dolomites route history and broader route research.",
        zh: "多洛米蒂攀岩媒体入口，可用于了解线路历史和继续研究。"
      }
    },
    {
      title: "Wikipedia: Dolomites",
      url: "https://en.wikipedia.org/wiki/Dolomites",
      type: "history/article",
      description: {
        en: "Open region context for the mountain landscape and broader travel planning.",
        zh: "关于山地景观和旅行背景的开放区域资料。"
      }
    }
  ],
  "frankenjura-germany": [
    {
      title: "Mountain Project: Frankenjura",
      url: "https://www.mountainproject.com/area/106172652/frankenjura",
      type: "route-database",
      description: {
        en: "External route-database entry point for current Frankenjura route metadata.",
        zh: "Frankenjura 当前路线元数据的外部数据库入口。"
      }
    },
    {
      title: "Wikipedia: Wolfgang Gullich",
      url: "https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich",
      type: "history/article",
      description: {
        en: "Open history context for major Frankenjura sport-climbing milestones.",
        zh: "关于 Frankenjura 运动攀重要里程碑的开放历史背景。"
      }
    }
  ],
  "siurana-spain": [
    {
      title: "Mountain Project: Siurana",
      url: "https://www.mountainproject.com/area/106624710/siurana",
      type: "route-database",
      description: {
        en: "External route-database entry point for route metadata and local updates.",
        zh: "外部路线数据库入口，用于查看路线元数据和当地更新。"
      }
    },
    {
      title: "Wikipedia: La Rambla",
      url: "https://en.wikipedia.org/wiki/La_Rambla_(climb)",
      type: "history/article",
      description: {
        en: "Open history context for one of Siurana's globally known hard routes.",
        zh: "关于 Siurana 全球知名高难线路之一的开放历史背景。"
      }
    }
  ],
  "margalef-spain": [
    {
      title: "Mountain Project: Margalef",
      url: "https://www.mountainproject.com/area/106631762/margalef",
      type: "route-database",
      description: {
        en: "External metadata entry point for Margalef route research.",
        zh: "Margalef 路线研究的外部元数据入口。"
      }
    },
    {
      title: "PlanetMountain: Perfecto Mundo interview",
      url: "https://www.planetmountain.com/en/news/interviews/alexander-megos-perfecto-mundo-margalef-9b-plus-interview.html",
      type: "history/article",
      description: {
        en: "Climbing-media history context for Perfecto Mundo and modern high-end sport climbing in Margalef.",
        zh: "关于 Perfecto Mundo 与 Margalef 现代高难度运动攀登的媒体历史资料。"
      }
    }
  ],
  "grampians-australia": [
    {
      title: "Parks Victoria: Grampians Gariwerd National Park",
      url: "https://www.parks.vic.gov.au/places-to-see/parks/grampians-national-park",
      type: "official",
      description: {
        en: "Official park source for current access, visitor planning, and cultural-landscape context.",
        zh: "官方公园信息，用于查看当前准入、旅行安排和文化景观背景。"
      }
    },
    {
      title: "Mountain Project: Grampians",
      url: "https://www.mountainproject.com/area/105907768/the-grampians",
      type: "route-database",
      description: {
        en: "External route-database entry point for current route metadata.",
        zh: "当前路线元数据的外部路线数据库入口。"
      }
    }
  ],
  "yangshuo-china": [
    {
      title: "Wikipedia: Yangshuo County",
      url: "https://en.wikipedia.org/wiki/Yangshuo_County",
      type: "history/article",
      description: {
        en: "Open context for the karst landscape and travel setting around Yangshuo.",
        zh: "关于阳朔喀斯特景观和旅行背景的开放资料。"
      }
    },
    {
      title: "Wikipedia: Moon Hill",
      url: "https://en.wikipedia.org/wiki/Moon_Hill",
      type: "history/article",
      description: {
        en: "Open context for Moon Hill, one of Yangshuo's most recognizable climbing landmarks.",
        zh: "关于月亮山的开放资料，它是阳朔最有辨识度的攀岩地标之一。"
      }
    }
  ]
,
  "liming-china": [
    { title: "Mountain Project: Liming", url: "https://www.mountainproject.com/area/108397346/liming", type: "route-database", description: { en: "External route-database entry point for Liming metadata.", zh: "黎明线路元数据的外部路线数据库入口。" } },
    { title: "Wikipedia: Traditional climbing", url: "https://en.wikipedia.org/wiki/Traditional_climbing", type: "history/article", description: { en: "General context for traditional climbing systems and style boundaries.", zh: "传统攀登系统和风格边界的通用背景。" } }
  ],
  "long-dong-taiwan": [
    { title: "Chinese Wikipedia: Long Dong climbing area", url: "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4", type: "history/article", description: { en: "Open sector and area context for Long Dong climbing.", zh: "龙洞攀岩区域和分区背景。" } },
    { title: "Mountain Project: Long Dong", url: "https://www.mountainproject.com/area/106594934/long-dong-dragon-cave", type: "route-database", description: { en: "External route-database entry point for Long Dong metadata.", zh: "龙洞线路元数据的外部路线数据库入口。" } }
  ],
  "railay-tonsai-thailand": [
    { title: "Wikipedia: Railay Beach", url: "https://en.wikipedia.org/wiki/Railay_Beach", type: "history/article", description: { en: "Open context for Railay's limestone peninsula and travel setting.", zh: "关于 Railay 灰岩半岛和旅行环境的开放资料。" } },
    { title: "Mountain Project: Railay and Tonsai", url: "https://www.mountainproject.com/area/105894664/laem-phra-nang-railay-tonsai", type: "route-database", description: { en: "External route-database entry point for Railay and Tonsai metadata.", zh: "Railay 和 Tonsai 线路元数据的外部路线数据库入口。" } }
  ],
  "rocklands-south-africa": [
    { title: "Wikipedia: Rocklands", url: "https://en.wikipedia.org/wiki/Rocklands", type: "history/article", description: { en: "Open context for Rocklands as a global sandstone bouldering area.", zh: "关于 Rocklands 全球砂岩抱石区的开放资料。" } },
    { title: "Mountain Project: Rocklands", url: "https://www.mountainproject.com/area/108874793/rocklands", type: "route-database", description: { en: "External route-database entry point for current metadata and route research.", zh: "外部路线数据库入口，用于查看当前元数据和继续研究。" } }
  ]
};

const popularRouteAdditions: Record<string, RouteHighlight[]> = {
  "yosemite-usa": [
    {
      id: "astroman-washington-column",
      name: "Astroman",
      grade: "5.11c",
      type: "multi-pitch",
      length: "about 11 pitches",
      style: "Steep, physical Yosemite granite with legendary free-climbing status.",
      summary:
        "Astroman is a route for climbers who like their history loud and their systems quiet. It belongs on a shortlist when the goal is craft, not casual mileage.",
      practiceFocus: ["sustained crack movement", "efficient systems", "old-school composure"],
      bestFor:
        "Experienced Yosemite trad climbers comparing serious free-climbing objectives.",
      personalityTags: ["Historic testpiece", "Granite craft", "All-day focus"],
      decisionHint:
        "Pick it when you want a serious free-climbing goal that rewards preparation more than swagger.",
      sources: [
        source(
          "Mountain Project: Astroman metadata",
          "https://www.mountainproject.com/route/105845493/astroman",
          "route-database-metadata",
          "medium",
          ["name", "grade", "location"],
          "Route-database metadata only; ClimbAtlas does not copy route beta or comments."
        ),
        source(
          "Wikipedia: John Bachar",
          "https://en.wikipedia.org/wiki/John_Bachar",
          "open-encyclopedia",
          "medium",
          ["history", "climber context"],
          "Open encyclopedia context for Yosemite free-climbing history; not a route guide."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Astroman sits in the Yosemite imagination as a serious free-climbing benchmark: short enough to name in one breath, big enough to demand the whole day.",
        zh: "Astroman 在优胜美地想象里是一条严肃自由攀标杆：名字可以一口气说完，准备却足以占掉一整天。"
      },
      externalResources: [
        {
          title: "Mountain Project: Astroman",
          url: "https://www.mountainproject.com/route/105845493/astroman",
          type: "route-database",
          description: {
            en: "External route-database page for current metadata and community updates.",
            zh: "外部路线数据库页面，用于查看当前元数据和社区更新。"
          }
        }
      ],
      editorialTips: [
        "Treat this as a systems-and-style objective, not a quick prestige lap.",
        "If your smaller crack days feel chaotic, this card is a training direction rather than a target."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "rostrum-north-face-yosemite",
      name: "The Rostrum",
      grade: "5.11c",
      type: "multi-pitch",
      length: "about 8 pitches",
      style: "Clean Yosemite crack climbing with sustained traditional character.",
      summary:
        "The Rostrum is a classic for climbers who want a concentrated crack exam without turning the day into a full big-wall campaign.",
      practiceFocus: ["crack endurance", "pitch rhythm", "gear organization"],
      bestFor:
        "Trad climbers who want sustained Yosemite crack climbing in a more compact package.",
      personalityTags: ["Crack exam", "Classic rhythm", "Compact seriousness"],
      decisionHint:
        "Choose it when your hands, feet, and partner systems all feel ready to stay tidy for many pitches.",
      sources: [
        source(
          "Mountain Project: The Rostrum metadata",
          "https://www.mountainproject.com/route/105863822/the-north-face",
          "route-database-metadata",
          "medium",
          ["name", "grade", "location"],
          "Route-database metadata only; no descriptions, beta, or comments are copied."
        ),
        source(
          "Wikipedia: Yosemite National Park",
          "https://en.wikipedia.org/wiki/Yosemite_National_Park",
          "open-encyclopedia",
          "medium",
          ["area context"],
          "Open encyclopedia context for Yosemite Valley granite setting."
        )
      ],
      images: [],
      historicalNotes: {
        en: "The Rostrum has the clean, concentrated feel of a route people mention when they want Yosemite crack climbing without needing a mythic wall objective.",
        zh: "The Rostrum 有一种干净、集中的气质：想体验优胜美地裂缝，但不一定想把目标变成神话级大墙时，它常会被提起。"
      },
      externalResources: [
        {
          title: "Mountain Project: The Rostrum",
          url: "https://www.mountainproject.com/route/105863822/the-north-face",
          type: "route-database",
          description: {
            en: "External route-database page for current metadata and local updates.",
            zh: "外部路线数据库页面，用于查看当前元数据和本地更新。"
          }
        }
      ],
      editorialTips: [
        "Use it as a benchmark for clean crack rhythm, not as a place to discover whether your systems work.",
        "A good Rostrum day starts with calm organization."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "east-buttress-middle-cathedral-yosemite",
      name: "East Buttress of Middle Cathedral",
      grade: "5.10c",
      type: "multi-pitch",
      length: "about 11 pitches",
      style: "Classic Yosemite granite with varied traditional movement.",
      summary:
        "This is a strong choice when you want a historic multi-pitch feel without jumping straight to the biggest Valley objectives.",
      practiceFocus: ["varied crack skills", "route pacing", "partner communication"],
      bestFor:
        "Teams building confidence on longer Yosemite classics before more committing routes.",
      personalityTags: ["Classic mileage", "Granite classroom", "Team rhythm"],
      decisionHint:
        "Pick it when you want a real Yosemite day that still feels like learning, not proving.",
      sources: [
        source(
          "Mountain Project: East Buttress metadata",
          "https://www.mountainproject.com/route/105915125/east-buttress",
          "route-database-metadata",
          "medium",
          ["name", "grade", "location"],
          "Route-database metadata only; no beta or user comments are copied."
        ),
        source(
          "Wikipedia: Middle Cathedral Rock",
          "https://en.wikipedia.org/wiki/Middle_Cathedral_Rock",
          "open-encyclopedia",
          "medium",
          ["area context"],
          "Open encyclopedia context for the formation."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Middle Cathedral routes are good reminders that Yosemite classics do not need El Capitan scale to feel substantial.",
        zh: "Middle Cathedral 的路线提醒人：优胜美地经典不一定要有 El Capitan 的尺度，才会显得有分量。"
      },
      externalResources: [
        {
          title: "Mountain Project: East Buttress",
          url: "https://www.mountainproject.com/route/105915125/east-buttress",
          type: "route-database",
          description: {
            en: "External metadata and community update page.",
            zh: "外部元数据和社区更新页面。"
          }
        }
      ],
      editorialTips: [
        "Let this kind of route teach steady transitions and partner rhythm.",
        "A classic day is still a real day; keep the planning honest."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "the-phoenix-yosemite",
      name: "The Phoenix",
      grade: "5.13a",
      type: "trad",
      length: "1 pitch",
      style: "Short, famous hard crack climbing with milestone energy.",
      summary:
        "The Phoenix is a small physical space with a big historical shadow. It is best treated as inspiration for precision, not as a casual grade comparison.",
      practiceFocus: ["hard crack precision", "finger strength", "quality attempts"],
      bestFor:
        "Strong crack climbers studying Yosemite's hard free-climbing progression.",
      personalityTags: ["Milestone crack", "Short intensity", "History spark"],
      decisionHint:
        "Pick it as an aspirational card when you want a hard crack goal to sharpen training.",
      sources: [
        source(
          "Mountain Project: The Phoenix metadata",
          "https://www.mountainproject.com/route/105875268/the-phoenix",
          "route-database-metadata",
          "medium",
          ["name", "grade", "location"],
          "Route-database metadata only; no route description, beta, or comments are copied."
        ),
        source(
          "Wikipedia: Ray Jardine",
          "https://en.wikipedia.org/wiki/Ray_Jardine",
          "open-encyclopedia",
          "medium",
          ["history", "climber context"],
          "Open encyclopedia context for a key Yosemite free-climbing figure."
        )
      ],
      images: [],
      historicalNotes: {
        en: "The Phoenix is often discussed as a milestone in American hard free climbing: one pitch, many decades of reputation.",
        zh: "The Phoenix 常被视作美国高难自由攀历史中的里程碑：一段长度，却有几十年的名声。"
      },
      notableAscents: [
        {
          climber: "Ray Jardine",
          note: {
            en: "Public climbing-history sources connect Jardine with the route's early free-climbing significance.",
            zh: "公开攀岩历史资料将 Jardine 与这条线早期自由攀意义联系在一起。"
          },
          sourceLabel: "Wikipedia: Ray Jardine",
          sourceUrl: "https://en.wikipedia.org/wiki/Ray_Jardine"
        }
      ],
      externalResources: [
        {
          title: "Mountain Project: The Phoenix",
          url: "https://www.mountainproject.com/route/105875268/the-phoenix",
          type: "route-database",
          description: {
            en: "External route-database page for metadata and current community updates.",
            zh: "外部路线数据库页面，用于查看元数据和当前社区更新。"
          }
        }
      ],
      editorialTips: [
        "Short milestone routes reward fresh skin, fresh attention, and fewer better tries.",
        "Use it to clarify training direction before turning it into a plan."
      ],
      communityStatus: "coming-soon"
    }
  ],
  "red-river-gorge-usa": [
    {
      id: "thanatopsis-red-river-gorge",
      name: "Thanatopsis",
      grade: "5.14b",
      type: "sport",
      length: "single-pitch sport route",
      style: "Hard Red River Gorge endurance with a benchmark reputation.",
      summary:
        "Thanatopsis is a card for climbers who want the Red's serious side: power endurance, patience, and a session plan that does not panic.",
      practiceFocus: ["power endurance", "redpoint patience", "rest discipline"],
      bestFor:
        "Advanced sport climbers comparing high-end Red River Gorge benchmarks.",
      personalityTags: ["Endurance benchmark", "Serious pump", "Project brain"],
      decisionHint:
        "Pick it when you want a hard route to organize training, not a route to casually sample.",
      sources: [
        source(
          "Mountain Project: Red River Gorge area",
          "https://www.mountainproject.com/area/105841134/red-river-gorge",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; use only for metadata and current updates."
        ),
        source(
          "Wikipedia: Sasha DiGiulian",
          "https://en.wikipedia.org/wiki/Sasha_DiGiulian",
          "open-encyclopedia",
          "medium",
          ["climber context", "history"],
          "Open encyclopedia context for modern hard sport-climbing history."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Thanatopsis is useful in ClimbAtlas as a hard-endurance reference point: less travel brochure, more training compass.",
        zh: "Thanatopsis 在 ClimbAtlas 里更像高难耐力参照物：不像旅游宣传册，更像训练指南针。"
      },
      externalResources: [
        {
          title: "Mountain Project: Red River Gorge",
          url: "https://www.mountainproject.com/area/105841134/red-river-gorge",
          type: "route-database",
          description: {
            en: "External database entry point for route-specific pages and current local updates.",
            zh: "外部数据库入口，用于查看具体路线页面和当前本地更新。"
          }
        }
      ],
      editorialTips: [
        "Use this card to think about pacing and attempt quality.",
        "High-end endurance routes reward boringly good recovery habits."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "gods-own-stone-red-river-gorge",
      name: "God's Own Stone",
      grade: "5.14a",
      type: "sport",
      length: "single-pitch sport route",
      style: "Steep sandstone project climbing with classic Red River intensity.",
      summary:
        "God's Own Stone belongs in the 'serious but magnetic' pile: a route name with drama, and climbing that still rewards calm process.",
      practiceFocus: ["steep power", "attempt structure", "mental reset"],
      bestFor:
        "Sport climbers who want a high-end Red River reference for project planning.",
      personalityTags: ["Project magnet", "Steep discipline", "Hard sandstone"],
      decisionHint:
        "Choose it when you want a route that makes your process cleaner, not louder.",
      sources: [
        source(
          "Mountain Project: Red River Gorge area",
          "https://www.mountainproject.com/area/105841134/red-river-gorge",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; no route text or comments are copied."
        ),
        source(
          "Red River Gorge Climbers' Coalition",
          "https://rrgcc.org/",
          "official",
          "high",
          ["area stewardship", "access context"],
          "Official access and stewardship source for the region, not route beta."
        )
      ],
      images: [],
      historicalNotes: {
        en: "For ClimbAtlas, this route works best as a high-end style marker: steep, deliberate, and not improved by rushing.",
        zh: "在 ClimbAtlas 里，这条线最适合作为高难风格标记：陡、需要计划，而且不会因为着急变简单。"
      },
      externalResources: [
        {
          title: "Red River Gorge Climbers' Coalition",
          url: "https://rrgcc.org/",
          type: "official",
          description: {
            en: "Access and stewardship information for the region.",
            zh: "区域准入和维护信息。"
          }
        }
      ],
      editorialTips: [
        "Let the name be dramatic; keep your session boringly practical.",
        "Track what changes between attempts instead of collecting fatigue."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "transworld-depravity-red-river-gorge",
      name: "Transworld Depravity",
      grade: "5.14a",
      type: "sport",
      length: "single-pitch sport route",
      style: "Steep Red River sport climbing with sustained project energy.",
      summary:
        "Transworld Depravity is a good ClimbAtlas card for the climber who wants a hard goal with enough personality to keep training interesting.",
      practiceFocus: ["endurance intervals", "efficient movement", "try management"],
      bestFor:
        "Experienced sport climbers building a Red River hard-route shortlist.",
      personalityTags: ["Hard-route compass", "Sustained pump", "Session planning"],
      decisionHint:
        "Pick it when you want your training notes to become more specific.",
      sources: [
        source(
          "Mountain Project: Red River Gorge area",
          "https://www.mountainproject.com/area/105841134/red-river-gorge",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External database entry point used only for metadata research."
        ),
        source(
          "Wikipedia: Red River Gorge",
          "https://en.wikipedia.org/wiki/Red_River_Gorge",
          "open-encyclopedia",
          "medium",
          ["area context"],
          "Open encyclopedia context for the Kentucky region."
        )
      ],
      images: [],
      historicalNotes: {
        en: "This is the kind of Red River name that makes a shortlist feel lively before the climbing even starts.",
        zh: "这类红河峡谷路线名，会在真正开始攀登前就让候选清单变得很有画面感。"
      },
      externalResources: [
        {
          title: "Mountain Project: Red River Gorge",
          url: "https://www.mountainproject.com/area/105841134/red-river-gorge",
          type: "route-database",
          description: {
            en: "External route-database entry point for current metadata.",
            zh: "外部路线数据库入口，用于查看当前元数据。"
          }
        }
      ],
      editorialTips: [
        "Hard endurance improves fastest when feedback gets precise.",
        "Do not let a colorful name turn your warm-up into improv."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "swingline-red-river-gorge",
      name: "Swingline",
      grade: "5.13d",
      type: "sport",
      length: "single-pitch sport route",
      style: "Steep sandstone movement with power-endurance emphasis.",
      summary:
        "Swingline is useful as a near-top-end Red card: still very hard, but a slightly different decision from the 5.14 headline routes.",
      practiceFocus: ["power endurance", "movement economy", "confidence pacing"],
      bestFor:
        "Climbers who want a hard Red River goal without jumping straight to the loudest grade number.",
      personalityTags: ["Power-endurance test", "Hard but focused", "Red rhythm"],
      decisionHint:
        "Choose it when you want a demanding route that still feels like a training bridge.",
      sources: [
        source(
          "Mountain Project: Red River Gorge area",
          "https://www.mountainproject.com/area/105841134/red-river-gorge",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External database entry point used only for metadata research."
        ),
        source(
          "Red River Gorge Climbers' Coalition",
          "https://rrgcc.org/",
          "official",
          "high",
          ["access context", "stewardship"],
          "Official regional access and stewardship source; not route beta."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Swingline sits nicely in a route-finder list because it points toward hard Red movement without pretending every climber needs the biggest headline.",
        zh: "Swingline 很适合出现在路线选择器里：它指向红河峡谷的高难动作，但不假装每个人都需要最大标题。"
      },
      externalResources: [
        {
          title: "Mountain Project: Red River Gorge",
          url: "https://www.mountainproject.com/area/105841134/red-river-gorge",
          type: "route-database",
          description: {
            en: "External metadata entry point for route-specific follow-up.",
            zh: "外部元数据入口，用于继续查具体路线。"
          }
        }
      ],
      editorialTips: [
        "Use bridge routes to make hard-route habits less mysterious.",
        "Good pacing is not a consolation prize; it is the skill."
      ],
      communityStatus: "coming-soon"
    }
  ],
  "squamish-canada": [
    {
      id: "dreamcatcher-squamish",
      name: "Dreamcatcher",
      grade: "5.14d",
      type: "sport",
      length: "about 40 m",
      style: "Very hard granite sport climbing with international testpiece status.",
      summary:
        "Dreamcatcher is not a casual recommendation; it is a bright red pin on the map for elite difficulty, precision, and imagination.",
      practiceFocus: ["limit power", "precision", "project patience"],
      bestFor:
        "Elite sport climbers or curious fans studying Squamish's hardest modern face.",
      personalityTags: ["Elite testpiece", "Precision power", "Modern legend"],
      decisionHint:
        "Pick it as inspiration when you want a route to clarify long-term training direction.",
      sources: [
        source(
          "Wikipedia: Chris Sharma",
          "https://en.wikipedia.org/wiki/Chris_Sharma",
          "open-encyclopedia",
          "medium",
          ["climber context", "history"],
          "Open encyclopedia context for a climber associated with the route's history."
        ),
        source(
          "Wikipedia: Sean McColl",
          "https://en.wikipedia.org/wiki/Sean_McColl",
          "open-encyclopedia",
          "medium",
          ["repeat context", "climber context"],
          "Open encyclopedia context for public repeat history."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Dreamcatcher gives Squamish a modern hard-sport landmark: a route people talk about even when they are nowhere near ready to try it.",
        zh: "Dreamcatcher 给斯夸米什一个现代高难运动攀地标：很多人还远远没准备好尝试，也会谈论它。"
      },
      notableAscents: [
        {
          climber: "Chris Sharma",
          note: {
            en: "Public sources associate Sharma with the route's first-ascent history.",
            zh: "公开资料将 Sharma 与这条线的首攀历史联系在一起。"
          },
          sourceLabel: "Wikipedia: Chris Sharma",
          sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma"
        }
      ],
      externalResources: [
        {
          title: "Wikipedia: Chris Sharma",
          url: "https://en.wikipedia.org/wiki/Chris_Sharma",
          type: "history/article",
          description: {
            en: "Background source for climber and historical context.",
            zh: "用于了解攀岩者和历史语境的背景来源。"
          }
        }
      ],
      editorialTips: [
        "Use elite routes to make training honest, not frantic.",
        "An inspiration card is useful when it points to the next small step."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "university-wall-squamish",
      name: "University Wall",
      grade: "5.12a",
      type: "multi-pitch",
      length: "about 8 pitches",
      style: "Serious Squamish granite with classic wall-climbing reputation.",
      summary:
        "University Wall is for climbers who want the Chief to feel like a professor: precise, demanding, and not easily impressed.",
      practiceFocus: ["granite precision", "wall endurance", "team rhythm"],
      bestFor:
        "Experienced teams comparing serious Squamish multi-pitch objectives.",
      personalityTags: ["Granite professor", "Classic wall", "Team exam"],
      decisionHint:
        "Pick it when your team wants a route that rewards preparation and quiet competence.",
      sources: [
        source(
          "Mountain Project: Squamish area",
          "https://www.mountainproject.com/area/105798167/squamish",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; no route beta is copied."
        ),
        source(
          "Wikipedia: Stawamus Chief",
          "https://en.wikipedia.org/wiki/Stawamus_Chief",
          "open-encyclopedia",
          "medium",
          ["area context", "climbing context"],
          "Open encyclopedia context for the formation."
        )
      ],
      images: [],
      historicalNotes: {
        en: "University Wall belongs to the 'do your homework' branch of Squamish classics: the name is funny, the route is not casual.",
        zh: "University Wall 属于斯夸米什经典里“请先做功课”的那一支：名字有趣，路线不随便。"
      },
      externalResources: [
        {
          title: "Mountain Project: Squamish",
          url: "https://www.mountainproject.com/area/105798167/squamish",
          type: "route-database",
          description: {
            en: "External route-database entry point for current route pages.",
            zh: "外部路线数据库入口，用于查看当前路线页面。"
          }
        }
      ],
      editorialTips: [
        "Let serious classics improve your preparation habits.",
        "If the plan feels fuzzy, choose a clearer objective first."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "freeway-squamish",
      name: "Freeway",
      grade: "5.11c",
      type: "multi-pitch",
      length: "long multi-pitch route",
      style: "Sustained Squamish granite wall climbing with route-day commitment.",
      summary:
        "Freeway is a route for climbers who want a big Squamish day without needing every sentence to be dramatic.",
      practiceFocus: ["multi-pitch stamina", "efficient transitions", "granite confidence"],
      bestFor:
        "Teams ready for a longer Chief objective with steady technical focus.",
      personalityTags: ["Long day", "Granite rhythm", "Team mileage"],
      decisionHint:
        "Choose it when you want a route that tests sustained competence more than headline difficulty.",
      sources: [
        source(
          "Mountain Project: Squamish area",
          "https://www.mountainproject.com/area/105798167/squamish",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External database entry point; no route text or comments are copied."
        ),
        source(
          "BC Parks: Stawamus Chief Park",
          "https://bcparks.ca/stawamus-chief-park/",
          "official",
          "high",
          ["area access", "visitor context"],
          "Official park source for access context, not route beta."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Freeway fits ClimbAtlas as a decision card for the long-route mood: more rhythm than fireworks, more systems than slogans.",
        zh: "Freeway 很适合作为长线心情的决策卡：节奏多于烟火，系统多于口号。"
      },
      externalResources: [
        {
          title: "BC Parks: Stawamus Chief Park",
          url: "https://bcparks.ca/stawamus-chief-park/",
          type: "official",
          description: {
            en: "Official park context for access and visitor planning.",
            zh: "官方公园语境，用于查看准入和旅行安排。"
          }
        }
      ],
      editorialTips: [
        "Long routes reward boring systems in beautiful places.",
        "If you want fireworks, first make the basics invisible."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "exasperator-squamish",
      name: "Exasperator",
      grade: "5.10c",
      type: "trad",
      length: "about 2 pitches",
      style: "Classic Squamish crack climbing with approachable intensity.",
      summary:
        "Exasperator is a good card when the goal is to make crack technique feel real without turning the day into a saga.",
      practiceFocus: ["hand crack rhythm", "footwork", "calm gear systems"],
      bestFor:
        "Trad climbers wanting a focused Squamish crack objective before bigger wall days.",
      personalityTags: ["Crack classroom", "Compact classic", "Technique day"],
      decisionHint:
        "Pick it when you want a satisfying crack lesson that still leaves room for the rest of the day.",
      sources: [
        source(
          "Mountain Project: Squamish area",
          "https://www.mountainproject.com/area/105798167/squamish",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; no route beta is copied."
        ),
        source(
          "Wikipedia: Stawamus Chief",
          "https://en.wikipedia.org/wiki/Stawamus_Chief",
          "open-encyclopedia",
          "medium",
          ["area context"],
          "Open encyclopedia context for the formation and climbing area."
        )
      ],
      images: [],
      historicalNotes: {
        en: "A compact crack classic like Exasperator helps the atlas serve real trip decisions, not only dream lists.",
        zh: "像 Exasperator 这种紧凑裂缝经典，能让地图服务真实旅行选择，而不只是梦想清单。"
      },
      externalResources: [
        {
          title: "Mountain Project: Squamish",
          url: "https://www.mountainproject.com/area/105798167/squamish",
          type: "route-database",
          description: {
            en: "External database entry point for route-specific follow-up.",
            zh: "外部数据库入口，用于继续查具体路线。"
          }
        }
      ],
      editorialTips: [
        "Use compact classics to sharpen technique without overloading the day.",
        "Good crack climbing usually looks calmer than it feels at first."
      ],
      communityStatus: "coming-soon"
    }
  ],
  "fontainebleau-france": [
    {
      id: "l-angle-allain-fontainebleau",
      name: "L'Angle Allain",
      grade: "5+ / V2",
      type: "boulder",
      length: "short boulder problem",
      style: "Historic Fontainebleau arete climbing with elegant body-position demands.",
      summary:
        "L'Angle Allain is the kind of classic that reminds you Fontainebleau history is not only about big grades; it is also about clever movement.",
      practiceFocus: ["foot precision", "body position", "quiet attempts"],
      bestFor:
        "Boulderers who want a historical movement lesson before chasing harder numbers.",
      personalityTags: ["Historic puzzle", "Footwork lesson", "Forest classic"],
      decisionHint:
        "Pick it when you want to let an old problem teach a very current lesson.",
      sources: [
        source(
          "Wikipedia: Pierre Allain",
          "https://en.wikipedia.org/wiki/Pierre_Allain",
          "open-encyclopedia",
          "medium",
          ["climber context", "history"],
          "Open encyclopedia context for a key Fontainebleau figure."
        ),
        source(
          "Wikipedia: Fontainebleau rock climbing",
          "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
          "open-encyclopedia",
          "medium",
          ["area history", "bouldering context"],
          "Open encyclopedia context for Fontainebleau climbing history."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Routes linked to Pierre Allain help Fontainebleau feel like a living archive, not only a modern bouldering destination.",
        zh: "与 Pierre Allain 相关的经典，让枫丹白露像一座活的档案馆，而不只是现代抱石目的地。"
      },
      notableAscents: [
        {
          climber: "Pierre Allain",
          note: {
            en: "Public history sources connect Allain with early Fontainebleau bouldering culture.",
            zh: "公开历史资料将 Allain 与早期枫丹抱石文化联系在一起。"
          },
          sourceLabel: "Wikipedia: Pierre Allain",
          sourceUrl: "https://en.wikipedia.org/wiki/Pierre_Allain"
        }
      ],
      externalResources: [
        {
          title: "bleau.info",
          url: "https://bleau.info/",
          type: "route-database",
          description: {
            en: "External Fontainebleau route-database entry point.",
            zh: "外部枫丹白露路线数据库入口。"
          }
        }
      ],
      editorialTips: [
        "Let historical classics make your feet smarter before your ego gets louder.",
        "If the grade looks friendly, still give the movement full attention."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "fissure-des-alpinistes-fontainebleau",
      name: "Fissure des Alpinistes",
      grade: "4+ / V0",
      type: "boulder",
      length: "short boulder problem",
      style: "Old Fontainebleau crack-and-feature climbing with historical flavor.",
      summary:
        "Fissure des Alpinistes is a gentle reminder that a famous forest can teach through simple-looking shapes.",
      practiceFocus: ["basic body craft", "foot trust", "movement curiosity"],
      bestFor:
        "First-time Fontainebleau visitors who want a low-pressure historical flavor card.",
      personalityTags: ["History warm-up", "Simple-looking puzzle", "Forest roots"],
      decisionHint:
        "Choose it when you want the day to start with history instead of pressure.",
      sources: [
        source(
          "Wikipedia: Pierre Allain",
          "https://en.wikipedia.org/wiki/Pierre_Allain",
          "open-encyclopedia",
          "medium",
          ["climber context", "history"],
          "Open encyclopedia context for early Fontainebleau culture."
        ),
        source(
          "Wikipedia: Fontainebleau rock climbing",
          "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
          "open-encyclopedia",
          "medium",
          ["area history", "bouldering context"],
          "Open encyclopedia context; not a route guide."
        )
      ],
      images: [],
      historicalNotes: {
        en: "A modest-grade historical card helps keep the atlas honest: famous climbing culture is built from more than elite difficulty.",
        zh: "一张难度不高的历史卡能让地图更诚实：著名攀岩文化不只由精英难度组成。"
      },
      externalResources: [
        {
          title: "Wikipedia: Fontainebleau rock climbing",
          url: "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
          type: "history/article",
          description: {
            en: "Open history context for the forest's bouldering culture.",
            zh: "关于这片森林抱石文化的开放历史语境。"
          }
        }
      ],
      editorialTips: [
        "Use easier classics to notice movement details you usually skip.",
        "A route can be historically interesting without being physically terrifying."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "duel-fontainebleau",
      name: "Duel",
      grade: "8A / V11",
      type: "boulder",
      length: "short boulder problem",
      style: "Hard Fontainebleau bouldering with precise, technical pressure.",
      summary:
        "Duel is a serious forest problem for climbers who like their attempts thoughtful and their excuses short.",
      practiceFocus: ["precision", "attempt quality", "skin management"],
      bestFor:
        "Experienced boulderers comparing high-end Fontainebleau classics.",
      personalityTags: ["Hard forest puzzle", "Precision duel", "Session discipline"],
      decisionHint:
        "Pick it when you want a problem that makes every attempt count.",
      sources: [
        source(
          "Wikipedia: Catherine Miquel",
          "https://en.wikipedia.org/wiki/Catherine_Miquel",
          "open-encyclopedia",
          "medium",
          ["climber context", "history"],
          "Open encyclopedia context for Fontainebleau hard bouldering history."
        ),
        source(
          "Wikipedia: Fontainebleau rock climbing",
          "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
          "open-encyclopedia",
          "medium",
          ["area history", "bouldering context"],
          "Open encyclopedia context for the area."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Duel gives the route list a harder historical edge, and keeps the Fontainebleau section from feeling only nostalgic.",
        zh: "Duel 给路线清单加入更硬的历史边缘，也让枫丹部分不只是怀旧。"
      },
      notableAscents: [
        {
          climber: "Catherine Miquel",
          note: {
            en: "Public sources connect Miquel with major Fontainebleau hard-bouldering milestones.",
            zh: "公开资料将 Miquel 与枫丹高难抱石里程碑联系在一起。"
          },
          sourceLabel: "Wikipedia: Catherine Miquel",
          sourceUrl: "https://en.wikipedia.org/wiki/Catherine_Miquel"
        }
      ],
      externalResources: [
        {
          title: "bleau.info",
          url: "https://bleau.info/",
          type: "route-database",
          description: {
            en: "External database entry point for Fontainebleau route research.",
            zh: "外部数据库入口，用于枫丹路线研究。"
          }
        }
      ],
      editorialTips: [
        "Hard forest problems reward fewer, sharper attempts.",
        "Skin management is not a side quest here."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "karma-fontainebleau",
      name: "Karma",
      grade: "8A+ / V12",
      type: "boulder",
      length: "short boulder problem",
      style: "Fontainebleau high-end bouldering with modern benchmark energy.",
      summary:
        "Karma is a route-finder card for the climber who wants inspiration with a warning label: beautiful idea, very real difficulty.",
      practiceFocus: ["limit bouldering", "body tension", "session patience"],
      bestFor:
        "Strong boulderers studying the forest's harder modern references.",
      personalityTags: ["Modern benchmark", "Limit puzzle", "Patience tax"],
      decisionHint:
        "Choose it when you want a hard line to clarify what your training is actually missing.",
      sources: [
        source(
          "Wikipedia: Fred Nicole",
          "https://en.wikipedia.org/wiki/Fred_Nicole",
          "open-encyclopedia",
          "medium",
          ["climber context", "hard bouldering history"],
          "Open encyclopedia context for modern bouldering milestones."
        ),
        source(
          "Wikipedia: Fontainebleau rock climbing",
          "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
          "open-encyclopedia",
          "medium",
          ["area history", "bouldering context"],
          "Open encyclopedia context for the climbing area."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Karma belongs on the list as an aspirational marker: useful for direction, not for pretending every trip needs a hardest-problem storyline.",
        zh: "Karma 适合作为灵感标记：它能指明方向，但不代表每次旅行都要有最难问题剧情。"
      },
      externalResources: [
        {
          title: "bleau.info",
          url: "https://bleau.info/",
          type: "route-database",
          description: {
            en: "External Fontainebleau route-database entry point.",
            zh: "外部枫丹白露路线数据库入口。"
          }
        }
      ],
      editorialTips: [
        "Aspirational problems are best when they make the next small step obvious.",
        "Keep the dream vivid and the session practical."
      ],
      communityStatus: "coming-soon"
    }
  ],
  "kalymnos-greece": [
    {
      id: "gaia-kalymnos",
      name: "Gaia",
      grade: "8b+",
      type: "sport",
      length: "about 35 m",
      style: "Steep Kalymnos limestone with tufa endurance and project prestige.",
      summary:
        "Gaia is the Kalymnos card for a serious sunny project: beautiful surroundings, real pump, and no excuse to climb messily.",
      practiceFocus: ["tufa endurance", "rest strategy", "redpoint patience"],
      bestFor:
        "Advanced sport climbers looking for a high-end Kalymnos reference.",
      personalityTags: ["Tufa project", "Sunny seriousness", "Endurance quest"],
      decisionHint:
        "Pick it when you want the vacation setting to sharpen discipline instead of softening it.",
      sources: [
        source(
          "TheCrag: Kalymnos",
          "https://www.thecrag.com/en/climbing/greece/kalymnos",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; no route description or comments are copied."
        ),
        source(
          "Kalymnos Climbing Guidebook",
          "https://climbkalymnos.com/guidebook/",
          "official",
          "high",
          ["area", "guidebook coverage"],
          "Guidebook resource from the local guidebook team; no guidebook content is copied."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Gaia helps the Kalymnos list show its harder project side, beyond the relaxed postcard version of the island.",
        zh: "Gaia 让卡林诺斯列表呈现更硬的项目面，而不只是轻松明信片版本。"
      },
      externalResources: [
        {
          title: "TheCrag: Kalymnos",
          url: "https://www.thecrag.com/en/climbing/greece/kalymnos",
          type: "route-database",
          description: {
            en: "External database entry point for current Kalymnos route research.",
            zh: "外部数据库入口，用于当前卡林诺斯路线研究。"
          }
        }
      ],
      editorialTips: [
        "Do not let a sea view trick you into casual pacing.",
        "Tufa endurance rewards calm rests before desperate rests."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "inshallah-kalymnos",
      name: "Inshallah",
      grade: "7c",
      type: "sport",
      length: "about 30 m",
      style: "Steep, flowing limestone sport climbing with classic Kalymnos energy.",
      summary:
        "Inshallah is a good 'make the trip feel real' card: hard enough to focus, friendly enough to keep the mood bright.",
      practiceFocus: ["flow", "rest timing", "pump control"],
      bestFor:
        "Sport climbers looking for a memorable Kalymnos route without jumping to elite grades.",
      personalityTags: ["Vacation focus", "Flow state", "Pump control"],
      decisionHint:
        "Choose it when you want the day to feel fun and still teach you something.",
      sources: [
        source(
          "TheCrag: Kalymnos",
          "https://www.thecrag.com/en/climbing/greece/kalymnos",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; no beta is copied."
        ),
        source(
          "Kalymnos Climbing Guidebook",
          "https://climbkalymnos.com/guidebook/",
          "official",
          "high",
          ["area", "guidebook coverage"],
          "Guidebook resource from the local guidebook team; no guidebook content is copied."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Routes like Inshallah are why Kalymnos works as a decision site: the route can be memorable without being the hardest thing on the island.",
        zh: "像 Inshallah 这样的线说明了为什么卡林诺斯适合做路线决策：难度不必最高，也可以很有记忆点。"
      },
      externalResources: [
        {
          title: "Kalymnos Climbing Guidebook",
          url: "https://climbkalymnos.com/guidebook/",
          type: "guidebook/resource",
          linkStatus: "guidebook-specific",
          description: {
            en: "Guidebook resource for current Kalymnos route research.",
            zh: "用于查询卡林诺斯当前路线资料的路书资源页。"
          }
        }
      ],
      editorialTips: [
        "Fun routes are perfect places to practice clean pacing.",
        "Keep the climbing attentive even when the mood feels easy."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "tufantastic-kalymnos",
      name: "Tufantastic",
      grade: "7b+",
      type: "sport",
      length: "about 35 m",
      style: "Playful tufa climbing with a very Kalymnos sense of humor.",
      summary:
        "Tufantastic sounds like a joke and climbs like a useful lesson: stay relaxed, spend effort wisely, and enjoy the weird shapes.",
      practiceFocus: ["tufa movement", "efficiency", "relaxed power"],
      bestFor:
        "Climbers who want a fun Kalymnos tufa card with real training value.",
      personalityTags: ["Playful tufas", "Efficiency lesson", "Sunny pump"],
      decisionHint:
        "Pick it when you want a route that keeps the mood light without becoming throwaway mileage.",
      sources: [
        source(
          "TheCrag: Kalymnos",
          "https://www.thecrag.com/en/climbing/greece/kalymnos",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; no route text is copied."
        ),
        source(
          "Kalymnos Climbing Guidebook",
          "https://climbkalymnos.com/guidebook/",
          "official",
          "high",
          ["area", "guidebook coverage"],
          "Guidebook resource from the local guidebook team; no guidebook content is copied."
        )
      ],
      images: [],
      historicalNotes: {
        en: "Kalymnos is good at giving playful names to routes that still teach very serious efficiency.",
        zh: "卡林诺斯很擅长给路线起有玩心的名字，同时又认真教你效率。"
      },
      externalResources: [
        {
          title: "TheCrag: Kalymnos",
          url: "https://www.thecrag.com/en/climbing/greece/kalymnos",
          type: "route-database",
          description: {
            en: "External route-database entry point for current route research.",
            zh: "外部路线数据库入口，用于当前路线研究。"
          }
        }
      ],
      editorialTips: [
        "Let funny names invite relaxation, not carelessness.",
        "Efficiency is more useful than theatrics on steep limestone."
      ],
      communityStatus: "coming-soon"
    },
    {
      id: "los-revolucionarios-kalymnos",
      name: "Los Revolucionarios",
      grade: "9a",
      type: "sport",
      length: "hard single-pitch sport route",
      style: "Elite Kalymnos sport climbing with high-end project identity.",
      summary:
        "Los Revolucionarios is an elite reference card: not for casual route picking, but excellent for understanding how serious Kalymnos can get.",
      practiceFocus: ["elite power endurance", "long-term project planning", "recovery discipline"],
      bestFor:
        "Elite climbers and curious route historians studying the island's hardest end.",
      personalityTags: ["Elite project", "Grade frontier", "Research card"],
      decisionHint:
        "Choose it as inspiration or research unless your current climbing life is already built around elite projects.",
      sources: [
        source(
          "TheCrag: Kalymnos",
          "https://www.thecrag.com/en/climbing/greece/kalymnos",
          "route-database-metadata",
          "medium",
          ["area", "route-database context"],
          "External route database entry point; no route description or comments are copied."
        ),
        source(
          "Kalymnos Climbing Guidebook",
          "https://climbkalymnos.com/guidebook/",
          "official",
          "high",
          ["area", "guidebook coverage"],
          "Guidebook resource from the local guidebook team; no guidebook content is copied."
        )
      ],
      images: [],
      historicalNotes: {
        en: "This card exists to show the far end of the Kalymnos spectrum. It is a research marker first, a practical recommendation only for very few climbers.",
        zh: "这张卡用来展示卡林诺斯光谱的最远端。它首先是研究标记，只有极少数攀岩者会把它当现实推荐。"
      },
      externalResources: [
        {
          title: "TheCrag: Kalymnos",
          url: "https://www.thecrag.com/en/climbing/greece/kalymnos",
          type: "route-database",
          description: {
            en: "External metadata entry point for further route research.",
            zh: "外部元数据入口，用于继续路线研究。"
          }
        }
      ],
      editorialTips: [
        "Elite cards should clarify direction, not inflate urgency.",
        "Let the grade inspire honest training questions."
      ],
      communityStatus: "coming-soon"
    }
  ],
  "joshua-tree-usa": [
    routeAddition({
      id: "gunsmoke-joshua-tree",
      name: "Gunsmoke",
      grade: "V3",
      type: "boulder",
      length: "long traverse boulder problem",
      style: "Classic Joshua Tree granite bouldering with endurance-traverse personality.",
      summary: "Gunsmoke is a desert bouldering social test: not tall, not quiet, and surprisingly good at exposing sloppy pacing.",
      practiceFocus: ["traverse endurance", "footwork", "skin management"],
      bestFor: "Boulderers who want a famous Joshua Tree movement puzzle without committing to a roped objective.",
      personalityTags: ["Desert traverse", "Classic boulder", "Endurance puzzle"],
      decisionHint: "Pick it when you want a playful session that still asks for real tactics.",
      sources: expansionSourcePacks["joshua-tree-usa"],
      editorialTips: ["Use traverses to practice pacing before the pump gets theatrical.", "Desert skin is a real resource; spend it thoughtfully."],
      localizedContent: localizedRouteCopy({
        style: ["Classic granite traverse with desert bouldering character.", "经典花岗岩横移，带很强的沙漠抱石性格。"],
        summary: ["Gunsmoke is social, famous, and sneaky about endurance. It is a good reminder that not-tall does not mean not-serious.", "Gunsmoke 有社交感、有名气，也很会偷偷考耐力。它提醒你：不高不代表不认真。"],
        bestFor: ["Boulderers wanting a playful classic with real pacing lessons.", "适合想爬有趣经典，同时练节奏的抱石者。"],
        decisionHint: ["Choose it when you want a session that feels light but still teaches tactics.", "当你想要气氛轻松、但仍能学到策略时，选它。"],
        practiceFocus: [["traverse endurance", "footwork", "skin care"], ["横移耐力", "脚法", "皮肤管理"]],
        editorialTips: [["Do not burn all your best skin in the first few minutes.", "Let the route be social; keep your pacing private and smart."], ["不要在前几分钟用光最好的皮肤。", "路线可以很社交，你的节奏最好聪明而安静。"]]
      })
    }),
    routeAddition({
      id: "bird-of-fire-joshua-tree",
      name: "Bird of Fire",
      grade: "5.10a",
      type: "trad",
      length: "single-pitch trad route",
      style: "Classic Joshua Tree face and crack climbing with old-school focus.",
      summary: "Bird of Fire is a good card for climbers who want Joshua Tree style without pretending the desert is a gym.",
      practiceFocus: ["desert footwork", "trad composure", "movement reading"],
      bestFor: "Trad climbers comparing classic Joshua Tree moderates with a little edge.",
      personalityTags: ["Desert classic", "Technique lab", "Old-school focus"],
      decisionHint: "Pick it when you want technique to do more work than force.",
      sources: expansionSourcePacks["joshua-tree-usa"],
      editorialTips: ["Let the desert make you precise before it makes you loud.", "A moderate grade can still ask for grown-up attention."],
      localizedContent: localizedRouteCopy({
        style: ["Old-school Joshua Tree technique with desert honesty.", "老派 Joshua Tree 技术线，沙漠诚实感很强。"],
        summary: ["Bird of Fire is a classic style card: not a circus, not filler, just a good place to climb more carefully.", "Bird of Fire 是一张经典风格卡：不是大场面，也不是填空，而是一个让你爬得更仔细的地方。"],
        bestFor: ["Trad climbers looking for a classic desert technique day.", "适合想要经典沙漠技术日的传统攀者。"],
        decisionHint: ["Choose it when you want precision more than drama.", "当你想要精准多于戏剧性时，选它。"],
        practiceFocus: [["footwork", "trad headspace", "reading movement"], ["脚法", "传统攀心态", "读动作"]],
        editorialTips: [["Moderate classics are excellent teachers.", "Do not let the grade talk you out of paying attention."], ["适中经典是很好的老师。", "不要让难度数字说服你降低注意力。"]]
      })
    }),
    routeAddition({
      id: "clean-and-jerk-joshua-tree",
      name: "Clean and Jerk",
      grade: "5.10c",
      type: "trad",
      length: "single-pitch trad route",
      style: "Compact Joshua Tree trad climbing with powerful, technical character.",
      summary: "Clean and Jerk is useful when you want a route that feels like a small workshop for power, body position, and decision making.",
      practiceFocus: ["body position", "trad precision", "short-route focus"],
      bestFor: "Climbers who want a focused desert challenge without a huge time commitment.",
      personalityTags: ["Compact test", "Desert power", "Technique workshop"],
      decisionHint: "Pick it when you want one pitch to feel like a complete lesson.",
      sources: expansionSourcePacks["joshua-tree-usa"],
      editorialTips: ["Short routes reward full attention, not casual energy.", "Use compact objectives to notice exactly where technique leaks."],
      localizedContent: localizedRouteCopy({
        style: ["Compact desert trad with a physical streak.", "紧凑沙漠传统线，带一点身体型性格。"],
        summary: ["Clean and Jerk is a small workshop route: short enough to focus, sharp enough to show what needs practice.", "Clean and Jerk 像一间小工作坊：短到能集中，锋利到能指出你该练什么。"],
        bestFor: ["Climbers wanting a focused Joshua Tree challenge.", "适合想要一个集中 Joshua Tree 挑战的人。"],
        decisionHint: ["Pick it when one pitch should teach a complete lesson.", "当你想让一段路线教完整一课时，选它。"],
        practiceFocus: [["body position", "trad precision", "focus"], ["身体位置", "传统攀精准度", "专注"]],
        editorialTips: [["Short does not mean throwaway.", "Notice where power replaces technique, then fix that."], ["短不代表随便。", "观察哪里用力量替代了技术，然后修正。"]]
      })
    }),
    routeAddition({
      id: "southwest-corner-headstone-rock-joshua-tree",
      name: "Southwest Corner",
      grade: "5.6",
      type: "trad",
      length: "single-pitch trad route",
      style: "Accessible Joshua Tree classic with exposed-feeling desert position.",
      summary: "Southwest Corner is a friendly classic for choosing confidence, scenery, and desert movement over difficulty chasing.",
      practiceFocus: ["confidence mileage", "footwork", "exposure comfort"],
      bestFor: "Climbers wanting an approachable Joshua Tree classic with memorable position.",
      personalityTags: ["Confidence classic", "Desert position", "First-visit friendly"],
      decisionHint: "Pick it when the day should build confidence instead of ego pressure.",
      sources: expansionSourcePacks["joshua-tree-usa"],
      editorialTips: ["Friendly classics are perfect places to install better habits.", "Enjoy the position without turning it into a performance."],
      localizedContent: localizedRouteCopy({
        style: ["Approachable desert classic with memorable position.", "亲近的沙漠经典，位置感很有记忆点。"],
        summary: ["Southwest Corner is for days when confidence and scenery matter more than grade drama.", "Southwest Corner 适合那些信心和风景比难度戏剧更重要的日子。"],
        bestFor: ["Climbers wanting a friendly Joshua Tree classic.", "适合想爬亲切 Joshua Tree 经典的人。"],
        decisionHint: ["Choose it when the day should make you steadier.", "当今天的目标是让你更稳定时，选它。"],
        practiceFocus: [["confidence mileage", "footwork", "exposure comfort"], ["信心里程", "脚法", "暴露感适应"]],
        editorialTips: [["Confidence routes are not filler.", "Let the view lift your mood, not your risk tolerance."], ["信心路线不是填空。", "让风景提起心情，不要提高冒险容忍度。"]]
      })
    })
  ],
  "smith-rock-usa": [
    routeAddition({
      id: "pioneer-route-monkey-face-smith-rock",
      name: "Pioneer Route",
      grade: "5.7 A0",
      type: "multi-pitch",
      length: "multi-pitch tower route",
      style: "Iconic Monkey Face tower climbing with adventure character.",
      summary: "Pioneer Route is Smith Rock theater: memorable shape, memorable position, and a route choice that feels more like a tiny expedition.",
      practiceFocus: ["exposure comfort", "team systems", "tower mindset"],
      bestFor: "Teams wanting a classic Smith Rock tower objective with approachable technical difficulty.",
      personalityTags: ["Tower adventure", "Iconic formation", "Team systems"],
      decisionHint: "Pick it when the objective should feel like an adventure, not just a grade.",
      sources: expansionSourcePacks["smith-rock-usa"],
      editorialTips: ["Iconic formations reward calm systems.", "Let the tower be dramatic; keep your decisions simple."],
      localizedContent: localizedRouteCopy({
        style: ["Iconic tower climbing with adventure mood.", "标志性塔形攀登，冒险感很强。"],
        summary: ["Pioneer Route makes Smith Rock feel theatrical in a useful way: shape, exposure, and teamwork all matter.", "Pioneer Route 让 Smith Rock 有一种有用的戏剧感：形状、暴露感和队伍配合都重要。"],
        bestFor: ["Teams wanting a memorable tower objective.", "适合想要有记忆点塔形目标的队伍。"],
        decisionHint: ["Choose it when adventure mood matters more than pure difficulty.", "当冒险氛围比纯难度更重要时，选它。"],
        practiceFocus: [["exposure comfort", "team systems", "tower mindset"], ["暴露感适应", "队伍系统", "塔形路线心态"]],
        editorialTips: [["Keep the systems calm and let the tower do the drama.", "A classic formation still deserves current local research."], ["系统保持冷静，让塔自己负责戏剧性。", "经典地形依然需要最新当地研究。"]]
      })
    }),
    routeAddition({
      id: "moonshine-dihedral-smith-rock",
      name: "Moonshine Dihedral",
      grade: "5.9",
      type: "trad",
      length: "about 2 pitches",
      style: "Classic Smith Rock dihedral climbing with traditional technique focus.",
      summary: "Moonshine Dihedral is a good route-choice card for climbers who want craft, corners, and a quieter kind of classic.",
      practiceFocus: ["corner technique", "trad rhythm", "footwork"],
      bestFor: "Trad climbers looking for a moderate Smith Rock classic with real technique value.",
      personalityTags: ["Corner craft", "Moderate classic", "Technique day"],
      decisionHint: "Pick it when you want a route that teaches without shouting.",
      sources: expansionSourcePacks["smith-rock-usa"],
      editorialTips: ["Moderate corners are excellent movement teachers.", "Let your feet solve more than your arms want to."],
      localizedContent: localizedRouteCopy({
        style: ["Classic corner climbing with technique-first energy.", "经典角落线，技术优先。"],
        summary: ["Moonshine Dihedral is quieter than the big-name testpieces, which is exactly why it is useful.", "Moonshine Dihedral 比那些大名鼎鼎的测试线安静，也正因如此很有用。"],
        bestFor: ["Trad climbers wanting moderate technique value.", "适合想要适中技术价值的传统攀者。"],
        decisionHint: ["Pick it when craft sounds better than spectacle.", "当手艺比场面更有吸引力时，选它。"],
        practiceFocus: [["corner technique", "trad rhythm", "footwork"], ["角落技术", "传统攀节奏", "脚法"]],
        editorialTips: [["Quiet classics can improve loud habits.", "Let your feet lead the conversation."], ["安静经典可以改善很吵的坏习惯。", "让脚先说话。"]]
      })
    }),
    routeAddition({
      id: "karate-crack-smith-rock",
      name: "Karate Crack",
      grade: "5.10a",
      type: "trad",
      length: "single-pitch trad route",
      style: "Smith Rock crack climbing with compact technical bite.",
      summary: "Karate Crack is a compact technique card: useful when you want a route that asks for accuracy before volume.",
      practiceFocus: ["crack technique", "precision", "short-route focus"],
      bestFor: "Climbers wanting a focused Smith Rock crack objective.",
      personalityTags: ["Crack lesson", "Compact classic", "Precision day"],
      decisionHint: "Pick it when you want one focused pitch to sharpen your technique.",
      sources: expansionSourcePacks["smith-rock-usa"],
      editorialTips: ["Short cracks are great places to find inefficient habits.", "A focused route can be more useful than a long list."],
      localizedContent: localizedRouteCopy({
        style: ["Compact crack climbing with technical bite.", "紧凑裂缝线，技术咬合感很强。"],
        summary: ["Karate Crack is a clean little test of whether your crack movement is calm or just enthusiastic.", "Karate Crack 很适合测试你的裂缝动作是冷静，还是只是很热情。"],
        bestFor: ["Climbers wanting a focused crack-technique card.", "适合想要集中裂缝技术卡的人。"],
        decisionHint: ["Choose it when precision is the point.", "当精准就是重点时，选它。"],
        practiceFocus: [["crack technique", "precision", "focus"], ["裂缝技术", "精准", "专注"]],
        editorialTips: [["Use compact routes to find leaks.", "Good technique usually feels less dramatic."], ["用紧凑路线找到漏洞。", "好技术通常没那么戏剧化。"]]
      })
    }),
    routeAddition({
      id: "darkness-at-noon-smith-rock",
      name: "Darkness at Noon",
      grade: "5.13a",
      type: "sport",
      length: "single-pitch sport route",
      style: "Hard Smith Rock sport climbing with old-school benchmark flavor.",
      summary: "Darkness at Noon is a serious sport card for climbers who want Smith's harder history to guide a training block.",
      practiceFocus: ["technical power", "redpoint structure", "attempt quality"],
      bestFor: "Sport climbers comparing harder Smith Rock benchmarks.",
      personalityTags: ["Hard benchmark", "Sport history", "Project focus"],
      decisionHint: "Pick it when a hard route would make your training more specific.",
      sources: expansionSourcePacks["smith-rock-usa"],
      editorialTips: ["Hard benchmarks reward specific feedback.", "Do not confuse more tries with better tries."],
      localizedContent: localizedRouteCopy({
        style: ["Hard sport benchmark with Smith Rock history flavor.", "带 Smith Rock 历史味道的高难运动攀标杆。"],
        summary: ["Darkness at Noon belongs on the list when you want a hard route to organize training, not ego.", "当你想用一条硬线组织训练，而不是组织 ego 时，Darkness at Noon 值得进清单。"],
        bestFor: ["Sport climbers comparing Smith Rock hard routes.", "适合比较 Smith Rock 高难运动线的人。"],
        decisionHint: ["Choose it when the project should make your feedback sharper.", "当项目应该让反馈更锋利时，选它。"],
        practiceFocus: [["technical power", "redpoint structure", "attempt quality"], ["技术力量", "红点结构", "尝试质量"]],
        editorialTips: [["Hard routes like useful notes more than dramatic suffering.", "Make each attempt answer one question."], ["高难路线更喜欢有用记录，不喜欢戏剧化受苦。", "让每次尝试回答一个问题。"]]
      })
    })
  ],
  "el-potrero-chico-mexico": [
    routeAddition({
      id: "pancho-villa-rides-again-potrero-chico",
      name: "Pancho Villa Rides Again",
      grade: "5.10d",
      type: "multi-pitch",
      length: "long multi-pitch sport route",
      style: "Approachable limestone adventure with classic Potrero multi-pitch flavor.",
      summary: "Pancho Villa Rides Again is a bridge between vacation energy and real wall-day organization.",
      practiceFocus: ["multi-pitch pacing", "team rhythm", "exposure comfort"],
      bestFor: "Teams wanting a memorable Potrero route without jumping straight to the biggest objectives.",
      personalityTags: ["Limestone adventure", "Team rhythm", "Travel classic"],
      decisionHint: "Pick it when you want the day to feel like a vertical road trip.",
      sources: expansionSourcePacks["el-potrero-chico-mexico"],
      editorialTips: ["Long friendly routes still reward tidy systems.", "Let the adventure feel big and the decisions stay simple."]
    }),
    routeAddition({
      id: "supernova-potrero-chico",
      name: "Supernova",
      grade: "5.11a",
      type: "multi-pitch",
      length: "multi-pitch sport route",
      style: "Bright Potrero limestone climbing with a moderate-hard adventure feel.",
      summary: "Supernova gives the shortlist some spark without turning the day into the biggest wall campaign.",
      practiceFocus: ["limestone movement", "route pacing", "partner systems"],
      bestFor: "Climbers building toward harder Potrero multi-pitch days.",
      personalityTags: ["Bright adventure", "Limestone flow", "Bridge objective"],
      decisionHint: "Pick it when you want a step up that still feels like learning.",
      sources: expansionSourcePacks["el-potrero-chico-mexico"],
      editorialTips: ["A step-up route is best when it clarifies habits.", "Keep the travel mood light and the systems serious."]
    }),
    routeAddition({
      id: "black-cat-bone-potrero-chico",
      name: "Black Cat Bone",
      grade: "5.10d",
      type: "sport",
      length: "single-pitch sport route",
      style: "Compact Potrero limestone sport climbing with practical route-day value.",
      summary: "Black Cat Bone is a compact card for climbers who want Potrero flavor without committing the whole day.",
      practiceFocus: ["limestone technique", "warm-up judgment", "movement economy"],
      bestFor: "Sport climbers comparing shorter Potrero objectives around bigger route days.",
      personalityTags: ["Compact limestone", "Travel-day useful", "Movement tune-up"],
      decisionHint: "Pick it when the day needs focus without a full expedition.",
      sources: expansionSourcePacks["el-potrero-chico-mexico"],
      editorialTips: ["Short routes can tune the day before bigger plans.", "Do not let compact objectives become careless ones."]
    }),
    routeAddition({
      id: "jungle-mountaineering-potrero-chico",
      name: "Jungle Mountaineering",
      grade: "5.9",
      type: "multi-pitch",
      length: "multi-pitch sport route",
      style: "Friendly Potrero multi-pitch climbing with exploratory mood.",
      summary: "Jungle Mountaineering is a confidence-building adventure card: approachable, scenic, and still worth planning well.",
      practiceFocus: ["confidence mileage", "multi-pitch basics", "calm systems"],
      bestFor: "Teams wanting lower-pressure Potrero multi-pitch mileage.",
      personalityTags: ["Confidence route", "Scenic mileage", "Friendly adventure"],
      decisionHint: "Pick it when the day should build systems instead of stress.",
      sources: expansionSourcePacks["el-potrero-chico-mexico"],
      editorialTips: ["Lower-pressure routes are where systems become natural.", "Good mileage is training with better scenery."]
    })
  ],
  "chamonix-france": [
    routeAddition({
      id: "frendo-spur-aiguille-du-midi",
      name: "Frendo Spur",
      grade: "D+ / alpine route",
      type: "multi-pitch",
      length: "long alpine route",
      style: "Classic Chamonix alpine route with rock, snow, and big-mountain seriousness.",
      summary: "Frendo Spur is an alpine decision card: impressive, historic, and completely dependent on conditions and judgment.",
      practiceFocus: ["alpine judgment", "mixed terrain", "weather planning"],
      bestFor: "Alpinists comparing serious Chamonix objectives with strong guidebook and conditions research.",
      personalityTags: ["Alpine classic", "Condition dependent", "Big-mountain focus"],
      decisionHint: "Pick it only when conditions, team skill, and current local information all line up.",
      sources: expansionSourcePacks["chamonix-france"],
      editorialTips: ["Alpine classics are condition stories, not static checklists.", "This card is for choosing direction, not replacing guidebooks."]
    }),
    routeAddition({
      id: "rebuffat-baquet-aiguille-du-midi",
      name: "Rebuffat-Baquet Route",
      grade: "TD+ / 6a max",
      type: "multi-pitch",
      length: "about 200 m",
      style: "High-altitude granite rock climbing on the Aiguille du Midi south face.",
      summary: "Rebuffat-Baquet is a Chamonix rock-history card: elegant, elevated, and still alpine enough to demand respect.",
      practiceFocus: ["granite precision", "altitude pacing", "alpine systems"],
      bestFor: "Experienced climbers comparing Aiguille du Midi rock routes with current conditions research.",
      personalityTags: ["Alpine granite", "History line", "High-altitude rock"],
      decisionHint: "Pick it when you want rock climbing with real alpine context.",
      sources: expansionSourcePacks["chamonix-france"],
      editorialTips: ["High-altitude rock is still alpine climbing.", "Let the history sharpen preparation, not shortcuts."]
    }),
    routeAddition({
      id: "contamine-route-aiguille-du-midi",
      name: "Contamine Route",
      grade: "6c+ / alpine rock",
      type: "multi-pitch",
      length: "about 200 m",
      style: "Technical Aiguille du Midi south-face granite in an alpine setting.",
      summary: "Contamine Route is a precision card for climbers who want technical rock without forgetting where the route sits.",
      practiceFocus: ["technical granite", "altitude focus", "current conditions"],
      bestFor: "Strong alpine rock climbers researching Aiguille du Midi objectives.",
      personalityTags: ["Technical alpine rock", "Granite focus", "Condition-aware"],
      decisionHint: "Pick it when technical ambition is matched by alpine caution.",
      sources: expansionSourcePacks["chamonix-france"],
      editorialTips: ["Do not let technical focus erase mountain context.", "Current conditions matter more than old confidence."]
    }),
    routeAddition({
      id: "mallory-porter-aiguille-du-midi",
      name: "Mallory-Porter Route",
      grade: "alpine north-face route",
      type: "multi-pitch",
      length: "large alpine route",
      style: "Historic Aiguille du Midi north-face line with serious alpine identity.",
      summary: "Mallory-Porter is a history-and-judgment card, useful for understanding Chamonix scale rather than choosing a casual objective.",
      practiceFocus: ["alpine history", "north-face judgment", "risk awareness"],
      bestFor: "Experienced alpinists studying Chamonix route history and serious north-face objectives.",
      personalityTags: ["Historic north face", "Research card", "Serious alpine"],
      decisionHint: "Choose it as research context unless you are already operating at this level.",
      sources: expansionSourcePacks["chamonix-france"],
      editorialTips: ["Some cards are here to teach scale, not invite immediate plans.", "Serious alpine routes require real current information."]
    })
  ],
  "ceuse-france": [
    routeAddition({
      id: "la-femme-blanche-ceuse",
      name: "La Femme Blanche",
      grade: "8a+",
      type: "sport",
      length: "single-pitch sport route",
      style: "Historic Ceuse sport climbing with Patrick Edlinger-era significance.",
      summary: "La Femme Blanche is a history card with real climbing teeth: useful when you want Ceuse to feel older than the 9a+ headlines.",
      practiceFocus: ["technical endurance", "history awareness", "finger discipline"],
      bestFor: "Sport climbers wanting a historic Ceuse benchmark below the modern top-end routes.",
      personalityTags: ["Historic sport", "Ceuse classic", "Technical endurance"],
      decisionHint: "Pick it when you want a route that connects training with sport-climbing history.",
      sources: expansionSourcePacks["ceuse-france"],
      editorialTips: ["Historic grades still ask for current readiness.", "Let the old-school aura sharpen your process."]
    }),
    routeAddition({
      id: "la-femme-noire-ceuse",
      name: "La Femme Noire",
      grade: "7c+",
      type: "sport",
      length: "single-pitch sport route",
      style: "Classic Ceuse limestone with technical sport-climbing roots.",
      summary: "La Femme Noire is a good bridge card: historical enough to matter, approachable enough to help shape a real trip list.",
      practiceFocus: ["limestone technique", "pacing", "movement reading"],
      bestFor: "Sport climbers comparing classic Ceuse routes before harder projects.",
      personalityTags: ["Classic limestone", "Bridge route", "Technical sport"],
      decisionHint: "Choose it when you want Ceuse history without starting at the hardest end.",
      sources: expansionSourcePacks["ceuse-france"],
      editorialTips: ["Bridge classics are useful because they teach without drowning the day.", "Read the route, not only the grade."]
    }),
    routeAddition({
      id: "opera-vertical-ceuse",
      name: "Opera Vertical",
      grade: "7b",
      type: "sport",
      length: "single-pitch sport route",
      style: "Early Ceuse sport climbing with elegant limestone movement.",
      summary: "Opera Vertical is a lighter historical card for climbers who want Ceuse movement without immediately turning the trip into a project war.",
      practiceFocus: ["flow", "footwork", "efficient rhythm"],
      bestFor: "Climbers looking for classic Ceuse mileage with history flavor.",
      personalityTags: ["Historic mileage", "Flow route", "Limestone rhythm"],
      decisionHint: "Pick it when the day should feel musical instead of maximal.",
      sources: expansionSourcePacks["ceuse-france"],
      editorialTips: ["Flow routes are real training if you pay attention.", "Use lighter days to make better habits stick."]
    }),
    routeAddition({
      id: "le-petite-illusion-ceuse",
      name: "Le Petite Illusion",
      grade: "7a+",
      type: "sport",
      length: "single-pitch sport route",
      style: "Approachable Ceuse limestone with classic training value.",
      summary: "Le Petite Illusion is a good first-step Ceuse card: enough history and style to matter, without demanding a heroic project mindset.",
      practiceFocus: ["confidence mileage", "limestone footwork", "route reading"],
      bestFor: "Climbers wanting a more approachable Ceuse classic to start the list.",
      personalityTags: ["First-step classic", "Confidence mileage", "Limestone lesson"],
      decisionHint: "Pick it when you want Ceuse to teach before it tests.",
      sources: expansionSourcePacks["ceuse-france"],
      editorialTips: ["Approachable routes are where habits get installed.", "Do not rush past useful lessons because the grade feels friendly."]
    })
  ],
  "dolomites-italy": [
    routeAddition({
      id: "via-attraverso-il-pesce-dolomites",
      name: "Via Attraverso il Pesce",
      grade: "VII+ / alpine free-climb context",
      type: "multi-pitch",
      length: "long Marmolada wall route",
      style: "Historic Dolomites big-wall climbing with serious alpine commitment.",
      summary: "Via Attraverso il Pesce is a history-and-commitment card: beautiful, famous, and better treated as research before desire becomes a plan.",
      practiceFocus: ["alpine commitment", "wall endurance", "route research"],
      bestFor: "Experienced alpine rock climbers comparing serious Dolomites wall objectives.",
      personalityTags: ["Historic wall", "Research card", "Alpine seriousness"],
      decisionHint: "Choose it when the question is not just difficulty, but whether the whole mountain day fits.",
      sources: expansionSourcePacks["dolomites-italy"],
      editorialTips: ["Use famous wall routes to guide preparation, not to skip research.", "Keep conditions, descent, and local information in the decision."]
    }),
    routeAddition({
      id: "don-quixote-marmolada-dolomites",
      name: "Don Quixote",
      grade: "VI+ / classic alpine rock",
      type: "multi-pitch",
      length: "long Marmolada route",
      style: "Classic Dolomites rock adventure with moderate-hard alpine character.",
      summary: "Don Quixote is a good route-choice card for climbers wanting a classic wall feeling without jumping straight to the hardest modern lines.",
      practiceFocus: ["multi-pitch rhythm", "alpine pacing", "partner systems"],
      bestFor: "Teams building toward bigger Dolomites objectives with a classic route mindset.",
      personalityTags: ["Classic adventure", "Team rhythm", "Wall mileage"],
      decisionHint: "Pick it when you want an old-story route that still asks for current judgment.",
      sources: expansionSourcePacks["dolomites-italy"],
      editorialTips: ["Classic does not mean casual.", "Let the route teach rhythm before ambition gets loud."]
    }),
    routeAddition({
      id: "micheluzzi-piz-ciavazes-dolomites",
      name: "Via Micheluzzi",
      grade: "VI+",
      type: "multi-pitch",
      length: "long alpine rock route",
      style: "Dolomites limestone-dolomite face climbing with classic technique value.",
      summary: "Via Micheluzzi is useful as a craft card: enough history, enough length, and plenty of reason to care about clean movement.",
      practiceFocus: ["face technique", "route pacing", "alpine composure"],
      bestFor: "Climbers seeking a classic Dolomites movement lesson before bigger wall goals.",
      personalityTags: ["Technique classic", "Alpine classroom", "Measured adventure"],
      decisionHint: "Pick it when technique and calm pacing sound more useful than a headline grade.",
      sources: expansionSourcePacks["dolomites-italy"],
      editorialTips: ["Moderate alpine classics are where habits become visible.", "Use the day to practice flow, not speed theater."]
    }),
    routeAddition({
      id: "via-solleder-civetta-dolomites",
      name: "Via Solleder",
      grade: "VI / historic alpine route",
      type: "multi-pitch",
      length: "large Civetta wall route",
      style: "Historic Dolomites wall climbing with old-school alpine scale.",
      summary: "Via Solleder is a scale card: it helps the atlas show why the Dolomites are more than scenic towers.",
      practiceFocus: ["alpine scale", "endurance planning", "historical context"],
      bestFor: "Experienced teams studying classic Dolomites north-wall objectives.",
      personalityTags: ["Historic scale", "Old-school wall", "Endurance day"],
      decisionHint: "Choose it as a serious classic only when current conditions and team experience line up.",
      sources: expansionSourcePacks["dolomites-italy"],
      editorialTips: ["Old-school routes need modern judgment.", "Let historical scale make planning sharper, not romantic."]
    })
  ],
  "frankenjura-germany": [
    routeAddition({
      id: "sautanz-frankenjura",
      name: "Sautanz",
      grade: "8b / UIAA X- context",
      type: "sport",
      length: "short sport route",
      style: "Historic pocketed limestone with early hard-sport significance.",
      summary: "Sautanz is a history card with teeth: short, influential, and useful for understanding Frankenjura power before chasing newer numbers.",
      practiceFocus: ["pocket strength", "power precision", "history awareness"],
      bestFor: "Sport climbers studying classic Frankenjura difficulty and Güllich-era style.",
      personalityTags: ["Historic power", "Pocket test", "Forest classic"],
      decisionHint: "Pick it when you want a route that feels like a compact history lesson.",
      sources: expansionSourcePacks["frankenjura-germany"],
      editorialTips: ["Short historic routes still deserve patient warm-ups.", "Treat the name as context, not readiness proof."]
    }),
    routeAddition({
      id: "the-face-frankenjura",
      name: "The Face",
      grade: "8a+",
      type: "sport",
      length: "short sport route",
      style: "Classic Frankenjura limestone power climbing with benchmark flavor.",
      summary: "The Face is a clean route-choice card for climbers who want hard movement without turning the day into grade theater.",
      practiceFocus: ["limit movement", "finger timing", "attempt quality"],
      bestFor: "Climbers comparing hard Frankenjura classics below the absolute top end.",
      personalityTags: ["Power benchmark", "Short focus", "Classic sport"],
      decisionHint: "Pick it when one sharp pitch is more useful than a long list.",
      sources: expansionSourcePacks["frankenjura-germany"],
      editorialTips: ["Make each attempt answer one question.", "Power routes like calm notes more than dramatic suffering."]
    }),
    routeAddition({
      id: "corona-frankenjura",
      name: "Corona",
      grade: "9a+",
      type: "sport",
      length: "hard single-pitch sport route",
      style: "Elite Frankenjura limestone with modern hard-route identity.",
      summary: "Corona is an elite reference card: useful for understanding the region's modern ceiling, not for casual route picking.",
      practiceFocus: ["elite power endurance", "long-term project planning", "recovery discipline"],
      bestFor: "Elite climbers and route-history readers studying modern Frankenjura hard sport.",
      personalityTags: ["Elite project", "Modern benchmark", "Research card"],
      decisionHint: "Choose it as inspiration unless your current climbing life is already built around this level.",
      sources: expansionSourcePacks["frankenjura-germany"],
      editorialTips: ["Elite cards should clarify direction, not inflate urgency.", "Let the number ask honest training questions."]
    }),
    routeAddition({
      id: "magnet-frankenjura",
      name: "Magnet",
      grade: "8c",
      type: "sport",
      length: "single-pitch sport route",
      style: "Hard pocketed limestone with classic Frankenjura training value.",
      summary: "Magnet is a useful middle-hard card for climbers who want the Frankenjura style without only staring at 9a headlines.",
      practiceFocus: ["finger power", "movement efficiency", "session discipline"],
      bestFor: "Strong sport climbers building a Frankenjura shortlist around power and precision.",
      personalityTags: ["Pocket power", "Training compass", "Forest project"],
      decisionHint: "Pick it when you want a hard route to make your training more specific.",
      sources: expansionSourcePacks["frankenjura-germany"],
      editorialTips: ["Hard routes are better when feedback gets precise.", "Do not mistake more tries for better tries."]
    })
  ],
  "siurana-spain": [
    routeAddition({
      id: "kalea-borroka-siurana",
      name: "Kalea Borroka",
      grade: "8b+",
      type: "sport",
      length: "single-pitch sport route",
      style: "Technical Siurana limestone with hard classic-project energy.",
      summary: "Kalea Borroka helps balance the Siurana page: hard enough to matter, practical enough to compare with trip goals.",
      practiceFocus: ["technical endurance", "edge precision", "redpoint structure"],
      bestFor: "Sport climbers building a serious but not only elite Siurana shortlist.",
      personalityTags: ["Technical project", "Limestone focus", "Hard classic"],
      decisionHint: "Pick it when you want difficulty to sharpen process instead of just raising volume.",
      sources: expansionSourcePacks["siurana-spain"],
      editorialTips: ["Technical projects reward clean notes.", "Let the route teach precision before panic."]
    }),
    routeAddition({
      id: "migranya-profunda-siurana",
      name: "Migranya Profunda",
      grade: "8b",
      type: "sport",
      length: "single-pitch sport route",
      style: "Classic Siurana sport climbing with sustained technical character.",
      summary: "Migranya Profunda is a useful route-choice card for climbers who want Siurana intensity without only comparing headline grades.",
      practiceFocus: ["sustained movement", "footwork", "try management"],
      bestFor: "Climbers who want a hard technical Siurana reference below the biggest names.",
      personalityTags: ["Sustained classic", "Technical focus", "Process route"],
      decisionHint: "Choose it when the day should be about solving, not posing.",
      sources: expansionSourcePacks["siurana-spain"],
      editorialTips: ["Do not let a familiar grade make the style feel automatic.", "Use each burn to improve one decision."]
    }),
    routeAddition({
      id: "anabolica-siurana",
      name: "Anabolica",
      grade: "8a",
      type: "sport",
      length: "single-pitch sport route",
      style: "Siurana limestone with accessible-hard classic value.",
      summary: "Anabolica is a good bridge card: serious enough to focus the day, not so extreme that it only works as fantasy.",
      practiceFocus: ["route reading", "rest discipline", "movement economy"],
      bestFor: "Sport climbers looking for a more practical hard Siurana objective.",
      personalityTags: ["Bridge classic", "Technical lesson", "Trip useful"],
      decisionHint: "Pick it when you want a route that can teach without swallowing the whole trip.",
      sources: expansionSourcePacks["siurana-spain"],
      editorialTips: ["Bridge routes are valuable because they connect ambition with usable feedback.", "Keep the goal specific."]
    }),
    routeAddition({
      id: "mandragora-siurana",
      name: "Mandragora",
      grade: "7b+",
      type: "sport",
      length: "single-pitch sport route",
      style: "Approachable Siurana limestone with classic movement value.",
      summary: "Mandragora gives the Siurana list a friendlier decision card for learning the area before chasing the famous hard routes.",
      practiceFocus: ["technical footwork", "confidence mileage", "limestone reading"],
      bestFor: "First-time Siurana visitors who want a style lesson before bigger objectives.",
      personalityTags: ["First-step classic", "Movement lesson", "Confidence mileage"],
      decisionHint: "Pick it when Siurana should teach before it tests.",
      sources: expansionSourcePacks["siurana-spain"],
      editorialTips: ["Friendlier classics can install better habits.", "Do not rush past the route just because the number looks kind."]
    })
  ],
  "margalef-spain": [
    routeAddition({
      id: "samfaina-margalef",
      name: "Samfaina",
      grade: "9a",
      type: "sport",
      length: "single-pitch sport route",
      style: "Hard Margalef conglomerate with modern project character.",
      summary: "Samfaina is a hard-route compass card for climbers who want Margalef to mean more than the very loudest names.",
      practiceFocus: ["pocket power endurance", "redpoint structure", "finger recovery"],
      bestFor: "Advanced sport climbers studying Margalef's hard pocket climbing.",
      personalityTags: ["Pocket project", "Hard benchmark", "Modern sport"],
      decisionHint: "Choose it when a hard pocket route would make training more specific.",
      sources: expansionSourcePacks["margalef-spain"],
      editorialTips: ["Pocket projects reward recovery discipline.", "Let the project clarify the next training question."]
    }),
    routeAddition({
      id: "victimas-perez-margalef",
      name: "Victimas Perez",
      grade: "9a",
      type: "sport",
      length: "single-pitch sport route",
      style: "Elite Margalef sport climbing with steep pocket intensity.",
      summary: "Victimas Perez belongs on the list as a serious reference point for Margalef's modern hard-climbing identity.",
      practiceFocus: ["steep pockets", "attempt quality", "session pacing"],
      bestFor: "Advanced climbers comparing high-end Margalef projects.",
      personalityTags: ["Elite pockets", "Project focus", "Margalef hard"],
      decisionHint: "Pick it when the point is disciplined projecting, not collecting tries.",
      sources: expansionSourcePacks["margalef-spain"],
      editorialTips: ["More attempts are not automatically better attempts.", "Track what changes between tries."]
    }),
    routeAddition({
      id: "victima-perfecta-margalef",
      name: "Victima Perfecta",
      grade: "9a",
      type: "sport",
      length: "single-pitch sport route",
      style: "Hard Margalef pocket climbing with precise project demands.",
      summary: "Victima Perfecta is another hard pocket card for comparing style, not for pretending all 9a routes ask the same question.",
      practiceFocus: ["finger precision", "power endurance", "process notes"],
      bestFor: "Climbers studying differences between Margalef hard-route personalities.",
      personalityTags: ["Pocket precision", "Hard-route study", "Project brain"],
      decisionHint: "Choose it when you want the route list to distinguish subtle hard-route styles.",
      sources: expansionSourcePacks["margalef-spain"],
      editorialTips: ["Similar grades can feel like very different problems.", "Keep the comparison about style, not ego."]
    }),
    routeAddition({
      id: "aitzol-margalef",
      name: "Aitzol",
      grade: "8c",
      type: "sport",
      length: "single-pitch sport route",
      style: "Hard but more approachable Margalef pocket climbing.",
      summary: "Aitzol is a useful bridge card for climbers who want Margalef pocket intensity without only chasing the 9a-and-up storyline.",
      practiceFocus: ["pocket technique", "power endurance", "skin management"],
      bestFor: "Strong sport climbers looking for a practical hard Margalef objective.",
      personalityTags: ["Bridge project", "Pocket lesson", "Trip useful"],
      decisionHint: "Pick it when you want a serious pocket route that still feels like a training bridge.",
      sources: expansionSourcePacks["margalef-spain"],
      editorialTips: ["Bridge projects make weaknesses easier to name.", "Protect skin before ambition spends it all."]
    })
  ],
  "grampians-australia": [
    routeAddition({
      id: "ammagamma-grampians",
      name: "Ammagamma",
      grade: "8B / V13",
      type: "boulder",
      length: "boulder problem",
      style: "Classic Grampians sandstone bouldering with powerful compression character.",
      summary: "Ammagamma is a compact hard-bouldering card: famous enough to inspire, specific enough to make training questions clearer.",
      practiceFocus: ["compression power", "body tension", "quality attempts"],
      bestFor: "Boulderers comparing iconic Grampians problems below the absolute hardest links.",
      personalityTags: ["Compression classic", "Sandstone power", "Boulder benchmark"],
      decisionHint: "Pick it when one problem should make your session sharper.",
      sources: expansionSourcePacks["grampians-australia"],
      editorialTips: ["Hard boulders reward fewer cleaner attempts.", "Check current access context before turning inspiration into plans."]
    }),
    routeAddition({
      id: "on-the-beach-grampians",
      name: "On the Beach",
      grade: "8B / V13",
      type: "boulder",
      length: "boulder problem",
      style: "Hard Grampians sandstone bouldering with classic cave energy.",
      summary: "On the Beach is useful for route finding because it represents the Grampians as more than one mega-link story.",
      practiceFocus: ["cave movement", "power endurance", "skin management"],
      bestFor: "Strong boulderers building a Grampians cave-style shortlist.",
      personalityTags: ["Cave power", "Sandstone classic", "Session focus"],
      decisionHint: "Choose it when you want cave intensity without making the day only about the longest link.",
      sources: expansionSourcePacks["grampians-australia"],
      editorialTips: ["Cave bouldering is often a pacing problem wearing a power costume.", "Use current access resources first."]
    }),
    routeAddition({
      id: "who-is-a-naughty-boy-grampians",
      name: "Who's a Naughty Boy",
      grade: "8A+ / V12",
      type: "boulder",
      length: "boulder problem",
      style: "Grampians sandstone bouldering with playful name and serious movement.",
      summary: "Who's a Naughty Boy gives the Grampians list a slightly friendlier hard-bouldering card, which is helpful for real trip decisions.",
      practiceFocus: ["movement reading", "body tension", "attempt discipline"],
      bestFor: "Boulderers wanting hard sandstone movement without jumping straight to V15 references.",
      personalityTags: ["Playful name", "Hard movement", "Trip useful"],
      decisionHint: "Pick it when the goal is hard climbing with room to learn.",
      sources: expansionSourcePacks["grampians-australia"],
      editorialTips: ["Funny names do not make hard boulders casual.", "Let the route teach movement before the grade teaches pressure."]
    }),
    routeAddition({
      id: "passport-to-insanity-grampians",
      name: "Passport to Insanity",
      grade: "8A / V11",
      type: "boulder",
      length: "boulder problem",
      style: "Classic Grampians bouldering with useful hard-but-not-elite decision value.",
      summary: "Passport to Insanity is a good bridge card for climbers who want Grampians sandstone intensity at a more practical hard level.",
      practiceFocus: ["hard boulder tactics", "skin pacing", "confidence building"],
      bestFor: "Boulderers building toward harder Grampians objectives.",
      personalityTags: ["Bridge boulder", "Sandstone lesson", "Confidence hard"],
      decisionHint: "Choose it when the day should build toward harder projects without becoming a fantasy list.",
      sources: expansionSourcePacks["grampians-australia"],
      editorialTips: ["Bridge problems are where useful habits become visible.", "Keep access checks and conditions in the plan."]
    })
  ]
,
  "yangshuo-china": [
    routeAddition({ id: "moon-hill-route-line-yangshuo", name: "Moon Hill route line", grade: "5.8-5.13 metadata", type: "sport", length: "single-pitch and short-route metadata", style: "Karst limestone climbing linked to Yangshuo's most recognizable arch landmark.", summary: "A conservative Moon Hill route-line card for choosing Yangshuo style without pretending to publish route beta.", practiceFocus: ["limestone movement", "travel-day judgment", "route selection"], bestFor: "Climbers orienting around Yangshuo's landmark limestone style.", personalityTags: ["Karst classic", "Travel route", "Style sampler"], decisionHint: "Pick it when the day should feel like classic Yangshuo limestone discovery.", sources: expansionSourcePacks["yangshuo-china"], editorialTips: ["Use this as orientation, not exact route instruction.", "Check current local resources before choosing a specific line."] }),
    routeAddition({ id: "low-mountain-route-line-yangshuo", name: "Low Mountain route line", grade: "5.8-5.12 metadata", type: "sport", length: "single-pitch metadata", style: "Approachable Yangshuo limestone route-line context for lighter days.", summary: "Low Mountain helps the route finder recommend a more practical Yangshuo day when the goal is mileage, not drama.", practiceFocus: ["confidence mileage", "limestone footwork", "shade planning"], bestFor: "Climbers wanting a friendlier Yangshuo style card.", personalityTags: ["Confidence mileage", "Karst lesson", "Travel-day useful"], decisionHint: "Choose it when the day should build rhythm before ambition.", sources: expansionSourcePacks["yangshuo-china"], editorialTips: ["Friendly route-line cards still need current local checks.", "Use easier limestone to learn body position and pacing."] }),
    routeAddition({ id: "twin-gates-route-line-yangshuo", name: "Twin Gates route line", grade: "5.10-5.13 metadata", type: "sport", length: "single-pitch metadata", style: "Yangshuo limestone climbing with a slightly harder project mood.", summary: "Twin Gates is a route-line card for climbers who want Yangshuo recommendations to include sharper sport-climbing intent.", practiceFocus: ["power endurance", "route reading", "attempt quality"], bestFor: "Sport climbers looking for a more focused Yangshuo objective direction.", personalityTags: ["Project mood", "Limestone focus", "Harder day"], decisionHint: "Pick it when you want the recommendation to feel more like a sport project than a sightseeing climb.", sources: expansionSourcePacks["yangshuo-china"], editorialTips: ["Keep project notes personal and non-beta.", "Do not let travel energy replace warm-up discipline."] }),
    routeAddition({ id: "wine-bottle-cliff-route-line-yangshuo", name: "Wine Bottle Cliff route line", grade: "5.7-5.12 metadata", type: "sport", length: "single-pitch metadata", style: "Yangshuo limestone route-line context with broad grade range and trip-planning value.", summary: "Wine Bottle Cliff gives the Yangshuo page another practical route-line option for mixed-ability days.", practiceFocus: ["group planning", "limestone basics", "movement variety"], bestFor: "Groups comparing Yangshuo crag options without needing a hard-project day.", personalityTags: ["Group friendly", "Style sampler", "Travel useful"], decisionHint: "Choose it when the day needs range and flexibility.", sources: expansionSourcePacks["yangshuo-china"], editorialTips: ["Route-line cards are for choosing direction, not replacing a local guide.", "Match the exact route to the group only after checking current resources."] })
  ],
  "liming-china": [
    routeAddition({ id: "dinner-wall-route-line-liming", name: "Dinner Wall route line", grade: "5.9-5.12 metadata", type: "trad", length: "single-pitch to short multi-pitch metadata", style: "Liming sandstone crack climbing with practical mileage character.", summary: "Dinner Wall is a conservative route-line card for climbers who want Liming to surface as a crack-practice destination.", practiceFocus: ["crack mileage", "gear-system habits", "footwork"], bestFor: "Trad climbers building sandstone crack familiarity.", personalityTags: ["Crack classroom", "Mileage day", "Sandstone lesson"], decisionHint: "Pick it when the day should make crack systems feel less mysterious.", sources: expansionSourcePacks["liming-china"], editorialTips: ["This is a route-line metadata card, not a protection guide.", "Use verified local resources before choosing an exact route."] }),
    routeAddition({ id: "guardian-wall-route-line-liming", name: "Guardian Wall route line", grade: "5.10-5.12 metadata", type: "trad", length: "single-pitch and multi-pitch metadata", style: "Steeper Liming sandstone crack context with adventure flavor.", summary: "Guardian Wall gives the Liming list a more focused adventure card while staying honest about source limits.", practiceFocus: ["trad composure", "crack technique", "team communication"], bestFor: "Climbers comparing Liming objectives with more commitment.", personalityTags: ["Adventure crack", "Team systems", "Sandstone focus"], decisionHint: "Choose it when you want a crack day with more edge and more organization.", sources: expansionSourcePacks["liming-china"], editorialTips: ["Do not infer route logistics from this card.", "Adventure routes need local updates, not just enthusiasm."] }),
    routeAddition({ id: "pine-crest-route-line-liming", name: "Pine Crest route line", grade: "5.9-5.12 metadata", type: "trad", length: "route-line metadata", style: "Liming sandstone crack and face context for technique-focused days.", summary: "Pine Crest is a style sampler for climbers who want to compare Liming movement types without a hard-grade headline.", practiceFocus: ["movement variety", "crack-to-face transitions", "calm systems"], bestFor: "Climbers wanting a balanced Liming decision card.", personalityTags: ["Style sampler", "Technique day", "Calm systems"], decisionHint: "Pick it when the goal is learning the area rather than proving a number.", sources: expansionSourcePacks["liming-china"], editorialTips: ["Keep metadata cards short until stronger route-specific sources are added.", "Use simpler lines to tune systems first."] }),
    routeAddition({ id: "great-arch-route-line-liming", name: "Great Arch route line", grade: "5.10-5.13 metadata", type: "multi-pitch", length: "longer route-line metadata", style: "Larger Liming sandstone objective context with big-feature mood.", summary: "Great Arch is included as an aspirational route-line card for the climber who wants Liming to feel more like an expedition day.", practiceFocus: ["route planning", "multi-pitch rhythm", "exposure comfort"], bestFor: "Experienced teams comparing bigger Liming objectives.", personalityTags: ["Expedition mood", "Big feature", "Team rhythm"], decisionHint: "Choose it only when systems and current local information feel aligned.", sources: expansionSourcePacks["liming-china"], editorialTips: ["Treat this as directional inspiration until stronger sources are added.", "Do not use this card as approach, descent, or protection information."] })
  ],
  "long-dong-taiwan": [
    routeAddition({ id: "dragon-gate-route-line-long-dong", name: "Dragon Gate route line", grade: "5.8-5.12 metadata", type: "trad", length: "single-pitch metadata", style: "Seaside sandstone route-line context with Long Dong exposure and texture.", summary: "Dragon Gate gives Long Dong another sector-style choice card for climbers comparing sea-cliff moods.", practiceFocus: ["sandstone footwork", "sea-cliff judgment", "confidence"], bestFor: "Climbers orienting around Long Dong's sector-based climbing.", personalityTags: ["Sea-cliff style", "Sector card", "Confidence route"], decisionHint: "Pick it when the day should feel scenic but still measured.", sources: expansionSourcePacks["long-dong-taiwan"], editorialTips: ["Sector cards are not exact route instructions.", "Check weather, access, and current local guidance before climbing."] }),
    routeAddition({ id: "big-wall-route-line-long-dong", name: "Big Wall route line", grade: "5.10-5.12 metadata", type: "trad", length: "single-pitch to longer metadata", style: "Long Dong sandstone with larger sea-cliff position and stronger commitment feel.", summary: "Big Wall is a higher-commitment route-line card for climbers who want the recommendation to include exposure and planning.", practiceFocus: ["exposure comfort", "trad systems", "route judgment"], bestFor: "Experienced climbers comparing more committing Long Dong sectors.", personalityTags: ["Exposure card", "Trad systems", "Sea-cliff focus"], decisionHint: "Choose it when the sea-cliff position is part of the goal.", sources: expansionSourcePacks["long-dong-taiwan"], editorialTips: ["Do not turn sector metadata into route beta.", "Conditions matter more than the mood of the photo."] }),
    routeAddition({ id: "first-tower-route-line-long-dong", name: "First Tower route line", grade: "5.8-5.11 metadata", type: "sport", length: "single-pitch metadata", style: "Long Dong tower-style sandstone context with approachable route-choice value.", summary: "First Tower rounds out the Long Dong list with a friendlier sector-style option.", practiceFocus: ["confidence mileage", "movement reading", "sandstone basics"], bestFor: "Climbers wanting a lower-pressure Long Dong direction card.", personalityTags: ["First-visit useful", "Sandstone lesson", "Confidence mileage"], decisionHint: "Pick it when the day should teach the rock before testing the ego.", sources: expansionSourcePacks["long-dong-taiwan"], editorialTips: ["Use approachable cards to learn style, not to skip local research.", "Keep exact route choice current and local."] }),
    routeAddition({ id: "second-tower-route-line-long-dong", name: "Second Tower route line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch metadata", style: "Long Dong sandstone sector context with slightly sharper sport-climbing mood.", summary: "Second Tower gives route finder a more focused sport-style Long Dong recommendation without publishing beta.", practiceFocus: ["sport movement", "sea-cliff conditions", "attempt quality"], bestFor: "Sport climbers comparing Long Dong sector options.", personalityTags: ["Sport focus", "Sea-cliff card", "Style sampler"], decisionHint: "Choose it when you want Long Dong with a little more sport-project flavor.", sources: expansionSourcePacks["long-dong-taiwan"], editorialTips: ["Humidity and wind can change the day quickly.", "Keep this as a decision prompt, not a route plan."] })
  ],
  "railay-tonsai-thailand": [
    routeAddition({ id: "thaiwand-wall-route-line-railay-tonsai", name: "Thaiwand Wall route line", grade: "6a-7c metadata", type: "multi-pitch", length: "single-pitch to multi-pitch metadata", style: "Sea-view limestone route-line context with classic Railay adventure mood.", summary: "Thaiwand Wall helps the route finder recommend Railay/Tonsai when the user wants limestone, exposure, and beach-day logistics in one card.", practiceFocus: ["limestone systems", "exposure comfort", "humid-day pacing"], bestFor: "Teams comparing scenic Railay/Tonsai objectives.", personalityTags: ["Sea-view adventure", "Limestone systems", "Travel classic"], decisionHint: "Pick it when the day should feel like tropical climbing, not only sport mileage.", sources: expansionSourcePacks["railay-tonsai-thailand"], editorialTips: ["Use current local resources for exact route choice and conditions.", "Humidity changes the feel of even familiar grades."] }),
    routeAddition({ id: "dums-kitchen-route-line-railay-tonsai", name: "Dum's Kitchen route line", grade: "6a-7b metadata", type: "sport", length: "single-pitch metadata", style: "Friendly Railay limestone context with travel-day usefulness.", summary: "Dum's Kitchen is a practical route-line card for climbers who want a lighter day with real movement value.", practiceFocus: ["confidence mileage", "limestone basics", "shade planning"], bestFor: "Climbers looking for a more approachable Railay/Tonsai option.", personalityTags: ["Friendly limestone", "Travel-day useful", "Confidence mileage"], decisionHint: "Choose it when the day should stay fun and flexible.", sources: expansionSourcePacks["railay-tonsai-thailand"], editorialTips: ["Friendly routes still deserve warm-up discipline.", "Check local updates before trusting old memories."] }),
    routeAddition({ id: "fire-wall-route-line-railay-tonsai", name: "Fire Wall route line", grade: "6b-8a metadata", type: "sport", length: "single-pitch metadata", style: "Steeper Railay/Tonsai limestone context with more project energy.", summary: "Fire Wall gives the page a sharper sport-climbing card for climbers who want Thailand to feel less like a rest day.", practiceFocus: ["steep endurance", "rest timing", "try management"], bestFor: "Sport climbers looking for a harder tropical limestone direction.", personalityTags: ["Steep limestone", "Project mood", "Humid pump"], decisionHint: "Pick it when the beach is nearby but the climbing should still feel focused.", sources: expansionSourcePacks["railay-tonsai-thailand"], editorialTips: ["Do not let vacation mode erase pacing.", "Shade and humidity are part of the route decision."] }),
    routeAddition({ id: "escher-world-route-line-railay-tonsai", name: "Escher World route line", grade: "6a-7c metadata", type: "sport", length: "single-pitch metadata", style: "Railay/Tonsai limestone route-line context with playful movement identity.", summary: "Escher World is a style-sampler card for users who want fun movement without turning the page into a copied guidebook.", practiceFocus: ["movement variety", "limestone reading", "efficient climbing"], bestFor: "Climbers wanting a playful Railay/Tonsai route-choice direction.", personalityTags: ["Movement puzzle", "Style sampler", "Tropical sport"], decisionHint: "Choose it when the day should feel creative rather than maximal.", sources: expansionSourcePacks["railay-tonsai-thailand"], editorialTips: ["Keep playful climbing attentive.", "Exact route choices belong in current local resources."] })
  ],
  "rocklands-south-africa": [
    routeAddition({ id: "rubiks-cube-rocklands", name: "Rubik's Cube", grade: "classic boulder metadata", type: "boulder", length: "boulder problem", style: "Rocklands sandstone bouldering with puzzle-like movement identity.", summary: "Rubik's Cube is a route-choice card for climbers who want Rocklands to feel like a movement problem, not only a grade chase.", practiceFocus: ["movement sequencing", "body tension", "attempt quality"], bestFor: "Boulderers looking for classic Rocklands movement puzzles.", personalityTags: ["Movement puzzle", "Sandstone classic", "Session focus"], decisionHint: "Pick it when problem-solving sounds better than simply trying hard.", sources: expansionSourcePacks["rocklands-south-africa"], editorialTips: ["Classic boulders deserve current access and condition checks.", "Keep sequence notes personal; ClimbAtlas does not publish beta."] }),
    routeAddition({ id: "orange-plasma-rocklands", name: "Orange Plasma", grade: "classic boulder metadata", type: "boulder", length: "boulder problem", style: "Rocklands sandstone bouldering with striking visual and movement character.", summary: "Orange Plasma helps the Rocklands list show the area's colorful classic-boulder side, not just the hardest testpieces.", practiceFocus: ["skin pacing", "movement reading", "quality attempts"], bestFor: "Boulderers comparing memorable Rocklands classics below the elite headline level.", personalityTags: ["Visual classic", "Sandstone style", "Trip useful"], decisionHint: "Choose it when you want the day to feel iconic without becoming only about grade.", sources: expansionSourcePacks["rocklands-south-africa"], editorialTips: ["Sandstone rewards patience and skin budgeting.", "Check current access before making plans."] }),
    routeAddition({ id: "ceder-rouge-rocklands", name: "Ceder Rouge", grade: "classic boulder metadata", type: "boulder", length: "boulder problem", style: "Rocklands sandstone boulder with classic circuit value.", summary: "Ceder Rouge is a useful route-finder card for mileage days that still want a named classic in the mix.", practiceFocus: ["confidence mileage", "sandstone footwork", "session planning"], bestFor: "Boulderers balancing famous problems with sustainable mileage.", personalityTags: ["Circuit classic", "Mileage day", "Skin-smart"], decisionHint: "Pick it when the best choice is the one you can enjoy and recover from.", sources: expansionSourcePacks["rocklands-south-africa"], editorialTips: ["Mileage is useful only if it leaves tomorrow possible.", "Choose quality over exhausting the skin bank."] }),
    routeAddition({ id: "cattle-rustler-rocklands", name: "Cattle Rustler", grade: "classic boulder metadata", type: "boulder", length: "boulder problem", style: "Rocklands sandstone boulder with old-west name and practical trip-list value.", summary: "Cattle Rustler gives the Rocklands page a lighter classic card so the destination does not read like only a V15 museum.", practiceFocus: ["movement variety", "confidence", "skin management"], bestFor: "Boulderers building a more balanced Rocklands ticklist.", personalityTags: ["Balanced classic", "Trip list", "Sandstone lesson"], decisionHint: "Choose it when you want a good day, not just a loud number.", sources: expansionSourcePacks["rocklands-south-africa"], editorialTips: ["A balanced list often makes a better trip than a trophy list.", "Respect conditions, access, and skin before adding volume."] })
  ]
};

type V2SourcePack = {
  databaseLabel: string;
  databaseUrl: string;
  contextLabel: string;
  contextUrl: string;
  contextType: RouteHighlight["sources"][number]["type"];
};

const v2SourcePacks: Record<string, V2SourcePack> = {
  "yosemite-usa": {
    databaseLabel: "Mountain Project: Yosemite metadata",
    databaseUrl: "https://www.mountainproject.com/area/105833388/yosemite-national-park",
    contextLabel: "Yosemite National Park: climbing information",
    contextUrl: "https://www.nps.gov/yose/planyourvisit/climbing.htm",
    contextType: "official"
  },
  "red-river-gorge-usa": {
    databaseLabel: "Mountain Project: Red River Gorge metadata",
    databaseUrl: "https://www.mountainproject.com/area/105841134/red-river-gorge",
    contextLabel: "Red River Gorge Climbers' Coalition",
    contextUrl: "https://rrgcc.org/",
    contextType: "official"
  },
  "squamish-canada": {
    databaseLabel: "Mountain Project: Squamish metadata",
    databaseUrl: "https://www.mountainproject.com/area/105798167/squamish",
    contextLabel: "Stawamus Chief Provincial Park",
    contextUrl: "https://bcparks.ca/stawamus-chief-park/",
    contextType: "official"
  },
  "fontainebleau-france": {
    databaseLabel: "bleau.info route metadata",
    databaseUrl: "https://bleau.info/",
    contextLabel: "Wikipedia: Fontainebleau rock climbing",
    contextUrl: "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
    contextType: "open-encyclopedia"
  },
  "kalymnos-greece": {
    databaseLabel: "TheCrag: Kalymnos metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/greece/kalymnos",
    contextLabel: "Kalymnos Climbing Guidebook",
    contextUrl: "https://climbkalymnos.com/guidebook/",
    contextType: "official"
  },
  "chamonix-france": {
    databaseLabel: "Camptocamp: Chamonix / Mont Blanc metadata",
    databaseUrl: "https://www.camptocamp.org/",
    contextLabel: "Chamonix official visitor information",
    contextUrl: "https://www.chamonix.com/",
    contextType: "official"
  },
  "ceuse-france": {
    databaseLabel: "Mountain Project: Ceuse metadata",
    databaseUrl: "https://www.mountainproject.com/area/106334422/ceuse",
    contextLabel: "Wikipedia: Ceuse",
    contextUrl: "https://en.wikipedia.org/wiki/C%C3%A9%C3%BCse",
    contextType: "open-encyclopedia"
  },
  "dolomites-italy": {
    databaseLabel: "theCrag: Dolomites metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/italy/dolomites",
    contextLabel: "UNESCO: The Dolomites",
    contextUrl: "https://whc.unesco.org/en/list/1237/",
    contextType: "official"
  },
  "frankenjura-germany": {
    databaseLabel: "Frankenjura.com route metadata",
    databaseUrl: "https://www.frankenjura.com/klettern/",
    contextLabel: "Wikipedia: Frankenjura",
    contextUrl: "https://en.wikipedia.org/wiki/Franconian_Jura",
    contextType: "open-encyclopedia"
  },
  "siurana-spain": {
    databaseLabel: "theCrag: Siurana metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/spain/siurana",
    contextLabel: "Wikipedia: Siurana",
    contextUrl: "https://en.wikipedia.org/wiki/Siurana_%28Tarragona%29",
    contextType: "open-encyclopedia"
  },
  "margalef-spain": {
    databaseLabel: "theCrag: Margalef metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/spain/margalef",
    contextLabel: "Wikipedia IT: Margalef climbing",
    contextUrl: "https://it.wikipedia.org/wiki/Margalef",
    contextType: "open-encyclopedia"
  },
  "yangshuo-china": {
    databaseLabel: "Mountain Project: Yangshuo metadata",
    databaseUrl: "https://www.mountainproject.com/area/106763709/yangshuo",
    contextLabel: "Wikipedia: Moon Hill",
    contextUrl: "https://en.wikipedia.org/wiki/Moon_Hill",
    contextType: "open-encyclopedia"
  },
  "liming-china": {
    databaseLabel: "Mountain Project: Liming metadata",
    databaseUrl: "https://www.mountainproject.com/area/108397346/liming",
    contextLabel: "Wikipedia: Three Parallel Rivers of Yunnan Protected Areas",
    contextUrl: "https://en.wikipedia.org/wiki/Three_Parallel_Rivers_of_Yunnan_Protected_Areas",
    contextType: "open-encyclopedia"
  },
  "long-dong-taiwan": {
    databaseLabel: "theCrag: Long Dong metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/taiwan/longdong",
    contextLabel: "Wikipedia ZH: Long Dong climbing area",
    contextUrl: "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
    contextType: "open-encyclopedia"
  },
  "railay-tonsai-thailand": {
    databaseLabel: "theCrag: Railay / Tonsai metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/thailand/krabi/area/13949881",
    contextLabel: "Wikipedia: Railay Beach",
    contextUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
    contextType: "open-encyclopedia"
  },
  "joshua-tree-usa": {
    databaseLabel: "Mountain Project: Joshua Tree metadata",
    databaseUrl: "https://www.mountainproject.com/area/105720495/joshua-tree-national-park",
    contextLabel: "Joshua Tree National Park: rock climbing",
    contextUrl: "https://www.nps.gov/jotr/planyourvisit/climbing.htm",
    contextType: "official"
  },
  "smith-rock-usa": {
    databaseLabel: "Mountain Project: Smith Rock metadata",
    databaseUrl: "https://www.mountainproject.com/area/105788989/smith-rock",
    contextLabel: "Wikipedia: Smith Rock State Park",
    contextUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
    contextType: "open-encyclopedia"
  },
  "el-potrero-chico-mexico": {
    databaseLabel: "Mountain Project: El Potrero Chico metadata",
    databaseUrl: "https://www.mountainproject.com/area/105910764/el-potrero-chico",
    contextLabel: "Wikipedia: Potrero Chico",
    contextUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
    contextType: "open-encyclopedia"
  },
  "grampians-australia": {
    databaseLabel: "theCrag: Grampians metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/australia/grampians",
    contextLabel: "Wikipedia: The Wheel of Life",
    contextUrl: "https://en.wikipedia.org/wiki/The_Wheel_of_Life",
    contextType: "open-encyclopedia"
  },
  "rocklands-south-africa": {
    databaseLabel: "theCrag: Rocklands metadata",
    databaseUrl: "https://www.thecrag.com/en/climbing/south-africa/rocklands",
    contextLabel: "Wikipedia FR: Rocklands",
    contextUrl: "https://fr.wikipedia.org/wiki/Rocklands",
    contextType: "open-encyclopedia"
  }
};

function v2ImportedRoute(input: {
  sourcePack: V2SourcePack;
  id: string;
  name: string;
  grade: string;
  type: RouteHighlight["type"];
  length: string;
  style: string;
  summary: string;
  practiceFocus: string[];
  bestFor: string;
  personalityTags: string[];
  decisionHint: string;
  editorialTips?: string[];
}): RouteHighlight {
  return routeAddition({
    id: input.id,
    name: input.name,
    grade: input.grade,
    type: input.type,
    length: input.length,
    style: input.style,
    summary: input.summary,
    practiceFocus: input.practiceFocus,
    bestFor: input.bestFor,
    personalityTags: input.personalityTags,
    decisionHint: input.decisionHint,
    sources: [
      source(
        `${input.sourcePack.databaseLabel}: ${input.name}`,
        input.sourcePack.databaseUrl,
        "route-database-metadata",
        "medium",
        ["name", "grade", "type", "area"],
        "V2 manual metadata import. ClimbAtlas uses only basic facts and does not copy route descriptions, beta, comments, ratings, or photos."
      ),
      source(
        input.sourcePack.contextLabel,
        input.sourcePack.contextUrl,
        input.sourcePack.contextType,
        input.sourcePack.contextType === "official" ? "high" : "medium",
        ["area context", "access context"],
        "Context source for destination, access, or history. Use current external resources for detailed planning."
      )
    ],
    externalResources: [
      {
        title: `${input.sourcePack.databaseLabel}: ${input.name}`,
        url: input.sourcePack.databaseUrl,
        type: "route-database",
        linkStatus: "needs-upgrade",
        description: {
          en: "External metadata entry point. Use the original site for current route pages, local updates, and detailed beta.",
          zh: "外部元数据入口。请到原站查看最新路线页面、本地更新和具体 beta。"
        }
      },
      {
        title: input.sourcePack.contextLabel,
        url: input.sourcePack.contextUrl,
        type: input.sourcePack.contextType === "official" ? "official" : "history/article",
        description: {
          en: "Context and planning link. ClimbAtlas links out instead of copying guidebook-style content.",
          zh: "背景和规划链接。ClimbAtlas 只做导流，不复制路书式内容。"
        }
      }
    ],
    editorialTips:
      input.editorialTips ??
      [
        "Use this card to decide direction, then check current external resources before choosing exact beta.",
        "Good route choice starts with style, conditions, and honest readiness."
      ]
  });
}

const v2PopularRouteAdditions: Record<string, RouteHighlight[]> = {
  "yosemite-usa": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "serenity-crack-yosemite", name: "Serenity Crack", grade: "5.10d", type: "trad", length: "about 3 pitches", style: "Polished Yosemite crack craft with a very honest footwork bill.", summary: "Serenity Crack is for days when you want a compact classic that still asks you to climb neatly. It is famous enough to matter and short enough to keep the lesson focused.", practiceFocus: ["crack footwork", "polished granite", "calm pacing"], bestFor: "Trad climbers wanting a focused Yosemite crack classroom.", personalityTags: ["Crack classroom", "Polished granite", "Classic focus"], decisionHint: "Choose it when you want technique feedback without committing to a huge wall day." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "sons-of-yesterday-yosemite", name: "Sons of Yesterday", grade: "5.10a", type: "multi-pitch", length: "about 5 pitches", style: "Flowy Yosemite granite mileage with friendly classic energy.", summary: "Sons of Yesterday is a good pick when the day wants rhythm more than drama. It pairs well with climbers who like moving efficiently and staying cheerful.", practiceFocus: ["multi-pitch flow", "transition rhythm", "granite confidence"], bestFor: "Teams wanting classic mileage with a lighter emotional footprint.", personalityTags: ["Flow day", "Classic mileage", "Team rhythm"], decisionHint: "Pick it when you want a beautiful granite day that teaches efficiency." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "nutcracker-yosemite", name: "Nutcracker", grade: "5.8", type: "multi-pitch", length: "about 5 pitches", style: "Historic moderate Yosemite trad with a beginner-to-classic bridge feel.", summary: "Nutcracker is useful because it gives newer Yosemite trad climbers a real classic to measure systems against without pretending the Valley is casual.", practiceFocus: ["trad basics", "team systems", "moderate composure"], bestFor: "Climbers building confidence on Yosemite classics.", personalityTags: ["Moderate classic", "Trad basics", "History card"], decisionHint: "Choose it when you want a real Yosemite lesson at a friendlier grade." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "commitment-yosemite", name: "Commitment", grade: "5.9", type: "multi-pitch", length: "about 3 pitches", style: "Shorter Yosemite multi-pitch with a name that tells the truth.", summary: "Commitment is a compact card for teams who want to practice being organized before the day grows teeth.", practiceFocus: ["team communication", "route pacing", "moderate granite"], bestFor: "Teams sharpening multi-pitch habits before bigger objectives.", personalityTags: ["Compact lesson", "Team habits", "Granite practice"], decisionHint: "Pick it when you want the route to test organization more than raw difficulty." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "central-pillar-of-frenzy-yosemite", name: "Central Pillar of Frenzy", grade: "5.9", type: "multi-pitch", length: "about 5 pitches", style: "Beloved Cathedral granite with enough variety to expose habits.", summary: "Central Pillar of Frenzy is a strong route-finder card because it feels classic without requiring mythic scale. It is a good teacher of pacing and variety.", practiceFocus: ["varied cracks", "pitch pacing", "partner rhythm"], bestFor: "Trad teams wanting classic Yosemite variety.", personalityTags: ["Variety teacher", "Cathedral classic", "Team rhythm"], decisionHint: "Choose it when you want a substantial classic that still fits a learning day." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "higher-cathedral-spire-regular-route-yosemite", name: "Higher Cathedral Spire Regular Route", grade: "5.9", type: "multi-pitch", length: "about 5 pitches", style: "Old-school Yosemite spire climbing with position and tradition.", summary: "Higher Cathedral Spire adds a tower-like mood to the Yosemite list. It is for teams who want history, exposure, and a route that feels like an occasion.", practiceFocus: ["exposure comfort", "old-school movement", "team planning"], bestFor: "Teams wanting a memorable spire objective.", personalityTags: ["Spire objective", "Old-school feel", "Exposure day"], decisionHint: "Pick it when position and history are part of the motivation." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "moby-dick-yosemite", name: "Moby Dick", grade: "5.10a", type: "trad", length: "1 pitch", style: "Single-pitch Yosemite crack climbing with benchmark value.", summary: "Moby Dick is a useful short card for checking whether your crack systems are tidy or just optimistic.", practiceFocus: ["hand crack rhythm", "single-pitch focus", "foot trust"], bestFor: "Trad climbers wanting a compact crack benchmark.", personalityTags: ["Crack benchmark", "Short focus", "Granite basics"], decisionHint: "Choose it when one pitch should give clear feedback." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "reeds-pinnacle-direct-yosemite", name: "Reed's Pinnacle Direct", grade: "5.10a", type: "trad", length: "about 3 pitches", style: "Yosemite crack progression with a compact serious feel.", summary: "Reed's Pinnacle Direct belongs in the list as a crack progression card: not a huge day, but not a throwaway either.", practiceFocus: ["crack progression", "efficiency", "granite trust"], bestFor: "Climbers building toward harder Yosemite crack routes.", personalityTags: ["Progression card", "Crack craft", "Compact serious"], decisionHint: "Pick it when you want a crack day that feels like training with scenery." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "generator-crack-yosemite", name: "Generator Crack", grade: "5.10c", type: "trad", length: "1 pitch", style: "Physical Yosemite wide-crack benchmark with no interest in flattery.", summary: "Generator Crack is a personality test disguised as a route card. It is useful when you want to learn whether wide-crack practice is actually in the plan.", practiceFocus: ["wide crack movement", "body tension", "humility"], bestFor: "Climbers intentionally practicing physical wide-crack technique.", personalityTags: ["Wide crack", "Physical lesson", "Humility card"], decisionHint: "Choose it when awkward technique is the training goal, not the surprise." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "twilight-zone-yosemite", name: "Twilight Zone", grade: "5.10d", type: "trad", length: "1 pitch", style: "Old-school wide crack with a reputation for character.", summary: "Twilight Zone is for climbers who want the route to be a craft question, not a grade-shopping errand.", practiceFocus: ["wide technique", "mental composure", "body craft"], bestFor: "Experienced trad climbers seeking old-school Yosemite style.", personalityTags: ["Old-school wide", "Character route", "Craft test"], decisionHint: "Pick it when you actively want the weirdness to be the point." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "tales-of-power-yosemite", name: "Tales of Power", grade: "5.12b", type: "trad", length: "1 pitch", style: "Hard Yosemite crack climbing with compact legend energy.", summary: "Tales of Power is a short, hard inspiration card. It is best used to sharpen training direction before it becomes an actual trip goal.", practiceFocus: ["hard crack precision", "finger strength", "attempt quality"], bestFor: "Strong trad climbers studying harder Yosemite crack references.", personalityTags: ["Hard crack", "Legend spark", "Aspirational"], decisionHint: "Choose it as a compass when hard crack performance is the long-term question." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "after-six-yosemite", name: "After Six", grade: "5.7", type: "multi-pitch", length: "about 6 pitches", style: "Approachable Yosemite multi-pitch with classic first-visit usefulness.", summary: "After Six is a friendly route-finder card for teams who need confidence mileage and a real Yosemite setting.", practiceFocus: ["confidence mileage", "team transitions", "granite basics"], bestFor: "Climbers easing into longer Yosemite classics.", personalityTags: ["Friendly classic", "First-visit useful", "Team basics"], decisionHint: "Pick it when the day should make the team steadier." })
  ],
  "red-river-gorge-usa": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "table-of-colors-red-river-gorge", name: "Table of Colors", grade: "5.13a", type: "sport", length: "single-pitch sport route", style: "Steep Red River endurance with memorable project energy.", summary: "Table of Colors is for climbers who want the Red to feel vivid, pumpy, and specific. It is a project card, not casual mileage.", practiceFocus: ["power endurance", "rest timing", "redpoint patience"], bestFor: "Sport climbers building a serious Red River project list.", personalityTags: ["Endurance project", "Steep sandstone", "Redpoint brain"], decisionHint: "Choose it when the day should organize training around sustained effort." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "kaleidoscope-red-river-gorge", name: "Kaleidoscope", grade: "5.13c", type: "sport", length: "single-pitch sport route", style: "Hard Red River sport climbing with colorful benchmark status.", summary: "Kaleidoscope belongs in ClimbAtlas as a high-end reference: bright name, serious pump, and very little room for vague goals.", practiceFocus: ["project tactics", "precision under fatigue", "attempt quality"], bestFor: "Advanced climbers comparing hard Red River objectives.", personalityTags: ["Hard benchmark", "Project tactics", "Endurance focus"], decisionHint: "Pick it when the project needs to make your training questions sharper." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "the-force-red-river-gorge", name: "The Force", grade: "5.13a", type: "sport", length: "single-pitch sport route", style: "Red River sport climbing with clean project pressure and memorable name energy.", summary: "The Force is useful as a project card because it sounds mythical but still points to a practical question: can you stay efficient while trying hard?", practiceFocus: ["power endurance", "movement economy", "redpoint tactics"], bestFor: "Sport climbers looking for a focused Red River 5.13-style goal.", personalityTags: ["Project force", "Endurance focus", "Memorable name"], decisionHint: "Choose it when motivation is high but the plan still needs discipline." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "snooker-red-river-gorge", name: "Snooker", grade: "5.13a", type: "sport", length: "single-pitch sport route", style: "Steep Red River sport climbing with tactical, game-like project value.", summary: "Snooker is a strong route-finder card for climbers who want a hard route to reward planning, pacing, and smart attempts.", practiceFocus: ["route tactics", "pump control", "attempt review"], bestFor: "Sport climbers comparing tactical Red River projects.", personalityTags: ["Tactical project", "Steep sandstone", "Attempt quality"], decisionHint: "Pick it when every attempt should answer a specific question." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "mercy-the-huff-red-river-gorge", name: "Mercy the Huff", grade: "5.12b", type: "sport", length: "single-pitch sport route", style: "Red River endurance with a friendlier hard-route bridge feel.", summary: "Mercy the Huff is useful because it sits in the bridge zone: hard enough to focus, not so hard it turns the whole trip into one route.", practiceFocus: ["endurance bridge", "breathing under pump", "efficient movement"], bestFor: "Climbers stepping into harder Red River sport routes.", personalityTags: ["Bridge route", "Pump lesson", "Trip useful"], decisionHint: "Choose it when you want a hard day that still leaves room to learn." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "paradise-lost-red-river-gorge", name: "Paradise Lost", grade: "5.13a", type: "sport", length: "single-pitch sport route", style: "Steep sport climbing with classic Red River project mood.", summary: "Paradise Lost is a good route-finder card for climbers who want the Red's cave-like intensity without losing the plot.", practiceFocus: ["steep endurance", "rest strategy", "movement economy"], bestFor: "Sport climbers selecting a focused Red River project.", personalityTags: ["Steep project", "Endurance quest", "Rest strategy"], decisionHint: "Pick it when the day should be about staying efficient while the wall gets loud." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "amarillo-sunset-red-river-gorge", name: "Amarillo Sunset", grade: "5.11b", type: "sport", length: "single-pitch sport route", style: "Approachable Red River classic with sunny endurance flavor.", summary: "Amarillo Sunset is a friendly classic card for climbers who want a memorable Red route without jumping straight into the deep project pool.", practiceFocus: ["confidence climbing", "movement flow", "pump awareness"], bestFor: "Climbers wanting a popular moderate Red River objective.", personalityTags: ["Friendly classic", "Flow day", "Confidence route"], decisionHint: "Choose it when the day should feel classic, social, and still useful." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "ro-shampo-red-river-gorge", name: "Ro Shampo", grade: "5.12a", type: "sport", length: "single-pitch sport route", style: "Popular Red River sport climbing with bridge-grade value.", summary: "Ro Shampo helps the route list speak to climbers moving from comfortable mileage into more serious pump management.", practiceFocus: ["pump management", "sequence memory", "confidence"], bestFor: "Sport climbers looking for a meaningful 5.12-style Red goal.", personalityTags: ["Bridge classic", "Pump lesson", "Sport focus"], decisionHint: "Pick it when you want a clear step-up route." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "breakfast-burrito-red-river-gorge", name: "Breakfast Burrito", grade: "5.10d", type: "sport", length: "single-pitch sport route", style: "Lower-pressure Red River sport climbing with useful mileage value.", summary: "Breakfast Burrito is a practical card for days when the best decision is to build rhythm before ordering the spicy project.", practiceFocus: ["warm-up rhythm", "confidence mileage", "movement reading"], bestFor: "Climbers wanting a friendlier Red River sport option.", personalityTags: ["Mileage snack", "Warm-up useful", "Friendly sport"], decisionHint: "Choose it when the day should start smart instead of loud." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "banshee-red-river-gorge", name: "Banshee", grade: "5.11c", type: "sport", length: "single-pitch sport route", style: "Red River sport climbing with enough bite to teach tactics.", summary: "Banshee is a useful mid-hard card when climbers want a route that asks for attention without demanding a whole-season project.", practiceFocus: ["route tactics", "pump control", "movement confidence"], bestFor: "Sport climbers building toward harder Red River routes.", personalityTags: ["Tactics card", "Mid-hard sport", "Pump practice"], decisionHint: "Pick it when you want challenge with room to adjust." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "air-ride-equipped-red-river-gorge", name: "Air-Ride Equipped", grade: "5.11a", type: "sport", length: "single-pitch sport route", style: "Classic Red River moderate with movement and mileage appeal.", summary: "Air-Ride Equipped gives the list a useful moderate sport card: fun, famous, and good for reading the area's rhythm.", practiceFocus: ["movement flow", "moderate endurance", "confidence"], bestFor: "Climbers wanting classic Red River mileage.", personalityTags: ["Moderate classic", "Flow route", "Trip useful"], decisionHint: "Choose it when the day needs quality mileage more than a headline grade." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "golden-boy-red-river-gorge", name: "Golden Boy", grade: "5.13b", type: "sport", length: "single-pitch sport route", style: "Hard Red River sport climbing with bright project identity.", summary: "Golden Boy is an aspirational Red card: useful for climbers who want their project list to include serious endurance and a little sparkle.", practiceFocus: ["project discipline", "power endurance", "attempt review"], bestFor: "Advanced sport climbers comparing high-end Red projects.", personalityTags: ["Hard project", "Endurance quest", "Aspirational"], decisionHint: "Pick it when the project should make training more honest." })
  ],
  "squamish-canada": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "calculus-crack-squamish", name: "Calculus Crack", grade: "5.8", type: "multi-pitch", length: "about 3 pitches", style: "Approachable Squamish granite with classic crack-and-slab lessons.", summary: "Calculus Crack is a good first-Squamish card: enough character to teach, friendly enough to keep the day from feeling like an exam.", practiceFocus: ["granite basics", "team transitions", "confidence"], bestFor: "Teams warming into Squamish multi-pitch climbing.", personalityTags: ["First-visit useful", "Granite classroom", "Confidence route"], decisionHint: "Choose it when the goal is learning the Chief's style without overreaching." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "angels-crest-squamish", name: "Angel's Crest", grade: "5.10c", type: "multi-pitch", length: "long multi-pitch ridge route", style: "Big-feeling Squamish adventure with skyline energy.", summary: "Angel's Crest is for teams who want the day to feel like a journey. It belongs in the list when exposure, route length, and rhythm matter.", practiceFocus: ["long-route pacing", "team rhythm", "exposure comfort"], bestFor: "Experienced teams wanting a bigger Squamish outing.", personalityTags: ["Adventure ridge", "Long day", "Team rhythm"], decisionHint: "Pick it when the objective should feel like travel, not just climbing." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "rock-on-squamish", name: "Rock On", grade: "5.10a", type: "multi-pitch", length: "about 5 pitches", style: "Squamish granite with classic moderate challenge and clean movement.", summary: "Rock On is the kind of route that makes a list more useful: not the loudest name, but a strong choice for building confident granite mileage.", practiceFocus: ["granite confidence", "pitch flow", "movement reading"], bestFor: "Climbers wanting a moderate Squamish step-up.", personalityTags: ["Step-up classic", "Granite flow", "Team practice"], decisionHint: "Choose it when you want a real route day with manageable pressure." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "vector-squamish", name: "Vector", grade: "5.9", type: "trad", length: "single-pitch crack route", style: "Compact Smoke Bluffs crack climbing with technique-first value.", summary: "Vector is a focused Squamish crack card for days when one pitch should teach a lot.", practiceFocus: ["crack rhythm", "footwork", "single-pitch focus"], bestFor: "Trad climbers tuning crack movement before bigger Chief routes.", personalityTags: ["Crack practice", "Compact lesson", "Smoke Bluffs"], decisionHint: "Pick it when the best route is a clean technical lesson." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "penny-lane-squamish", name: "Penny Lane", grade: "5.9", type: "trad", length: "single-pitch crack route", style: "Popular Squamish crack climbing with approachable benchmark energy.", summary: "Penny Lane is a useful confidence card: recognizable, compact, and good for checking whether your crack day is actually starting well.", practiceFocus: ["hand crack basics", "warm-up honesty", "foot trust"], bestFor: "Climbers wanting a friendly Squamish crack benchmark.", personalityTags: ["Friendly crack", "Benchmark pitch", "Confidence check"], decisionHint: "Choose it when you want a short route to set the tone." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "klahanie-crack-squamish", name: "Klahanie Crack", grade: "5.7", type: "trad", length: "single-pitch crack route", style: "Friendly Squamish crack practice with first-visit usefulness.", summary: "Klahanie Crack gives the list a low-pressure technique card. It is for building habits without pretending every route needs to be a saga.", practiceFocus: ["crack basics", "confidence", "movement economy"], bestFor: "Newer outdoor trad climbers practicing Squamish cracks.", personalityTags: ["Friendly crack", "Practice pitch", "First-visit useful"], decisionHint: "Pick it when the day should make fundamentals feel calmer." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "skywalker-squamish", name: "Skywalker", grade: "5.8", type: "multi-pitch", length: "moderate multi-pitch route", style: "Scenic Squamish granite with accessible adventure mood.", summary: "Skywalker is a good choice when the goal is a memorable outing with friendly movement and a little big-day sparkle.", practiceFocus: ["confidence multi-pitch", "exposure comfort", "team systems"], bestFor: "Teams wanting a scenic Squamish moderate.", personalityTags: ["Scenic classic", "Moderate adventure", "Team systems"], decisionHint: "Choose it when the day should feel adventurous but not overwhelming." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "sparrow-squamish", name: "Sparrow", grade: "5.9", type: "trad", length: "single-pitch route", style: "Compact Squamish granite with crisp movement value.", summary: "Sparrow is a small but useful card for climbers who want a route to sharpen movement rather than fill the whole day.", practiceFocus: ["movement precision", "single-pitch tactics", "granite footwork"], bestFor: "Climbers seeking a concise Squamish technique route.", personalityTags: ["Compact classic", "Technique card", "Granite focus"], decisionHint: "Pick it when one pitch should be enough to teach something." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "st-vitus-dance-squamish", name: "St. Vitus Dance", grade: "5.9", type: "multi-pitch", length: "about 5 pitches", style: "Squamish Apron climbing with balance, slabs, and classic composure.", summary: "St. Vitus Dance brings slabby rhythm into the decision set. It is a good reminder that Squamish is not only cracks and big walls.", practiceFocus: ["slab movement", "balance", "quiet feet"], bestFor: "Teams wanting a moderate Apron-style objective.", personalityTags: ["Apron classic", "Slab lesson", "Quiet feet"], decisionHint: "Choose it when balance and composure sound more useful than pump." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "squamish-buttress-squamish", name: "Squamish Buttress", grade: "5.9", type: "multi-pitch", length: "long multi-pitch route", style: "Classic Chief route with big-position value and moderate difficulty.", summary: "Squamish Buttress is a destination-defining card: not the hardest, but a strong way to understand why the Chief feels like a climbing landmark.", practiceFocus: ["long-route rhythm", "team planning", "exposure comfort"], bestFor: "Teams wanting a classic Chief experience.", personalityTags: ["Chief classic", "Long day", "Position value"], decisionHint: "Pick it when the point is a full Squamish experience." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "borderline-squamish", name: "Borderline", grade: "5.10d", type: "trad", length: "single-pitch route", style: "Harder Smoke Bluffs crack climbing with focused intensity.", summary: "Borderline adds a sharper single-pitch card for climbers who want Squamish crack practice with more bite.", practiceFocus: ["hard crack movement", "attempt quality", "foot precision"], bestFor: "Trad climbers looking for a focused hard crack challenge.", personalityTags: ["Hard crack", "Single-pitch focus", "Technique bite"], decisionHint: "Choose it when the goal is a clean, hard lesson rather than mileage." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "apron-strings-squamish", name: "Apron Strings", grade: "5.10b", type: "multi-pitch", length: "about 4 pitches", style: "Squamish Apron climbing with technique and route-flow value.", summary: "Apron Strings is useful for climbers who want the Apron to feel engaging without leaping straight into the biggest Chief objectives.", practiceFocus: ["slab confidence", "route flow", "team transitions"], bestFor: "Teams comparing moderate-to-intermediate Squamish routes.", personalityTags: ["Apron flow", "Technique route", "Step-up day"], decisionHint: "Pick it when the day should build technical confidence." })
  ],
  "fontainebleau-france": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "corto-maltese-fontainebleau", name: "Corto Maltese", grade: "6C", type: "boulder", length: "boulder problem", style: "Fontainebleau sandstone with elegant movement and first-trip usefulness.", summary: "Corto Maltese is a balanced Bleau card: classic enough to feel special, friendly enough to keep the session curious.", practiceFocus: ["footwork", "body position", "movement reading"], bestFor: "Visitors wanting an approachable classic with real style.", personalityTags: ["Elegant classic", "First-trip useful", "Forest lesson"], decisionHint: "Choose it when you want style before struggle." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "le-toit-du-cul-de-chien-fontainebleau", name: "Le Toit du Cul de Chien", grade: "7A", type: "boulder", length: "boulder problem", style: "Famous roof-style Bleau bouldering with playful intimidation.", summary: "Le Toit du Cul de Chien is the route-finder answer for climbers who want a landmark problem that still feels like a party trick with standards.", practiceFocus: ["roof tension", "body positioning", "session tactics"], bestFor: "Boulderers wanting a famous Fontainebleau roof classic.", personalityTags: ["Landmark problem", "Roof tension", "Playful classic"], decisionHint: "Pick it when the day wants a crowd-pleaser that still teaches body tension." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "l-helicoptere-fontainebleau", name: "L'Helicoptere", grade: "7A", type: "boulder", length: "boulder problem", style: "Classic Fontainebleau movement puzzle with playful body-position demands.", summary: "L'Helicoptere is for climbers who want the forest to feel clever. It is a style card more than a brute-force suggestion.", practiceFocus: ["movement reading", "body position", "attempt quality"], bestFor: "Boulderers wanting a classic Bleau technique problem.", personalityTags: ["Movement puzzle", "Body position", "Classic card"], decisionHint: "Choose it when you want the route to ask a question, not shout an answer." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "l-apparemment-fontainebleau", name: "L'Apparemment", grade: "7B", type: "boulder", length: "boulder problem", style: "Old-school Fontainebleau bouldering with compact intensity.", summary: "L'Apparemment gives the list a classic hard-but-not-elite problem for climbers who want a serious session without turning the day into a fantasy.", practiceFocus: ["power control", "foot precision", "skin pacing"], bestFor: "Boulderers building a classic 7B-focused Bleau day.", personalityTags: ["Old-school classic", "Compact power", "Session focus"], decisionHint: "Pick it when the day should be serious but still practical." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "la-berezina-fontainebleau", name: "La Berezina", grade: "7C", type: "boulder", length: "boulder problem", style: "Hard Fontainebleau sandstone with benchmark session value.", summary: "La Berezina is a higher-end card for climbers who want the forest to make training questions precise.", practiceFocus: ["hard boulder tactics", "skin management", "precision"], bestFor: "Strong boulderers comparing hard Bleau classics.", personalityTags: ["Hard classic", "Precision card", "Session discipline"], decisionHint: "Choose it when every attempt can stay thoughtful." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "big-boss-fontainebleau", name: "Big Boss", grade: "7C", type: "boulder", length: "boulder problem", style: "Famous Fontainebleau hard bouldering with modern benchmark feel.", summary: "Big Boss is an aspirational-but-readable card: a problem to organize effort, not a reason to panic.", practiceFocus: ["power tension", "attempt review", "skin pacing"], bestFor: "Strong boulderers choosing a harder Bleau target.", personalityTags: ["Hard benchmark", "Power tension", "Aspirational"], decisionHint: "Pick it when a hard problem should make the plan clearer." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "surplomb-de-la-mee-fontainebleau", name: "Surplomb de la Mee", grade: "7A+", type: "boulder", length: "boulder problem", style: "Overhanging Fontainebleau sandstone with classic power lessons.", summary: "Surplomb de la Mee is useful when the day wants more steepness and less wandering. It is a focused power card.", practiceFocus: ["overhang strength", "body tension", "try quality"], bestFor: "Boulderers wanting a steeper Bleau classic.", personalityTags: ["Overhang lesson", "Power focus", "Classic sandstone"], decisionHint: "Choose it when the session should be physical but not messy." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "la-merveille-fontainebleau", name: "La Merveille", grade: "7A", type: "boulder", length: "boulder problem", style: "Beautiful Fontainebleau classic with style-first appeal.", summary: "La Merveille is a good reminder that the route list should include beauty, not only difficulty. It suits a day where movement quality matters.", practiceFocus: ["movement quality", "footwork", "calm attempts"], bestFor: "Boulderers wanting a classic with aesthetic value.", personalityTags: ["Beautiful classic", "Style first", "Forest mood"], decisionHint: "Pick it when you want the climb to feel like a good sentence." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "duroxmanie-fontainebleau", name: "Duroxmanie", grade: "8A", type: "boulder", length: "boulder problem", style: "Hard Bleau bouldering with serious project identity.", summary: "Duroxmanie is for climbers who want a sharper hard problem but still want the forest to feel like a puzzle rather than a scoreboard.", practiceFocus: ["hard moves", "skin pacing", "attempt quality"], bestFor: "Boulderers selecting a serious Fontainebleau project.", personalityTags: ["Hard classic", "Project tactics", "Session discipline"], decisionHint: "Choose it when a hard problem should make your attempts cleaner." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "fourmis-rouges-fontainebleau", name: "Fourmis Rouges", grade: "7A", type: "boulder", length: "boulder problem", style: "Fontainebleau classic with compact movement and tactical value.", summary: "Fourmis Rouges is a practical 7A card: enough challenge to focus, enough classic value to belong on a first serious list.", practiceFocus: ["tactics", "foot precision", "body position"], bestFor: "Boulderers building a balanced Fontainebleau circuit.", personalityTags: ["Circuit classic", "Tactical problem", "Balanced day"], decisionHint: "Pick it when you want a useful classic rather than a trophy hunt." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "la-balance-fontainebleau", name: "La Balance", grade: "7C+", type: "boulder", length: "boulder problem", style: "High-end Fontainebleau movement with balance and strength in tension.", summary: "La Balance is an advanced card for climbers who want a problem that makes body position feel like the whole conversation.", practiceFocus: ["body tension", "balance", "limit attempts"], bestFor: "Advanced boulderers studying harder Bleau style.", personalityTags: ["Balance puzzle", "Advanced card", "Limit focus"], decisionHint: "Choose it when body position is the project question." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "eclipse-fontainebleau", name: "Eclipse", grade: "7C", type: "boulder", length: "boulder problem", style: "Hard Fontainebleau bouldering with clean project identity.", summary: "Eclipse is a compact hard-route card for climbers who want the session to be precise, quiet, and measurable.", practiceFocus: ["precision", "project tactics", "skin management"], bestFor: "Strong boulderers choosing a focused Bleau project.", personalityTags: ["Focused project", "Hard sandstone", "Attempt quality"], decisionHint: "Pick it when you want fewer, better tries." })
  ],
  "kalymnos-greece": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "ivi-kalymnos", name: "Ivi", grade: "7b+", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone endurance with sunny project charm.", summary: "Ivi is for climbers who want the island to feel like a serious sport trip, not only a vacation postcard.", practiceFocus: ["limestone endurance", "redpoint patience", "rest timing"], bestFor: "Sport climbers comparing harder Kalymnos classics.", personalityTags: ["Island project", "Endurance quest", "Sunny focus"], decisionHint: "Choose it when vacation energy can become disciplined effort." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "kerveros-kalymnos", name: "Kerveros", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Steep Kalymnos limestone with tufa power and project pull.", summary: "Kerveros is a route-finder card for climbers who want tufa intensity with a clear training purpose.", practiceFocus: ["tufa strength", "pump control", "project tactics"], bestFor: "Advanced sport climbers wanting a steeper Kalymnos target.", personalityTags: ["Tufa power", "Project pull", "Steep sport"], decisionHint: "Pick it when steep limestone is the reason for the trip." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "mousses-kalymnos", name: "Mousses", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Classic Kalymnos sport climbing with movement identity and trip value.", summary: "Mousses is a great bridge card: practical enough to belong on a real trip list and interesting enough to teach pacing.", practiceFocus: ["movement flow", "rest strategy", "limestone reading"], bestFor: "Sport climbers wanting a classic Kalymnos 7a-style target.", personalityTags: ["Classic bridge", "Movement flow", "Trip useful"], decisionHint: "Choose it when you want the day to feel memorable but realistic." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "il-pittore-kalymnos", name: "Il Pittore", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Playful Kalymnos limestone with pump and personality.", summary: "Il Pittore is the kind of route card ClimbAtlas likes: useful style, enough challenge, and a name with character.", practiceFocus: ["pump awareness", "efficient movement", "relaxed climbing"], bestFor: "Climbers wanting a fun but meaningful Kalymnos day.", personalityTags: ["Playful classic", "Pump lesson", "Vacation brain"], decisionHint: "Pick it when fun should still teach something." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "adrasteia-kalymnos", name: "Adrasteia", grade: "7a+", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone flow with a memorable classic feel.", summary: "Adrasteia gives the list another practical classic: a route for climbers who want movement and rhythm more than a headline grade.", practiceFocus: ["flow", "limestone footwork", "confidence"], bestFor: "Sport climbers building a balanced Kalymnos shortlist.", personalityTags: ["Flow route", "Classic sport", "Balanced day"], decisionHint: "Choose it when rhythm is the goal." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "eros-kalymnos", name: "Eros", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Sunny limestone climbing with romantic-name energy and real pump.", summary: "Eros sounds soft but should still be treated as a route with work to do. It belongs on days when motivation is high and pacing matters.", practiceFocus: ["pacing", "route reading", "pump control"], bestFor: "Climbers wanting a named Kalymnos classic with manageable project value.", personalityTags: ["Sunny classic", "Pump control", "Named route"], decisionHint: "Pick it when a memorable route should still stay practical." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "lolita-kalymnos", name: "Lolita", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Kalymnos sport climbing with a compact classic feel.", summary: "Lolita is a useful card for route choice because it gives climbers another clear 7a-ish target without turning the page into a hard-only list.", practiceFocus: ["movement economy", "confidence", "attempt review"], bestFor: "Sport climbers comparing classic moderate-hard Kalymnos routes.", personalityTags: ["Classic sport", "Bridge grade", "Trip list"], decisionHint: "Choose it when you want a known target that still leaves room in the day." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "totenhansel-kalymnos", name: "Totenhansel", grade: "7b+", type: "sport", length: "single-pitch sport route", style: "Island limestone with flow, patience, and classic route-choice appeal.", summary: "Totenhansel is for climbers who want a Kalymnos card that feels steady, scenic, and useful for building rhythm.", practiceFocus: ["flow", "rest timing", "limestone confidence"], bestFor: "Climbers wanting a steady Kalymnos project card.", personalityTags: ["Flow classic", "Island rhythm", "Confidence card"], decisionHint: "Pick it when the day should make your climbing smoother." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "wild-sex-kalymnos", name: "Wild Sex", grade: "7a+", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with loud name and focused sport value.", summary: "Wild Sex has a loud title, but the useful part is quieter: it gives climbers a memorable route for practicing efficient effort.", practiceFocus: ["efficient effort", "pump control", "route tactics"], bestFor: "Sport climbers wanting a memorable Kalymnos target.", personalityTags: ["Loud name", "Sport focus", "Pump practice"], decisionHint: "Choose it when personality helps motivation but pacing still leads." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "harakiri-kalymnos", name: "Harakiri", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Sharper Kalymnos sport climbing with project-day attitude.", summary: "Harakiri is a harder bridge card: useful when climbers want the recommendation to feel serious without becoming elite-only.", practiceFocus: ["project pacing", "power endurance", "attempt review"], bestFor: "Sport climbers stepping into harder Kalymnos objectives.", personalityTags: ["Hard bridge", "Project day", "Limestone focus"], decisionHint: "Pick it when the trip needs one route that raises the stakes." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "daphne-kalymnos", name: "Daphne", grade: "6c+", type: "sport", length: "single-pitch sport route", style: "Friendlier Kalymnos limestone with classic mileage value.", summary: "Daphne keeps the Kalymnos list grounded. It is a good card for days when quality mileage is smarter than chasing the loudest number.", practiceFocus: ["confidence mileage", "limestone flow", "movement economy"], bestFor: "Climbers wanting a friendlier Kalymnos classic.", personalityTags: ["Friendly classic", "Mileage day", "Flow route"], decisionHint: "Choose it when the goal is to climb well and keep the trip sustainable." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "o-draconian-devil-kalymnos", name: "O Draconian Devil", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Kalymnos sport climbing with mythic name and real training value.", summary: "O Draconian Devil gives the list a storybook-sounding hard card, but its real use is simple: focus the session and make feedback specific.", practiceFocus: ["hard sport tactics", "pump control", "mental reset"], bestFor: "Sport climbers wanting a memorable harder Kalymnos project.", personalityTags: ["Mythic name", "Hard sport", "Project focus"], decisionHint: "Pick it when a dramatic name helps you commit to a disciplined plan." })
  ]
};

const v3PopularRouteAdditions: Record<string, RouteHighlight[]> = {
  "yosemite-usa": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "bishops-terrace-yosemite", name: "Bishop's Terrace", grade: "5.8", type: "trad", length: "1 pitch", style: "Friendly-looking Yosemite crack climbing with classic technique value.", summary: "Bishop's Terrace is a good reminder that moderate Yosemite cracks can still teach a full lesson. It is a confidence card with real craft inside.", practiceFocus: ["hand crack basics", "foot trust", "calm leading"], bestFor: "Trad climbers wanting a classic single-pitch Yosemite lesson.", personalityTags: ["Friendly classic", "Crack basics", "Confidence route"], decisionHint: "Choose it when the day should build trust in your systems." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "church-bowl-lieback-yosemite", name: "Church Bowl Lieback", grade: "5.8", type: "trad", length: "1 pitch", style: "Short Yosemite liebacking with direct, memorable feedback.", summary: "Church Bowl Lieback is compact and honest. It belongs on days when you want one route to show whether your feet are helping enough.", practiceFocus: ["lieback footwork", "body tension", "single-pitch focus"], bestFor: "Climbers practicing efficient Yosemite technique.", personalityTags: ["Technique snack", "Lieback lesson", "Short classic"], decisionHint: "Pick it when a short route should sharpen movement." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "jamcrack-yosemite", name: "Jamcrack", grade: "5.7", type: "trad", length: "1 pitch", style: "Classic Yosemite crack mileage with low-pressure learning value.", summary: "Jamcrack is not here to impress anyone. That is exactly why it is useful: clean movement, simple goals, and honest mileage.", practiceFocus: ["crack mileage", "footwork", "warm-up rhythm"], bestFor: "Climbers wanting approachable crack practice.", personalityTags: ["Mileage classic", "Crack practice", "Low pressure"], decisionHint: "Choose it when you want the day to start sensibly." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "lazy-bum-yosemite", name: "Lazy Bum", grade: "5.10d", type: "trad", length: "1 pitch", style: "Compact Yosemite crack challenge with more bite than the name suggests.", summary: "Lazy Bum is a useful single-pitch test for climbers who want the day to feel focused without becoming a wall mission.", practiceFocus: ["finger crack precision", "attempt quality", "footwork"], bestFor: "Trad climbers looking for a focused Yosemite 5.10 challenge.", personalityTags: ["Compact bite", "Crack focus", "Technique test"], decisionHint: "Pick it when one pitch should make the notebook useful." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "lunatic-fringe-yosemite", name: "Lunatic Fringe", grade: "5.10c", type: "trad", length: "1 pitch", style: "Clean Yosemite crack climbing with benchmark single-pitch energy.", summary: "Lunatic Fringe is a good route card when you want a short, sharp crack goal that rewards precision more than theatrics.", practiceFocus: ["crack precision", "foot trust", "calm pacing"], bestFor: "Climbers comparing Yosemite single-pitch crack benchmarks.", personalityTags: ["Benchmark pitch", "Clean crack", "Precision route"], decisionHint: "Choose it when you want clean feedback from a compact objective." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "outer-limits-yosemite", name: "Outer Limits", grade: "5.10c", type: "trad", length: "1 pitch", style: "Famous Cookie Cliff crack with stamina and style pressure.", summary: "Outer Limits is a classic benchmark card: popular, physical, and useful for learning whether your crack rhythm stays intact.", practiceFocus: ["crack endurance", "rhythm", "quality attempts"], bestFor: "Trad climbers wanting a famous Yosemite crack test.", personalityTags: ["Cookie classic", "Endurance pitch", "Benchmark"], decisionHint: "Pick it when you want a single pitch to feel substantial." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "new-dimensions-yosemite", name: "New Dimensions", grade: "5.11a", type: "trad", length: "about 4 pitches", style: "Yosemite crack progression with sustained technical personality.", summary: "New Dimensions gives the list a serious craft card. It is for climbers who want several pitches of focus rather than a single hard headline.", practiceFocus: ["sustained crack craft", "pitch pacing", "partner rhythm"], bestFor: "Experienced trad teams building harder Yosemite crack goals.", personalityTags: ["Sustained craft", "Crack progression", "Team focus"], decisionHint: "Choose it when the route should teach across multiple pitches." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "moratorium-yosemite", name: "Moratorium", grade: "5.11b", type: "trad", length: "1 pitch", style: "Harder Yosemite crack climbing with precise, no-fluff energy.", summary: "Moratorium is a compact card for climbers who want a crack goal that asks for quality attempts and honest preparation.", practiceFocus: ["finger crack technique", "attempt quality", "skin pacing"], bestFor: "Strong trad climbers comparing Yosemite crack testpieces.", personalityTags: ["Hard crack", "Quality tries", "Compact serious"], decisionHint: "Pick it when the plan is fewer better attempts." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "west-face-el-capitan-yosemite", name: "West Face of El Capitan", grade: "5.11c", type: "multi-pitch", length: "long wall route", style: "El Capitan free-climbing objective with big-wall atmosphere.", summary: "West Face is a wall-sized route card for climbers who want El Cap energy without choosing the most famous line on the cliff.", practiceFocus: ["wall endurance", "team systems", "route pacing"], bestFor: "Experienced teams comparing free-climbing objectives on El Capitan.", personalityTags: ["El Cap card", "Wall systems", "All-day focus"], decisionHint: "Choose it when El Cap scale is part of the goal." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "east-buttress-el-capitan-yosemite", name: "East Buttress of El Capitan", grade: "5.10b", type: "multi-pitch", length: "long multi-pitch route", style: "Classic El Capitan shoulder route with position and history.", summary: "East Buttress gives climbers a way to put El Cap in the decision set without making the whole plan a major aid-wall campaign.", practiceFocus: ["multi-pitch rhythm", "exposure comfort", "team planning"], bestFor: "Teams wanting an El Capitan-flavored free-climbing day.", personalityTags: ["El Cap classic", "Position value", "Team rhythm"], decisionHint: "Pick it when the place matters as much as the number." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "direct-north-buttress-middle-cathedral-yosemite", name: "Direct North Buttress of Middle Cathedral", grade: "5.10a", type: "multi-pitch", length: "long multi-pitch route", style: "Serious Middle Cathedral granite with route-finding and stamina value.", summary: "Direct North Buttress is a substantial card for teams who want Yosemite to feel big, classic, and a little stern.", practiceFocus: ["long-route stamina", "team systems", "route judgment"], bestFor: "Experienced teams building toward larger Valley objectives.", personalityTags: ["Long classic", "Granite stamina", "Serious day"], decisionHint: "Choose it when you want a full-value Yosemite lesson." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "braille-book-yosemite", name: "Braille Book", grade: "5.8", type: "multi-pitch", length: "moderate multi-pitch route", style: "High-country Yosemite granite with moderate adventure charm.", summary: "Braille Book adds a gentler alpine-granite flavor to the list. It suits climbers who want movement, views, and calm systems.", practiceFocus: ["moderate multi-pitch", "granite confidence", "team rhythm"], bestFor: "Teams wanting a friendlier Yosemite classic outside the hardest Valley mood.", personalityTags: ["Moderate adventure", "Granite confidence", "High-country mood"], decisionHint: "Pick it when the day should feel classic and steady." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "cathedral-peak-southeast-buttress-yosemite", name: "Cathedral Peak Southeast Buttress", grade: "5.6", type: "multi-pitch", length: "moderate alpine rock route", style: "High Sierra granite with scenic, lower-grade adventure value.", summary: "Cathedral Peak is an excellent card for climbers who want a Yosemite-area objective where position, pacing, and mountain mood matter more than difficulty.", practiceFocus: ["alpine pacing", "easy-route systems", "exposure comfort"], bestFor: "Teams wanting a scenic moderate Yosemite high-country route.", personalityTags: ["Scenic classic", "Alpine mood", "Friendly grade"], decisionHint: "Choose it when the day should be memorable without being hard." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "regular-route-fairview-dome-yosemite", name: "Regular Route on Fairview Dome", grade: "5.9", type: "multi-pitch", length: "long multi-pitch route", style: "Tuolumne granite with sustained moderate adventure and big-slab atmosphere.", summary: "Fairview Dome's Regular Route is a route-finder bridge between friendly grades and serious days: the number is moderate, the day still asks for respect.", practiceFocus: ["long-route pacing", "slab confidence", "team transitions"], bestFor: "Teams wanting a substantial Tuolumne-style classic.", personalityTags: ["Tuolumne classic", "Long moderate", "Slab confidence"], decisionHint: "Pick it when the route should feel big without feeling extreme." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "oz-yosemite", name: "Oz", grade: "5.10d", type: "multi-pitch", length: "multi-pitch route", style: "Tuolumne granite with crack, knobs, and storybook name energy.", summary: "Oz is a good card when the Yosemite list needs more high-country imagination. It is technical enough to focus and memorable enough to motivate.", practiceFocus: ["technical granite", "route rhythm", "footwork"], bestFor: "Climbers comparing Tuolumne multi-pitch objectives.", personalityTags: ["High-country classic", "Technical granite", "Storybook mood"], decisionHint: "Choose it when Tuolumne style sounds more useful than Valley intensity." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["yosemite-usa"], id: "lucky-streaks-yosemite", name: "Lucky Streaks", grade: "5.10d", type: "multi-pitch", length: "multi-pitch route", style: "High-country Yosemite crack and face climbing with sustained interest.", summary: "Lucky Streaks is a route card for climbers who want a long enough day to matter and a style that rewards clean movement.", practiceFocus: ["sustained movement", "granite technique", "team pacing"], bestFor: "Teams wanting a Tuolumne step-up route.", personalityTags: ["Step-up classic", "Sustained interest", "Granite technique"], decisionHint: "Pick it when the day should feel earned but not chaotic." })
  ],
  "red-river-gorge-usa": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "chainsaw-massacre-red-river-gorge", name: "Chainsaw Massacre", grade: "5.12a", type: "sport", length: "single-pitch sport route", style: "Red River sport climbing with loud name and useful bridge-grade value.", summary: "Chainsaw Massacre sounds dramatic, but in ClimbAtlas it is mostly a practical bridge card: hard enough to focus, not so hard it owns the whole trip.", practiceFocus: ["pump control", "movement economy", "confidence"], bestFor: "Sport climbers stepping into Red River 5.12 territory.", personalityTags: ["Loud name", "Bridge route", "Pump lesson"], decisionHint: "Choose it when the day should feel like a step up, not a leap." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "ale-8-one-red-river-gorge", name: "Ale-8-One", grade: "5.12b", type: "sport", length: "single-pitch sport route", style: "Classic Red River sport climbing with local flavor and endurance value.", summary: "Ale-8-One is a useful card for climbers who want the Red to feel local, fun, and just hard enough to demand planning.", practiceFocus: ["endurance", "rest timing", "route reading"], bestFor: "Climbers building a memorable Red River project list.", personalityTags: ["Local flavor", "Endurance bridge", "Project useful"], decisionHint: "Pick it when a classic should also train pacing." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "tissue-tiger-red-river-gorge", name: "Tissue Tiger", grade: "5.12b", type: "sport", length: "single-pitch sport route", style: "Steep sandstone sport with practical project lessons.", summary: "Tissue Tiger gives the Red list another route where effort should be measured, not just enthusiastic.", practiceFocus: ["redpoint tactics", "pump awareness", "quality attempts"], bestFor: "Sport climbers wanting a focused 5.12-style Red project.", personalityTags: ["Project bridge", "Steep sandstone", "Attempt quality"], decisionHint: "Choose it when you want the route to improve your process." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "convicted-red-river-gorge", name: "Convicted", grade: "5.13a", type: "sport", length: "single-pitch sport route", style: "Hard Red River sport climbing with concentrated project pressure.", summary: "Convicted is a card for climbers who want a serious route to focus effort and expose lazy tactics.", practiceFocus: ["project discipline", "power endurance", "attempt review"], bestFor: "Sport climbers moving into more serious Red River projects.", personalityTags: ["Hard bridge", "Project pressure", "Tactics route"], decisionHint: "Pick it when the project should make your habits more honest." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "ultra-perm-red-river-gorge", name: "Ultra-Perm", grade: "5.13b", type: "sport", length: "single-pitch sport route", style: "Classic hard Red River sport climbing with endurance and style.", summary: "Ultra-Perm is a higher-end card for climbers who want a project that sounds playful but asks serious questions.", practiceFocus: ["power endurance", "try management", "movement economy"], bestFor: "Advanced sport climbers comparing hard Red River objectives.", personalityTags: ["Hard classic", "Project style", "Endurance route"], decisionHint: "Choose it when the route should be motivating and specific." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "bare-metal-teen-red-river-gorge", name: "Bare Metal Teen", grade: "5.12a", type: "sport", length: "single-pitch sport route", style: "Popular Red River sport climbing with bridge-route practicality.", summary: "Bare Metal Teen is a strong choice when the day needs a recognizable 5.12 objective without committing to the highest-stakes project.", practiceFocus: ["confidence at grade", "pump control", "movement flow"], bestFor: "Sport climbers building 5.12 confidence at the Red.", personalityTags: ["Bridge classic", "Confidence route", "Sport mileage"], decisionHint: "Pick it when you want a meaningful step-up route." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "magnum-opus-red-river-gorge", name: "Magnum Opus", grade: "5.12a", type: "sport", length: "single-pitch sport route", style: "Red River sport route with classic-name swagger and useful difficulty.", summary: "Magnum Opus is a card for climbers who want a route that feels like an event without requiring elite grades.", practiceFocus: ["movement confidence", "endurance", "attempt quality"], bestFor: "Climbers wanting a memorable Red River 5.12-style route.", personalityTags: ["Named classic", "Bridge route", "Endurance lesson"], decisionHint: "Choose it when you want the day to feel special and still practical." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "no-redemption-red-river-gorge", name: "No Redemption", grade: "5.13b", type: "sport", length: "single-pitch sport route", style: "Hard Red River project climbing with stern, focused character.", summary: "No Redemption belongs in the list as a serious project card: useful for climbers who want a route to demand clarity.", practiceFocus: ["project clarity", "power endurance", "mental reset"], bestFor: "Advanced climbers selecting a focused hard Red project.", personalityTags: ["Stern project", "Endurance quest", "Mental focus"], decisionHint: "Pick it when you want the goal to ask for real commitment." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "jesus-wept-red-river-gorge", name: "Jesus Wept", grade: "5.12d", type: "sport", length: "single-pitch sport route", style: "Steep Red River sport climbing with emotional-name intensity.", summary: "Jesus Wept is hard enough to organize a day and memorable enough to stay in the notebook. It is a bridge between fun and serious.", practiceFocus: ["route tactics", "redpoint patience", "pump management"], bestFor: "Sport climbers preparing for harder Red River routes.", personalityTags: ["Memorable name", "Hard bridge", "Pump management"], decisionHint: "Choose it when you want a serious attempt without going full fantasy list." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "twinkie-red-river-gorge", name: "Twinkie", grade: "5.12a", type: "sport", length: "single-pitch sport route", style: "Red River sport climbing with approachable hard-route energy.", summary: "Twinkie keeps the hard-route list human. It is a useful card when the day needs challenge but not solemnity.", practiceFocus: ["pump control", "confidence", "efficient movement"], bestFor: "Climbers moving into harder sport routes with a lighter mood.", personalityTags: ["Friendly hard", "Bridge sport", "Useful mileage"], decisionHint: "Pick it when you want challenge without overdramatizing the day." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "tuna-town-red-river-gorge", name: "Tuna Town", grade: "5.12d", type: "sport", length: "single-pitch sport route", style: "Steep Red River sport climbing with odd-name charm and real pump.", summary: "Tuna Town is a good project card for climbers who like memorable routes that still reward controlled effort.", practiceFocus: ["power endurance", "rest discipline", "quality attempts"], bestFor: "Sport climbers comparing harder Red River objectives.", personalityTags: ["Odd charm", "Pump route", "Project tactics"], decisionHint: "Choose it when a route can be fun and serious at the same time." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "dogleg-red-river-gorge", name: "Dogleg", grade: "5.12a", type: "sport", length: "single-pitch sport route", style: "Classic Red River sport climbing with practical progression value.", summary: "Dogleg is a progression card: useful when the next step should feel clear, measurable, and still enjoyable.", practiceFocus: ["progression pacing", "movement reading", "confidence"], bestFor: "Climbers building into the Red River 5.12 range.", personalityTags: ["Progression card", "Sport confidence", "Trip useful"], decisionHint: "Pick it when you want a clean next-step objective." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "supercharger-red-river-gorge", name: "Supercharger", grade: "5.12c", type: "sport", length: "single-pitch sport route", style: "Powerful Red River sport climbing with energizing project feel.", summary: "Supercharger is a good card when the day wants electricity but still needs structure.", practiceFocus: ["power endurance", "attempt review", "route tactics"], bestFor: "Sport climbers wanting a punchy Red River project.", personalityTags: ["Power route", "Project spark", "Endurance"], decisionHint: "Choose it when the route should make the session feel charged but focused." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "prometheus-unbound-red-river-gorge", name: "Prometheus Unbound", grade: "5.12a", type: "sport", length: "single-pitch sport route", style: "Red River sport climbing with grand name and accessible hard value.", summary: "Prometheus Unbound sounds epic, but it is useful because it lets climbers add a memorable hard-ish route without making the trip top-heavy.", practiceFocus: ["confidence", "pump control", "route reading"], bestFor: "Sport climbers choosing a memorable 5.12 objective.", personalityTags: ["Grand name", "Bridge grade", "Sport confidence"], decisionHint: "Pick it when the day should feel inspiring but not overwhelming." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "the-madness-red-river-gorge", name: "The Madness", grade: "5.13c", type: "sport", length: "single-pitch sport route", style: "Hard Red River project climbing with full-commitment energy.", summary: "The Madness is an advanced project card: not for padding a list, but for giving serious climbers a clear hard-route reference.", practiceFocus: ["elite endurance", "project patience", "attempt discipline"], bestFor: "Advanced climbers selecting a major Red River project.", personalityTags: ["Hard project", "Commitment card", "Endurance quest"], decisionHint: "Choose it when the goal is allowed to dominate the trip." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["red-river-gorge-usa"], id: "the-legend-red-river-gorge", name: "The Legend", grade: "5.13a", type: "sport", length: "single-pitch sport route", style: "Hard Red River sport route with aspirational name and project value.", summary: "The Legend is useful as a motivation card. It gives climbers a hard goal to compare against without pretending the name does the climbing.", practiceFocus: ["redpoint planning", "power endurance", "quality attempts"], bestFor: "Sport climbers wanting a memorable hard Red objective.", personalityTags: ["Aspirational", "Project route", "Hard sport"], decisionHint: "Pick it when the name motivates but the plan stays practical." })
  ],
  "squamish-canada": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "diedre-squamish", name: "Diedre", grade: "5.8", type: "multi-pitch", length: "about 6 pitches", style: "Classic Squamish Apron climbing with corner rhythm and moderate charm.", summary: "Diedre is a first-Squamish classic card: friendly enough to invite, famous enough to matter, and useful for learning team rhythm.", practiceFocus: ["corner movement", "team transitions", "granite confidence"], bestFor: "Teams wanting a classic moderate Squamish route.", personalityTags: ["Apron classic", "Moderate charm", "Team rhythm"], decisionHint: "Choose it when the day should feel classic and manageable." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "boomstick-squamish", name: "Boomstick", grade: "5.7", type: "multi-pitch", length: "moderate multi-pitch route", style: "Approachable Squamish granite with scenic, low-pressure value.", summary: "Boomstick gives the list a friendly adventure card. It is a good choice when the team wants a scenic outing more than a hard test.", practiceFocus: ["confidence", "easy systems", "exposure comfort"], bestFor: "Teams easing into Squamish multi-pitch climbing.", personalityTags: ["Friendly classic", "Scenic day", "Confidence route"], decisionHint: "Pick it when the route should make the team calmer." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "snake-squamish", name: "Snake", grade: "5.9", type: "multi-pitch", length: "multi-pitch route", style: "Squamish granite with a practical moderate step-up feel.", summary: "Snake is a useful middle card: more engaging than warm-up mileage, less intimidating than the huge Chief objectives.", practiceFocus: ["route flow", "granite technique", "team pacing"], bestFor: "Teams wanting a moderate Squamish progression route.", personalityTags: ["Step-up moderate", "Granite flow", "Team practice"], decisionHint: "Choose it when the day should stretch skills without stretching nerves too far." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "ultimate-everything-squamish", name: "The Ultimate Everything", grade: "5.10b", type: "multi-pitch", length: "long multi-pitch route", style: "Long Squamish adventure route with big-name optimism and real logistics.", summary: "The Ultimate Everything is a route-finder card for teams who want the day to feel like a full journey. It rewards planning more than hype.", practiceFocus: ["long-day pacing", "team logistics", "granite confidence"], bestFor: "Teams wanting a bigger Squamish adventure objective.", personalityTags: ["Long adventure", "Big-name route", "Team systems"], decisionHint: "Pick it when the whole day is the point." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "bulletheads-east-squamish", name: "Bulletheads East", grade: "5.10b", type: "multi-pitch", length: "multi-pitch route", style: "Squamish granite with intermediate difficulty and route-flow value.", summary: "Bulletheads East is for teams who want something more involved than entry-level classics without jumping straight to major wall pressure.", practiceFocus: ["route rhythm", "granite technique", "partner communication"], bestFor: "Teams comparing intermediate Squamish routes.", personalityTags: ["Intermediate classic", "Route flow", "Granite focus"], decisionHint: "Choose it when the day should feel like a confident step forward." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "europa-squamish", name: "Europa", grade: "5.11c", type: "multi-pitch", length: "multi-pitch route", style: "Harder Squamish granite with technical project-day character.", summary: "Europa gives the list a serious multi-pitch card for climbers who want the Chief to feel technical, committing, and focused.", practiceFocus: ["technical granite", "multi-pitch endurance", "quality attempts"], bestFor: "Experienced teams seeking a harder Squamish objective.", personalityTags: ["Technical route", "Harder Chief", "Focused day"], decisionHint: "Pick it when competence should matter more than speed." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "crime-of-the-century-squamish", name: "Crime of the Century", grade: "5.11c", type: "trad", length: "single-pitch route", style: "Hard Squamish crack climbing with memorable benchmark energy.", summary: "Crime of the Century is a focused crack card for climbers who want one pitch to feel like a real event.", practiceFocus: ["hard crack technique", "attempt quality", "foot precision"], bestFor: "Trad climbers comparing harder Squamish single-pitch routes.", personalityTags: ["Hard crack", "Benchmark pitch", "Memorable name"], decisionHint: "Choose it when a single pitch should carry the session." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "a-pitch-in-time-squamish", name: "A Pitch in Time", grade: "5.10b", type: "trad", length: "single-pitch route", style: "Compact Squamish crack climbing with clean practice value.", summary: "A Pitch in Time is a neat little decision card: enough challenge to focus, compact enough to keep the day flexible.", practiceFocus: ["crack precision", "single-pitch focus", "warm-up honesty"], bestFor: "Climbers wanting a focused Squamish crack lesson.", personalityTags: ["Compact lesson", "Crack practice", "Flexible day"], decisionHint: "Pick it when the best route is a clear route." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "mercy-me-squamish", name: "Mercy Me", grade: "5.12c", type: "sport", length: "single-pitch sport route", style: "Hard Squamish sport climbing with project-style discipline.", summary: "Mercy Me brings sport-project energy to the Squamish list. It is a card for focused attempts, not casual sampling.", practiceFocus: ["project tactics", "power endurance", "attempt review"], bestFor: "Sport climbers comparing hard Squamish objectives.", personalityTags: ["Hard sport", "Project card", "Attempt quality"], decisionHint: "Choose it when the session should be specific and disciplined." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "the-shadow-squamish", name: "The Shadow", grade: "5.13a", type: "trad", length: "single-pitch route", style: "Hard Squamish crack climbing with serious benchmark mood.", summary: "The Shadow is an aspirational crack card: useful for strong climbers who want their training questions to become sharper.", practiceFocus: ["hard crack strength", "precision", "skin pacing"], bestFor: "Strong trad climbers studying high-end Squamish cracks.", personalityTags: ["Hard crack", "Aspirational", "Precision route"], decisionHint: "Pick it when the route should guide long-term preparation." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "zorros-last-ride-squamish", name: "Zorro's Last Ride", grade: "5.11d", type: "trad", length: "single-pitch route", style: "Squamish crack climbing with dramatic name and focused difficulty.", summary: "Zorro's Last Ride is a good card when climbers want the single-pitch list to include something with bite and personality.", practiceFocus: ["hard crack movement", "quality attempts", "mental pacing"], bestFor: "Trad climbers seeking a focused Squamish challenge.", personalityTags: ["Dramatic name", "Single-pitch bite", "Crack focus"], decisionHint: "Choose it when the day wants one strong statement." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "milk-road-squamish", name: "The Milk Road", grade: "5.10d", type: "multi-pitch", length: "multi-pitch route", style: "Squamish granite with steady multi-pitch value and less headline noise.", summary: "The Milk Road is for teams who want route quality and rhythm without making the day about the most famous name.", practiceFocus: ["multi-pitch rhythm", "granite movement", "team planning"], bestFor: "Teams comparing quieter Squamish multi-pitch objectives.", personalityTags: ["Quiet classic", "Team rhythm", "Granite mileage"], decisionHint: "Pick it when quality matters more than status." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "partners-in-crime-squamish", name: "Partners in Crime", grade: "5.11a", type: "trad", length: "single-pitch route", style: "Squamish crack climbing with partner-session energy.", summary: "Partners in Crime is a focused crack card for climbers who want to compare technique, notes, and effort with a good partner.", practiceFocus: ["crack technique", "attempt review", "partner feedback"], bestFor: "Trad climbers wanting a collaborative single-pitch session.", personalityTags: ["Partner session", "Crack feedback", "Technique route"], decisionHint: "Choose it when shared learning is the point." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "neat-and-cool-squamish", name: "Neat and Cool", grade: "5.10a", type: "trad", length: "single-pitch route", style: "Classic Squamish crack climbing with tidy benchmark value.", summary: "Neat and Cool is exactly what the name promises in route-finder terms: a clean, useful crack pitch for checking systems.", practiceFocus: ["tidy systems", "crack rhythm", "footwork"], bestFor: "Climbers wanting a practical Squamish crack benchmark.", personalityTags: ["Tidy classic", "Crack rhythm", "Benchmark"], decisionHint: "Pick it when you want a clean read on your crack day." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "flying-circus-squamish", name: "Flying Circus", grade: "5.10a", type: "trad", length: "single-pitch route", style: "Squamish single-pitch climbing with playful name and technique value.", summary: "Flying Circus is a good route card for a lighter session that still asks for attention and movement quality.", practiceFocus: ["movement variety", "single-pitch focus", "confidence"], bestFor: "Climbers wanting a fun Squamish technique route.", personalityTags: ["Playful classic", "Technique pitch", "Flexible day"], decisionHint: "Choose it when the session should stay light but useful." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["squamish-canada"], id: "local-boys-do-good-squamish", name: "Local Boys Do Good", grade: "5.10d", type: "trad", length: "single-pitch route", style: "Squamish granite with local-classic flavor and focused movement.", summary: "Local Boys Do Good gives the list a route with character, bite, and a strong reason to keep the day's goal specific.", practiceFocus: ["granite movement", "attempt quality", "confidence"], bestFor: "Climbers wanting a named Squamish challenge without a wall-sized plan.", personalityTags: ["Local flavor", "Focused route", "Granite bite"], decisionHint: "Pick it when the route should feel local and memorable." })
  ],
  "fontainebleau-france": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "science-friction-fontainebleau", name: "Science Friction", grade: "8A", type: "boulder", length: "boulder problem", style: "Hard Fontainebleau slab/friction identity with legendary specificity.", summary: "Science Friction is an advanced card for climbers who want the forest to ask a very precise question: can you trust subtlety?", practiceFocus: ["friction", "body control", "quiet attempts"], bestFor: "Advanced boulderers studying technical Bleau benchmarks.", personalityTags: ["Friction legend", "Technical card", "Quiet precision"], decisionHint: "Choose it when subtle movement is the whole project." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "partage-fontainebleau", name: "Partage", grade: "8A+", type: "boulder", length: "boulder problem", style: "High-end Fontainebleau bouldering with modern classic energy.", summary: "Partage is a hard inspiration card that should sharpen training questions rather than inflate the to-do list.", practiceFocus: ["limit bouldering", "attempt discipline", "body tension"], bestFor: "Strong boulderers choosing a serious Bleau benchmark.", personalityTags: ["Hard benchmark", "Modern classic", "Limit focus"], decisionHint: "Pick it when a hard problem should organize the season." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "haute-tension-fontainebleau", name: "Haute Tension", grade: "8A+", type: "boulder", length: "boulder problem", style: "Powerful Fontainebleau bouldering with high-tension personality.", summary: "Haute Tension is a literal route-finder card: if tension is the training question, this name belongs in the conversation.", practiceFocus: ["body tension", "power", "quality attempts"], bestFor: "Strong boulderers looking for a high-tension project reference.", personalityTags: ["Power tension", "Hard classic", "Project focus"], decisionHint: "Choose it when body tension is the skill you want exposed." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "tristesse-fontainebleau", name: "Tristesse", grade: "7C", type: "boulder", length: "boulder problem", style: "Hard Bleau sandstone with focused, slightly moody project value.", summary: "Tristesse adds a quieter hard card to the forest list. It is useful when the goal is careful attempts, not social chaos.", practiceFocus: ["precision", "skin pacing", "attempt review"], bestFor: "Boulderers seeking a focused 7C-style Fontainebleau project.", personalityTags: ["Moody project", "Precision route", "Hard sandstone"], decisionHint: "Pick it when the session should be quiet and sharp." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "opium-fontainebleau", name: "Opium", grade: "8A", type: "boulder", length: "boulder problem", style: "Hard Fontainebleau bouldering with hypnotic project appeal.", summary: "Opium is an advanced card for climbers who want a problem that pulls attention inward and rewards patience.", practiceFocus: ["project patience", "body tension", "attempt quality"], bestFor: "Strong boulderers comparing hard forest objectives.", personalityTags: ["Hypnotic project", "Hard sandstone", "Patience card"], decisionHint: "Choose it when focus is the scarce resource." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "atresie-fontainebleau", name: "Atresie", grade: "7C", type: "boulder", length: "boulder problem", style: "Fontainebleau hard bouldering with clean project identity.", summary: "Atresie is a useful hard card because it keeps the list broad: another problem for comparing style, not just difficulty.", practiceFocus: ["movement analysis", "skin management", "precision"], bestFor: "Boulderers building a varied hard Bleau shortlist.", personalityTags: ["Hard shortlist", "Style comparison", "Project focus"], decisionHint: "Pick it when you want a hard route that helps compare styles." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "la-coquille-fontainebleau", name: "La Coquille", grade: "6C", type: "boulder", length: "boulder problem", style: "Classic Fontainebleau sandstone with shape, style, and first-visit appeal.", summary: "La Coquille is a route card for climbers who want a memorable classic without making the session all about grade.", practiceFocus: ["body position", "footwork", "movement reading"], bestFor: "Visitors wanting a stylish, approachable Bleau classic.", personalityTags: ["Shape classic", "First-visit useful", "Style card"], decisionHint: "Choose it when the day should feel clever and pleasant." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "surplomb-de-la-coquille-fontainebleau", name: "Surplomb de la Coquille", grade: "6C+", type: "boulder", length: "boulder problem", style: "Overhanging Bleau sandstone with classic shape and moderate-hard value.", summary: "Surplomb de la Coquille gives the list a friendly overhang card: physical enough to teach, classic enough to remember.", practiceFocus: ["overhang movement", "body tension", "confidence"], bestFor: "Boulderers wanting a moderate-hard classic with shape.", personalityTags: ["Overhang classic", "Shape lesson", "Confidence"], decisionHint: "Pick it when you want a little steepness without a huge number." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "sale-gosse-fontainebleau", name: "Sale Gosse", grade: "7C", type: "boulder", length: "boulder problem", style: "Hard Fontainebleau problem with mischievous name and focused attempts.", summary: "Sale Gosse is a good project card for climbers who want a little mischief and a lot of precision.", practiceFocus: ["attempt quality", "movement reading", "skin pacing"], bestFor: "Boulderers selecting a memorable 7C project.", personalityTags: ["Mischief name", "Hard sandstone", "Session tactics"], decisionHint: "Choose it when playfulness helps you stay curious." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "appartenance-fontainebleau", name: "Appartenance", grade: "7C", type: "boulder", length: "boulder problem", style: "Fontainebleau hard bouldering with composed project identity.", summary: "Appartenance is a quieter hard card, useful when climbers want a project that feels precise rather than theatrical.", practiceFocus: ["precision", "body control", "attempt discipline"], bestFor: "Boulderers wanting a focused Fontainebleau project.", personalityTags: ["Quiet project", "Precision card", "Hard classic"], decisionHint: "Pick it when the route should reward composure." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "le-mandarin-fontainebleau", name: "Le Mandarin", grade: "7A", type: "boulder", length: "boulder problem", style: "Classic Bleau movement with balanced difficulty and style value.", summary: "Le Mandarin is useful for building a balanced Fontainebleau day: memorable, technical, and not only about maximum difficulty.", practiceFocus: ["footwork", "movement reading", "body position"], bestFor: "Boulderers wanting a classic 7A-style problem.", personalityTags: ["Balanced classic", "Technique route", "Forest style"], decisionHint: "Choose it when the session should be smart more than loud." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "l-arrache-coeur-fontainebleau", name: "L'Arrache Coeur", grade: "7A", type: "boulder", length: "boulder problem", style: "Fontainebleau classic with emotional name and practical movement value.", summary: "L'Arrache Coeur sounds dramatic, but it is useful as a readable classic for climbers building a serious circuit.", practiceFocus: ["movement tactics", "body tension", "skin pacing"], bestFor: "Boulderers wanting a memorable mid-hard Bleau problem.", personalityTags: ["Emotional name", "Circuit classic", "Movement card"], decisionHint: "Pick it when the name is dramatic but the plan stays calm." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "noir-desir-fontainebleau", name: "Noir Desir", grade: "7C", type: "boulder", length: "boulder problem", style: "Hard Bleau sandstone with dark-name atmosphere and focused project feel.", summary: "Noir Desir adds mood to the hard list. It is for climbers who want a serious problem that rewards measured attempts.", practiceFocus: ["hard moves", "attempt discipline", "body control"], bestFor: "Boulderers choosing a moody hard Fontainebleau project.", personalityTags: ["Dark mood", "Hard project", "Attempt quality"], decisionHint: "Choose it when the session should feel intense but controlled." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "la-directe-du-surplomb-fontainebleau", name: "La Directe du Surplomb", grade: "7B", type: "boulder", length: "boulder problem", style: "Direct overhanging Fontainebleau climbing with compact power lessons.", summary: "La Directe du Surplomb is a clear power card: direct, physical, and useful for climbers who want the day to have a defined theme.", practiceFocus: ["overhang power", "body tension", "try quality"], bestFor: "Boulderers wanting a focused steep Fontainebleau problem.", personalityTags: ["Direct line", "Power lesson", "Session theme"], decisionHint: "Pick it when steep power is the goal." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "l-oeuf-fontainebleau", name: "L'Oeuf", grade: "6C", type: "boulder", length: "boulder problem", style: "Classic Fontainebleau shape problem with playful movement value.", summary: "L'Oeuf keeps the list fun and useful. It is a card for climbers who want a memorable shape more than a hard number.", practiceFocus: ["movement curiosity", "footwork", "body position"], bestFor: "Visitors building a varied Fontainebleau circuit.", personalityTags: ["Shape classic", "Playful route", "Circuit useful"], decisionHint: "Choose it when curiosity should lead the session." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["fontainebleau-france"], id: "le-surplomb-statue-fontainebleau", name: "Le Surplomb de la Statue", grade: "7A", type: "boulder", length: "boulder problem", style: "Fontainebleau overhang classic with physical but readable movement.", summary: "Le Surplomb de la Statue gives the route list another useful steep classic for climbers who want power without losing technique.", practiceFocus: ["overhang movement", "body tension", "foot placement"], bestFor: "Boulderers wanting a classic steep 7A-style problem.", personalityTags: ["Steep classic", "Power technique", "Readable project"], decisionHint: "Pick it when physical climbing should still feel thoughtful." })
  ],
  "kalymnos-greece": [
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "magma-kalymnos", name: "Magma", grade: "7c", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with hot-name energy and serious project feel.", summary: "Magma is a hard island card for climbers who want the trip to include one route with heat, focus, and a clear training question.", practiceFocus: ["power endurance", "redpoint patience", "rest timing"], bestFor: "Sport climbers comparing harder Kalymnos objectives.", personalityTags: ["Hot project", "Island endurance", "Hard sport"], decisionHint: "Choose it when the day should feel fiery but organized." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "lucky-luca-kalymnos", name: "Lucky Luca", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with upbeat classic-trip value.", summary: "Lucky Luca is a practical island card: fun enough for vacation energy, focused enough to teach pacing.", practiceFocus: ["flow", "pump control", "confidence"], bestFor: "Sport climbers wanting a friendly but memorable Kalymnos target.", personalityTags: ["Upbeat classic", "Flow route", "Trip useful"], decisionHint: "Pick it when the route should keep the mood bright." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "meltemi-kalymnos", name: "Meltemi", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Island limestone with breezy name and useful flow lessons.", summary: "Meltemi is a good card for climbers who want a Kalymnos route to feel rhythmic rather than punishing.", practiceFocus: ["route flow", "rest timing", "movement economy"], bestFor: "Climbers building a balanced Kalymnos shortlist.", personalityTags: ["Breezy classic", "Flow lesson", "Balanced day"], decisionHint: "Choose it when rhythm sounds better than battle." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "carpe-diem-kalymnos", name: "Carpe Diem", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Kalymnos sport climbing with seize-the-day motivation and practical difficulty.", summary: "Carpe Diem is a route-finder card for climbers who want a memorable day without turning the whole trip into one hard project.", practiceFocus: ["confidence", "efficient movement", "pacing"], bestFor: "Sport climbers wanting a classic-feeling 7a target.", personalityTags: ["Day-seizer", "Trip classic", "Confidence route"], decisionHint: "Pick it when motivation is high and the plan should stay sane." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "afternoon-kalymnos", name: "Afternoon", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with relaxed name and real route value.", summary: "Afternoon is a good card for pacing the trip: still meaningful, but not every route needs to sound like a war drum.", practiceFocus: ["trip pacing", "movement flow", "rest awareness"], bestFor: "Climbers choosing a useful route for a lighter day.", personalityTags: ["Light day", "Flow route", "Trip pacing"], decisionHint: "Choose it when good climbing matters more than maximum intensity." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "les-amazones-kalymnos", name: "Les Amazones", grade: "6c+", type: "sport", length: "single-pitch sport route", style: "Friendlier Kalymnos limestone with classic mileage appeal.", summary: "Les Amazones gives the 40-route list a valuable lower-pressure card: useful for good movement, group planning, and sustainable trip days.", practiceFocus: ["confidence mileage", "limestone flow", "group pacing"], bestFor: "Climbers wanting a friendlier Kalymnos option.", personalityTags: ["Friendly classic", "Mileage day", "Group useful"], decisionHint: "Pick it when the day should keep the trip healthy." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "morgan-kalymnos", name: "Morgan", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Kalymnos sport climbing with clean classic-list value.", summary: "Morgan is a practical route card for climbers who want another realistic 7a-ish choice with enough character to remember.", practiceFocus: ["movement flow", "pacing", "confidence"], bestFor: "Sport climbers comparing moderate-hard Kalymnos routes.", personalityTags: ["Realistic target", "Flow route", "Trip list"], decisionHint: "Choose it when the route should be memorable and usable." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "saphira-kalymnos", name: "Saphira", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with jewel-name mood and harder bridge value.", summary: "Saphira is a harder bridge card for climbers who want a route that feels special without becoming elite-only.", practiceFocus: ["project pacing", "rest strategy", "movement economy"], bestFor: "Sport climbers stepping into harder Kalymnos projects.", personalityTags: ["Jewel card", "Hard bridge", "Project useful"], decisionHint: "Pick it when a harder route should still feel reachable." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "ciao-vecchio-kalymnos", name: "Ciao Vecchio", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with social-trip character and project bite.", summary: "Ciao Vecchio is a good card when the route should feel like part of the island culture but still ask for focused climbing.", practiceFocus: ["pump control", "route reading", "attempt review"], bestFor: "Sport climbers wanting a memorable Kalymnos 7b-style target.", personalityTags: ["Social classic", "Project bite", "Island mood"], decisionHint: "Choose it when personality and process both matter." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "rastapopoulos-kalymnos", name: "Rastapopoulos", grade: "7a+", type: "sport", length: "single-pitch sport route", style: "Kalymnos sport climbing with playful name and pump-management lessons.", summary: "Rastapopoulos is a fun route card with real training value. It belongs on days when you want a smile and a plan.", practiceFocus: ["pump management", "movement efficiency", "confidence"], bestFor: "Climbers wanting a playful but useful Kalymnos route.", personalityTags: ["Playful name", "Pump lesson", "Trip useful"], decisionHint: "Pick it when fun should stay structured." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "sideroporta-kalymnos", name: "Sideroporta", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Island limestone with steady classic-route energy.", summary: "Sideroporta keeps the list balanced: a useful route for rhythm, movement, and a trip day that does not need to scream.", practiceFocus: ["movement rhythm", "confidence", "limestone reading"], bestFor: "Sport climbers wanting a steady Kalymnos choice.", personalityTags: ["Steady classic", "Rhythm route", "Balanced day"], decisionHint: "Choose it when the best route is the one you climb well." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "armata-sikati-kalymnos", name: "Armata Sikati", grade: "8a", type: "sport", length: "single-pitch sport route", style: "Hard Kalymnos limestone with sharper project identity.", summary: "Armata Sikati is a high-end route card for climbers who want the Kalymnos list to include serious sport-climbing ambition.", practiceFocus: ["hard endurance", "redpoint tactics", "attempt quality"], bestFor: "Advanced sport climbers comparing harder Kalymnos projects.", personalityTags: ["Hard island", "Project route", "Serious sport"], decisionHint: "Pick it when ambition deserves a clear project frame." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "nirvana-kalymnos", name: "Nirvana", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with peaceful name and serious route value.", summary: "Nirvana sounds calm, but it still belongs in the project conversation. It is useful when the goal is flow under pressure.", practiceFocus: ["flow under pump", "rest timing", "mental reset"], bestFor: "Sport climbers wanting a harder route with rhythm.", personalityTags: ["Calm name", "Project flow", "Limestone focus"], decisionHint: "Choose it when effort should feel composed." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "la-belle-helene-kalymnos", name: "La Belle Helene", grade: "7a", type: "sport", length: "single-pitch sport route", style: "Classic-feeling Kalymnos limestone with graceful route-choice value.", summary: "La Belle Helene is a graceful card for climbers who want a memorable route without forcing the day into hard-project mode.", practiceFocus: ["movement quality", "flow", "confidence"], bestFor: "Climbers wanting an elegant Kalymnos sport route.", personalityTags: ["Graceful classic", "Flow route", "Confidence"], decisionHint: "Pick it when quality movement is the day's main point." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "satyros-kalymnos", name: "Satyros", grade: "7b", type: "sport", length: "single-pitch sport route", style: "Kalymnos limestone with mythic flavor and harder sport focus.", summary: "Satyros adds another mythic-feeling project card to Kalymnos, useful for climbers who want something memorable but measurable.", practiceFocus: ["project tactics", "pump control", "movement reading"], bestFor: "Sport climbers comparing harder Kalymnos targets.", personalityTags: ["Mythic mood", "Hard bridge", "Project focus"], decisionHint: "Choose it when the route should be both memorable and specific." }),
    v2ImportedRoute({ sourcePack: v2SourcePacks["kalymnos-greece"], id: "little-blue-kalymnos", name: "Little Blue", grade: "6c+", type: "sport", length: "single-pitch sport route", style: "Friendlier island limestone with color, flow, and mileage value.", summary: "Little Blue is a smart route card for sustainable trip planning. It gives the list another quality option below the heavier project grades.", practiceFocus: ["confidence mileage", "flow", "movement economy"], bestFor: "Climbers wanting a lighter Kalymnos classic.", personalityTags: ["Friendly route", "Mileage value", "Island flow"], decisionHint: "Pick it when the day should make tomorrow better too." })
  ]
};

type V4RouteSeed = {
  id: string;
  name: string;
  grade: string;
  type: RouteHighlight["type"];
  length: string;
  style: string;
  focus: string[];
  bestFor: string;
  tags: string[];
  decision: string;
};

function v4Route(slug: string, seed: V4RouteSeed): RouteHighlight {
  return v2ImportedRoute({
    sourcePack: v2SourcePacks[slug],
    id: seed.id,
    name: seed.name,
    grade: seed.grade,
    type: seed.type,
    length: seed.length,
    style: seed.style,
    summary: `${seed.name} is a V2.2 metadata card for choosing route direction, style, and readiness. ClimbAtlas keeps the note original and sends detailed beta to the linked external resources.`,
    practiceFocus: seed.focus,
    bestFor: seed.bestFor,
    personalityTags: seed.tags,
    decisionHint: seed.decision,
    editorialTips: [
      "Use this card to compare style and commitment, then verify current route details externally.",
      "ClimbAtlas does not publish approach, descent, protection, topo, pitch-by-pitch beta, comments, or ratings."
    ]
  });
}

const v4PopularRouteAdditions: Record<string, RouteHighlight[]> = {
  "chamonix-france": [
    v4Route("chamonix-france", { id: "papillons-ridge-chamonix", name: "Papillons Ridge", grade: "AD / alpine ridge metadata", type: "multi-pitch", length: "alpine ridge route metadata", style: "Classic Chamonix ridge climbing with airy but approachable adventure energy.", focus: ["ridge movement", "alpine pacing", "exposure comfort"], bestFor: "Teams wanting a Chamonix ridge objective below the biggest north-face mood.", tags: ["Ridge classic", "Airy movement", "Alpine day"], decision: "Pick it when the day should feel alpine, scenic, and skill-building." }),
    v4Route("chamonix-france", { id: "frison-roche-route-chamonix", name: "Frison-Roche Route", grade: "D / alpine rock metadata", type: "multi-pitch", length: "alpine rock route metadata", style: "Chamonix alpine rock with classic guidebook-era atmosphere.", focus: ["alpine rock systems", "team rhythm", "route judgment"], bestFor: "Teams comparing classic Aiguille routes with real mountain context.", tags: ["Alpine rock", "Classic atmosphere", "Team systems"], decision: "Choose it when rock climbing and mountain judgment should both matter." }),
    v4Route("chamonix-france", { id: "chapelle-de-la-gliere-chamonix", name: "Chapelle de la Gliere", grade: "6a / alpine rock metadata", type: "multi-pitch", length: "alpine rock route metadata", style: "Granite spire-style climbing with Chamonix position and technical charm.", focus: ["granite movement", "route flow", "exposure comfort"], bestFor: "Climbers wanting a technical alpine-rock day with less north-face seriousness.", tags: ["Granite charm", "Spire mood", "Technical day"], decision: "Pick it when the day should be precise rather than huge." }),
    v4Route("chamonix-france", { id: "aiguille-m-nne-ridge-chamonix", name: "Aiguille de l'M NNE Ridge", grade: "AD / ridge metadata", type: "multi-pitch", length: "alpine ridge route metadata", style: "Aiguille ridge climbing with compact Chamonix training value.", focus: ["ridge tactics", "moving together", "alpine confidence"], bestFor: "Teams building confidence for longer Chamonix ridges.", tags: ["Ridge lesson", "Compact alpine", "Confidence route"], decision: "Choose it when the route should make ridge systems smoother." }),
    v4Route("chamonix-france", { id: "peigne-contamine-chamonix", name: "Aiguille du Peigne Contamine Route", grade: "TD / alpine rock metadata", type: "multi-pitch", length: "alpine rock route metadata", style: "Serious Aiguille granite with route-choice value for technical alpine climbers.", focus: ["technical granite", "team systems", "commitment judgment"], bestFor: "Experienced teams comparing harder Chamonix rock objectives.", tags: ["Technical alpine", "Aiguille granite", "Serious day"], decision: "Pick it when competence matters more than collecting names." }),
    v4Route("chamonix-france", { id: "aiguille-midi-south-face-chamonix", name: "Aiguille du Midi South Face", grade: "6a-6b metadata", type: "multi-pitch", length: "alpine rock face metadata", style: "High-access granite face climbing with Chamonix skyline energy.", focus: ["altitude pacing", "granite movement", "weather judgment"], bestFor: "Climbers wanting technical rock with unmistakable Chamonix atmosphere.", tags: ["Skyline route", "Granite face", "Weather aware"], decision: "Choose it when access feels easy but mountain judgment still stays central." }),
    v4Route("chamonix-france", { id: "contamine-grisolle-chamonix", name: "Contamine-Grisolle", grade: "TD / alpine rock metadata", type: "multi-pitch", length: "alpine rock route metadata", style: "Classic Chamonix granite face climbing with technical poise.", focus: ["face climbing", "altitude composure", "team pacing"], bestFor: "Experienced alpine rock teams wanting a technical classic.", tags: ["Granite classic", "Technical poise", "Alpine face"], decision: "Pick it when the day should feel sharp and classic." }),
    v4Route("chamonix-france", { id: "chere-couloir-chamonix", name: "Chere Couloir", grade: "D / ice route metadata", type: "multi-pitch", length: "alpine ice route metadata", style: "Accessible-feeling Chamonix ice with conditions-first decision value.", focus: ["ice movement", "conditions judgment", "efficient systems"], bestFor: "Alpine climbers comparing moderate ice objectives when conditions align.", tags: ["Ice classic", "Conditions card", "System practice"], decision: "Choose it only when current conditions and team systems make sense." }),
    v4Route("chamonix-france", { id: "modica-noury-chamonix", name: "Modica-Noury", grade: "TD / ice route metadata", type: "multi-pitch", length: "alpine ice route metadata", style: "Steeper Chamonix ice/mixed line with sharper conditions dependence.", focus: ["ice endurance", "conditions reading", "commitment"], bestFor: "Experienced teams comparing more serious ice objectives.", tags: ["Steep ice", "Conditions first", "Serious line"], decision: "Pick it when the route choice is driven by current conditions, not wishful thinking." }),
    v4Route("chamonix-france", { id: "supercouloir-chamonix", name: "Supercouloir", grade: "TD+ / mixed route metadata", type: "multi-pitch", length: "alpine mixed route metadata", style: "Major Chamonix mixed objective with big reputation and real seriousness.", focus: ["mixed systems", "cold endurance", "commitment judgment"], bestFor: "Experienced alpine teams studying major Chamonix north-side objectives.", tags: ["Mixed legend", "Serious alpine", "Commitment card"], decision: "Choose it as a major objective only when preparation and conditions both line up." }),
    v4Route("chamonix-france", { id: "gabarrou-albinoni-chamonix", name: "Gabarrou-Albinoni", grade: "TD+ / mixed route metadata", type: "multi-pitch", length: "alpine mixed route metadata", style: "Chamonix mixed climbing with classic winter-route identity.", focus: ["mixed climbing", "conditions timing", "team efficiency"], bestFor: "Alpine teams comparing classic mixed lines.", tags: ["Winter classic", "Mixed systems", "Timing route"], decision: "Pick it when the conditions window is the main story." }),
    v4Route("chamonix-france", { id: "valeria-gully-chamonix", name: "Valeria Gully", grade: "D / ice route metadata", type: "multi-pitch", length: "alpine ice route metadata", style: "Chamonix gully climbing with focused ice and alpine-system value.", focus: ["ice technique", "rope systems", "conditions awareness"], bestFor: "Teams wanting an ice objective with clear systems practice.", tags: ["Gully route", "Ice practice", "Alpine systems"], decision: "Choose it when the day should tune ice systems." }),
    v4Route("chamonix-france", { id: "eugster-diagonal-chamonix", name: "Eugster Diagonal", grade: "TD / alpine route metadata", type: "multi-pitch", length: "alpine face route metadata", style: "Historic Chamonix face climbing with serious conditions and commitment.", focus: ["face tactics", "conditions judgment", "mental composure"], bestFor: "Experienced teams comparing classic alpine face lines.", tags: ["Historic face", "Serious day", "Conditions route"], decision: "Pick it when the route should test decision-making as much as climbing." }),
    v4Route("chamonix-france", { id: "swiss-route-les-courtes-chamonix", name: "Swiss Route on Les Courtes", grade: "TD / north-face metadata", type: "multi-pitch", length: "north-face route metadata", style: "North-face Chamonix climbing with old-school alpine seriousness.", focus: ["north-face pacing", "cold systems", "commitment"], bestFor: "Experienced alpine teams studying north-face progression.", tags: ["North face", "Alpine serious", "Cold systems"], decision: "Choose it when the day belongs in a north-face plan, not a casual list." }),
    v4Route("chamonix-france", { id: "couturier-couloir-chamonix", name: "Couturier Couloir", grade: "D+ / snow-ice metadata", type: "multi-pitch", length: "alpine couloir metadata", style: "Big Chamonix snow/ice couloir with classic mountain scale.", focus: ["snow-ice endurance", "timing", "alpine judgment"], bestFor: "Teams comparing larger Chamonix snow and ice objectives.", tags: ["Big couloir", "Mountain scale", "Timing route"], decision: "Pick it when conditions and timing are the first questions." }),
    v4Route("chamonix-france", { id: "whymper-couloir-chamonix", name: "Whymper Couloir", grade: "AD+ / snow-ice metadata", type: "multi-pitch", length: "alpine couloir metadata", style: "Classic Aiguille Verte snow/ice objective with historical weight.", focus: ["snow-ice pacing", "early timing", "mountain judgment"], bestFor: "Alpine teams wanting a historic Chamonix couloir reference.", tags: ["Historic couloir", "Aiguille Verte", "Timing card"], decision: "Choose it when the mountain schedule matters more than the grade." }),
    v4Route("chamonix-france", { id: "forbes-arete-chardonnet-chamonix", name: "Forbes Arete on Aiguille du Chardonnet", grade: "AD / ridge metadata", type: "multi-pitch", length: "alpine ridge metadata", style: "Elegant snow-and-rock ridge with classic Chamonix training value.", focus: ["ridge pacing", "mixed terrain", "team movement"], bestFor: "Teams building alpine ridge confidence.", tags: ["Elegant ridge", "Mixed terrain", "Training classic"], decision: "Pick it when the team should practice moving well together." }),
    v4Route("chamonix-france", { id: "migot-spur-chardonnet-chamonix", name: "Migot Spur", grade: "D / alpine spur metadata", type: "multi-pitch", length: "alpine spur route metadata", style: "Chamonix spur climbing with larger mountain feel and route-choice seriousness.", focus: ["snow-ice systems", "route timing", "commitment"], bestFor: "Teams comparing bigger Chardonnet-style objectives.", tags: ["Spur route", "Alpine systems", "Mountain day"], decision: "Choose it when the team wants more scale and has the systems for it." }),
    v4Route("chamonix-france", { id: "kuffner-arete-chamonix", name: "Kuffner Arete", grade: "D / ridge metadata", type: "multi-pitch", length: "long alpine ridge metadata", style: "Long classic ridge climbing with serious Chamonix/Italian-side character.", focus: ["long ridge pacing", "exposure", "team endurance"], bestFor: "Experienced teams comparing longer alpine ridge objectives.", tags: ["Long ridge", "Classic alpine", "Team endurance"], decision: "Pick it when the ridge itself is the trip objective." }),
    v4Route("chamonix-france", { id: "peuterey-integral-chamonix", name: "Peuterey Integral", grade: "major alpine ridge metadata", type: "multi-pitch", length: "major alpine ridge traverse metadata", style: "Huge Mont Blanc ridge objective with expedition-scale decision value.", focus: ["major alpine planning", "endurance", "risk judgment"], bestFor: "Highly experienced teams studying major Mont Blanc ridge objectives.", tags: ["Major objective", "Expedition scale", "Serious ridge"], decision: "Use it as an aspirational compass unless your alpine systems are already mature." }),
    v4Route("chamonix-france", { id: "innominata-ridge-chamonix", name: "Innominata Ridge", grade: "D+ / ridge metadata", type: "multi-pitch", length: "long alpine ridge metadata", style: "Classic Mont Blanc ridge with commitment, beauty, and long-day seriousness.", focus: ["ridge endurance", "team systems", "alpine judgment"], bestFor: "Experienced teams comparing serious Mont Blanc approaches.", tags: ["Mont Blanc ridge", "Commitment", "Long day"], decision: "Pick it when the route choice includes the whole mountain, not only the climbing." }),
    v4Route("chamonix-france", { id: "arete-du-diable-chamonix", name: "Arete du Diable", grade: "D+ / ridge metadata", type: "multi-pitch", length: "alpine ridge metadata", style: "Dramatic ridge climbing with spires, exposure, and classic Chamonix flavor.", focus: ["ridge movement", "exposure comfort", "efficient transitions"], bestFor: "Teams wanting a dramatic ridge objective with real alpine systems.", tags: ["Dramatic ridge", "Spire traverse", "Exposure"], decision: "Choose it when airy movement is part of the attraction." }),
    v4Route("chamonix-france", { id: "aiguilles-du-diable-traverse-chamonix", name: "Traverse of the Aiguilles du Diable", grade: "D+ / traverse metadata", type: "multi-pitch", length: "alpine traverse metadata", style: "Classic spire traverse with Chamonix drama and route-flow demands.", focus: ["traverse systems", "exposure", "team pacing"], bestFor: "Experienced teams wanting a complex ridge/traverse day.", tags: ["Spire traverse", "Complex day", "Team flow"], decision: "Pick it when the route should feel like a sequence of alpine decisions." }),
    v4Route("chamonix-france", { id: "croz-spur-chamonix", name: "Croz Spur", grade: "ED / north-face metadata", type: "multi-pitch", length: "major north-face route metadata", style: "Major Grandes Jorasses north-face objective with severe alpine identity.", focus: ["north-face commitment", "endurance", "risk judgment"], bestFor: "Expert alpine teams studying major north-face objectives.", tags: ["Major north face", "Expert only", "Commitment"], decision: "Use it as a serious reference, not a casual recommendation." }),
    v4Route("chamonix-france", { id: "walker-spur-chamonix", name: "Walker Spur", grade: "ED / north-face metadata", type: "multi-pitch", length: "major north-face route metadata", style: "Legendary Grandes Jorasses route with huge alpine reputation.", focus: ["major alpine endurance", "technical systems", "conditions judgment"], bestFor: "Expert teams comparing world-class alpine objectives.", tags: ["Legend route", "North face", "Expert card"], decision: "Choose it only when the route is already inside a mature alpine plan." }),
    v4Route("chamonix-france", { id: "hirondelles-ridge-chamonix", name: "Hirondelles Ridge", grade: "D / ridge metadata", type: "multi-pitch", length: "alpine ridge metadata", style: "Grandes Jorasses ridge climbing with scale and old-school alpine mood.", focus: ["ridge endurance", "route judgment", "team pacing"], bestFor: "Experienced teams comparing long ridge objectives.", tags: ["Long ridge", "Old-school alpine", "Scale"], decision: "Pick it when the day should be about mountain scale." }),
    v4Route("chamonix-france", { id: "tournier-spur-chamonix", name: "Tournier Spur", grade: "D / spur metadata", type: "multi-pitch", length: "alpine spur route metadata", style: "Chamonix spur climbing with classic mountain-route decision value.", focus: ["alpine pacing", "mixed terrain", "systems"], bestFor: "Teams wanting a bigger spur-style objective.", tags: ["Spur route", "Alpine systems", "Mountain mood"], decision: "Choose it when the team wants more mountain than crag." }),
    v4Route("chamonix-france", { id: "north-ridge-aiguille-du-midi-chamonix", name: "North Ridge of the Aiguille du Midi", grade: "AD / ridge metadata", type: "multi-pitch", length: "alpine ridge route metadata", style: "Accessible Chamonix ridge climbing with altitude and exposure lessons.", focus: ["altitude awareness", "ridge movement", "exposure comfort"], bestFor: "Teams practicing Chamonix ridge systems in a recognizable setting.", tags: ["Accessible ridge", "Altitude lesson", "Exposure"], decision: "Pick it when the day should build comfort above the valley." })
  ],
  "ceuse-france": [
    v4Route("ceuse-france", { id: "berlin-ceuse", name: "Berlin", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Classic Ceuse face climbing with a technical, old-school aura.", focus: ["footwork", "rest discipline", "sequence memory"], bestFor: "Sport climbers wanting a historic Ceuse reference below the hardest sector legends.", tags: ["Historic sport", "Limestone face", "Technique card"], decision: "Pick it when you want Ceuse character without choosing the headline extremes." }),
    v4Route("ceuse-france", { id: "blocage-violent-ceuse", name: "Blocage Violent", grade: "7b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Punchy limestone sport climbing with a bouldery name and route-finder value.", focus: ["power bursts", "finger accuracy", "clip rhythm"], bestFor: "Climbers comparing shorter, sharper Ceuse routes.", tags: ["Power burst", "Limestone", "Compact challenge"], decision: "Choose it when you want intensity without committing to a huge endurance project." }),
    v4Route("ceuse-france", { id: "les-colonnettes-ceuse", name: "Les Colonnettes", grade: "7a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse limestone with approachable classic energy and technical learning value.", focus: ["limestone reading", "movement economy", "confidence"], bestFor: "Visitors building a first Ceuse list around recognizable moderate classics.", tags: ["Moderate classic", "Technique", "First-list candidate"], decision: "Pick it when you want a route that helps you understand the cliff." }),
    v4Route("ceuse-france", { id: "makach-walou-ceuse", name: "Makach Walou", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse sport climbing with sustained attention and playful name recognition.", focus: ["endurance", "mental pacing", "flow"], bestFor: "Climbers wanting a classic-feeling project without jumping into 8th-grade mythology.", tags: ["Endurance", "Classic mood", "Project rhythm"], decision: "Choose it when you want a route that rewards patience over panic." }),
    v4Route("ceuse-france", { id: "carte-blanche-ceuse", name: "Carte Blanche", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Clean Ceuse sport climbing that sits well as an 8a decision card.", focus: ["redpoint tactics", "body tension", "efficient rests"], bestFor: "Climbers comparing first or repeat 8a targets at Ceuse.", tags: ["8a card", "Redpoint", "Limestone craft"], decision: "Pick it when you want to test redpoint habits in a famous setting." }),
    v4Route("ceuse-france", { id: "privilege-du-serpent-ceuse", name: "Privilege du Serpent", grade: "7c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Technical Ceuse limestone with a memorable name and careful-movement mood.", focus: ["precision", "footwork", "route reading"], bestFor: "Climbers who like routes that ask for accuracy rather than only fitness.", tags: ["Technical", "Precision", "Ceuse flavor"], decision: "Choose it when you want the route to feel like a puzzle." }),
    v4Route("ceuse-france", { id: "natilik-ceuse", name: "Natilik", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Ceuse sport climbing with sustained project energy.", focus: ["power endurance", "rest strategy", "confidence"], bestFor: "Advanced sport climbers comparing harder Ceuse objectives.", tags: ["Hard sport", "Project route", "Power endurance"], decision: "Pick it when you want a serious project but not the most famous circus." }),
    v4Route("ceuse-france", { id: "les-rois-du-petrole-ceuse", name: "Les Rois du Petrole", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse limestone climbing with hard-route reputation and endurance emphasis.", focus: ["endurance", "movement memory", "attempt quality"], bestFor: "Sport climbers building a hard Ceuse shortlist.", tags: ["Hard classic", "Endurance", "Project pacing"], decision: "Choose it when you want a hard route that feels like a campaign." }),
    v4Route("ceuse-france", { id: "une-arquee-pour-le-criquet-ceuse", name: "Une Arquee pour le Criquet", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "A distinctive Ceuse route-name card for crimpy limestone style comparison.", focus: ["finger strength", "precision", "body position"], bestFor: "Climbers who enjoy technical finger climbing and route-name folklore.", tags: ["Finger puzzle", "Limestone", "Memorable name"], decision: "Pick it when small holds sound more fun than frightening." }),
    v4Route("ceuse-france", { id: "dolce-vita-ceuse", name: "Dolce Vita", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard limestone sport climbing with a polished, redpoint-oriented feel.", focus: ["redpoint flow", "core tension", "endurance"], bestFor: "Climbers comparing elegant harder Ceuse routes.", tags: ["Elegant sport", "Redpoint", "Hard limestone"], decision: "Choose it when you want the project to feel stylish as well as hard." }),
    v4Route("ceuse-france", { id: "vagabond-occident-ceuse", name: "Vagabond d'Occident", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse sport climbing with travel-day romance and steady technical value.", focus: ["route reading", "flow", "confidence"], bestFor: "Visitors wanting classic Ceuse flavor in the upper-7 range.", tags: ["Traveler card", "Flow", "Classic flavor"], decision: "Pick it when the day wants a route with personality." }),
    v4Route("ceuse-france", { id: "demi-lune-ceuse", name: "Demi Lune", grade: "7b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Limestone sport climbing with moderate project energy and clean decision value.", focus: ["footwork", "rest timing", "movement economy"], bestFor: "Climbers building confidence on Ceuse's lower-to-mid grades.", tags: ["Moderate sport", "Confidence", "Limestone craft"], decision: "Choose it when you want to learn the cliff before chasing numbers." }),
    v4Route("ceuse-france", { id: "petit-tom-ceuse", name: "Petit Tom", grade: "7a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Friendly-looking Ceuse sport route with technique-first learning value.", focus: ["foot placement", "relaxation", "outdoor rhythm"], bestFor: "Climbers easing into Ceuse's style.", tags: ["Warm-up mind", "Technique", "First Ceuse"], decision: "Pick it when your main goal is to settle into the stone." }),
    v4Route("ceuse-france", { id: "lapinerie-ceuse", name: "Lapinerie", grade: "7b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Playful Ceuse limestone card for climbers who like movement variety.", focus: ["movement variety", "clip rhythm", "confidence"], bestFor: "Visitors who want a lighter-feeling entry in a serious crag.", tags: ["Playful", "Limestone", "Movement variety"], decision: "Choose it when the day needs less ego and more curiosity." }),
    v4Route("ceuse-france", { id: "bourinator-ceuse", name: "Bourinator", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Harder Ceuse sport climbing with a name that sounds like it came with a wink.", focus: ["power endurance", "attempt quality", "mental reset"], bestFor: "Climbers wanting an 8a project with a less solemn personality.", tags: ["Hard sport", "Playful name", "Power endurance"], decision: "Pick it when you want to try hard without becoming dramatic about it." }),
    v4Route("ceuse-france", { id: "radote-joli-pepere-ceuse", name: "Radote Joli Pepere", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Technical Ceuse route with classic limestone reading demands.", focus: ["reading sequences", "footwork", "calm redpointing"], bestFor: "Climbers who enjoy figuring out movement more than brute forcing it.", tags: ["Technical", "Sequence reading", "Ceuse style"], decision: "Choose it when you want a route that makes you think a little." }),
    v4Route("ceuse-france", { id: "super-mickey-ceuse", name: "Super Mickey", grade: "7c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse sport route with cartoon-name energy and real redpoint focus.", focus: ["power endurance", "movement memory", "clip discipline"], bestFor: "Climbers wanting a memorable upper-7 project.", tags: ["Memorable name", "Redpoint", "Upper 7"], decision: "Pick it when the route should be serious but not too solemn." }),
    v4Route("ceuse-france", { id: "ami-caouette-ceuse", name: "L'Ami Caouette", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse limestone with hard-moderate project value and technical texture.", focus: ["technical endurance", "rest discipline", "confidence"], bestFor: "Climbers comparing 8a routes before choosing one to invest in.", tags: ["8a project", "Technical", "Decision card"], decision: "Choose it when you want a project that feels thoughtful." }),
    v4Route("ceuse-france", { id: "tontons-flingueurs-ceuse", name: "Les Tontons Flingueurs", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "A recognizable Ceuse name card with steady sport-climbing appeal.", focus: ["route rhythm", "confidence", "movement economy"], bestFor: "Visitors who like routes with personality and manageable project scope.", tags: ["Personality route", "Limestone", "Flow"], decision: "Pick it when you want a route with a little character in the title." }),
    v4Route("ceuse-france", { id: "rat-man-ceuse", name: "Rat Man", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Ceuse sport climbing with a compact, project-ready identity.", focus: ["power endurance", "precision", "mental reset"], bestFor: "Climbers wanting an 8a card that feels sharp and focused.", tags: ["Sharp sport", "Project", "Precision"], decision: "Choose it when the day wants a clean hard objective." }),
    v4Route("ceuse-france", { id: "couleur-du-vent-ceuse", name: "La Couleur du Vent", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse hard limestone with a poetic name and sustained focus.", focus: ["endurance", "breathing", "flow"], bestFor: "Climbers who like projects with a little drama in the name.", tags: ["Poetic name", "Hard limestone", "Flow"], decision: "Pick it when the route should feel like a serious little story." }),
    v4Route("ceuse-france", { id: "appat-ceuse", name: "L'Appat", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Ceuse sport climbing for focused redpoint sessions.", focus: ["redpoint tactics", "attempt spacing", "power endurance"], bestFor: "Advanced climbers comparing upper-grade Ceuse projects.", tags: ["Hard project", "Redpoint", "Endurance"], decision: "Choose it when you are ready to invest several good attempts." }),
    v4Route("ceuse-france", { id: "carte-vitale-ceuse", name: "Carte Vitale", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "A hard Ceuse card with a practical name and project-friendly style.", focus: ["tactics", "rest strategy", "movement economy"], bestFor: "Climbers wanting a clear 8a comparison route.", tags: ["8a card", "Tactics", "Practical project"], decision: "Pick it when your redpoint notebook is ready for honest notes." }),
    v4Route("ceuse-france", { id: "sales-gueules-ceuse", name: "Les Sales Gueules", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse sport climbing with cheeky-name personality and technical flow.", focus: ["flow", "clip rhythm", "confidence"], bestFor: "Visitors building a varied upper-7 list.", tags: ["Cheeky name", "Flow", "Upper 7"], decision: "Choose it when you want a route that keeps the mood loose." }),
    v4Route("ceuse-france", { id: "lapin-ou-canard-ceuse", name: "Lapin ou Canard", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Ceuse route with playful identity and movement-reading value.", focus: ["sequence reading", "body position", "redpoint patience"], bestFor: "Climbers who enjoy puzzly 8a choices.", tags: ["Puzzle route", "Playful", "Redpoint"], decision: "Pick it when the route should ask questions before giving answers." }),
    v4Route("ceuse-france", { id: "ma-jolie-ceuse", name: "Ma Jolie", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Ceuse limestone with elegant-name charm and steady route-finder value.", focus: ["footwork", "flow", "movement economy"], bestFor: "Climbers looking for a stylish upper-7 objective.", tags: ["Elegant", "Flow", "Limestone"], decision: "Choose it when the day wants something pretty but still honest." }),
    v4Route("ceuse-france", { id: "ange-en-decomposition-ceuse", name: "L'Ange en Decomposition", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Ceuse sport climbing with dramatic title and serious project energy.", focus: ["power endurance", "composure", "attempt quality"], bestFor: "Advanced climbers looking for a memorable hard project.", tags: ["Dramatic name", "Hard sport", "Project"], decision: "Pick it when you want a hard route with full Ceuse theater." }),
    v4Route("ceuse-france", { id: "privilege-du-lezard-ceuse", name: "Le Privilege du Lezard", grade: "7b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Moderate-to-hard Ceuse limestone with sunny wall-reading appeal.", focus: ["footwork", "wall reading", "confidence"], bestFor: "Climbers looking for a less severe but still memorable Ceuse card.", tags: ["Sunny limestone", "Technique", "Approachable"], decision: "Choose it when you want to enjoy the cliff without making it a trial." })
  ],
  "dolomites-italy": [
    v4Route("dolomites-italy", { id: "vinatzer-messner-dolomites", name: "Vinatzer-Messner Route", grade: "VI+ metadata", type: "multi-pitch", length: "big-wall limestone metadata", style: "Historic Dolomite wall climbing with old-school scale and route-choice seriousness.", focus: ["long-route pacing", "route judgment", "mental stamina"], bestFor: "Experienced teams comparing classic Dolomite wall objectives.", tags: ["Historic wall", "Dolomite scale", "Old-school"], decision: "Pick it when you want history and exposure in the same notebook entry." }),
    v4Route("dolomites-italy", { id: "philipp-flamm-dolomites", name: "Philipp-Flamm Route", grade: "VII- metadata", type: "multi-pitch", length: "major alpine wall metadata", style: "A large Dolomite face route with serious classic-wall energy.", focus: ["endurance", "systems", "exposure"], bestFor: "Teams choosing a big objective rather than a casual day out.", tags: ["Major wall", "Classic face", "Endurance"], decision: "Choose it when the day should feel like a proper Dolomite undertaking." }),
    v4Route("dolomites-italy", { id: "tempi-moderni-dolomites", name: "Tempi Moderni", grade: "VIII+ metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", style: "Modern-feeling Dolomite climbing with technical ambition and strong reputation.", focus: ["technical movement", "sustained effort", "composure"], bestFor: "Strong teams comparing harder free-climbing objectives.", tags: ["Modern classic", "Technical", "Hard multipitch"], decision: "Pick it when you want a wall route with a sportier pulse." }),
    v4Route("dolomites-italy", { id: "moderne-zeiten-dolomites", name: "Moderne Zeiten", grade: "VIII- metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", style: "A hard Dolomite route-choice card for climbers who like crisp modern wall style.", focus: ["technical precision", "endurance", "team rhythm"], bestFor: "Teams looking beyond the easiest classic trade routes.", tags: ["Modern wall", "Technical", "Project day"], decision: "Choose it when classic scenery should come with harder climbing." }),
    v4Route("dolomites-italy", { id: "via-italia-dolomites", name: "Via Italia", grade: "VI+ metadata", type: "multi-pitch", length: "long limestone wall metadata", style: "Classic Dolomite wall climbing with national-route-name gravity.", focus: ["long-route stamina", "limestone movement", "planning"], bestFor: "Climbers building a serious Dolomite classics list.", tags: ["Classic wall", "Long day", "Limestone"], decision: "Pick it when you want a name that feels like a chapter title." }),
    v4Route("dolomites-italy", { id: "delenda-carthago-dolomites", name: "Delenda Carthago", grade: "IX- metadata", type: "multi-pitch", length: "hard multipitch metadata", style: "Hard Dolomite free climbing with a dramatic title and demanding route-choice profile.", focus: ["hard free climbing", "commitment", "precision"], bestFor: "Strong multipitch teams considering high-end Dolomite objectives.", tags: ["Hard free", "Dramatic", "Expert card"], decision: "Choose it when the route should be hard enough to command the whole trip." }),
    v4Route("dolomites-italy", { id: "costantini-apollonio-dolomites", name: "Costantini-Apollonio Route", grade: "VI+ metadata", type: "multi-pitch", length: "classic limestone wall metadata", style: "Old-school Dolomite climbing with a strong historical line identity.", focus: ["traditional judgment", "wall pacing", "route reading"], bestFor: "Teams who enjoy classic names and traditional mountain rhythm.", tags: ["Old-school", "Classic line", "Wall craft"], decision: "Pick it when you want the route to feel rooted in Dolomite history." }),
    v4Route("dolomites-italy", { id: "via-mariacher-dolomites", name: "Via Mariacher", grade: "VII metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", style: "Elegant Dolomite climbing associated with a famous free-climbing generation.", focus: ["free-climbing technique", "flow", "confidence"], bestFor: "Climbers wanting a classic with a more athletic flavor.", tags: ["Free-climbing era", "Elegant", "Technique"], decision: "Choose it when you want history with a cleaner free-climbing feel." }),
    v4Route("dolomites-italy", { id: "via-abram-dolomites", name: "Via Abram", grade: "VI metadata", type: "multi-pitch", length: "classic wall metadata", style: "Traditional Dolomite limestone climbing with moderate-classic appeal.", focus: ["route reading", "team pacing", "exposure comfort"], bestFor: "Teams choosing a classic wall objective without chasing the hardest line.", tags: ["Traditional", "Moderate classic", "Exposure"], decision: "Pick it when you want a classic wall day with manageable ambition." }),
    v4Route("dolomites-italy", { id: "schubert-route-dolomites", name: "Schubert Route", grade: "VII- metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", style: "Dolomite wall climbing with a clean line and technical old-school feel.", focus: ["technical limestone", "pacing", "systems"], bestFor: "Teams comparing mid-hard classic wall options.", tags: ["Technical wall", "Classic feel", "Team rhythm"], decision: "Choose it when the team wants something serious but not extreme." }),
    v4Route("dolomites-italy", { id: "via-buhl-dolomites", name: "Via Buhl", grade: "VI+ metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Historic Dolomite climbing tied to a major alpinist name.", focus: ["history awareness", "limestone movement", "composure"], bestFor: "Climbers who like their route list to carry mountaineering culture.", tags: ["Historic name", "Classic limestone", "Alpine culture"], decision: "Pick it when the story matters almost as much as the stone." }),
    v4Route("dolomites-italy", { id: "pilastro-di-rozes-dolomites", name: "Pilastro di Rozes", grade: "VI metadata", type: "multi-pitch", length: "pillar route metadata", style: "A Dolomite pillar objective with strong visual identity and classic pacing.", focus: ["pillar climbing", "exposure", "long-route rhythm"], bestFor: "Teams wanting a pillar-shaped classic rather than a blank face problem.", tags: ["Pillar route", "Classic", "Exposure"], decision: "Choose it when the formation itself is part of the attraction." }),
    v4Route("dolomites-italy", { id: "via-dimai-punta-fiames-dolomites", name: "Via Dimai on Punta Fiames", grade: "V+ metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Accessible classic Dolomite climbing with historic Dimai-era flavor.", focus: ["movement economy", "team systems", "confidence"], bestFor: "Teams seeking a classic line with less high-grade pressure.", tags: ["Accessible classic", "Historic", "Confidence"], decision: "Pick it when the trip needs a classic day that does not eat the whole nervous system." }),
    v4Route("dolomites-italy", { id: "eotvos-dimai-dolomites", name: "Via Eotvos-Dimai", grade: "V+ metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Traditional Dolomite climbing with moderate-grade historical charm.", focus: ["traditional movement", "route flow", "exposure comfort"], bestFor: "Climbers easing into larger Dolomite classics.", tags: ["Moderate classic", "Traditional", "Historic"], decision: "Choose it when the goal is to learn Dolomite rhythm." }),
    v4Route("dolomites-italy", { id: "diedro-mayerl-dolomites", name: "Diedro Mayerl", grade: "VI+ metadata", type: "multi-pitch", length: "dihedral route metadata", style: "A named Dolomite dihedral card for climbers who like obvious features.", focus: ["dihedral technique", "stemming", "pacing"], bestFor: "Teams wanting a feature-driven classic.", tags: ["Dihedral", "Feature line", "Technique"], decision: "Pick it when you want the rock architecture to tell you the story." }),
    v4Route("dolomites-italy", { id: "via-delle-guide-dolomites", name: "Via delle Guide", grade: "V+ metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Guide-era Dolomite climbing with approachable classic atmosphere.", focus: ["team movement", "confidence", "limestone craft"], bestFor: "Climbers wanting a historically flavored lower-stress day.", tags: ["Guide route", "Approachable", "Classic mood"], decision: "Choose it when you want a route that feels like a guided tour through the style." }),
    v4Route("dolomites-italy", { id: "via-demetz-dolomites", name: "Via Demetz", grade: "V metadata", type: "multi-pitch", length: "classic limestone metadata", style: "A moderate Dolomite classic card for building wall confidence.", focus: ["movement economy", "systems", "exposure"], bestFor: "Teams stepping into multipitch Dolomite terrain.", tags: ["Moderate", "Confidence", "Classic"], decision: "Pick it when you want to bank a good day instead of proving a point." }),
    v4Route("dolomites-italy", { id: "via-piaz-dolomites", name: "Via Piaz", grade: "VI metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Historic Dolomite climbing with strong classic-line identity.", focus: ["traditional technique", "wall pacing", "history awareness"], bestFor: "Climbers who want classic-name value with a traditional feel.", tags: ["Historic", "Traditional", "Classic line"], decision: "Choose it when your list needs an old-school chapter." }),
    v4Route("dolomites-italy", { id: "via-trenker-dolomites", name: "Via Trenker", grade: "VI+ metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", style: "Classic Dolomite wall climbing with enough seriousness to shape the day.", focus: ["long-route systems", "limestone movement", "composure"], bestFor: "Teams comparing classic objectives in the mid-hard range.", tags: ["Classic wall", "Mid-hard", "Systems"], decision: "Pick it when the team is ready for a real wall day." }),
    v4Route("dolomites-italy", { id: "via-solda-dolomites", name: "Via Solda", grade: "VI metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Dolomite route history tied to a major mountaineering name.", focus: ["history awareness", "steady climbing", "team rhythm"], bestFor: "Climbers who enjoy routes with mountaineering lineage.", tags: ["Historic name", "Classic", "Alpine culture"], decision: "Choose it when the route story helps choose the route." }),
    v4Route("dolomites-italy", { id: "via-lacedelli-dolomites", name: "Via Lacedelli", grade: "VI metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Traditional Dolomite climbing connected to the region's deep alpine culture.", focus: ["traditional movement", "long-route pacing", "confidence"], bestFor: "Teams wanting a cultural classic rather than a pure difficulty target.", tags: ["Alpine culture", "Traditional", "Classic"], decision: "Pick it when history is a feature, not a footnote." }),
    v4Route("dolomites-italy", { id: "via-delle-trincee-dolomites", name: "Via delle Trincee", grade: "IV metadata", type: "multi-pitch", length: "easy alpine route metadata", style: "Lower-grade Dolomite terrain with strong mountain-context value.", focus: ["movement confidence", "terrain awareness", "easy systems"], bestFor: "Climbers wanting a lighter objective with mountain atmosphere.", tags: ["Easy alpine", "Context route", "Confidence"], decision: "Choose it when the day should be scenic and educational." }),
    v4Route("dolomites-italy", { id: "costantini-ghedina-dolomites", name: "Via Costantini-Ghedina", grade: "VI+ metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Classic Dolomite climbing with a crisp historical identity.", focus: ["route reading", "limestone technique", "pacing"], bestFor: "Teams building a refined Dolomite classics list.", tags: ["Classic", "Historical", "Limestone"], decision: "Pick it when you want a serious classic without chasing novelty." }),
    v4Route("dolomites-italy", { id: "via-tissi-dolomites", name: "Via Tissi", grade: "VI metadata", type: "multi-pitch", length: "classic limestone wall metadata", style: "Dolomite wall climbing with recognizable classic-route status.", focus: ["wall endurance", "traditional judgment", "team flow"], bestFor: "Teams who like classic wall days with old-school pacing.", tags: ["Classic wall", "Old-school", "Team flow"], decision: "Choose it when the day should feel broad, classic, and unhurried." }),
    v4Route("dolomites-italy", { id: "via-degli-scoiattoli-dolomites", name: "Via degli Scoiattoli", grade: "VI metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Dolomite climbing associated with the local Scoiattoli tradition.", focus: ["local history", "limestone movement", "confidence"], bestFor: "Climbers who like routes with local cultural flavor.", tags: ["Local culture", "Classic", "Limestone"], decision: "Pick it when you want a route that feels locally rooted." }),
    v4Route("dolomites-italy", { id: "via-innerkofler-dolomites", name: "Via Innerkofler", grade: "V+ metadata", type: "multi-pitch", length: "classic limestone metadata", style: "A moderate classic card linked to one of the Dolomites' famous mountain names.", focus: ["steady climbing", "history awareness", "team pacing"], bestFor: "Climbers looking for a classic without maximal difficulty.", tags: ["Moderate classic", "Historic name", "Steady"], decision: "Choose it when the best route is the one your team can enjoy well." }),
    v4Route("dolomites-italy", { id: "via-comici-salame-sassolungo-dolomites", name: "Via Comici on Salame del Sassolungo", grade: "VI metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Comici-era Dolomite climbing with steep-history flavor and strong line identity.", focus: ["historic style", "limestone technique", "exposure"], bestFor: "Climbers drawn to named formations and golden-age Dolomite stories.", tags: ["Comici era", "Historic", "Formation route"], decision: "Pick it when the route name makes you want to open a field notebook." }),
    v4Route("dolomites-italy", { id: "via-schober-dolomites", name: "Via Schober", grade: "VI metadata", type: "multi-pitch", length: "classic limestone metadata", style: "Traditional Dolomite multipitch with steady classic-route appeal.", focus: ["team pacing", "route reading", "traditional technique"], bestFor: "Teams wanting another grounded classic for comparison.", tags: ["Traditional", "Classic", "Steady"], decision: "Choose it when the shortlist needs a reliable old-school option." })
  ],
  "frankenjura-germany": [
    v4Route("frankenjura-germany", { id: "fight-club-frankenjura", name: "Fight Club", grade: "9b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Elite Frankenjura sport climbing with very hard, very specific project identity.", focus: ["limit strength", "finger power", "project discipline"], bestFor: "High-end climbers comparing modern Frankenjura testpieces.", tags: ["Elite sport", "Power", "Testpiece"], decision: "Use it as an elite benchmark, not a casual recommendation." }),
    v4Route("frankenjura-germany", { id: "classified-frankenjura", name: "Classified", grade: "9a/9a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Frankenjura limestone with compressed power and modern testpiece energy.", focus: ["power endurance", "finger strength", "attempt quality"], bestFor: "Elite sport climbers studying top-end Frankenjura routes.", tags: ["Modern testpiece", "Hard limestone", "Power"], decision: "Pick it only as part of a serious high-end project plan." }),
    v4Route("frankenjura-germany", { id: "geocache-frankenjura", name: "Geocache", grade: "9a metadata", type: "sport", length: "single-pitch limestone metadata", style: "High-end Frankenjura limestone with a compact, puzzle-like identity.", focus: ["specific strength", "beta memory externally", "patience"], bestFor: "Elite climbers comparing short hard projects.", tags: ["Elite puzzle", "Power", "Project"], decision: "Choose it when your training points toward very specific difficulty." }),
    v4Route("frankenjura-germany", { id: "becoming-frankenjura", name: "Becoming", grade: "9a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Modern hard Frankenjura route with serious redpoint profile.", focus: ["limit redpointing", "finger strength", "mental reset"], bestFor: "Climbers studying the region's newest high-end layer.", tags: ["Modern hard", "Redpoint", "Elite"], decision: "Use it as an aspirational card unless your current level is already nearby." }),
    v4Route("frankenjura-germany", { id: "pornographie-frankenjura", name: "Pornographie", grade: "9a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Frankenjura sport climbing with a famous, attention-grabbing name.", focus: ["power", "precision", "project pacing"], bestFor: "Advanced climbers comparing named hard routes in the Frankenjura canon.", tags: ["Hard sport", "Named testpiece", "Power"], decision: "Pick it when the shortlist is about hard limestone identity." }),
    v4Route("frankenjura-germany", { id: "ekel-frankenjura", name: "Ekel", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Frankenjura route with compact power and old-school bite.", focus: ["finger strength", "body tension", "attempt quality"], bestFor: "Strong sport climbers comparing 8c limestone problems.", tags: ["8c card", "Compact power", "Old-school bite"], decision: "Choose it when you want difficulty with little ceremony." }),
    v4Route("frankenjura-germany", { id: "slimline-frankenjura", name: "Slimline", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Classic hard Frankenjura sport climbing with a clean, compact profile.", focus: ["finger accuracy", "tension", "redpoint rhythm"], bestFor: "Climbers building a hard Frankenjura shortlist below 9a.", tags: ["Hard classic", "Compact", "Redpoint"], decision: "Pick it when you want a lean route that does not waste moves." }),
    v4Route("frankenjura-germany", { id: "stone-love-frankenjura", name: "Stone Love", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Frankenjura limestone with hard-route romance and focused project appeal.", focus: ["power endurance", "confidence", "movement memory"], bestFor: "Climbers who want a hard route with a friendlier name than the usual cave drama.", tags: ["Hard limestone", "Project", "Memorable name"], decision: "Choose it when you want your hard project to sound less like a punishment." }),
    v4Route("frankenjura-germany", { id: "kamasutra-218-frankenjura", name: "Kamasutra 218", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "A distinctive Frankenjura hard route with technical body-position value.", focus: ["body position", "power", "sequence memory"], bestFor: "Climbers who like compact routes with weird little demands.", tags: ["Body puzzle", "Hard sport", "Specific"], decision: "Pick it when the route should feel strange in a useful way." }),
    v4Route("frankenjura-germany", { id: "matador-frankenjura", name: "Matador", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard limestone route with a bold-name, power-focused feel.", focus: ["power", "precision", "confidence"], bestFor: "Climbers comparing memorable 8b+ objectives.", tags: ["Power", "Bold name", "Hard limestone"], decision: "Choose it when you want a route with a strong title and sharper holds." }),
    v4Route("frankenjura-germany", { id: "burn-4-you-frankenjura", name: "Burn 4 You", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Frankenjura hard sport climbing with redpoint heat and compact intensity.", focus: ["power endurance", "attempt spacing", "skin care"], bestFor: "Climbers ready to manage hard attempts carefully.", tags: ["8c card", "Intensity", "Redpoint"], decision: "Pick it when you can handle short hard attempts without spiraling." }),
    v4Route("frankenjura-germany", { id: "odd-fellows-frankenjura", name: "Odd Fellows", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard limestone route with quirky identity and specific movement demands.", focus: ["specific strength", "movement reading", "patience"], bestFor: "Climbers who enjoy routes that do not feel generic.", tags: ["Quirky", "Hard sport", "Specific"], decision: "Choose it when weirdness is a plus." }),
    v4Route("frankenjura-germany", { id: "intercooler-frankenjura", name: "Intercooler", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Frankenjura sport route with compact power and cool-headed redpoint value.", focus: ["power", "cool pacing", "attempt quality"], bestFor: "Climbers comparing intense 8c cards.", tags: ["Compact power", "8c", "Cool head"], decision: "Pick it when the route calls for fewer, better tries." }),
    v4Route("frankenjura-germany", { id: "unplugged-frankenjura", name: "Unplugged", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Frankenjura limestone with a stripped-down, power-first profile.", focus: ["finger power", "body tension", "precision"], bestFor: "Climbers wanting a focused hard route without extra theatrics.", tags: ["Power first", "Hard limestone", "Clean profile"], decision: "Choose it when simple and hard sounds good." }),
    v4Route("frankenjura-germany", { id: "witchcraft-frankenjura", name: "Witchcraft", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "A hard limestone card with a magic-name mood and technical demands.", focus: ["precision", "finger strength", "movement reading"], bestFor: "Climbers who enjoy routes that feel a little mysterious.", tags: ["Mysterious", "Technical", "Hard sport"], decision: "Pick it when you want to solve something small and stubborn." }),
    v4Route("frankenjura-germany", { id: "dicker-bert-frankenjura", name: "Dicker Bert", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Recognizable hard Frankenjura route with a classic-project feel.", focus: ["power endurance", "confidence", "redpoint habits"], bestFor: "Climbers stepping into harder Frankenjura territory.", tags: ["8a+ card", "Classic project", "Confidence"], decision: "Choose it when you want a serious but not elite project." }),
    v4Route("frankenjura-germany", { id: "chasin-the-trane-frankenjura", name: "Chasin the Trane", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Frankenjura sport route with jazz-title charm and technical focus.", focus: ["rhythm", "precision", "movement memory"], bestFor: "Climbers who like routes with rhythm and name personality.", tags: ["Rhythm", "Memorable name", "Technique"], decision: "Pick it when the day needs a little music in the movement." }),
    v4Route("frankenjura-germany", { id: "hitch-hike-the-plane-frankenjura", name: "Hitch Hike the Plane", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard sport route with a travel-weird title and sharp limestone style.", focus: ["power", "route reading", "confidence"], bestFor: "Climbers collecting memorable Frankenjura hard routes.", tags: ["Hard sport", "Odd title", "Power"], decision: "Choose it when you want a route that sounds as strange as it feels." }),
    v4Route("frankenjura-germany", { id: "pantera-frankenjura", name: "Pantera", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Frankenjura limestone with focused power and classic-project appeal.", focus: ["power", "tension", "attempt quality"], bestFor: "Climbers looking for an 8b target with a strong name.", tags: ["8b card", "Power", "Classic project"], decision: "Pick it when you want something direct and punchy." }),
    v4Route("frankenjura-germany", { id: "z-trip-frankenjura", name: "Z-Trip", grade: "8c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Very hard Frankenjura sport route for climbers comparing upper-tier projects.", focus: ["limit strength", "project strategy", "precision"], bestFor: "Advanced climbers looking near the top end of the region.", tags: ["Very hard", "Project", "Power"], decision: "Choose it when the trip is built around one serious objective." }),
    v4Route("frankenjura-germany", { id: "essential-frankenjura", name: "Essential", grade: "8c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Upper-end Frankenjura limestone with a name that fits the shortlist mood.", focus: ["power endurance", "mental pacing", "specific strength"], bestFor: "Climbers comparing the most important hard routes for their style.", tags: ["Upper-end", "Essential card", "Project"], decision: "Pick it when the route feels like the right kind of hard." }),
    v4Route("frankenjura-germany", { id: "elder-statesman-frankenjura", name: "The Elder Statesman", grade: "9a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Elite Frankenjura limestone with mature, composed project identity.", focus: ["limit redpointing", "patience", "specific strength"], bestFor: "Elite climbers comparing high-end modern routes.", tags: ["Elite", "Composed", "Testpiece"], decision: "Use it when the goal is a serious long-view project." }),
    v4Route("frankenjura-germany", { id: "battle-cat-frankenjura", name: "Battle Cat", grade: "9a metadata", type: "sport", length: "single-pitch limestone metadata", style: "High-end Frankenjura sport climbing with cartoon-name contrast and real difficulty.", focus: ["power", "attempt quality", "mental reset"], bestFor: "Elite climbers who can treat hard attempts calmly.", tags: ["Elite", "Power", "Playful name"], decision: "Pick it only when the name is the least serious part." }),
    v4Route("frankenjura-germany", { id: "house-of-shock-frankenjura", name: "House of Shock", grade: "9a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Elite limestone route with a direct, high-intensity project feel.", focus: ["limit power", "fear management", "redpoint discipline"], bestFor: "Elite climbers comparing the region's modern hard routes.", tags: ["Elite route", "Intensity", "Project"], decision: "Choose it when high difficulty is the whole point." }),
    v4Route("frankenjura-germany", { id: "space-invaders-frankenjura", name: "Space Invaders", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Frankenjura route with playful arcade-title energy.", focus: ["power endurance", "accuracy", "confidence"], bestFor: "Climbers wanting hard climbing with a less severe name.", tags: ["Arcade name", "Hard sport", "Power"], decision: "Pick it when the route should be hard but still fun to say out loud." }),
    v4Route("frankenjura-germany", { id: "last-action-hero-frankenjura", name: "Last Action Hero", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard limestone route with movie-title energy and redpoint focus.", focus: ["power", "attempt spacing", "composure"], bestFor: "Climbers who like dramatic names and serious tries.", tags: ["Movie title", "Hard sport", "Redpoint"], decision: "Choose it when the day wants one last good go, not ten messy ones." }),
    v4Route("frankenjura-germany", { id: "raven-frankenjura", name: "Raven", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Frankenjura route with dark-name mood and compact challenge.", focus: ["finger strength", "precision", "body tension"], bestFor: "Climbers comparing hard but not elite Frankenjura routes.", tags: ["Dark name", "Compact", "Hard sport"], decision: "Pick it when you want a focused project with a little atmosphere." }),
    v4Route("frankenjura-germany", { id: "shangri-la-frankenjura", name: "Shangri-La", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard limestone route with destination-name contrast and serious project value.", focus: ["power endurance", "confidence", "redpoint patience"], bestFor: "Climbers seeking a memorable 8c card.", tags: ["Hard sport", "Project", "Memorable"], decision: "Choose it when the name sounds peaceful but the climbing probably will not." })
  ],
  "siurana-spain": [
    v4Route("siurana-spain", { id: "el-pati-siurana", name: "El Pati", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Iconic Siurana sport climbing with sunny-wall history and high redpoint value.", focus: ["endurance", "rest strategy", "confidence"], bestFor: "Sport climbers comparing famous Siurana hard routes.", tags: ["Iconic", "Sunny limestone", "Redpoint"], decision: "Pick it when you want a classic hard Siurana reference point." }),
    v4Route("siurana-spain", { id: "pati-noso-siurana", name: "Pati Noso", grade: "8c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana extension-style climbing with serious project intensity.", focus: ["power endurance", "attempt quality", "mental pacing"], bestFor: "Advanced sport climbers building a hard Siurana shortlist.", tags: ["Hard project", "Siurana classic", "Endurance"], decision: "Choose it when you want to invest in a route with history and bite." }),
    v4Route("siurana-spain", { id: "chikane-siurana", name: "Chikane", grade: "8c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana limestone with a direct, redpoint-heavy personality.", focus: ["redpoint tactics", "power endurance", "precision"], bestFor: "Strong climbers comparing upper-end Siurana routes.", tags: ["Upper-end", "Redpoint", "Limestone"], decision: "Pick it when your trip has space for a serious project arc." }),
    v4Route("siurana-spain", { id: "ramadan-siurana", name: "Ramadan", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Recognizable Siurana sport route with classic hard-limestone mood.", focus: ["endurance", "route reading", "confidence"], bestFor: "Climbers wanting a known 8b card in Siurana.", tags: ["Known route", "8b", "Endurance"], decision: "Choose it when you want something hard, famous enough, and not top-end." }),
    v4Route("siurana-spain", { id: "odi-social-siurana", name: "L'Odi Social", grade: "8c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Very hard Siurana limestone with a sharp name and high project demand.", focus: ["limit endurance", "attempt discipline", "mental reset"], bestFor: "Advanced climbers comparing serious Siurana testpieces.", tags: ["Very hard", "Sharp name", "Project"], decision: "Pick it when the route can be the main character of the trip." }),
    v4Route("siurana-spain", { id: "a-muerte-siurana", name: "A Muerte", grade: "8c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana sport climbing with a name that basically gives the mood away.", focus: ["try-hard mode", "power endurance", "composure"], bestFor: "Climbers who enjoy a full-commitment redpoint mindset.", tags: ["Try hard", "Hard sport", "Project"], decision: "Choose it when 'casual' is not on today's menu." }),
    v4Route("siurana-spain", { id: "directa-cornudella-siurana", name: "Directa Cornudella", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana limestone with direct-line appeal and hard redpoint value.", focus: ["route rhythm", "endurance", "precision"], bestFor: "Climbers comparing strong but not extreme Siurana routes.", tags: ["Direct line", "8b+", "Redpoint"], decision: "Pick it when you want a hard route that feels straightforward in concept." }),
    v4Route("siurana-spain", { id: "zona-0-siurana", name: "Zona 0", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana route with clean project-card simplicity.", focus: ["power endurance", "movement memory", "confidence"], bestFor: "Climbers choosing a focused 8b objective.", tags: ["8b card", "Clean project", "Endurance"], decision: "Choose it when you want a route that does not need a long explanation." }),
    v4Route("siurana-spain", { id: "la-crema-siurana", name: "La Crema", grade: "8c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana climbing with rich redpoint flavor and sunny-wall tension.", focus: ["redpoint strategy", "endurance", "confidence"], bestFor: "Advanced climbers comparing 8c projects with classic Siurana feel.", tags: ["8c", "Redpoint", "Sunny limestone"], decision: "Pick it when you want the good stuff, and you know it will cost effort." }),
    v4Route("siurana-spain", { id: "mishi-siurana", name: "Mishi", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana 8a-style climbing with approachable project energy.", focus: ["technique", "redpoint rhythm", "confidence"], bestFor: "Climbers comparing first or repeat 8a options.", tags: ["8a card", "Approachable", "Project"], decision: "Choose it when the day wants progress instead of drama." }),
    v4Route("siurana-spain", { id: "broadway-siurana", name: "Broadway", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana sport climbing with stage-name charm and steady difficulty.", focus: ["flow", "endurance", "movement economy"], bestFor: "Climbers wanting a memorable mid-hard route.", tags: ["Stage name", "8a+", "Flow"], decision: "Pick it when you want your route list to sound theatrical." }),
    v4Route("siurana-spain", { id: "brutus-siurana", name: "Brutus", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Compact Siurana hard sport route with blunt-name energy.", focus: ["power", "confidence", "attempt quality"], bestFor: "Climbers looking for a direct 8a target.", tags: ["Blunt name", "8a", "Power"], decision: "Choose it when you want something honest and punchy." }),
    v4Route("siurana-spain", { id: "dr-feelgood-siurana", name: "Dr. Feelgood", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana sport route with a friendly name and real project usefulness.", focus: ["redpoint habits", "confidence", "relaxation"], bestFor: "Climbers who want an 8a card that does not feel too severe.", tags: ["Feelgood", "8a", "Confidence"], decision: "Pick it when the goal is to try hard and still have a good day." }),
    v4Route("siurana-spain", { id: "gurungos-siurana", name: "Gurungos", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana limestone with powerful redpoint appeal.", focus: ["power endurance", "precision", "attempt quality"], bestFor: "Strong sport climbers comparing hard Siurana choices.", tags: ["8b+", "Power", "Project"], decision: "Choose it when you want a proper hard project without going full 9th grade." }),
    v4Route("siurana-spain", { id: "escamarla-siurana", name: "L'Escamarla", grade: "7c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Upper-7 Siurana sport climbing with useful first-trip comparison value.", focus: ["movement economy", "confidence", "rest timing"], bestFor: "Climbers building toward harder Siurana projects.", tags: ["Upper 7", "Confidence", "Progression"], decision: "Pick it when you want a bridge route before bigger numbers." }),
    v4Route("siurana-spain", { id: "siuxie-siurana", name: "Siuxie", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana limestone with crisp mid-hard redpoint character.", focus: ["redpoint tactics", "body position", "confidence"], bestFor: "Climbers comparing 8a+ options with clean project scope.", tags: ["8a+", "Redpoint", "Clean scope"], decision: "Choose it when the route should be hard but still readable as a project." }),
    v4Route("siurana-spain", { id: "bistec-de-biceps-siurana", name: "Bistec de Biceps", grade: "7c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "A playful Siurana name card with upper-7 training value.", focus: ["power endurance", "confidence", "movement memory"], bestFor: "Climbers wanting a memorable warm-project target.", tags: ["Playful", "Upper 7", "Training route"], decision: "Pick it when the route name already makes the day less stiff." }),
    v4Route("siurana-spain", { id: "pota-negra-siurana", name: "La Pota Negra", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana hard sport route with dark-name flair and project weight.", focus: ["power endurance", "precision", "mental pacing"], bestFor: "Climbers comparing serious 8b options.", tags: ["8b", "Dark name", "Project"], decision: "Choose it when you want a route with a bit of edge." }),
    v4Route("siurana-spain", { id: "el-mon-de-sofia-siurana", name: "El Mon de Sofia", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana sport route with personal-name charm and steady hard climbing.", focus: ["flow", "redpoint rhythm", "confidence"], bestFor: "Climbers looking for an 8a+ route with a less intimidating personality.", tags: ["8a+", "Flow", "Friendly name"], decision: "Pick it when you want hard climbing without a villain name." }),
    v4Route("siurana-spain", { id: "memorias-de-una-sepia-siurana", name: "Memorias de una Sepia", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "A memorable Siurana 8a card with quirky-title appeal.", focus: ["route reading", "movement economy", "redpoint patience"], bestFor: "Climbers who like routes with personality and manageable difficulty.", tags: ["Quirky title", "8a", "Project"], decision: "Choose it when you want an 8a that feels like a story prompt." }),
    v4Route("siurana-spain", { id: "rauxa-siurana", name: "Rauxa", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana limestone with compact energy and confident redpoint demand.", focus: ["power endurance", "confidence", "precision"], bestFor: "Climbers comparing punchy 8b objectives.", tags: ["8b", "Punchy", "Redpoint"], decision: "Pick it when the day calls for boldness but not chaos." }),
    v4Route("siurana-spain", { id: "viagraman-siurana", name: "Viagraman", grade: "8b+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana sport climbing with cheeky-name personality.", focus: ["power endurance", "attempt quality", "composure"], bestFor: "Strong climbers who can enjoy a joke without underestimating the route.", tags: ["Cheeky name", "8b+", "Hard sport"], decision: "Choose it when the route should be funny only before you tie in." }),
    v4Route("siurana-spain", { id: "marroncita-siurana", name: "Marroncita", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana 8b-style climbing with focused redpoint texture.", focus: ["redpoint rhythm", "endurance", "precision"], bestFor: "Climbers looking for a clear hard sport objective.", tags: ["8b", "Focused", "Redpoint"], decision: "Pick it when you want a hard route that does not need myth-making." }),
    v4Route("siurana-spain", { id: "cara-que-no-miente-siurana", name: "La Cara que no Miente", grade: "8a+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "A Siurana route card with honest-name energy and technical redpoint appeal.", focus: ["honest pacing", "technique", "confidence"], bestFor: "Climbers wanting a mid-hard project that keeps them truthful.", tags: ["Honest route", "8a+", "Technique"], decision: "Choose it when you want the route to tell you exactly how prepared you are." }),
    v4Route("siurana-spain", { id: "espero-primavera-siurana", name: "Espero Primavera", grade: "7c+ metadata", type: "sport", length: "single-pitch limestone metadata", style: "Upper-7 Siurana climbing with light seasonal-name charm.", focus: ["confidence", "movement economy", "flow"], bestFor: "Visitors wanting an upper-7 route with a gentler emotional temperature.", tags: ["Upper 7", "Seasonal mood", "Flow"], decision: "Pick it when the day wants spring energy, even if your forearms disagree." }),
    v4Route("siurana-spain", { id: "herbolari-siurana", name: "L'Herbolari", grade: "7c metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana limestone with approachable upper-grade learning value.", focus: ["route reading", "footwork", "confidence"], bestFor: "Climbers building a first Siurana shortlist below 8a.", tags: ["7c card", "Learning route", "Limestone"], decision: "Choose it when you want a route that teaches more than it punishes." }),
    v4Route("siurana-spain", { id: "llet-de-llop-siurana", name: "La Llet de Llop", grade: "8a metadata", type: "sport", length: "single-pitch limestone metadata", style: "Siurana 8a sport climbing with local-language flavor and project value.", focus: ["redpoint tactics", "confidence", "movement memory"], bestFor: "Climbers comparing varied 8a options.", tags: ["8a", "Local flavor", "Project"], decision: "Pick it when you want a route that feels rooted in the place." }),
    v4Route("siurana-spain", { id: "les-tenebres-siurana", name: "Les Tenebres", grade: "8b metadata", type: "sport", length: "single-pitch limestone metadata", style: "Hard Siurana limestone with darker title and focused redpoint mood.", focus: ["power endurance", "composure", "attempt quality"], bestFor: "Climbers who like serious-feeling hard routes.", tags: ["Dark mood", "8b", "Redpoint"], decision: "Choose it when a slightly moody project sounds motivating." })
  ]
};

type V5Seed = {
  id: string;
  name: string;
  grade: string;
  type: RouteHighlight["type"];
  length: string;
  theme: string;
};

function v5Routes(slug: string, seeds: V5Seed[]): RouteHighlight[] {
  return seeds.map((seed) =>
    v4Route(slug, {
      id: seed.id,
      name: seed.name,
      grade: seed.grade,
      type: seed.type,
      length: seed.length,
      style: seed.theme,
      focus:
        seed.type === "trad"
          ? ["traditional judgment", "movement economy", "source checking"]
          : seed.type === "multi-pitch"
            ? ["team rhythm", "exposure comfort", "route selection"]
            : ["route reading", "movement economy", "attempt quality"],
      bestFor: "Climbers using ClimbAtlas to compare route style before opening current local resources.",
      tags:
        seed.type === "trad"
          ? ["Trad style", "Metadata card", "Decision aid"]
          : seed.type === "multi-pitch"
            ? ["Adventure line", "Metadata card", "Team day"]
            : ["Sport style", "Metadata card", "Trip planning"],
      decision: "Choose it when this style fits today's energy, then verify exact current details externally."
    })
  );
}

const v5PopularRouteAdditions: Record<string, RouteHighlight[]> = {
  "margalef-spain": v5Routes("margalef-spain", [
    { id: "la-ley-indignata-margalef", name: "La Ley Indignata", grade: "9a metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Hard Margalef pocket climbing with a serious redpoint personality." },
    { id: "nit-de-bruixes-margalef", name: "Nit de Bruixes", grade: "9a+ metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Elite Margalef sport climbing with steep pocket endurance and notable repeat-history context." },
    { id: "el-fustigador-margalef", name: "El Fustigador", grade: "9a metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Hard Margalef route-choice card with intense pocket-climbing identity." },
    { id: "palestina-margalef", name: "Palestina", grade: "9a metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Hard Margalef sport climbing with sustained pocket demands." },
    { id: "cabane-au-canada-margalef", name: "Cabane au Canada", grade: "9a metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Margalef high-end pocket climbing with memorable international-name feel." },
    { id: "la-bongada-margalef", name: "La Bongada", grade: "8c+ metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Hard Margalef sport climbing below the most famous 9b headline routes." },
    { id: "l-espiadimonis-margalef", name: "L'Espiadimonis", grade: "8c metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Margalef pocket climbing with a human but still serious project profile." },
    { id: "chute-de-croupe-margalef", name: "Chute de Croupe", grade: "8c+ metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Hard Margalef climbing with steep pocket and body-position demands." },
    { id: "espadelles-route-line-margalef", name: "Espadelles route line", grade: "7a-9a metadata", type: "sport", length: "sector route-line metadata", theme: "A Margalef sector-line card for comparing sunny conglomerate routes across a wide grade band." },
    { id: "raco-de-la-finestra-route-line-margalef", name: "Raco de la Finestra route line", grade: "7a-9a metadata", type: "sport", length: "sector route-line metadata", theme: "Pocketed conglomerate wall context for climbers sorting Margalef options by style." },
    { id: "laboratori-route-line-margalef", name: "Laboratori route line", grade: "8a-9b metadata", type: "sport", length: "sector route-line metadata", theme: "A high-end Margalef sector card for climbers drawn to famous pocket projects." },
    { id: "tenebres-route-line-margalef", name: "Tenebres route line", grade: "7c-8c metadata", type: "sport", length: "sector route-line metadata", theme: "Margalef sector-style card with darker wall atmosphere and concentrated sport focus." },
    { id: "can-pesafigues-route-line-margalef", name: "Can Pesafigues route line", grade: "6b-8b metadata", type: "sport", length: "sector route-line metadata", theme: "A friendlier Margalef sector-line card for mileage and pocket-style learning." },
    { id: "catedral-route-line-margalef", name: "Catedral route line", grade: "7b-8c metadata", type: "sport", length: "sector route-line metadata", theme: "Bigger-feeling Margalef wall context with classic sport-climbing atmosphere." },
    { id: "finestra-de-la-llum-route-line-margalef", name: "Finestra de la Llum route line", grade: "7a-8c metadata", type: "sport", length: "sector route-line metadata", theme: "Margalef sector-style card for bright, pocketed sport climbing." },
    { id: "reggae-route-line-margalef", name: "Reggae route line", grade: "6c-8b metadata", type: "sport", length: "sector route-line metadata", theme: "A lighter Margalef route-line card with relaxed-trip value and pocket movement." },
    { id: "bob-esponja-margalef", name: "Bob Esponja", grade: "8b metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Margalef sport climbing with playful-name energy and serious pocket demands." },
    { id: "el-heroe-margalef", name: "El Heroe", grade: "8b metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Hard but not elite Margalef pocket climbing with clean project-card usefulness." },
    { id: "ingravids-margalef", name: "Ingravids", grade: "8c metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Difficult Margalef climbing with compact redpoint focus and pocket precision." },
    { id: "vaca-margalef", name: "Vaca", grade: "8a metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Margalef sport climbing with useful 8a-style project value." },
    { id: "sol-solet-margalef", name: "Sol Solet", grade: "7c metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Sunny Margalef sport climbing with moderate-hard pocket value." },
    { id: "la-ballena-margalef", name: "La Ballena", grade: "8a metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Margalef route card with rounded, pocketed movement and project usefulness." },
    { id: "malasombra-margalef", name: "Malasombra", grade: "8b metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Hard Margalef sport climbing with shaded-project mood." },
    { id: "transilvania-margalef", name: "Transilvania", grade: "8a+ metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "Margalef sport route with dark-name charm and pockety redpoint value." },
    { id: "doctor-feelgood-margalef", name: "Doctor Feelgood", grade: "8a metadata", type: "sport", length: "single-pitch conglomerate metadata", theme: "A hard-but-friendly Margalef card for confidence and redpoint rhythm." },
    { id: "el-calvario-route-line-margalef", name: "El Calvario route line", grade: "7a-8c metadata", type: "sport", length: "sector route-line metadata", theme: "Margalef sector-line card for climbers comparing project walls without copying local beta." },
    { id: "balco-de-les-espases-route-line-margalef", name: "Balco de les Espases route line", grade: "6c-8b metadata", type: "sport", length: "sector route-line metadata", theme: "A Margalef route-line card for balanced sport days and pocket mileage." },
    { id: "can-dit-gros-route-line-margalef", name: "Can Dit Gros route line", grade: "7a-8c metadata", type: "sport", length: "sector route-line metadata", theme: "Margalef conglomerate sector context with pockety, project-friendly personality." }
  ]),
  "yangshuo-china": v5Routes("yangshuo-china", [
    { id: "swiss-cheese-yangshuo", name: "Swiss Cheese", grade: "5.10 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Yangshuo karst limestone with pocketed, friendly movement character." },
    { id: "the-wizard-yangshuo", name: "The Wizard", grade: "5.12 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Harder Yangshuo sport climbing with technical limestone movement." },
    { id: "grease-monkey-yangshuo", name: "Grease Monkey", grade: "5.11 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Yangshuo limestone route card with practical mid-grade training value." },
    { id: "thunder-yangshuo", name: "Thunder", grade: "5.12 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Steeper Yangshuo limestone with stormy project energy." },
    { id: "china-climb-yangshuo", name: "China Climb", grade: "5.11 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "A Yangshuo style card centered on classic karst sport movement." },
    { id: "the-dumpling-yangshuo", name: "The Dumpling", grade: "5.10 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Friendly Yangshuo limestone with travel-day charm and useful movement." },
    { id: "baby-frog-yangshuo", name: "Baby Frog", grade: "5.9 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Lower-pressure Yangshuo sport climbing for confidence and route reading." },
    { id: "dragonfly-yangshuo", name: "Dragonfly", grade: "5.11 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Yangshuo route card with light, technical movement personality." },
    { id: "moon-hill-arch-route-line-yangshuo", name: "Moon Hill arch route line", grade: "5.10-5.13 metadata", type: "sport", length: "arch route-line metadata", theme: "Iconic Moon Hill arch context with steep Yangshuo sport-climbing identity." },
    { id: "lei-pi-shan-route-line-yangshuo", name: "Lei Pi Shan route line", grade: "5.8-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo karst sector context for varied sport-climbing days." },
    { id: "egg-mountain-route-line-yangshuo", name: "Egg Mountain route line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo sector-style limestone card for approachable sport mileage." },
    { id: "baby-frog-buttress-route-line-yangshuo", name: "Baby Frog Buttress route line", grade: "5.7-5.11 metadata", type: "sport", length: "sector route-line metadata", theme: "Lower-grade Yangshuo limestone context for confidence and learning." },
    { id: "the-crag-route-line-yangshuo", name: "The Crag route line", grade: "5.9-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo sector context with varied limestone sport style." },
    { id: "the-egg-sector-route-line-yangshuo", name: "The Egg sector route line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Approachable Yangshuo limestone sector card with rounded formation identity." },
    { id: "white-mountain-sport-line-yangshuo", name: "White Mountain sport line", grade: "5.10-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo White Mountain context for sport routes with a stronger project feel." },
    { id: "low-mountain-sport-line-yangshuo", name: "Low Mountain sport line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo sector line with mixed grades and useful trip-planning value." },
    { id: "twin-gates-sport-line-yangshuo", name: "Twin Gates sport line", grade: "5.9-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Karst-gate limestone context with route-choice value for visiting climbers." },
    { id: "wine-bottle-sport-line-yangshuo", name: "Wine Bottle Cliff sport line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo limestone sector card with travel-day and mileage value." },
    { id: "big-banyan-route-line-yangshuo", name: "Big Banyan route line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo sector context with approachable sport-climbing energy." },
    { id: "panda-wall-route-line-yangshuo", name: "Panda Wall route line", grade: "5.9-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo limestone wall context with memorable trip-list personality." },
    { id: "temple-crag-route-line-yangshuo", name: "Temple Crag route line", grade: "5.9-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Quiet Yangshuo limestone context for thoughtful sport days." },
    { id: "karst-tower-route-line-yangshuo", name: "Karst Tower route line", grade: "5.8-5.13 metadata", type: "multi-pitch", length: "single-pitch to multi-pitch metadata", theme: "Yangshuo tower-style context for climbers who want scenery and route variety." },
    { id: "river-view-route-line-yangshuo", name: "River View route line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Scenic Yangshuo limestone context with relaxed trip-day value." },
    { id: "dragon-spine-route-line-yangshuo", name: "Dragon Spine route line", grade: "5.10-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "More athletic Yangshuo limestone context with steep-route flavor." },
    { id: "lotus-cave-route-line-yangshuo", name: "Lotus Cave route line", grade: "5.10-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "Cave-style Yangshuo limestone context for steep movement and endurance." },
    { id: "morning-sun-route-line-yangshuo", name: "Morning Sun route line", grade: "5.8-5.11 metadata", type: "sport", length: "sector route-line metadata", theme: "Lighter Yangshuo sport-climbing context for easygoing mileage." },
    { id: "sunset-wall-route-line-yangshuo", name: "Sunset Wall route line", grade: "5.9-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Yangshuo wall context for scenic, moderate-to-hard sport climbing." },
    { id: "river-arch-route-line-yangshuo", name: "River Arch route line", grade: "5.10-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "Karst arch-style Yangshuo card for steep movement and place atmosphere." }
  ]),
  "liming-china": v5Routes("liming-china", [
    { id: "dinner-wall-crack-line-liming-v5", name: "Dinner Wall crack line", grade: "5.8-5.12 metadata", type: "trad", length: "sector route-line metadata", theme: "Liming sector-line context for crack climbing and approachable adventure." },
    { id: "guardian-wall-crack-line-liming-v5", name: "Guardian Wall crack line", grade: "5.9-5.12 metadata", type: "trad", length: "sector route-line metadata", theme: "Liming sandstone sector card with classic crack and wall atmosphere." },
    { id: "pine-crest-crack-line-liming-v5", name: "Pine Crest crack line", grade: "5.8-5.11 metadata", type: "trad", length: "sector route-line metadata", theme: "Friendlier Liming sector context for sandstone mileage and crack practice." },
    { id: "great-arch-crack-line-liming-v5", name: "Great Arch crack line", grade: "5.10-5.12 metadata", type: "multi-pitch", length: "sector route-line metadata", theme: "Liming arch-wall context for bigger sandstone adventure energy." },
    { id: "middle-kingdom-crack-line-liming", name: "Middle Kingdom crack line", grade: "5.9-5.12 metadata", type: "trad", length: "sector route-line metadata", theme: "Liming crack-line card with strong place identity and traditional climbing focus." },
    { id: "prayer-flag-wall-line-liming", name: "Prayer Flag Wall line", grade: "5.8-5.11 metadata", type: "trad", length: "sector route-line metadata", theme: "A lighter Liming sector card for scenic sandstone climbing and practice." },
    { id: "moon-gate-crack-line-liming", name: "Moon Gate crack line", grade: "5.10-5.12 metadata", type: "trad", length: "sector route-line metadata", theme: "Liming sandstone card with feature-driven crack and corner movement." },
    { id: "red-sandstone-corner-liming", name: "Red Sandstone Corner", grade: "5.10 metadata", type: "trad", length: "sandstone corner metadata", theme: "Corner-focused Liming route card for practicing body position and pacing." },
    { id: "sky-bridge-liming", name: "Sky Bridge", grade: "5.11 metadata", type: "multi-pitch", length: "multi-pitch sandstone metadata", theme: "Liming multi-pitch style card with airy wall and travel-day appeal." },
    { id: "cloud-temple-crack-liming", name: "Cloud Temple Crack", grade: "5.11 metadata", type: "trad", length: "sandstone crack metadata", theme: "Liming crack-climbing card with atmospheric name and real technique focus." },
    { id: "stone-lion-liming", name: "Stone Lion", grade: "5.10 metadata", type: "trad", length: "sandstone route metadata", theme: "Steady Liming route card for balanced crack and face movement." },
    { id: "red-corner-liming", name: "Red Corner", grade: "5.10 metadata", type: "trad", length: "sandstone corner metadata", theme: "Feature-driven Liming sandstone climbing with corner technique appeal." },
    { id: "tiger-crack-liming", name: "Tiger Crack", grade: "5.11 metadata", type: "trad", length: "sandstone crack metadata", theme: "Physical Liming crack-card energy with strong route-finder personality." },
    { id: "jade-gate-liming", name: "Jade Gate", grade: "5.10 metadata", type: "trad", length: "sandstone route metadata", theme: "Liming sandstone route card with travel-place atmosphere and moderate difficulty." },
    { id: "red-dragon-crack-liming", name: "Red Dragon Crack", grade: "5.12 metadata", type: "trad", length: "sandstone crack metadata", theme: "Harder Liming crack-climbing card with powerful, memorable identity." },
    { id: "cloud-ladder-liming", name: "Cloud Ladder", grade: "5.11 metadata", type: "multi-pitch", length: "multi-pitch sandstone metadata", theme: "Tall Liming route-style card with adventure and exposure mood." },
    { id: "stone-forest-crack-liming", name: "Stone Forest Crack", grade: "5.10 metadata", type: "trad", length: "sandstone crack metadata", theme: "Liming sandstone crack card with landscape-first personality." },
    { id: "sunbird-liming", name: "Sunbird", grade: "5.11 metadata", type: "trad", length: "sandstone route metadata", theme: "Liming route card with warm, athletic traditional-climbing feel." },
    { id: "yak-butter-crack-liming", name: "Yak Butter Crack", grade: "5.10 metadata", type: "trad", length: "sandstone crack metadata", theme: "Liming-style crack card with playful travel energy and practical technique focus." },
    { id: "sleeping-dragon-liming", name: "Sleeping Dragon", grade: "5.11 metadata", type: "trad", length: "sandstone route metadata", theme: "Liming sandstone route card with adventurous but measured character." },
    { id: "red-river-gate-liming", name: "Red River Gate", grade: "5.9 metadata", type: "trad", length: "sandstone route metadata", theme: "Approachable Liming route card for sandstone confidence and place atmosphere." },
    { id: "jade-dragon-crack-liming", name: "Jade Dragon Crack", grade: "5.12 metadata", type: "trad", length: "sandstone crack metadata", theme: "Hard Liming crack-card energy with strong destination identity." },
    { id: "black-turtle-liming", name: "Black Turtle", grade: "5.10 metadata", type: "trad", length: "sandstone route metadata", theme: "Steady Liming sandstone climbing with patient movement and route-finder usefulness." },
    { id: "tea-horse-road-liming", name: "Tea Horse Road", grade: "5.9 metadata", type: "trad", length: "sandstone route metadata", theme: "Liming route card with cultural-place atmosphere and moderate trad focus." },
    { id: "tiger-leaping-line-liming", name: "Tiger Leaping line", grade: "5.10-5.12 metadata", type: "multi-pitch", length: "route-line metadata", theme: "A bigger Liming-style adventure card inspired by the wider Yunnan sandstone landscape." },
    { id: "morning-market-crack-liming", name: "Morning Market Crack", grade: "5.9 metadata", type: "trad", length: "sandstone crack metadata", theme: "Friendlier Liming crack card with warm-up and mileage value." },
    { id: "red-wall-systems-line-liming", name: "Red Wall systems line", grade: "5.9-5.12 metadata", type: "multi-pitch", length: "sector route-line metadata", theme: "Liming route-line card for practicing efficient systems on sandstone terrain." },
    { id: "upper-valley-crack-line-liming", name: "Upper Valley crack line", grade: "5.8-5.12 metadata", type: "trad", length: "sector route-line metadata", theme: "Higher Liming valley context for crack mileage and careful route selection." }
  ]),
  "long-dong-taiwan": v5Routes("long-dong-taiwan", [
    { id: "school-gate-beginner-line-long-dong", name: "School Gate beginner line", grade: "5.6-5.9 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Accessible Long Dong sea-cliff climbing for confidence and movement basics." },
    { id: "school-gate-technical-line-long-dong", name: "School Gate technical line", grade: "5.9-5.11 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Long Dong sandstone route-line card with technical footwork and ocean views." },
    { id: "golden-valley-crack-line-long-dong", name: "Golden Valley crack line", grade: "5.8-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Long Dong sandstone crack and face context with a more adventurous feel." },
    { id: "golden-valley-face-line-long-dong", name: "Golden Valley face line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Sea-cliff sandstone face climbing with technical route-choice value." },
    { id: "back-door-crack-line-long-dong", name: "Back Door crack line", grade: "5.8-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Back Door sandstone context with exploration mood and crack practice." },
    { id: "music-hall-face-line-long-dong", name: "Music Hall face line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Technical Long Dong wall context with rhythm and movement focus." },
    { id: "grand-auditorium-wall-line-long-dong", name: "Grand Auditorium wall line", grade: "5.10-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Bigger Long Dong wall context with exposed sandstone and traditional-climbing mood." },
    { id: "clocktower-face-line-long-dong", name: "Clocktower face line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Long Dong sector-line card with technical sandstone movement and strong visual identity." },
    { id: "dragon-gate-sea-line-long-dong", name: "Dragon Gate sea line", grade: "5.8-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Sea-cliff route-line context with classic Long Dong atmosphere." },
    { id: "big-wall-training-line-long-dong", name: "Big Wall training line", grade: "5.9-5.12 metadata", type: "trad", length: "sea-cliff wall metadata", theme: "Long Dong bigger-wall context for practicing systems without publishing route beta." },
    { id: "first-tower-line-long-dong-v5", name: "First Tower style line", grade: "5.8-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Long Dong tower-sector context with scenic sandstone and flexible grades." },
    { id: "second-tower-line-long-dong-v5", name: "Second Tower style line", grade: "5.8-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "A Long Dong sector-line card for sandstone variety and route-choice flexibility." },
    { id: "first-cave-sport-line-long-dong", name: "First Cave sport line", grade: "5.8-5.11 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Compact Long Dong sport context with approachable movement and ocean atmosphere." },
    { id: "second-cave-technical-line-long-dong", name: "Second Cave technical line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Long Dong cave-sector style with more technical and athletic movement." },
    { id: "southern-cross-line-long-dong", name: "Southern Cross line", grade: "5.10-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Seaside sandstone route-line card with adventurous southern-sector mood." },
    { id: "north-point-line-long-dong", name: "North Point line", grade: "5.8-5.11 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Long Dong sector card with easier sport-style route-choice value." },
    { id: "ocean-window-line-long-dong", name: "Ocean Window line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Scenic sandstone card where ocean setting and movement both matter." },
    { id: "sea-breeze-line-long-dong", name: "Sea Breeze line", grade: "5.7-5.10 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Friendlier Long Dong route-line card for mileage and relaxed movement." },
    { id: "salt-and-sandstone-line-long-dong", name: "Salt and Sandstone line", grade: "5.9-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Long Dong sandstone context that highlights sea-cliff texture and judgment." },
    { id: "horizon-face-line-long-dong", name: "Horizon Face line", grade: "5.9-5.11 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Long Dong face-climbing card with open setting and technical footwork." },
    { id: "red-sand-face-line-long-dong", name: "Red Sand Face line", grade: "5.8-5.11 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Approachable sandstone face-card for Long Dong mileage and learning." },
    { id: "dragon-bay-line-long-dong", name: "Dragon Bay line", grade: "5.9-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Long Dong route-line card with ocean-bay atmosphere and traditional style." },
    { id: "seaside-corner-line-long-dong", name: "Seaside Corner line", grade: "5.8-5.11 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Corner-style sandstone context with trad movement and sea-cliff atmosphere." },
    { id: "east-sea-line-long-dong", name: "East Sea line", grade: "5.10-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Athletic Long Dong sea-cliff card for climbers wanting a stronger sport feel." },
    { id: "teapot-line-long-dong", name: "Teapot line", grade: "5.7-5.10 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Gentler Long Dong route-line card with relaxed trip-day energy." },
    { id: "coral-wall-line-long-dong", name: "Coral Wall line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Long Dong wall context with ocean texture and technical sport movement." },
    { id: "harbor-view-line-long-dong", name: "Harbor View line", grade: "5.8-5.11 metadata", type: "sport", length: "single-pitch sea-cliff metadata", theme: "Scenic Long Dong route-line card with friendly movement and travel mood." },
    { id: "dragon-coast-line-long-dong", name: "Dragon Coast line", grade: "5.9-5.12 metadata", type: "trad", length: "single-pitch sea-cliff metadata", theme: "Coastal Long Dong route-line card for adventurous sandstone decisions." }
  ]),
  "railay-tonsai-thailand": v5Routes("railay-tonsai-thailand", [
    { id: "one-two-three-wall-line-railay", name: "1-2-3 Wall route line", grade: "5.6-5.12 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Classic Railay beginner-to-intermediate wall context with beach-climbing energy." },
    { id: "diamond-cave-line-railay", name: "Diamond Cave route line", grade: "5.7-5.12 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Railay limestone route-line card with accessible travel-day value." },
    { id: "thaiwand-wall-multipitch-line-railay", name: "Thaiwand Wall multipitch line", grade: "6a-7c metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Sea-view limestone adventure with iconic Railay wall atmosphere." },
    { id: "escher-world-sport-line-railay", name: "Escher World sport line", grade: "6a-7c metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Playful Railay/Tonsai limestone with movement-puzzle personality." },
    { id: "fire-wall-sport-line-railay", name: "Fire Wall sport line", grade: "6b-8a metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Steeper Thai limestone route-line card with project energy and humid-day intensity." },
    { id: "dums-kitchen-sport-line-railay", name: "Dum's Kitchen sport line", grade: "6a-7b metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Friendly Railay limestone line with practical mileage and travel-day usefulness." },
    { id: "wee-present-wall-line-railay", name: "Wee's Present Wall line", grade: "6a-7c metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Railay/Tonsai wall context with varied sport-climbing options and trip-list value." },
    { id: "tonsai-roof-line-railay", name: "Tonsai Roof line", grade: "6c-8a metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Steep Tonsai limestone context for power endurance and tropical project days." },
    { id: "eagle-wall-line-railay", name: "Eagle Wall line", grade: "6a-7b metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Scenic Railay/Tonsai limestone wall card with moderate-to-hard climbing mood." },
    { id: "melting-wall-line-railay", name: "Melting Wall line", grade: "6b-7c metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Humid Thai limestone route-line card with sustained climbing and project feel." },
    { id: "tyrolean-wall-line-railay", name: "Tyrolean Wall line", grade: "6a-7c metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Railay/Tonsai wall context with adventure-name energy and sport-climbing variety." },
    { id: "monkey-world-line-railay", name: "Monkey World line", grade: "5.9-5.12 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Playful Thai limestone route-line card with travel-day and movement variety." },
    { id: "phra-nang-cave-line-railay", name: "Phra Nang Cave line", grade: "5.8-5.12 metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Iconic beach-cave limestone context with scenic route-choice value." },
    { id: "defile-exit-extension-line-railay", name: "Defile Exit extension line", grade: "6a-6c metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Moderate Railay limestone line for easygoing sport mileage." },
    { id: "humanality-multipitch-context-railay", name: "Humanality multipitch context", grade: "6b+ metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "A Railay/Tonsai multipitch context card for teams comparing scenic objectives." },
    { id: "groove-tube-style-line-railay", name: "Groove Tube style line", grade: "6a metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Friendly Thai limestone sport context with groove movement and confidence value." },
    { id: "lord-of-thais-project-line-railay", name: "Lord of the Thais project line", grade: "7b metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Harder Tonsai sport-climbing context with powerful limestone identity." },
    { id: "massage-secrets-project-line-railay", name: "Massage Secrets project line", grade: "7a metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Sustained Thai limestone project card with a lighter name and harder movement." },
    { id: "make-a-way-style-line-railay", name: "Make a Way style line", grade: "6b metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Railay/Tonsai limestone card for steady sport practice and route-choice confidence." },
    { id: "the-king-and-i-style-line-railay", name: "The King and I style line", grade: "6c metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Railay/Tonsai sport route context with mid-hard progression value." },
    { id: "beach-breeze-line-railay", name: "Beach Breeze line", grade: "5.8-6b metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Light Railay/Tonsai limestone card for relaxed mileage and group-friendly days." },
    { id: "limestone-lantern-line-railay", name: "Limestone Lantern line", grade: "6a-7a metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Moderate Thai limestone card with warm travel mood and route-finder usefulness." },
    { id: "sea-stack-line-railay", name: "Sea Stack line", grade: "6a-7b metadata", type: "multi-pitch", length: "single-pitch to multi-pitch metadata", theme: "Sea-stack limestone context for climbers who want tropical exposure and adventure flavor." },
    { id: "coconut-wall-line-railay", name: "Coconut Wall line", grade: "5.9-7a metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Friendly tropical limestone wall context with vacation-day usefulness." },
    { id: "mango-wall-line-railay", name: "Mango Wall line", grade: "6a-7b metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Thai limestone route-line card with playful tropical personality." },
    { id: "tide-pool-line-railay", name: "Tide Pool line", grade: "5.8-6c metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Lower-pressure Railay/Tonsai route-line card with beach-climbing context." },
    { id: "jungle-groove-line-railay", name: "Jungle Groove line", grade: "6a-7b metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Railay/Tonsai limestone card with tropical wall atmosphere and movement variety." },
    { id: "longtail-wall-line-railay", name: "Longtail Wall line", grade: "5.9-7a metadata", type: "sport", length: "single-pitch limestone metadata", theme: "Travel-flavored Railay/Tonsai route-line card for moderate sport climbing." }
  ])
};

const v6PopularRouteAdditions: Record<string, RouteHighlight[]> = {
  "joshua-tree-usa": v5Routes("joshua-tree-usa", [
    { id: "walk-on-the-wild-side-joshua-tree", name: "Walk on the Wild Side", grade: "5.8 metadata", type: "trad", length: "multi-pitch slab metadata", theme: "Classic Joshua Tree slab and face climbing with old-school desert composure." },
    { id: "the-flake-joshua-tree", name: "The Flake", grade: "5.8 metadata", type: "trad", length: "single-pitch crack metadata", theme: "Joshua Tree crack and face climbing with compact classic-route value." },
    { id: "right-on-joshua-tree", name: "Right On", grade: "5.5 metadata", type: "trad", length: "multi-pitch moderate metadata", theme: "Lower-grade Joshua Tree multipitch climbing with confidence and desert-slab lessons." },
    { id: "the-eye-joshua-tree", name: "The Eye", grade: "5.3 metadata", type: "trad", length: "tunnel route metadata", theme: "A playful desert feature route card for easier Joshua Tree adventure energy." },
    { id: "toe-jam-joshua-tree", name: "Toe Jam", grade: "5.7 metadata", type: "trad", length: "single-pitch crack metadata", theme: "Friendly Joshua Tree crack climbing with classic first-trip usefulness." },
    { id: "dogleg-joshua-tree", name: "Dogleg", grade: "5.8 metadata", type: "trad", length: "single-pitch crack metadata", theme: "A Joshua Tree crack card for climbers practicing rhythm and body position." },
    { id: "overhang-bypass-joshua-tree", name: "Overhang Bypass", grade: "5.7 metadata", type: "trad", length: "multi-pitch metadata", theme: "Moderate desert adventure climbing with enough position to feel memorable." },
    { id: "dappled-mare-joshua-tree", name: "Dappled Mare", grade: "5.8 metadata", type: "trad", length: "multi-pitch metadata", theme: "Joshua Tree face and crack climbing with old-school movement variety." },
    { id: "geronimo-joshua-tree", name: "Geronimo", grade: "5.6 metadata", type: "trad", length: "single-pitch metadata", theme: "Approachable desert climbing for confidence, movement, and first-trip pacing." },
    { id: "popes-crack-joshua-tree", name: "Pope's Crack", grade: "5.9 metadata", type: "trad", length: "single-pitch crack metadata", theme: "Joshua Tree crack climbing with benchmark value and direct feedback." },
    { id: "heart-and-sole-joshua-tree", name: "Heart and Sole", grade: "5.10a metadata", type: "trad", length: "single-pitch metadata", theme: "Desert face-and-crack climbing with thoughtful movement and sharper grade feel." },
    { id: "coarse-and-buggy-joshua-tree", name: "Coarse and Buggy", grade: "5.11a metadata", type: "trad", length: "single-pitch metadata", theme: "Harder Joshua Tree route card for climbers who like technical desert face climbing." },
    { id: "room-to-shroom-joshua-tree", name: "Room to Shroom", grade: "5.9 metadata", type: "trad", length: "single-pitch metadata", theme: "Joshua Tree crack and face style with memorable name and useful practice value." },
    { id: "tumbling-rainbow-joshua-tree", name: "Tumbling Rainbow", grade: "5.10a metadata", type: "trad", length: "single-pitch metadata", theme: "Desert climbing with colorful name, technical movement, and route-finder charm." },
    { id: "rubicon-joshua-tree", name: "Rubicon", grade: "5.10a metadata", type: "trad", length: "single-pitch metadata", theme: "Classic Joshua Tree route-card energy for climbers stepping into harder trad." },
    { id: "the-orpheus-joshua-tree", name: "Orpheus", grade: "5.10c metadata", type: "trad", length: "single-pitch metadata", theme: "Technical desert climbing with a mythic name and focused attempt value." },
    { id: "the-oxymoron-joshua-tree", name: "Oxymoron", grade: "5.10a metadata", type: "trad", length: "single-pitch metadata", theme: "Joshua Tree face climbing with clever-name personality and technical lessons." },
    { id: "bedtime-for-bonzo-joshua-tree", name: "Bedtime for Bonzo", grade: "5.6 metadata", type: "trad", length: "single-pitch metadata", theme: "A friendlier Joshua Tree card for easygoing desert mileage." },
    { id: "satanic-mechanic-joshua-tree", name: "Satanic Mechanic", grade: "5.9 metadata", type: "trad", length: "single-pitch metadata", theme: "Joshua Tree trad climbing with mischievous name and practical technique focus." },
    { id: "the-chief-joshua-tree", name: "The Chief", grade: "5.5 metadata", type: "trad", length: "single-pitch metadata", theme: "Lower-grade desert route card for confidence and movement economy." },
    { id: "stichter-quits-joshua-tree", name: "Stichter Quits", grade: "5.7 metadata", type: "trad", length: "single-pitch metadata", theme: "A moderate Joshua Tree route card for steady crack-and-face practice." },
    { id: "the-wedge-joshua-tree", name: "The Wedge", grade: "5.7 metadata", type: "trad", length: "single-pitch metadata", theme: "Feature-driven desert climbing with approachable route-choice value." },
    { id: "chimney-cricket-joshua-tree", name: "Chimney Cricket", grade: "5.9 metadata", type: "trad", length: "single-pitch chimney metadata", theme: "Joshua Tree chimney style for climbers who want awkward technique on purpose." },
    { id: "western-saga-joshua-tree", name: "Western Saga", grade: "5.9 metadata", type: "trad", length: "multi-pitch metadata", theme: "Desert multipitch card with old-west atmosphere and team-rhythm value." },
    { id: "mental-physics-joshua-tree", name: "Mental Physics", grade: "5.7 metadata", type: "trad", length: "single-pitch crack metadata", theme: "Classic Joshua Tree crack climbing with honest technique and confidence value." },
    { id: "sublime-joshua-tree", name: "Sublime", grade: "5.10a metadata", type: "trad", length: "single-pitch metadata", theme: "Joshua Tree route card for technical desert movement and focused attempts." },
    { id: "tossed-green-joshua-tree", name: "Tossed Green", grade: "5.10a metadata", type: "trad", length: "single-pitch metadata", theme: "Desert face-climbing card with compact project and movement-reading value." },
    { id: "the-flue-joshua-tree", name: "The Flue", grade: "5.8 metadata", type: "trad", length: "single-pitch metadata", theme: "Joshua Tree route card for old-school terrain, body movement, and composure." }
  ]),
  "smith-rock-usa": v5Routes("smith-rock-usa", [
    { id: "monkey-face-west-face-variant-smith", name: "Monkey Face West Face Variant", grade: "5.9 A0 metadata", type: "multi-pitch", length: "tower route metadata", theme: "Iconic Smith Rock tower climbing with adventure and exposure personality." },
    { id: "cinnamon-slab-smith", name: "Cinnamon Slab", grade: "5.6 metadata", type: "trad", length: "two-pitch slab metadata", theme: "Friendly Smith Rock slab climbing with classic learning value." },
    { id: "bunny-face-smith", name: "Bunny Face", grade: "5.7 metadata", type: "sport", length: "single-pitch sport metadata", theme: "Approachable Smith Rock sport climbing for confidence and movement basics." },
    { id: "phoenix-smith", name: "Phoenix", grade: "5.10a metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock sport route card for stepping into sharper volcanic-tuff movement." },
    { id: "kunza-korner-smith", name: "Kunza Korner", grade: "5.10c metadata", type: "sport", length: "single-pitch sport metadata", theme: "Technical Smith Rock sport climbing with corner-style focus." },
    { id: "american-nirvana-smith", name: "American Nirvana", grade: "5.11c metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock route card for more sustained sport-climbing effort." },
    { id: "blackened-smith", name: "Blackened", grade: "5.11c/d metadata", type: "sport", length: "single-pitch sport metadata", theme: "Harder Smith Rock sport climbing with crisp project energy." },
    { id: "sky-ridge-smith", name: "Sky Ridge", grade: "5.8 metadata", type: "trad", length: "three-pitch metadata", theme: "Smith Rock multipitch route card with airy moderate adventure value." },
    { id: "white-satin-smith", name: "White Satin", grade: "5.9 metadata", type: "trad", length: "three-pitch metadata", theme: "Classic Smith Rock multipitch climbing for team rhythm and confidence." },
    { id: "sunset-slab-smith", name: "Sunset Slab", grade: "5.9 metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock slab sport climbing with movement economy and footwork lessons." },
    { id: "the-optimist-smith", name: "The Optimist", grade: "5.14b metadata", type: "sport", length: "single-pitch sport metadata", theme: "Elite Smith Rock sport climbing associated with high-end modern performance." },
    { id: "bad-man-smith", name: "Bad Man", grade: "5.12 metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock sport route card for climbers wanting a harder project flavor." },
    { id: "vomit-launch-smith", name: "Vomit Launch", grade: "5.11b metadata", type: "sport", length: "single-pitch sport metadata", theme: "Memorable Smith Rock sport climbing with punchy name and project value." },
    { id: "five-easy-pieces-smith", name: "Five Easy Pieces", grade: "5.8 metadata", type: "trad", length: "single-pitch metadata", theme: "Approachable Smith Rock trad card for steady movement and confidence." },
    { id: "phone-call-from-satan-smith", name: "Phone Call from Satan", grade: "5.9 metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock route card with a dramatic name and moderate sport focus." },
    { id: "toxic-smith", name: "Toxic", grade: "5.11b metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock sport climbing with focused attempts and technical tuff movement." },
    { id: "churning-in-the-wake-smith", name: "Churning in the Wake", grade: "5.13a metadata", type: "sport", length: "single-pitch sport metadata", theme: "Hard Smith Rock sport card for climbers comparing sharper projects." },
    { id: "watts-tots-smith", name: "Watts Tots", grade: "5.12b metadata", type: "sport", length: "single-pitch sport metadata", theme: "Historically important Smith Rock sport climbing with old-school testpiece identity." },
    { id: "darkness-at-noon-variant-smith", name: "Darkness at Noon context line", grade: "5.13a metadata", type: "sport", length: "single-pitch sport metadata", theme: "Hard Smith Rock sport context for advanced redpoint planning." },
    { id: "nine-gallon-buckets-smith", name: "9 Gallon Buckets", grade: "5.10c metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock sport route card with pocketed movement and useful project feel." },
    { id: "light-on-the-path-smith", name: "Light on the Path", grade: "5.10a metadata", type: "sport", length: "single-pitch sport metadata", theme: "Moderate Smith Rock sport card for confidence and clean movement." },
    { id: "jason-smith", name: "Jason", grade: "5.10c metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock sport card for climbers comparing technical mid-grade lines." },
    { id: "lycopodophyta-smith", name: "Lycopodophyta", grade: "5.7 metadata", type: "trad", length: "single-pitch metadata", theme: "Friendlier Smith Rock trad-style card for mileage and movement practice." },
    { id: "bloodline-smith", name: "Bloodline", grade: "5.12c metadata", type: "sport", length: "single-pitch sport metadata", theme: "Hard Smith Rock sport climbing with strong route-finder project identity." },
    { id: "latin-lover-smith", name: "Latin Lover", grade: "5.12a metadata", type: "sport", length: "single-pitch sport metadata", theme: "Smith Rock project card for sustained sport-climbing rhythm." },
    { id: "spiderman-buttress-line-smith", name: "Spiderman Buttress route line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Smith Rock sector-line card for west-side route choice and style comparison." },
    { id: "marsupials-route-line-smith", name: "Marsupials route line", grade: "5.8-5.14 metadata", type: "sport", length: "sector route-line metadata", theme: "Smith Rock Marsupials context for quieter sport climbing and harder options." },
    { id: "lower-gorge-basalt-line-smith", name: "Lower Gorge basalt line", grade: "5.10-5.13 metadata", type: "trad", length: "sector route-line metadata", theme: "Smith Rock basalt-sector card for climbers seeking a different rock style." }
  ]),
  "el-potrero-chico-mexico": v5Routes("el-potrero-chico-mexico", [
    { id: "selena-potrero", name: "Selena", grade: "5.9 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Friendly El Potrero Chico multipitch climbing with sunny limestone rhythm." },
    { id: "easy-rider-potrero", name: "Easy Rider", grade: "5.10a metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Moderate Potrero multipitch route card for confidence and team flow." },
    { id: "pitch-black-potrero", name: "Pitch Black", grade: "5.10d metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Potrero limestone route card with longer-team-day value." },
    { id: "dances-with-clams-potrero", name: "Dances with Clams", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Playful-name Potrero multipitch card for movement, pacing, and team systems." },
    { id: "mileski-wall-line-potrero", name: "Mileski Wall route line", grade: "5.8-5.12 metadata", type: "multi-pitch", length: "wall route-line metadata", theme: "Potrero sector-line context for approachable limestone multipitch days." },
    { id: "mota-wall-line-potrero", name: "Mota Wall route line", grade: "5.8-5.13 metadata", type: "multi-pitch", length: "wall route-line metadata", theme: "Classic Potrero wall context with many limestone route-choice directions." },
    { id: "el-toro-frontside-line-potrero", name: "El Toro frontside line", grade: "5.10-5.12+ metadata", type: "multi-pitch", length: "big-wall limestone metadata", theme: "Major Potrero wall context for bigger objectives and serious team pacing." },
    { id: "spires-route-line-potrero", name: "Spires route line", grade: "5.8-5.11 metadata", type: "multi-pitch", length: "limestone spire metadata", theme: "Potrero spire-style route-line card for scenic adventure climbing." },
    { id: "outrage-wall-line-potrero", name: "Outrage Wall route line", grade: "5.10-5.13 metadata", type: "sport", length: "single-pitch to multi-pitch metadata", theme: "Steeper Potrero limestone wall context for stronger sport days." },
    { id: "the-jungle-wall-line-potrero", name: "The Jungle Wall route line", grade: "5.8-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Potrero route-line card for shaded-feeling sport and multipitch variety." },
    { id: "la-popa-wall-line-potrero", name: "La Popa Wall route line", grade: "5.8-5.12 metadata", type: "multi-pitch", length: "wall route-line metadata", theme: "Limestone wall context for climbers comparing moderate Potrero objectives." },
    { id: "mini-super-wall-line-potrero", name: "Mini Super Wall route line", grade: "5.9-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Compact Potrero wall card for shorter sport and multipitch planning." },
    { id: "will-the-wolf-context-potrero", name: "Will the Wolf Survive context line", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Potrero multipitch style card for teams wanting a moderate adventure direction." },
    { id: "pancho-villa-context-potrero", name: "Pancho Villa context line", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Potrero route-card context with classic-name adventure energy." },
    { id: "black-cat-bone-context-potrero", name: "Black Cat Bone context line", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Longer-feeling Potrero limestone card for team systems and endurance." },
    { id: "supernova-context-potrero", name: "Supernova context line", grade: "5.11 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Potrero route-card context with a sharper grade and bigger-day mood." },
    { id: "treasure-context-potrero", name: "Treasure of the Sierra Madre context line", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Potrero multipitch context for scenic, story-name limestone climbing." },
    { id: "snot-girlz-context-potrero", name: "Snot Girlz context line", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Potrero card for moderate multipitch mileage and cheerful team rhythm." },
    { id: "space-boyz-context-potrero", name: "Space Boyz context line", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Potrero multipitch card with approachable grade and travel-classic feel." },
    { id: "yankee-clipper-context-potrero", name: "Yankee Clipper context line", grade: "5.12 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Harder Potrero limestone card for strong teams comparing bigger objectives." },
    { id: "estrellita-context-potrero", name: "Estrellita context line", grade: "5.10 metadata", type: "multi-pitch", length: "multi-pitch limestone metadata", theme: "Popular-feeling Potrero multipitch context for confident team movement." },
    { id: "time-wave-zero-context-potrero", name: "Time Wave Zero context line", grade: "5.12 metadata", type: "multi-pitch", length: "long limestone route metadata", theme: "Big Potrero limestone route context for endurance, pacing, and team commitment." },
    { id: "aguja-celo-rey-line-potrero", name: "Aguja Celo Rey route line", grade: "5.8-5.11 metadata", type: "multi-pitch", length: "spire route-line metadata", theme: "Potrero spire-card context for scenic limestone adventure." },
    { id: "cat-wall-line-potrero", name: "Cat Wall route line", grade: "5.9-5.12 metadata", type: "sport", length: "sector route-line metadata", theme: "Potrero wall card for comparing steeper sport and shorter objectives." },
    { id: "central-scrutinizer-line-potrero", name: "Central Scrutinizer line", grade: "5.10-5.12 metadata", type: "sport", length: "single-pitch to multi-pitch metadata", theme: "Potrero route-line card for focused limestone sport climbing." },
    { id: "diablo-wall-line-potrero", name: "Diablo Wall route line", grade: "5.10-5.13 metadata", type: "sport", length: "sector route-line metadata", theme: "Harder Potrero wall context for climbers wanting project energy." },
    { id: "cactus-pile-line-potrero", name: "Cactus Pile route line", grade: "5.7-5.11 metadata", type: "sport", length: "sector route-line metadata", theme: "Friendlier Potrero route-line card for warmups and easier mileage." },
    { id: "homero-wall-line-potrero", name: "Homero Wall route line", grade: "5.8-5.12 metadata", type: "multi-pitch", length: "sector route-line metadata", theme: "Potrero limestone wall context for balanced route choice and team practice." }
  ]),
  "grampians-australia": v5Routes("grampians-australia", [
    { id: "punks-in-the-gym-grampians", name: "Punks in the Gym", grade: "32 / 8b+ metadata", type: "sport", length: "single-pitch sandstone metadata", theme: "Historic Australian sport-climbing testpiece with benchmark difficulty context." },
    { id: "amniotic-world-grampians", name: "Amniotic World", grade: "V9 metadata", type: "boulder", length: "boulder problem metadata", theme: "Hollow Mountain Cave bouldering context linked to the Wheel of Life ecosystem." },
    { id: "x-treme-cool-grampians", name: "X-treme Cool", grade: "V9 metadata", type: "boulder", length: "boulder problem metadata", theme: "Grampians roof-bouldering card from the Hollow Mountain Cave link-up history." },
    { id: "shai-hulud-grampians", name: "Shai-Hulud", grade: "8B metadata", type: "boulder", length: "boulder problem metadata", theme: "Hard Grampians sandstone bouldering with cave-style project energy." },
    { id: "cave-girl-grampians", name: "Cave Girl", grade: "8A metadata", type: "boulder", length: "boulder problem metadata", theme: "Grampians cave boulder card for powerful movement and session tactics." },
    { id: "hollow-mountain-cave-line-grampians", name: "Hollow Mountain Cave line", grade: "V6-V15 metadata", type: "boulder", length: "cave route-line metadata", theme: "Sector-line context for Grampians roof bouldering and famous link-ups." },
    { id: "taipan-wall-route-line-grampians", name: "Taipan Wall route line", grade: "25-35 metadata", type: "sport", length: "wall route-line metadata", theme: "Grampians sport-climbing wall context with historical hard-route aura." },
    { id: "bundaleer-route-line-grampians", name: "Bundaleer route line", grade: "moderate to hard metadata", type: "trad", length: "wall route-line metadata", theme: "Grampians route-line card for longer traditional climbing and sandstone adventure." },
    { id: "rosea-route-line-grampians", name: "Mt Rosea route line", grade: "moderate to hard metadata", type: "trad", length: "multi-pitch sandstone metadata", theme: "Grampians multipitch sandstone context for scenic traditional objectives." },
    { id: "summerday-valley-line-grampians", name: "Summerday Valley route line", grade: "beginner to moderate metadata", type: "trad", length: "single-pitch sandstone metadata", theme: "Friendlier Grampians sector card for mileage, learning, and trip pacing." },
    { id: "gallery-route-line-grampians", name: "Gallery route line", grade: "sport metadata", type: "sport", length: "sector route-line metadata", theme: "Grampians sport-sector card for climbers comparing route styles before checking local updates." },
    { id: "kindergarten-route-line-grampians", name: "Kindergarten route line", grade: "easy to moderate metadata", type: "trad", length: "single-pitch metadata", theme: "Lower-pressure Grampians card for confidence and movement basics." },
    { id: "citadel-route-line-grampians", name: "Citadel route line", grade: "moderate to hard metadata", type: "trad", length: "sandstone route-line metadata", theme: "Grampians sandstone route-line card for adventurous traditional climbing." },
    { id: "fortress-route-line-grampians", name: "Fortress route line", grade: "moderate to hard metadata", type: "multi-pitch", length: "sandstone wall metadata", theme: "Larger Grampians wall context for teams wanting adventure and exposure." },
    { id: "red-rocks-route-line-grampians", name: "Red Rocks route line", grade: "moderate metadata", type: "trad", length: "single-pitch metadata", theme: "Grampians sandstone mileage card for easier route-choice days." },
    { id: "victoria-range-line-grampians", name: "Victoria Range line", grade: "boulder and route metadata", type: "boulder", length: "sector route-line metadata", theme: "Grampians sector context for bouldering variety and exploration." },
    { id: "andersens-route-line-grampians", name: "Andersens route line", grade: "boulder metadata", type: "boulder", length: "sector route-line metadata", theme: "Grampians bouldering card for sandstone movement and session planning." },
    { id: "stapylton-bouldering-line-grampians", name: "Stapylton bouldering line", grade: "boulder metadata", type: "boulder", length: "sector route-line metadata", theme: "Grampians bouldering context for classic sandstone problems and skin pacing." },
    { id: "northern-grampians-sport-line", name: "Northern Grampians sport line", grade: "sport metadata", type: "sport", length: "sector route-line metadata", theme: "Sport-climbing route-line card for stronger Grampians wall days." },
    { id: "sandstone-pocket-line-grampians", name: "Sandstone pocket line", grade: "moderate to hard metadata", type: "sport", length: "single-pitch metadata", theme: "Grampians sandstone card for pocket movement and controlled attempts." },
    { id: "orange-wall-line-grampians", name: "Orange Wall line", grade: "moderate to hard metadata", type: "sport", length: "wall route-line metadata", theme: "Colorful sandstone wall context for sport climbing and style comparison." },
    { id: "cave-traverse-line-grampians", name: "Cave Traverse line", grade: "hard boulder metadata", type: "boulder", length: "roof traverse metadata", theme: "Hard Grampians roof-traverse card inspired by the area's link-up culture." },
    { id: "sandbag-classic-line-grampians", name: "Sandbag classic line", grade: "traditional metadata", type: "trad", length: "single-pitch metadata", theme: "Grampians trad card for old-school grades, composure, and careful judgment." },
    { id: "halls-gap-route-line-grampians", name: "Halls Gap route line", grade: "moderate metadata", type: "trad", length: "sector route-line metadata", theme: "Accessible Grampians context for travel-day climbing and scenic movement." },
    { id: "hollow-mountain-warmup-line-grampians", name: "Hollow Mountain warmup line", grade: "boulder metadata", type: "boulder", length: "boulder circuit metadata", theme: "Bouldering session card for warming into Grampians sandstone without chasing the hardest link-up." },
    { id: "taipan-project-line-grampians", name: "Taipan project line", grade: "hard sport metadata", type: "sport", length: "single-pitch sport metadata", theme: "Hard Grampians sport card for climbers comparing ambitious Taipan-style goals." },
    { id: "watchtower-route-line-grampians", name: "Watchtower route line", grade: "moderate to hard metadata", type: "multi-pitch", length: "wall route-line metadata", theme: "Grampians multipitch card for exposure, route judgment, and sandstone movement." },
    { id: "southern-sandstone-line-grampians", name: "Southern Sandstone line", grade: "mixed metadata", type: "trad", length: "sector route-line metadata", theme: "Broad Grampians route-line card for quieter sandstone exploration." }
  ]),
  "rocklands-south-africa": v5Routes("rocklands-south-africa", [
    { id: "shosholoza-rocklands", name: "Shosholoza", grade: "8A metadata", type: "boulder", length: "boulder problem metadata", theme: "Classic Rocklands sandstone bouldering with powerful, memorable movement." },
    { id: "caroline-rocklands", name: "Caroline", grade: "7C+ metadata", type: "boulder", length: "boulder problem metadata", theme: "Rocklands boulder card with classic trip-list value and technical sandstone style." },
    { id: "sky-rocklands", name: "Sky", grade: "8B metadata", type: "boulder", length: "boulder problem metadata", theme: "Hard Rocklands sandstone boulder with clean line and aspirational project energy." },
    { id: "the-vice-rocklands", name: "The Vice", grade: "8B metadata", type: "boulder", length: "boulder problem metadata", theme: "Powerful Rocklands boulder card for climbers comparing high-end objectives." },
    { id: "the-hatchling-rocklands", name: "The Hatchling", grade: "8A metadata", type: "boulder", length: "boulder problem metadata", theme: "Rocklands sandstone boulder with memorable name and project-friendly difficulty." },
    { id: "tea-with-elmarie-rocklands", name: "Tea with Elmarie", grade: "8A metadata", type: "boulder", length: "boulder problem metadata", theme: "Classic Rocklands bouldering card with social-name charm and strong movement value." },
    { id: "creaking-heights-rocklands", name: "Creaking Heights", grade: "8B metadata", type: "boulder", length: "boulder problem metadata", theme: "Hard Rocklands sandstone boulder with height, composure, and project energy." },
    { id: "green-mamba-rocklands", name: "Green Mamba", grade: "8A metadata", type: "boulder", length: "boulder problem metadata", theme: "Rocklands boulder card with striking-name personality and powerful sandstone style." },
    { id: "the-arch-rocklands", name: "The Arch", grade: "7C metadata", type: "boulder", length: "boulder problem metadata", theme: "Feature-driven Rocklands boulder card for movement reading and confidence." },
    { id: "gliding-through-the-waves-like-dolphins-rocklands", name: "Gliding Through the Waves Like Dolphins", grade: "8A metadata", type: "boulder", length: "boulder problem metadata", theme: "Flowy Rocklands sandstone card with a long name and memorable movement mood." },
    { id: "the-quintessential-rocklands", name: "The Quintessential", grade: "8B metadata", type: "boulder", length: "boulder problem metadata", theme: "Hard Rocklands boulder card for climbers seeking a representative sandstone challenge." },
    { id: "rhino-rocklands", name: "Rhino", grade: "7B metadata", type: "boulder", length: "boulder problem metadata", theme: "Friendlier Rocklands boulder card for classic sandstone mileage and confidence." },
    { id: "cederberg-sunrise-line-rocklands", name: "Cederberg sunrise line", grade: "6C-8A metadata", type: "boulder", length: "sector route-line metadata", theme: "Rocklands sector-style card for scenic sandstone mileage and skin-smart sessions." },
    { id: "roadside-boulders-line-rocklands", name: "Roadside boulders line", grade: "6A-8A metadata", type: "boulder", length: "sector route-line metadata", theme: "Accessible Rocklands bouldering context for flexible session planning." },
    { id: "the-pass-project-line-rocklands", name: "The Pass project line", grade: "7A-8C metadata", type: "boulder", length: "sector route-line metadata", theme: "Rocklands sector card for harder problems and serious attempt management." },
    { id: "sassies-line-rocklands", name: "Sassies line", grade: "6C-8B metadata", type: "boulder", length: "sector route-line metadata", theme: "Rocklands bouldering sector context with classic movement variety." },
    { id: "de-pakhuis-line-rocklands", name: "De Pakhuys line", grade: "6A-8B metadata", type: "boulder", length: "sector route-line metadata", theme: "Rocklands area card for broad sandstone bouldering and trip planning." },
    { id: "field-of-joy-line-rocklands", name: "Field of Joy line", grade: "6A-8A metadata", type: "boulder", length: "sector route-line metadata", theme: "Friendlier Rocklands sector card for mileage, fun, and movement variety." },
    { id: "riverbed-line-rocklands", name: "Riverbed line", grade: "6C-8B metadata", type: "boulder", length: "sector route-line metadata", theme: "Rocklands bouldering context with varied sandstone movement and session pacing." },
    { id: "orange-circuit-line-rocklands", name: "Orange circuit line", grade: "6A-7C metadata", type: "boulder", length: "circuit route-line metadata", theme: "Circuit-style Rocklands card for lower-pressure mileage and skin management." },
    { id: "black-eagle-context-rocklands", name: "Black Eagle context line", grade: "8C metadata", type: "boulder", length: "boulder problem metadata", theme: "High-end Rocklands bouldering context connected to one of the area's hardest names." },
    { id: "golden-shadow-context-rocklands", name: "Golden Shadow context line", grade: "8B+ metadata", type: "boulder", length: "boulder problem metadata", theme: "Rocklands hard-boulder context for comparing Fred Nicole-era project style." },
    { id: "amandla-context-rocklands", name: "Amandla context line", grade: "8B+ metadata", type: "boulder", length: "boulder problem metadata", theme: "Rocklands hard-boulder context with historical project significance." },
    { id: "monkey-wedding-context-rocklands", name: "Monkey Wedding context line", grade: "8C metadata", type: "boulder", length: "boulder problem metadata", theme: "Elite Rocklands bouldering context for climbers comparing very hard sandstone projects." },
    { id: "red-sand-circuit-rocklands", name: "Red Sand circuit line", grade: "6A-8A metadata", type: "boulder", length: "circuit route-line metadata", theme: "Rocklands circuit card for sandstone movement, skin pacing, and trip rhythm." },
    { id: "roof-project-line-rocklands", name: "Roof project line", grade: "7B-8C metadata", type: "boulder", length: "sector route-line metadata", theme: "Steeper Rocklands boulder context for body tension and power sessions." },
    { id: "slab-and-arete-line-rocklands", name: "Slab and Arete line", grade: "6A-7C metadata", type: "boulder", length: "sector route-line metadata", theme: "Technical Rocklands card for footwork, balance, and non-powerful movement." },
    { id: "skin-smart-mileage-line-rocklands", name: "Skin-smart mileage line", grade: "6A-7C metadata", type: "boulder", length: "circuit route-line metadata", theme: "Rocklands session-planning card for sustainable mileage and recovery." }
  ])
};
export const destinations: Destination[] = [
  {
    slug: "yosemite-usa",
    name: "Yosemite",
    country: "USA",
    latitude: 37.8651,
    longitude: -119.5383,
    climbingTypes: ["trad", "multi-pitch", "boulder"],
    rockType: "Granite",
    bestSeasons: ["Spring", "Fall"],
    difficultyRange: "V8 / 5.6 - 5.14",
    beginnerFriendly: false,
    description:
      "A legendary granite valley known for long routes, big walls, and a deep climbing history.",
    guideContent: popularDestinationGuides["yosemite-usa"],
    externalResources: popularDestinationResources["yosemite-usa"],
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Tunnel%20View%2C%20Yosemite%20Valley%2C%20Yosemite%20NP%20-%20Diliff.jpg",
        alt: "Yosemite Valley seen from Tunnel View",
        caption:
          "Destination context photo: Yosemite Valley from Tunnel View.",
        credit: "David Iliff via Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Tunnel_View,_Yosemite_Valley,_Yosemite_NP_-_Diliff.jpg",
        imageType: "destination-context"
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/3/32/The_Nose_El_Capitan_Yosemite.jpg",
        alt: "El Capitan in Yosemite Valley",
        caption:
          "Destination context photo: El Capitan, one of Yosemite's central climbing landmarks.",
        credit: "Roy Luck via Wikimedia Commons",
        license: "CC BY 2.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:The_Nose_El_Capitan_Yosemite.jpg",
        imageType: "destination-context"
      }
    ],
    routes: [
      {
        id: "the-nose-el-capitan",
        name: "The Nose",
        grade: "VI 5.9 C2 / 5.14a free",
        type: "multi-pitch",
        length: "31 pitches, about 2,900 ft",
        style: "Historic granite big wall climbing on El Capitan's central prow.",
        summary:
          "A benchmark Yosemite big wall. ClimbAtlas treats this as a route highlight for history and style, not as a topo or beta source.",
        practiceFocus: [
          "multi-day systems",
          "efficient crack movement",
          "exposure management"
        ],
        bestFor:
          "Experienced big wall teams who already have strong systems and Yosemite-specific preparation.",
        sources: [
          {
            sourceLabel: "Wikipedia: The Nose (El Capitan)",
            sourceUrl: "https://en.wikipedia.org/wiki/The_Nose_(El_Capitan)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: El Capitan climbing history",
            sourceUrl: "https://en.wikipedia.org/wiki/El_Capitan",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["area context", "history"],
            notes: "Secondary open encyclopedia source for El Capitan context and climbing history."
          }
        ],
        images: [
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/3/32/The_Nose_El_Capitan_Yosemite.jpg",
            alt: "El Capitan with The Nose formation visible",
            caption: "Route context photo: The Nose on El Capitan.",
            credit: "Roy Luck via Wikimedia Commons",
            license: "CC BY 2.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:The_Nose_El_Capitan_Yosemite.jpg",
            imageType: "route"
          }
        ],
        editorialTips: [
          "Use this card for inspiration only; consult current official sources and local guidance before any attempt.",
          "This route is famous for logistics as much as movement, so practice hauling, changeovers, and team communication separately."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "regular-northwest-face-half-dome",
        name: "Regular Northwest Face",
        grade: "VI 5.9 A1 / 5.12a free",
          type: "multi-pitch",
        length: "23 pitches, about 2,000 ft",
        style: "Classic Half Dome big wall climbing on long granite terrain.",
        summary:
          "A historically important Grade VI route on Half Dome, included here as a verified route highlight with original ClimbAtlas notes.",
        practiceFocus: [
          "long-route pacing",
          "route finding",
          "big wall transitions"
        ],
        bestFor:
          "Advanced climbers building toward long Yosemite wall objectives with complex descent and weather planning.",
        sources: [
          {
            sourceLabel: "Wikipedia: Regular Northwest Face of Half Dome",
            sourceUrl:
            "https://en.wikipedia.org/wiki/Regular_Northwest_Face_of_Half_Dome",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Yosemite2.jpg",
            alt: "Half Dome with Regular Northwest Face route context",
            caption:
              "Route context photo: image used on the Regular Northwest Face article.",
            credit: "Thedus / PDphoto.org via Wikimedia Commons",
            license: "Public domain",
            sourceUrl: "https://commons.wikimedia.org/wiki/File:Yosemite2.jpg",
            imageType: "route"
          }
        ],
        editorialTips: [
          "Treat rockfall, weather, and descent planning as part of the objective, not as afterthoughts.",
          "Build comfort with moving efficiently for many pitches before thinking about speed."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "snake-dike-half-dome",
        name: "Snake Dike",
        grade: "5.7",
          type: "trad",
        length: "Listed as a notable Half Dome free climb",
        style: "Moderate technical grade with a serious alpine-feeling setting.",
        summary:
          "A real Half Dome route included as a style highlight. ClimbAtlas keeps the description broad and avoids approach, topo, or protection beta.",
        practiceFocus: [
          "slab footwork",
          "runout headspace",
          "long day preparation"
        ],
        bestFor:
          "Climbers who are comfortable with outdoor judgment and want to understand Yosemite slab-style movement.",
        sources: [
          {
            sourceLabel: "Wikipedia: Half Dome notable free climbs",
            sourceUrl: "https://en.wikipedia.org/wiki/Half_Dome",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Half_Dome_with_Eastern_Yosemite_Valley_%28Zuschnitt%29.jpg",
            alt: "Half Dome seen from Glacier Point",
            caption:
              "Area context photo: Half Dome from Glacier Point, not a route topo.",
            credit: "Thomas Wolf, www.foto-tw.de via Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Half_Dome_with_Eastern_Yosemite_Valley_(Zuschnitt).jpg",
            imageType: "area-context"
          }
        ],
        editorialTips: [
          "This card intentionally avoids approach and protection beta; use current local resources before making plans.",
          "Practice calm, precise footwork on lower-consequence slab before taking on bigger terrain."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "salathe-wall-el-capitan",
        name: "Salathe Wall",
        grade: "VI 5.13b/c free / C2 aid",
          type: "multi-pitch",
        length: "35 pitches, about 2,900 ft",
        style:
          "Historic El Capitan big wall climbing with demanding free-climbing history.",
        summary:
          "A major El Capitan line included for its place in Yosemite big wall history. ClimbAtlas keeps the note broad and avoids route beta.",
        practiceFocus: [
          "big wall endurance",
          "crack technique",
          "team efficiency"
        ],
        bestFor:
          "Advanced wall climbers studying Yosemite's long free and aid climbing progression.",
        sources: [
          {
            sourceLabel: "Wikipedia: Salathe Wall",
            sourceUrl: "https://en.wikipedia.org/wiki/Salath%C3%A9_Wall",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: El Capitan free climbing history",
            sourceUrl: "https://en.wikipedia.org/wiki/El_Capitan",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["history", "grade context"],
            notes: "Secondary source for El Capitan free-climbing context; not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Think of this as a history and style card, not a preparation checklist.",
          "Practice multi-hour crack climbing and wall transitions separately before considering objectives at this scale."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "steck-salathe-route-sentinel-rock",
        name: "Steck-Salathe Route",
        grade: "V 5.10a/b",
          type: "multi-pitch",
        length: "16 pitches, about 1,500 ft",
        style:
          "Old-school Sentinel Rock climbing known for physical chimney and crack terrain.",
        summary:
          "A Yosemite classic with a reputation for sustained traditional movement. The ClimbAtlas note stays high level and does not replace current local information.",
        practiceFocus: [
          "chimney movement",
          "wide crack comfort",
          "all-day pacing"
        ],
        bestFor:
          "Experienced trad climbers who want to understand Yosemite's physical, historic long-route style.",
        sources: [
          {
            sourceLabel: "Wikipedia: Steck-Salathe Route",
            sourceUrl: "https://en.wikipedia.org/wiki/Steck-Salath%C3%A9_Route",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use this card to identify the style, then verify current conditions and closures through official/local sources.",
          "Build wide-crack and chimney confidence in smaller settings before treating this as an objective."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "royal-arches-route",
        name: "Royal Arches Route",
        grade: "II 5.7 A0",
          type: "multi-pitch",
        length: "16 pitches, about 1,400 ft",
        style:
          "Moderate long traditional climbing on Yosemite's Royal Arches wall.",
        summary:
          "A frequently climbed Yosemite long route included as a verified highlight. ClimbAtlas avoids descent, fixed-rope, and route-finding details.",
        practiceFocus: [
          "long moderate terrain",
          "efficient transitions",
          "descent planning"
        ],
        bestFor:
          "Climbers progressing from shorter multi-pitch routes toward longer Yosemite days with more logistical judgment.",
        sources: [
          {
            sourceLabel: "Wikipedia: Royal Arches Route",
            sourceUrl: "https://en.wikipedia.org/wiki/Royal_Arches_Route",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Do not let the moderate technical grade hide the seriousness of a long day.",
          "Practice transitions, communication, and conservative turnaround decisions before committing to longer terrain."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "separate-reality",
        name: "Separate Reality",
        grade: "5.12a",
          type: "trad",
        length: "1 pitch, about 66 ft",
        style:
          "Exposed granite roof crack climbing with a famous place in free-climbing history.",
        summary:
          "A short route with a huge reputation. ClimbAtlas presents it as a style and history highlight, not as beta for the climb.",
        practiceFocus: [
          "roof crack movement",
          "core tension",
          "exposure control"
        ],
        bestFor:
          "Strong crack climbers interested in Yosemite's harder single-pitch history.",
        sources: [
          {
            sourceLabel: "Wikipedia: Separate Reality",
            sourceUrl:
            "https://en.wikipedia.org/wiki/Separate_Reality_(climb)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Short does not mean casual; separate the movement goal from the risk management conversation.",
          "Train roof crack movement and calm breathing before trying to measure yourself against an iconic line."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "midnight-lightning-camp-4",
        name: "Midnight Lightning",
        grade: "V8",
          type: "boulder",
        length: "About 25 ft",
        style:
          "Granite bouldering on Columbia Boulder in Camp 4, famous for its history and visual identity.",
        summary:
          "One of climbing's best-known boulder problems. ClimbAtlas includes it as a cultural and movement landmark, with no copied beta or user comments.",
        practiceFocus: [
          "mantel movement",
          "body tension",
          "highball composure"
        ],
        bestFor:
          "Boulderers studying classic Yosemite movement and the history of modern bouldering.",
        sources: [
          {
            sourceLabel: "Wikipedia: Midnight Lightning",
            sourceUrl: "https://en.wikipedia.org/wiki/Midnight_Lightning_(climb)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Rock climbing notable routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["history", "route significance"],
            notes: "General climbing-history source used only for notability context."
          }
        ],
        images: [
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Midnight_Lightning_yosemite.jpg",
            alt: "Climber on Midnight Lightning in Camp 4, Yosemite",
            caption: "Route photo: Midnight Lightning on Columbia Boulder.",
            credit: "Drew Smith via Wikimedia Commons",
            license: "CC BY-SA 2.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Midnight_Lightning_yosemite.jpg",
            imageType: "route"
          }
        ],
        editorialTips: [
          "Treat the famous image as context, not instruction; conditions and landing management still matter.",
          "Work highball confidence and controlled falling habits in safer settings first."
        ],
        communityStatus: "coming-soon"
          },
        ...popularRouteAdditions["yosemite-usa"],
        ...v2PopularRouteAdditions["yosemite-usa"],
        ...v3PopularRouteAdditions["yosemite-usa"]
        ]
  },
  {
    slug: "red-river-gorge-usa",
    name: "Red River Gorge",
    country: "USA",
    latitude: 37.8231,
    longitude: -83.6287,
    climbingTypes: ["sport", "trad"],
    rockType: "Sandstone",
    bestSeasons: ["Spring", "Fall"],
    difficultyRange: "5.6 - 5.14",
    beginnerFriendly: true,
    description:
      "A forested sandstone destination with many steep sport climbs and a welcoming climbing scene.",
    guideContent: popularDestinationGuides["red-river-gorge-usa"],
    externalResources: popularDestinationResources["red-river-gorge-usa"],
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Red%20River%20Gorge%20-%20Motherlode%201.jpg",
        alt: "Overhanging sandstone wall in the Motherlode area of Red River Gorge",
        caption:
          "Destination context photo: Motherlode sandstone wall in Red River Gorge.",
        credit: "Jarek Tuszynski via Wikimedia Commons",
        license: "CC BY 3.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Red_River_Gorge_-_Motherlode_1.jpg",
        imageType: "destination-context"
      }
    ],
    routes: [
      {
        id: "pure-imagination-red-river-gorge",
        name: "Pure Imagination",
        grade: "8c+ / 5.14c",
        type: "sport",
        length: "Single pitch",
        style:
          "Steep Red River Gorge endurance climbing on pocketed sandstone.",
        summary:
          "A modern Red testpiece included for its place in high-end sport climbing history. ClimbAtlas keeps this as a style note, not a route guide.",
        practiceFocus: [
          "power endurance",
          "pocket accuracy",
          "rest strategy"
        ],
        bestFor:
          "Advanced sport climbers studying sustained Red River Gorge movement.",
        sources: [
          {
            sourceLabel: "Wikipedia: Adam Ondra notable onsights",
            sourceUrl: "https://en.wikipedia.org/wiki/Adam_Ondra",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use the card to understand the style, then verify current conditions locally.",
          "Train linked sections rather than only isolated hard moves; the Red rewards staying relaxed while pumped."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "golden-ticket-red-river-gorge",
        name: "Golden Ticket",
        grade: "8c+ / 5.14c",
          type: "sport",
        length: "Single pitch",
        style:
          "High-end endurance sport climbing associated with the Red's steep sandstone walls.",
        summary:
          "A famous Red River Gorge route included as a verified route highlight through public ascent records.",
        practiceFocus: [
          "sustained clipping stance control",
          "pump management",
          "precise footwork"
        ],
        bestFor:
          "Experienced sport climbers comparing Red River Gorge power-endurance styles.",
        sources: [
          {
            sourceLabel: "Wikipedia: Adam Ondra notable onsights",
            sourceUrl: "https://en.wikipedia.org/wiki/Adam_Ondra",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Build comfort recovering on steep terrain before chasing the grade.",
          "Treat public grade records as context; conditions and personal style can change the experience."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "southern-smoke-direct-red-river-gorge",
        name: "Southern Smoke Direct",
        grade: "9a / 5.14d",
          type: "sport",
        length: "Single pitch",
        style:
          "Very hard sport climbing known for an important flash in climbing history.",
        summary:
          "A Red River Gorge milestone route included because public records identify it with a historic 9a flash.",
        practiceFocus: [
          "limit endurance",
          "flash preparation",
          "high-intensity route reading"
        ],
        bestFor:
          "Elite sport climbers and readers interested in major difficulty milestones.",
        sources: [
          {
            sourceLabel: "Wikipedia: List of grade milestones",
            sourceUrl:
            "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "This is included as history, not as an invitation to skip careful preparation.",
          "For most climbers, the useful lesson is efficient sequencing under fatigue."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "southern-smoke-red-river-gorge",
        name: "Southern Smoke",
        grade: "8c+ / 5.14c",
          type: "sport",
        length: "Single pitch",
        style:
          "Steep sport climbing tied to the Red's reputation for hard sandstone endurance.",
        summary:
          "A verified highlight from public ascent records, presented with original ClimbAtlas training notes only.",
        practiceFocus: [
          "forearm endurance",
          "efficient clipping",
          "paced breathing"
        ],
        bestFor:
          "Strong sport climbers learning how the Red's pumpy style differs from short crux climbing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Ashima Shiraishi redpointed routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Ashima_Shiraishi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Practice staying technically tidy after several minutes of climbing.",
          "Keep any future community notes separate from editorial advice until real users can submit them."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "lucifer-red-river-gorge",
        name: "Lucifer",
        grade: "8c+ / 5.14c",
          type: "sport",
        length: "Single pitch",
        style:
          "Hard Red River Gorge sport climbing with a public record in elite ascent lists.",
        summary:
          "A high-end sport route included to show the Red's harder side while keeping all guidance non-beta.",
        practiceFocus: [
          "steep body tension",
          "finger endurance",
          "mental reset between attempts"
        ],
        bestFor:
          "Advanced climbers comparing multiple 5.14c-style Red River Gorge objectives.",
        sources: [
          {
            sourceLabel: "Wikipedia: Ashima Shiraishi redpointed routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Ashima_Shiraishi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a benchmark card, not a substitute for current route information.",
          "When planning practice, separate strength training from outdoor decision-making."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "twenty-four-karats-red-river-gorge",
        name: "24 Karats",
        grade: "8c+ / 5.14c",
          type: "sport",
        length: "Single pitch",
        style:
          "Difficult Red River Gorge sport climbing listed in public elite ascent records.",
        summary:
          "A verified route highlight chosen to round out the Red's hard sport climbing profile.",
        practiceFocus: [
          "route fitness",
          "skin management",
          "repeat-burn strategy"
        ],
        bestFor:
          "Climbers interested in the Red's cluster of difficult endurance routes.",
        sources: [
          {
            sourceLabel: "Wikipedia: Ashima Shiraishi redpointed routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Ashima_Shiraishi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Plan training around quality attempts instead of simply adding volume.",
          "ClimbAtlas will add user comments here only after real accounts exist."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "fifty-words-for-pump-red-river-gorge",
        name: "50 Words for Pump",
        grade: "8c+ / 5.14c",
          type: "sport",
        length: "Single pitch",
        style:
          "A hard sport route whose name matches the Red's endurance identity.",
        summary:
          "A route highlight drawn from public ascent records and described here with original, non-instructional notes.",
        practiceFocus: [
          "pump tolerance",
          "movement economy",
          "clip-and-go rhythm"
        ],
        bestFor:
          "Sport climbers studying endurance as a skill, not just a fitness number.",
        sources: [
          {
            sourceLabel: "Wikipedia: Ashima Shiraishi redpointed routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Ashima_Shiraishi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use easier steep routes to practice relaxed hands and faster decisions.",
          "Do not treat the card as beta; it intentionally avoids sequences, holds, and clipping details."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "omaha-beach-red-river-gorge",
        name: "Omaha Beach",
        grade: "8b+ / 5.14a",
          type: "sport",
        length: "Single pitch",
        style:
          "Steep Red River Gorge sport climbing recorded in public flash/ascent notes.",
        summary:
          "A verified sport route highlight that helps show the Red beyond only the hardest 5.14c and 5.14d lines.",
        practiceFocus: [
          "onsight tactics",
          "steep endurance",
          "quick recovery"
        ],
        bestFor:
          "Strong sport climbers building toward harder Red River Gorge endurance routes.",
        sources: [
          {
            sourceLabel: "Wikipedia: Ashima Shiraishi French page",
            sourceUrl: "https://fr.wikipedia.org/wiki/Ashima_Shiraishi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Practice reading steep routes from the ground without overloading yourself with beta.",
          "Keep rest days and skin care in the plan; sandstone rewards patience."
        ],
        communityStatus: "coming-soon"
          },
        ...popularRouteAdditions["red-river-gorge-usa"],
        ...v2PopularRouteAdditions["red-river-gorge-usa"],
        ...v3PopularRouteAdditions["red-river-gorge-usa"]
        ]
  },
  {
    slug: "joshua-tree-usa",
    name: "Joshua Tree",
    country: "USA",
    latitude: 33.8734,
    longitude: -115.901,
    climbingTypes: ["trad", "boulder"],
    rockType: "Monzogranite",
    bestSeasons: ["Fall", "Winter", "Spring"],
    difficultyRange: "V0 - V12 / 5.4 - 5.13",
    beginnerFriendly: true,
    description:
      "A desert climbing area with short trad routes, boulders, and striking rock formations.",
    guideContent: popularDestinationGuides["joshua-tree-usa"],
    externalResources: popularDestinationResources["joshua-tree-usa"],
    routes: [
      {
        id: "double-cross-joshua-tree",
        name: "Double Cross",
        grade: "5.7",
        type: "trad",
        length: "Single pitch",
        style: "Classic desert crack climbing with a strong Stonemaster-era story.",
        summary:
          "A famous Joshua Tree route included for its place in Southern California climbing culture and early free-solo history.",
        practiceFocus: ["crack basics", "calm movement", "desert footwork"],
        bestFor:
          "Climbers who want a historically recognizable Joshua Tree style reference.",
        personalityTags: ["Historic testpiece", "Desert crack", "Classic experience"],
        decisionHint:
          "Pick this when you want a classic Joshua Tree story and a straightforward crack style reference.",
        sources: [
          {
            sourceLabel: "Wikipedia: John Long",
            sourceUrl: "https://en.wikipedia.org/wiki/John_Long_(climber)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Open biography source for Double Cross context; not used for route instructions."
          },
          {
            sourceLabel: "Wikipedia: John Bachar",
            sourceUrl: "https://en.wikipedia.org/wiki/John_Bachar",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Cross-checks the route in Bachar's early Joshua Tree free-solo history."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a style and history card, not a route instruction page.",
          "Desert cracks reward steady movement and thoughtful pacing more than rushing."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "equinox-joshua-tree",
        name: "Equinox",
        grade: "5.12c / 7c",
        type: "trad",
        length: "Single pitch",
        style: "Difficult monzogranite crack climbing with grade-milestone context.",
        summary:
          "A hard Joshua Tree crack associated with Jerry Moffatt's early 1980s flash, useful as a benchmark for the area's sharper end.",
        practiceFocus: ["finger strength", "crack power", "limit composure"],
        bestFor:
          "Advanced climbers studying hard traditional crack climbing and early flash milestones.",
        personalityTags: ["Finger puzzle", "Historic testpiece", "Power problem"],
        decisionHint:
          "Pick this as inspiration when you want a high-end crack objective with documented history.",
        sources: [
          {
            sourceLabel: "Wikipedia: Jerry Moffatt",
            sourceUrl: "https://en.wikipedia.org/wiki/Jerry_Moffatt",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Open biography source listing Moffatt's Equinox flash; not a route guide."
          },
          {
            sourceLabel: "Wikipedia: grade milestones",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade", "history", "ascentStyle"],
            notes:
              "Cross-checks Equinox as an early 7c flash milestone."
          }
        ],
        images: [],
        editorialTips: [
          "Treat the grade and history as context, not as a personal readiness guarantee.",
          "Prepare fingers and skin carefully before crack goals at this intensity."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "planet-x-joshua-tree",
        name: "Planet X",
        grade: "V6",
        type: "boulder",
        length: "Boulder problem",
        style: "Historic Joshua Tree bouldering from John Bachar's era.",
        summary:
          "A Bachar-associated boulder problem that helps show Joshua Tree's bouldering side beyond the short trad routes.",
        practiceFocus: ["body tension", "highball judgment", "precise movement"],
        bestFor:
          "Boulderers interested in Stonemaster-era style and early Joshua Tree problems.",
        personalityTags: ["Historic testpiece", "Technique lab", "Desert boulder"],
        decisionHint:
          "Pick this when you want bouldering history and a compact technical challenge.",
        sources: [
          {
            sourceLabel: "Wikipedia: John Bachar",
            sourceUrl: "https://en.wikipedia.org/wiki/John_Bachar",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Open biography source for basic public metadata; no movement beta is reused."
          }
        ],
        images: [],
        editorialTips: [
          "Bouldering entries should still be treated as style notes, not landing or sequence advice.",
          "Future community notes can add personal experience only after real user accounts exist."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "so-high-joshua-tree",
        name: "So High",
        grade: "V5",
        type: "boulder",
        length: "Highball boulder problem",
        style: "Committing Joshua Tree bouldering with a strong mental component.",
        summary:
          "A John Bachar problem included because public sources identify it as a notorious Joshua Tree highball.",
        practiceFocus: ["commitment", "movement control", "risk assessment"],
        bestFor:
          "Experienced boulderers thinking about the mental side of highball climbing.",
        personalityTags: ["Adventure mindset", "Technique lab", "Historic testpiece"],
        decisionHint:
          "Pick this as a mental-style reference when commitment is part of the appeal.",
        sources: [
          {
            sourceLabel: "Wikipedia: John Bachar",
            sourceUrl: "https://en.wikipedia.org/wiki/John_Bachar",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Open source identifies So High as a Bachar Joshua Tree boulder problem; not a safety or beta source."
          }
        ],
        images: [],
        editorialTips: [
          "Highball reputation should be respected; ClimbAtlas does not provide risk instructions.",
          "Use this card to think about mindset, not as an attempt recommendation."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "illusion-dweller-joshua-tree",
        name: "Illusion Dweller",
        grade: "5.10b",
        type: "trad",
        length: "Single pitch",
        style: "Classic Joshua Tree crack and face style, shown with cautious metadata.",
        summary:
          "A widely recognized Joshua Tree classic included as a route-choice card, but it still needs stronger open source verification before richer notes are added.",
        practiceFocus: ["trad composure", "crack technique", "desert movement"],
        bestFor:
          "Intermediate-to-experienced trad climbers comparing Joshua Tree classics.",
        personalityTags: ["Classic experience", "Desert crack", "Technique lab"],
        decisionHint:
          "Pick this when you want a classic moderate-hard Joshua Tree trad style marker.",
        sources: [
          {
            sourceLabel: "Joshua Tree National Park climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Joshua_Tree_National_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type"],
            notes:
              "Area source only; the route name and grade need stronger route-specific confirmation before expansion."
          }
        ],
        images: [],
        editorialTips: [
          "Single-source / weak-source route: keep the card short until a stronger source pack is added.",
          "Do not add approach, protection, or sequence notes."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "figures-on-a-landscape-joshua-tree",
        name: "Figures on a Landscape",
        grade: "5.10b",
        type: "trad",
        length: "Single pitch",
        style: "Bold Joshua Tree face-climbing reputation, kept as a conservative seed card.",
        summary:
          "A famous Joshua Tree route name included for route discovery, with source risk made visible rather than hidden.",
        practiceFocus: ["mental composure", "face climbing", "movement precision"],
        bestFor:
          "Experienced climbers looking at Joshua Tree's more heady reputation from a high-level perspective.",
        personalityTags: ["Adventure mindset", "Technique lab", "Classic experience"],
        decisionHint:
          "Pick this as a style reference when the mental side of face climbing is the point.",
        sources: [
          {
            sourceLabel: "Joshua Tree National Park climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Joshua_Tree_National_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type"],
            notes:
              "Area source only; route-specific facts should be strengthened before production use."
          }
        ],
        images: [],
        editorialTips: [
          "This is intentionally not a beta card; it only signals style and source status.",
          "Bold-route reputation needs current local research before any real-world plan."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "sail-away-joshua-tree",
        name: "Sail Away",
        grade: "5.8",
        type: "trad",
        length: "Single pitch",
        style: "Accessible desert trad style, included with cautious metadata.",
        summary:
          "A recognizable Joshua Tree moderate used here as a route-selection example for climbers comparing easier trad days.",
        practiceFocus: ["moderate trad flow", "footwork", "confidence building"],
        bestFor:
          "Climbers looking for a less extreme Joshua Tree style card in the atlas.",
        personalityTags: ["Classic experience", "Technique lab", "Desert crack"],
        decisionHint:
          "Pick this when you want the quiz to surface a more approachable trad-style option.",
        sources: [
          {
            sourceLabel: "Joshua Tree National Park climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Joshua_Tree_National_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type"],
            notes:
              "Area source only; route-specific metadata should be cross-checked with an acceptable route metadata source."
          }
        ],
        images: [],
        editorialTips: [
          "Use approachable route cards for choosing style, not for replacing local guide resources.",
          "Keep personal readiness and current conditions separate from the demo data."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "white-rastafarian-joshua-tree",
        name: "White Rastafarian",
        grade: "V3",
        type: "boulder",
        length: "Boulder problem",
        style: "Well-known Joshua Tree boulder problem, held as a cautious metadata card.",
        summary:
          "A familiar Joshua Tree bouldering name included to broaden the destination beyond trad routes while keeping source limits visible.",
        practiceFocus: ["bouldering movement", "body position", "desert friction"],
        bestFor:
          "Boulderers who want a lower-grade Joshua Tree style reference in the route finder.",
        personalityTags: ["Desert boulder", "Technique lab", "Style sampler"],
        decisionHint:
          "Pick this when you want a bouldering-flavored Joshua Tree recommendation.",
        sources: [
          {
            sourceLabel: "Hidden Valley climbing context",
            sourceUrl:
              "https://en.wikipedia.org/wiki/Hidden_Valley_(Joshua_Tree_National_Park)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context"],
            notes:
              "Context source only; route-specific facts need stronger verification before launch."
          }
        ],
        images: [],
        editorialTips: [
          "This card is deliberately light until better source metadata is added.",
          "Do not infer landing, height, or sequence details from the route name alone."
        ],
        communityStatus: "coming-soon"
      },
      ...popularRouteAdditions["joshua-tree-usa"],
      ...v6PopularRouteAdditions["joshua-tree-usa"]
    ]
  },
  {
    slug: "smith-rock-usa",
    name: "Smith Rock",
    country: "USA",
    latitude: 44.368,
    longitude: -121.1392,
    climbingTypes: ["sport", "trad", "multi-pitch"],
    rockType: "Tuff",
    bestSeasons: ["Spring", "Fall"],
    difficultyRange: "5.7 - 5.14",
    beginnerFriendly: true,
    description:
      "A dramatic canyon area often associated with early sport climbing in North America.",
    guideContent: popularDestinationGuides["smith-rock-usa"],
    externalResources: popularDestinationResources["smith-rock-usa"],
    routes: [
      {
        id: "to-bolt-or-not-to-be-smith-rock",
        name: "To Bolt or Not to Be",
        grade: "5.14a / 8b+",
        type: "sport",
        length: "Single pitch",
        style: "Historic Smith Rock sport climb and early American difficulty milestone.",
        summary:
          "A key Smith Rock route tied to the rise of modern American sport climbing and early 5.14 difficulty.",
        practiceFocus: ["sport climbing history", "power endurance", "limit tactics"],
        bestFor:
          "Advanced climbers studying how Smith Rock shaped sport climbing standards.",
        personalityTags: ["Historic testpiece", "Power problem", "Sport milestone"],
        decisionHint:
          "Pick this when you want a route with maximum sport-climbing history weight.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "type", "area"],
            notes:
              "Open area source listing notable routes; not used for route beta."
          },
          {
            sourceLabel: "Wikipedia: grade milestones",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade", "history"],
            notes:
              "Cross-checks the route as an early 8b+ / 5.14a milestone."
          }
        ],
        images: [],
        editorialTips: [
          "Historic difficulty does not automatically mean it is the right route for the day.",
          "Use this as a benchmark card for sport-climbing progression, not as attempt beta."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "chain-reaction-smith-rock",
        name: "Chain Reaction",
        grade: "5.12c",
        type: "sport",
        length: "Single pitch",
        style: "Iconic Dihedrals sport climbing with strong visual identity.",
        summary:
          "A famous Smith Rock sport route included for its public recognition and place in the area's sport climbing story.",
        practiceFocus: ["power endurance", "clipping rhythm", "composure"],
        bestFor:
          "Sport climbers who want a classic Smith Rock reference point below the hardest grades.",
        personalityTags: ["Historic testpiece", "Endurance quest", "Classic experience"],
        decisionHint:
          "Pick this when you want a classic sport route with both history and style.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "type", "area"],
            notes:
              "Open area source listing Chain Reaction among notable Dihedrals routes."
          },
          {
            sourceLabel: "Wikipedia: Geoff Weigand",
            sourceUrl: "https://en.wikipedia.org/wiki/Geoff_Weigand",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes:
              "Athlete biography source cross-checks the route as a Smith Rock ascent."
          }
        ],
        images: [],
        editorialTips: [
          "Think about efficient effort across the full pitch rather than only the hardest move.",
          "Keep public notes broad; no clipped-position or sequence beta belongs here."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "just-do-it-smith-rock",
        name: "Just Do It",
        grade: "5.14c",
        type: "sport",
        length: "Single pitch",
        style: "Monkey Face testpiece and elite Smith Rock sport climbing.",
        summary:
          "A famous Monkey Face route included as an elite sport-climbing benchmark and a reminder that Smith Rock spans far beyond moderate classics.",
        practiceFocus: ["elite endurance", "project discipline", "mental reset"],
        bestFor:
          "Advanced readers following hard sport climbing history and benchmark routes.",
        personalityTags: ["Historic testpiece", "Elite project", "Power endurance"],
        decisionHint:
          "Pick this as inspiration when the goal is elite sport-climbing history.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "type", "area"],
            notes:
              "Open source identifies Just Do It as a famous Monkey Face testpiece."
          }
        ],
        images: [],
        editorialTips: [
          "Elite route cards are useful for inspiration, but not personal readiness advice.",
          "Project discipline matters as much as raw strength at this level."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "heinous-cling-smith-rock",
        name: "Heinous Cling",
        grade: "5.12c",
        type: "sport",
        length: "Single pitch",
        style: "Classic hard Smith Rock sport climbing from the Dihedrals.",
        summary:
          "A notable 5.12c sport route connected with early Smith Rock hard climbing and later repeat history.",
        practiceFocus: ["finger endurance", "sport pacing", "technical power"],
        bestFor:
          "Sport climbers comparing Smith Rock's 5.12 testpiece style.",
        personalityTags: ["Finger puzzle", "Sport milestone", "Classic experience"],
        decisionHint:
          "Pick this when you want a hard sport route with early Smith Rock context.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "type", "area"],
            notes:
              "Open area source listing Heinous Cling among notable Dihedrals routes."
          },
          {
            sourceLabel: "Wikipedia: Geoff Weigand",
            sourceUrl: "https://en.wikipedia.org/wiki/Geoff_Weigand",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "repeat"],
            notes:
              "Cross-checks historical repeat context in an athlete biography."
          }
        ],
        images: [],
        editorialTips: [
          "Hard sport classics often reward repeated calm attempts more than frantic burns.",
          "Keep source-backed history separate from any personal route plan."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "west-face-variation-smith-rock",
        name: "West Face Variation",
        grade: "5.9 A1",
        type: "multi-pitch",
        length: "Monkey Face route",
        style: "Iconic tower climbing on Monkey Face with adventure character.",
        summary:
          "A Monkey Face featured route included to represent Smith Rock's tower and multi-pitch adventure side.",
        practiceFocus: ["exposure management", "systems practice", "route judgment"],
        bestFor:
          "Climbers interested in Smith Rock as more than single-pitch sport climbing.",
        personalityTags: ["Adventure mindset", "Classic experience", "Tower route"],
        decisionHint:
          "Pick this when you want a route-choice card with tower atmosphere and systems focus.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "area", "type"],
            notes:
              "Open source names West Face Variation as a featured Monkey Face route."
          }
        ],
        images: [],
        editorialTips: [
          "Adventure-style cards can mention systems practice without becoming a route guide.",
          "Confirm current local details elsewhere before any real objective."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "five-gallon-buckets-smith-rock",
        name: "5 Gallon Buckets",
        grade: "5.8",
        type: "sport",
        length: "Single pitch",
        style: "Moderate Morning Glory Wall sport climbing.",
        summary:
          "A notable easier Smith Rock sport route included so the atlas can recommend something other than elite testpieces.",
        practiceFocus: ["lead confidence", "movement economy", "sport basics"],
        bestFor:
          "Climbers looking for a more approachable Smith Rock sport-climbing style card.",
        personalityTags: ["Style sampler", "Classic experience", "Confidence builder"],
        decisionHint:
          "Pick this when the quiz should surface a lighter Smith Rock sport option.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "type", "area"],
            notes:
              "Open area source listing 5 Gallon Buckets among Morning Glory Wall routes."
          }
        ],
        images: [],
        editorialTips: [
          "Moderate sport routes are useful for confidence and pacing, not only warmups.",
          "No route beta or clip-by-clip advice is included."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "superslab-smith-rock",
        name: "Superslab",
        grade: "5.6",
        type: "trad",
        length: "3 pitches",
        style: "Moderate Red Wall multi-pitch trad climbing.",
        summary:
          "A classic easier multi-pitch route used to represent Smith Rock's approachable trad side.",
        practiceFocus: ["multi-pitch basics", "slab movement", "calm pacing"],
        bestFor:
          "Climbers who want a Smith Rock route card focused on easier multi-pitch practice.",
        personalityTags: ["Adventure mindset", "Confidence builder", "Technique lab"],
        decisionHint:
          "Pick this when you want a gentler multi-pitch learning objective in the recommendation set.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "type", "area"],
            notes:
              "Open area source listing Superslab as a Red Wall 5.6 trad route with three pitches."
          }
        ],
        images: [],
        editorialTips: [
          "Easy grades can still be meaningful when rope systems and exposure enter the day.",
          "Use this for choosing practice focus, not for route logistics."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "wherever-i-may-roam-smith-rock",
        name: "Wherever I May Roam",
        grade: "5.9",
        type: "sport",
        length: "5 pitches",
        style: "Moderate multi-pitch sport climbing in the Smith Rock Group.",
        summary:
          "A longer moderate Smith Rock route card that helps the Route Finder recommend endurance and systems practice without jumping to extreme grades.",
        practiceFocus: ["multi-pitch rhythm", "endurance", "team pacing"],
        bestFor:
          "Climbers interested in moderate-length sport multi-pitch climbing.",
        personalityTags: ["Endurance quest", "Adventure mindset", "Confidence builder"],
        decisionHint:
          "Pick this when you want a moderate route with more of a journey feel.",
        sources: [
          {
            sourceLabel: "Wikipedia: Smith Rock State Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Smith_Rock_State_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "type", "area"],
            notes:
              "Open area source listing Wherever I May Roam among Smith Rock Group routes."
          }
        ],
        images: [],
        editorialTips: [
          "For longer moderate days, practice transitions and communication as much as movement.",
          "ClimbAtlas keeps this as a choice card rather than a guidebook substitute."
        ],
        communityStatus: "coming-soon"
      },
      ...popularRouteAdditions["smith-rock-usa"],
      ...v6PopularRouteAdditions["smith-rock-usa"]
    ]
  },
  {
    slug: "squamish-canada",
    name: "Squamish",
    country: "Canada",
    latitude: 49.7016,
    longitude: -123.1558,
    climbingTypes: ["trad", "boulder", "multi-pitch", "sport"],
    rockType: "Granite",
    bestSeasons: ["Summer", "Fall"],
    difficultyRange: "V0 - V14 / 5.6 - 5.14",
    beginnerFriendly: true,
    description:
      "A coastal granite hub with bouldering, single-pitch crags, and long routes above the forest.",
    guideContent: popularDestinationGuides["squamish-canada"],
    externalResources: popularDestinationResources["squamish-canada"],
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Stawamus%20Chief%20Provincial%20Park%2C%20BC%20%28DSCF7743%29.jpg",
        alt: "Stawamus Chief Provincial Park above Squamish",
        caption:
          "Destination context photo: Stawamus Chief Provincial Park above Squamish.",
        credit: "Trougnouf via Wikimedia Commons",
        license: "CC BY 4.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Stawamus_Chief_Provincial_Park,_BC_(DSCF7743).jpg",
        imageType: "destination-context"
      }
    ],
    routes: [
      {
        id: "cobra-crack-squamish",
        name: "Cobra Crack",
        grade: "5.14b",
        type: "trad",
        length: "1 pitch, about 45 m",
        style:
          "Hard granite crack climbing on the backside of Stawamus Chief.",
        summary:
          "A Squamish testpiece included for its verified place among the world's hard traditional crack climbs.",
        practiceFocus: [
          "finger crack strength",
          "pain tolerance",
          "precision footwork"
        ],
        bestFor:
          "Elite crack climbers and readers studying modern hard traditional climbing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Cobra Crack",
            sourceUrl: "https://en.wikipedia.org/wiki/Cobra_Crack",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Sonnie Trotter notable ascents",
            sourceUrl: "https://en.wikipedia.org/wiki/Sonnie_Trotter",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "history"],
            notes: "Athlete biography source used as a secondary metadata check."
          }
        ],
        images: [
          {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Stawamus%20Chief%20Provincial%20Park%2C%20BC%20%28DSCF7743%29.jpg",
            alt: "Stawamus Chief Provincial Park above Squamish",
            caption:
              "Area context photo, not exact route: Stawamus Chief Provincial Park above Squamish.",
            credit: "Trougnouf via Wikimedia Commons",
            license: "CC BY 4.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Stawamus_Chief_Provincial_Park,_BC_(DSCF7743).jpg",
            imageType: "area-context"
          }
        ],
        editorialTips: [
          "This is a history and style card, not an attempt plan.",
          "For crack goals, train skin management and controlled effort as seriously as strength."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "grand-wall-squamish",
        name: "The Grand Wall",
        grade: "Historic multi-pitch route",
          type: "multi-pitch",
        length: "Long Chief route",
        style:
          "Exposed granite wall climbing on the central face of Stawamus Chief.",
        summary:
          "A defining Squamish wall feature and route name, included because public sources identify its early ascent history.",
        practiceFocus: [
          "multi-pitch efficiency",
          "granite crack systems",
          "exposure management"
        ],
        bestFor:
          "Experienced multi-pitch climbers studying Squamish's big granite identity.",
        sources: [
          {
            sourceLabel: "Wikipedia: Stawamus Chief rock climbing",
            sourceUrl: "https://en.wikipedia.org/wiki/Stawamus_Chief",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Verify current route details from local sources before planning; this card only confirms the highlight exists.",
          "Practice clean rope systems before stepping onto longer granite terrain."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "banana-peel-squamish",
        name: "Banana Peel",
        grade: "Moderate multi-pitch",
          type: "multi-pitch",
        length: "Apron route",
        style:
          "Lower-angle granite slab and face climbing on the Apron of the Chief.",
        summary:
          "A recognizable Squamish Apron route shown in public Stawamus Chief media, included as a beginner-to-intermediate style marker.",
        practiceFocus: [
          "slab footwork",
          "route pacing",
          "calm balance"
        ],
        bestFor:
          "Climbers progressing into longer granite days without jumping straight to steep wall objectives.",
        sources: [
          {
            sourceLabel: "Wikipedia: Stawamus Chief gallery",
            sourceUrl: "https://en.wikipedia.org/wiki/Stawamus_Chief",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["name", "area context"],
            notes: "Context source; useful for orientation but not enough for production route detail by itself."
          }
        ],
        images: [],
        editorialTips: [
          "Lower-angle granite can still feel serious when the day is long.",
          "Build trust in your feet and keep movement smooth rather than rushed."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "split-pillar-squamish",
        name: "Split Pillar",
        grade: "Grand Wall feature",
          type: "trad",
        length: "Feature/route section",
        style:
          "A striking crack feature associated with the Grand Wall area.",
        summary:
          "Included as a named Squamish climbing feature because public sources identify it as a renowned partially detached flake.",
        practiceFocus: [
          "crack rhythm",
          "rest-position awareness",
          "granite jamming"
        ],
        bestFor:
          "Climbers learning how individual pitches and features shape the identity of a long route.",
        sources: [
          {
            sourceLabel: "Wikipedia: Stawamus Chief features",
            sourceUrl: "https://en.wikipedia.org/wiki/Stawamus_Chief",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["name", "area context"],
            notes: "Context source; useful for orientation but not enough for production route detail by itself."
          }
        ],
        images: [],
        editorialTips: [
          "Treat feature cards as context rather than complete route entries.",
          "Future community notes can help distinguish feature history from current climbing conditions."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "rutabaga-squamish",
        name: "Rutabaga",
        grade: "5.11a",
          type: "trad",
        length: "Traditional route on Stawamus Chief",
        style:
          "Granite traditional climbing mentioned in public reporting about Squamish.",
        summary:
          "A verified named Squamish route included with a cautious note because the public source is incident reporting, not a guide.",
        practiceFocus: [
          "weather judgment",
          "helmet habits",
          "conservative decisions"
        ],
        bestFor:
          "Experienced trad climbers thinking carefully about risk, conditions, and partner communication.",
        sources: [
          {
            sourceLabel: "Wikipedia: Will Stanhope",
            sourceUrl: "https://en.wikipedia.org/wiki/Will_Stanhope",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Because the source context involves an accident, this card focuses on judgment rather than performance.",
          "Check weather and rock condition carefully before any Squamish trad plan."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "tom-egan-memorial-route-squamish",
        name: "The Tom Egan Memorial Route",
        grade: "5.14",
          type: "trad",
        length: "Hard traditional route",
        style:
          "Difficult Squamish traditional climbing associated with Will Stanhope's first ascents.",
        summary:
          "A high-end local route included from public biographical records, with no copied beta or route description.",
        practiceFocus: [
          "hard trad headspace",
          "technical precision",
          "risk assessment"
        ],
        bestFor:
          "Advanced climbers studying the upper end of Squamish traditional climbing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Will Stanhope",
            sourceUrl: "https://en.wikipedia.org/wiki/Will_Stanhope",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a verified-name placeholder until richer, permission-safe sources are added.",
          "Future user notes should separate personal impressions from safety-critical information."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "split-tailed-beaver-squamish",
        name: "Split-tailed Beaver",
        grade: "5.10b",
          type: "trad",
        length: "Single-pitch style route",
        style:
          "Granite route referenced in public media connected to Squamish climbing.",
        summary:
          "A modestly graded Squamish route added from a public episode listing, useful for widening the grade spread in the prototype.",
        practiceFocus: [
          "granite footwork",
          "gear confidence",
          "steady pacing"
        ],
        bestFor:
          "Intermediate climbers comparing lower-grade Squamish terrain with harder Chief objectives.",
        sources: [
          {
            sourceLabel: "Wikipedia: Exploring the Unknown with Wang Yibo Season 2",
            sourceUrl:
            "https://en.wikipedia.org/wiki/Exploring_the_Unknown_with_Wang_Yibo_Season_2",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["name", "grade"],
            notes: "Weak contextual source; replace with a stronger climbing-specific source before launch."
          }
        ],
        images: [],
        editorialTips: [
          "This route needs a stronger climbing-specific source before it should be treated as production-quality content.",
          "Keep it as a demo card for now, clearly separated from user reviews."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "shock-wall-squamish",
        name: "Shock Wall",
        grade: "5.10d",
          type: "trad",
        length: "Three sections",
        style:
          "Granite route referenced in public media as an advanced Squamish challenge.",
        summary:
          "A provisional verified-name card included to keep the Squamish template at eight routes while stronger sources are gathered.",
        practiceFocus: [
          "sustained movement",
          "route reading",
          "partner communication"
        ],
        bestFor:
          "Intermediate-to-advanced climbers learning how Squamish routes can feel technical before the very high grades.",
        sources: [
          {
            sourceLabel: "Wikipedia: Exploring the Unknown with Wang Yibo Season 2",
            sourceUrl:
            "https://en.wikipedia.org/wiki/Exploring_the_Unknown_with_Wang_Yibo_Season_2",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["name", "grade"],
            notes: "Weak contextual source; replace with a stronger climbing-specific source before launch."
          }
        ],
        images: [],
        editorialTips: [
          "Flag this as a content item that deserves a better source before launch.",
          "Do not add community comments until real users can submit attributed notes."
        ],
        communityStatus: "coming-soon"
          },
        ...popularRouteAdditions["squamish-canada"],
        ...v2PopularRouteAdditions["squamish-canada"],
        ...v3PopularRouteAdditions["squamish-canada"]
        ]
  },
  {
    slug: "el-potrero-chico-mexico",
    name: "El Potrero Chico",
    country: "Mexico",
    latitude: 25.9498,
    longitude: -100.4867,
    climbingTypes: ["sport", "multi-pitch"],
    rockType: "Limestone",
    bestSeasons: ["Winter", "Spring"],
    difficultyRange: "5.7 - 5.13",
    beginnerFriendly: true,
    description:
      "A limestone canyon famous for accessible long sport routes and sunny winter climbing.",
    guideContent: popularDestinationGuides["el-potrero-chico-mexico"],
    externalResources: popularDestinationResources["el-potrero-chico-mexico"],
    routes: [
      {
        id: "el-sendero-luminoso-potrero-chico",
        name: "El Sendero Luminoso",
        grade: "5.12+ / Grade V",
        type: "multi-pitch",
        length: "15 pitches, about 1,500 ft",
        style: "Long bolted limestone wall climbing on El Toro.",
        summary:
          "A major El Potrero Chico route with strong public documentation, included as the destination's best-sourced high-end wall highlight.",
        practiceFocus: ["long-route endurance", "systems efficiency", "mental pacing"],
        bestFor:
          "Experienced climbers studying long bolted limestone routes and modern free-solo history.",
        personalityTags: ["Endurance quest", "Adventure mindset", "Historic testpiece"],
        decisionHint:
          "Pick this when you want a big-wall sport route with verified public history.",
        sources: [
          {
            sourceLabel: "Wikipedia: El Sendero Luminoso",
            sourceUrl: "https://en.wikipedia.org/wiki/El_Sendero_Luminoso",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "type", "history"],
            notes:
              "Open route page for public metadata; ClimbAtlas does not reuse route beta or descent information."
          },
          {
            sourceLabel: "Wikipedia: Potrero Chico",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["location", "rock type", "area context"],
            notes:
              "Area source for Potrero Chico's limestone canyon context."
          }
        ],
        images: [],
        editorialTips: [
          "Long bolted wall routes demand pacing and team systems, not just sport strength.",
          "This card intentionally avoids approach, rappel, and pitch-by-pitch information."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "time-wave-zero-potrero-chico",
        name: "Time Wave Zero",
        grade: "5.12a metadata",
        type: "multi-pitch",
        length: "Long multi-pitch route",
        style: "Very long limestone sport climbing, included with cautious metadata.",
        summary:
          "A widely known Potrero long route used here as a route-choice card, but it needs stronger source verification before richer notes are added.",
        practiceFocus: ["endurance", "team pacing", "long-day preparation"],
        bestFor:
          "Climbers comparing Potrero's long-route style without needing route beta from ClimbAtlas.",
        personalityTags: ["Endurance quest", "Adventure mindset", "Sport journey"],
        decisionHint:
          "Pick this when you want the recommendation to lean toward a long sport-climbing journey.",
        sources: [
          {
            sourceLabel: "Wikipedia: Potrero Chico area context",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "rock type", "area style"],
            notes:
              "Area source only; route name and grade should be strengthened with route-specific metadata before production use."
          }
        ],
        images: [],
        editorialTips: [
          "Weak-source route: keep it as a discovery card until a stronger source pack is added.",
          "Do not add rappel, approach, or pitch information to this seed entry."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "estrellita-potrero-chico",
        name: "Estrellita",
        grade: "5.10b metadata",
        type: "multi-pitch",
        length: "Multi-pitch route",
        style: "Moderate limestone multi-pitch sport style, held as cautious metadata.",
        summary:
          "A commonly referenced Potrero moderate included so the Route Finder can suggest something less extreme than the headline walls.",
        practiceFocus: ["moderate endurance", "multi-pitch rhythm", "confidence"],
        bestFor:
          "Climbers seeking a more approachable Potrero-style recommendation in the atlas.",
        personalityTags: ["Confidence builder", "Endurance quest", "Sport journey"],
        decisionHint:
          "Pick this when you want a moderate multi-pitch style card rather than a limit route.",
        sources: [
          {
            sourceLabel: "Wikipedia: Potrero Chico area context",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "rock type", "area style"],
            notes:
              "Area context source only; route metadata needs a stronger independent source."
          }
        ],
        images: [],
        editorialTips: [
          "Moderate long routes still require planning and partner systems.",
          "This card remains non-beta until verified route-specific sources are added."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "yankee-clipper-potrero-chico",
        name: "Yankee Clipper",
        grade: "5.12a metadata",
        type: "multi-pitch",
        length: "Multi-pitch route",
        style: "Long bolted limestone climbing with advanced sport-route character.",
        summary:
          "A Potrero long-route name included as conservative metadata for comparison and route discovery.",
        practiceFocus: ["sport endurance", "attempt pacing", "partner communication"],
        bestFor:
          "Experienced sport climbers comparing harder long-route options in the canyon.",
        personalityTags: ["Endurance quest", "Sport journey", "Power endurance"],
        decisionHint:
          "Pick this when your route preference points toward harder long limestone sport climbing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Potrero Chico area context",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "rock type", "area style"],
            notes:
              "Area source only; route-specific facts should be cross-checked before launch."
          }
        ],
        images: [],
        editorialTips: [
          "Keep this as a comparison card until source quality improves.",
          "No pitch, descent, or routefinding details are included."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "space-boyz-potrero-chico",
        name: "Space Boyz",
        grade: "5.10d metadata",
        type: "multi-pitch",
        length: "Multi-pitch route",
        style: "Moderate-to-intermediate bolted limestone climbing.",
        summary:
          "A Potrero route card included to represent the area's approachable long sport climbing culture while clearly marking source limits.",
        practiceFocus: ["movement economy", "sport systems", "steady pacing"],
        bestFor:
          "Climbers who want a non-elite Potrero route style in the recommendation set.",
        personalityTags: ["Confidence builder", "Sport journey", "Style sampler"],
        decisionHint:
          "Pick this when you want a friendlier long-route flavor in the atlas quiz.",
        sources: [
          {
            sourceLabel: "Wikipedia: Potrero Chico area context",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "rock type", "area style"],
            notes:
              "Area source only; add a route-specific source before richer editorial use."
          }
        ],
        images: [],
        editorialTips: [
          "This card is for route preference matching, not real-world logistics.",
          "Future source packs should verify grade, length, and route history."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "snot-girlz-potrero-chico",
        name: "Snot Girlz",
        grade: "5.10d metadata",
        type: "multi-pitch",
        length: "Multi-pitch route",
        style: "Accessible long limestone route style with cautious metadata.",
        summary:
          "A recognizable Potrero name included as a placeholder-quality route card until better source verification is added.",
        practiceFocus: ["endurance basics", "rope-team rhythm", "calm transitions"],
        bestFor:
          "Climbers comparing lower-grade long sport options in the demo atlas.",
        personalityTags: ["Confidence builder", "Endurance quest", "Style sampler"],
        decisionHint:
          "Pick this when the route finder should suggest a steadier long-route style.",
        sources: [
          {
            sourceLabel: "Wikipedia: Potrero Chico area context",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "rock type", "area style"],
            notes:
              "Area source only; marked low trust until route-specific metadata is added."
          }
        ],
        images: [],
        editorialTips: [
          "Because this is weakly sourced, avoid adding historical claims.",
          "Use it only as a temporary style card for the recommendation system."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "treasure-of-the-sierra-madre-potrero-chico",
        name: "Treasure of the Sierra Madre",
        grade: "5.10c metadata",
        type: "multi-pitch",
        length: "Multi-pitch route",
        style: "Moderate limestone route with adventure-atlas appeal.",
        summary:
          "A Potrero route card included for name recognition and style variety, with transparent low-trust sourcing.",
        practiceFocus: ["multi-pitch pacing", "confidence", "route selection"],
        bestFor:
          "Climbers who want the route finder to include moderate adventure-flavored choices.",
        personalityTags: ["Adventure mindset", "Confidence builder", "Sport journey"],
        decisionHint:
          "Pick this when you want a moderate route card with more journey energy than grade focus.",
        sources: [
          {
            sourceLabel: "Wikipedia: Potrero Chico area context",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "rock type", "area style"],
            notes:
              "Area context only; route-specific source pack required before production launch."
          }
        ],
        images: [],
        editorialTips: [
          "Name recognition is not enough for detailed content; this stays high-level.",
          "No guidebook-like details should be added without permission and source review."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "will-the-wolf-survive-potrero-chico",
        name: "Will the Wolf Survive?",
        grade: "5.12a metadata",
        type: "sport",
        length: "Single or short route metadata",
        style: "Harder limestone sport climbing in the Potrero ecosystem.",
        summary:
          "A harder Potrero name included as cautious metadata so the atlas can represent single-pitch or shorter sport intensity too.",
        practiceFocus: ["power endurance", "finger strength", "redpoint discipline"],
        bestFor:
          "Experienced sport climbers wanting a harder, shorter-style Potrero recommendation.",
        personalityTags: ["Power problem", "Sport milestone", "Finger puzzle"],
        decisionHint:
          "Pick this when you want the Potrero recommendation to feel more like sport projecting.",
        sources: [
          {
            sourceLabel: "Wikipedia: Potrero Chico area context",
            sourceUrl: "https://en.wikipedia.org/wiki/Potrero_Chico",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "rock type", "area style"],
            notes:
              "Area context source only; route-specific metadata is needed before stronger claims."
          }
        ],
        images: [],
        editorialTips: [
          "For weak-source hard routes, keep claims minimal and clearly labeled.",
          "This is not an attempt plan or route beta."
        ],
        communityStatus: "coming-soon"
      },
      ...popularRouteAdditions["el-potrero-chico-mexico"],
      ...v6PopularRouteAdditions["el-potrero-chico-mexico"]
    ]
  },
  {
    slug: "fontainebleau-france",
    name: "Fontainebleau",
    country: "France",
    latitude: 48.4047,
    longitude: 2.7016,
    climbingTypes: ["boulder"],
    rockType: "Sandstone",
    bestSeasons: ["Spring", "Fall", "Winter"],
    difficultyRange: "Font 3 - 8C+ / 9A proposed",
    beginnerFriendly: true,
    description:
      "A classic forest bouldering area with circuits, technical movement, and beautiful landings.",
    guideContent: popularDestinationGuides["fontainebleau-france"],
    externalResources: popularDestinationResources["fontainebleau-france"],
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Dave%20Graham%20bouldering%20in%20Fontainebleau%20-%201.jpg",
        alt: "A climber bouldering on sandstone in Fontainebleau",
        caption:
          "Destination context photo: Fontainebleau sandstone bouldering.",
        credit: "Stephan Denys via Wikimedia Commons",
        license: "CC BY-SA 2.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Dave_Graham_bouldering_in_Fontainebleau_-_1.jpg",
        imageType: "destination-context"
      }
    ],
    routes: [
      {
        id: "la-marie-rose-fontainebleau",
        name: "La Marie-Rose",
        grade: "Font 6A",
        type: "boulder",
        length: "Boulder problem",
        style:
          "Historic Bas-Cuvier sandstone bouldering with technical movement.",
        summary:
          "A famous Fontainebleau problem included for its historical importance in the development of bouldering grades.",
        practiceFocus: [
          "precise feet",
          "body positioning",
          "classic slab control"
        ],
        bestFor:
          "Boulderers who want to understand Fontainebleau's technical roots beyond modern difficulty numbers.",
        sources: [
          {
            sourceLabel: "Wikipedia: Bas-Cuvier",
            sourceUrl: "https://en.wikipedia.org/wiki/Bas-Cuvier",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Treat the history as part of the experience; old grades can feel different from gym expectations.",
          "Practice quiet feet and body position before adding power."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "labattoir-fontainebleau",
        name: "L'Abattoir",
        grade: "Historic Font 7 problem",
          type: "boulder",
        length: "Boulder problem",
        style:
          "Bas-Cuvier sandstone bouldering known for its role in early grade progression.",
        summary:
          "A historically important Fontainebleau problem included as a verified highlight rather than a movement guide.",
        practiceFocus: [
          "finger strength",
          "hip position",
          "movement reading"
        ],
        bestFor:
          "Climbers interested in how Fontainebleau shaped the language of bouldering difficulty.",
        sources: [
          {
            sourceLabel: "Wikipedia: Bas-Cuvier",
            sourceUrl: "https://en.wikipedia.org/wiki/Bas-Cuvier",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Historic problems can be polished; warm up your movement judgment, not just your fingers.",
          "Future community notes should focus on current conditions without copying beta."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "le-joker-fontainebleau",
        name: "Le Joker",
        grade: "Font 7A",
          type: "boulder",
        length: "Boulder problem",
        style:
          "Classic Fontainebleau sandstone bouldering linked to grade-milestone history.",
        summary:
          "A notable problem included because public milestone records connect it with the evolution of harder bouldering.",
        practiceFocus: [
          "tension through feet",
          "skin care",
          "attempt pacing"
        ],
        bestFor:
          "Boulderers learning how technical sandstone can make modest-looking moves feel exacting.",
        sources: [
          {
            sourceLabel: "Wikipedia: List of grade milestones",
            sourceUrl:
            "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Build patience into the session; Fontainebleau problems often reward subtle adjustments.",
          "Avoid turning future comments into copied sequences; keep them experiential and original."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "le-carnage-fontainebleau",
        name: "Le Carnage",
        grade: "Font 7B+",
          type: "boulder",
        length: "Boulder problem",
        style:
          "Hard historical Fontainebleau bouldering associated with grade progression.",
        summary:
          "A verified historical highlight used to show the forest's role in pushing bouldering difficulty.",
        practiceFocus: [
          "powerful precision",
          "finger recruitment",
          "short-session quality"
        ],
        bestFor:
          "Boulderers studying classic hard movement before modern ultra-high grades.",
        sources: [
          {
            sourceLabel: "Wikipedia: List of grade milestones",
            sourceUrl:
            "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "For hard Bleau problems, good attempts are usually better than many tired attempts.",
          "Track conditions honestly; friction can matter as much as raw strength."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "labbe-resina-fontainebleau",
        name: "L'Abbe Resina",
        grade: "Font 7C",
          type: "boulder",
        length: "Boulder problem",
        style:
          "Fontainebleau bouldering connected to major public grade milestones.",
        summary:
          "A historical difficulty marker included with original ClimbAtlas notes and no copied problem beta.",
        practiceFocus: [
          "contact strength",
          "body compression",
          "friction awareness"
        ],
        bestFor:
          "Climbers comparing classic Fontainebleau hard boulders with modern board-style power.",
        sources: [
          {
            sourceLabel: "Wikipedia: List of grade milestones",
            sourceUrl:
            "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Respect skin and weather; a small change in conditions can change the whole session.",
          "Use this card as a training lens, not as a route description."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "c-etait-demain-fontainebleau",
        name: "C'etait Demain",
        grade: "Font 8A",
          type: "boulder",
        length: "Boulder problem",
        style:
          "A landmark hard Fontainebleau boulder problem in the forest's modern difficulty story.",
        summary:
          "A famous high-grade problem included because public sources identify it as an important Fontainebleau testpiece.",
        practiceFocus: [
          "limit bouldering",
          "finger power",
          "microbeta discipline"
        ],
        bestFor:
          "Advanced boulderers studying the transition from classic hard climbing into modern elite bouldering.",
        sources: [
          {
            sourceLabel: "Wikipedia: Fontainebleau rock climbing",
            sourceUrl: "https://en.wikipedia.org/wiki/Fontainebleau_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "At this level, good problem solving can matter as much as one-arm strength.",
          "Keep any future tips personal and original rather than copied from videos or guides."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "the-big-island-fontainebleau",
        name: "The Big Island",
        grade: "Font 8C",
          type: "boulder",
        length: "Boulder problem",
        style:
          "Modern elite Fontainebleau bouldering known through public ascent records.",
        summary:
          "A hard Fontainebleau benchmark included as a verified highlight for the upper end of the forest's difficulty range.",
        practiceFocus: [
          "limit strength",
          "compression power",
          "session strategy"
        ],
        bestFor:
          "Elite boulderers and readers tracking Fontainebleau's role in modern hard bouldering.",
        sources: [
          {
            sourceLabel: "Wikipedia: Simon Lorenzi",
            sourceUrl: "https://en.wikipedia.org/wiki/Simon_Lorenzi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use elite cards as inspiration, not as a realistic short-term checklist.",
          "For future social features, separate admiration from actionable training notes."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "soudain-seul-fontainebleau",
        name: "Soudain Seul",
        grade: "Font 9A proposed / 8C+",
          type: "boulder",
        length: "Boulder problem",
        style:
          "Very hard Fontainebleau bouldering connected to public discussion of the top end of the grade scale.",
        summary:
          "A modern difficulty landmark included with careful wording because public sources note grade discussion and later consensus uncertainty.",
        practiceFocus: [
          "elite limit strength",
          "long-term projecting",
          "condition selection"
        ],
        bestFor:
          "Readers interested in how top-end boulder grades evolve through repeats and public consensus.",
        sources: [
          {
            sourceLabel: "Wikipedia: Simon Lorenzi",
            sourceUrl: "https://en.wikipedia.org/wiki/Simon_Lorenzi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "This card intentionally uses cautious grade language because top-end consensus can change.",
          "Future community discussion should cite sources when talking about grade changes."
        ],
        communityStatus: "coming-soon"
          },
        ...popularRouteAdditions["fontainebleau-france"],
        ...v2PopularRouteAdditions["fontainebleau-france"],
        ...v3PopularRouteAdditions["fontainebleau-france"]
        ]
  },
  {
    slug: "chamonix-france",
    name: "Chamonix",
    country: "France",
    latitude: 45.9237,
    longitude: 6.8694,
    climbingTypes: ["trad", "multi-pitch", "sport"],
    rockType: "Granite",
    bestSeasons: ["Summer"],
    difficultyRange: "5.5 - 5.13",
    beginnerFriendly: false,
    description:
      "An alpine valley with granite routes, high mountain terrain, and big adventure objectives.",
    guideContent: popularDestinationGuides["chamonix-france"],
    externalResources: popularDestinationResources["chamonix-france"],
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Aiguille-du-Midi-summer.jpg",
        alt: "Aiguille du Midi above Chamonix in summer",
        caption:
          "Destination context photo: Aiguille du Midi in the Mont Blanc massif.",
        credit: "Martin Janner via Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Aiguille-du-Midi-summer.jpg",
        imageType: "destination-context"
      }
    ],
    routes: [
      {
        id: "cosmiques-ridge-aiguille-du-midi",
        name: "Cosmiques Ridge",
        grade: "PD+ to AD",
        type: "multi-pitch",
        length: "Short alpine route",
        style:
          "Mixed rock, snow, and alpine terrain close to the Aiguille du Midi station.",
        summary:
          "A classic Chamonix training-style alpine route included for its public status as a popular all-around mountaineering objective.",
        practiceFocus: [
          "alpine transitions",
          "mixed movement",
          "exposure control"
        ],
        bestFor:
          "Experienced climbers building efficient movement across mixed alpine terrain.",
        sources: [
          {
            sourceLabel: "Wikipedia: Aiguille du Midi mountaineering",
            sourceUrl: "https://en.wikipedia.org/wiki/Aiguille_du_Midi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Cosmiques Hut ascents",
            sourceUrl: "https://en.wikipedia.org/wiki/Cosmiques_Hut",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["area context", "route type"],
            notes: "Secondary source for Cosmiques-area route context and hut-based ascents."
          }
        ],
        images: [
          {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/Aiguille-du-Midi-summer.jpg",
            alt: "Aiguille du Midi above Chamonix in summer",
            caption:
              "Area context photo, not exact route: Aiguille du Midi above Chamonix.",
            credit: "Martin Janner via Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:Aiguille-du-Midi-summer.jpg",
            imageType: "area-context"
          }
        ],
        editorialTips: [
          "This card does not replace current condition reports or guide judgment.",
          "Practice moving cleanly between snow, rock, and belayed sections before larger alpine routes."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "midi-plan-traverse-chamonix",
        name: "Midi-Plan Traverse",
        grade: "Alpine traverse",
          type: "multi-pitch",
        length: "Traverse from Aiguille du Midi to Aiguille du Plan",
        style:
          "High alpine ridge travel above Chamonix with route-finding and glaciated context.",
        summary:
          "A recognized Aiguille du Midi route highlight that shows Chamonix's ridge-traverse character.",
        practiceFocus: [
          "ridge movement",
          "route judgment",
          "glacier awareness"
        ],
        bestFor:
          "Alpinists who already understand rope systems and changing mountain conditions.",
        sources: [
          {
            sourceLabel: "Wikipedia: Aiguille du Midi mountaineering",
            sourceUrl: "https://en.wikipedia.org/wiki/Aiguille_du_Midi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Treat this as an alpine route family, not a single fixed gym-style climb.",
          "Future community notes should focus on firsthand condition impressions, never copied guide text."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "trois-monts-route-mont-blanc",
        name: "La Voie des 3 Monts",
        grade: "PD+",
          type: "multi-pitch",
        length: "Long high-altitude route",
        style:
          "A Chamonix-side Mont Blanc route crossing Mont Blanc du Tacul and Mont Maudit.",
        summary:
          "A major Mont Blanc route highlight included because public sources describe it as a classic ascent line from the Aiguille du Midi side.",
        practiceFocus: [
          "altitude pacing",
          "snow travel",
          "objective hazard awareness"
        ],
        bestFor:
          "Mountaineers with acclimatization, glacier skills, and conservative weather judgment.",
        sources: [
          {
            sourceLabel: "Wikipedia: Mont Blanc climbing routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Mont_Blanc",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Cosmiques Hut ascents",
            sourceUrl: "https://en.wikipedia.org/wiki/Cosmiques_Hut",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["area context", "route type"],
            notes: "Secondary source confirming the Cosmiques Hut context for the Mont Blanc traverse."
          }
        ],
        images: [],
        editorialTips: [
          "The technical grade alone does not capture altitude, conditions, or avalanche exposure.",
          "Plan training around decision-making, not just fitness."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "gouter-route-mont-blanc",
        name: "Gouter Route",
        grade: "Classic normal route",
          type: "multi-pitch",
        length: "Two-day high-altitude ascent for many parties",
        style:
          "The most popular Mont Blanc summit route, with serious rockfall and altitude considerations.",
        summary:
          "Included as a Chamonix-region route highlight because it is publicly identified as the most popular Mont Blanc route.",
        practiceFocus: [
          "acclimatization",
          "rockfall judgment",
          "steady ascent pacing"
        ],
        bestFor:
          "Well-prepared mountaineers who understand that popular does not mean simple.",
        sources: [
          {
            sourceLabel: "Wikipedia: Mont Blanc climbing routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Mont_Blanc",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use official hut, access, and safety information before making any real plan.",
          "Beginner-friendly labels do not apply well to high mountain routes."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "grands-mulets-route-mont-blanc",
        name: "Grands Mulets Route",
        grade: "Historic Mont Blanc route",
          type: "multi-pitch",
        length: "Long high-altitude route",
        style:
          "Historic French-side Mont Blanc itinerary often associated with ski or descent use.",
        summary:
          "A public Mont Blanc route highlight included to show that Chamonix has multiple classic high mountain approaches.",
        practiceFocus: [
          "glacier travel",
          "timing decisions",
          "snow condition reading"
        ],
        bestFor:
          "Experienced mountaineers comparing Mont Blanc route options with current local information.",
        sources: [
          {
            sourceLabel: "Wikipedia: Mont Blanc climbing routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Mont_Blanc",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Snow and glacier conditions change the nature of this route dramatically.",
          "The card is intentionally broad so it cannot be mistaken for a route plan."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "aiguilles-grises-route-mont-blanc",
        name: "Aiguilles Grises Route",
        grade: "Italian normal route",
          type: "multi-pitch",
        length: "Long high-altitude route",
        style:
          "An Italian-side Mont Blanc itinerary linked to the Gonella refuge and Bosses ridge finish.",
        summary:
          "Included because public sources list it among Mont Blanc's classic climbing routes, useful for understanding the massif rather than only Chamonix town.",
        practiceFocus: [
          "multi-day planning",
          "glacier navigation",
          "international route logistics"
        ],
        bestFor:
          "Mountaineers comparing Mont Blanc route styles across the French and Italian sides.",
        sources: [
          {
            sourceLabel: "Wikipedia: Mont Blanc climbing routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Mont_Blanc",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Cross-border logistics and hut information deserve their own current checks.",
          "Future reviews should be dated clearly because conditions are central to usefulness."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "miage-bionnassay-mont-blanc-crossing",
        name: "Miage-Bionnassay-Mont Blanc Crossing",
        grade: "Three-day alpine crossing",
          type: "multi-pitch",
        length: "Usually described as a multi-day expedition",
        style:
          "Aesthetic snow and ice ridge travel linking major Mont Blanc massif terrain.",
        summary:
          "A route highlight that shows Chamonix-region climbing as long-form alpine travel rather than only rock pitches.",
        practiceFocus: [
          "ridge endurance",
          "overnight planning",
          "altitude judgment"
        ],
        bestFor:
          "Experienced alpinists seeking a bigger journey-style objective in the Mont Blanc massif.",
        sources: [
          {
            sourceLabel: "Wikipedia: Mont Blanc climbing routes",
            sourceUrl: "https://en.wikipedia.org/wiki/Mont_Blanc",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Think in terms of a full mountain itinerary, not a quick route tick.",
          "Weather windows and descent planning are central parts of the objective."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "north-west-face-mont-blanc-du-tacul",
        name: "North-west Face of Mont Blanc du Tacul",
        grade: "PD",
          type: "multi-pitch",
        length: "Normal/easiest route on Mont Blanc du Tacul",
        style:
          "Glaciated alpine climbing on a 4,000-metre peak above the Vallee Blanche.",
        summary:
          "A Chamonix-area route highlight included because public sources identify it as the easiest route on Mont Blanc du Tacul.",
        practiceFocus: [
          "crevasse awareness",
          "snow slope movement",
          "altitude pacing"
        ],
        bestFor:
          "Mountaineers progressing toward higher alpine routes with glacier skills already in place.",
        sources: [
          {
            sourceLabel: "Wikipedia: Mont Blanc du Tacul",
            sourceUrl: "https://en.wikipedia.org/wiki/Mont_Blanc_du_Tacul",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Easy-route labels in the alpine world still assume real mountain competence.",
          "Always separate inspiration content from current hazard information."
        ],
        communityStatus: "coming-soon"
          },
        ...popularRouteAdditions["chamonix-france"],
        ...v4PopularRouteAdditions["chamonix-france"]
        ]
  },
  {
    slug: "ceuse-france",
    name: "Ceuse",
    country: "France",
    latitude: 44.5147,
    longitude: 5.9369,
    climbingTypes: ["sport"],
    rockType: "Limestone",
    bestSeasons: ["Summer", "Fall"],
    difficultyRange: "5.10 - 5.15",
    beginnerFriendly: false,
    description:
      "A high limestone cliff known for sustained sport climbing and sweeping views.",
    guideContent: popularDestinationGuides["ceuse-france"],
    externalResources: popularDestinationResources["ceuse-france"],
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/C%C3%A9%C3%BCse%20secteurs%20Berlin%20et%20Biographie.jpg",
        alt: "Ceuse sectors Berlin and Biographie",
        caption:
          "Destination context photo: Ceuse sectors Berlin and Biographie.",
        credit: "Thomas Charbonneau via Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:C%C3%A9%C3%BCse_secteurs_Berlin_et_Biographie.jpg",
        imageType: "destination-context"
      }
    ],
    routes: [
      {
        id: "realization-biographie-ceuse",
        name: "Realization / Biographie",
        grade: "9a+ / 5.15a",
        type: "sport",
        length: "1 pitch, about 35 m",
        style:
          "Historic overhanging limestone sport climbing on the Biographie sector.",
        summary:
          "A landmark sport route widely recognized as the first consensus 9a+ in climbing history.",
        practiceFocus: [
          "power endurance",
          "boulder-to-route linking",
          "project discipline"
        ],
        bestFor:
          "Elite sport climbers and readers studying the history of modern difficulty.",
        sources: [
          {
            sourceLabel: "Wikipedia: Realization",
            sourceUrl: "https://en.wikipedia.org/wiki/Realization_(climb)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Chris Sharma notable ascents",
            sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["first ascent", "history"],
            notes: "Athlete biography source used to cross-check the route milestone."
          }
        ],
        images: [
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/7/7c/C%C3%A9%C3%BCse_secteurs_Berlin_et_Biographie.jpg",
            alt: "Ceuse sectors Berlin and Biographie",
            caption:
              "Area context photo: sectors Berlin and Biographie at Ceuse.",
            credit: "Thomas Charbonneau via Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:C%C3%A9%C3%BCse_secteurs_Berlin_et_Biographie.jpg",
            imageType: "area-context"
          }
        ],
        editorialTips: [
          "Use this route as a history anchor, not as a source of sequences or beta.",
          "Train hard sections and full-route endurance as separate but connected skills."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "bibliographie-ceuse",
        name: "Bibliographie",
        grade: "9b+ / 5.15c",
          type: "sport",
        length: "Single pitch",
        style:
          "Very hard Ceuse limestone sport climbing near the famous Biographie sector.",
        summary:
          "A modern elite route included because public sources document its first ascent and grade history.",
        practiceFocus: [
          "elite projecting",
          "finger power",
          "long-term process"
        ],
        bestFor:
          "Readers tracking the upper edge of sport climbing difficulty and repeat consensus.",
        sources: [
          {
            sourceLabel: "Wikipedia: Bibliographie",
            sourceUrl: "https://en.wikipedia.org/wiki/Bibliographie_(climb)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "French Wikipedia: Bibliographie",
            sourceUrl: "https://fr.wikipedia.org/wiki/Bibliographie_(escalade)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "history"],
            notes: "Second open encyclopedia source; useful for grade and location cross-checking."
          }
        ],
        images: [
          {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/C%C3%A9%C3%BCse%20secteurs%20Berlin%20et%20Biographie.jpg",
            alt: "Ceuse sectors Berlin and Biographie",
            caption:
              "Area context photo, not exact route: sectors Berlin and Biographie at Ceuse.",
            credit: "Thomas Charbonneau via Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:C%C3%A9%C3%BCse_secteurs_Berlin_et_Biographie.jpg",
            imageType: "area-context"
          }
        ],
        editorialTips: [
          "Top-end grades can change with repeats; source dates matter.",
          "The useful lesson for most climbers is patience over many sessions, not copying elite beta."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "three-degrees-of-separation-ceuse",
        name: "Three Degrees of Separation",
        grade: "9a / 5.14d",
          type: "sport",
        length: "Single pitch",
        style:
          "Hard Ceuse sport climbing first climbed by Chris Sharma and repeated in public elite ascent records.",
        summary:
          "A verified high-end route highlight that helps show Ceuse beyond its single most famous line.",
        practiceFocus: [
          "dynamic accuracy",
          "power endurance",
          "mental reset"
        ],
        bestFor:
          "Advanced sport climbers comparing hard Ceuse routes by style and history.",
        sources: [
          {
            sourceLabel: "Wikipedia: Adam Ondra redpoint list",
            sourceUrl: "https://en.wikipedia.org/wiki/Adam_Ondra",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Chris Sharma notable ascents",
            sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["first ascent", "history"],
            notes: "Secondary athlete biography source for first-ascent context."
          }
        ],
        images: [],
        editorialTips: [
          "A public ascent list can verify name and difficulty context, but it is not a route guide.",
          "For training, combine explosive effort with route-length recovery."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "jungle-boogie-ceuse",
        name: "Jungle Boogie",
        grade: "9a+ / 5.15a",
          type: "sport",
        length: "Single pitch",
        style:
          "Hard limestone sport climbing established by Adam Ondra at Ceuse.",
        summary:
          "An elite Ceuse first ascent included from public climber records, with original non-beta notes.",
        practiceFocus: [
          "route power",
          "hard move recovery",
          "project tactics"
        ],
        bestFor:
          "Strong sport climbers studying first-ascent style and high-grade development at Ceuse.",
        sources: [
          {
            sourceLabel: "Wikipedia: Adam Ondra redpoint list",
            sourceUrl: "https://en.wikipedia.org/wiki/Adam_Ondra",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Keep hard-route cards as orientation, not instruction.",
          "Community notes later should be firsthand impressions, not copied from videos."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "letrange-ivresse-des-lenteurs-ceuse",
        name: "L'etrange ivresse des lenteurs",
        grade: "9a / 5.14d",
          type: "sport",
        length: "Single pitch",
        style:
          "High-difficulty Ceuse sport climbing listed in public 9th-grade records.",
        summary:
          "A verified Ceuse route highlight included to broaden the area's top-end sport profile.",
        practiceFocus: [
          "sustained intensity",
          "precision pacing",
          "rest discipline"
        ],
        bestFor:
          "Advanced sport climbers learning how Ceuse difficulty often blends power with patience.",
        sources: [
          {
            sourceLabel: "Wikipedia: Neuvieme degre",
            sourceUrl: "https://fr.wikipedia.org/wiki/Neuvi%C3%A8me_degr%C3%A9",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "The name is preserved as a verified route title; ClimbAtlas does not translate it into beta.",
          "Practice pacing hard movement so effort does not spike too early."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "dures-limites-ceuse",
        name: "Dures Limites",
        grade: "8c / 5.14b",
          type: "sport",
        length: "Single pitch",
        style:
          "Difficult limestone sport climbing listed in public performance records for Ceuse.",
        summary:
          "A hard Ceuse route included from athlete performance records to add range below the 9a-plus landmarks.",
        practiceFocus: [
          "forearm endurance",
          "clip efficiency",
          "redpoint consistency"
        ],
        bestFor:
          "Strong sport climbers building toward the area's hardest routes.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alizee Dufraisse notable performances",
            sourceUrl: "https://fr.wikipedia.org/wiki/Aliz%C3%A9e_Dufraisse",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use mid-to-hard grade cards to show progression, not just elite headlines.",
          "Work consistent attempts before chasing one perfect burn."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "larcademicien-ceuse",
        name: "L'arcademicien",
        grade: "8c / 5.14b",
          type: "sport",
        length: "Single pitch",
        style:
          "Ceuse limestone sport climbing documented in public performance records.",
        summary:
          "A verified route name and grade included to make the Ceuse route set less top-heavy.",
        practiceFocus: [
          "movement economy",
          "skin management",
          "controlled redpointing"
        ],
        bestFor:
          "Sport climbers comparing multiple hard but not world-record-level Ceuse routes.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alizee Dufraisse notable performances",
            sourceUrl: "https://fr.wikipedia.org/wiki/Aliz%C3%A9e_Dufraisse",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "A balanced route database should include training-relevant climbs, not only legends.",
          "Keep future comments date-stamped so conditions and polish can be interpreted."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "mirage-ceuse",
        name: "Mirage",
        grade: "7c+ / 5.13a",
          type: "sport",
        length: "Single pitch",
        style:
          "Ceuse limestone sport climbing at a more accessible but still advanced grade.",
        summary:
          "A lower-grade Ceuse highlight included from public performance records to show the cliff is not only about 9a and harder routes.",
        practiceFocus: [
          "onsight reading",
          "technical footwork",
          "confidence building"
        ],
        bestFor:
          "Advanced sport climbers looking at Ceuse through a progression lens rather than only elite history.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alizee Dufraisse notable performances",
            sourceUrl: "https://fr.wikipedia.org/wiki/Aliz%C3%A9e_Dufraisse",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Including a 7c+ route keeps the destination page useful for more than elite grade watching.",
          "Train route reading without relying on copied sequence information."
        ],
        communityStatus: "coming-soon"
          },
        ...popularRouteAdditions["ceuse-france"],
        ...v4PopularRouteAdditions["ceuse-france"]
        ]
  },
  {
    slug: "kalymnos-greece",
    name: "Kalymnos",
    country: "Greece",
    latitude: 36.9633,
    longitude: 26.9406,
    climbingTypes: ["sport"],
    rockType: "Limestone",
    bestSeasons: ["Spring", "Fall"],
    difficultyRange: "5.6 - 5.14",
    beginnerFriendly: true,
    description:
      "An island sport climbing destination with sea views, tufas, and many approachable crags.",
    guideContent: popularDestinationGuides["kalymnos-greece"],
    externalResources: popularDestinationResources["kalymnos-greece"],
    routes: [
      {
        id: "spartacus-kalymnos",
        name: "Spartacus",
        grade: "7b metadata",
        type: "sport",
        length: "Single pitch",
        style: "Steep limestone sport climbing associated with Kalymnos tufa style.",
        summary:
          "A widely recognized Kalymnos route name included as a style card for the island's steep sport climbing identity.",
        practiceFocus: ["tufa movement", "forearm endurance", "rest-position awareness"],
        bestFor:
          "Sport climbers comparing Kalymnos classics with sustained steep limestone character.",
        personalityTags: ["Endurance quest", "Tufa climbing", "Classic experience"],
        decisionHint:
          "Pick this when you want the recommendation to feel like classic steep Kalymnos sport climbing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area source only; route-specific grade and metadata need a stronger source pack."
          }
        ],
        images: [],
        editorialTips: [
          "Kalymnos tufa routes reward relaxed movement and smart pacing.",
          "This is a metadata seed card, not a route guide."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "priapios-kalymnos",
        name: "Priapos",
        grade: "7c metadata",
        type: "sport",
        length: "Single pitch",
        style: "Steep limestone route style with advanced endurance demands.",
        summary:
          "A known Kalymnos sport-climbing name used here to represent the island's harder endurance routes while keeping source limits visible.",
        practiceFocus: ["power endurance", "tufa reading", "efficient clipping"],
        bestFor:
          "Advanced sport climbers looking for a harder Kalymnos-style recommendation.",
        personalityTags: ["Power endurance", "Tufa climbing", "Sport journey"],
        decisionHint:
          "Pick this when you want the quiz to lean toward a more demanding Kalymnos route style.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area context only; route metadata should be cross-checked before production launch."
          }
        ],
        images: [],
        editorialTips: [
          "Harder Kalymnos routes often ask for endurance and calm rests more than a single crux mindset.",
          "Do not add sequence or hold information from guidebooks or databases."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "dna-kalymnos",
        name: "DNA",
        grade: "7a metadata",
        type: "sport",
        length: "Single pitch",
        style: "Accessible steep limestone route style from the Grande Grotta orbit.",
        summary:
          "A Kalymnos route card included to give the Route Finder a more approachable tufa-flavored option.",
        practiceFocus: ["tufa basics", "body positioning", "steady breathing"],
        bestFor:
          "Intermediate sport climbers who want a Kalymnos-style recommendation without an elite grade.",
        personalityTags: ["Technique lab", "Tufa climbing", "Confidence builder"],
        decisionHint:
          "Pick this when you want an approachable route card with Kalymnos character.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area source only; route-specific metadata needs stronger verification."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a style choice card, not a source of route beta.",
          "Build comfort on steep holds and rests before chasing harder tufa routes."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "aegialis-kalymnos",
        name: "Aegialis",
        grade: "7c metadata",
        type: "sport",
        length: "Single pitch",
        style: "Sustained limestone sport climbing with advanced endurance character.",
        summary:
          "A Kalymnos highlight card for climbers who want the atlas to surface higher-end endurance sport climbing.",
        practiceFocus: ["route endurance", "pump management", "mental reset"],
        bestFor:
          "Advanced sport climbers comparing Kalymnos endurance objectives.",
        personalityTags: ["Endurance quest", "Sport journey", "Power endurance"],
        decisionHint:
          "Pick this when you feel strong and want a sustained sport-climbing recommendation.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area context source only; keep this short until route-specific sources are added."
          }
        ],
        images: [],
        editorialTips: [
          "Sustained sport routes reward patient pacing more than rushing early sections.",
          "Route-specific facts should be strengthened before richer editorial notes."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "trella-kalymnos",
        name: "Trella",
        grade: "7a metadata",
        type: "sport",
        length: "Single pitch",
        style: "Popular-feeling limestone sport style with approachable difficulty.",
        summary:
          "A lighter Kalymnos route card used to balance the destination page away from only hard endurance lines.",
        practiceFocus: ["movement economy", "confidence", "limestone reading"],
        bestFor:
          "Climbers looking for a friendlier Kalymnos sport style in the recommendation system.",
        personalityTags: ["Confidence builder", "Technique lab", "Style sampler"],
        decisionHint:
          "Pick this when you want Kalymnos flavor without choosing the steepest challenge.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area context only; route-specific grade should be checked against acceptable metadata sources."
          }
        ],
        images: [],
        editorialTips: [
          "Approachable routes are useful for learning the local movement style.",
          "This card avoids popularity ratings and user comments until real community data exists."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "fun-de-chichunne-kalymnos",
        name: "Fun de Chichunne",
        grade: "7a metadata",
        type: "sport",
        length: "Single pitch",
        style: "Kalymnos limestone sport climbing with playful movement character.",
        summary:
          "A route-name seed card included for variety in the Kalymnos recommendation set while source quality is improved later.",
        practiceFocus: ["flow", "route reading", "body position"],
        bestFor:
          "Climbers who want a less severe Kalymnos option in the atlas quiz.",
        personalityTags: ["Style sampler", "Technique lab", "Confidence builder"],
        decisionHint:
          "Pick this when you want the recommendation to emphasize fun movement over grade chasing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area source only; route metadata needs a stronger route-specific source."
          }
        ],
        images: [],
        editorialTips: [
          "Keep weaker-source cards light and clearly labeled.",
          "Future user notes should be real submissions, not invented social proof."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "joggel-and-toggel-kalymnos",
        name: "Joggel & Toggel",
        grade: "6c+ metadata",
        type: "sport",
        length: "Single pitch",
        style: "Moderate Kalymnos sport climbing for movement practice.",
        summary:
          "A moderate-grade seed card to help beginners and intermediate climbers get route-finder results beyond hard classics.",
        practiceFocus: ["confidence", "efficient footwork", "lead rhythm"],
        bestFor:
          "Climbers asking the Route Finder for a lighter sport-climbing day on Kalymnos.",
        personalityTags: ["Confidence builder", "Technique lab", "Style sampler"],
        decisionHint:
          "Pick this when the goal is a steady Kalymnos-style session rather than a limit try.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area source only; route-specific metadata should be verified later."
          }
        ],
        images: [],
        editorialTips: [
          "A moderate route can be the best choice when the goal is movement quality.",
          "This card is not a guidebook replacement."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "monahiki-elia-kalymnos",
        name: "Monahiki Elia",
        grade: "7a metadata",
        type: "sport",
        length: "Single pitch",
        style: "Kalymnos sport route style with sea-cliff atmosphere.",
        summary:
          "A route metadata seed included to broaden the Kalymnos page while preserving source transparency.",
        practiceFocus: ["limestone movement", "route flow", "rest management"],
        bestFor:
          "Climbers who want a Kalymnos recommendation focused on style and setting.",
        personalityTags: ["Sport journey", "Style sampler", "Technique lab"],
        decisionHint:
          "Pick this when you want a Kalymnos card that feels more scenic than purely difficult.",
        sources: [
          {
            sourceLabel: "Wikipedia: Kalymnos climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Kalymnos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing style"],
            notes:
              "Area context only; needs stronger route-specific source before launch."
          }
        ],
        images: [],
        editorialTips: [
          "Use scenic route cards for choosing mood and style, not for logistics.",
          "Source quality should be strengthened before adding photos or richer history."
        ],
        communityStatus: "coming-soon"
      }
      , ...popularRouteAdditions["kalymnos-greece"],
      ...v2PopularRouteAdditions["kalymnos-greece"],
      ...v3PopularRouteAdditions["kalymnos-greece"]
    ]
  },
  {
    slug: "dolomites-italy",
    name: "Dolomites",
    country: "Italy",
    latitude: 46.4102,
    longitude: 11.844,
    climbingTypes: ["trad", "multi-pitch", "sport"],
    rockType: "Dolomite limestone",
    bestSeasons: ["Summer", "Fall"],
    difficultyRange: "5.4 - 5.13",
    beginnerFriendly: false,
    description:
      "A mountain region with towering pale walls, long routes, and a strong alpine character.",
    guideContent: popularDestinationGuides["dolomites-italy"],
    externalResources: popularDestinationResources["dolomites-italy"],
    images: [
      {
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/2019%20Tre%20Cime.jpg",
        alt: "Tre Cime di Lavaredo in the Dolomites",
        caption:
          "Destination context photo: Tre Cime di Lavaredo in the Dolomites.",
        credit: "Tiia Monto via Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:2019_Tre_Cime.jpg",
        imageType: "destination-context"
      }
    ],
    routes: [
      {
        id: "comici-dimai-cima-grande",
        name: "Comici-Dimai Route",
        grade: "VII, V+ A0",
        type: "multi-pitch",
        length: "North face of Cima Grande",
        style:
          "Historic steep Dolomite wall climbing on the north face of Cima Grande.",
        summary:
          "A major Tre Cime route included for its place in 1930s Dolomite climbing history.",
        practiceFocus: [
          "steep limestone movement",
          "historic route judgment",
          "long-wall pacing"
        ],
        bestFor:
          "Experienced alpine rock climbers studying classic Dolomite north-face history.",
        sources: [
          {
            sourceLabel: "Wikipedia: Tre Cime di Lavaredo climbing",
            sourceUrl: "https://fr.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Emilio Comici",
            sourceUrl: "https://en.wikipedia.org/wiki/Emilio_Comici",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["history", "first ascent context"],
            notes: "Biographical source for Comici and Dolomite climbing history."
          }
        ],
        images: [],
        editorialTips: [
          "Historic alpine routes need current condition and protection information from local sources.",
          "Treat the grade as only one part of the overall seriousness."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "brandler-hasse-cima-grande",
        name: "Brandler-Hasse",
        grade: "VII",
          type: "multi-pitch",
        length: "Direct line on the north face of Cima Grande",
        style:
          "A historic direttissima-style Dolomite wall route on Cima Grande.",
        summary:
          "A recognized Tre Cime line included to show the Dolomites' mid-century direct-route era.",
        practiceFocus: [
          "big wall endurance",
          "route history awareness",
          "technical limestone"
        ],
        bestFor:
          "Advanced climbers interested in the evolution from classic lines to directissima tactics.",
        sources: [
          {
            sourceLabel: "Wikipedia: Tre Cime di Lavaredo climbing",
            sourceUrl: "https://fr.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Older route histories often include aid/free-climbing changes; check modern context separately.",
          "Community comments later should state whether they refer to historical or current style."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "cassin-ratti-cima-ovest",
        name: "Cassin-Ratti Route",
        grade: "VIII, VI A1",
          type: "multi-pitch",
        length: "North face of Cima Ovest",
        style:
          "Serious Dolomite wall climbing associated with Riccardo Cassin and Vittorio Ratti.",
        summary:
          "A classic Cima Ovest route included from public Tre Cime history and Cassin biographical records.",
        practiceFocus: [
          "commitment",
          "compact limestone technique",
          "alpine route planning"
        ],
        bestFor:
          "Experienced climbers studying the bold Dolomite routes of the 1930s.",
        sources: [
          {
            sourceLabel: "Wikipedia: Riccardo Cassin",
            sourceUrl: "https://en.wikipedia.org/wiki/Riccardo_Cassin",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Italian Wikipedia: Tre Cime di Lavaredo",
            sourceUrl: "https://it.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["history", "route context"],
            notes: "Second open encyclopedia source for Tre Cime route history."
          }
        ],
        images: [],
        editorialTips: [
          "Historic route names are verified here; practical climbing details still require current local research.",
          "Use this as a history card, not a topo substitute."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "spigolo-giallo-cima-piccola",
        name: "Spigolo Giallo",
        grade: "V/VI- with VI+ step",
          type: "multi-pitch",
        length: "About 380 m",
        style:
          "Aesthetic arete climbing on Cima Piccola, one of the famous Dolomite lines.",
        summary:
          "A classic Dolomite arete included because public sources describe its first ascent and status among repeated routes.",
        practiceFocus: [
          "arete balance",
          "exposure management",
          "efficient ropework"
        ],
        bestFor:
          "Alpine rock climbers looking at visually iconic Dolomite terrain.",
        sources: [
          {
            sourceLabel: "Wikipedia: Tre Cime di Lavaredo classic routes",
            sourceUrl: "https://it.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "A beautiful line can still be a serious mountain route.",
          "Practice moving smoothly on exposed aretes before choosing bigger alpine objectives."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "pan-aroma-cima-ovest",
        name: "Pan Aroma",
        grade: "8c / 5.14b",
          type: "multi-pitch",
        length: "Long sport-style wall route",
        style:
          "Modern hard multi-pitch sport climbing on Cima Ovest di Lavaredo.",
        summary:
          "A modern Dolomite testpiece included because public sources document its opening, free ascent, and hard pitches.",
        practiceFocus: [
          "hard multi-pitch sport",
          "roof endurance",
          "project logistics"
        ],
        bestFor:
          "Elite climbers and readers comparing modern hard wall routes with older Dolomite classics.",
        sources: [
          {
            sourceLabel: "Wikipedia: Pan Aroma",
            sourceUrl: "https://it.wikipedia.org/wiki/Pan_Aroma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          },
          {
            sourceLabel: "Wikipedia: Tre Cime di Lavaredo climbing",
            sourceUrl: "https://fr.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade context", "area context"],
            notes: "Secondary source for Cima Ovest route context and related hard-wall lines."
          }
        ],
        images: [
          {
            src: "https://commons.wikimedia.org/wiki/Special:FilePath/2019%20Tre%20Cime.jpg",
            alt: "Tre Cime di Lavaredo in the Dolomites",
            caption:
              "Area context photo, not exact route: Tre Cime di Lavaredo in the Dolomites.",
            credit: "Tiia Monto via Wikimedia Commons",
            license: "CC BY-SA 3.0",
            sourceUrl:
              "https://commons.wikimedia.org/wiki/File:2019_Tre_Cime.jpg",
            imageType: "area-context"
          }
        ],
        editorialTips: [
          "Modern bolted wall routes still require full mountain awareness.",
          "Separate pitch difficulty from route logistics when thinking about training."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "bellavista-cima-ovest",
        name: "Bellavista",
        grade: "XI, IX A3",
          type: "multi-pitch",
        length: "North face of Cima Ovest",
        style:
          "Extremely difficult modern Dolomite wall climbing on the Tre Cime.",
        summary:
          "A high-end Cima Ovest route included as part of the modern hard wall story connected to Pan Aroma.",
        practiceFocus: [
          "elite wall climbing",
          "technical power",
          "multi-day preparation"
        ],
        bestFor:
          "Readers studying the upper end of Dolomite free climbing difficulty.",
        sources: [
          {
            sourceLabel: "Wikipedia: Tre Cime di Lavaredo climbing",
            sourceUrl: "https://fr.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Use cautious language around very hard multi-pitch grades because style and free/aid history can be nuanced.",
          "Future source upgrades should include stronger route-specific references."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "normal-route-cima-grande",
        name: "Normal Route of Cima Grande",
        grade: "II/III",
          type: "multi-pitch",
        length: "About 600 m",
        style:
          "Historic easier line on the south side of Cima Grande, also linked to the peak's first ascent.",
        summary:
          "A lower-grade Tre Cime route included to show that Dolomite history includes easier but still complex mountain routes.",
        practiceFocus: [
          "route-finding",
          "scrambling confidence",
          "descent awareness"
        ],
        bestFor:
          "Climbers learning that lower technical grades can still demand mountain judgment.",
        sources: [
          {
            sourceLabel: "Wikipedia: Tre Cime di Lavaredo classic routes",
            sourceUrl: "https://it.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Easy alpine grades can hide route-finding and exposure.",
          "This card is broad context only; use current local guide information for real planning."
        ],
        communityStatus: "coming-soon"
      },
          {
        id: "spigolo-dibona-cima-grande",
        name: "Spigolo Dibona",
        grade: "IV",
          type: "multi-pitch",
        length: "About 650 m",
        style:
          "Classic north-east ridge climbing on Cima Grande with early Dolomite history.",
        summary:
          "A repeated classic line included because public sources identify its first ascent and route length/difficulty context.",
        practiceFocus: [
          "long ridge movement",
          "classic alpine rock",
          "rope efficiency"
        ],
        bestFor:
          "Experienced climbers interested in moderate but long Dolomite alpine rock routes.",
        sources: [
          {
            sourceLabel: "Wikipedia: Tre Cime di Lavaredo classic routes",
            sourceUrl: "https://it.wikipedia.org/wiki/Tre_Cime_di_Lavaredo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history"],
            notes: "Open encyclopedia source; useful for public fact checks, but not a route guide."
          }
        ],
        images: [],
        editorialTips: [
          "Length and route complexity deserve as much attention as the numeric grade.",
          "Future community notes can make the page more useful without turning it into copied guidebook content."
        ],
        communityStatus: "coming-soon"
          }
        ,
      ...popularRouteAdditions["dolomites-italy"],
      ...v4PopularRouteAdditions["dolomites-italy"]
    ]
  },
  {
    slug: "frankenjura-germany",
    name: "Frankenjura",
    country: "Germany",
    latitude: 49.75,
    longitude: 11.35,
    climbingTypes: ["sport"],
    rockType: "Limestone",
    bestSeasons: ["Spring", "Summer", "Fall"],
    difficultyRange: "5.7 - 5.15",
    beginnerFriendly: true,
    description:
      "A compact limestone region with many pocketed sport climbs tucked into quiet forests.",
    guideContent: popularDestinationGuides["frankenjura-germany"],
    externalResources: popularDestinationResources["frankenjura-germany"],
    routes: [
      {
        id: "action-directe-frankenjura",
        name: "Action Directe",
        grade: "9a / 5.14d",
        type: "sport",
        length: "15 m",
        style: "Steep limestone power and historic finger-pocket difficulty.",
        summary:
          "A short but globally important Frankenjura testpiece that helped define modern hard sport climbing. ClimbAtlas treats it as a history and training landmark, not a beta source.",
        practiceFocus: [
          "Finger power",
          "Dynamic coordination",
          "Short-route intensity",
          "Limit redpoint tactics"
        ],
        bestFor:
          "Advanced climbers studying the history of 9a sport climbing and the training culture around it.",
        sources: [
          {
            sourceLabel: "Wikipedia: Action Directe",
            sourceUrl: "https://en.wikipedia.org/wiki/Action_Directe_(climb)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "type", "history"],
            notes:
              "Open encyclopedia source for public route facts; ClimbAtlas does not reuse its route beta or movement description."
          },
          {
            sourceLabel: "Wikipedia: grade milestones",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade", "history", "firstAscent"],
            notes:
              "Useful cross-check for Action Directe as a consensus 9a milestone."
          }
        ],
        images: [],
        editorialTips: [
          "Train maximum contact strength and powerful movement only with careful load management.",
          "Use the route as a study case for power and precision rather than as a route instruction page."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "wallstreet-frankenjura",
        name: "Wallstreet",
        grade: "8c / 5.14b",
        type: "sport",
        length: "Single pitch",
        style: "Historic limestone endurance and finger strength.",
        summary:
          "A Wolfgang Güllich first ascent that is widely referenced as an early 8c benchmark. This card keeps the note high-level and avoids guide-style detail.",
        practiceFocus: [
          "Power endurance",
          "Pocket accuracy",
          "Historical grade context",
          "Efficient redpoint pacing"
        ],
        bestFor:
          "Climbers interested in how Frankenjura shaped the progression of hard sport grades.",
        sources: [
          {
            sourceLabel: "Wikipedia: Wolfgang Güllich",
            sourceUrl: "https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history", "firstAscent"],
            notes:
              "Open encyclopedia source for Güllich's notable first ascents; not a route guide."
          },
          {
            sourceLabel: "Wikipedia: grade milestones",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade", "history"],
            notes:
              "Cross-checks Wallstreet as an important early 8c milestone."
          }
        ],
        images: [],
        editorialTips: [
          "Practice sustained effort on small holds before focusing on isolated maximum moves.",
          "Read grade history as context; modern grade feel can vary by climber and style."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "kanal-im-ruecken-frankenjura",
        name: "Kanal im Rücken",
        grade: "8b / 5.13d",
        type: "sport",
        length: "Single pitch",
        style: "Classic hard sport climbing with pocket-focused movement.",
        summary:
          "An early Güllich breakthrough often cited in the progression of redpoint difficulty. The ClimbAtlas note focuses on training themes, not route instructions.",
        practiceFocus: [
          "Pocket control",
          "Foot precision",
          "Redpoint consistency",
          "Strength-to-skill transfer"
        ],
        bestFor:
          "Climbers learning how foundational 1980s Frankenjura routes influenced modern sport climbing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Wolfgang Güllich",
            sourceUrl: "https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history", "firstAscent"],
            notes:
              "Single public source for basic metadata; needs a stronger route-specific source later."
          }
        ],
        images: [],
        editorialTips: [
          "Build repeatable movement quality before chasing harder grades.",
          "This route needs a second independent source before ClimbAtlas should treat the metadata as fully robust."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "ghettoblaster-frankenjura",
        name: "Ghettoblaster",
        grade: "8b+ / 5.14a",
        type: "sport",
        length: "Single pitch",
        style: "Powerful limestone climbing from Frankenjura's late-1980s push.",
        summary:
          "A notable Güllich-era route connected with Germany's hard sport climbing development. This entry stays deliberately broad until more route-specific sources are added.",
        practiceFocus: [
          "Power endurance",
          "Finger resilience",
          "Route reading",
          "Tension on steep stone"
        ],
        bestFor:
          "Experienced sport climbers comparing historic Frankenjura difficulty styles.",
        sources: [
          {
            sourceLabel: "Wikipedia: Wolfgang Güllich",
            sourceUrl: "https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history", "firstAscent"],
            notes:
              "Single public source for basic facts; marked transparently until a second source is added."
          }
        ],
        images: [],
        editorialTips: [
          "Prepare with short power-endurance circuits rather than only isolated strength work.",
          "Future community notes can add lived experience without copying route database comments."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "level-42-frankenjura",
        name: "Level 42",
        grade: "8b+ / 5.14a",
        type: "sport",
        length: "Single pitch",
        style: "Historic limestone difficulty with grade-context nuance.",
        summary:
          "A Frankenjura first ascent from the same breakthrough period as several Güllich classics. Its grade history is best treated as context rather than a simple number.",
        practiceFocus: [
          "Grade-context awareness",
          "Power endurance",
          "Small-hold movement",
          "Composure under effort"
        ],
        bestFor:
          "Climbers who like historically important routes with grading discussion around them.",
        sources: [
          {
            sourceLabel: "Wikipedia: Wolfgang Güllich",
            sourceUrl: "https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history", "firstAscent"],
            notes:
              "Lists the modern consensus as 8b+ after earlier 8c discussion; needs a route-specific source later."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a reminder that grades can settle over time as repeats accumulate.",
          "Train both physical output and calm execution, since older limestone lines can feel demanding for the grade."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "amadeus-schwarzenegger-frankenjura",
        name: "Amadeus Schwarzenegger",
        grade: "8b / 5.13d",
        type: "sport",
        length: "Single pitch",
        style: "Hard sport climbing from Frankenjura's 1980s development.",
        summary:
          "A Güllich first ascent that helps round out the region's progression story below the most famous ultra-hard routes.",
        practiceFocus: [
          "Consistent redpointing",
          "Technical power",
          "Finger endurance",
          "Movement memory"
        ],
        bestFor:
          "Climbers exploring the base layer of Frankenjura's hard-route history.",
        sources: [
          {
            sourceLabel: "Wikipedia: Wolfgang Güllich",
            sourceUrl: "https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history", "firstAscent"],
            notes:
              "Single public source; kept as a transparent seed entry until stronger route-specific metadata is added."
          }
        ],
        images: [],
        editorialTips: [
          "Practice linking difficult sections smoothly rather than only sending isolated cruxes.",
          "This is a good candidate for future source strengthening before adding photos."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "supernova-frankenjura",
        name: "Supernova",
        grade: "9a+/9b discussion",
        type: "sport",
        length: "Single pitch",
        style: "Modern extreme Frankenjura sport climbing.",
        summary:
          "A high-end Alexander Megos first ascent that represents the modern edge of difficulty in the region. The grade is intentionally shown with discussion instead of false certainty.",
        practiceFocus: [
          "Elite power endurance",
          "Project discipline",
          "Recovery between efforts",
          "Grade uncertainty literacy"
        ],
        bestFor:
          "Advanced readers tracking modern Frankenjura progression and how proposed grades settle.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "history", "firstAscent"],
            notes:
              "Open source lists Supernova among Megos's notable 9a+/b ascents; route-specific confirmation should be added later."
          }
        ],
        images: [],
        editorialTips: [
          "When grades are still discussed, show the range honestly instead of choosing the most exciting number.",
          "Practice planning long projects with careful skin, rest, and attempt quality."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "modified-frankenjura",
        name: "Modified",
        grade: "9a+ / 5.15a",
        type: "sport",
        length: "Single pitch",
        style: "Modern hard limestone with precise high-end execution.",
        summary:
          "A difficult Frankenjura route associated with Alexander Megos's fast progression on hard sport lines. This is a facts-only highlight, not route beta.",
        practiceFocus: [
          "High-end redpointing",
          "Efficient projecting",
          "Finger strength",
          "Mental reset after attempts"
        ],
        bestFor:
          "Climbers following contemporary Frankenjura testpieces and elite redpoint performance.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location"],
            notes:
              "Open source gives basic route metadata and regional context; not used for route instructions."
          }
        ],
        images: [],
        editorialTips: [
          "Study how elite climbers manage attempt quality, not just the final send.",
          "Add a second route-specific source before publishing richer historical notes."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["frankenjura-germany"],
      ...v4PopularRouteAdditions["frankenjura-germany"]
    ]
  },
  {
    slug: "siurana-spain",
    name: "Siurana",
    country: "Spain",
    latitude: 41.2587,
    longitude: 0.9323,
    climbingTypes: ["sport"],
    rockType: "Limestone",
    bestSeasons: ["Fall", "Winter", "Spring"],
    difficultyRange: "5.9 - 5.15",
    beginnerFriendly: false,
    description:
      "A sunny limestone village area known for technical sport climbing and scenic cliffs.",
    guideContent: popularDestinationGuides["siurana-spain"],
    externalResources: popularDestinationResources["siurana-spain"],
    routes: [
      {
        id: "la-rambla-siurana",
        name: "La Rambla",
        grade: "9a+ / 5.15a",
        type: "sport",
        length: "41 m",
        style: "Long limestone sport climbing with major historical weight.",
        summary:
          "One of Siurana's defining hard routes and a key reference point for sustained 9a+ sport climbing. ClimbAtlas keeps this as an overview, not a move-by-move guide.",
        practiceFocus: [
          "Long-route endurance",
          "Technical efficiency",
          "Pacing",
          "High-grade consistency"
        ],
        bestFor:
          "Experienced sport climbers studying sustained limestone routes and modern 9a+ history.",
        sources: [
          {
            sourceLabel: "Wikipedia: La Rambla",
            sourceUrl: "https://en.wikipedia.org/wiki/La_Rambla_(climb)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "type", "history"],
            notes:
              "Open encyclopedia route page for public metadata; ClimbAtlas does not copy route description or beta."
          },
          {
            sourceLabel: "Wikipedia FR: La Rambla",
            sourceUrl: "https://fr.wikipedia.org/wiki/La_Rambla_(escalade)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Independent-language cross-check for the route's basic public facts."
          }
        ],
        images: [],
        editorialTips: [
          "Train endurance and calm clipping rhythm on long steep routes before focusing on peak difficulty.",
          "For ClimbAtlas, route fame is not a reason to include copied beta; this stays original and high-level."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "golpe-de-estado-siurana",
        name: "Golpe de Estado",
        grade: "9b / 5.15b",
        type: "sport",
        length: "About 40 m",
        style: "Very hard limestone sport climbing at El Pati.",
        summary:
          "A major Siurana route from the early 9b era, useful for understanding how hard-route confirmation works after repeats.",
        practiceFocus: [
          "Bouldery endurance",
          "Long-project patience",
          "Grade confirmation awareness",
          "Recovery planning"
        ],
        bestFor:
          "Readers interested in how the top end of sport climbing grades becomes accepted over time.",
        sources: [
          {
            sourceLabel: "Wikipedia FR: Golpe de Estado",
            sourceUrl: "https://fr.wikipedia.org/wiki/Golpe_de_Estado",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "location", "history"],
            notes:
              "Open route page for basic metadata and historical context; no guide-style details are reused."
          },
          {
            sourceLabel: "Wikipedia: Chris Sharma",
            sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "firstAscent", "history"],
            notes:
              "Cross-checks Sharma's first ascent and the route's place in his high-end sport climbing period."
          }
        ],
        images: [],
        editorialTips: [
          "Track whether a route's grade has repeat confirmation before presenting it as settled.",
          "Practice combining bouldering power with long-route endurance in separate, controlled sessions."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "estado-critico-siurana",
        name: "Estado Critico",
        grade: "9a / 5.14d",
        type: "sport",
        length: "Single pitch",
        style: "Technical hard sport climbing with onsight-history significance.",
        summary:
          "Best known publicly for Alex Megos's 2013 onsight, this route gives ClimbAtlas a place to explain performance styles without copying any route beta.",
        practiceFocus: [
          "Onsight preparation",
          "Fast decision making",
          "Reading sequences",
          "Calm under uncertainty"
        ],
        bestFor:
          "Climbers curious about the difference between onsight performance and redpoint projecting.",
        sources: [
          {
            sourceLabel: "Wikipedia: grade milestones",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Lists Estado Critico as the first-ever 9a onsight."
          },
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Cross-checks the Megos onsight and Siurana location."
          }
        ],
        images: [],
        editorialTips: [
          "For onsight-oriented training, practice route reading and committing to decisions without previews.",
          "Keep the page focused on public achievement context, not sequence details."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "sleeping-lion-siurana",
        name: "Sleeping Lion",
        grade: "9b / 5.15b, after downgrade proposal",
        type: "sport",
        length: "Single pitch",
        style: "Modern elite sport route with ongoing grade context.",
        summary:
          "A recent Chris Sharma first ascent near the modern top end of sport climbing. The grade is shown with its downgrade discussion to keep the data honest.",
        practiceFocus: [
          "Grade discussion literacy",
          "Elite endurance",
          "Project tracking",
          "Rest-day discipline"
        ],
        bestFor:
          "Readers following current hard sport climbing and how grades change after repeats.",
        sources: [
          {
            sourceLabel: "Wikipedia: Chris Sharma",
            sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "firstAscent", "history"],
            notes:
              "Public source notes the original higher proposal and later downgrade proposal."
          },
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade", "history", "repeat"],
            notes:
              "Cross-checks Megos's repeat and the downgrade context."
          }
        ],
        images: [],
        editorialTips: [
          "When a route is new, present grade history as a living conversation.",
          "Practice tracking attempts and recovery honestly instead of only logging send days."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "king-capella-siurana",
        name: "King Capella",
        grade: "9b / 5.15b",
        type: "sport",
        length: "Single pitch",
        style: "Modern high-end Siurana sport climbing.",
        summary:
          "A William Bosi first ascent whose grade settled after repeat ascents. It is a useful example of why ClimbAtlas records source notes, not just route names.",
        practiceFocus: [
          "Hard redpoint process",
          "Grade settling",
          "High-intensity endurance",
          "Attempt analysis"
        ],
        bestFor:
          "Climbers interested in contemporary route development and grade confirmation.",
        sources: [
          {
            sourceLabel: "Wikipedia: William Bosi",
            sourceUrl: "https://en.wikipedia.org/wiki/William_Bosi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "firstAscent", "history"],
            notes:
              "Open source notes the original harder suggestion and later settled grade."
          },
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "repeat", "history"],
            notes:
              "Cross-checks a later repeat and helps support the grade-context note."
          }
        ],
        images: [],
        editorialTips: [
          "Learn from repeated ascents: they help turn a proposal into a stronger consensus.",
          "Use video and written logs for your own projects, but keep public notes respectful and non-beta."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "la-capella-siurana",
        name: "La Capella",
        grade: "9b / 9a+ discussion",
        type: "sport",
        length: "Single pitch",
        style: "Hard Siurana sport climbing with grade nuance.",
        summary:
          "A route often discussed around the 9b threshold. ClimbAtlas records the uncertainty so the page is useful without pretending the grade is simple.",
        practiceFocus: [
          "Precision under fatigue",
          "Grade nuance",
          "Project efficiency",
          "Strong movement basics"
        ],
        bestFor:
          "Climbers learning why elite sport climbing grades can remain nuanced after repeats.",
        sources: [
          {
            sourceLabel: "Wikipedia: William Bosi",
            sourceUrl: "https://en.wikipedia.org/wiki/William_Bosi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "history"],
            notes:
              "Open source mentions the 9b listing and the view that it may be closer to 9a+."
          },
          {
            sourceLabel: "Wikipedia: Jakob Schubert",
            sourceUrl: "https://en.wikipedia.org/wiki/Jakob_Schubert",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "location", "repeat"],
            notes:
              "Cross-checks La Capella as a notable Siurana ascent in Schubert's record."
          }
        ],
        images: [],
        editorialTips: [
          "Treat grade ranges as useful information, especially when climbers and sources disagree.",
          "Train on varied styles so a single hold type does not define your whole project season."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "la-furia-de-jabali-siurana",
        name: "La Furia de Jabalí",
        grade: "9a+ / 5.15a",
        type: "sport",
        length: "Single pitch",
        style: "Hard technical sport climbing with settled downgrade context.",
        summary:
          "A William Bosi first ascent that settled at 9a+ after repeat ascents. It is a good example of honest source notes around grade development.",
        practiceFocus: [
          "Hard sequence retention",
          "Repeat-based grade context",
          "Power endurance",
          "Skin management"
        ],
        bestFor:
          "Climbers tracking how repeat ascents refine a route's public grade.",
        sources: [
          {
            sourceLabel: "Wikipedia: William Bosi",
            sourceUrl: "https://en.wikipedia.org/wiki/William_Bosi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "firstAscent", "history"],
            notes:
              "Open source notes the first ascent, initial harder suggestion, and settled 9a+ grade after repeats."
          },
          {
            sourceLabel: "Wikipedia: Jakob Schubert",
            sourceUrl: "https://en.wikipedia.org/wiki/Jakob_Schubert",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "location", "repeat"],
            notes:
              "Cross-checks a later repeat in Siurana."
          }
        ],
        images: [],
        editorialTips: [
          "When grades settle downward, present that as useful accuracy rather than a loss of prestige.",
          "Practice repeatable high-quality burns rather than accumulating tired attempts."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "la-reina-mora-siurana",
        name: "La Reina Mora",
        grade: "8c+/9a discussion",
        type: "sport",
        length: "Single pitch",
        style: "Siurana limestone route with grade-boundary discussion.",
        summary:
          "A neighboring historical Siurana line that appears in public grade-discussion records. This entry is deliberately conservative because the source pack is thinner than the famous 9a+ routes.",
        practiceFocus: [
          "Technical sport climbing",
          "Grade-boundary awareness",
          "Consistent endurance",
          "Source-quality judgment"
        ],
        bestFor:
          "Readers who want a broader Siurana picture beyond only the headline routes.",
        sources: [
          {
            sourceLabel: "Wikipedia: La Rambla",
            sourceUrl: "https://en.wikipedia.org/wiki/La_Rambla_(climb)",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "location", "history"],
            notes:
              "Mentions La Reina Mora as a neighboring route tied to the La Rambla extension history."
          },
          {
            sourceLabel: "Wikipedia: grade milestones",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade", "gradeDiscussion"],
            notes:
              "Records the 8c+/9a grade discussion; ClimbAtlas avoids presenting it as a settled 9a."
          }
        ],
        images: [],
        editorialTips: [
          "Use conservative grade language when sources discuss a boundary grade.",
          "This route is a good candidate for stronger route-specific source checks later."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["siurana-spain"],
      ...v4PopularRouteAdditions["siurana-spain"]
    ]
  },
  {
    slug: "margalef-spain",
    name: "Margalef",
    country: "Spain",
    latitude: 41.2845,
    longitude: 0.7536,
    climbingTypes: ["sport"],
    rockType: "Conglomerate",
    bestSeasons: ["Fall", "Winter", "Spring"],
    difficultyRange: "5.8 - 5.15",
    beginnerFriendly: true,
    description:
      "A steep conglomerate destination with pocketed climbs across many grades.",
    guideContent: popularDestinationGuides["margalef-spain"],
    externalResources: popularDestinationResources["margalef-spain"],
    routes: [
      {
        id: "perfecto-mundo-margalef",
        name: "Perfecto Mundo",
        grade: "9b+ / 5.15c",
        type: "sport",
        length: "Single pitch",
        style: "Elite conglomerate sport climbing with global benchmark status.",
        summary:
          "One of Margalef's headline modern routes and a public reference point for the 9b+ grade. This card presents verified facts and original training framing only.",
        practiceFocus: [
          "Elite power endurance",
          "Project logistics",
          "High-end finger strength",
          "Grade benchmark context"
        ],
        bestFor:
          "Readers following the modern top end of sport climbing and confirmed 9b+ routes.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "firstAscent", "history"],
            notes:
              "Open source for Megos's first ascent and 9b+ context; not used for route beta."
          },
          {
            sourceLabel: "Wikipedia: grade milestones",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["grade", "history", "repeat"],
            notes:
              "Cross-checks Perfecto Mundo as a benchmark 9b+ route with later repeats."
          }
        ],
        images: [],
        editorialTips: [
          "For extreme routes, separate physical preparation, attempt tactics, and recovery into different training blocks.",
          "Treat the grade as context, not as a substitute for understanding style."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "first-round-first-minute-margalef",
        name: "First Round First Minute",
        grade: "9b / 5.15b",
        type: "sport",
        length: "Single pitch",
        style: "Powerful Margalef conglomerate at the hard sport frontier.",
        summary:
          "A Chris Sharma first ascent and one of Margalef's best-known hard routes. The ClimbAtlas note keeps the focus on history and training themes.",
        practiceFocus: [
          "Explosive power",
          "High-end redpointing",
          "Attempt quality",
          "Mental reset"
        ],
        bestFor:
          "Climbers studying the early 9b era and Sharma's influence on modern sport climbing.",
        sources: [
          {
            sourceLabel: "Wikipedia: Chris Sharma",
            sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "firstAscent", "repeat"],
            notes:
              "Open source for public route metadata and repeat history."
          },
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "repeat"],
            notes:
              "Cross-checks Megos's later ascent and grade listing."
          }
        ],
        images: [],
        editorialTips: [
          "Practice powerful links after adequate rest rather than grinding exhausted attempts.",
          "Future user tips should focus on general preparation and conditions, not copied sequence beta."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "first-ley-margalef",
        name: "First Ley",
        grade: "9a+ / 5.15a",
        type: "sport",
        length: "15 m",
        style: "Shorter high-end Margalef sport climbing.",
        summary:
          "A shorter route connected to the First Round First Minute line and widely referenced as a 9a+ objective for elite climbers.",
        practiceFocus: [
          "Short-route intensity",
          "Explosive sequences",
          "Precise rest timing",
          "Power-to-endurance transfer"
        ],
        bestFor:
          "Advanced climbers comparing short 9a+ routes with longer endurance-based testpieces.",
        sources: [
          {
            sourceLabel: "Wikipedia: Chris Sharma",
            sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "length", "location", "firstAscent"],
            notes:
              "Open source gives basic facts and relationship to First Round First Minute."
          },
          {
            sourceLabel: "Wikipedia: William Bosi",
            sourceUrl: "https://en.wikipedia.org/wiki/William_Bosi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "repeat"],
            notes:
              "Cross-checks First Ley as a notable 9a+ repeat."
          }
        ],
        images: [],
        editorialTips: [
          "Shorter elite routes still demand endurance; train hard links, not only single moves.",
          "Use source notes to explain relationship between nearby lines without describing the route itself."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "demencia-senil-margalef",
        name: "Demencia Senil",
        grade: "9a+ / 5.15a",
        type: "sport",
        length: "Single pitch",
        style: "Hard Margalef sport climbing from Sharma's development period.",
        summary:
          "A notable Margalef first ascent from Chris Sharma's high-end sport climbing era. This entry records public facts and original practice framing.",
        practiceFocus: [
          "Power endurance",
          "Pockets under fatigue",
          "Project patience",
          "Linking sections"
        ],
        bestFor:
          "Climbers interested in Margalef's early high-end route development.",
        sources: [
          {
            sourceLabel: "Wikipedia: Chris Sharma",
            sourceUrl: "https://en.wikipedia.org/wiki/Chris_Sharma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "firstAscent", "repeat"],
            notes:
              "Open source for route name, grade, first ascent, and early repeat context."
          },
          {
            sourceLabel: "Wikipedia: Stefano Ghisolfi",
            sourceUrl: "https://en.wikipedia.org/wiki/Stefano_Ghisolfi",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "repeat"],
            notes:
              "Cross-checks the route as a notable later ascent; still not used for beta."
          }
        ],
        images: [],
        editorialTips: [
          "Train steep endurance with enough recovery to keep movement quality high.",
          "Add a route-specific media source later before expanding history notes."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "era-vella-margalef",
        name: "Era Vella",
        grade: "8c+/9a discussion",
        type: "sport",
        length: "Single pitch",
        style: "Margalef endurance route with grade-boundary discussion.",
        summary:
          "A widely known Margalef route whose public grade has been discussed around the 8c+/9a boundary. ClimbAtlas uses the conservative range.",
        practiceFocus: [
          "Long endurance",
          "Grade-boundary awareness",
          "Pacing",
          "Movement economy"
        ],
        bestFor:
          "Climbers learning how consensus grades can shift after many ascents.",
        sources: [
          {
            sourceLabel: "Wikipedia DE: Margalef",
            sourceUrl: "https://de.wikipedia.org/wiki/Margalef",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location"],
            notes:
              "Area page lists Era Vella among Margalef's notable sport climbs."
          },
          {
            sourceLabel: "Wikipedia: Sachi Amma",
            sourceUrl: "https://en.wikipedia.org/wiki/Sachi_Amma",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "location", "repeat"],
            notes:
              "Cross-checks Era Vella as a notable Margalef ascent."
          }
        ],
        images: [],
        editorialTips: [
          "Use ranges when sources disagree or grades have shifted.",
          "Practice endurance pacing; routes near grade boundaries often punish inefficient climbing."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "mejorando-imagen-margalef",
        name: "Mejorando Imagen",
        grade: "9a original / 9b proposed",
        type: "sport",
        length: "Single pitch",
        style: "High-end Margalef route with upgrade discussion.",
        summary:
          "A Margalef route where public sources record both the original grade and a later harder proposal. The card preserves that uncertainty.",
        practiceFocus: [
          "Grade discussion literacy",
          "Elite redpointing",
          "High-quality attempts",
          "Source comparison"
        ],
        bestFor:
          "Readers interested in how upgrade proposals enter the public route record.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "repeat", "gradeDiscussion"],
            notes:
              "Open source records the original 9a grade and Megos's later 9b proposal."
          },
          {
            sourceLabel: "Wikipedia: Ramón Julián",
            sourceUrl: "https://en.wikipedia.org/wiki/Ram%C3%B3n_Juli%C3%A1n",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["firstAscent", "athleteContext"],
            notes:
              "Supports first-ascent context for Ramón Julián, but should be strengthened with a route-specific source."
          }
        ],
        images: [],
        editorialTips: [
          "Keep upgrade notes visible instead of flattening the route into one dramatic grade.",
          "This route should get stronger route-specific sourcing before adding richer editorial history."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "the-full-journey-margalef",
        name: "The Full Journey",
        grade: "9b / 5.15b",
        type: "sport",
        length: "Single pitch",
        style: "Modern Margalef 9b with contemporary elite context.",
        summary:
          "A modern Alexander Megos first ascent that keeps Margalef visible in current hard sport climbing. The note stays source-based and non-instructional.",
        practiceFocus: [
          "Modern projecting",
          "Elite endurance",
          "Long-term preparation",
          "Attempt review"
        ],
        bestFor:
          "Climbers following recent 9b sport climbs and Margalef's ongoing development.",
        sources: [
          {
            sourceLabel: "Wikipedia: Alexander Megos",
            sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Megos",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "firstAscent", "history"],
            notes:
              "Open source lists The Full Journey among Megos's 9b first ascents."
          }
        ],
        images: [],
        editorialTips: [
          "Single-source route: good enough for a transparent seed card, but not for rich editorial claims.",
          "Future sources should confirm location metadata and route-specific history before expansion."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "gancho-perfecto-margalef",
        name: "Gancho Perfecto",
        grade: "9a / 5.14d",
        type: "sport",
        length: "Single pitch",
        style: "Hard Margalef conglomerate route from the 2000s development period.",
        summary:
          "A Margalef route connected with Chris Sharma and Ramón Julián in public ascent records. This is a conservative seed entry pending stronger route-specific sourcing.",
        practiceFocus: [
          "Pocket strength",
          "Power endurance",
          "Source-quality review",
          "Consistent execution"
        ],
        bestFor:
          "Readers who want Margalef route variety beyond only the 9b headline climbs.",
        sources: [
          {
            sourceLabel: "Wikipedia IT: Ramón Julián Puigblanque",
            sourceUrl:
              "https://it.wikipedia.org/wiki/Ram%C3%B3n_Juli%C3%A1n_Puigblanque",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location", "repeat"],
            notes:
              "Open source lists a 2008 repeat and cites a route-specific news reference; ClimbAtlas still marks this as needing stronger direct sourcing."
          }
        ],
        images: [],
        editorialTips: [
          "Because this card has one source, avoid adding extra history until it is cross-checked.",
          "Train pocket strength progressively; Margalef style can be hard on fingers."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["margalef-spain"],
      ...v5PopularRouteAdditions["margalef-spain"]
    ]
  },
  {
    slug: "yangshuo-china",
    name: "Yangshuo",
    country: "China",
    latitude: 24.7785,
    longitude: 110.4966,
    climbingTypes: ["sport", "multi-pitch"],
    rockType: "Limestone",
    bestSeasons: ["Fall", "Winter", "Spring"],
    difficultyRange: "5.7 - 5.14",
    beginnerFriendly: true,
    description:
      "A karst landscape with limestone towers, river scenery, and a growing sport climbing scene.",
    guideContent: popularDestinationGuides["yangshuo-china"],
    externalResources: popularDestinationResources["yangshuo-china"],
    routes: [
      {
        id: "moonwalker-yangshuo",
        name: "Moonwalker",
        grade: "5.13 metadata",
        type: "sport",
        length: "Moon Hill arch route",
        style: "Steep limestone climbing across Yangshuo's iconic Moon Hill arch.",
        summary:
          "A Todd Skinner-era Yangshuo classic and the best-sourced route card in this destination batch.",
        practiceFocus: ["steep limestone", "route endurance", "historic context"],
        bestFor:
          "Advanced sport climbers interested in Yangshuo's early international development story.",
        personalityTags: ["Historic testpiece", "Endurance quest", "Karst limestone"],
        decisionHint:
          "Pick this when you want a Yangshuo route with strong place identity and early-route history.",
        sources: [
          {
            sourceLabel: "Wikipedia FR: Yangshuo climbing",
            sourceUrl: "https://fr.wikipedia.org/wiki/Xian_de_Yangshuo",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "location", "history"],
            notes:
              "Open encyclopedia source names Moonwalker as a classic Todd Skinner route at Moon Hill."
          },
          {
            sourceLabel: "Wikipedia: Moon Hill",
            sourceUrl: "https://en.wikipedia.org/wiki/Moon_Hill",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["location", "climbing context", "route grade range"],
            notes:
              "Cross-checks Moon Hill as a Yangshuo climbing area with 5.13 lines."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a history and style card, not a Moon Hill access or route beta source.",
          "Steep arch routes reward endurance and calm pacing."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "over-the-moon-yangshuo",
        name: "Over the Moon",
        grade: "5.12 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Yangshuo limestone sport route style with Moon Hill context.",
        summary:
          "A Yangshuo route-name seed included for variety, with route-specific metadata still needing stronger verification.",
        practiceFocus: ["steep movement", "route reading", "power endurance"],
        bestFor:
          "Sport climbers comparing harder Yangshuo limestone recommendations.",
        personalityTags: ["Karst limestone", "Power endurance", "Sport journey"],
        decisionHint:
          "Pick this when the quiz should point toward a harder Yangshuo sport style.",
        sources: [
          {
            sourceLabel: "Wikipedia: Moon Hill climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Moon_Hill",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["location", "area context"],
            notes:
              "Area context only; route name and grade need route-specific confirmation."
          }
        ],
        images: [],
        editorialTips: [
          "Low-trust route card: keep it short until better metadata is added.",
          "Do not add sequence, approach, or route-management details."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "the-egg-yangshuo",
        name: "The Egg",
        grade: "5.10 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Approachable Yangshuo sport climbing on limestone karst.",
        summary:
          "A lower-grade Yangshuo seed card so the route finder can offer approachable limestone options.",
        practiceFocus: ["confidence", "limestone basics", "movement economy"],
        bestFor:
          "Intermediate climbers asking for a friendlier Yangshuo sport recommendation.",
        personalityTags: ["Confidence builder", "Karst limestone", "Style sampler"],
        decisionHint:
          "Pick this when you want Yangshuo flavor without a high-grade focus.",
        sources: [
          {
            sourceLabel: "Wikipedia: Yangshuo County climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Yangshuo_County",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "crag context"],
            notes:
              "Area source lists notable Yangshuo crags; route metadata needs stronger verification."
          }
        ],
        images: [],
        editorialTips: [
          "Use easier route cards to support route choice, not to replace local information.",
          "This seed entry should be strengthened before launch."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "spicy-noodle-yangshuo",
        name: "Spicy Noodle",
        grade: "5.13 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Hard Yangshuo limestone sport climbing with spicy endurance character.",
        summary:
          "A high-end Yangshuo route-name seed kept deliberately conservative because source quality is still thin.",
        practiceFocus: ["power endurance", "finger strength", "project pacing"],
        bestFor:
          "Advanced climbers looking for harder Yangshuo inspiration in the quiz.",
        personalityTags: ["Power endurance", "Karst limestone", "Sport journey"],
        decisionHint:
          "Pick this when you want a hard sport-climbing flavor in Yangshuo.",
        sources: [
          {
            sourceLabel: "Wikipedia: Yangshuo County climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Yangshuo_County",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "climbing style"],
            notes:
              "Area source only; route name and grade require stronger route-specific metadata."
          }
        ],
        images: [],
        editorialTips: [
          "Weak-source hard routes should stay as lightweight style cards.",
          "Avoid adding any beta or popularity claims without acceptable sources."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "lizard-king-yangshuo",
        name: "Lizard King",
        grade: "5.12 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Yangshuo limestone route style with advanced sport movement.",
        summary:
          "A Yangshuo route-name seed included to diversify route-finder results while source packs are improved.",
        practiceFocus: ["technical power", "route reading", "endurance"],
        bestFor:
          "Sport climbers exploring the harder side of Yangshuo's limestone style.",
        personalityTags: ["Technique lab", "Power endurance", "Karst limestone"],
        decisionHint:
          "Pick this when the recommendation should feel technical and athletic.",
        sources: [
          {
            sourceLabel: "Wikipedia: Yangshuo County climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Yangshuo_County",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "climbing style"],
            notes:
              "Area context only; route-specific facts need stronger verification."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a recommendation flavor, not as an attempt plan.",
          "Source quality should be upgraded before adding more detail."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "single-life-yangshuo",
        name: "Single Life",
        grade: "5.11 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Mid-grade Yangshuo limestone climbing for steady sport practice.",
        summary:
          "A mid-grade seed card to help the atlas recommend Yangshuo routes for training and confidence.",
        practiceFocus: ["lead rhythm", "movement flow", "confidence"],
        bestFor:
          "Intermediate climbers who want a useful sport practice card in Yangshuo.",
        personalityTags: ["Confidence builder", "Technique lab", "Karst limestone"],
        decisionHint:
          "Pick this when your goal is a steady sport day rather than a limit project.",
        sources: [
          {
            sourceLabel: "Wikipedia: Yangshuo County climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Yangshuo_County",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "climbing style"],
            notes:
              "Area context only; route-specific metadata needs a stronger source."
          }
        ],
        images: [],
        editorialTips: [
          "Mid-grade routes are useful for technique and pacing goals.",
          "No guidebook-style details are included."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "red-dragon-yangshuo",
        name: "Red Dragon",
        grade: "5.11 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Yangshuo limestone sport climbing with route-finder adventure flavor.",
        summary:
          "A conservative route-name seed used to give the Yangshuo page more variety while still showing source limitations.",
        practiceFocus: ["route flow", "technical movement", "confidence"],
        bestFor:
          "Climbers choosing a mid-grade Yangshuo sport style in the atlas.",
        personalityTags: ["Style sampler", "Karst limestone", "Technique lab"],
        decisionHint:
          "Pick this when you want a Yangshuo card that feels balanced rather than extreme.",
        sources: [
          {
            sourceLabel: "Wikipedia: Yangshuo County climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Yangshuo_County",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "climbing style"],
            notes:
              "Area source only; route-specific confirmation needed before launch."
          }
        ],
        images: [],
        editorialTips: [
          "This is a temporary route-choice card until stronger metadata is available.",
          "Do not invent user reviews or condition reports."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "white-mountain-lines-yangshuo",
        name: "White Mountain route line",
        grade: "5.12 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Yangshuo sport climbing from one of the area's notable crag contexts.",
        summary:
          "A conservative highlight for Yangshuo's White Mountain style, included as a route-line placeholder until exact route metadata is strengthened.",
        practiceFocus: ["sport endurance", "limestone reading", "project discipline"],
        bestFor:
          "Climbers who want the recommendation system to include Yangshuo's harder crag style.",
        personalityTags: ["Sport journey", "Power endurance", "Karst limestone"],
        decisionHint:
          "Pick this when you want a harder Yangshuo sport-climbing direction rather than a specific beta card.",
        sources: [
          {
            sourceLabel: "Wikipedia: Yangshuo County climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Yangshuo_County",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "crag context"],
            notes:
              "Area/crag context only; convert this into an exact route card after stronger source checks."
          }
        ],
        images: [],
        editorialTips: [
          "This card is intentionally labeled as a route-line placeholder.",
          "Replace with exact verified route metadata when available."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["yangshuo-china"],
      ...v5PopularRouteAdditions["yangshuo-china"]
    ]
  },
  {
    slug: "liming-china",
    name: "Liming",
    country: "China",
    latitude: 26.83,
    longitude: 99.76,
    climbingTypes: ["trad", "multi-pitch"],
    rockType: "Sandstone",
    bestSeasons: ["Fall", "Winter", "Spring"],
    difficultyRange: "5.7 - 5.13",
    beginnerFriendly: false,
    description:
      "A sandstone area with striking crack systems and adventurous traditional climbing.",
    guideContent: popularDestinationGuides["liming-china"],
    externalResources: popularDestinationResources["liming-china"],
    routes: [
      {
        id: "air-china-liming",
        name: "Air China",
        grade: "5.12 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Liming sandstone crack climbing with hard traditional character.",
        summary:
          "A widely cited Liming route name used here as a conservative crack-climbing seed card.",
        practiceFocus: ["crack technique", "trad composure", "sandstone movement"],
        bestFor:
          "Experienced trad climbers comparing Liming's crack style in the route finder.",
        personalityTags: ["Desert crack", "Adventure mindset", "Finger puzzle"],
        decisionHint:
          "Pick this when you want Liming to surface as a harder crack-climbing objective.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Temporary metadata card; replace with a route-specific open source or approved database metadata source."
          }
        ],
        images: [],
        editorialTips: [
          "Liming entries are intentionally conservative until stronger route sources are added.",
          "Do not add protection or crack-size beta."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "the-guardian-liming",
        name: "The Guardian",
        grade: "5.11 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Sandstone crack and face climbing with adventurous Liming character.",
        summary:
          "A Liming route-name seed included to represent the area's traditional climbing identity while source quality is improved.",
        practiceFocus: ["trad judgment", "movement control", "crack basics"],
        bestFor:
          "Climbers who want Liming recommendations with a classic trad feeling.",
        personalityTags: ["Adventure mindset", "Desert crack", "Technique lab"],
        decisionHint:
          "Pick this when you want a steadier trad-style Liming card.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Temporary metadata seed; route-specific source pack is required before production use."
          }
        ],
        images: [],
        editorialTips: [
          "Use weak-source Liming cards only for recommendation flavor.",
          "No rack, protection, approach, or descent details are included."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "faraway-corner-liming",
        name: "Faraway Corner",
        grade: "5.10 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Moderate sandstone crack style for Liming route-choice variety.",
        summary:
          "A lower-grade Liming seed card to keep the destination useful beyond hard crack inspiration.",
        practiceFocus: ["crack rhythm", "confidence", "footwork"],
        bestFor:
          "Climbers asking the atlas for a more approachable Liming-style trad recommendation.",
        personalityTags: ["Confidence builder", "Desert crack", "Style sampler"],
        decisionHint:
          "Pick this when you want a friendlier Liming crack-climbing flavor.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Placeholder metadata card; strengthen with route-specific source before launch."
          }
        ],
        images: [],
        editorialTips: [
          "Moderate crack routes still require good systems and judgment.",
          "This card is not a guidebook substitute."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "kung-fu-fighter-liming",
        name: "Kung Fu Fighter",
        grade: "5.11 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Physical sandstone trad climbing with route-finder adventure flavor.",
        summary:
          "A Liming route-name seed that gives the quiz a more athletic traditional-climbing option.",
        practiceFocus: ["body tension", "crack power", "mental pacing"],
        bestFor:
          "Experienced climbers choosing a more physical Liming-style route card.",
        personalityTags: ["Power problem", "Desert crack", "Adventure mindset"],
        decisionHint:
          "Pick this when you want Liming to feel physical and memorable.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Temporary route metadata; requires stronger verification before richer notes."
          }
        ],
        images: [],
        editorialTips: [
          "Harder trad cards should stay high-level until source quality improves.",
          "Do not infer protection details from the route name."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "japanese-cowboy-liming",
        name: "Japanese Cowboy",
        grade: "5.10 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Liming sandstone crack style with playful route-choice identity.",
        summary:
          "A conservative Liming seed card used for variety in the recommendation engine.",
        practiceFocus: ["crack basics", "movement flow", "trad confidence"],
        bestFor:
          "Climbers who want an intermediate Liming-style trad recommendation.",
        personalityTags: ["Style sampler", "Desert crack", "Confidence builder"],
        decisionHint:
          "Pick this when you want a balanced Liming crack-climbing card.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Needs route-specific source verification before production launch."
          }
        ],
        images: [],
        editorialTips: [
          "Keep this as a metadata seed until a stronger source pack is found.",
          "No user comments are invented for the community layer."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "pillar-of-dreams-liming",
        name: "Pillar of Dreams",
        grade: "5.12 metadata",
        type: "multi-pitch",
        length: "Multi-pitch metadata",
        style: "Tall sandstone adventure route style from the Liming landscape.",
        summary:
          "A route-name seed for Liming's bigger adventure side, explicitly marked as needing better source verification.",
        practiceFocus: ["multi-pitch judgment", "trad systems", "exposure management"],
        bestFor:
          "Experienced climbers looking for Liming adventure-style inspiration.",
        personalityTags: ["Adventure mindset", "Endurance quest", "Desert crack"],
        decisionHint:
          "Pick this when you want the recommendation to feel like a sandstone adventure.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Temporary multi-pitch metadata card; exact route facts require stronger sources."
          }
        ],
        images: [],
        editorialTips: [
          "Adventure cards should never include logistics without strong current sources.",
          "Treat this as inspiration, not objective planning."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "climb-like-a-girl-liming",
        name: "Climb Like a Girl",
        grade: "5.10 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Moderate Liming crack style for confidence and technique.",
        summary:
          "A Liming route-name seed included to broaden the route finder across grades and moods.",
        practiceFocus: ["confidence", "crack rhythm", "efficient feet"],
        bestFor:
          "Climbers asking for a less intimidating Liming trad-style route card.",
        personalityTags: ["Confidence builder", "Technique lab", "Desert crack"],
        decisionHint:
          "Pick this when you want Liming to show up as a practice-oriented choice.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Placeholder route metadata; needs stronger route-specific sourcing."
          }
        ],
        images: [],
        editorialTips: [
          "Technique-focused cards can help route choice without becoming beta.",
          "Replace this card if stronger route metadata contradicts it."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "lightning-crack-liming",
        name: "Lightning Crack",
        grade: "5.11 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Sandstone crack route style with sharper physical emphasis.",
        summary:
          "A conservative Liming crack seed card for users who prefer physical traditional climbing.",
        practiceFocus: ["finger crack strength", "body position", "calm effort"],
        bestFor:
          "Experienced trad climbers comparing Liming crack styles in the atlas.",
        personalityTags: ["Finger puzzle", "Desert crack", "Power problem"],
        decisionHint:
          "Pick this when you want a sharper crack-climbing recommendation from Liming.",
        sources: [
          {
            sourceLabel: "Liming route metadata needs stronger source",
            sourceUrl: "https://en.wikipedia.org/wiki/Climbing_route",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["metadata policy"],
            notes:
              "Temporary metadata seed; route-specific verification should be prioritized."
          }
        ],
        images: [],
        editorialTips: [
          "Physical crack routes require careful progression and recovery.",
          "This seed card avoids crack-size or protection details."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["liming-china"],
      ...v5PopularRouteAdditions["liming-china"]
    ]
  },
  {
    slug: "long-dong-taiwan",
    name: "Long Dong",
    country: "Taiwan",
    latitude: 25.1158,
    longitude: 121.9151,
    climbingTypes: ["trad", "sport"],
    rockType: "Sandstone",
    bestSeasons: ["Fall", "Winter", "Spring"],
    difficultyRange: "5.6 - 5.13",
    beginnerFriendly: true,
    description:
      "A seaside cliff area with ocean views, varied routes, and a mix of sport and trad climbing.",
    guideContent: popularDestinationGuides["long-dong-taiwan"],
    externalResources: popularDestinationResources["long-dong-taiwan"],
    routes: [
      {
        id: "school-gate-route-line-long-dong",
        name: "School Gate route line",
        grade: "5.8-5.11 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Accessible seaside sandstone climbing near one of Long Dong's main entry areas.",
        summary:
          "A conservative route-line card for Long Dong's School Gate context, included until exact route metadata is strengthened.",
        practiceFocus: ["seaside movement", "confidence", "sandstone footwork"],
        bestFor:
          "Climbers who want an approachable Long Dong recommendation in the route finder.",
        personalityTags: ["Sea-cliff style", "Confidence builder", "Style sampler"],
        decisionHint:
          "Pick this when you want Long Dong to feel accessible and scenic rather than extreme.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "grade range", "sector context"],
            notes:
              "Area and sector source; exact route metadata needs stronger route-specific confirmation."
          }
        ],
        images: [],
        editorialTips: [
          "This is a route-line placeholder, not an exact route guide.",
          "Sea-cliff days require current local judgment, which ClimbAtlas does not replace."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "golden-valley-route-line-long-dong",
        name: "Golden Valley route line",
        grade: "5.9-5.12 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Long Dong sandstone climbing with a more adventurous sector feel.",
        summary:
          "A route-line seed card for the Golden Valley sector, useful for recommendation flavor but not yet route-specific.",
        practiceFocus: ["trad judgment", "movement control", "ocean exposure"],
        bestFor:
          "Climbers comparing Long Dong's more adventurous sandstone style.",
        personalityTags: ["Adventure mindset", "Sea-cliff style", "Technique lab"],
        decisionHint:
          "Pick this when you want a Long Dong recommendation with more adventure character.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "sector context", "grade range"],
            notes:
              "Area source identifies Golden Valley as a Long Dong sector; exact route line needs stronger source."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a style signal until exact route metadata is available.",
          "No approach, tide, or protection guidance is included."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "back-door-route-line-long-dong",
        name: "Back Door route line",
        grade: "5.8-5.12 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Seaside sandstone climbing from Long Dong's Back Door sector context.",
        summary:
          "A conservative Long Dong sector-based route card to widen the atlas beyond one entry area.",
        practiceFocus: ["route judgment", "sandstone technique", "confidence"],
        bestFor:
          "Climbers who want Long Dong recommendations with a little more exploration feel.",
        personalityTags: ["Adventure mindset", "Sea-cliff style", "Style sampler"],
        decisionHint:
          "Pick this when you want a scenic sandstone route-choice direction.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "sector context", "grade range"],
            notes:
              "Sector source only; route-specific metadata should replace this placeholder."
          }
        ],
        images: [],
        editorialTips: [
          "Sector-based cards help discovery but should not be treated as exact route instructions.",
          "Replace this with verified route names as sources improve."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "music-hall-route-line-long-dong",
        name: "Music Hall route line",
        grade: "5.10 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Long Dong seaside route style with technical sandstone movement.",
        summary:
          "A low-trust route-line seed included for route-finder variety and future source replacement.",
        practiceFocus: ["technical footwork", "route reading", "lead rhythm"],
        bestFor:
          "Climbers who want a technical Long Dong sandstone recommendation.",
        personalityTags: ["Technique lab", "Sea-cliff style", "Style sampler"],
        decisionHint:
          "Pick this when you want a technical sea-cliff style card.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "grade range"],
            notes:
              "Area source only; route-specific facts need stronger verification."
          }
        ],
        images: [],
        editorialTips: [
          "Keep low-trust Long Dong cards short and clearly labeled.",
          "Do not add condition or safety advice without current local sources."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "grand-auditorium-route-line-long-dong",
        name: "Grand Auditorium route line",
        grade: "5.10-5.12 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Bigger-feeling sea-cliff sandstone climbing with dramatic setting.",
        summary:
          "A Long Dong placeholder route-line card focused on the destination's ocean-wall atmosphere.",
        practiceFocus: ["exposure management", "sandstone movement", "trad composure"],
        bestFor:
          "Experienced climbers who want Long Dong recommendations with a larger-wall mood.",
        personalityTags: ["Adventure mindset", "Sea-cliff style", "Technique lab"],
        decisionHint:
          "Pick this when setting and exposure matter as much as grade.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "grade range"],
            notes:
              "Area source only; convert to exact route card after route-specific source review."
          }
        ],
        images: [],
        editorialTips: [
          "Atmosphere can guide route choice, but this is not a logistics card.",
          "Future user records should come from real accounts, not seeded claims."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "first-cave-route-line-long-dong",
        name: "First Cave route line",
        grade: "5.9 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Seaside sandstone movement practice in a compact route-line card.",
        summary:
          "A low-trust Long Dong route-line seed for easier sport-style recommendations.",
        practiceFocus: ["confidence", "movement economy", "sandstone basics"],
        bestFor:
          "Intermediate climbers looking for a lighter Long Dong route-finder result.",
        personalityTags: ["Confidence builder", "Sea-cliff style", "Style sampler"],
        decisionHint:
          "Pick this when you want a more approachable Long Dong style suggestion.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "grade range"],
            notes:
              "Area source only; route-specific metadata should be added later."
          }
        ],
        images: [],
        editorialTips: [
          "Beginner-friendly does not mean conditions are simple; check local context elsewhere.",
          "This card only helps choose style."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "second-cave-route-line-long-dong",
        name: "Second Cave route line",
        grade: "5.10 metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Technical seaside sandstone climbing with compact sport-route character.",
        summary:
          "A Long Dong metadata seed card for users who prefer technical sport movement.",
        practiceFocus: ["technical movement", "foot precision", "route flow"],
        bestFor:
          "Climbers asking the Route Finder for technical but not extreme Long Dong style.",
        personalityTags: ["Technique lab", "Sea-cliff style", "Confidence builder"],
        decisionHint:
          "Pick this when you want precise sandstone movement near the ocean.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "grade range"],
            notes:
              "Area source only; exact route metadata needs stronger confirmation."
          }
        ],
        images: [],
        editorialTips: [
          "Technical style notes are allowed; movement beta is not.",
          "Replace with exact route metadata when better sources are available."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "clocktower-route-line-long-dong",
        name: "Clocktower route line",
        grade: "5.11 metadata",
        type: "trad",
        length: "Single pitch metadata",
        style: "Harder Long Dong sandstone style with adventurous route-choice character.",
        summary:
          "A conservative Long Dong seed card for users who want a stronger trad-style recommendation.",
        practiceFocus: ["trad composure", "technical power", "ocean exposure"],
        bestFor:
          "Experienced climbers using ClimbAtlas to compare Long Dong's harder moods.",
        personalityTags: ["Adventure mindset", "Technique lab", "Sea-cliff style"],
        decisionHint:
          "Pick this when you want the Long Dong suggestion to feel more committing.",
        sources: [
          {
            sourceLabel: "Wikipedia ZH: Long Dong climbing area",
            sourceUrl:
              "https://zh.wikipedia.org/wiki/%E9%BE%8D%E6%B4%9E%E6%94%80%E5%B2%A9%E5%A0%B4",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "grade range"],
            notes:
              "Area source only; route-specific metadata should be verified before launch."
          }
        ],
        images: [],
        editorialTips: [
          "Harder sea-cliff route cards should remain high-level until sources improve.",
          "No protection or access details are included."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["long-dong-taiwan"],
      ...v5PopularRouteAdditions["long-dong-taiwan"]
    ]
  },
  {
    slug: "railay-tonsai-thailand",
    name: "Railay / Tonsai",
    country: "Thailand",
    latitude: 8.0107,
    longitude: 98.837,
    climbingTypes: ["sport", "multi-pitch"],
    rockType: "Limestone",
    bestSeasons: ["Winter"],
    difficultyRange: "5.6 - 5.14",
    beginnerFriendly: true,
    description:
      "A tropical limestone area with beach access, steep walls, and warm-weather climbing.",
    guideContent: popularDestinationGuides["railay-tonsai-thailand"],
    externalResources: popularDestinationResources["railay-tonsai-thailand"],
    routes: [
      {
        id: "humanality-railay-tonsai",
        name: "Humanality",
        grade: "6b+ metadata",
        type: "multi-pitch",
        length: "Multi-pitch metadata",
        style: "Tropical limestone multi-pitch climbing above the Railay/Tonsai coast.",
        summary:
          "A recognizable Railay/Tonsai route-name seed included for the area's adventurous beach-climbing identity.",
        practiceFocus: ["multi-pitch rhythm", "limestone movement", "exposure comfort"],
        bestFor:
          "Climbers who want a tropical multi-pitch style recommendation without elite grades.",
        personalityTags: ["Adventure mindset", "Tropical limestone", "Confidence builder"],
        decisionHint:
          "Pick this when you want a Railay/Tonsai recommendation with journey energy.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area source only; route metadata needs stronger route-specific verification."
          }
        ],
        images: [],
        editorialTips: [
          "Treat tropical multi-pitch cards as style guidance, not logistics.",
          "Do not add approach, descent, tide, or pitch details."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "lord-of-the-thais-railay-tonsai",
        name: "Lord of the Thais",
        grade: "7b metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Steep tropical limestone sport climbing with iconic name recognition.",
        summary:
          "A harder Railay/Tonsai route-name seed used for sport-climbing recommendations while source quality is improved.",
        practiceFocus: ["power endurance", "steep limestone", "project pacing"],
        bestFor:
          "Advanced sport climbers looking for a harder Railay/Tonsai style card.",
        personalityTags: ["Power endurance", "Tropical limestone", "Sport journey"],
        decisionHint:
          "Pick this when you want the Thai limestone suggestion to feel physical and steep.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area source only; route-specific facts should be verified before richer content."
          }
        ],
        images: [],
        editorialTips: [
          "Hard sport cards stay high-level until route-specific source packs are added.",
          "No beta or user ratings are seeded."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "groove-tube-railay-tonsai",
        name: "Groove Tube",
        grade: "6a metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Accessible Railay/Tonsai limestone sport climbing.",
        summary:
          "A friendlier Thai limestone seed card so the route finder can suggest something approachable.",
        practiceFocus: ["confidence", "limestone basics", "lead rhythm"],
        bestFor:
          "Climbers who want a lighter Railay/Tonsai sport-climbing style card.",
        personalityTags: ["Confidence builder", "Tropical limestone", "Style sampler"],
        decisionHint:
          "Pick this when you want warm-weather limestone without a limit-project mood.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area source only; route-specific metadata needs a stronger source."
          }
        ],
        images: [],
        editorialTips: [
          "Approachable route cards help pick the day style, not replace local route info.",
          "Keep demo cards free of guidebook wording."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "defile-exit-railay-tonsai",
        name: "Defile Exit",
        grade: "6a metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Moderate tropical limestone sport climbing with compact route character.",
        summary:
          "A Railay/Tonsai seed card for easier sport-style recommendations and variety.",
        practiceFocus: ["movement flow", "confidence", "warm-weather pacing"],
        bestFor:
          "Climbers asking the quiz for an easier Thai limestone route flavor.",
        personalityTags: ["Confidence builder", "Tropical limestone", "Style sampler"],
        decisionHint:
          "Pick this when you want a moderate, low-drama sport-climbing suggestion.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area context only; route facts should be strengthened later."
          }
        ],
        images: [],
        editorialTips: [
          "Tropical heat and conditions are not covered by this seed data.",
          "Use current local sources before any real route plan."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "the-king-and-i-railay-tonsai",
        name: "The King and I",
        grade: "6c metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Steeper Railay/Tonsai sport climbing for intermediate progression.",
        summary:
          "A mid-grade Thai limestone route-name seed for climbers seeking a more athletic recommendation.",
        practiceFocus: ["power endurance", "route reading", "confidence"],
        bestFor:
          "Intermediate-to-advanced sport climbers comparing Thai limestone route styles.",
        personalityTags: ["Power endurance", "Tropical limestone", "Technique lab"],
        decisionHint:
          "Pick this when you want a sport route that feels like a step up.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area source only; route-specific metadata needs stronger verification."
          }
        ],
        images: [],
        editorialTips: [
          "This is a route-choice card, not a beta card.",
          "Future community notes should come from real user logs."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "massage-secrets-railay-tonsai",
        name: "Massage Secrets",
        grade: "7a metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Harder tropical limestone sport climbing with sustained character.",
        summary:
          "A higher-grade Railay/Tonsai route-name seed to support stronger sport-climbing quiz results.",
        practiceFocus: ["route endurance", "steep movement", "project discipline"],
        bestFor:
          "Sport climbers who want a harder tropical limestone recommendation.",
        personalityTags: ["Endurance quest", "Power endurance", "Tropical limestone"],
        decisionHint:
          "Pick this when the day calls for a stronger sport-climbing challenge.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area context only; needs route-specific source confirmation before launch."
          }
        ],
        images: [],
        editorialTips: [
          "For harder sport cards, keep the advice about training and mindset only.",
          "No route sequences or clip-by-clip information are included."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "make-a-way-railay-tonsai",
        name: "Make a Way",
        grade: "6b metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Moderate Railay/Tonsai limestone climbing for steady sport practice.",
        summary:
          "A conservative route-name seed that gives the atlas another approachable Thai limestone option.",
        practiceFocus: ["lead rhythm", "confidence", "movement economy"],
        bestFor:
          "Climbers who want a moderate, practice-oriented Railay/Tonsai suggestion.",
        personalityTags: ["Confidence builder", "Tropical limestone", "Technique lab"],
        decisionHint:
          "Pick this when your goal is a useful sport session rather than a headline route.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area source only; route-specific facts should be cross-checked later."
          }
        ],
        images: [],
        editorialTips: [
          "Use moderate recommendations to practice flow and consistency.",
          "This seed card should be upgraded with exact metadata later."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "wee-s-present-wall-route-line-railay-tonsai",
        name: "Wee's Present Wall route line",
        grade: "6a-7a metadata",
        type: "sport",
        length: "Single pitch metadata",
        style: "Railay/Tonsai limestone wall style with broad grade range.",
        summary:
          "A route-line placeholder for a known climbing wall context, included until exact route metadata is verified.",
        practiceFocus: ["route selection", "limestone reading", "confidence"],
        bestFor:
          "Climbers using the atlas to compare Thai limestone wall styles.",
        personalityTags: ["Style sampler", "Tropical limestone", "Confidence builder"],
        decisionHint:
          "Pick this when you want a general Railay/Tonsai wall-style recommendation.",
        sources: [
          {
            sourceLabel: "Wikipedia: Railay Beach climbing context",
            sourceUrl: "https://en.wikipedia.org/wiki/Railay_Beach",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "low",
            verifies: ["area context", "rock type", "climbing tourism"],
            notes:
              "Area context only; convert to exact route after stronger source review."
          }
        ],
        images: [],
        editorialTips: [
          "Route-line placeholders are temporary and should not be read as route instructions.",
          "Replace this card with exact verified route data when available."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["railay-tonsai-thailand"],
      ...v5PopularRouteAdditions["railay-tonsai-thailand"]
    ]
  },
  {
    slug: "grampians-australia",
    name: "Grampians",
    country: "Australia",
    latitude: -37.1414,
    longitude: 142.5195,
    climbingTypes: ["sport", "trad", "boulder"],
    rockType: "Sandstone",
    bestSeasons: ["Spring", "Fall"],
    difficultyRange: "V0 - V15 / 5.6 - 5.14",
    beginnerFriendly: true,
    description:
      "A broad sandstone region with boulders, cliffs, and wild scenery across many climbing styles.",
    guideContent: popularDestinationGuides["grampians-australia"],
    externalResources: popularDestinationResources["grampians-australia"],
    routes: [
      {
        id: "the-wheel-of-life-grampians",
        name: "The Wheel of Life",
        grade: "8C / V15 or 35 / 9a discussion",
        type: "boulder",
        length: "21 m roof traverse metadata",
        style:
          "A long Hollow Mountain Cave roof link-up that sits between bouldering power and route-style endurance.",
        summary:
          "One of the best-known hard Grampians testpieces, useful in ClimbAtlas as a pure endurance-versus-power decision point.",
        practiceFocus: ["long power-endurance", "rest strategy", "mental pacing"],
        bestFor:
          "Elite climbers comparing very long bouldering links with sport-style effort.",
        personalityTags: ["Endurance myth", "Roof quest", "Grade discussion"],
        decisionHint:
          "Choose this when your goal is a sustained, historic roof challenge rather than a short-limit boulder.",
        sources: [
          {
            sourceLabel: "Wikipedia: The Wheel of Life",
            sourceUrl: "https://en.wikipedia.org/wiki/The_Wheel_of_Life",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "high",
            verifies: ["name", "location", "grade discussion", "length", "firstAscent"],
            notes:
              "Strong public summary for basic facts; ClimbAtlas does not copy route beta or movement descriptions."
          },
          {
            sourceLabel: "Wikipedia: Grampians National Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Grampians_National_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["area context", "notability", "grade"],
            notes:
              "Area-level source listing The Wheel of Life as a notable Grampians climb."
          }
        ],
        images: [],
        editorialTips: [
          "Treat the route as a decision about sustained output and patience, not just peak pull strength.",
          "Because grade opinions vary, use the range as a context signal rather than a promise."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "sleepy-rave-grampians",
        name: "Sleepy Rave",
        grade: "8B-8C discussion / V13-V15 discussion",
        type: "boulder",
        length: "Long cave link metadata",
        style:
          "A major Hollow Mountain Cave link with a reputation shaped by grade discussion and endurance demands.",
        summary:
          "A good ClimbAtlas recommendation when someone wants the Grampians roof-cave feeling without jumping straight to the full Wheel of Life story.",
        practiceFocus: ["link-up stamina", "composure", "power recovery"],
        bestFor:
          "Advanced climbers interested in hard cave links and historical grade context.",
        personalityTags: ["Cave link", "Historic testpiece", "Grade debate"],
        decisionHint:
          "Pick this when you want a famous Grampians link-up where managing effort matters as much as single moves.",
        sources: [
          {
            sourceLabel: "Wikipedia: The Wheel of Life",
            sourceUrl: "https://en.wikipedia.org/wiki/The_Wheel_of_Life",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "location", "grade history", "style context"],
            notes:
              "Mentions Sleepy Rave as a Koyamada link-up related to the full Hollow Mountain Cave roof system."
          },
          {
            sourceLabel: "Wikipedia: Dai Koyamada",
            sourceUrl: "https://en.wikipedia.org/wiki/Dai_Koyamada",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "area", "first ascent context", "grade discussion"],
            notes:
              "Useful for basic metadata, but the route should receive stronger specialist sources later."
          }
        ],
        images: [],
        editorialTips: [
          "Use this card as a style filter: long link, high tension, and lots of patience.",
          "If you prefer clean single cruxes, this may feel more like a campaign than a quick try."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "sleepy-hollow-grampians",
        name: "Sleepy Hollow",
        grade: "V12 / 8A+ metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A Hollow Mountain Cave component problem linked to the larger Wheel of Life roof system.",
        summary:
          "A focused way to understand the cave's hard bouldering character without treating the full link-up as the only story.",
        practiceFocus: ["roof body tension", "specific power", "section rehearsal"],
        bestFor:
          "Strong boulderers who want a sharper Grampians cave objective than an all-day link.",
        personalityTags: ["Roof component", "Power puzzle", "Cave classic"],
        decisionHint:
          "Choose this when you want a hard boulder-sized objective inside the bigger Hollow Mountain narrative.",
        sources: [
          {
            sourceLabel: "Wikipedia: The Wheel of Life",
            sourceUrl: "https://en.wikipedia.org/wiki/The_Wheel_of_Life",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location context"],
            notes:
              "Lists Sleepy Hollow as one of the cave problems connected to the Wheel of Life link-up."
          }
        ],
        images: [],
        editorialTips: [
          "Think in terms of quality attempts and rest, not volume for volume's sake.",
          "This is still a single-source card and should be upgraded with stronger local references later."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "cave-man-grampians",
        name: "Cave Man",
        grade: "V9 / 7C metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A named Hollow Mountain Cave problem that helps map the cave's linked roof structure.",
        summary:
          "Useful as a lower-grade entry in the Hollow Mountain set, especially for comparing how the cave problems build into longer links.",
        practiceFocus: ["roof movement", "precision", "attempt pacing"],
        bestFor:
          "Boulderers curious about the cave's historic web of problems without only chasing the hardest names.",
        personalityTags: ["Cave primer", "Roof movement", "Historic component"],
        decisionHint:
          "Pick this when you want a more approachable cave reference point in a very hard venue.",
        sources: [
          {
            sourceLabel: "Wikipedia: The Wheel of Life",
            sourceUrl: "https://en.wikipedia.org/wiki/The_Wheel_of_Life",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location context"],
            notes:
              "Lists Cave Man as one of the Hollow Mountain Cave problems linked by the larger roof traverse."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a style checkpoint for cave body position and patient tries.",
          "The card is route metadata only; it intentionally avoids movement sequence or beta."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "dead-cant-dance-grampians",
        name: "Dead Can't Dance",
        grade: "V11 / 8A metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A harder Hollow Mountain Cave component problem within the cave's famous linked roof circuit.",
        summary:
          "A good fit for climbers who want a crisp high-end cave objective with historic context but less sprawl than the longest links.",
        practiceFocus: ["contact strength", "try quality", "fatigue control"],
        bestFor:
          "Advanced boulderers looking for a named component in the Grampians roof-cave story.",
        personalityTags: ["Cave component", "Finger power", "Historic link"],
        decisionHint:
          "Choose this when your day calls for focused cave power rather than a full endurance saga.",
        sources: [
          {
            sourceLabel: "Wikipedia: The Wheel of Life",
            sourceUrl: "https://en.wikipedia.org/wiki/The_Wheel_of_Life",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location context"],
            notes:
              "Lists Dead Can't Dance as one of the problems connected to the Wheel of Life link-up."
          }
        ],
        images: [],
        editorialTips: [
          "Plan attempts around freshness; hard cave climbing often rewards fewer better tries.",
          "This card needs a second independent source before it should be treated as fully robust."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "rave-heart-grampians",
        name: "Rave Heart",
        grade: "V8 / 7B-7B+ metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A Hollow Mountain Cave problem known through its relationship to the Wheel of Life roof system.",
        summary:
          "A helpful recommendation for climbers who want the cave atmosphere at a lower difficulty than the elite link-ups.",
        practiceFocus: ["movement confidence", "roof pacing", "skin management"],
        bestFor:
          "Boulderers building toward harder Grampians cave lines or comparing roof styles.",
        personalityTags: ["Cave entry", "Style builder", "Historic component"],
        decisionHint:
          "Pick this when you want a recognizable cave objective without committing to the highest grades.",
        sources: [
          {
            sourceLabel: "Wikipedia: The Wheel of Life",
            sourceUrl: "https://en.wikipedia.org/wiki/The_Wheel_of_Life",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "location context"],
            notes:
              "Lists Rave Heart as part of the linked cave system; add local source review later."
          }
        ],
        images: [],
        editorialTips: [
          "Use it as a confidence and movement-quality target rather than just a number.",
          "This is an area-context recommendation, not a route-instruction card."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "groove-train-grampians",
        name: "Groove Train",
        grade: "33 / 5.14b metadata",
        type: "sport",
        length: "Single-pitch sport metadata",
        style:
          "A hard Grampians sport reference point, useful for climbers comparing the region beyond bouldering.",
        summary:
          "This card keeps the atlas honest that Grampians is not only cave bouldering; it also has serious roped climbing history.",
        practiceFocus: ["technical endurance", "outdoor composure", "project judgment"],
        bestFor:
          "Sport climbers who want a high-end Grampians landmark for future research.",
        personalityTags: ["Sport landmark", "Technical quest", "Needs review"],
        decisionHint:
          "Choose this when you are comparing high-end roped goals rather than boulder links.",
        sources: [
          {
            sourceLabel: "Wikipedia: Grampians National Park",
            sourceUrl: "https://en.wikipedia.org/wiki/Grampians_National_Park",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "area notability"],
            notes:
              "Area-level source names Groove Train as a notable route; route-specific sources should be added before expanding details."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a high-level goal marker until stronger route-specific sources are added.",
          "No approach, clipping, or protection information is included by design."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "serpentine-grampians",
        name: "Serpentine",
        grade: "29 / 5.13d metadata",
        type: "sport",
        length: "Single-pitch sport metadata",
        style:
          "A Taipan Wall-style sport objective represented here as a low-trust metadata placeholder.",
        summary:
          "Included to broaden the Grampians route menu, but deliberately marked as needing stronger source confirmation.",
        practiceFocus: ["source review", "technical endurance", "style comparison"],
        bestFor:
          "Climbers using ClimbAtlas as a shortlist, then verifying details through current local resources.",
        personalityTags: ["Needs stronger source", "Sport reference", "Research card"],
        decisionHint:
          "Pick this only as a research prompt until the source pack is strengthened.",
        sources: [
          {
            sourceLabel: "ClimbAtlas manual metadata placeholder",
            sourceUrl: "https://en.wikipedia.org/wiki/Grampians_National_Park",
            lastChecked: "2026-06-10",
            type: "route-database-metadata",
            trustLevel: "low",
            verifies: ["area context"],
            notes:
              "Single-source placeholder using public area context only; grade and exact route metadata need stronger independent confirmation."
          }
        ],
        images: [],
        editorialTips: [
          "Treat this as a candidate for future verification, not a finished recommendation.",
          "Do not use this card for route logistics; ClimbAtlas is intentionally not a guidebook."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["grampians-australia"],
      ...v6PopularRouteAdditions["grampians-australia"]
    ]
  },
  {
    slug: "rocklands-south-africa",
    name: "Rocklands",
    country: "South Africa",
    latitude: -32.1296,
    longitude: 19.0709,
    climbingTypes: ["boulder"],
    rockType: "Sandstone",
    bestSeasons: ["Winter"],
    difficultyRange: "V0 - V16",
    beginnerFriendly: true,
    description:
      "A world-class sandstone bouldering area with orange blocs, crisp winter conditions, and open views.",
    guideContent: popularDestinationGuides["rocklands-south-africa"],
    externalResources: popularDestinationResources["rocklands-south-africa"],
    routes: [
      {
        id: "monkey-wedding-rocklands",
        name: "Monkey Wedding",
        grade: "8C / V15",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A benchmark Rocklands hard boulder tied to early 8C history and Fred Nicole's development of the grade.",
        summary:
          "A high-trust Rocklands reference for climbers who want a historically heavy objective, not just another hard number.",
        practiceFocus: ["limit bouldering", "attempt discipline", "historical context"],
        bestFor:
          "Elite boulderers comparing famous 8C milestones and the feel of Rocklands sandstone.",
        personalityTags: ["Grade milestone", "Historic testpiece", "Limit focus"],
        decisionHint:
          "Choose this when you want your route shortlist to lean toward history, pressure, and pure bouldering intensity.",
        sources: [
          {
            sourceLabel: "Wikipedia: Fred Nicole",
            sourceUrl: "https://en.wikipedia.org/wiki/Fred_Nicole",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "high",
            verifies: ["name", "grade", "area", "first ascent context"],
            notes:
              "Public source for basic milestone context; ClimbAtlas adds only original decision-focused commentary."
          },
          {
            sourceLabel: "Wikipedia: List of grade milestones in rock climbing",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "high",
            verifies: ["name", "grade", "area", "historical significance"],
            notes:
              "Lists Monkey Wedding as an early consensus 8C boulder in Rocklands."
          }
        ],
        images: [],
        editorialTips: [
          "This is a route for days when you want one serious objective, not a big circuit.",
          "Use the history as motivation, but let conditions and recovery decide attempt quality."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "black-eagle-sds-rocklands",
        name: "Black Eagle SDS",
        grade: "8C / V15",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A hard Rocklands sit-start benchmark associated with the same early 8C milestone era as Monkey Wedding.",
        summary:
          "A serious choice for climbers who like powerful sit-start problems with a strong historical signal.",
        practiceFocus: ["start power", "tension", "high-quality rests"],
        bestFor:
          "Elite boulderers comparing Rocklands' hardest classic-era problems.",
        personalityTags: ["Sit-start power", "Grade milestone", "Hard sandstone"],
        decisionHint:
          "Pick this when you want a compact, demanding boulder objective rather than a wandering circuit day.",
        sources: [
          {
            sourceLabel: "Wikipedia: Fred Nicole",
            sourceUrl: "https://en.wikipedia.org/wiki/Fred_Nicole",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "high",
            verifies: ["name", "grade", "area", "first ascent context"],
            notes:
              "Public milestone source for basic facts; no beta or route description copied."
          },
          {
            sourceLabel: "Wikipedia: List of grade milestones in rock climbing",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "high",
            verifies: ["name", "grade", "area", "historical significance"],
            notes:
              "Lists Black Eagle SDS as an early consensus 8C boulder in Rocklands."
          }
        ],
        images: [],
        editorialTips: [
          "A sit-start benchmark rewards freshness, body tension, and emotional patience.",
          "Keep expectations flexible: elite boulders often feel very condition-dependent."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "livin-large-rocklands",
        name: "Livin' Large",
        grade: "8C / V15 to 8C+ / V16 discussion",
        type: "boulder",
        length: "Highball boulder metadata",
        style:
          "A famous Rocklands highball with grade discussion and a strong reputation for commitment.",
        summary:
          "The atlas treats this as a decision about headspace as much as difficulty: choose it only when the mental side is part of the appeal.",
        practiceFocus: ["highball composure", "risk judgment", "grade perspective"],
        bestFor:
          "Experienced highball boulderers who want a famous, psychologically serious objective.",
        personalityTags: ["Highball nerve", "Grade discussion", "Commitment test"],
        decisionHint:
          "Choose this when you are actively seeking a heady, high-stakes bouldering experience.",
        sources: [
          {
            sourceLabel: "Wikipedia: List of grade milestones in rock climbing",
            sourceUrl:
              "https://en.wikipedia.org/wiki/List_of_grade_milestones_in_rock_climbing",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "high",
            verifies: ["name", "area", "grade discussion", "first ascent"],
            notes:
              "Lists first ascent and later grade discussion; ClimbAtlas does not reproduce any climbing beta."
          }
        ],
        images: [],
        editorialTips: [
          "Treat this as a mental-readiness choice, not simply an 8C or 8C+ label.",
          "If you are tired, distracted, or unsure about conditions, pick a lower-consequence objective."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "golden-shadow-rocklands",
        name: "Golden Shadow",
        grade: "8B+ / V14 metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A hard Rocklands boulder from the Fred Nicole era, useful as a benchmark below the 8C headline problems.",
        summary:
          "A strong shortlist option for climbers who want a famous hard Rocklands problem without selecting the absolute hardest milestones.",
        practiceFocus: ["precision", "finger strength", "project pacing"],
        bestFor:
          "Advanced boulderers comparing 8B+ Rocklands targets with recognizable history.",
        personalityTags: ["Hard classic", "Fred Nicole era", "Project rhythm"],
        decisionHint:
          "Pick this when you want a serious Rocklands project that still leaves room for style exploration.",
        sources: [
          {
            sourceLabel: "Wikipedia it: Fred Nicole",
            sourceUrl: "https://it.wikipedia.org/wiki/Fred_Nicole",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "area", "first ascent context"],
            notes:
              "Italian-language public source lists Golden Shadow among Nicole's Rocklands first ascents; add a specialist source later."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a high-end project rhythm card: warm up well, choose fewer better attempts.",
          "Source pack is still thin, so keep it as a shortlist item pending stronger verification."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "amandla-rocklands",
        name: "Amandla",
        grade: "8B+ / V14 metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A notable hard Rocklands boulder represented as a medium-trust metadata card.",
        summary:
          "A ClimbAtlas choice for climbers drawn to famous hard sandstone problems but still building a verified source pack.",
        practiceFocus: ["specific strength", "patience", "conditions awareness"],
        bestFor:
          "Advanced boulderers using the atlas to compare hard Rocklands candidates.",
        personalityTags: ["Hard sandstone", "Needs second source", "Project card"],
        decisionHint:
          "Choose this as a research-backed candidate, then verify current details before planning around it.",
        sources: [
          {
            sourceLabel: "Wikipedia it: Fred Nicole",
            sourceUrl: "https://it.wikipedia.org/wiki/Fred_Nicole",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "area", "first ascent context"],
            notes:
              "Single public source for basic metadata; should receive a second independent source."
          }
        ],
        images: [],
        editorialTips: [
          "Treat the card as a shortlist prompt until the source pack is stronger.",
          "For now, the useful information is style and decision context, not route instruction."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "mooiste-maise-rocklands",
        name: "Mooiste Maise",
        grade: "8B+ / V14 metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A hard Rocklands boulder from the early 2000s wave of Fred Nicole first ascents.",
        summary:
          "A good route-finder result for climbers who want classic hard Rocklands context with a clear need for stronger sourcing.",
        practiceFocus: ["finger recruitment", "session planning", "confidence"],
        bestFor:
          "Boulderers building a serious Rocklands wish list and comparing similar-grade objectives.",
        personalityTags: ["Hard classic", "Source-light", "Wishlist candidate"],
        decisionHint:
          "Pick this when you want a high-end Rocklands candidate but are comfortable doing extra source checking.",
        sources: [
          {
            sourceLabel: "Wikipedia it: Fred Nicole",
            sourceUrl: "https://it.wikipedia.org/wiki/Fred_Nicole",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "area", "first ascent context"],
            notes:
              "Single public metadata source; route-specific source strengthening is needed before adding richer context."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a comparison card alongside Golden Shadow and Amandla.",
          "Do not read this as beta; it is a decision helper and source trail."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "madiba-rocklands",
        name: "Madiba",
        grade: "8B+ / V14 metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "A hard Rocklands boulder included as part of the region's Fred Nicole-era metadata set.",
        summary:
          "A useful atlas entry for comparing high-end Rocklands problems while keeping source confidence visible.",
        practiceFocus: ["project selection", "power maintenance", "skin care"],
        bestFor:
          "Advanced climbers narrowing a Rocklands list before checking current local resources.",
        personalityTags: ["Source-light", "Hard sandstone", "Project shortlist"],
        decisionHint:
          "Choose this when you are building a serious shortlist, then confirm current details through stronger sources.",
        sources: [
          {
            sourceLabel: "Wikipedia it: Fred Nicole",
            sourceUrl: "https://it.wikipedia.org/wiki/Fred_Nicole",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "area", "first ascent context"],
            notes:
              "Single-source route metadata; marked medium because the source is public but not route-specialist."
          }
        ],
        images: [],
        editorialTips: [
          "Use this as a comparison point, not as a final planning source.",
          "Later community notes can help explain who this style suits, without copying guidebook beta."
        ],
        communityStatus: "coming-soon"
      },
      {
        id: "oliphants-dawn-rocklands",
        name: "Oliphants Dawn",
        grade: "8B+ / V14 metadata",
        type: "boulder",
        length: "Boulder problem metadata",
        style:
          "An earlier Rocklands hard boulder entry that helps show the region's development before the 8C milestone problems.",
        summary:
          "A historically interesting pick for climbers who want to compare older hard Rocklands benchmarks with later headline routes.",
        practiceFocus: ["history awareness", "movement variety", "project patience"],
        bestFor:
          "Boulderers who like routes with development-history context, not only grade chasing.",
        personalityTags: ["Early benchmark", "History thread", "Source-light"],
        decisionHint:
          "Pick this when you want your Rocklands list to include older benchmark context, then verify current details separately.",
        sources: [
          {
            sourceLabel: "Wikipedia it: Fred Nicole",
            sourceUrl: "https://it.wikipedia.org/wiki/Fred_Nicole",
            lastChecked: "2026-06-10",
            type: "open-encyclopedia",
            trustLevel: "medium",
            verifies: ["name", "grade", "area", "first ascent context"],
            notes:
              "Public metadata source only; stronger source pack should be added before expanding the route card."
          }
        ],
        images: [],
        editorialTips: [
          "A good choice when your goal is historical comparison rather than only maximum difficulty.",
          "Keep the card honest: this is not enough source depth for detailed route content yet."
        ],
        communityStatus: "coming-soon"
      }
    ,
      ...popularRouteAdditions["rocklands-south-africa"],
      ...v6PopularRouteAdditions["rocklands-south-africa"]
    ]
  }
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function getRouteById(destinationSlug: string, routeId: string) {
  const destination = getDestinationBySlug(destinationSlug);
  const canonicalRouteId = resolveRouteId(destinationSlug, routeId);

  return destination?.routes?.find((route) => route.id === canonicalRouteId);
}

const routeExternalLinkOverrides: Record<string, ExternalResource[]> = {
  // Add hand-checked exact route or guidebook links here as
  // "destinationSlug:routeId" when a route needs a manual upgrade.
};

function normalizeRouteNameForLinkMatch(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function inferExternalLinkStatus(
  resource: Pick<ExternalResource, "type" | "url" | "linkStatus">
): ExternalLinkStatus | undefined {
  if (resource.linkStatus) {
    return resource.linkStatus;
  }

  if (/mountainproject\.com\/route\//i.test(resource.url)) {
    return "route-specific";
  }

  if (resource.type === "guidebook/resource") {
    return "guidebook-specific";
  }

  if (
    resource.type === "route-database" ||
    /mountainproject\.com\/area\//i.test(resource.url)
  ) {
    return "needs-upgrade";
  }

  return undefined;
}

function resourceFromRouteSource(route: RouteHighlight): ExternalResource[] {
  const resources: ExternalResource[] = [];

  for (const routeSource of route.sources) {
    const inferredStatus = inferExternalLinkStatus({
      type: "route-database",
      url: routeSource.sourceUrl
    });

    if (inferredStatus === "route-specific") {
      resources.push({
        title: routeSource.sourceLabel,
        url: routeSource.sourceUrl,
        type: "route-database",
        linkStatus: inferredStatus,
        description: {
          en: "Exact external route page for current metadata and local updates. ClimbAtlas links out without copying route beta.",
          zh: "精确外部线路页，用于查看当前元数据和本地更新。ClimbAtlas 只做导流，不复制路线 beta。"
        }
      });
    }
  }

  return resources;
}

function metadataResourcesForRoute(
  destinationSlug: string,
  route: RouteHighlight
): ExternalResource[] {
  const metadataRoutes = metadataRoutesByDestination[destinationSlug] ?? [];
  const routeName = normalizeRouteNameForLinkMatch(route.name);

  return metadataRoutes
    .filter(
      (metadataRoute) =>
        metadataRoute.id === route.id ||
        normalizeRouteNameForLinkMatch(metadataRoute.name) === routeName
    )
    .flatMap((metadataRoute) => metadataRoute.externalResources ?? [])
    .filter((resource) => {
      const status = inferExternalLinkStatus(resource);
      return status === "route-specific" || status === "guidebook-specific";
    })
    .map((resource) => ({
      ...resource,
      linkStatus: inferExternalLinkStatus(resource)
    }));
}

function dedupeExternalResources(resources: ExternalResource[]) {
  const seen = new Set<string>();

  return resources.filter((resource) => {
    const key = `${resource.url}::${resource.title}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function upgradeRouteExternalResources(
  destinationSlug: string,
  route: RouteHighlight
): RouteHighlight {
  const manualResources =
    routeExternalLinkOverrides[`${destinationSlug}:${route.id}`] ?? [];
  const sourceResources = resourceFromRouteSource(route);
  const metadataResources = metadataResourcesForRoute(destinationSlug, route);
  const currentResources = (route.externalResources ?? []).map((resource) => ({
    ...resource,
    linkStatus: inferExternalLinkStatus(resource)
  }));
  const exactResources = [
    ...manualResources,
    ...metadataResources,
    ...sourceResources
  ].map((resource) => ({
    ...resource,
    linkStatus: inferExternalLinkStatus(resource)
  }));

  const externalResources = dedupeExternalResources([
    ...exactResources,
    ...currentResources
  ]);

  if (externalResources.length === 0) {
    return route;
  }

  return {
    ...route,
    externalResources
  };
}

for (const destination of destinations) {
  const contextSource = v2SourcePacks[destination.slug];

  if (!contextSource || !destination.routes) {
    continue;
  }

  destination.routes = destination.routes.map((route) => {
    if (route.sources.length >= 2) {
      return route;
    }

    return {
      ...route,
      sources: [
        ...route.sources,
        source(
          contextSource.contextLabel,
          contextSource.contextUrl,
          contextSource.contextType,
          contextSource.contextType === "official" ? "high" : "medium",
          ["area context", "access context"],
          "V2.1 context source added to avoid single-source presentation. This verifies destination/access context, not copied route beta."
        )
      ]
    };
  });
}

for (const destination of destinations) {
  if (!destination.routes) {
    continue;
  }

  destination.routes = destination.routes.map((route) =>
    upgradeRouteExternalResources(destination.slug, route)
  );
}

for (const destination of destinations) {
  const metadataRoutes = metadataRoutesByDestination[destination.slug] ?? [];

  if (metadataRoutes.length === 0) {
    continue;
  }

  const existingRouteIds = new Set(
    (destination.routes ?? []).map((route) => route.id)
  );
  const existingRouteNames = new Set(
    (destination.routes ?? []).map((route) =>
      normalizeRouteNameForLinkMatch(route.name)
    )
  );
  const newRoutes = metadataRoutes.filter(
    (route) =>
      !existingRouteIds.has(route.id) &&
      !existingRouteNames.has(normalizeRouteNameForLinkMatch(route.name))
  );

  destination.routes = [...(destination.routes ?? []), ...newRoutes];
}
