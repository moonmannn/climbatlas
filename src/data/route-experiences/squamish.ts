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
    verifiedFields: ["name", "grade", "type", "length", "pitch-count", "route-character"]
  });
}

const diedre = mountainProject(
  "Mountain Project: Diedre",
  "https://www.mountainproject.com/route/105857666/diedre"
);
const skywalker = mountainProject(
  "Mountain Project: Skywalker",
  "https://www.mountainproject.com/route/107198282/skywalker"
);
const pennyLane = mountainProject(
  "Mountain Project: Penny Lane",
  "https://www.mountainproject.com/route/105842825/penny-lane"
);
const rockOn = mountainProject(
  "Mountain Project: Rock On",
  "https://www.mountainproject.com/route/105910904/rock-on"
);
const angelsCrest = mountainProject(
  "Mountain Project: Angel's Crest",
  "https://www.mountainproject.com/route/105847203/angels-crest"
);
const crimeOfTheCentury = mountainProject(
  "Mountain Project: Crime of the Century",
  "https://www.mountainproject.com/route/105842838/crime-of-the-century"
);
const tantalusWall = mountainProject(
  "Mountain Project: Tantalus Wall",
  "https://www.mountainproject.com/route/105880812/tantalus-wall"
);
const cobraCrack = defineRouteReference({
  label: "Wikipedia: Cobra Crack",
  provider: "wikipedia",
  sourceType: "open-encyclopedia",
  sourceUrl: "https://en.wikipedia.org/wiki/Cobra_Crack",
  verifiedFields: ["name", "grade", "type", "length", "history", "route-character"]
});

