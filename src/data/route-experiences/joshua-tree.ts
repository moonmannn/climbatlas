import { defineReviewedPick } from "@/data/route-experiences/reviewed-pick";
import type { RouteExperienceOverlay } from "@/data/route-experiences/types";

export const joshuaTreeRouteExperiences: RouteExperienceOverlay[] = [
  defineReviewedPick({
    destinationSlug: "joshua-tree-usa",
    routeId: "double-cross-joshua-tree",
    sourceLabel: "Mountain Project: Double Cross",
    sourceUrl: "https://www.mountainproject.com/route/105721615/double-cross",
    copy: {
      summary: {
        en: "A compact traditional crack route built around sustained hand- and fist-crack movement.",
        zh: "一条篇幅紧凑的传统裂缝线路，主要考验持续的手裂与拳裂技术。"
      },
      whyItStandsOut: {
        en: "Consider it when you want one focused crack objective rather than a day of varied terrain.",
        zh: "当你想专注检验裂缝技术，而不是在多种地形之间切换时，可以把它列入候选。"
      },
      bestForText: {
        en: "Climbers who want to compare crack efficiency, pacing, and composure on a vertical line.",
        zh: "适合想在垂直线路上检验裂缝效率、节奏和稳定感的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The grade alone does not describe how familiar the crack sizes will feel.",
          zh: "单看难度不能说明你对这些裂缝尺寸会有多熟悉。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack"],
      movementTendency: ["technical", "endurance"],
      difficultyShape: "sustained",
      primaryDemand: "crack-technique",
      secondaryDemand: "endurance",
      cruxPattern: "no-single-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "joshua-tree-usa",
    routeId: "sail-away-joshua-tree",
    sourceLabel: "Mountain Project: Sail Away",
    sourceUrl: "https://www.mountainproject.com/route/105722179/sail-away",
    copy: {
      summary: {
        en: "A short traditional line that combines crack climbing with face and arete terrain.",
        zh: "一条短小的传统线路，把裂缝、岩面和棱角地形放在同一次攀爬里。"
      },
      whyItStandsOut: {
        en: "It is useful when you want a compact route with more variety than a single crack exercise.",
        zh: "如果你想在短线路里体验比单一裂缝练习更多的变化，它值得比较。"
      },
      bestForText: {
        en: "Climbers who enjoy switching movement style without committing to a long objective.",
        zh: "适合喜欢转换动作方式、但这次不想选择长线路的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Comfort on one terrain type may not transfer evenly to the others.",
          zh: "熟悉其中一种地形，不代表在其他地形上也会有同样的把握。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack", "face", "arete"],
      movementTendency: ["technical", "route-reading"],
      difficultyShape: "variable",
      primaryDemand: "technique",
      secondaryDemand: "route-reading",
      cruxPattern: "multiple-cruxes",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "joshua-tree-usa",
    routeId: "walk-on-the-wild-side-joshua-tree",
    sourceLabel: "Mountain Project: Walk on the Wild Side",
    sourceUrl: "https://www.mountainproject.com/route/105721828/walk-on-the-wild-side",
    copy: {
      summary: {
        en: "A multi-pitch slab and face objective where careful movement matters more than steep pulling.",
        zh: "一条多段板壁与岩面线路，谨慎而准确的移动比陡壁发力更重要。"
      },
      whyItStandsOut: {
        en: "Compare it when you want a longer Joshua Tree day centered on footwork and balance.",
        zh: "当你想选择一条更长、并以脚法和平衡为核心的 Joshua Tree 线路时，可以比较它。"
      },
      bestForText: {
        en: "Climbers who prefer deliberate slab movement and multi-pitch pacing.",
        zh: "适合偏爱从容板壁移动，并想练习多段节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its moderate grade and longer format describe different parts of the decision.",
          zh: "中等难度与较长的线路形式，是两个需要分别考虑的因素。"
        }
      ]
    },
    profile: {
      wallAngle: "slab",
      terrain: ["face"],
      movementTendency: ["precise-footwork", "balance"],
      difficultyShape: "sustained",
      primaryDemand: "footwork",
      secondaryDemand: "balance",
      cruxPattern: "no-single-crux",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "joshua-tree-usa",
    routeId: "illusion-dweller-joshua-tree",
    sourceLabel: "Mountain Project: Illusion Dweller",
    sourceUrl: "https://www.mountainproject.com/route/105722065/illusion-dweller",
    copy: {
      summary: {
        en: "A traditional crack line whose upper terrain changes the rhythm of the route.",
        zh: "一条传统裂缝线路，上部地形会让整条线路的节奏发生变化。"
      },
      whyItStandsOut: {
        en: "Consider it when you want crack technique and a more distinct late challenge in one pitch.",
        zh: "如果你想在一段线路里同时检验裂缝技术和更明确的后段挑战，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who can manage pace on cracks and still adapt when the angle changes.",
        zh: "适合能在裂缝上管理节奏，也愿意在角度变化时调整动作的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A single grade can hide the contrast between the lower and upper portions.",
          zh: "一个难度数字无法完整表达上下两部分的差异。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack"],
      movementTendency: ["technical", "endurance"],
      difficultyShape: "progressive",
      primaryDemand: "crack-technique",
      secondaryDemand: "power-endurance",
      cruxPattern: "distinct-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "joshua-tree-usa",
    routeId: "bird-of-fire-joshua-tree",
    sourceLabel: "Mountain Project: Bird of Fire",
    sourceUrl: "https://www.mountainproject.com/route/105721624/bird-of-fire",
    copy: {
      summary: {
        en: "A focused crack route that asks for precision on smaller crack sizes before a stronger finish.",
        zh: "一条专注裂缝技术的线路，前段需要处理较细的尺寸，后段则更考验力量保持。"
      },
      whyItStandsOut: {
        en: "Compare it when you want a technical crack project with a clear change in intensity.",
        zh: "当你想找一条技术导向、强度变化明确的裂缝项目时，可以比较它。"
      },
      bestForText: {
        en: "Climbers developing finger-crack accuracy and the ability to finish under fatigue.",
        zh: "适合想提高细裂缝准确性，并练习疲劳后完成动作的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Treat familiarity with smaller cracks as a separate question from the published grade.",
          zh: "是否熟悉较细的裂缝，应与公开难度分开判断。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack"],
      movementTendency: ["technical", "powerful"],
      difficultyShape: "progressive",
      primaryDemand: "crack-technique",
      secondaryDemand: "power",
      cruxPattern: "distinct-crux",
      sustainedness: "high"
    }
  }),
  defineReviewedPick({
    destinationSlug: "joshua-tree-usa",
    routeId: "white-rastafarian-joshua-tree",
    sourceLabel: "Mountain Project: White Rastafarian",
    sourceUrl: "https://www.mountainproject.com/route/105722593/white-rastafarian",
    copy: {
      summary: {
        en: "A boulder problem that combines overhanging arete, crack, and face terrain.",
        zh: "一条结合仰角棱线、裂缝与岩面地形的抱石线路。"
      },
      whyItStandsOut: {
        en: "Consider it when you want one problem to test power, body position, and terrain changes.",
        zh: "如果你想用同一条线路检验力量、身体位置和地形转换，可以考虑它。"
      },
      bestForText: {
        en: "Boulderers who enjoy powerful movement without reducing the problem to one style.",
        zh: "适合喜欢力量动作、又不想把问题局限在单一风格里的抱石者。"
      },
      thingsToConsider: [
        {
          en: "Use current local resources for conditions and all on-site decisions.",
          zh: "岩面状态与现场安排请以最新当地资料为准。"
        }
      ]
    },
    profile: {
      wallAngle: "overhang",
      terrain: ["arete", "crack", "face"],
      movementTendency: ["powerful", "compression"],
      difficultyShape: "variable",
      primaryDemand: "power",
      secondaryDemand: "compression",
      cruxPattern: "multiple-cruxes",
      sustainedness: "moderate"
    }
  }),
  defineReviewedPick({
    destinationSlug: "joshua-tree-usa",
    routeId: "gunsmoke-joshua-tree",
    sourceLabel: "Mountain Project: Gunsmoke",
    sourceUrl: "https://www.mountainproject.com/route/105722350/gunsmoke",
    copy: {
      summary: {
        en: "A long boulder traverse where movement economy matters across many sections.",
        zh: "一条较长的横移抱石，动作经济性需要在连续多个段落中保持。"
      },
      whyItStandsOut: {
        en: "Compare it when you want endurance and route reading rather than a brief power test.",
        zh: "当你更想检验耐力和读线，而不是完成一次短促发力时，可以比较它。"
      },
      bestForText: {
        en: "Climbers practicing pacing, efficient decisions, and sustained movement close to the ground.",
        zh: "适合练习节奏、动作取舍和持续移动的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The route length changes the experience even when the individual moves feel manageable.",
          zh: "即使单个动作可以掌控，线路长度仍会明显改变整体体验。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
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
    destinationSlug: "joshua-tree-usa",
    routeId: "equinox-joshua-tree",
    sourceLabel: "Mountain Project: Equinox",
    sourceUrl: "https://www.mountainproject.com/route/105722746/equinox",
    copy: {
      summary: {
        en: "A demanding thin-crack objective where precision and power meet on mostly vertical terrain.",
        zh: "一条高难度细裂缝线路，在以垂直为主的地形上同时考验准确性与力量。"
      },
      whyItStandsOut: {
        en: "Consider it when a focused, high-end crack project fits the purpose of your trip.",
        zh: "当这次行程的目标就是寻找一条专注而高难的裂缝项目时，可以考虑它。"
      },
      bestForText: {
        en: "Experienced crack climbers comparing elite objectives near the top of their preferred range.",
        zh: "适合有细裂缝经验、正在比较个人偏好上限附近精英线路的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A high grade is only one part of the decision; crack-specific familiarity matters too.",
          zh: "高难度只是选择的一部分，针对细裂缝的熟悉程度同样重要。"
        }
      ]
    },
    profile: {
      wallAngle: "vertical",
      terrain: ["crack"],
      movementTendency: ["technical", "powerful"],
      difficultyShape: "sustained",
      primaryDemand: "crack-technique",
      secondaryDemand: "power",
      cruxPattern: "sustained",
      sustainedness: "high"
    }
  })
];
