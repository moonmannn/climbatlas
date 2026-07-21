import {
  defineExperienceSource,
  defineRouteExperience,
  defineRouteReference,
  editoriallyReviewed,
  sourceBacked,
  type RouteExperienceOverlay
} from "@/data/route-experiences/types";

const happyGirlfriend = defineRouteReference({
  label: "Mountain Project: Happy Girlfriend",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/107136770/happy-girlfriend",
  verifiedFields: ["name", "grade", "type", "sector", "terrain", "route-character"]
});

const wingsForLife = defineRouteReference({
  label: "Mountain Project: Wings for Life",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/107867694/wings-for-life",
  verifiedFields: ["name", "grade", "type", "length", "pitches", "route-character"]
});

const wingsForLifeMedia = defineRouteReference({
  label: "PlanetMountain: Wings for Life",
  provider: "climbing-media",
  sourceType: "climbing-media",
  sourceUrl: "https://www.planetmountain.com/en/routes/wings-for-life-telendos.html",
  trustLevel: "high",
  verifiedFields: ["name", "grade", "length", "history", "route-character"]
});

const joggelAndToggel = defineRouteReference({
  label: "Climbapedia: Joggel + Toggel",
  provider: "local-source",
  sourceUrl: "https://climbapedia.org/content/joggel-toggel",
  verifiedFields: ["name", "grade", "type", "length", "sector", "route-character"]
});

const monahikiElia = defineRouteReference({
  label: "Mountain Project: Monahiki Elia",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/106804801/monahiki-elia",
  verifiedFields: ["name", "grade", "type", "length", "sector", "terrain", "route-character"]
});

const monahikiEliaSecond = defineRouteReference({
  label: "theCrag: Monahiki Elia",
  provider: "thecrag",
  sourceUrl: "https://www.thecrag.com/en/climbing/greece/kalymnos/armeos/route/16279663",
  verifiedFields: ["name", "grade", "type", "length", "sector"]
});

const dna = defineRouteReference({
  label: "Mountain Project: DNA",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/106804759/dna",
  verifiedFields: ["name", "grade", "type", "length", "sector", "terrain", "route-character"]
});

const tufaKingPumped = defineRouteReference({
  label: "Mountain Project: Tufa King Pumped",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/107335878/tufa-king-pumped",
  verifiedFields: ["name", "grade", "type", "length", "sector", "terrain", "route-character"]
});

const tufaKingPumpedOfficial = defineRouteReference({
  label: "Climb Kalymnos: Poets and Iannis route list",
  provider: "official-guide",
  sourceType: "official",
  sourceUrl: "https://climbkalymnos.com/view/?crag=Poets",
  trustLevel: "high",
  verifiedFields: ["name", "grade", "length", "sector"]
});

const islandInTheSun = defineRouteReference({
  label: "Mountain Project: Island in the Sun",
  provider: "mountain-project",
  sourceUrl: "https://www.mountainproject.com/route/107942813/island-in-the-sun",
  verifiedFields: ["name", "grade", "type", "length", "sector", "route-character"]
});

const islandInTheSunGuide = defineRouteReference({
  label: "PlanetMountain: Odyssey route list",
  provider: "climbing-media",
  sourceType: "climbing-media",
  sourceUrl: "https://www.planetmountain.com/en/crags/kalymnos-odyssey.html",
  verifiedFields: ["name", "grade", "sector", "guidebook coverage"]
});

const losRevolucionarios = defineRouteReference({
  label: "theCrag: Los Revolutionarios",
  provider: "thecrag",
  sourceUrl: "https://www.thecrag.com/en/climbing/greece/kalymnos/armeos/route/16268269",
  verifiedFields: ["name", "grade", "type", "length", "sector", "history"]
});

const losRevolucionariosHistory = defineExperienceSource({
  provider: "climbing-media",
  label: "Climbing: Kalymnos Rock Climbing Festival 2009 recap",
  sourceUrl: "https://www.climbing.com/news/kalymnos-rock-climbing-festival-2009-event-recap/",
  checkedAt: "2026-07-21",
  sourceType: "climbing-media",
  trustLevel: "medium",
  verifiedFields: ["grade", "length", "history", "route-character"],
  purpose: "history"
});

