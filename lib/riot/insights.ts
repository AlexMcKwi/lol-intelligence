const INSIGHT_TEMPLATES = [
  {
    title: "Suragressivité détectée",
    description: "Votre nombre de morts réduit régulièrement votre impact en milieu de partie.",
    severity: "Medium",
    joke: "L'équipe ennemie apprécie vos donations."
  },
  {
    title: "Faible contrôle de carte",
    description: "Votre contribution à la vision est inférieure à la moyenne pour votre rôle.",
    severity: "High",
    joke: "Votre minimap semble purement décorative."
  },
  {
    title: "Phase de lane faible",
    description: "Vous êtes régulièrement en retard en gold et en expérience avant 15 minutes.",
    severity: "High",
    joke: "À ce stade, votre adversaire de lane devrait vous envoyer une lettre de remerciement."
  },
  {
    title: "Farm inefficace",
    description: "Votre CS par minute est nettement inférieur à celui des joueurs de votre rang.",
    severity: "Medium",
    joke: "Même les sbires canon réussissent à vous échapper."
  },
  {
    title: "Négligence des objectifs",
    description: "Votre participation autour des dragons et des hérauts est trop faible.",
    severity: "High",
    joke: "Vous traitez les objectifs comme des quêtes secondaires optionnelles."
  },
  {
    title: "Rotations trop lentes",
    description: "Vous arrivez souvent en retard aux combats et objectifs importants.",
    severity: "Medium",
    joke: "Vous effectuez vos rotations comme si vous étiez encore en chargement."
  },
  {
    title: "Trop de morts en solo",
    description: "Vous vous faites fréquemment attraper seul avant l'apparition des objectifs majeurs.",
    severity: "High",
    joke: "Votre équipe entend 'Un allié a été tué' plus souvent qu'elle ne regarde le scoreboard."
  },
  {
    title: "Faible efficacité des dégâts",
    description: "Vos revenus en gold ne se traduisent pas par un impact significatif en teamfight.",
    severity: "Medium",
    joke: "Tout ce farm juste pour chatouiller la frontline."
  },
  {
    title: "Mauvais positionnement en teamfight",
    description: "Vous êtes fréquemment éliminé tôt dans les combats coordonnés.",
    severity: "High",
    joke: "Votre positionnement ressemble à un highlight… mais pour l'équipe ennemie."
  },
  {
    title: "Début de partie passif",
    description: "Vous générez très peu de pression durant les 10 premières minutes.",
    severity: "Low",
    joke: "Votre adversaire de lane avait oublié votre existence."
  },
  {
    title: "Faible participation aux kills",
    description: "Vous êtes absent de trop nombreuses actions d'équipe réussies.",
    severity: "Medium",
    joke: "Vos coéquipiers vous voient surtout dans le lobby post-game."
  },
  {
    title: "Scaling mal exploité",
    description: "Votre impact n'augmente pas suffisamment en late game.",
    severity: "Medium",
    joke: "Le late game arrive… et vous toujours pas."
  },
  {
    title: "Trop d'erreurs non forcées",
    description: "Des erreurs mécaniques créent des désavantages évitables.",
    severity: "High",
    joke: "Votre clavier envisage de porter plainte pour maltraitance."
  },
  {
    title: "Préparation d'objectifs insuffisante",
    description: "Votre équipe contrôle rarement la vision avant les combats neutres importants.",
    severity: "High",
    joke: "Vos setups Baron ressemblent à des fêtes surprises pour l'équipe ennemie."
  },
  {
    title: "Manque de pression sur les tours",
    description: "Vous convertissez rarement vos kills en dégâts sur les tourelles.",
    severity: "Medium",
    joke: "Les tourelles sont plus en sécurité avec vous qu'à la fontaine."
  },
  {
    title: "Placement de wards risqué",
    description: "Vous mourez souvent en essayant d'établir de la vision.",
    severity: "Medium",
    joke: "Vous wardez comme un personnage secondaire dans un film d'horreur."
  },
  {
    title: "Faible awareness de la jungle",
    description: "Vous êtes fréquemment puni par la pression du jungler adverse.",
    severity: "High",
    joke: "Les junglers ennemis considèrent votre lane comme un bien immobilier gratuit."
  }
]

