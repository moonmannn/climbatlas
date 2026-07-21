import {
  defineRouteExperience,
  defineRouteReference,
  editoriallyReviewed,
  sourceBacked,
  type RouteExperienceOverlay
} from "@/data/route-experiences/types";

function mountainProject(label: string, sourceUrl: string) {
  return defineRouteReference({
    label,
    provider: "mountain-project",
    sourceUrl,
    verifiedFields: ["name", "grade", "type", "length", "route-character"]
  });
}

const kampsight = mountainProject(
  "Mountain Project: Kampsight",
  "https://www.mountainproject.com/route/105882851/kampsight"
);
const breakfastBurrito = mountainProject(
  "Mountain Project: Breakfast Burrito",
  "https://www.mountainproject.com/route/106081922/breakfast-burrito"
);
const amarilloSunset = mountainProject(
  "Mountain Project: Amarillo Sunset",
  "https://www.mountainproject.com/route/106286394/amarillo-sunset"
);
const roShampo = mountainProject(
  "Mountain Project: Ro Shampo",
  "https://www.mountainproject.com/route/105860759/ro-shampo"
);
const mercyTheHuff = mountainProject(
  "Mountain Project: Mercy, the Huff",
  "https://www.mountainproject.com/route/106045269/mercy-the-huff"
);
const checkYourGrip = mountainProject(
  "Mountain Project: Check Your Grip",
  "https://www.mountainproject.com/route/106081909/check-your-grip"
);
const tableOfColors = mountainProject(
  "Mountain Project: Table of Colors",
  "https://www.mountainproject.com/route/106304964/table-of-colors"
);
const pureImagination = defineRouteReference({
  label: "PlanetMountain: Pure Imagination interview",
  provider: "climbing-media",
  sourceType: "climbing-media",
  sourceUrl: "https://www.planetmountain.com/en/news/interviews/sasha-digiulian-the-pure-imagination-9a-interview.html",
  verifiedFields: ["name", "grade", "length", "route-character", "difficulty-shape"]
});

