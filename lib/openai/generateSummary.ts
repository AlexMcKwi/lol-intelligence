import OpenAI from "openai"

declare const process: { env: { OPENAI_API_KEY?: string } }

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generatePostGameSummary(data: any) {
  const prompt = `
  Analyze this League of Legends performance.

  Champion: ${data.championName}
  KDA: ${data.kills}/${data.deaths}/${data.assists}
  Vision: ${data.visionScore}
  Result: ${data.win ? "Win" : "Loss"}

  Generate:
  - one positive point
  - one critical mistake
  - one improvement recommendation
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  })

  return response.choices[0].message.content
}

/**
 * Génère une histoire rigolote résumant la performance du joueur
 * basée sur tous les insights et les jokes collectées
 */
export async function generateFunnyPerformanceStory(insightsData: any) {
  const matchInsights = insightsData.matchInsights || []
  const aggregatedInsights = insightsData.aggregatedInsights || []

  // Collecter les jokes avec contexte
  const jokesWithContext = matchInsights
    .filter((insight: any) => insight.joke)
    .map((insight: any) => ({
      joke: insight.joke,
      title: insight.title,
      isAdapted: insight.isAdapted,
      severity: insight.severity
    }))

  // Calculer les stats globales
  const totalMatches = matchInsights.length
  const wins = matchInsights.filter((m: any) => m.win).length
  const losses = totalMatches - wins
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0

  // Identifier les patterns récurrents
  const recurringIssues = aggregatedInsights
    .slice(0, 3)
    .map((insight: any) => insight.title || insight.description)
    .filter(Boolean)

  // Créer une liste de blagues formatées pour le prompt
  const jokesText = jokesWithContext
    .slice(0, 15) // Limiter à 15 blagues pour pas surcharger le prompt
    .map((j: any, idx: number) => `${idx + 1}. "${j.joke}" (${j.title})`)
    .join("\n")

  // Identifier les blagues adaptées (IA)
  const adaptedCount = jokesWithContext.filter((j: any) => j.isAdapted).length
  const uniqueJokes = new Set(jokesWithContext.map((j: any) => j.joke.toLowerCase().trim()))

  const prompt = `Tu es un narrateur humoristique pour un joueur de League of Legends. 
Ton objectif: créer une histoire ÉPIQUE, DRÔLE et SARCASTIQUE basée sur la performance du joueur.

📊 DONNÉES DE PERFORMANCE:
- Matches analysés: ${totalMatches}
- Victoires: ${wins} (Taux: ${winRate}%)
- Défaites: ${losses}
- Blagues collectées: ${jokesWithContext.length} (${uniqueJokes.size} uniques)
- Blagues adaptées par IA: ${adaptedCount}

🎭 PROBLÈMES RÉCURRENTS:
${recurringIssues.map((issue: any) => `- ${issue}`).join("\n") || "- Quelques défauts mineurs"}

💬 BLAGUES CLÉS À INTÉGRER:
${jokesText}

📝 INSTRUCTIONS POUR L'HISTOIRE:
1. **Structure**: Introduction épique → Corps avec blagues intégrées → Conclusion humoristique
2. **Ton**: Très sarcastique, comme un commentateur esport ironique
3. **Blagues**: Cite directement 5-8 des blagues listées dans l'histoire
4. **Longueur**: 4-5 paragraphes (pas plus)
5. **Langue**: Français, avec style dramatique sportif
6. **Finale**: Terminer par une "prophétie" ou "conseil" humoristique pour s'améliorer
7. **Personnalité**: Fais comme si tu commente une série Netflix dramatique sur ce joueur

IMPORTANT: 
- Fais référence EXPLICITEMENT aux blagues (pas juste les thèmes)
- Crée une narration COHÉRENTE qui relie les problèmes
- Sois DRÔLE mais pas méchant
- Utilise des métaphores League of Legends
- Varie le ton entre dramatique, ironique et absurde

Génère UNIQUEMENT l'histoire, sans intro, sans outro, sans liste.`

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.85,
    max_tokens: 800
  })

  return response.choices[0].message.content
}