export function analyzeMatchPerformance(match: any, puuid: string) {
  const participant = match.info.participants.find(
    (p: any) => p.puuid === puuid
  )

  if (!participant) {
    throw new Error("Participant not found in match")
  }

  const insights: any[] = []
  const gameDuration = match.info.gameDuration / 60

  // Calculate team averages
  const avgVisionScore = match.info.participants.reduce(
    (sum: number, p: any) => sum + (p.visionScore || 0),
    0
  ) / match.info.participants.length

  const avgDamage = match.info.participants.reduce(
    (sum: number, p: any) => sum + (p.totalDamageDealtToChampions || 0),
    0
  ) / match.info.participants.length

  const avgKills = match.info.participants.reduce(
    (sum: number, p: any) => sum + (p.kills || 0),
    0
  ) / match.info.participants.length

  // 1. Suragressivité détectée - Trop de morts
  if (participant.deaths > 5) {
    insights.push({
      ...INSIGHT_TEMPLATES[0],
      type: "warning",
      body: `${participant.deaths} morts en ${Math.round(gameDuration)} minutes. Cela réduit ton impact.`
    })
  }

  // 2. Faible contrôle de carte - Vision score bas
  if (participant.visionScore < avgVisionScore * 0.6) {
    insights.push({
      ...INSIGHT_TEMPLATES[1],
      type: "warning",
      body: `Vision score: ${participant.visionScore} vs moyenne ${Math.round(avgVisionScore)}.`
    })
  }

  // 3. Phase de lane faible - Gold retard à 15 min
  const goldPerMin15 = participant.challenges?.goldPerMinute || 0
  if (goldPerMin15 < 300 && gameDuration > 15) {
    insights.push({
      ...INSIGHT_TEMPLATES[2],
      type: "warning",
      body: `Gold/min au début: ${Math.round(goldPerMin15)}. Tu étais en retard de ressources.`
    })
  }

  // 4. Farm inefficace - CS/min faible
  const csPerMinute = participant.totalMinionsKilled / gameDuration
  if (csPerMinute < 4 && participant.teamPosition !== "UTILITY") {
    insights.push({
      ...INSIGHT_TEMPLATES[3],
      type: "warning",
      body: `${csPerMinute.toFixed(1)} CS/min - nettement en retard.`
    })
  }

  // 5. Négligence des objectifs - Peu de kills objectif
  const objectiveKills = participant.challenges?.killsNearEnemyTurret || 0
  if (objectiveKills < 2 && !participant.win && gameDuration > 25) {
    insights.push({
      ...INSIGHT_TEMPLATES[4],
      type: "warning",
      body: `Peu de kills près des objectifs. Tu ne convertissais pas ta pression.`
    })
  }

  // 6. Rotations trop lentes - Kill participation faible
  const killParticipation = participant.kills + participant.assists > 0 
    ? ((participant.kills + participant.assists) / (match.info.teams[0].objectives.champion.kills + match.info.teams[1].objectives.champion.kills)) * 100 
    : 0
  if (killParticipation < 40 && gameDuration > 20) {
    insights.push({
      ...INSIGHT_TEMPLATES[5],
      type: "warning",
      body: `Participation kills: ${killParticipation.toFixed(0)}%. Tu arrivais tard aux combats.`
    })
  }

  // 7. Trop de morts en solo - Deaths élevées
  if (participant.deaths > 6 && gameDuration > 25) {
    insights.push({
      ...INSIGHT_TEMPLATES[6],
      type: "warning",
      body: `${participant.deaths} morts. Tu te faisais attraper trop souvent seul.`
    })
  }

  // 8. Faible efficacité des dégâts - Beaucoup de gold mais peu de dégâts
  const goldEfficiency = participant.totalDamageDealtToChampions / (participant.goldEarned || 1)
  if (goldEfficiency < avgDamage / 5000 && participant.goldEarned > 10000) {
    insights.push({
      ...INSIGHT_TEMPLATES[7],
      type: "warning",
      body: `Dégâts: ${Math.round(participant.totalDamageDealtToChampions / 1000)}k pour ${Math.round(participant.goldEarned / 1000)}k gold.`
    })
  }

  // 9. Mauvais positionnement en teamfight - Morts tôt dans les combats
  if (participant.deaths > 4 ) {
    insights.push({
      ...INSIGHT_TEMPLATES[8],
      type: "warning",
      body: `Tu étais éliminé trop rapidement dans les combats d'équipe.`
    })
  }

  // 10. Début de partie passif - Peu de kills early
  const earlyGameKills = participant.kills
  if (earlyGameKills < 1 && gameDuration < 20 && gameDuration > 10) {
    insights.push({
      ...INSIGHT_TEMPLATES[9],
      type: "warning",
      body: `Très peu de kills générés dans les 15 premières minutes.`
    })
  }

  // 11. Faible participation aux kills
  if ((participant.kills + participant.assists) < avgKills * 1.5) {
    insights.push({
      ...INSIGHT_TEMPLATES[10],
      type: "warning",
      body: `${participant.kills + participant.assists} kills+assists. Tu n'étais pas assez impliqué.`
    })
  }

  // 12. Scaling mal exploité - Late game faible avec items
  if (participant.goldEarned > 15000 && participant.totalDamageDealtToChampions < avgDamage * 1.2 && gameDuration > 30 && participant.teamPosition !== "UTILITY") {
    insights.push({
      ...INSIGHT_TEMPLATES[11],
      type: "warning",
      body: `Malgré beaucoup d'items, tu ne posais pas assez de dégâts en late game.`
    })
  }

  // 13. Trop d'erreurs non forcées - Morts non évitables
  if (participant.deaths > 5 && !participant.win) {
    insights.push({
      ...INSIGHT_TEMPLATES[12],
      type: "warning",
      body: `${participant.deaths} morts - beaucoup semblaient évitables.`
    })
  }

  // 14. Préparation d'objectifs insuffisante - Pas de vision avant objectif
  if (participant.visionScore < 5 && participant.teamPosition !== "UTILITY") {
    insights.push({
      ...INSIGHT_TEMPLATES[13],
      type: "warning",
      body: `Tu ne plaçais presque pas de wards pour sécuriser les objectifs.`
    })
  }

  // 15. Manque de pression sur les tours - Pas de dégâts aux tourelles
  const towerKills = participant.challenges?.turretKills || 0
  if (towerKills === 0 && gameDuration > 25) {
    insights.push({
      ...INSIGHT_TEMPLATES[14],
      type: "warning",
      body: `Aucune tourelle cassée malgré une longue partie.`
    })
  }

  // 16. Placement de wards risqué - Morts avec peu de kills
  if (participant.deaths > 3 && participant.kills + participant.assists < 5) {
    insights.push({
      ...INSIGHT_TEMPLATES[15],
      type: "warning",
      body: `${participant.deaths} morts pour seulement ${participant.kills + participant.assists} kills+assists.`
    })
  }

  // 17. Faible awareness de la jungle - Deaths jungle
  if (participant.deaths > 4 && !participant.win) {
    insights.push({
      ...INSIGHT_TEMPLATES[16],
      type: "warning",
      body: `Tu ne voyais pas arriver les menaces de la jungle adverse.`
    })
  }

  return insights
}

