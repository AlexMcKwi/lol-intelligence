import { prisma } from "./lib/prisma.js"
import { analyzeMatchPerformance, deduplicateAndAdaptJokes } from "./lib/riot/insights.js"

async function debugJokes() {
  try {
    // Récupérer le joueur Ticopy
    const summoner = await prisma.summoner.findFirst({
      where: {
        gameName: 'Ticopy',
        tagLine: 'Story',
      },
    })

    if (!summoner) {
      console.log('Joueur non trouvé')
      return
    }

    console.log(`\n🔍 Analysant le joueur: ${summoner.gameName}#${summoner.tagLine}\n`)

    // Récupérer les 20 derniers matchs
    const matchParticipants = await prisma.matchParticipant.findMany({
      where: {
        summonerId: summoner.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      include: {
        match: true,
      },
    })

    console.log(`📊 Total de matchs: ${matchParticipants.length}\n`)

    // Générer les insights pour chaque match
    const matchesWithInsights = matchParticipants.map((mp) => ({
      match: mp.match,
      insights: analyzeMatchPerformance(mp.match, mp.puuid),
      puuid: mp.puuid,
    }))

    // Analyser les doublons AVANT déduplication
    console.log('📋 AVANT DÉDUPLICATION:\n')
    const jokeCountBefore = new Map<string, number>()
    matchesWithInsights.forEach((item) => {
      item.insights.forEach((insight) => {
        if (insight.joke) {
          jokeCountBefore.set(insight.joke, (jokeCountBefore.get(insight.joke) || 0) + 1)
        }
      })
    })

    const sortedJokesBefore = Array.from(jokeCountBefore.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    console.log('Top 10 des blagues les plus fréquentes:')
    sortedJokesBefore.forEach(([joke, count], idx) => {
      console.log(`${idx + 1}. [${count}x] "${joke}"`)
    })

    // Adapter les jokes dupliquées via OpenAI
    console.log('\n⏳ Adaptation des jokes dupliquées...')
    const adaptedMatches = await deduplicateAndAdaptJokes(matchesWithInsights)

    // Analyser les doublons APRÈS déduplication
    console.log('\n📋 APRÈS DÉDUPLICATION:\n')
    const jokeCountAfter = new Map<string, number>()
    const adaptedCountAfter = new Map<string, number>()
    
    adaptedMatches.forEach((item) => {
      item.insights.forEach((insight) => {
        if (insight.joke) {
          jokeCountAfter.set(insight.joke, (jokeCountAfter.get(insight.joke) || 0) + 1)
          if (insight.isAdapted) {
            adaptedCountAfter.set(insight.joke, (adaptedCountAfter.get(insight.joke) || 0) + 1)
          }
        }
      })
    })

    const sortedJokesAfter = Array.from(jokeCountAfter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    console.log('Top 10 des blagues les plus fréquentes:')
    sortedJokesAfter.forEach(([joke, count], idx) => {
      const adapted = adaptedCountAfter.get(joke) || 0
      console.log(`${idx + 1}. [${count}x] "${joke}" ${adapted > 0 ? `(${adapted} adaptées ✨)` : ''}`)
    })

    // Statistiques
    console.log('\n📊 STATISTIQUES:')
    console.log(`Total blagues AVANT: ${jokeCountBefore.size} uniques`)
    console.log(`Total blagues APRÈS: ${jokeCountAfter.size} uniques`)
    console.log(`Blagues adaptées: ${Array.from(adaptedCountAfter.values()).reduce((a, b) => a + b, 0)}`)

    // Détailler les joques qui restent dupliquées après déduplication
    console.log('\n⚠️ BLAGUES RESTANT DUPLIQUÉES (2+ occurrences):')
    const duplicatedAfter = sortedJokesAfter.filter(([, count]) => count >= 2)
    if (duplicatedAfter.length === 0) {
      console.log('✅ Aucune duplication! Toutes les blagues ont été traitées.')
    } else {
      duplicatedAfter.forEach(([joke, count]) => {
        const adapted = adaptedCountAfter.get(joke) || 0
        console.log(
          `- [${count}x] "${joke}" (${adapted} adaptées, ${count - adapted} originales)`
        )
      })
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugJokes()
