import {
  defineRouteExperience,
  defineRouteReference,
  editoriallyReviewed,
  sourceBacked,
  type RouteExperienceOverlay
} from "@/data/route-experiences/types";

const theNose = defineRouteReference({
  label: "Yosemite National Park: Danger Zones — The Nose",
  provider: "official-organization",
  sourceType: "official",
  sourceUrl: "https://www.nps.gov/yose/blogs/danger-zones-the-nose.htm",
  trustLevel: "high",
  verifiedFields: ["name", "grade", "route-format", "route-character"]
});

const snakeDike = defineRouteReference({
  label: "Climbing History: Snake Dike",
  provider: "other",
  sourceUrl: "https://climbing-history.org/climb/7938/snake-dike",
  verifiedFields: ["name", "grade", "pitch-count", "terrain"]
});

const nutcracker = defineRouteReference({
  label: "American Alpine Club: Nutcracker first-ascent record",
  provider: "official-organization",
  sourceType: "official",
  sourceUrl: "https://publications.americanalpineclub.org/articles/12196814100/Manure-Pile-Buttress-Nutcracker",
  trustLevel: "high",
  verifiedFields: ["name", "history", "route-format", "terrain"]
});

const centralPillar = defineRouteReference({
  label: "Mountain Project: Central Pillar of Frenzy",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/105862930/central-pillar-of-frenzy",
  verifiedFields: ["name", "grade", "type", "length", "pitch-count", "route-character"]
});

const eastButtress = defineRouteReference({
  label: "Mountain Project: East Buttress of Middle Cathedral",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/105915125/east-buttress",
  verifiedFields: ["name", "grade", "type", "length", "pitch-count", "route-character"]
});

const astroman = defineRouteReference({
  label: "Climbing: first free ascent of Astroman",
  provider: "climbing-media",
  sourceType: "climbing-media",
  sourceUrl: "https://www.climbing.com/travel/first-ascent-astroman-john-long-yosemite/",
  verifiedFields: ["name", "history", "pitch-count", "route-character"]
});

const midnightLightning = defineRouteReference({
  label: "Wikipedia: Midnight Lightning",
  provider: "wikipedia",
  sourceType: "open-encyclopedia",
  sourceUrl: "https://en.wikipedia.org/wiki/Midnight_Lightning_(climb)",
  verifiedFields: ["name", "grade", "type", "history", "route-character"]
});

const separateReality = defineRouteReference({
  label: "Wikipedia: Separate Reality",
  provider: "wikipedia",
  sourceType: "open-encyclopedia",
  sourceUrl: "https://en.wikipedia.org/wiki/Separate_Reality_(climb)",
  verifiedFields: ["name", "grade", "type", "length", "route-character"]
});