export function getMatchSummary(match: any, puuid: string) {
  const participant = match.info.participants.find(
    (p: any) => p.puuid === puuid
  )

  if (!participant) {
    throw new Error("Participant not found in match")
  }

  const gameDuration = Math.floor(match.info.gameDuration / 60)
  const gameDurationSec = match.info.gameDuration % 60

  // Determine main performance
  const kda = participant.deaths === 0 
    ? participant.kills + participant.assists
    : (participant.kills + participant.assists) / participant.deaths

  let performance = ""
  if (participant.win) {
    if (kda >= 5) {
      performance = "Victoire dominante avec un excellent KDA"
    } else {
      performance = "Victoire avec une bonne contribution"
    }
  } else {
    if (kda >= 3) {
      performance = "Défaite mais avec une bonne performance personnelle"
    } else {
      performance = "Défaite avec peu d'impact sur le jeu"
    }
  }

  return {
    result: participant.win ? "Victoire" : "Défaite",
    champion: participant.championName,
    role: participant.teamPosition,
    duration: `${gameDuration}m${gameDurationSec}s`,
    kda: `${participant.kills}/${participant.deaths}/${participant.assists}`,
    cs: participant.totalMinionsKilled,
    csPerMin: (participant.totalMinionsKilled / (match.info.gameDuration / 60)).toFixed(1),
    gold: Math.round(participant.goldEarned / 1000) + "k",
    damage: Math.round(participant.totalDamageDealtToChampions / 1000) + "k",
    visionScore: participant.visionScore,
    performance
  }
}

export function getMainInsightJoke(match: any, puuid: string): string {
  const insights = analyzeMatchPerformance(match, puuid)
  
  if (insights.length > 0) {
    return insights[0].joke || "Bonne partie!"
  }
  
  // Si aucun insight négatif, retourner une blague positive
  const participant = match.info.participants.find(
    (p: any) => p.puuid === puuid
  )
  
  if (participant?.win) {
    return "Victoire méritée! ✓"
  }
  
  return "Prochaine fois sera meilleure!"
}

