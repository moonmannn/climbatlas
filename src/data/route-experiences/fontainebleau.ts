import {
  defineRouteExperience,
  defineRouteReference,
  editoriallyReviewed,
  sourceBacked,
  type RouteExperienceOverlay
} from "@/data/route-experiences/types";

const marieRose = defineRouteReference({
  label: "Bleau.info: La Marie-Rose",
  provider: "local-source",
  sourceUrl: "https://bleau.info/cuvier/2128.html?locale=en",
  verifiedFields: ["name", "grade", "sector", "terrain", "route-character"]
});

const cortomaltese = defineRouteReference({
  label: "Bleau.info: Cortomaltese",
  provider: "local-source",
  sourceUrl: "https://bleau.info/cuvier/1065.html?locale=en",
  verifiedFields: ["name", "grade", "sector", "terrain", "route-character"]
});

const leJoker = defineRouteReference({
  label: "theCrag: La Joker",
  provider: "thecrag",
  sourceUrl: "https://www.thecrag.com/en/climbing/france/fontainebleau/route/518715171",
  verifiedFields: ["name", "grade", "sector", "history", "route-character"]
});

const laBaleine = defineRouteReference({
  label: "Bleau.info: La Baleine",
  provider: "local-source",
  sourceUrl: "https://bleau.info/petit/741.html?locale=en",
  verifiedFields: ["name", "grade", "sector", "terrain", "route-character"]
});

const magicBus = defineRouteReference({
  label: "Bleau.info: Magic Bus",
  provider: "local-source",
  sourceUrl: "https://bleau.info/y/686.html?locale=en",
  verifiedFields: ["name", "grade", "sector", "terrain", "route-character"]
});

const beatleJuice = defineRouteReference({
  label: "Bleau.info: Beatle Juice",
  provider: "local-source",
  sourceUrl: "https://bleau.info/cretesud/476.html?locale=en",
  verifiedFields: ["name", "grade", "sector", "terrain", "route-character"]
});

const rainbowRocket = defineRouteReference({
  label: "Mountain Project: Rainbow Rocket",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/123838667/rainbow-rocket",
  verifiedFields: ["name", "grade", "type", "sector", "route-character"]
});

const bigIsland = defineRouteReference({
  label: "Bleau.info: The Big Island",
  provider: "local-source",
  sourceUrl: "https://bleau.info/coquibus/19319.html?locale=en",
  verifiedFields: ["name", "grade", "sector", "terrain", "route-character"]
});