export const squamishRouteExperiences: RouteExperienceOverlay[] = [
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "diedre-squamish",
    sources: [diedre],
    editorial: {
      summary: {
        en: "A long, consistent Apron corner where laybacking, smearing, and stemming shape the day.",
        zh: "一条位于 Apron 的长内角线路，整体体验由侧拉、摩擦脚法与对撑共同构成。"
      },
      whyItStandsOut: {
        en: "Consider it when you want moderate multi-pitch mileage with one clear movement theme instead of constant style changes.",
        zh: "如果你想在中等难度多段线路里积累里程，并专注于清晰统一的动作主题，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy sustained corner technique, careful feet, and steady pacing across pitches.",
        zh: "适合喜欢持续内角技术、细致脚法，并能在多段中保持稳定节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Consistency is part of the challenge; the same movement family returns across several pitches.",
          zh: "持续性本身就是挑战，同一类动作会在多段中反复出现。"
        },
        {
          en: "Use current Squamish resources for access, descent, and route operations.",
          zh: "通行、下降与现场操作请查看最新 Squamish 资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("slab", diedre),
        terrain: sourceBacked(["crack", "corner", "face"], diedre),
        movementTendency: sourceBacked(["stemming", "technical", "precise-footwork"], diedre),
        difficultyShape: sourceBacked("sustained", diedre)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("crack-technique", diedre),
        secondaryDemand: editoriallyReviewed("footwork", diedre),
        cruxPattern: editoriallyReviewed("no-single-crux", diedre),
        sustainedness: sourceBacked("high", diedre)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "skywalker-squamish",
    sources: [skywalker],
    editorial: {
      summary: {
        en: "A moderate multi-pitch route whose pitches change character, making variety more important than one repeated technique.",
        zh: "一条中等难度多段线路，各段风格有所变化，因此选择它更看重适应力，而不是单一技术。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a varied Squamish day and would rather adapt between pitches than repeat one crack style.",
        zh: "如果你想体验变化较多的 Squamish 行程，并愿意在各段之间切换策略，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy route variety, moderate grades, and adjusting movement from pitch to pitch.",
        zh: "适合喜欢地形变化、中等难度，并愿意逐段调整动作方式的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A single overall grade cannot describe every pitch's style.",
          zh: "一个总难度数字无法说明每一段的具体风格。"
        },
        {
          en: "Check the current route page for operational details before setting out.",
          zh: "出发前请在最新线路页确认现场安排。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", skywalker),
        terrain: sourceBacked(["crack", "face", "corner"], skywalker),
        movementTendency: editoriallyReviewed(["technical", "route-reading", "balance"], skywalker),
        difficultyShape: sourceBacked("variable", skywalker)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("route-reading", skywalker),
        secondaryDemand: editoriallyReviewed("technique", skywalker),
        cruxPattern: editoriallyReviewed("multiple-cruxes", skywalker)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "penny-lane-squamish",
    sources: [pennyLane],
    editorial: {
      summary: {
        en: "A single-pitch Smoke Bluffs crack that combines jamming, stemming, and a gradually easing upper section.",
        zh: "一条位于 Smoke Bluffs 的单段裂缝，结合手脚塞、对撑，并在上部逐渐缓和。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a focused traditional technique check without committing to a full multi-pitch day.",
        zh: "如果你想集中检验传统攀登技术，又不想投入一整天多段行程，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy a compact crack-and-corner problem with clear traditional movement.",
        zh: "适合喜欢紧凑裂缝与内角问题，并偏好明确传统动作的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The opening and upper section do not carry the same intensity.",
          zh: "开局与上部的强度并不相同。"
        },
        {
          en: "Confirm the current anchor and access information through local sources.",
          zh: "当前锚点与通行信息请通过当地资料确认。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", pennyLane),
        terrain: sourceBacked(["crack", "corner"], pennyLane),
        movementTendency: sourceBacked(["stemming", "technical"], pennyLane),
        difficultyShape: sourceBacked("progressive", pennyLane)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("crack-technique", pennyLane),
        secondaryDemand: editoriallyReviewed("balance", pennyLane),
        cruxPattern: editoriallyReviewed("distinct-crux", pennyLane)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "rock-on-squamish",
    sources: [rockOn],
    editorial: {
      summary: {
        en: "A multi-pitch crack-and-corner route that rewards technical consistency more than a single burst of power.",
        zh: "一条以裂缝与内角为主的多段线路，更奖励技术稳定，而不是一次爆发。"
      },
      whyItStandsOut: {
        en: "Choose it when you want moderate multi-pitch practice with a stronger crack focus than a varied ridge line.",
        zh: "如果你想练习中等难度多段，并希望主题更集中在裂缝而不是多变棱线上，可以比较它。"
      },
      bestForText: {
        en: "Climbers building efficient crack movement and calm pacing across several pitches.",
        zh: "适合想提升裂缝动作效率，并在多段中保持平稳节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Several pitches make pacing part of the experience even when the grade remains moderate.",
          zh: "即使难度适中，多段长度也会让节奏管理成为体验的一部分。"
        },
        {
          en: "Use current local resources for route-finding and descent information.",
          zh: "线路辨识与下降信息请使用最新当地资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", rockOn),
        terrain: sourceBacked(["crack", "corner", "face"], rockOn),
        movementTendency: editoriallyReviewed(["technical", "endurance"], rockOn),
        difficultyShape: editoriallyReviewed("variable", rockOn)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("crack-technique", rockOn),
        secondaryDemand: editoriallyReviewed("endurance", rockOn),
        cruxPattern: editoriallyReviewed("multiple-cruxes", rockOn)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "angels-crest-squamish",
    sources: [angelsCrest],
    editorial: {
      summary: {
        en: "A long crest route that mixes cracks, faces, and an arete-shaped journey across many pitches.",
        zh: "一条沿山脊展开的长线路，在多段中混合裂缝、岩面与棱线地形。"
      },
      whyItStandsOut: {
        en: "Consider it when the journey and changing terrain matter more to you than repeating one signature movement.",
        zh: "如果你更看重线路旅程与地形变化，而不是重复一种招牌动作，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy long multi-pitch days, route variety, and sustained decision-making.",
        zh: "适合喜欢长多段行程、地形变化与持续判断的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The route's length and variety are part of the choice, not background details.",
          zh: "线路长度与地形变化本身就是选择重点，不只是背景信息。"
        },
        {
          en: "Check current park, access, and route information before committing to the day.",
          zh: "决定行程前，请核对最新公园、通行与单线路信息。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", angelsCrest),
        terrain: sourceBacked(["crack", "face", "arete"], angelsCrest),
        movementTendency: editoriallyReviewed(["route-reading", "endurance", "technical"], angelsCrest),
        difficultyShape: editoriallyReviewed("variable", angelsCrest)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("endurance", angelsCrest),
        secondaryDemand: editoriallyReviewed("route-reading", angelsCrest),
        cruxPattern: editoriallyReviewed("multiple-cruxes", angelsCrest),
        sustainedness: editoriallyReviewed("moderate", angelsCrest)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "crime-of-the-century-squamish",
    sources: [crimeOfTheCentury],
    editorial: {
      summary: {
        en: "A thin single-pitch crack where precision and crack technique carry more weight than route length.",
        zh: "一条细裂缝单段线路，精准度与裂缝技术远比线路长度更重要。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a concentrated Squamish crack project with a narrow technical focus.",
        zh: "如果你想找一个技术主题集中、篇幅紧凑的 Squamish 裂缝项目，可以比较它。"
      },
      bestForText: {
        en: "Climbers who enjoy precise finger-crack movement and sustained technical attention.",
        zh: "适合喜欢精细指缝动作，并能持续保持技术专注的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its compact length concentrates rather than reduces the technical demand.",
          zh: "紧凑的长度并不会降低技术需求，反而让它更集中。"
        },
        {
          en: "Use current route information for all protection and anchor details.",
          zh: "保护与锚点细节请查看最新线路资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", crimeOfTheCentury),
        terrain: sourceBacked(["crack"], crimeOfTheCentury),
        movementTendency: editoriallyReviewed(["technical", "precise-footwork"], crimeOfTheCentury),
        difficultyShape: editoriallyReviewed("sustained", crimeOfTheCentury)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("crack-technique", crimeOfTheCentury),
        secondaryDemand: editoriallyReviewed("footwork", crimeOfTheCentury),
        cruxPattern: editoriallyReviewed("no-single-crux", crimeOfTheCentury),
        sustainedness: editoriallyReviewed("high", crimeOfTheCentury)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "tantalus-wall-squamish",
    sources: [tantalusWall],
    editorial: {
      summary: {
        en: "An advanced wall route that mixes free-climbing difficulty with a recorded aid component in its original grade.",
        zh: "一条进阶岩壁线路，原始难度同时记录了自由攀登难度与人工攀登成分。"
      },
      whyItStandsOut: {
        en: "Consider it when you want to compare a longer technical objective whose grade cannot be reduced to one free-climbing number.",
        zh: "如果你想比较一条较长的技术型目标，而且不希望把复杂难度压缩成一个自由攀数字，可以看它。"
      },
      bestForText: {
        en: "Climbers drawn to advanced multi-pitch terrain and comfortable researching the route's mixed grading context.",
        zh: "适合偏爱进阶多段地形，并愿意仔细了解混合难度语境的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Read the complete original grade; the aid notation is meaningful and must not be discarded.",
          zh: "请完整阅读原始难度；其中的人工攀登标记有实际意义，不能忽略。"
        },
        {
          en: "Use current route-specific resources for operational details.",
          zh: "现场操作细节请查看最新单线路资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", tantalusWall),
        terrain: sourceBacked(["crack", "face", "corner"], tantalusWall),
        movementTendency: editoriallyReviewed(["technical", "endurance", "route-reading"], tantalusWall),
        difficultyShape: editoriallyReviewed("variable", tantalusWall)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", tantalusWall),
        secondaryDemand: editoriallyReviewed("endurance", tantalusWall),
        cruxPattern: editoriallyReviewed("multiple-cruxes", tantalusWall)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "squamish-canada",
    routeId: "cobra-crack-squamish",
    sources: [cobraCrack],
    editorial: {
      summary: {
        en: "A long, thin crack on an overhanging granite face and an elite reference point for hard traditional crack climbing.",
        zh: "一条位于仰角花岗岩上的长细裂缝，也是高难传统裂缝攀登的重要参照。"
      },
      whyItStandsOut: {
        en: "Choose it as an elite benchmark when the combination of steepness, thin crack technique, and power is the point of comparison.",
        zh: "当你要比较的是陡度、细裂缝技术与力量的组合时，它是一条明确的精英标杆。"
      },
      bestForText: {
        en: "Elite crack specialists looking for a sustained, steep traditional project.",
        zh: "适合正在寻找持续、陡峭传统项目的精英裂缝攀登者。"
      },
      thingsToConsider: [
        {
          en: "Its grade and route character place it well beyond a general Squamish sampler.",
          zh: "它的难度与线路风格，远超一般 Squamish 体验线的范围。"
        },
        {
          en: "Use current specialist resources for every attempt-planning detail.",
          zh: "所有尝试规划细节都应以最新专业资料为准。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", cobraCrack),
        terrain: sourceBacked(["crack"], cobraCrack),
        movementTendency: editoriallyReviewed(["powerful", "technical", "endurance"], cobraCrack),
        difficultyShape: editoriallyReviewed("sustained", cobraCrack)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("crack-technique", cobraCrack),
        secondaryDemand: editoriallyReviewed("power-endurance", cobraCrack),
        cruxPattern: editoriallyReviewed("sustained", cobraCrack),
        sustainedness: editoriallyReviewed("high", cobraCrack)
      }
    }
  })
];