/**
 * Adapte une joke existante au contexte du match spécifique en utilisant OpenAI
 * Génère une variante amusante basée sur les stats du joueur
 */
export async function adaptJokeWithContext(
  originalJoke: string,
  match: any,
  puuid: string,
  insightType: string
): Promise<string> {
  const OpenAI = (await import("openai")).default
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const participant = match.info.participants.find(
    (p: any) => p.puuid === puuid
  )

  if (!participant) {
    return originalJoke
  }

  const gameDuration = Math.floor(match.info.gameDuration / 60)
  const csPerMin = participant.totalMinionsKilled / (match.info.gameDuration / 60)

  const prompt = `Tu es un coach League of Legends qui fait des blagues amusantes et sarcastiques pour aider les joueurs à s'améliorer.

Crée une variante NOUVELLE et DIFFÉRENTE de cette blague basée sur les stats du joueur:
Blague originale: "${originalJoke}"

Stats du match:
- Champion: ${participant.championName}
- KDA: ${participant.kills}/${participant.deaths}/${participant.assists}
- CS/min: ${csPerMin.toFixed(1)}
- Gold: ${Math.round(participant.goldEarned / 1000)}k
- Dégâts: ${Math.round(participant.totalDamageDealtToChampions / 1000)}k
- Durée: ${gameDuration}min
- Type d'insight: ${insightType}
- Résultat: ${participant.win ? "Victoire" : "Défaite"}

Règles:
1. La blague doit être DRÔLE et SARCASTIQUE
2. Doit être en français
3. Doit respecter les stats spécifiques du match
4. Doit être courte (1-2 phrases max)
5. Évite de répéter la blague originale exactement

Retourne UNIQUEMENT la blague adaptée, rien d'autre.`

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 100
  })

  const adaptedJoke = response.choices[0].message.content?.trim() || originalJoke
  return adaptedJoke
}

/**
 * Traite un ensemble d'insights de plusieurs matches et adapte les jokes dupliquées
 * Détecte quand la même joke se répète et la customise pour chaque match
 */
export async function deduplicateAndAdaptJokes(
  matchesWithInsights: Array<{ match: any; insights: any[]; puuid: string }>
): Promise<Array<{ match: any; insights: any[]; puuid: string }>> {
  // Créer une map pour tracker les jokes par contenu
  const jokeFrequency = new Map<string, Array<number>>()
  const allInsights: any[] = []

  // Compter les occurrences de chaque joke
  matchesWithInsights.forEach((item, matchIndex) => {
    item.insights.forEach((insight) => {
      if (insight.joke) {
        allInsights.push({
          joke: insight.joke,
          matchIndex,
          insightIndex: item.insights.indexOf(insight),
          insight
        })

        if (!jokeFrequency.has(insight.joke)) {
          jokeFrequency.set(insight.joke, [])
        }
        jokeFrequency.get(insight.joke)!.push(matchIndex)
      }
    })
  })

  // Identifier les jokes qui se répètent (au moins 2 fois)
  const duplicatedJokes = Array.from(jokeFrequency.entries())
    .filter(([, matches]) => matches.length >= 2)
    .map(([joke]) => joke)

  // Si aucune duplication, retourner tel quel
  if (duplicatedJokes.length === 0) {
    return matchesWithInsights
  }

  // Pour chaque joke dupliquée, adapter les occurrences (sauf la première)
  const result = structuredClone(matchesWithInsights)

  for (const duplicatedJoke of duplicatedJokes) {
    const matchIndices = jokeFrequency.get(duplicatedJoke)!
    
    // Adapter les occurrences à partir de la deuxième (index 1+)
    for (let i = 1; i < matchIndices.length; i++) {
      const matchIndex = matchIndices[i]
      const matchItem = result[matchIndex]
      const insightWithDupJoke = matchItem.insights.find(
        (insight) => insight.joke === duplicatedJoke
      )

      if (insightWithDupJoke) {
        try {
          console.log(
            `Adaptant joke dupliquée pour match ${matchIndex}: "${duplicatedJoke}"`
          )
          
          const adaptedJoke = await adaptJokeWithContext(
            duplicatedJoke,
            matchItem.match,
            matchItem.puuid,
            insightWithDupJoke.title || "performance"
          )

          insightWithDupJoke.joke = adaptedJoke
          insightWithDupJoke.isAdapted = true
        } catch (error) {
          console.error(`Erreur lors de l'adaptation de la joke: ${error}`)
          // Garder la joke originale en cas d'erreur
        }
      }
    }
  }

  return result
}