export const fontainebleauRouteExperiences: RouteExperienceOverlay[] = [
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "la-marie-rose-fontainebleau",
    sources: [marieRose],
    editorial: {
      summary: {
        en: "A compact Bas Cuvier problem where balance and contact with rounded features matter more than steep pulling.",
        zh: "一条位于 Bas Cuvier 的紧凑抱石；重点不是陡壁发力，而是平衡和对圆润岩点的控制。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a moderate-grade reference for Fontainebleau's precise, friction-led side.",
        zh: "如果你想用一条中等难度线路认识枫丹白露讲究精准与摩擦力的一面，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy measured footwork, body position, and learning from small changes in balance.",
        zh: "适合喜欢细致脚法、身体位置，以及从微小重心变化中寻找答案的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its short format does not make the movement immediately obvious.",
          zh: "线路很短，但动作逻辑未必会立刻显现。"
        },
        {
          en: "Use current forest resources for conditions and local climbing etiquette.",
          zh: "岩石状态与当地攀登规范，请查看森林的最新资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", marieRose),
        terrain: sourceBacked(["face"], marieRose),
        movementTendency: editoriallyReviewed(["technical", "balance"], marieRose),
        difficultyShape: editoriallyReviewed("single-crux", marieRose)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("balance", marieRose),
        secondaryDemand: editoriallyReviewed("footwork", marieRose),
        cruxPattern: editoriallyReviewed("distinct-crux", marieRose),
        sustainedness: editoriallyReviewed("low", marieRose)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "cortomaltese-fontainebleau",
    sources: [cortomaltese],
    editorial: {
      summary: {
        en: "A short Bas Cuvier problem built around rounded holds and careful control rather than a long sequence.",
        zh: "一条 Bas Cuvier 的短线路，核心在圆润把手与细致控制，而不是很长的动作串。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a focused session on tension, balance, and committing to a small number of decisions.",
        zh: "如果你想在少量关键选择中练习身体张力、平衡和果断执行，它很适合作为明确目标。"
      },
      bestForText: {
        en: "Boulderers who prefer technical problem-solving over accumulating many moves.",
        zh: "适合偏爱技术解题，而不是靠大量动作堆积难度的抱石者。"
      },
      thingsToConsider: [
        {
          en: "Rounded holds can make conditions part of the decision even when the grade looks familiar.",
          zh: "即使难度看起来熟悉，圆润把手也会让岩石状态成为重要变量。"
        },
        {
          en: "Check the linked route page and current forest guidance before visiting.",
          zh: "前往前请查看单线路页面与森林最新指引。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", cortomaltese),
        terrain: sourceBacked(["face"], cortomaltese),
        movementTendency: editoriallyReviewed(["technical", "balance"], cortomaltese),
        difficultyShape: editoriallyReviewed("single-crux", cortomaltese)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", cortomaltese),
        secondaryDemand: editoriallyReviewed("balance", cortomaltese),
        cruxPattern: editoriallyReviewed("distinct-crux", cortomaltese),
        sustainedness: editoriallyReviewed("low", cortomaltese)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "le-joker-fontainebleau",
    sources: [leJoker],
    editorial: {
      summary: {
        en: "A historically important Bas Cuvier problem that asks for deliberate positioning on a compact wall.",
        zh: "一条具有历史意义的 Bas Cuvier 抱石，在紧凑岩面上强调有意识的身体位置。"
      },
      whyItStandsOut: {
        en: "Consider it when climbing history adds meaning to a technical session, without turning the day into an elite project.",
        zh: "如果攀岩历史会让一次技术练习更有意义，同时你又不想把当天变成精英级项目，可以看看它。"
      },
      bestForText: {
        en: "Climbers who enjoy precise movement and comparing an old benchmark with modern grading language.",
        zh: "适合喜欢精准动作，也愿意用现代难度语言重新理解历史标杆的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Historical grades and modern grades are context, not a promise that the problem will feel familiar.",
          zh: "历史难度与现代难度都只是背景，不代表这条线路会让你觉得熟悉。"
        },
        {
          en: "Use the exact route link for current route information.",
          zh: "最新线路信息请查看精确线路链接。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", leJoker),
        terrain: editoriallyReviewed(["face"], leJoker),
        movementTendency: editoriallyReviewed(["technical", "balance"], leJoker),
        difficultyShape: editoriallyReviewed("single-crux", leJoker)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", leJoker),
        secondaryDemand: editoriallyReviewed("footwork", leJoker),
        cruxPattern: editoriallyReviewed("distinct-crux", leJoker)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "la-baleine-fontainebleau",
    sources: [laBaleine],
    editorial: {
      summary: {
        en: "A prow-shaped problem where rounded features make whole-body positioning more relevant than raw pull count.",
        zh: "一条沿岩石棱部展开的抱石；圆润岩点让全身位置比单纯计算拉力更重要。"
      },
      whyItStandsOut: {
        en: "Choose it when you want an advanced problem that rewards compression, balance, and adapting around a three-dimensional shape.",
        zh: "如果你想找一条奖励夹抱、平衡，以及适应立体岩形的进阶线路，可以考虑它。"
      },
      bestForText: {
        en: "Boulderers who like using opposing body tension and reading a line around an edge.",
        zh: "适合喜欢使用对抗张力，并沿岩石边缘阅读线路的抱石者。"
      },
      thingsToConsider: [
        {
          en: "Body dimensions can change which positions feel natural, so the grade is only one part of the comparison.",
          zh: "不同身材会改变自然的身体位置，因此难度只是比较的一部分。"
        },
        {
          en: "Confirm current conditions before climbing on sandstone.",
          zh: "在砂岩上攀爬前，请确认最新岩石状态。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("overhang", laBaleine),
        terrain: sourceBacked(["arete", "face"], laBaleine),
        movementTendency: editoriallyReviewed(["compression", "balance"], laBaleine),
        difficultyShape: editoriallyReviewed("variable", laBaleine)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("compression", laBaleine),
        secondaryDemand: editoriallyReviewed("balance", laBaleine),
        cruxPattern: editoriallyReviewed("multiple-cruxes", laBaleine),
        sustainedness: editoriallyReviewed("moderate", laBaleine)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "magic-bus-fontainebleau",
    sources: [magicBus],
    editorial: {
      summary: {
        en: "A roof problem that puts a more physical, compressed style beside Fontainebleau's better-known vertical tests.",
        zh: "一条屋檐型抱石，把更有身体张力的夹抱风格，放在枫丹白露常见的垂直技术题之外。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a clearly steep project and would rather manage tension than rely on delicate standing positions.",
        zh: "如果你想找一个明确陡峭的项目，并更愿意管理身体张力而不是细腻站立，可以比较它。"
      },
      bestForText: {
        en: "Boulderers who enjoy powerful compression and keeping their body organized under a roof.",
        zh: "适合喜欢力量夹抱，并能在屋檐下维持身体组织的抱石者。"
      },
      thingsToConsider: [
        {
          en: "This is a focused physical choice, not a representative sample of every Fontainebleau style.",
          zh: "它是一条风格集中的身体型线路，并不能代表枫丹白露的所有攀爬方式。"
        },
        {
          en: "Use the linked route page and local ethics guidance before visiting.",
          zh: "前往前请查看单线路页面与当地攀登规范。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("roof", magicBus),
        terrain: sourceBacked(["face"], magicBus),
        movementTendency: editoriallyReviewed(["powerful", "compression"], magicBus),
        difficultyShape: editoriallyReviewed("single-crux", magicBus)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power", magicBus),
        secondaryDemand: editoriallyReviewed("compression", magicBus),
        cruxPattern: editoriallyReviewed("distinct-crux", magicBus),
        sustainedness: editoriallyReviewed("moderate", magicBus)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "beatle-juice-fontainebleau",
    sources: [beatleJuice],
    editorial: {
      summary: {
        en: "An overhanging pocket problem that combines a physical start with a need to stay technically organized.",
        zh: "一条带洞穴把手的仰角抱石，把身体型开局与保持技术秩序放在同一道题里。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a compact advanced project that mixes power with enough detail to reward repeat attempts.",
        zh: "如果你想找一条紧凑的进阶项目，既有力量要求，也有值得反复琢磨的细节，可以考虑它。"
      },
      bestForText: {
        en: "Boulderers who like steep pocket climbing and switching quickly between force and precision.",
        zh: "适合喜欢陡峭洞穴把手，并能在力量与精准之间快速切换的抱石者。"
      },
      thingsToConsider: [
        {
          en: "The steep format makes it a different decision from nearby balance-led problems at a similar grade.",
          zh: "陡峭风格让它与附近同难度、但更偏平衡的线路形成不同选择。"
        },
        {
          en: "Check current sandstone conditions before any attempt.",
          zh: "尝试前请确认砂岩当前状态。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", beatleJuice),
        terrain: sourceBacked(["pockets", "face"], beatleJuice),
        movementTendency: editoriallyReviewed(["powerful", "technical"], beatleJuice),
        difficultyShape: editoriallyReviewed("single-crux", beatleJuice)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power", beatleJuice),
        secondaryDemand: editoriallyReviewed("technique", beatleJuice),
        cruxPattern: editoriallyReviewed("distinct-crux", beatleJuice),
        sustainedness: editoriallyReviewed("moderate", beatleJuice)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "rainbow-rocket-fontainebleau",
    sources: [rainbowRocket],
    editorial: {
      summary: {
        en: "A highly focused elite boulder where one dynamic objective defines the decision more than sustained climbing volume.",
        zh: "一条高度集中的精英抱石；决定是否选择它的，是一个动态目标，而不是持续动作量。"
      },
      whyItStandsOut: {
        en: "Consider it when you specifically want to test explosive coordination rather than compare another sustained strength problem.",
        zh: "如果你明确想测试爆发协调，而不是再找一条持续力量题，可以把它列入候选。"
      },
      bestForText: {
        en: "Elite boulderers who enjoy committing to a precise dynamic challenge and repeating a small number of high-quality attempts.",
        zh: "适合喜欢明确动态挑战，并愿意用少量高质量尝试反复校准的精英抱石者。"
      },
      thingsToConsider: [
        {
          en: "Its narrow challenge profile can make it feel very different from other problems at the same grade.",
          zh: "它的挑战画像很集中，因此可能与同难度的其他线路感觉完全不同。"
        },
        {
          en: "Use the external route page for current route information; ClimbAtlas does not publish the movement sequence.",
          zh: "最新线路信息请查看外部单线路页面；ClimbAtlas 不发布动作顺序。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", rainbowRocket),
        terrain: editoriallyReviewed(["face"], rainbowRocket),
        movementTendency: sourceBacked(["powerful", "precise-footwork"], rainbowRocket),
        difficultyShape: sourceBacked("single-crux", rainbowRocket)
      },
      challenge: {
        primaryDemand: sourceBacked("power", rainbowRocket),
        secondaryDemand: editoriallyReviewed("footwork", rainbowRocket),
        cruxPattern: sourceBacked("distinct-crux", rainbowRocket),
        sustainedness: editoriallyReviewed("low", rainbowRocket)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "fontainebleau-france",
    routeId: "the-big-island-fontainebleau",
    sources: [bigIsland],
    editorial: {
      summary: {
        en: "An elite prow problem where steepness, rounded holds, and sustained body tension combine into a long-form bouldering project.",
        zh: "一条精英级棱部抱石，把陡度、圆润把手与持续身体张力组合成长线项目。"
      },
      whyItStandsOut: {
        en: "Use it as a reference when comparing elite Fontainebleau projects that demand both power and sustained control.",
        zh: "比较同时需要力量与持续控制的枫丹白露精英项目时，它是一条清楚的参照线。"
      },
      bestForText: {
        en: "Elite boulderers seeking a compression-led project whose difficulty is spread across more than one isolated action.",
        zh: "适合寻找夹抱主导、且难度不只集中在单个动作上的精英抱石者。"
      },
      thingsToConsider: [
        {
          en: "This is firmly an elite project; DNA fit expresses preference, not readiness or likelihood of success.",
          zh: "这明确属于精英项目；DNA 匹配只表达偏好，不代表准备程度或成功概率。"
        },
        {
          en: "The sector has sensitive-use guidance; check the exact route page and current local rules before visiting.",
          zh: "所在区域有敏感使用要求，前往前请查看精确线路页与当地最新规则。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", bigIsland),
        terrain: sourceBacked(["arete", "face"], bigIsland),
        movementTendency: editoriallyReviewed(["compression", "powerful"], bigIsland),
        difficultyShape: editoriallyReviewed("sustained", bigIsland)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power-endurance", bigIsland),
        secondaryDemand: editoriallyReviewed("compression", bigIsland),
        cruxPattern: editoriallyReviewed("multiple-cruxes", bigIsland),
        sustainedness: editoriallyReviewed("high", bigIsland)
      }
    }
  })
];
