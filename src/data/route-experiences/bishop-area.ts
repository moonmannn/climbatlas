import { defineReviewedPick } from "@/data/route-experiences/reviewed-pick";
import type { RouteExperienceOverlay } from "@/data/route-experiences/types";

export const bishopAreaRouteExperiences: RouteExperienceOverlay[] = [
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-344f3919-efe0-5f54-b2b1-da8b81f0a50f",
    sourceLabel: "Mountain Project: Buttermilk Stem",
    sourceUrl: "https://www.mountainproject.com/route/106130698/buttermilk-stem",
    copy: {
      summary: {
        en: "A lower-grade boulder problem centered on stemming, balance, and deliberate body position.",
        zh: "一条较低难度的抱石线路，核心是对撑、平衡和有意识的身体位置。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a technical warm-up or a movement puzzle without chasing a high grade.",
        zh: "当你想用技术型热身或动作题开启一天，而不是追逐高难度时，可以考虑它。"
      },
      bestForText: {
        en: "Climbers practicing balance and opposition on vertical corner terrain.",
        zh: "适合在垂直转角地形上练习平衡与对抗发力的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its value as a choice comes from movement specificity, not grade alone.",
          zh: "这条线路的选择价值在于动作特点，而不只在难度数字。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["corner"],
      movementTendency: ["stemming", "balance"],
      difficultyShape: "sustained",
      primaryDemand: "balance",
      secondaryDemand: "technique",
      cruxPattern: "no-single-crux",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-5bbaac9f-a588-5df7-aa4c-901082d364d3",
    sourceLabel: "Mountain Project: Iron Man Traverse",
    sourceUrl: "https://www.mountainproject.com/route/105936763/iron-man-traverse",
    copy: {
      summary: {
        en: "A traversing boulder problem where movement economy matters over a longer sequence.",
        zh: "一条横移抱石线路，需要在较长的动作序列中维持动作经济性。"
      },
      whyItStandsOut: {
        en: "Compare it when endurance and route reading sound more useful than a short power test.",
        zh: "如果你更想检验耐力与读线，而不是一次短促发力，可以比较它。"
      },
      bestForText: {
        en: "Boulderers practicing pacing and efficient decisions across sustained movement.",
        zh: "适合在持续移动中练习节奏与动作取舍的抱石者。"
      },
      thingsToConsider: [
        {
          en: "A traverse can feel very different from an upright problem at the same grade.",
          zh: "同一难度下，横移与直上线路的体感可能明显不同。"
        }
      ]
    },
    profile: {
      wallAngle: "overhang",
      terrain: ["face"],
      movementTendency: ["endurance", "route-reading"],
      difficultyShape: "sustained",
      primaryDemand: "endurance",
      secondaryDemand: "route-reading",
      cruxPattern: "no-single-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-84c0eb59-034e-52f4-8409-9711128fd164",
    sourceLabel: "Mountain Project: Bowling Pin",
    sourceUrl: "https://www.mountainproject.com/route/105936179/bowling-pin",
    copy: {
      summary: {
        en: "A boulder problem that changes from steeper face movement to lower-angle finishing terrain.",
        zh: "一条从较陡岩面过渡到低角度收尾地形的抱石线路。"
      },
      whyItStandsOut: {
        en: "Consider it when you want one moderate problem with a clear change in angle and movement rhythm.",
        zh: "当你想在一条中等难度线路里体验明显的角度与节奏变化时，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy combining an initial power demand with a calmer technical finish.",
        zh: "适合喜欢先处理力量要求、再转入更从容技术收尾的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The two sections may reward different strengths even though they share one grade.",
          zh: "虽然共用一个难度，两部分可能分别奖励不同的能力。"
        }
      ]
    },
    profile: {
      wallAngle: "overhang",
      terrain: ["face"],
      movementTendency: ["powerful", "balance"],
      difficultyShape: "variable",
      primaryDemand: "power",
      secondaryDemand: "balance",
      cruxPattern: "multiple-cruxes",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-81ab6447-4b97-5330-a112-4640983442da",
    sourceLabel: "Mountain Project: Saigon",
    sourceUrl: "https://www.mountainproject.com/route/106022301/saigon",
    copy: {
      summary: {
        en: "A steep prow problem with a compact, power-focused character.",
        zh: "一条陡峭的岩脊抱石，整体紧凑，并明显偏向力量输出。"
      },
      whyItStandsOut: {
        en: "Compare it when you want a clear power objective rather than a long endurance problem.",
        zh: "如果你想找一条目标明确的力量线路，而不是长耐力问题，可以比较它。"
      },
      bestForText: {
        en: "Boulderers who enjoy forceful movement and controlling body position around an arete.",
        zh: "适合喜欢强力动作，并擅长在棱角周围控制身体位置的抱石者。"
      },
      thingsToConsider: [
        {
          en: "Power and compression preferences matter as much as the published grade.",
          zh: "你是否喜欢力量与压缩型动作，与公开难度同样值得考虑。"
        }
      ]
    },
    profile: {
      wallAngle: "overhang",
      terrain: ["arete"],
      movementTendency: ["powerful", "compression"],
      difficultyShape: "single-crux",
      primaryDemand: "power",
      secondaryDemand: "compression",
      cruxPattern: "distinct-crux",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-3a916f50-d0a2-590e-90db-9d3961778a8c",
    sourceLabel: "Mountain Project: High Plains Drifter",
    sourceUrl: "https://www.mountainproject.com/route/105908128/high-plains-drifter",
    copy: {
      summary: {
        en: "A face and arete problem that favors careful sequencing alongside strength.",
        zh: "一条岩面与棱角抱石，除了力量，也重视动作顺序和身体位置。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a harder problem that still rewards thoughtful movement choices.",
        zh: "当你想挑战更高难度，同时希望动作选择仍然重要时，可以考虑它。"
      },
      bestForText: {
        en: "Climbers comparing advanced projects that mix route reading with precise execution.",
        zh: "适合在比较进阶项目时，重视读线和准确执行的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Use current local resources for all on-site and condition decisions.",
          zh: "现场安排与岩面状态请以最新当地资料为准。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["face", "arete"],
      movementTendency: ["route-reading", "precise-footwork"],
      difficultyShape: "progressive",
      primaryDemand: "route-reading",
      secondaryDemand: "footwork",
      cruxPattern: "distinct-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-36fee01c-564d-5d7f-a6c5-6bd89edbb84f",
    sourceLabel: "Mountain Project: Soul Slinger",
    sourceUrl: "https://www.mountainproject.com/route/105908345/soul-slinger",
    copy: {
      summary: {
        en: "An arete problem where power and balance need to work together.",
        zh: "一条棱角抱石，需要力量与平衡协同发挥。"
      },
      whyItStandsOut: {
        en: "Compare it when you want a difficult project that is not explained by pulling strength alone.",
        zh: "当你想找一条不能只靠拉力解释的高难项目时，可以比较它。"
      },
      bestForText: {
        en: "Boulderers who enjoy powerful movement but still value controlled body position.",
        zh: "适合喜欢力量动作，同时重视身体控制的抱石者。"
      },
      thingsToConsider: [
        {
          en: "Your familiarity with arete movement may shape the experience more than the label suggests.",
          zh: "你对棱角动作的熟悉程度，可能比难度标签更影响实际体验。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["arete"],
      movementTendency: ["powerful", "balance"],
      difficultyShape: "sustained",
      primaryDemand: "power",
      secondaryDemand: "balance",
      cruxPattern: "sustained",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-c2bc20b8-eaca-54d6-a1ea-503a0031f0b6",
    sourceLabel: "Mountain Project: The Mandala",
    sourceUrl: "https://www.mountainproject.com/route/105908186/the-mandala",
    copy: {
      summary: {
        en: "An elite prow problem with a concentrated power and compression profile.",
        zh: "一条精英难度的岩脊抱石，挑战集中在力量与压缩能力。"
      },
      whyItStandsOut: {
        en: "Consider it only when a high-end compression project matches the purpose of your Bishop visit.",
        zh: "只有当这次 Bishop 行程明确想找高端压缩型项目时，才适合把它列入重点。"
      },
      bestForText: {
        en: "Experienced boulderers comparing elite projects near the top of their preferred range.",
        zh: "适合有经验、正在比较个人偏好上限附近精英项目的抱石者。"
      },
      thingsToConsider: [
        {
          en: "DNA fit describes movement preference, not readiness or likelihood of completion.",
          zh: "DNA 匹配只表达动作偏好，不代表准备程度或完攀概率。"
        }
      ]
    },
    profile: {
      wallAngle: "overhang",
      terrain: ["arete", "face"],
      movementTendency: ["powerful", "compression"],
      difficultyShape: "single-crux",
      primaryDemand: "power",
      secondaryDemand: "compression",
      cruxPattern: "distinct-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "bishop-area-usa",
    routeId: "openbeta-ed8be39a-c510-55ba-b440-105c90a1c843",
    sourceLabel: "Mountain Project: Evilution",
    sourceUrl: "https://www.mountainproject.com/route/105908296/evilution",
    copy: {
      summary: {
        en: "An elite face problem that combines technical precision with a strong power demand.",
        zh: "一条精英难度的岩面抱石，把技术准确性与强力量要求放在一起。"
      },
      whyItStandsOut: {
        en: "Compare it when you specifically want an elite face project, not simply the highest number available.",
        zh: "当你明确想找精英岩面项目，而不只是追逐最高难度数字时，可以比较它。"
      },
      bestForText: {
        en: "Experienced boulderers who value exact movement and power at the edge of their range.",
        zh: "适合在个人能力边缘仍重视动作准确性与力量结合的资深抱石者。"
      },
      thingsToConsider: [
        {
          en: "Use current local resources for conditions and every on-site decision.",
          zh: "岩面状态与所有现场决定请以最新当地资料为准。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["face"],
      movementTendency: ["technical", "powerful"],
      difficultyShape: "progressive",
      primaryDemand: "power",
      secondaryDemand: "footwork",
      cruxPattern: "distinct-crux",
      sustainedness: "high"
    }
  })
];
