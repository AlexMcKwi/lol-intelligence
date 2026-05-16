import { prisma } from "@/lib/prisma"
import { generateInsights } from "@/lib/insights/engine"
import { analyzeMatchPerformance, deduplicateAndAdaptJokes } from "@/lib/riot/insights"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")!

  const matchParticipants = await prisma.matchParticipant.findMany({
    where: {
      summoner: {
        userId
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 20,
    include: {
      match: true
    }
  })

  // Générer les insights pour chaque match
  const matchesWithInsights = matchParticipants.map((mp) => ({
    match: mp.match,
    insights: analyzeMatchPerformance(mp.match, mp.puuid),
    puuid: mp.puuid
  }))

  // Adapter les jokes dupliquées via OpenAI
  const adaptedMatches = await deduplicateAndAdaptJokes(matchesWithInsights)

  // Extraire les insights finaux
  const allInsights = adaptedMatches.flatMap((item) => item.insights)

  // Générer les insights agrégés (au niveau du joueur)
  const aggregatedInsights = generateInsights(matchParticipants)

  return NextResponse.json({
    matchInsights: allInsights,
    aggregatedInsights
  })
}