export const redRiverGorgeRouteExperiences: RouteExperienceOverlay[] = [
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "kampsight-red-river-gorge",
    sources: [kampsight],
    editorial: {
      summary: {
        en: "A shorter moderate sport route that puts movement choices ahead of long-route endurance.",
        zh: "一条较短的中等难度运动攀线路，重点更偏向动作选择，而不是长距离耐力。"
      },
      whyItStandsOut: {
        en: "Consider it when you want to sample Red River face climbing without beginning with the steepest endurance lines.",
        zh: "如果你想先体验红河峡谷的岩面风格，而不是直接进入最陡、最耐力型的线路，可以从它开始比较。"
      },
      bestForText: {
        en: "Climbers who prefer readable face movement and a compact effort at this grade.",
        zh: "适合偏好可阅读岩面动作，并希望把尝试控制在较紧凑篇幅内的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Use the exact route source to confirm current access and line identification.",
          zh: "当前通行与线路辨识，请在出发前核对单线路来源。"
        },
        {
          en: "Treat this as a style sample, not a summary of every Red River sector.",
          zh: "它只能代表一种风格，不能概括红河峡谷所有岩区。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", kampsight),
        terrain: sourceBacked(["face", "pockets"], kampsight),
        movementTendency: editoriallyReviewed(["technical", "route-reading"], kampsight),
        difficultyShape: editoriallyReviewed("progressive", kampsight)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", kampsight),
        secondaryDemand: editoriallyReviewed("route-reading", kampsight),
        cruxPattern: editoriallyReviewed("distinct-crux", kampsight)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "breakfast-burrito-red-river-gorge",
    sources: [breakfastBurrito],
    editorial: {
      summary: {
        en: "A varied sport line that shifts from lower-angle face climbing into a steeper finish.",
        zh: "一条变化明确的运动攀线路，从较缓的岩面逐渐过渡到更陡的收尾。"
      },
      whyItStandsOut: {
        en: "Choose it when you want one route to show how pace and movement can change across a short Red River line.",
        zh: "如果你想用一条不算很长的线路感受节奏与动作如何发生变化，它很适合作为比较样本。"
      },
      bestForText: {
        en: "Climbers who enjoy adapting from controlled face movement to a more physical finish.",
        zh: "适合喜欢先控制岩面动作，再切换到更具身体性的收尾的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its difficulty is not distributed evenly from start to finish.",
          zh: "难度并不是从头到尾平均分布。"
        },
        {
          en: "Check current RRGCC and route information before visiting the crag.",
          zh: "前往岩区前，请核对 RRGCC 与单线路的最新信息。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", breakfastBurrito),
        terrain: sourceBacked(["face", "arete"], breakfastBurrito),
        movementTendency: editoriallyReviewed(["technical", "powerful"], breakfastBurrito),
        difficultyShape: sourceBacked("progressive", breakfastBurrito)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", breakfastBurrito),
        secondaryDemand: editoriallyReviewed("power", breakfastBurrito),
        cruxPattern: editoriallyReviewed("distinct-crux", breakfastBurrito)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "amarillo-sunset-red-river-gorge",
    sources: [amarilloSunset],
    editorial: {
      summary: {
        en: "A compact line on a prominent wall where body position matters more than simply accumulating moves.",
        zh: "一条位于醒目岩壁上的紧凑线路，身体位置的选择比单纯堆积动作更重要。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a technical 5.11 that feels visually and stylistically distinct from longer pump routes.",
        zh: "如果你想找一条视觉与风格都不同于长耐力线的技术型 5.11，可以比较它。"
      },
      bestForText: {
        en: "Climbers who like deliberate positioning, larger holds, and a clearly defined line.",
        zh: "适合喜欢认真调整身体位置、使用较大把手，并偏爱清晰线条的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A short length does not remove the need to read the changing wall shape.",
          zh: "线路较短，也仍需要阅读岩壁形态的变化。"
        },
        {
          en: "Confirm current access through local resources before the visit.",
          zh: "前往前请通过当地资源确认最新通行信息。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", amarilloSunset),
        terrain: sourceBacked(["face", "arete"], amarilloSunset),
        movementTendency: editoriallyReviewed(["technical", "balance"], amarilloSunset),
        difficultyShape: editoriallyReviewed("progressive", amarilloSunset)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", amarilloSunset),
        secondaryDemand: editoriallyReviewed("balance", amarilloSunset),
        cruxPattern: editoriallyReviewed("distinct-crux", amarilloSunset)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "ro-shampo-red-river-gorge",
    sources: [roShampo],
    editorial: {
      summary: {
        en: "A short, steep face route that concentrates its grade into plates, edges, and purposeful movement.",
        zh: "一条短而陡的岩面线路，把难度集中在岩片、边缘与明确的动作选择上。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a 5.12 decision based on power and reach between positive features, not pure mileage.",
        zh: "如果你想找一条更看重发力与正向岩点衔接，而不是纯里程的 5.12，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy steep face climbing with a compact physical challenge.",
        zh: "适合喜欢陡峭岩面，并偏好紧凑身体挑战的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Reach and body position can shape how the line feels, so the grade alone is incomplete context.",
          zh: "身高臂展与身体位置会影响体验，因此难度数字并不是全部。"
        },
        {
          en: "The crag requires current permit information; follow the linked local source.",
          zh: "该岩区需要关注最新许可信息，请以链接中的当地资料为准。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", roShampo),
        terrain: sourceBacked(["face", "flake"], roShampo),
        movementTendency: editoriallyReviewed(["powerful", "route-reading"], roShampo),
        difficultyShape: editoriallyReviewed("sustained", roShampo)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power", roShampo),
        secondaryDemand: editoriallyReviewed("route-reading", roShampo),
        cruxPattern: editoriallyReviewed("no-single-crux", roShampo),
        sustainedness: editoriallyReviewed("moderate", roShampo)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "mercy-the-huff-red-river-gorge",
    sources: [mercyTheHuff],
    editorial: {
      summary: {
        en: "A pump-led sport route where rests matter because the difficulty builds through accumulated effort.",
        zh: "一条由泵感主导的运动攀线路；休息点之所以重要，是因为难度来自体力的逐步累积。"
      },
      whyItStandsOut: {
        en: "Consider it when you want to test pacing and recovery rather than hunt for one isolated hard move.",
        zh: "如果你更想检验节奏与恢复，而不是寻找一个孤立的极难动作，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy managing pump across positive holds and repeated movement.",
        zh: "适合喜欢在正向把手与连续动作中管理泵感的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The primary challenge is cumulative, so compare it with your endurance preference as well as the grade.",
          zh: "主要挑战具有累积性，选择时除了难度，也要比较自己的耐力偏好。"
        },
        {
          en: "Use the official land manager link for current access information.",
          zh: "最新通行信息请查看官方土地管理资源。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("overhang", mercyTheHuff),
        terrain: sourceBacked(["face", "pockets"], mercyTheHuff),
        movementTendency: sourceBacked(["endurance", "route-reading"], mercyTheHuff),
        difficultyShape: sourceBacked("sustained", mercyTheHuff)
      },
      challenge: {
        primaryDemand: sourceBacked("endurance", mercyTheHuff),
        secondaryDemand: editoriallyReviewed("route-reading", mercyTheHuff),
        cruxPattern: sourceBacked("no-single-crux", mercyTheHuff),
        sustainedness: sourceBacked("high", mercyTheHuff)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "check-your-grip-red-river-gorge",
    sources: [checkYourGrip],
    editorial: {
      summary: {
        en: "A varied face route that moves from a defined opening into slopers and a more sustained upper effort.",
        zh: "一条变化明显的岩面线路，从清楚的开局进入斜面把手，并在上部转为更持续的发力。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a 5.12 that asks you to switch tactics rather than repeat one movement pattern.",
        zh: "如果你想找一条需要切换策略，而不是重复单一动作模式的 5.12，可以比较它。"
      },
      bestForText: {
        en: "Climbers who like adjusting grip, body position, and pacing as the route changes.",
        zh: "适合喜欢随着线路变化调整抓法、身体位置与节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The upper effort may matter more to your choice than the easier opening.",
          zh: "上部的持续发力，可能比前段较轻松的开局更影响你的选择。"
        },
        {
          en: "Check the current preserve requirements before visiting.",
          zh: "前往前请确认保护区的最新要求。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", checkYourGrip),
        terrain: sourceBacked(["face"], checkYourGrip),
        movementTendency: editoriallyReviewed(["technical", "endurance"], checkYourGrip),
        difficultyShape: sourceBacked("progressive", checkYourGrip)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("route-reading", checkYourGrip),
        secondaryDemand: editoriallyReviewed("endurance", checkYourGrip),
        cruxPattern: editoriallyReviewed("multiple-cruxes", checkYourGrip),
        sustainedness: editoriallyReviewed("moderate", checkYourGrip)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "table-of-colors-red-river-gorge",
    sources: [tableOfColors],
    editorial: {
      summary: {
        en: "A technical 5.13 built around a clearly defined arete crux rather than uninterrupted steep endurance.",
        zh: "一条技术型 5.13，核心是清晰的棱线难点，而不是从头到尾不间断的陡壁耐力。"
      },
      whyItStandsOut: {
        en: "Consider it when you want an elite Red River route whose challenge is precision-led and easy to describe at a high level.",
        zh: "如果你想找一条以精准控制为主、且能在不透露 beta 的前提下清楚理解挑战形态的精英线路，可以看它。"
      },
      bestForText: {
        en: "Climbers who enjoy balance, small holds, and keeping composure around a distinct technical section.",
        zh: "适合喜欢平衡、小把手，并能在明确技术难点附近保持稳定的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its difficulty profile differs from the Gorge's longer pump-focused routes.",
          zh: "它的难度形态不同于峡谷里更长、更偏泵感的线路。"
        },
        {
          en: "Use current route and land-manager resources before planning an attempt.",
          zh: "计划尝试前，请查看最新线路与土地管理资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", tableOfColors),
        terrain: sourceBacked(["face", "arete"], tableOfColors),
        movementTendency: sourceBacked(["technical", "balance"], tableOfColors),
        difficultyShape: sourceBacked("single-crux", tableOfColors)
      },
      challenge: {
        primaryDemand: sourceBacked("technique", tableOfColors),
        secondaryDemand: editoriallyReviewed("balance", tableOfColors),
        cruxPattern: sourceBacked("distinct-crux", tableOfColors),
        sustainedness: editoriallyReviewed("moderate", tableOfColors)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "red-river-gorge-usa",
    routeId: "pure-imagination-red-river-gorge",
    sources: [pureImagination],
    editorial: {
      summary: {
        en: "A slightly overhanging elite line with several hard sections linked by sustained climbing on small features.",
        zh: "一条微仰角精英线路，多个高难段落由持续的小岩点攀登连接起来。"
      },
      whyItStandsOut: {
        en: "Choose it as a reference point when comparing elite projects that demand both power and long-form resistance.",
        zh: "当你在比较既需要力量、又需要长时间耐力的精英项目时，它是一条很清楚的参照线。"
      },
      bestForText: {
        en: "Elite climbers who prefer sustained crimp-and-pocket climbing with more than one decisive section.",
        zh: "适合偏爱持续小边缘与洞穴把手，并能处理多个决定性段落的精英攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The route's grade and challenge profile place it firmly in elite-project territory.",
          zh: "它的难度与挑战画像都明确属于精英项目范围。"
        },
        {
          en: "Use current route-specific resources for all attempt planning and local information.",
          zh: "所有尝试规划与当地信息，请查看最新单线路资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", pureImagination),
        terrain: sourceBacked(["face", "pockets"], pureImagination),
        movementTendency: sourceBacked(["powerful", "endurance"], pureImagination),
        difficultyShape: sourceBacked("sustained", pureImagination)
      },
      challenge: {
        primaryDemand: sourceBacked("power-endurance", pureImagination),
        secondaryDemand: editoriallyReviewed("route-reading", pureImagination),
        cruxPattern: sourceBacked("multiple-cruxes", pureImagination),
        sustainedness: sourceBacked("high", pureImagination)
      }
    }
  })
];