export const yosemiteRouteExperiences: RouteExperienceOverlay[] = [
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "the-nose-el-capitan",
    sources: [theNose],
    editorial: {
      summary: {
        en: "A long-form El Capitan objective where the aid and free grades describe very different undertakings.",
        zh: "一条贯穿酋长岩的大墙线路；人工攀登与自由攀登的难度，代表的是截然不同的挑战。"
      },
      whyItStandsOut: {
        en: "Consider it when the scale and history of a route matter as much as any single hard section.",
        zh: "如果你在意一条线路的规模与历史，而不只是一小段的极限难度，它值得进入候选清单。"
      },
      bestForText: {
        en: "Climbers comparing sustained big-wall objectives and willing to plan from current Yosemite resources.",
        zh: "适合正在比较长时间大墙目标，并愿意依照最新优胜美地资料认真规划的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Treat the aid and free grades as separate decision paths rather than interchangeable numbers.",
          zh: "人工攀登与自由攀登的难度应分别理解，不要把它们当作可以直接互换的数字。"
        },
        {
          en: "Use current park and local resources for conditions, access, and operational details.",
          zh: "天气、通行和现场安排请核对公园及当地最新资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", theNose),
        terrain: sourceBacked(["crack", "corner"], theNose),
        movementTendency: editoriallyReviewed(["endurance", "technical"], theNose),
        difficultyShape: editoriallyReviewed("variable", theNose)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("endurance", theNose),
        secondaryDemand: editoriallyReviewed("crack-technique", theNose),
        cruxPattern: editoriallyReviewed("multiple-cruxes", theNose),
        sustainedness: editoriallyReviewed("high", theNose),
        commitment: sourceBacked("high", theNose)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "snake-dike-half-dome",
    sources: [snakeDike],
    editorial: {
      summary: {
        en: "A moderate-grade slab and dike line whose overall day is a much bigger decision than the number 5.7 suggests.",
        zh: "这是一条沿岩脉展开的中等难度板壁线路；整日投入远比“5.7”这个数字更值得认真衡量。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a summit-shaped day and enjoy deliberate movement on lower-angle granite.",
        zh: "当你想要一整天以登顶为主线，也喜欢在低角度花岗岩上耐心移动时，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who value precise feet, balance, and a long objective more than steep pulling.",
        zh: "更适合重视精准脚法、平衡感与完整行程，而不是偏爱陡壁发力的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The route grade does not describe the scale of the full outing.",
          zh: "线路难度并不能完整表达整趟行程的规模。"
        },
        {
          en: "Read current park information before treating it as a first Yosemite multi-pitch choice.",
          zh: "若把它当作第一次优胜美地多段目标，出发前应先查看公园最新信息。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("slab", snakeDike),
        terrain: sourceBacked(["face"], snakeDike),
        movementTendency: editoriallyReviewed(["precise-footwork", "balance"], snakeDike),
        difficultyShape: editoriallyReviewed("variable", snakeDike)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("footwork", snakeDike),
        secondaryDemand: editoriallyReviewed("head-game", snakeDike),
        cruxPattern: editoriallyReviewed("distinct-crux", snakeDike)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "nutcracker-yosemite",
    sources: [nutcracker],
    editorial: {
      summary: {
        en: "A compact multi-pitch introduction to Yosemite granite, with varied traditional terrain rather than one repeated test.",
        zh: "一条篇幅紧凑、地形多变的传统多段线路，比起单一难点，更像是优胜美地花岗岩的入门组合题。"
      },
      whyItStandsOut: {
        en: "Consider it when you want several styles in one moderate outing before choosing a longer Valley objective.",
        zh: "如果你想先在一次中等难度行程里接触多种风格，再决定是否挑战更长线路，它很有参考价值。"
      },
      bestForText: {
        en: "Climbers building breadth in traditional movement and multi-pitch pacing.",
        zh: "适合想拓宽传统攀登动作经验，并练习多段节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A moderate grade does not make every style on the route feel equally familiar.",
          zh: "难度整体适中，不代表线路里的每一种风格都会同样熟悉。"
        },
        {
          en: "Use a current Yosemite guide for route-finding and operational details.",
          zh: "线路辨识与现场安排请使用最新的优胜美地资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", nutcracker),
        terrain: sourceBacked(["crack", "face", "corner"], nutcracker),
        movementTendency: editoriallyReviewed(["technical", "balance"], nutcracker),
        difficultyShape: editoriallyReviewed("variable", nutcracker)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", nutcracker),
        secondaryDemand: editoriallyReviewed("crack-technique", nutcracker),
        cruxPattern: editoriallyReviewed("multiple-cruxes", nutcracker)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "central-pillar-of-frenzy-yosemite",
    sources: [centralPillar],
    editorial: {
      summary: {
        en: "Five commonly climbed pitches that keep returning to cracks, corners, and the rhythm of granite technique.",
        zh: "常见攀登部分为五段，反复考验裂缝、内角与花岗岩技术的节奏。"
      },
      whyItStandsOut: {
        en: "Choose it when you want a focused crack-climbing day without committing to an El Capitan-scale route.",
        zh: "当你想专注练习裂缝，又不想把目标放大到酋长岩级别时，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy linking several crack sizes and maintaining technique across pitches.",
        zh: "适合喜欢连续处理不同尺寸裂缝，并在多段中维持技术稳定的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The experience is more sustained than a single-pitch grade comparison suggests.",
          zh: "它的持续性高于单看某一段难度时的直觉。"
        },
        {
          en: "Check current route and park resources before finalizing the day.",
          zh: "确定行程前，请核对最新线路与公园资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", centralPillar),
        terrain: sourceBacked(["crack", "corner", "chimney"], centralPillar),
        movementTendency: editoriallyReviewed(["technical", "endurance"], centralPillar),
        difficultyShape: sourceBacked("sustained", centralPillar)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("crack-technique", centralPillar),
        secondaryDemand: editoriallyReviewed("endurance", centralPillar),
        cruxPattern: editoriallyReviewed("multiple-cruxes", centralPillar),
        sustainedness: editoriallyReviewed("high", centralPillar)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "east-buttress-middle-cathedral-yosemite",
    sources: [eastButtress],
    editorial: {
      summary: {
        en: "A long Middle Cathedral line with mostly moderate climbing and a smaller number of distinctly harder sections.",
        zh: "一条位于中教堂岩的长线路，以中等难度为主，并穿插少量明显更难的段落。"
      },
      whyItStandsOut: {
        en: "Consider it when you want mileage and route variety, but still want the harder sections to be identifiable in your planning.",
        zh: "如果你想积累多段里程与地形变化，同时希望事先能看清较难段落的位置，它值得比较。"
      },
      bestForText: {
        en: "Climbers drawn to longer moderate terrain with occasional technical steps.",
        zh: "适合喜欢较长中等难度地形，并能接受间歇性技术考验的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The overall grade alone does not show how the easier and harder sections are distributed.",
          zh: "只看总难度，看不出较易与较难段落在全线中的分布。"
        },
        {
          en: "Use current external resources for route-finding and descent information.",
          zh: "线路辨识与下降信息请查看最新外部资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", eastButtress),
        terrain: sourceBacked(["crack", "face", "corner"], eastButtress),
        movementTendency: editoriallyReviewed(["technical", "endurance"], eastButtress),
        difficultyShape: sourceBacked("variable", eastButtress)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", eastButtress),
        secondaryDemand: editoriallyReviewed("endurance", eastButtress),
        cruxPattern: editoriallyReviewed("multiple-cruxes", eastButtress),
        sustainedness: editoriallyReviewed("moderate", eastButtress)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "astroman-washington-column",
    sources: [astroman],
    editorial: {
      summary: {
        en: "A long free-climbing test that combines several distinct crack and corner problems rather than one signature move.",
        zh: "一条长距离自由攀登测试，由多种裂缝与内角难题组成，而不是只靠一个招牌动作定义。"
      },
      whyItStandsOut: {
        en: "Choose it when you want an advanced Yosemite benchmark built from variety, continuity, and precise crack technique.",
        zh: "如果你想比较一条以地形变化、连续性和精细裂缝技术构成的优胜美地进阶标杆，可以看它。"
      },
      bestForText: {
        en: "Climbers who enjoy sustained traditional climbing across contrasting crack systems.",
        zh: "适合喜欢在多种裂缝系统中保持连续传统攀登节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its grade compresses several different technical demands into one number.",
          zh: "一个总难度数字，压缩了多种不同的技术需求。"
        },
        {
          en: "Review current route-specific resources before turning an interest into a plan.",
          zh: "从“感兴趣”进入实际计划前，请查看最新单线路资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("vertical", astroman),
        terrain: sourceBacked(["crack", "corner", "chimney"], astroman),
        movementTendency: editoriallyReviewed(["technical", "endurance"], astroman),
        difficultyShape: editoriallyReviewed("variable", astroman)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("crack-technique", astroman),
        secondaryDemand: editoriallyReviewed("endurance", astroman),
        cruxPattern: editoriallyReviewed("multiple-cruxes", astroman),
        sustainedness: editoriallyReviewed("high", astroman)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "midnight-lightning-camp-4",
    sources: [midnightLightning],
    editorial: {
      summary: {
        en: "A short Camp 4 boulder problem where power and a demanding finish carry equal weight in the decision.",
        zh: "一条位于 Camp 4 的短抱石；爆发力与高要求的收尾，在选择它时同样重要。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a historic boulder benchmark with more than one kind of difficulty.",
        zh: "如果你想体验一条不只考验单一能力的历史性抱石标杆，可以把它列入候选。"
      },
      bestForText: {
        en: "Boulderers who like combining powerful movement with controlled finishing technique.",
        zh: "适合喜欢把爆发动作与受控收尾技术结合起来的抱石者。"
      },
      thingsToConsider: [
        {
          en: "A familiar grade does not guarantee that both halves of the problem suit the same strengths.",
          zh: "即使难度熟悉，线路前后两部分也未必都符合你的优势。"
        },
        {
          en: "Use current local information for conditions and site expectations.",
          zh: "岩况与现场规范请查看最新当地信息。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", midnightLightning),
        terrain: sourceBacked(["face"], midnightLightning),
        movementTendency: sourceBacked(["powerful", "technical", "balance"], midnightLightning),
        difficultyShape: editoriallyReviewed("variable", midnightLightning)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power", midnightLightning),
        secondaryDemand: editoriallyReviewed("technique", midnightLightning),
        cruxPattern: sourceBacked("multiple-cruxes", midnightLightning),
        sustainedness: editoriallyReviewed("moderate", midnightLightning)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "yosemite-usa",
    routeId: "separate-reality",
    sources: [separateReality],
    editorial: {
      summary: {
        en: "A compact roof crack whose short length concentrates the physical demand instead of diluting it.",
        zh: "一条紧凑的屋檐裂缝，长度虽短，却把身体负荷集中在很小的空间里。"
      },
      whyItStandsOut: {
        en: "Choose it when you want an unmistakably steep Yosemite crack rather than a long day of varied terrain.",
        zh: "当你想要的是一条风格鲜明的陡峭优胜美地裂缝，而不是长距离多地形行程时，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy powerful roof movement and managing effort over a short, concentrated line.",
        zh: "适合喜欢屋檐发力，并擅长在短而集中的线路中管理体力的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Short does not mean low-intensity; compare the terrain with your preferences, not only the length.",
          zh: "短并不等于轻松；选择时应比较地形偏好，而不只看长度。"
        },
        {
          en: "Use current route resources for all operational and safety information.",
          zh: "所有现场安排与安全信息请以最新线路资料为准。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("roof", separateReality),
        terrain: sourceBacked(["crack"], separateReality),
        movementTendency: editoriallyReviewed(["powerful", "endurance"], separateReality),
        difficultyShape: editoriallyReviewed("sustained", separateReality)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power-endurance", separateReality),
        secondaryDemand: editoriallyReviewed("crack-technique", separateReality),
        cruxPattern: editoriallyReviewed("sustained", separateReality),
        sustainedness: editoriallyReviewed("high", separateReality)
      }
    }
  })
];
