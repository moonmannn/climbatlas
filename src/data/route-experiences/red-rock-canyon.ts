import { defineReviewedPick } from "@/data/route-experiences/reviewed-pick";
import type { RouteExperienceOverlay } from "@/data/route-experiences/types";

export const redRockCanyonRouteExperiences: RouteExperienceOverlay[] = [
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-1abda280-6f00-5729-bea8-13eb3f555cce",
    sourceLabel: "Mountain Project: Cat in the Hat",
    sourceUrl: "https://www.mountainproject.com/route/105732419/cat-in-the-hat",
    copy: {
      summary: {
        en: "A moderate multi-pitch line that moves through crack and face terrain rather than repeating one style.",
        zh: "一条中等难度的多段线路，在裂缝与岩面地形之间变化，而不是重复单一风格。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a lower-grade Red Rock objective with enough variety to test pacing and technique.",
        zh: "如果你想找一条难度较低、又能检验节奏与技术变化的 Red Rock 线路，可以考虑它。"
      },
      bestForText: {
        en: "Climbers comparing moderate multi-pitch routes and willing to plan from current local resources.",
        zh: "适合正在比较中等难度多段线路，并愿意依据最新当地资料做计划的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A moderate grade does not make every terrain change feel equally familiar.",
          zh: "难度适中，并不代表每一种地形转换都会同样熟悉。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack", "face"],
      movementTendency: ["technical", "route-reading"],
      difficultyShape: "variable",
      primaryDemand: "technique",
      secondaryDemand: "route-reading",
      cruxPattern: "multiple-cruxes",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-3a274d8e-f6c9-5d6f-831f-c35915b6ca2a",
    sourceLabel: "Mountain Project: Solar Slab",
    sourceUrl: "https://www.mountainproject.com/route/105732257/solar-slab",
    copy: {
      summary: {
        en: "A longer slab, face, crack, and corner outing where movement precision and pacing share the workload.",
        zh: "一条较长的板壁、岩面、裂缝与转角线路，动作准确性与节奏管理共同决定体验。"
      },
      whyItStandsOut: {
        en: "Compare it when you want a broad multi-pitch day rather than one concentrated technical problem.",
        zh: "当你想要内容较丰富的多段行程，而不是单一而集中的技术题时，可以比较它。"
      },
      bestForText: {
        en: "Climbers who prefer deliberate footwork and steady progress across varied terrain.",
        zh: "适合偏爱细致脚法，并愿意在多变地形中稳定推进的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The published grade and the scale of the outing are separate planning questions.",
          zh: "公开难度与整趟行程的规模，是两个需要分别规划的问题。"
        }
      ]
    },
    profile: {
      wallAngle: "slab",
      terrain: ["face", "crack", "corner"],
      movementTendency: ["precise-footwork", "endurance"],
      difficultyShape: "variable",
      primaryDemand: "footwork",
      secondaryDemand: "endurance",
      cruxPattern: "multiple-cruxes",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-74f2c1ea-4a6a-5107-98ab-86de017d4f36",
    sourceLabel: "Mountain Project: Frogland",
    sourceUrl: "https://www.mountainproject.com/route/105732398/frogland",
    copy: {
      summary: {
        en: "A multi-pitch route with crack, corner, and face terrain spread across a moderate grade.",
        zh: "一条中等难度的多段线路，包含裂缝、转角与岩面地形。"
      },
      whyItStandsOut: {
        en: "Consider it when variety and technical problem solving matter more than a uniform movement style.",
        zh: "如果你更重视地形变化和技术判断，而不是统一的动作风格，可以考虑它。"
      },
      bestForText: {
        en: "Climbers building breadth across traditional terrain while learning to manage a longer sequence of pitches.",
        zh: "适合想拓宽传统地形经验，并练习多段节奏管理的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Different portions may suit different strengths despite sharing one route grade.",
          zh: "即使共用一个线路难度，不同部分也可能分别适合不同强项。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack", "corner", "face"],
      movementTendency: ["technical", "endurance"],
      difficultyShape: "variable",
      primaryDemand: "technique",
      secondaryDemand: "endurance",
      cruxPattern: "multiple-cruxes",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-28e8f602-f986-546c-917c-4d3d6ac0a2b4",
    sourceLabel: "Mountain Project: Crimson Chrysalis",
    sourceUrl: "https://www.mountainproject.com/route/105732281/crimson-chrysalis",
    copy: {
      summary: {
        en: "A sustained multi-pitch line combining crack, face, and chimney terrain.",
        zh: "一条持续性较强的多段线路，结合裂缝、岩面与烟囱地形。"
      },
      whyItStandsOut: {
        en: "Compare it when you want endurance to matter across several kinds of traditional terrain.",
        zh: "当你希望耐力在多种传统地形中持续发挥作用时，可以比较它。"
      },
      bestForText: {
        en: "Climbers comfortable changing technique while maintaining a steady multi-pitch rhythm.",
        zh: "适合能在转换技术的同时保持稳定多段节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Terrain variety can make the route feel less uniform than its single grade suggests.",
          zh: "多样地形会让线路体感比单一难度数字所表达的更不均一。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack", "face", "chimney"],
      movementTendency: ["endurance", "technical"],
      difficultyShape: "sustained",
      primaryDemand: "endurance",
      secondaryDemand: "technique",
      cruxPattern: "no-single-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-34740d29-7fe6-5a0d-a5a5-68281aecad5e",
    sourceLabel: "Mountain Project: Epinephrine",
    sourceUrl: "https://www.mountainproject.com/route/105732422/epinephrine",
    copy: {
      summary: {
        en: "A long chimney and crack objective with a sustained endurance profile.",
        zh: "一条较长的烟囱与裂缝线路，整体明显偏向持续耐力。"
      },
      whyItStandsOut: {
        en: "Consider it when chimney technique and a long, steady challenge match the purpose of your trip.",
        zh: "当烟囱技术和长时间稳定挑战正符合这次行程目标时，可以考虑它。"
      },
      bestForText: {
        en: "Climbers comparing committed-feeling multi-pitch styles without treating grade as the only filter.",
        zh: "适合在比较长线多段风格时，不把难度当作唯一筛选条件的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Movement preference and overall scale should be evaluated separately from the grade.",
          zh: "动作偏好与整体规模，应和难度数字分开评估。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["chimney", "crack"],
      movementTendency: ["endurance", "stemming"],
      difficultyShape: "sustained",
      primaryDemand: "endurance",
      secondaryDemand: "technique",
      cruxPattern: "sustained",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-40d773d9-0d6d-5b56-bc34-ad3537d7f2e2",
    sourceLabel: "Mountain Project: Dream of Wild Turkeys",
    sourceUrl: "https://www.mountainproject.com/route/105732275/dream-of-wild-turkeys",
    copy: {
      summary: {
        en: "A technical multi-pitch face and crack route that rewards precise movement across changing terrain.",
        zh: "一条技术型多段岩面与裂缝线路，在地形变化中持续奖励准确移动。"
      },
      whyItStandsOut: {
        en: "Compare it when footwork and route reading are the qualities you want to emphasize.",
        zh: "当脚法与读线正是你想重点检验的能力时，可以比较它。"
      },
      bestForText: {
        en: "Climbers who prefer technical progression over a purely power-driven objective.",
        zh: "适合偏爱技术推进，而不是纯力量目标的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Changing terrain can distribute difficulty differently from pitch to pitch.",
          zh: "地形变化可能让不同段落的难度分布并不相同。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["face", "crack"],
      movementTendency: ["technical", "precise-footwork"],
      difficultyShape: "variable",
      primaryDemand: "footwork",
      secondaryDemand: "route-reading",
      cruxPattern: "multiple-cruxes",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-52c7deca-4592-5570-93ba-944cdff9af78",
    sourceLabel: "Mountain Project: Prince of Darkness",
    sourceUrl: "https://www.mountainproject.com/route/105732458/prince-of-darkness",
    copy: {
      summary: {
        en: "A sustained face route where precise footwork and technical consistency drive the experience.",
        zh: "一条持续型岩面线路，准确脚法与技术稳定性决定了主要体验。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a consistent technical test rather than widely changing terrain.",
        zh: "如果你想找一条稳定的技术考验，而不是地形频繁转换的线路，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy movement precision and maintaining form over repeated face climbing.",
        zh: "适合喜欢准确移动，并能在连续岩面攀爬中保持动作质量的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Sustained technical climbing can feel different from a route with one obvious crux.",
          zh: "持续的技术攀爬，与只有一个明显难点的线路会有不同体感。"
        }
      ]
    },
    profile: {
      wallAngle: "slab",
      terrain: ["face"],
      movementTendency: ["precise-footwork", "technical"],
      difficultyShape: "sustained",
      primaryDemand: "footwork",
      secondaryDemand: "technique",
      cruxPattern: "no-single-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "red-rock-canyon-usa",
    routeId: "openbeta-18b3ec70-b1d8-590a-bdad-3bf26f4c143e",
    sourceLabel: "Mountain Project: Levitation 29",
    sourceUrl: "https://www.mountainproject.com/route/105732443/levitation-29",
    copy: {
      summary: {
        en: "An advanced multi-pitch face and crack route with a sustained technical and endurance profile.",
        zh: "一条进阶多段岩面与裂缝线路，持续考验技术稳定性和耐力。"
      },
      whyItStandsOut: {
        en: "Compare it when you want a harder Red Rock objective whose challenge extends beyond a single move.",
        zh: "当你想找一条更高难度、且挑战不只集中在单个动作上的 Red Rock 线路时，可以比较它。"
      },
      bestForText: {
        en: "Experienced climbers who want sustained technical movement across a longer objective.",
        zh: "适合希望在较长线路中持续处理技术动作的有经验攀岩者。"
      },
      thingsToConsider: [
        {
          en: "DNA fit describes preference alignment and does not assess readiness or safety.",
          zh: "DNA 匹配只描述偏好契合度，不评估准备程度或安全性。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["face", "crack"],
      movementTendency: ["endurance", "technical"],
      difficultyShape: "sustained",
      primaryDemand: "endurance",
      secondaryDemand: "technique",
      cruxPattern: "sustained",
      sustainedness: "high"
    }
  })
];