export const kalymnosRouteExperiences: RouteExperienceOverlay[] = [
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "happy-girlfriend-kalymnos",
    sources: [happyGirlfriend],
    editorial: {
      summary: {
        en: "A shorter Grande Grotta route that pairs lower-angle climbing with tufa features at a comparatively moderate grade.",
        zh: "一条较短的 Grande Grotta 线路，在相对温和的难度中结合较缓岩面与石灰华特征。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a compact introduction to the cave's distinctive features without choosing one of its long endurance projects.",
        zh: "如果你想用较紧凑的目标认识洞穴的典型岩形，又不准备挑战长距离耐力项目，可以考虑它。"
      },
      bestForText: {
        en: "Climbers looking for a moderate-grade style sample and time to concentrate on balance and reading unfamiliar features.",
        zh: "适合想体验中等难度当地风格，并把注意力放在平衡与阅读陌生岩形上的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A moderate grade does not make unfamiliar tufa shapes immediately intuitive.",
          zh: "难度相对温和，并不代表陌生的石灰华岩形会立刻变得直观。"
        },
        {
          en: "Check current local resources before climbing; this profile is not a substitute for route or access information.",
          zh: "攀登前请核对最新当地资料；这里的画像不能替代线路与通行信息。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("slab", happyGirlfriend),
        terrain: sourceBacked(["face", "tufa"], happyGirlfriend),
        movementTendency: editoriallyReviewed(["technical", "balance", "route-reading"], happyGirlfriend),
        difficultyShape: editoriallyReviewed("progressive", happyGirlfriend)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("technique", happyGirlfriend),
        secondaryDemand: editoriallyReviewed("route-reading", happyGirlfriend),
        cruxPattern: editoriallyReviewed("distinct-crux", happyGirlfriend),
        sustainedness: editoriallyReviewed("low", happyGirlfriend)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "wings-for-life-kalymnos",
    sources: [wingsForLife, wingsForLifeMedia],
    editorial: {
      summary: {
        en: "A long Telendos multi-pitch outing whose difficulty varies across the route rather than staying at one intensity.",
        zh: "一条位于 Telendos 的长距离多段线路，难度随线路变化，而不是始终保持同一强度。"
      },
      whyItStandsOut: {
        en: "Choose it when the appeal is a full multi-pitch day and managing a changing route, not simply chasing a hard single pitch.",
        zh: "如果你想要的是完整的多段攀登日，以及应对不断变化的线路，而不只是追逐一条高难单段，可以考虑它。"
      },
      bestForText: {
        en: "Climbers with established multi-pitch systems who value pacing, transitions, and a varied day more than maximum grade.",
        zh: "适合已经熟悉多段系统，并且比极限难度更看重节奏、转换和完整体验的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "Its length and multi-pitch format create a different commitment from a roadside sport route.",
          zh: "它的长度与多段形式，会带来不同于路边运动攀线路的投入。"
        },
        {
          en: "Use a current guide and local information for approach, equipment, descent, weather, and access decisions.",
          zh: "接近、装备、下降、天气与通行决定，请使用最新路书和当地资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", [wingsForLife, wingsForLifeMedia]),
        terrain: editoriallyReviewed(["face", "corner"], [wingsForLife, wingsForLifeMedia]),
        movementTendency: editoriallyReviewed(["technical", "endurance", "route-reading"], [wingsForLife, wingsForLifeMedia]),
        difficultyShape: sourceBacked("variable", [wingsForLife, wingsForLifeMedia])
      },
      challenge: {
        primaryDemand: editoriallyReviewed("route-reading", [wingsForLife, wingsForLifeMedia]),
        secondaryDemand: editoriallyReviewed("endurance", [wingsForLife, wingsForLifeMedia]),
        cruxPattern: editoriallyReviewed("multiple-cruxes", [wingsForLife, wingsForLifeMedia]),
        sustainedness: editoriallyReviewed("moderate", [wingsForLife, wingsForLifeMedia])
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "joggel-and-toggel-kalymnos",
    sources: [joggelAndToggel],
    editorial: {
      summary: {
        en: "A Panorama sport route with a concentrated opening challenge followed by a less uniform difficulty profile.",
        zh: "一条 Panorama 的运动攀线路，开局挑战较集中，之后的难度分布并不完全均匀。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a moderate route that still asks for a decisive response to a distinct challenge.",
        zh: "如果你想找一条难度适中、但仍要求你明确应对集中挑战的线路，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy solving a short power question before settling into steadier climbing.",
        zh: "适合喜欢先解决一个短促力量问题，再进入较稳定攀登节奏的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A concentrated challenge can make the overall grade feel less even than a sustained route.",
          zh: "集中的挑战会让整体难度感受比持续型线路更不均匀。"
        },
        {
          en: "Use the exact route page for current route information rather than treating this profile as beta.",
          zh: "最新线路信息请查看精确线路页，不要把这里的画像当作 beta。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", joggelAndToggel),
        terrain: editoriallyReviewed(["face"], joggelAndToggel),
        movementTendency: editoriallyReviewed(["powerful", "technical"], joggelAndToggel),
        difficultyShape: sourceBacked("single-crux", joggelAndToggel)
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power", joggelAndToggel),
        secondaryDemand: editoriallyReviewed("technique", joggelAndToggel),
        cruxPattern: sourceBacked("distinct-crux", joggelAndToggel),
        sustainedness: editoriallyReviewed("low", joggelAndToggel)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "monahiki-elia-kalymnos",
    sources: [monahikiElia, monahikiEliaSecond],
    editorial: {
      summary: {
        en: "A Grande Grotta line that uses prominent tufa features on a wall that is steeper than its grade alone might suggest.",
        zh: "一条 Grande Grotta 线路，沿明显的石灰华岩形展开，岩壁陡度可能比单看难度数字时更突出。"
      },
      whyItStandsOut: {
        en: "Choose it when you want to compare your movement economy with sustained three-dimensional limestone at a mid-range grade.",
        zh: "如果你想在中等难度上，用持续的立体石灰岩动作检验移动效率，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy using body position and pacing to make steep terrain feel manageable.",
        zh: "适合喜欢通过身体位置与节奏，让陡峭地形变得可管理的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "The route's angle and feature style may feel unfamiliar even if the grade is comfortable indoors.",
          zh: "即使这个难度在室内很舒适，线路角度与岩形也可能依然陌生。"
        },
        {
          en: "Check current local guidance and the linked route references before visiting.",
          zh: "前往前请核对最新当地指引与所列线路来源。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", [monahikiElia, monahikiEliaSecond]),
        terrain: sourceBacked(["tufa", "face"], monahikiElia),
        movementTendency: editoriallyReviewed(["endurance", "stemming", "route-reading"], [monahikiElia, monahikiEliaSecond]),
        difficultyShape: editoriallyReviewed("sustained", [monahikiElia, monahikiEliaSecond])
      },
      challenge: {
        primaryDemand: editoriallyReviewed("endurance", [monahikiElia, monahikiEliaSecond]),
        secondaryDemand: editoriallyReviewed("route-reading", [monahikiElia, monahikiEliaSecond]),
        cruxPattern: editoriallyReviewed("no-single-crux", [monahikiElia, monahikiEliaSecond]),
        sustainedness: editoriallyReviewed("moderate", [monahikiElia, monahikiEliaSecond])
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "dna-kalymnos",
    sources: [dna],
    editorial: {
      summary: {
        en: "A steep Grande Grotta route where individually manageable moves accumulate into a sustained endurance problem.",
        zh: "一条 Grande Grotta 的陡峭线路；单个动作相对可控，但连续累积后形成持续耐力挑战。"
      },
      whyItStandsOut: {
        en: "Consider it when you want to test movement economy and recovery on consistently steep terrain rather than solve one isolated crux.",
        zh: "如果你想在持续陡壁上检验移动效率与恢复能力，而不是只解决一个孤立难点，可以考虑它。"
      },
      bestForText: {
        en: "Sport climbers who like maintaining rhythm and making many reasonable moves add up efficiently.",
        zh: "适合喜欢维持节奏，并把许多可处理动作高效串联起来的运动攀者。"
      },
      thingsToConsider: [
        {
          en: "Large-looking features do not remove the cumulative cost of the route's angle.",
          zh: "看起来较大的岩点，并不会消除岩壁角度带来的累积消耗。"
        },
        {
          en: "The profile describes overall demand only and intentionally omits move-by-move beta.",
          zh: "这里仅描述整体需求，并有意省略逐动作 beta。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", dna),
        terrain: sourceBacked(["tufa", "face"], dna),
        movementTendency: editoriallyReviewed(["endurance", "route-reading"], dna),
        difficultyShape: sourceBacked("sustained", dna)
      },
      challenge: {
        primaryDemand: sourceBacked("endurance", dna),
        secondaryDemand: editoriallyReviewed("route-reading", dna),
        cruxPattern: sourceBacked("no-single-crux", dna),
        sustainedness: sourceBacked("high", dna)
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "island-in-the-sun-kalymnos",
    sources: [islandInTheSun, islandInTheSunGuide],
    editorial: {
      summary: {
        en: "An Odyssey sport route that combines limestone features with a changing demand rather than one uniform style.",
        zh: "一条 Odyssey 的运动攀线路，以石灰岩特征和变化的需求构成，而不是从头到尾只有一种风格。"
      },
      whyItStandsOut: {
        en: "Choose it when you want an advanced single pitch that rewards adapting as the route's character changes.",
        zh: "如果你想找一条需要随线路性格变化而调整的进阶单段线路，可以考虑它。"
      },
      bestForText: {
        en: "Climbers who enjoy balancing technique, route reading, and enough endurance to stay composed through a variable line.",
        zh: "适合喜欢综合技术、线路阅读与耐力，并在变化线路中保持镇定的攀岩者。"
      },
      thingsToConsider: [
        {
          en: "A variable route may expose different strengths than a single-style project at the same grade.",
          zh: "与同难度的单一风格项目相比，变化型线路可能检验完全不同的优势。"
        },
        {
          en: "Use current external resources for route details, conditions, and access information.",
          zh: "线路细节、状态与通行信息，请查看最新外部资料。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("overhang", [islandInTheSun, islandInTheSunGuide]),
        terrain: editoriallyReviewed(["face", "tufa"], [islandInTheSun, islandInTheSunGuide]),
        movementTendency: editoriallyReviewed(["technical", "endurance", "route-reading"], [islandInTheSun, islandInTheSunGuide]),
        difficultyShape: editoriallyReviewed("variable", [islandInTheSun, islandInTheSunGuide])
      },
      challenge: {
        primaryDemand: editoriallyReviewed("route-reading", [islandInTheSun, islandInTheSunGuide]),
        secondaryDemand: editoriallyReviewed("power-endurance", [islandInTheSun, islandInTheSunGuide]),
        cruxPattern: editoriallyReviewed("multiple-cruxes", [islandInTheSun, islandInTheSunGuide]),
        sustainedness: editoriallyReviewed("moderate", [islandInTheSun, islandInTheSunGuide])
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "tufa-king-pumped-kalymnos",
    sources: [tufaKingPumped, tufaKingPumpedOfficial],
    editorial: {
      summary: {
        en: "A steep Iannis route whose tufa terrain links power and endurance into one advanced objective.",
        zh: "一条位于 Iannis 的陡峭线路，在石灰华地形上把力量与耐力连接成一个进阶目标。"
      },
      whyItStandsOut: {
        en: "Consider it when you want a project defined by managing effort across steep terrain, not only by solving a single hard move.",
        zh: "如果你想找一条需要在陡峭地形中管理整体消耗，而不只是解决单个高难动作的项目，可以考虑它。"
      },
      bestForText: {
        en: "Advanced sport climbers who enjoy power-endurance and staying efficient after effort has accumulated.",
        zh: "适合喜欢力量耐力，并能在疲劳累积后继续保持效率的进阶运动攀者。"
      },
      thingsToConsider: [
        {
          en: "The route combines concentrated difficulty with cumulative fatigue, so a familiar grade may not predict how it feels.",
          zh: "线路把集中难度与累积疲劳放在一起，因此熟悉的难度数字未必能预测实际感受。"
        },
        {
          en: "Consult the current local route list and exact route reference before climbing.",
          zh: "攀登前请核对最新当地线路清单与精确线路来源。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: sourceBacked("overhang", tufaKingPumped),
        terrain: sourceBacked(["tufa", "face"], tufaKingPumped),
        movementTendency: editoriallyReviewed(["powerful", "endurance"], [tufaKingPumped, tufaKingPumpedOfficial]),
        difficultyShape: editoriallyReviewed("variable", [tufaKingPumped, tufaKingPumpedOfficial])
      },
      challenge: {
        primaryDemand: editoriallyReviewed("power-endurance", [tufaKingPumped, tufaKingPumpedOfficial]),
        secondaryDemand: editoriallyReviewed("route-reading", [tufaKingPumped, tufaKingPumpedOfficial]),
        cruxPattern: editoriallyReviewed("multiple-cruxes", [tufaKingPumped, tufaKingPumpedOfficial]),
        sustainedness: editoriallyReviewed("high", [tufaKingPumped, tufaKingPumpedOfficial])
      }
    }
  }),
  defineRouteExperience({
    destinationSlug: "kalymnos-greece",
    routeId: "los-revolucionarios-kalymnos",
    sources: [losRevolucionarios, losRevolucionariosHistory],
    editorial: {
      summary: {
        en: "An elite Odyssey reference whose published history describes a short, highly specific power challenge at the top of the island's grade range.",
        zh: "一条 Odyssey 的精英级参考线路；公开记录显示，它以高度特定的力量挑战位于全岛难度光谱顶端。"
      },
      whyItStandsOut: {
        en: "Include it as a benchmark for understanding Kalymnos at its hardest, not as a general recommendation for an ordinary climbing day.",
        zh: "它更适合作为理解卡林诺斯最高难度边界的标杆，而不是普通攀登日的通用推荐。"
      },
      bestForText: {
        en: "Elite climbers comparing long-term projects, and readers interested in a documented milestone in Kalymnos climbing history.",
        zh: "适合比较长期项目的精英攀岩者，也适合关注卡林诺斯有记录历史节点的读者。"
      },
      thingsToConsider: [
        {
          en: "Published accounts describe body-size and conditions as meaningful variables; the grade alone cannot summarize the challenge.",
          zh: "公开记录指出，身材与状态是重要变量；单一难度数字无法概括全部挑战。"
        },
        {
          en: "This profile is a research and preference reference, not a readiness or safety judgment.",
          zh: "这份画像用于研究与偏好比较，不是能力准备度或安全判断。"
        }
      ]
    },
    experience: {
      character: {
        wallAngle: editoriallyReviewed("vertical", [losRevolucionarios, losRevolucionariosHistory]),
        terrain: editoriallyReviewed(["face"], [losRevolucionarios, losRevolucionariosHistory]),
        movementTendency: sourceBacked(["powerful", "technical"], losRevolucionariosHistory),
        difficultyShape: editoriallyReviewed("single-crux", [losRevolucionarios, losRevolucionariosHistory])
      },
      challenge: {
        primaryDemand: sourceBacked("power", losRevolucionariosHistory),
        secondaryDemand: editoriallyReviewed("technique", [losRevolucionarios, losRevolucionariosHistory]),
        cruxPattern: editoriallyReviewed("distinct-crux", [losRevolucionarios, losRevolucionariosHistory]),
        sustainedness: editoriallyReviewed("high", [losRevolucionarios, losRevolucionariosHistory])
      }
    }
  })
];
